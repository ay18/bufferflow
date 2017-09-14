import * as THREE from 'three';
import TweenMax from 'gsap';
import SEObject from './SEObject';
import Stats from './Stats';
import { attachKeyboardHandlers } from './Keyboard';
import { byTag } from './Selects';
import { randRange, arrayToObj } from './Util';

const MIN_RENDERER_HEIGHT = 800;

class Visualization {
  
  constructor({ fetchData }) {
    
    // CALLBACKS
    this.fetchData = fetchData;
    
    // METHOD BINDINGS
    this.render = this.render.bind(this);
    this.animate = this.animate.bind(this);
    this.search = this.search.bind(this);
    this._enableAutoResize = this._enableAutoResize.bind(this);
    this._attachMouseHandlers = this._attachMouseHandlers.bind(this);
    
    // DATA STRUCTURES
    this.SEObjBuffer = [];
    this.renderedSEObjs = {};
    this.stashedSEObjs = {};
    window.stashedSEObjs = this.stashedSEObjs;
    
    // MODULES
    this.stats = new Stats(this);
    attachKeyboardHandlers.call(this);
    
    // ELEMENTS
    this._createScene();      // scene
    this._createRenderer();   // renderer
    this._createCamera();     // camera
    this._createLight();      // light
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersected = null;  // intersected SEObject

    // EVENT HANDLERS
    this._enableAutoResize();
    this._attachMouseHandlers();
    TweenMax.ticker.addEventListener("tick", this.render);
    
    // QUEUED ACTIONS
    this._renderFromBuffer();
    this.animate();
    this.fetchData();
  }
  
  load({ questions, questionDetails, acceptedAnswers }) {
    const qids = Object.keys(questions);
    qids.map( qid => {
      const question = questions[qid];
      question.tags = arrayToObj(question.tags);
      const questionDetail = questionDetails[qid];
      const acceptedAnswer = acceptedAnswers[questionDetail.accepted_answer_id];
      const SEData = {
        question,
        questionDetail,
        acceptedAnswer,
      };
      const SEObj = new SEObject(SEData, this);
      this.SEObjBuffer.push(SEObj);
    });
    // this.stats.upFetchedCount(qids.length);
    console.log(this.SEObjBuffer);
  }
  
  render() {
    this._checkIntersection();
    this.renderer.render( this.scene, this.camera );
  }
  
  animate() { // animate loop, responsible for animating all meshes.
    Object.values(this.renderedSEObjs).map( SEObj => {
      SEObj.animate();
      this.stats.displayInfo(SEObj);
    });
    requestAnimationFrame(this.animate);
    this.render();
  }
  
  cleanUp(mesh) {
    // remove references for memory management
    const { scene, renderedSEObjs, stats } = this;
    mesh.parent.remove(mesh);
    scene.remove(mesh);
    // mesh.material.dispose();
    // mesh.geometry.dispose();
    stash.call(this, mesh.uuid);
    delete renderedSEObjs[mesh.uuid];
    
    stats.closeInfo(mesh.uuid);
  }
  
  search(str) {
    const SEObjs = byTag.call(this, str);
  }
  
  _minRenderHeight() {
    return MIN_RENDERER_HEIGHT > window.innerHeight ? MIN_RENDERER_HEIGHT : window.innerHeight;
  }
  
  // THREE ELEMENT CREATORS
  _createRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, this._minRenderHeight());
    document.body.appendChild(this.renderer.domElement);
  }
  
  _createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / this._minRenderHeight(), 0.1, 10);
    this.camera.position.set(0, 0, 1);
    // this.camera.position.set(0, 0, 5);  // DEBUG
  }
  
  _createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xf0f0f0 );
    window.scene = this.scene;
  }
  
  _createLight() {
    this.light = new THREE.PointLight( 0xffffff, 1, 100 );
    this.light.position.set( 0, 1.2, 0 );
		// this.light.position.set( 0.5, 0.5, 0.5 ).normalize();
		this.scene.add( this.light );
  }
  
  // EVENT HANDLERS
  _enableAutoResize() {
    window.addEventListener('resize', e => {
        this.camera.aspect = window.innerWidth / this._minRenderHeight();
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, this._minRenderHeight() );
    }, false);  
  }
  
  _attachMouseHandlers() {
    
    document.addEventListener('mousemove', e => {
      e.preventDefault();
      this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( e.clientY / this._minRenderHeight() ) * 2 + 1;
    });
    
    document.addEventListener('mousedown', e => {
      const info = e.path.filter( p => p.id && p.id.includes('info') )[0];
      if (!this.intersected && !info) return;
      if (e.shiftKey) {
      } else if (this.intersected) {
        // show question info, create a div that follows.
        this.intersected.toggleMoving();
        this.intersected.toggleDisplayInfo();
      } else if (info) {
        // clicked on info
        const SEObj = this.renderedSEObjs[info.id.replace('info-', '')];
        SEObj.toggleMoving();
        SEObj.toggleDisplayInfo();
      }
    });
    
  }
  
  _checkIntersection() {
    this.raycaster.setFromCamera( this.mouse, this.camera );
    const intersects = this.raycaster.intersectObjects( this.scene.children );
    if ( intersects.length > 0 ) {
      const frontObj = intersects[0].object;
      const SEObj = this.renderedSEObjs[frontObj.uuid];
      if ( this.intersected !== SEObj ) {
        if ( this.intersected ) {    // current intersected isn't front object
          this.intersected.illuminate( false );
        }
        this.intersected = SEObj;    // update front object.
        this.intersected.illuminate( true );
      }
    } else {
      if ( this.intersected ) {      // no longer intersecting
        this.intersected.illuminate( false );
      }
      this.intersected = null;
    }
  }
  
  _renderFromBuffer() {
    window.setTimeout( () => {
      if (this.SEObjBuffer.length > 0) {
        const SEObj = this.SEObjBuffer.shift();
        this.scene.add(SEObj.mesh);
        this.stats.rendered(SEObj);
        this.renderedSEObjs[SEObj.id] = SEObj;
      } else {
        this.fetchData();
      }
      this._renderFromBuffer();
    }, randRange(0.5, 1.5) * 2000);
  }
  
}

export default Visualization;

function stash(uuid) {
  this.stashedSEObjs[uuid] = this.renderedSEObjs[uuid];
}

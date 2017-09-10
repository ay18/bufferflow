import * as THREE from 'three';
import TweenMax from 'gsap';
import { randRange } from './Util';
import SEObject from './SEObject';
window.THREE = THREE; // DEBUG

import StatsHelper from './StatsHelper';

const PL_COLORS = {
  js: 0xF5DA55,
  ruby: 0xC52F24,
  
};

const MIN_RENDERER_HEIGHT = 800;

class Visualization {
  
  constructor() {
    
    // METHOD BINDINGS
    this.render = this.render.bind(this);
    this.animate = this.animate.bind(this);
    this._enableAutoResize = this._enableAutoResize.bind(this);
    this._attachMouseHandler = this._attachMouseHandler.bind(this);
    
    // BUFFERS
    this.SEObjBuffer = [];
    this.renderedSEObjs = {};
    
    // STATS
    this.st = new StatsHelper(this);
    
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
    this._attachMouseHandler();
    TweenMax.ticker.addEventListener("tick", this.render);
    
    // QUEUED ACTIONS
    this._renderFromBuffer();
    this.animate();
    
  }
  
  load({ questions, questionDetails, acceptedAnswers }) {
    Object.keys(questions).map( qid => {
      const question = questions[qid];
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
    console.log(this.SEObjBuffer);
  }
  
  render() {
    this._checkIntersection();
    this.renderer.render( this.scene, this.camera );
  }
  
  animate() { // animate loop, responsible for animating other meshes.
    Object.values(this.renderedSEObjs).map( SEObj => {
      SEObj.animate();
    });
    requestAnimationFrame(this.animate);
    this.render();
  }
  
  cleanUp(mesh) { // cleanUp meshes off the screen
    mesh.parent.remove(mesh);
    this.scene.remove(mesh);
    mesh.material.dispose();
    mesh.geometry.dispose();
    delete this.renderedSEObjs[mesh.uuid];
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
    // this.camera.position.set(0, 0, 5);  // DEBUG ZOOM
  }
  
  _createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xf0f0f0 );
    // this.scene.background = new THREE.Color( 0x0f0f0f ); // night mode
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
  
  _attachMouseHandler() {
    document.addEventListener('mousemove', e => {
      e.preventDefault();
      this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( e.clientY / this._minRenderHeight() ) * 2 + 1;
    });
  }
  
  _cubeDraggable() {
    // const this = this;
    
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
        // SEObj.applyMovement();
        this.renderedSEObjs[SEObj.id] = SEObj;
      }
      this._renderFromBuffer();
    }, randRange(0.5, 1.5) * 2000);
  }
    
}

export default Visualization;


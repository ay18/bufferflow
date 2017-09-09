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
    this._handleRemoveCube = this._handleRemoveCube.bind(this);
    this._renderSEObj = this._renderSEObj.bind(this);
    this._enableAutoResize = this._enableAutoResize.bind(this);
    this._attachMouseHandler = this._attachMouseHandler.bind(this);
    
    // BUFFERS
    this.SEObjBuffer = [];
    
    // STATS
    this.st = new StatsHelper(this);
    
    // ELEMENTS
    this._createScene();      // scene
    this._createRenderer();   // renderer
    this._createCamera();     // camera
    this._createLight();      // light
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.intersected = null;  // intersected object

    // EVENT HANDLERS
    this._enableAutoResize();
    this._attachMouseHandler();
    TweenMax.ticker.addEventListener("tick", this.render);
    
    // QUEUED ACTIONS
    this._renderFromBuffer();
    
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
  
  // THREE OBJECT CREATORS
  
  // _enqueueCube(cube, data) {
  //   this.cubeBuffer.push(cube);
  //   this.cubeData[cube.uuid] = data;
  // }
  
  // animate() {
  // 	requestAnimationFrame( this.animate );
  //   this.cubes.forEach( cube => {
  //     cube.position.setX(cube.position.x - 0.003);
  //     cube.position.setY(cube.position.y - 0.003);
  //     cube.position.setZ(cube.position.z + 0.003);
  //   });
  //   this.renderer.render( this.scene, this.camera );
  // }
  
  render() {
    this._checkIntersection();
    this.renderer.render( this.scene, this.camera );
  }
  
  _minRenderHeight() {
    return MIN_RENDERER_HEIGHT > window.innerHeight ? MIN_RENDERER_HEIGHT : window.innerHeight;
  }
  // _tick() {
  //   this.t += 1;
  //   console.log(this.t);
  // }
  
  // SELECTORS
  // selectCubes() {
  //   if (!this.cubes) return null;
  //   return Object.values(this.cubes).map( c => c.cube );
  // }
  // 
  // selectData() {
  //   if (!this.cubes) return null;
  //   return Object.values(this.cubes).map( c => c.data );
  // }
  // 
  
  // THREE ELEMENT CREATORS
  _createRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, this._minRenderHeight());
    document.body.appendChild(this.renderer.domElement);
  }
  
  _createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / this._minRenderHeight(), 0.1, 10);
    this.camera.position.set(0, 0, 1);
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
			if ( this.intersected !== intersects[ 0 ].object ) {
				if ( this.intersected ) this.intersected.material.emissive.setHex( this.intersected.currentHex );
				this.intersected = intersects[ 0 ].object;
				this.intersected.material.emissive.setHex( 0xff0000 );
        
			}
		} else {
      if ( this.intersected ) this.intersected.material.emissive.setHex( this.intersected.currentHex );
      this.intersected = null;
    }
  }
  
  _renderFromBuffer() {
    window.setTimeout( () => {
      if (this.SEObjBuffer.length > 0) {
        const SEObj = this._renderSEObj();
      }
      this._renderFromBuffer();
    }, randRange(0.5, 1.5) * 1000);
  }
  
  _renderSEObj() {
    const SEObj = this.SEObjBuffer.shift();
    this.scene.add(SEObj.mesh);
    SEObj.applyMovement();
    // this.st.update(SEObj);
    // return SEObj;
  }
  
  _handleRemoveCube(cube) {
    this.scene.remove(cube);
    this.st.removeCube(cube);
  }
    
}

export default Visualization;


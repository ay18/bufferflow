import * as THREE from 'three';
import TweenMax from 'gsap';
import { randomColor, randRotation } from './Util';
window.THREE = THREE; // DEBUG

import StatHelper from './StatHelper';

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
    this._renderCube = this._renderCube.bind(this);
    this._applyCubeMovement = this._applyCubeMovement.bind(this);
    this._enableAutoResize = this._enableAutoResize.bind(this);
    this._attachMouseHandler = this._attachMouseHandler.bind(this);
    
    // BUFFERS
    this.intersected = null; // intersected object
    this.cubeBuffer = [];
    this.cubeData = {};
    
    // STATS
    this.st = new StatHelper(this);
    
    // SELECTORS
    this.selectCubes = this.selectCubes.bind(this);
    this.selectData = this.selectData.bind(this);
    
    // ELEMENTS
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this._createScene();
    this._createRenderer();
    this._createCamera();
    this._createLight();

    // EVENT HANDLERS
    this._enableAutoResize();
    this._attachMouseHandler();
    TweenMax.ticker.addEventListener("tick", this.render);
    
    // QUEUED ACTIONS
    this._renderFromBuffer();
    
  }
  
  load(items) {
    items.forEach( data => {
      const cube = this._createCube(data);
      this._enqueueCube(cube, data);
    });
  }
  
  // THREE OBJECT CREATORS
  _createCube(data) {
    let x = 2, y = 0, z = -1;
    const geometry = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
    const material = new THREE.MeshLambertMaterial( {color: randomColor()} );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.set(x, y, z);
    return cube;
  }
  
  _enqueueCube(cube, data) {
    this.cubeBuffer.push(cube);
    this.cubeData[cube.uuid] = data;
  }
  
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
  
  // _tick() {
  //   this.t += 1;
  //   console.log(this.t);
  // }
  
  // SELECTORS
  selectCubes() {
    if (!this.cubes) return null;
    return Object.values(this.cubes).map( c => c.cube );
  }
  
  selectData() {
    if (!this.cubes) return null;
    return Object.values(this.cubes).map( c => c.data );
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
  }
  
  _createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xf0f0f0 );
    window.scene = this.scene;
  }
  
  _createLight() {
    // this.light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
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
  
  // 
  _renderFromBuffer() {
    window.setInterval( () => {
      if (this.cubeBuffer.length > 0) {
        const cube = this._renderCube();
        this._applyCubeMovement(cube);
      }
    }, 1000);
  }
  
  _renderCube() {
    const cube = this.cubeBuffer.shift();
    this.scene.add( cube );
    return cube;
  }
  
  _applyCubeMovement(cube) {
    TweenMax.to(cube.position, 8, { x: -2 , y: 0 , z: -1,
      onComplete: () => { this._handleRemoveCube(cube); },
      ease: Power0.easeNone,
    });
    TweenMax.to(cube.rotation, 8, { x: randRotation(), y: randRotation(), z: randRotation(),
      ease: Power0.easeNone
    });
  }
  
  _handleRemoveCube(cube) {
    this.scene.remove(cube);
    this.st.removeCube(cube);
  }
    
}

export default Visualization;


import * as THREE from 'three';
import TweenMax from 'gsap';
window.THREE = THREE; // DEBUG
import { randomColor } from './Util';

const PL_COLORS = {
  js: 0xF5DA55,
  ruby: 0xC52F24,
  
};

const MIN_RENDERER_HEIGHT = 800;

class Visualization {
  
  constructor() {
    
    // METHOD BINDINGS
    this.render = this.render.bind(this);
    
    // BUFFERS
    this.intersected = null; // intersected object
    this.cubeBuffer = [];
    this.cubeData = {};
    
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
    const self = this;
    window.addEventListener('resize', e => {
        self.camera.aspect = window.innerWidth / this._minRenderHeight();
        self.camera.updateProjectionMatrix();
        self.renderer.setSize( window.innerWidth, this._minRenderHeight() );          
    }, false);  
  }
  
  _attachMouseHandler() {
    const self = this;
    document.addEventListener('mousemove', e => {
      e.preventDefault();
      this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
			this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
    });
  }
  
  _checkIntersection() {
    this.raycaster.setFromCamera( this.mouse, this.camera );
    const intersects = this.raycaster.intersectObjects( this.scene.children );
		if ( intersects.length > 0 ) {
			if ( this.intersected !== intersects[ 0 ].object ) {
				if ( this.intersected ) this.intersected.material.emissive.setHex( this.intersected.currentHex );
				this.intersected = intersects[ 0 ].object;
				this.intersected.material.emissive.setHex( 0xff0000 );
        console.log(this.intersected);
			}
		} else {
      if ( this.intersected ) this.intersected.material.emissive.setHex( this.intersected.currentHex );
      this.intersected = null;
    }
  }
  
  // 
  _renderFromBuffer() {
    const self = this;
    window.setInterval( () => {
      if (self.cubeBuffer.length > 0) {
        const cube = self.cubeBuffer.shift();
        self.scene.add( cube );
        TweenMax.to(cube.position, 6, { x: -2 , y: 0 , z: -1,
          onComplete: () => { self.scene.remove(cube); },
          ease: Power0.easeNone,
        });
        TweenMax.to(cube.rotation, 6, { x: Math.PI / 2, y: Math.PI / 2, z: Math.PI / 2,
          onComplete: () => { self.scene.remove(cube); },
          ease: Power0.easeNone
        });
      }
    }, 1000);
  }
    
}

export default Visualization;


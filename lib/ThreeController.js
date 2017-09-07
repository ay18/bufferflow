import * as THREE from 'three';
import TweenMax from 'gsap';
window.THREE = THREE; // DEBUG

const PL_COLORS = {
  js: 0xF5DA55,
  ruby: 0xC52F24,
};

class ThreeController {
  
  constructor() {
    // this.animate = this.animate.bind(this);
    this.render = this.render.bind(this);
    this.selectCubes = this.selectCubes.bind(this);
    this.selectData = this.selectData.bind(this);
    
    this.mouse = new THREE.Vector2();
    this.raycaster = new THREE.Raycaster();
    this._createScene();
    this._createRenderer();
    this._createCamera();
    this._createLight();
    this.cubes = {};

    this._enableAutoResize();
    this._attachMouseHandler();
    
    TweenMax.ticker.addEventListener("tick", this.render);
  }
  
  // load stackexchange data into ThreeController
  load(items) {
    // let x = 1.2, y = .8, z = -1;
    // items.forEach( dataItem => {
    this.createCube(items[0]);
    // });
    const cube = this.selectCubes()[0];
    // TweenMax.to(cube.position, 20, { x: -1 , y: -0.7 , z: 1 });
    TweenMax.to(cube.position, 1, { x: 0 , y: 0 , z: 0.5 });
    TweenMax.to(cube.rotation, 1, { x: Math.PI / 2, y: Math.PI / 2, z: Math.PI / 2 });
    
  }
  
  createCube(data) {
    let x = 1.2, y = .7, z = -0.5;
    const geometry = new THREE.BoxGeometry( 0.05, 0.05, 0.05 );
    const material = new THREE.MeshLambertMaterial( {color: PL_COLORS['js']} );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.set(x, y, z);
    // edges of different color added onto parent mesh
    // var edgeGeometry = new THREE.EdgesGeometry( cube.geometry );
    // var edgeMaterial = new THREE.LineBasicMaterial( { color: 0xffffff, linewidth: 2 } );
    // var edges = new THREE.LineSegments( edgeGeometry, edgeMaterial );
    // cube.add( edges );
    this.cubes[cube.uuid] = {
      cube,
      data,
    };
    this.scene.add( cube );
  }
  
  selectRenderedCubes() {
    
  }
  
  selectHiddenCubes() {
    
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
  // 
  // _tick() {
  //   this.t += 1;
  //   console.log(this.t);
  // }
  
  _createRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }
  
  _createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2);
    this.camera.position.set(0, 0, 1);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
  
  _createScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xf0f0f0 );
  }
  
  _createLight() {
    // this.light = new THREE.DirectionalLight( 0xffffff, 1 );
    this.light = new THREE.HemisphereLight( 0xffffbb, 0x080820, 1 );
		this.light.position.set( 0.5, 0.5, 0.5 ).normalize();
		this.scene.add( this.light );
  }
  
  _enableAutoResize() {
    const self = this;
    window.addEventListener('resize', e => {
      self.camera.aspect = window.innerWidth / window.innerHeight;
      self.camera.updateProjectionMatrix();
      self.renderer.setSize( window.innerWidth, window.innerHeight );
    });  
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
      console.log(intersects[0].object);
			// if ( INTERSECTED != intersects[ 0 ].object ) {
			// 	if ( INTERSECTED ) INTERSECTED.material.emissive.setHex( INTERSECTED.currentHex );
			// 	INTERSECTED = intersects[ 0 ].object;
			// 	INTERSECTED.currentHex = INTERSECTED.material.emissive.getHex();
			// 	INTERSECTED.material.emissive.setHex( 0xff0000 );
			// }
		}
  }
  
  selectCubes() {
    return Object.values(this.cubes).map( c => c.cube );
  }
  
  selectData() {
    return Object.values(this.cubes).map( c => c.data );
  }
    
}

export default ThreeController;


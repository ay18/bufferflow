import * as THREE from 'three';
import TweenMax from 'gsap';

class ThreeController {
  
  constructor() {
    this.animate = this.animate.bind(this);
    this.render = this.render.bind(this);
    
    this._createRenderer();
    this._createCamera();
    this._createScene();
    this._enableAutoResize();
    this.cubes = [];
    // this.animate();
    TweenMax.ticker.addEventListener("tick", this.render);
  }
  
  // load stackexchange data into ThreeController
  load(items) {
    // let x = 1.2, y = .8, z = -1;
    // items.forEach( dataItem => {
    this.createCube();
    // });
    const cube = this.cubes[0];
    TweenMax.to(cube.position, 2, { x: 0 , y: 0 , z: 0 });
  }
  
  createCube() {
    let x = 0.5, y = 0.5, z = -0.5;
    const geometry = new THREE.BoxGeometry( 0.05, 0.05, 0.05 );
    const material = new THREE.MeshBasicMaterial( {color: 0xC6E2FF} );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.set(x, y, z);
    // edges of different color added onto parent mesh
    var edgeGeometry = new THREE.EdgesGeometry( cube.geometry );
    var edgeMaterial = new THREE.LineBasicMaterial( { color: 0x000000, linewidth: 2 } );
    var edges = new THREE.LineSegments( edgeGeometry, edgeMaterial );
    cube.add( edges );
    this.cubes.push( cube );
    this.scene.add( cube );
  }
  
  selectRenderedCubes() {
    
  }
  
  selectHiddenCubes() {
    
  }
  
  animate() {
  	requestAnimationFrame( this.animate );
    this.cubes.forEach( cube => {
      cube.position.setX(cube.position.x - 0.003);
      cube.position.setY(cube.position.y - 0.003);
      cube.position.setZ(cube.position.z + 0.003);
    });
    this.renderer.render( this.scene, this.camera );
  }
  
  render() {
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
  }
  
  _enableAutoResize() {
    const self = this;
    window.addEventListener('resize', function() {
      self.camera.aspect = window.innerWidth / window.innerHeight;
      self.camera.updateProjectionMatrix();
      self.renderer.setSize( window.innerWidth, window.innerHeight );
    });  
  }
  
}

export default ThreeController;


import * as THREE from 'three';

class ThreeController {
  
  constructor() {
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.enableAutoResize();
  }
  
  createRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);
  }
  
  createCamera() {
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.position.set(0, 0, 100);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
  }
  
  createScene() {
    this.scene = new THREE.Scene();
  }
  
  enableAutoResize() {
    const self = this;
    window.addEventListener('resize', function() {
      self.camera.aspect = window.innerWidth / window.innerHeight;
      self.camera.updateProjectionMatrix();
      self.renderer.setSize( window.innerWidth, window.innerHeight );
    });  
  }
  
}

export default ThreeController;


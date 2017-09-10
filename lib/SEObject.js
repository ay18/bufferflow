// Object linking Stack Exchange data and Three.js

import { randomColor, randRotation, randRange } from './Util';

class SEObject {
  
  constructor(SEData, viz) {
    this.SEData = SEData;
    this.viz = viz;
    this.mesh = createMesh.call(this);
    this.id = this.mesh.uuid;
    this.movement = calcDefaultMovement.call(this);
    this.tweens = {};
  }
  
  illuminate(enabled) {
    if (enabled) {
      this.mesh.material.emissive.setHex( 0x3838cd );
    } else {
      this.mesh.material.emissive.setHex( null );
    }
  }
  
  slowDown() {
    const { mesh } = this;
    this.tweens['pos'].updateTo({
      
    }, false);
  }
  
  speedUp() {
    
  }
  
  animate() {
    // console.log(this.mesh.position.x);
    const { mesh, movement, viz, viz: { renderer, camera, scene } } = this;
    if (mesh.position.x < -2) {
      viz.cleanUp(mesh);
    }
    mesh.position.x -= movement.vX;
    mesh.position.y -= movement.vY;
    mesh.rotation.x += movement.rtX;
    mesh.rotation.y += movement.rtY;
    mesh.rotation.z += movement.rtZ;
  }
}

export default SEObject;

const X = 2, Y = 0, Z = -1; // start positions

function createMesh() {
  const { question: {  
    answer_count,
    tags,
    view_count,
    score,
  }} = this.SEData;
  const length = calcLength(score);
  this.meshLength = length;
  const geometry = new THREE.BoxGeometry( length, length, length );
  const material = new THREE.MeshLambertMaterial( {color: randomColor()} );
  const mesh = new THREE.Mesh( geometry, material );
  mesh.position.set(X, Y, Z);
  return mesh;
}

function calcLength(score) {
  score = score > 0 ? score : 0;
  const BASE_SIZE = 0.05;
  const scale = Math.log10(score + 1) + 1;
  return BASE_SIZE * scale;
}

function calcDefaultMovement() {
  const _baseVX = 0.02;
  const _baseVY = 0.008;
  const velocity = 8.0;
  const velocityMultiplier = 0.05 * this.meshLength * 10000 / velocity;
  const movement = {
    rtX: randRotation() / velocityMultiplier,
    rtY: randRotation() / velocityMultiplier,
    rtZ: randRotation() / velocityMultiplier,
    vX: _baseVX / velocityMultiplier,
    vY: _baseVY / velocityMultiplier * randRange(-.5, .5),
  };
  return movement;
}
  
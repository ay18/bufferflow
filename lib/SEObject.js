// Object linking Stack Exchange data and Three.js
import * as THREE from 'three';
import { TweenMax } from 'gsap';
import { randRotation, randRange } from './Util';
import { COLORS } from './Constants';

class SEObject {
  
  constructor(SEData, viz) {
    this.SEData = SEData;
    this.viz = viz;
    this.mesh = createMesh.call(this);
    this.id = this.mesh.uuid;
    this.movement_0 = calcDefaultMovement.call(this);
    this.movement_c = Object.assign({}, this.movement_0);
    this.moving = true;
    this.displayInfo = false;
    this.tweens = {};
  }
  
  illuminate(enabled) {
    if (enabled) {
      this.mesh.material.emissive.setHex( 0x3838cd );
    } else {
      this.mesh.material.emissive.setHex( null );
    }
  }
  
  start() {
    Object.assign(this.movement_c, this.movement_0);
  }
  
  stop() {
    Object.assign(this.movement_c, { vX: 0, vY: 0 });
  }
  
  toggleMoving() {
    this.moving ? this.decelerateToStop() : this.accelerateToInitial();
    this.moving = !this.moving;
  }
  
  toggleDisplayInfo() {
    this.displayInfo = !this.displayInfo;
  }
  
  accelerateToInitial() {
    TweenMax.to(this.movement_c, 3.5, this.movement_0);
  }
  
  decelerateToStop() {
    TweenMax.to(this.movement_c, 3.5, { vX: 0, vY: 0 });
  }
  
  animate() {
    const { mesh, movement_c, viz, viz: { renderer, camera, scene } } = this;
    if (mesh.position.x < -2) {
      viz.cleanUp(mesh);
    }
    mesh.position.x -= movement_c.vX;
    mesh.position.y -= movement_c.vY;
    mesh.rotation.x += movement_c.rtX;
    mesh.rotation.y += movement_c.rtY;
    mesh.rotation.z += movement_c.rtZ;
  }
  
  windowPosition() {
    const { mesh, viz: { camera } } = this;
    let width = window.innerWidth, height = window.innerHeight;
    let widthHalf = width / 2, heightHalf = height / 2;

    let pos = this.mesh.position.clone();
    pos.project(camera);
    pos.x = ( pos.x * widthHalf ) + widthHalf;
    pos.y = - ( pos.y * heightHalf ) + heightHalf;
    return pos;
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
  const material = new THREE.MeshLambertMaterial( {color: calcColor(tags[0])} );
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
    vX: _baseVX / velocityMultiplier * randRange(0.9, 1.2),
    vY: _baseVY / velocityMultiplier * randRange(-.5, .5),
  };
  return movement;
}

function calcColor(tag) {
  return COLORS[tag] || COLORS['MISC'];
}
  
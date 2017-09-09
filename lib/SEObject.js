// Object linking Stack Exchange data and Three.js

import { randomColor, randRotation, randRange } from './Util';

class SEObject {
  
  constructor(SEData, viz) {
    
    // this.render = this.render.bind(this);
    
    this.SEData = SEData;
    this.viz = viz;
    this.mesh = createMesh.call(this);
    this.movement = calcDefaultMovement.call(this);
  }
  
  applyMovement() {
    const { duration, height, depth, rtX, rtY, rtZ } = this.movement;
    const { mesh } = this;
    TweenMax.to(mesh.position, duration, { x: -2 , y: height, z: depth,
      // onComplete: () => { console.log('call remove cube handler'); },
      ease: Power0.easeNone,
    });
    TweenMax.to(mesh.rotation, duration, { x: rtX, y: rtY, z: rtZ,
      ease: Power0.easeNone
    });
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
  const _baseD = 3;
  const velocity = 10.5;
  const velocityMultiplier = 0.05 * this.meshLength * 10000 / velocity;
  console.log('velocityMultiplier', velocityMultiplier);
  const movement = {
    duration: _baseD * velocityMultiplier,
    height: randRange(-.4, .4),
    depth: randRange(-.4, .4),
    rtX: randRotation() * velocityMultiplier,
    rtY: randRotation() * velocityMultiplier,
    rtZ: randRotation() * velocityMultiplier,
  };
  return movement;
}
  
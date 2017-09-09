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
    const { duration, height, depth } = this.movement;
    const { mesh } = this;
    TweenMax.to(mesh.position, duration, { x: -2 , y: height, z: depth,
      // onComplete: () => { console.log('call remove cube handler'); },
      ease: Power0.easeNone,
    });
    TweenMax.to(mesh.rotation, duration, { x: randRotation(), y: randRotation(), z: randRotation(),
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
  const velocity = 10.5;
  const durationScale = Math.log10((this.meshLength * 1000 / velocity) + 1);
  const movement = {
    duration: randRange(8, 14) * durationScale,
    height: randRange(-.4, .4),
    depth: randRange(-.4, .4),
  };
  return movement;
}
  
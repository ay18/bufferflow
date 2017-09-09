// Object linking Stack Exchange data and Three.js

import { randomColor, randRotation, randRange } from './Util';

class SEObject {
  
  constructor(viz, data) {
    this.viz = viz;
    this.data = data;
    // this.mesh = init.call(this, data);
    this.mesh = createMesh.call(this, data);
  }  
  
}

function createMesh(data) {
  console.log(this);
  let x = 2, y = 0, z = -1;
  const size = 0.05;
  const geometry = new THREE.BoxGeometry( size, size, size );
  const material = new THREE.MeshLambertMaterial( {color: randomColor()} );
  const cube = new THREE.Mesh( geometry, material );
  cube.position.set(x, y, z);
  return cube;
}

export default SEObject;

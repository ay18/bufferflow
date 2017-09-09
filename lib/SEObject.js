// Object linking Stack Exchange data and Three.js

import { randomColor, randRotation, randRange } from './Util';

class SEObject {
  
  constructor(seData, viz) {
    this.seData = seData;
    this.viz = viz;
    // this.mesh = init.call(this, seData);
    debugger;
    this.mesh = createMesh.call(this, seData);
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

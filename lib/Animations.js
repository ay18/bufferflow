// Animate all the cubes!
import TweenMax from 'gsap';
import * as THREE from 'three';
import { randCircularPos, randRange } from './Util';

const CAMERA_POSITIONS = {
  start: {x: 0, y: 0, z: 1},  // These should be Vector3's
  a1: {x: 0, y: 0, z: 5.5},
};

const LIGHT_POSITIONS = {
  start: {x: 0, y: 1.2, z: 0},
  a1: {x: 0, y: 0, z: 4.5},
};

export function search(SEObjs) {
  TweenMax.to(this.camera.position, 1, CAMERA_POSITIONS['a1']);
  TweenMax.to(this.light.position, 1, LIGHT_POSITIONS['a1']);
  this.camera.updateProjectionMatrix();
  ensureRendered.call(this, SEObjs);
  orderAsGrid.call(this, SEObjs);
}

export function reset(SEObjs) {
  TweenMax.to(this.camera.position, 1, CAMERA_POSITIONS['start']);
  TweenMax.to(this.light.position, 1, LIGHT_POSITIONS['start']);
  this.camera.updateProjectionMatrix();
  SEObjs.forEach( obj => {
    obj.start();
    obj.closeDisplayInfo();
  });
}

// Render SEObjs to scene if they've been removed
function ensureRendered(SEObjs) {
  SEObjs.forEach( obj => {
    if (!obj.inScene()) {
      const coords = randCircularPos(5);
      obj.mesh.position.set(...coords, -1);
      delete this.stashedSEObjs[obj.id];
      this.renderedSEObjs[obj.id] = obj;
      this.scene.add(obj.mesh);
    }
  });
}

function orderAsGrid(SEObjs) {
  SEObjs.forEach( obj => {
    obj.stop();
    // const [x, y] = randCircularPos(Math.random() * 0.8);
    const { x, y, z } = getPositionInFOV.call(this);
    TweenMax.to(obj.mesh.position, 1.5, { x, y, z });
  });
}

// https://math.stackexchange.com/questions/1385137/calculate-3d-vector-out-of-two-angles-and-vector-length
function getPositionInFOV() {
  const { fov, aspect } = this.camera;
  const angleX = randRange(0, fov * aspect);
  const angleY = randRange(0, fov);
  const distance = 4;
  const XY_RESTRICT = 0.5;
  const position = new THREE.Vector3(
    Math.cos(angleX) * Math.sin(angleY) * XY_RESTRICT,
    Math.cos(angleX) * Math.cos(angleY) * XY_RESTRICT,
    4
  );
  return new THREE.Vector3(0, 0, 0).add(position);
}

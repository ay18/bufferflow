// Animate all the cubes!
import TweenMax from 'gsap';
import * as THREE from 'three';
import { randCircularPos } from './Util';

const CAMERA_POSITIONS = {
  start: {x: 0, y: 0, z: 1},
  a1: {x: 0, y: 0, z: 5.5},
};

const LIGHT_POSITIONS = {
  start: {x: 0, y: 1.2, z: 0},
  a1: {x: 0, y: 0, z: 4.5},
};

export function search(SEObjs) {
  TweenMax.to(this.camera.position, 1, CAMERA_POSITIONS['a1']);
  TweenMax.to(this.light.position, 1, LIGHT_POSITIONS['a1']);
  ensureRendered.call(this, SEObjs);
  orderAsGrid.call(this, SEObjs);
}

export function reset(SEObjs) {
  TweenMax.to(this.camera.position, 1, CAMERA_POSITIONS['start']);
  TweenMax.to(this.light.position, 1, LIGHT_POSITIONS['start']);
  SEObjs.forEach( obj => {
    obj.start();
  });
}

// Render SEObjs to scene if they've been removed
function ensureRendered(SEObjs) {
  SEObjs.forEach( obj => {
    if (!obj.inScene()) {
      const coords = randCircularPos(5);
      obj.mesh.position.set(...coords, -1);
      this.renderedSEObjs[obj.id] = obj;
      this.scene.add(obj.mesh);
    }
  });
}

function orderAsGrid(SEObjs) {
  console.log(SEObjs.length);
  SEObjs.forEach( obj => {
    obj.stop();
    const [x, y] = randCircularPos(Math.random() * 0.8);
    TweenMax.to(obj.mesh.position, 1.5, {x, y, z: 4.3});
  });

  console.log( Math.sqrt(Math.pow(window.innerWidth, 2) + Math.pow(800, 2)) );
}


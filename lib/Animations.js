// Animate all the cubes!
import TweenMax from 'gsap';
import * as THREE from 'three';
import Visualization from './Visualization';

const CAMERA_POSITIONS = {
  start: {x: 0, y: 0, z: 1},
  a1: {x: 0, y: 0, z: 3.5},
};

export function search() {
  TweenMax.to(this.camera.position, 1, CAMERA_POSITIONS['a1']);
  Visualization.setStartPos();
}

export function reset() {
  TweenMax.to(this.camera.position, 1, CAMERA_POSITIONS['start']);
  Visualization.resetStartPos();  
}
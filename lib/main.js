import { auth } from './Auth';
import axios from 'axios';
import * as three from 'three';

const THREE = three;
let items;


auth();

axios({
  method: 'GET',
  url: 'https://api.stackexchange.com/2.2/questions?order=desc&sort=activity&site=stackoverflow&pagesize=100',
}).then(
  res => {
    window.res = res;
    console.log(res);
    window.items = res.data.items;
    items = res.data.items;
  }
);

window.THREE = three;
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 100);
camera.lookAt(new THREE.Vector3(0, 0, 0));

var scene = new THREE.Scene();
window.scene = scene;




window.addEventListener('resize', function() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
});

// var geometry = new THREE.BoxGeometry( .5, .5, .5 );
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );


var material = new THREE.LineBasicMaterial({ color: 0x0000ff });
var geometry = new THREE.Geometry();
geometry.vertices.push(new THREE.Vector3(-10, 0, 0));
geometry.vertices.push(new THREE.Vector3(0, 10, 0));
geometry.vertices.push(new THREE.Vector3(10, 0, 0));
var line = new THREE.Line(geometry, material);
scene.add( line );

// camera.position.z = 0;

function animate() {
	requestAnimationFrame( animate );
  // cube.rotation.x += 0.005;
  // cube.rotation.y -= 0.01;
	renderer.render( scene, camera );
}
animate();

// I need a different animate function
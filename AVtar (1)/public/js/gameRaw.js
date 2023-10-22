import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Text } from "troika-three-text";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DragControls } from "three/examples/jsm/controls/DragControls";
import * as TWEEN from "tween/tween.js";

const audio = new Audio("/media/bgmS.mp3");

const canvas = document.querySelector(".app"); //canvas
const width = canvas.clientWidth;
const height = canvas.clientHeight;

const scene = new THREE.Scene(); //scene

const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000); //camera

//Setting some constants
var objects = [];
var movableObjects3d = [];
const boxes = [];
const helpers = [];
var movableObjects = [10, 62, 59, 60, 61, 3, 4, 49, 14];
var index;
var successPartt = false;

// light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 10, 10);
directionalLight.castShadow = true;
scene.add(directionalLight);
const directionalLightT = new THREE.DirectionalLight(0xffffff, 1);
directionalLightT.position.set(0, 10, 0);
directionalLightT.castShadow = true;
scene.add(directionalLightT);
const directionalLightF = new THREE.DirectionalLight(0xffffff, 1);
directionalLightF.position.set(0, 8, -8);
directionalLightF.castShadow = true;
scene.add(directionalLightF);
const directionalLightD = new THREE.DirectionalLight(0xffffff, 1);
directionalLightD.position.set(0, -8, 0);
directionalLightD.castShadow = true;
scene.add(directionalLightD);
// const ambientLight = new THREE.AmbientLight(0xffffff, 1);
// scene.add(ambientLight);

//creating plane
const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10, 1, 1),
  new THREE.MeshStandardMaterial({
    color: 0xffffff,
  })
);
plane.castShadow = true;
plane.recieveShadow = true;
// plane.rotation.x = -Math.PI/2;
plane.rotation.x = -Math.PI / 2;
plane.position.y = -4;
scene.add(plane);

loadModel(function () {
  // controls
  const eventDispatcher = new THREE.EventDispatcher();
  const orbitControls = new OrbitControls(camera, canvas); //orbit Controls
  orbitControls.enableZoom = true;
  orbitControls.addEventListener("change", () => {
    eventDispatcher.dispatchEvent({ type: "change" });
    // camera.lookAt(dragControls.target);
  });

  var dragControls = new DragControls(movableObjects3d, camera, canvas); //drag Controls
  console.log(objects);
  dragControls.addEventListener("dragstart", () => {
    orbitControls.enabled = false;
  });
  dragControls.addEventListener("dragend", () => {
    orbitControls.enabled = true;
    eventDispatcher.dispatchEvent({ type: "change" });
    objects[index].userData.childBox
      .copy(objects[index].geometry.boundingBox)
      .applyMatrix4(objects[index].matrixWorld);
    checkSuccess();
  });
  dragControls.addEventListener("drag", function (event) {
    index = objects.indexOf(event.object);
    console.log(index);
    objects[index].userData.childBox
      .copy(objects[index].geometry.boundingBox)
      .applyMatrix4(objects[index].matrixWorld);

    // event.object.position.copy(event.position);
  });
});

function checkSuccess() {
  if (
    objects[index].userData.childBox.intersectsBox(
      objects[index].userData.childBoxB
    )
  ) {
    console.log("Done");
    objects[index].position.copy(
      objects[index].userData.childBox.getCenter(new THREE.Vector3())
    );
    audio.play();
    setTimeout(() => {
      audio.pause();
    }, 1000);
    audio.currentTime = 0;
  }
}

// Create Text
const myText = new Text();
myText.text = "charging Pin";
myText.fontSize = 0.2;
myText.position.z = 0;
myText.position.y = 1;
myText.color = 0x9966ff;
myText.sync();
scene.add(myText);

//renderer
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(width, height);

// create an AxesHelper instance with a size of 5
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
//***************************This is adjustements section********************* */

//adjustements
camera.position.z = 7;
camera.position.y = 4;
// camera.

// loader
function loadModel(callback) {
  let loader = new GLTFLoader();
  let arduino;
  loader.load("/media/SampleScene.gltf", function (gltf) {
    scene.add(gltf.scene);
    arduino = gltf.scene;
    // arduino.position.set(1, 0, 1);
    arduino.scale.set(1, 1, 1);

    // // Create a bounding box for the entire model
    // const box = new THREE.Box3().setFromObject(arduino);

    // // Create a helper for the bounding box
    // const helper = new THREE.Box3Helper(box, 0xff0000);

    // If the model has child objects with their own bounding boxes,
    // you can create boxes and helpers for them in a loop like this:
    // arduino.traverse((child) => {
    //     if (child.isMesh) {
    //         objects.push(child);
    //         const childBox = new THREE.Box3()
    //         childBox.setFromObject(child);
    //         const childBoxB = new THREE.Box3()
    //         childBoxB.setFromObject(child);

    //         // const childHelper = new THREE.Box3Helper(childBox, 0xff0000);
    //         // const childHelperB = new THREE.Box3Helper(childBoxB, 0xffffff);

    //         // child.add(childHelper);
    //         child.userData.childBox = childBox;
    //         child.userData.childBoxB = childBoxB;
    //         // scene.add(childHelper);
    //         // scene.add(childHelperB);
    //         boxes.push(childBox);
    //         // helpers.push(childHelper);
    //     }
    // });

    // arduino.traverse((child) => {
    //     if (child.isMesh) {
    //         child.material.metalness = 0.5;
    //         child.material.roughness = 0.5;
    //     }
    // });
    // addMovableObjects();
    callback();
  });
}

function addMovableObjects() {
  movableObjects.forEach((item) => {
    objects[item].position.x += getRandomInt(-30, 30);
    objects[item].position.y += getRandomInt(-30, 30);
    movableObjects3d.push(objects[item]);
  });
}
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

//adding event listners for buttons
// const homeB = document.querySelector('.homeV');
// const topB = document.querySelector('.topB');
// homeB.addEventListener('click', () => {
//     resetCameraPosition();
// });
// topB.addEventListener('click', () => {
//     topCameraPosition();
// })

function resetCameraPosition() {
  const target = new THREE.Vector3(0, 4, 7); // Set the target position to the origin
  const startPosition = new THREE.Vector3().copy(camera.position); // Get the current position of the camera
  const distance = target.distanceTo(startPosition); // Get the distance between the target position and the current position of the camera
  const duration = 1000; // Set the duration of the rotation in milliseconds

  new TWEEN.Tween(camera.position)
    .to({ x: target.x, y: target.y, z: target.z }, duration)
    .onUpdate(() => {
      camera.lookAt(scene.position); // Make sure camera is always looking at the center of the scene
    })
    .start();
}

function topCameraPosition() {
  const target = new THREE.Vector3(0, 7, 0);
  const startPosition = new THREE.Vector3().copy(camera.position);
  const distance = target.distanceTo(startPosition);
  const duration = 1000;

  new TWEEN.Tween(camera.position)
    .to({ x: target.x, y: target.y, z: target.z }, duration)
    .onUpdate(() => {
      camera.lookAt(scene.position);
    })
    .start();
}

function animate() {
  requestAnimationFrame(animate);
  TWEEN.update();
  if (successPartt) {
    successPartt = false;
  }

  // if (arduino) {                       //rotating animation
  //     arduino.rotation.y += 0.01;
  //     // arduino.rotation.x += 0.01;
  // }
  // orbitControls.update();

  renderer.render(scene, camera);
}

animate();

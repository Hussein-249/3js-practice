import * as THREE from 'three';
// import { FBXLoader } from '../node_modules/three/examples/jsm/loaders/FBXLoader.js';
// import { OrbitControls } from '../node_modules/three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();

// 2nd parameter is aspect ratio, last two are render limits
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

// render directly in the document body
document.body.appendChild(renderer.domElement);

const loader = new FBXLoader();
loader.load(
    '/assets/plane-engine/plane_engine.fbx',
    function (object) {
        // Add the loaded model to the scene
        scene.add(object);
    },
    function (xhr) {
        // indicate how much of the model is loaded for debugging and testing
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        console.error('Error loading FBX model:', error);
    }
);

// Adding light to view the element, otherwise might not be seen
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(1, 1, 1).normalize(); // Normalize is keeping length 1 while preserving direction
scene.add(directionalLight);

// orbit camera for a camera moving around a central point. Need to identify the point 
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // damping effect

// raycaster and mouse objects (?)
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

// event listener to detect mouse movement
document.addEventListener('mousemove', onMouseMove, false);

// get mouse coordinates every time the mouse is moved
function onMouseMove(event) {

    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}

// creates a div element on the page to show text
// then sets styles. Replacde later with stylesheet
const textElement = document.createElement('div');
textElement.style.position = 'absolute';
textElement.style.top = '10px';
textElement.style.left = '10px';
textElement.style.color = 'white';
textElement.style.fontFamily = 'Arial';
textElement.style.fontSize = '16px';
document.body.appendChild(textElement)

// Create an animate function
function animate() {
    requestAnimationFrame(animate);

    raycaster.setFromCamera(mouse, camera);

    // Intersect objects with raycaster
    const intersects = raycaster.intersectObjects(scene.children, true);

    if (intersects.length > 0) {
        textElement.textContent = 'Hovering over object';
    } else {
        textElement.textContent = ''; // no text when no hover
    }

    // Update controls
    controls.update();

    renderer.render(scene, camera);
}

animate();


import * as THREE from '/modules/three/build/three.module.min.js';
import { STLLoader } from '/modules/three/examples/jsm/loaders/STLLoader.js';
import { OrbitControls } from '/modules/three/examples/jsm/controls/OrbitControls.js';
import { XRControllerModelFactory } from '/modules/three/examples/jsm/webxr/XRControllerModelFactory.js';
import { VRButton } from '/modules/three/examples/jsm/webxr/VRButton.js';


export function createScene() {

    // Setup the scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.setClearColor( 0xffffff );
    renderer.xr.enabled = true;
    document.body.appendChild(renderer.domElement);
    document.body.appendChild(VRButton.createButton(renderer));

    
    // Scene
    scene.background = new THREE.Color(0xffffff);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7.5);
    scene.add(directionalLight);



    // STL Loader
    const loader = new STLLoader();

    let meshBasis;
    loader.load( './3DModels/MotorHolder.stl', function ( geometry ) {
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff,transparent: true, opacity: 0.8 });
        meshBasis = new THREE.Mesh(geometry, material);
        meshBasis.rotation.x += THREE.MathUtils.degToRad(-90);
        meshBasis.rotation.z += THREE.MathUtils.degToRad(90);
        scene.add( meshBasis );
      });

    loader.load( './3DModels/UpperArm.stl', function ( geometry ) {
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        window.meshUpperArm = new THREE.Mesh(geometry, material);
        window.meshUpperArm = new THREE.Mesh(geometry, material)
        window.meshUpperArm.rotation.x += THREE.MathUtils.degToRad(90);
        window.meshUpperArm.position.y += 29;
        scene.add( window.meshUpperArm );
    });
    loader.load( './3DModels/LowerArm.stl', function ( geometry ) {
        const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
        window.meshLowerArm = new THREE.Mesh(geometry, material);
        window.meshLowerArm.rotation.x += THREE.MathUtils.degToRad(-90);
        window.meshLowerArm.position.y = 54;
        window.meshLowerArm.position.x = 148
        scene.add( window.meshLowerArm );
    });



    
    // Set the camera position
    camera.position.x = 150;
    camera.position.y = 300;
    camera.position.z = 150;

    // Initialize OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.maxPolarAngle = Math.PI / 2;


    // Make the camera look at a specific point (e.g., the origin)
    const target = new THREE.Vector3(150, 0, -50);
    camera.lookAt(target);

    // Update the controls target
    controls.target.copy(target);
    controls.update();

    // Position Sphere
    let geometrySphere = new THREE.SphereGeometry(5, 32, 32);
    const materialSphere = new THREE.MeshBasicMaterial({
        color: 0x1122aa, // Blue color
        transparent: true,
        opacity: 0.9 // Adjust the opacity for transparency
    });

    
    window.spherePosition = new THREE.Mesh(geometrySphere, materialSphere);
    window.spherePosition.position.y = -7;
    scene.add(window.spherePosition);
    


    return [camera, renderer, scene];
}


export function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      console.log("needs resize")
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
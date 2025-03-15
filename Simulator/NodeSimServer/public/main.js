import * as THREE from '/modules/three/build/three.module.min.js';
import { OrbitControls } from '/modules/three/examples/jsm/controls/OrbitControls.js';
import { XRControllerModelFactory } from '/modules/three/examples/jsm/webxr/XRControllerModelFactory.js';
import { VRButton } from '/modules/three/examples/jsm/webxr/VRButton.js';

import {createScene, resizeRendererToDisplaySize} from './scene.js';
import {createSystem} from './coordinateSystem.js';
import {coordinateSystemPosition} from './coordinateSystemPosition.js'
import {coordinateSystemMotor} from './coordinateSystemMotor.js'

window.xGloablMotor = 0;
window.zGloablMotor = 0;
window.simNr = 0;
window.WSSocket = null;

function selectSimNr(event){
  console.log("Selected: SimNr=" + window.selectionBox.value);
  if(window.WSSocket){
    window.WSSocket.send("simNr=" + window.selectionBox.value)
    window.WSSocket.send("?")
  }
}

window.selectionBox.onchange = x => {selectSimNr(x)};


const [camera, renderer, scene] = createScene();
const coordsys = createSystem(scene);
const coordsysPos = new coordinateSystemPosition()
const coordsysMot = new coordinateSystemMotor()


let posZeroUpperArmAngle = 0;
let posZeroLowerArmAngle = 0;
let upperArmLength = 148;
let lowerArmLength = 148;

let xHand = 0;
let yHand = 0;

// Animation loop
function render(time) {
    //requestAnimationFrame(animate);

    if (window.meshLowerArm && window.meshUpperArm) {
      posZeroUpperArmAngle = -window.xGloablMotor*Math.PI/180;
  
      window.meshUpperArm.rotation.z = posZeroUpperArmAngle;
  
      //posZeroLowerArmAngle += 0.003;
      posZeroLowerArmAngle = window.zGloablMotor*Math.PI/180;

      window.meshLowerArm.rotation.z = posZeroLowerArmAngle;
      window.meshLowerArm.position.x = Math.cos(posZeroUpperArmAngle) * upperArmLength;
      window.meshLowerArm.position.z = Math.sin(posZeroUpperArmAngle) * upperArmLength;
  
      xHand = Math.cos(posZeroUpperArmAngle) * upperArmLength + Math.cos(posZeroLowerArmAngle) * lowerArmLength;
      yHand = Math.sin(posZeroUpperArmAngle) * upperArmLength - Math.sin(posZeroLowerArmAngle) * lowerArmLength;
      
      coordsysPos.drawPosition(scene,xHand,yHand);
      coordsysMot.drawMotorAngles(scene,posZeroUpperArmAngle, posZeroLowerArmAngle);
    }

    if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }
    
    renderer.render(scene, camera);
  }
renderer.setAnimationLoop(render);
  //animate()
  
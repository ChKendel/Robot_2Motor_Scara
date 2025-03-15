import * as THREE from '/modules/three/build/three.module.min.js';
import { FontLoader } from '/modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '/modules/three/examples/jsm/geometries/TextGeometry.js';

export function createSystem(scene) {

// XY Coordinate System
const geometryX = new THREE.BoxGeometry(330, 2, 2);
const materialX = new THREE.MeshBasicMaterial({ color: 0x11aa22 });
const xAxis = new THREE.Mesh(geometryX, materialX);
xAxis.position.x += 165;
xAxis.position.y = -7;
scene.add(xAxis);

const geometryY = new THREE.BoxGeometry(2, 2, -330);
const materialY = new THREE.MeshBasicMaterial({ color: 0xaa3300 });
const yAxis = new THREE.Mesh(geometryY, materialY);
yAxis.position.z -= 165;
yAxis.position.x = 0;
yAxis.position.y = -7;
scene.add(yAxis);

const fontLoader = new FontLoader();
//fontLoader.load('/modules/three/examples/fonts/optimer_regular.typeface.json', function(font){
  fontLoader.load('/modules/three/examples/fonts/helvetiker_regular.typeface.json', function(font){
  
  window.fontUsed = font;
  console.log("Font arrived")
  
  const xLabelGeometry = new TextGeometry('x', {font: font,size: 16,height: 0.3,});
  const textMeshX = new THREE.Mesh(xLabelGeometry, materialX);
  textMeshX.position.x += 330;
  scene.add(textMeshX);
  const yLabelGeometry = new TextGeometry('y', {font: font,size: 16,height: 0.3,});
  const textMeshY = new THREE.Mesh(yLabelGeometry, materialY);
  textMeshY.position.z -= 330;
  scene.add(textMeshY);


  const xTic100Geometry = new TextGeometry('100', {font: font,size: 7,height: 0.3,});
  const textMeshX100 = new THREE.Mesh(xTic100Geometry, materialX);
  textMeshX100.position.x += 100;
  textMeshX100.position.y -= 16;
  scene.add(textMeshX100);
  
  const xTic200Geometry = new TextGeometry('200', {font: font,size: 7,height: 0.3,});
  const textMeshX200 = new THREE.Mesh(xTic200Geometry, materialX);
  textMeshX200.position.x += 200;
  textMeshX200.position.y -= 16;
  scene.add(textMeshX200);

  
  const xTic300Geometry = new TextGeometry('300', {font: font,size: 7,height: 0.3,});
  const textMeshX300 = new THREE.Mesh(xTic300Geometry, materialX);
  textMeshX300.position.x += 300;
  textMeshX300.position.y -= 16;
  scene.add(textMeshX300);

  const yTic100Geometry = new TextGeometry('100', {font: font,size: 7,height: 0.3,});
  const textMeshY100 = new THREE.Mesh(yTic100Geometry, materialY);
  textMeshY100.position.z -= 100;
  textMeshY100.position.y -= 16;
  scene.add(textMeshY100);

  const yTic200Geometry = new TextGeometry('200', {font: font,size: 7,height: 0.3,});
  const textMeshY200 = new THREE.Mesh(yTic200Geometry, materialY);
  textMeshY200.position.z -= 200;
  textMeshY200.position.y -= 16;
  scene.add(textMeshY200);

  const yTic300Geometry = new TextGeometry('300', {font: font,size: 7,height: 0.3,});
  const textMeshY300 = new THREE.Mesh(yTic300Geometry, materialY);
  textMeshY300.position.z -= 300;
  textMeshY300.position.y -= 16;
  scene.add(textMeshY300);


})


}
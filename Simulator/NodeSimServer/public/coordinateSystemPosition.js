import * as THREE from 'three';
import { FontLoader } from '/modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '/modules/three/examples/jsm/geometries/TextGeometry.js';



export class coordinateSystemPosition{


  constructor(){

    this.geometryX = new THREE.BoxGeometry(330, 2, 2);
    this.materialX = new THREE.MeshBasicMaterial({ color: 0x11aa22 });

    
    this.geometryY = new THREE.BoxGeometry(2, 2, -330);
    this.materialY = new THREE.MeshBasicMaterial({ color: 0xaa3300 });

    this.xLabel = null;
    this.xLabelMesh = null;
    this.xLabelOldValue = null;
    this.yLabel = null;
    this.yLabelMesh = null;
    this.yLabelOldValue = null;

    this.cylinderPosition = null;

    this.geometryCX = null;
    this.cylinderX = null;
    this.geometryCY = null;
    this.cylinderY = null;

    console.log("Postion is created");
  }

  drawPosition(scene, x, y){
      
  
    if(window.fontUsed != null && window.spherePosition != null && this.xLabel != null){



      window.spherePosition.position.x = x;
      window.spherePosition.position.z = y;

        let xStr = String(x - x%1);
        if(this.xLabelOldValue != xStr){
          this.xLabel.dispose();
          this.xLabel = new TextGeometry(xStr, {font: window.fontUsed,size: 10,height: 0.3,});
          this.xLabelMesh.geometry.dispose();
          this.xLabelMesh.geometry = this.xLabel;    
        }
        this.xLabelMesh.position.x = x;

        let yStr = String(-1*(y - y%1));
        if(this.yLabelOldValue != yStr){
          this.yLabel.dispose();
          this.yLabel = new TextGeometry(yStr, {font: window.fontUsed,size: 10,height: 0.3,});
          this.yLabelMesh.geometry.dispose();
          this.yLabelMesh.geometry = this.yLabel;    
        }
        this.yLabelMesh.position.z = y;

        this.cylinderPosition.position.z = y;
        this.cylinderPosition.position.x = x;

        scene.remove(this.cylinderX);   
        
        if (this.geometryCX) this.geometryCX.dispose();
        this.geometryCX = new THREE.CylinderGeometry(0.4, 0.4, y, 12); // Top radius, bottom radius, height, radial segments
        this.cylinderX.geometry.dispose();
        this.cylinderX = new THREE.Mesh(this.geometryCX, this.materialX);
        this.cylinderX.rotation.x =  Math.PI / 2;
        this.cylinderX.position.x = x;
        this.cylinderX.position.z = y/2
        this.cylinderX.position.y = -7;
        scene.add(this.cylinderX)

        scene.remove(this.cylinderY);   
        
        if (this.geometryCY) this.geometryCY.dispose();
        this.geometryCY = new THREE.CylinderGeometry(0.4, 0.4, -x, 12); // Top radius, bottom radius, height, radial segments
        this.cylinderY.geometry.dispose()
        this.cylinderY = new THREE.Mesh(this.geometryCY, this.materialY);
        this.cylinderY.rotation.z =  Math.PI / 2;
        this.cylinderY.position.z = y;
        this.cylinderY.position.x = x/2
        this.cylinderY.position.y = -7;
        scene.add(this.cylinderY)
    }
        

    if(window.fontUsed != null && window.spherePosition != null && this.xLabel == null){
      let xStr = String(x - x%1);
      this.xLabelOldValue = xStr;
      this.xLabel = new TextGeometry(xStr, {font: window.fontUsed,size: 10,height: 0.3,});
      this.xLabelMesh = new THREE.Mesh(this.xLabel, this.materialX);
      this.xLabelMesh.position.x = x;
      scene.add(this.xLabelMesh);

      let yStr = String(-1*(y - y%1));
      this.yLabelOldValue = yStr;
      this.yLabel = new TextGeometry(yStr, {font: window.fontUsed,size: 10,height: 0.3,});
      this.yLabelMesh = new THREE.Mesh(this.yLabel, this.materialY);
      this.yLabelMesh.position.z = y;
      scene.add(this.yLabelMesh);


      const materialSphere = new THREE.MeshBasicMaterial({color: 0x1122aa,transparent: true,opacity: 0.9});
      let geometryC = new THREE.CylinderGeometry(1.4, 1.4, 50, 12); // Top radius, bottom radius, height, radial segments
      this.cylinderPosition = new THREE.Mesh(geometryC, materialSphere);
      this.cylinderPosition.position.y= 28
      scene.add(this.cylinderPosition)

      let geometryCX = new THREE.CylinderGeometry(1.0, 1.0, 50, 12); // Top radius, bottom radius, height, radial segments
      this.cylinderX = new THREE.Mesh(geometryCX, this.materialX);
      this.cylinderX.rotation.x =  Math.PI / 2;
      this.cylinderX.position.z = - 30;
      scene.add(this.cylinderX)

      let geometryCY = new THREE.CylinderGeometry(1.0, 1.0, 50, 12); // Top radius, bottom radius, height, radial segments
      this.cylinderY = new THREE.Mesh(geometryCY, this.materialY);
      this.cylinderY.rotation.z =  Math.PI / 2;
      scene.add(this.cylinderY)
    }
  } 
}


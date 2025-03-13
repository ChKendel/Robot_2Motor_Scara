import * as THREE from 'three';
import { FontLoader } from '/modules/three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from '/modules/three/examples/jsm/geometries/TextGeometry.js';



export class coordinateSystemMotor{

    constructor() {

        this.radius = 50;


        this.meshXMotor = null;
        this.meshZMotor = null;

        this.material = new THREE.MeshBasicMaterial({ color: 0x223399,transparent: true, opacity: 0.7 });
        this.materialZ = new THREE.MeshBasicMaterial({ color: 0x442299,transparent: true, opacity: 0.7 });
        this.extrudeSettings = { depth: 3, bevelEnabled: false };

        this.xAxisMotor =null;
        this.x2AxisMotor =null;

        this.oldXMotor = 0;
        this.oldYMotor = 0;

        this.xMotorStrOld = "";
        this.zMotorStrOld = "";

        this.xMotorLabelMesh = null;
        this.zMotorLabelMesh = null;

        this.geometry = null;
        this.geometryZ = null;
        this.startAngle = 0;
        this.endAngle = 0;
        this.shapeX = null;

        this.z = 0;
        this.x = 0;
        this.xMotorStr = " ";
        this.zMotorStr = " ";

        this.endAngleZ = null;
        this.shapeZ = null;

        this.upperArmLength = 147.5
    }

    drawMotorAngles(scene, motorX, motorZ){

        if(this.meshXMotor != null){
            scene.remove(this.meshXMotor);
            scene.remove(this.meshZMotor);

            this.meshXMotor.geometry.dispose()
            this.meshXMotor.material.dispose()

            this.meshZMotor.geometry.dispose()
            this.meshZMotor.material.dispose()
        }

        // X-Motor
        this.endAngle = 2*Math.PI - motorX; // 45 degrees
        this.shapeX = new THREE.Shape();
        this.shapeX.moveTo(0, 0);
        this.shapeX.lineTo(this.radius * Math.cos(this.startAngle), this.radius * Math.sin(this.startAngle));
        this.shapeX.absarc(0, 0, this.radius, this.startAngle, this.endAngle, false);
        this.shapeX.lineTo(0, 0);


        this.geometry = new THREE.ExtrudeGeometry(this.shapeX, this.extrudeSettings);
        this.meshXMotor = new THREE.Mesh(this.geometry, this.material);
        this.meshXMotor.rotation.x = -Math.PI/2;
        this.meshXMotor.position.y = 39;
        scene.add(this.meshXMotor);


        this.x = (motorX*180/Math.PI)%360;
        this.xMotorStr = "xMotor: " + String(-1*(this.x - this.x%1));   
        if(this.xMotorStrOld != this.xMotorStr){ 
            if(this.xMotorLabelMesh != null){
                scene.remove(this.xMotorLabelMesh);
                this.xMotorLabelMesh.geometry.dispose();
                this.xMotorLabelMesh.material.dispose();
            }
            this.xMotorStrOld = this.xMotorStr;
            delete this.xMotorLabel;
            this.xMotorLabel = new TextGeometry(this.xMotorStr, {font: window.fontUsed,size: 8,height: 0.3,});
            delete this.xMotorLabelMesh;
            this.xMotorLabelMesh = new THREE.Mesh(this.xMotorLabel, this.material);
            this.xMotorLabelMesh.position.y = 50;
            this.xMotorLabelMesh.position.x = 55;
            scene.add(this.xMotorLabelMesh);
        }

        // X-Motor-Reference-Axis
        if(this.xAxisMotor == null){
            this.geometryX = new THREE.BoxGeometry(70, 1, 1);
            this.materialX = new THREE.MeshBasicMaterial({ color: 0x11aa22 });
            this.xAxisMotor = new THREE.Mesh(this.geometryX, this.materialX);
            this.xAxisMotor.position.x += 35;
            this.xAxisMotor.position.y = 39;
            scene.add(this.xAxisMotor);

            this.x2AxisMotor = new THREE.Mesh(this.geometryX, this.materialX);
            this.x2AxisMotor.position.x += 35;
            this.x2AxisMotor.position.y = 67;
            scene.add(this.x2AxisMotor);
        }

        this.x2AxisMotor.position.x = 35 + this.upperArmLength*Math.cos(motorX);
        this.x2AxisMotor.position.z = this.upperArmLength*Math.sin(motorX);

        
        // Z-Motor
        this.endAngleZ = motorZ; // 45 degrees
        this.shapeZ = new THREE.Shape();
        this.shapeZ.moveTo(0, 0);
        this.shapeZ.lineTo(this.radius * Math.cos(this.startAngle), 0);
        this.shapeZ.absarc(0, 0,   this.radius, 0, this.endAngleZ, false);
        this.shapeZ.lineTo(0, 0);

        this.geometryZ = new THREE.ExtrudeGeometry(this.shapeZ, this.extrudeSettings);
        this.meshZMotor = new THREE.Mesh(this.geometryZ, this.materialZ);
        this.meshZMotor.rotation.x = -Math.PI/2;
        this.meshZMotor.position.y = 67;

        this.meshZMotor.position.x = this.upperArmLength*Math.cos(motorX);
        this.meshZMotor.position.z = this.upperArmLength*Math.sin(motorX);
        scene.add(this.meshZMotor);

        this.z = -(motorZ*180/Math.PI)%360;
        this.zMotorStr = "zMotor: " + String(-1*(this.z - this.z%1));  
        if(this.zMotorStrOld != this.zMotorStr){ 
            if(this.zMotorLabelMesh != null){
                scene.remove(this.zMotorLabelMesh);
                this.zMotorLabelMesh.geometry.dispose(); 
                this.zMotorLabelMesh.material.dispose();
            }
            this.zMotorStrOld = this.zMotorStr;
            this.zMotorLabel = new TextGeometry(this.zMotorStr, {font: window.fontUsed,size: 8,height: 0.3,});
            this.zMotorLabelMesh = new THREE.Mesh(this.zMotorLabel, this.material);
            this.zMotorLabelMesh.position.y = 70;
            this.zMotorLabelMesh.position.x = this.upperArmLength*Math.cos(motorX) + 55;
            this.zMotorLabelMesh.position.z = this.upperArmLength*Math.sin(motorX);
            scene.add(this.zMotorLabelMesh);
        }
        else if(this.zMotorLabelMesh != null){
            this.zMotorLabelMesh.position.x = this.upperArmLength*Math.cos(motorX) + 55;
            this.zMotorLabelMesh.position.z = this.upperArmLength*Math.sin(motorX);
        }
        
    }

}
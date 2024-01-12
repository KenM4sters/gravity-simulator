import Experience from "../Experience";
import * as THREE from "three"
import PhysicsUtils from "../Utils/PhysicsUtils";

export default class Simulation {
    constructor() {

        this.experience = new Experience()
        this.physicsUtils = new PhysicsUtils()
        this.scene = this.experience.scene
        this.debug = this.experience.debug
        this.simParticipants = []

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('simulation')
        }

        // Creating the Meshes
        this.cube = new THREE.Mesh(
            new THREE.BoxGeometry(1, 1, 1),
            new THREE.MeshBasicMaterial({wireframe: true})
        )

        this.sphere = new THREE.Mesh(
            new THREE.SphereGeometry(2, 10, 10),
            new THREE.MeshBasicMaterial({wireframe: true})
        )
        
        // Modifying positions as needed
        this.cube.position.x = 3
        this.cube.position.z = 1
        
        // Add to the scene
        this.scene.add(this.cube)
        this.scene.add(this.sphere)

        /* 
            Testing
        */

        console.log(this.physicsUtils.getNormalVector(this.sphere, this.cube));
            
        // Traverses the scene for meshes and adds them to an array
        this.collectSimParticipants()
        this.assignPhysicsProps()
        this.runDebug()
        this.calculateForces()

    }

    collectSimParticipants() {

        this.scene.traverse((child) => {
            if(child instanceof THREE.Mesh) {
                child.name = `${child.uuid}`
                this.simParticipants.push(child)
            }
        })

        for(let i = 0; i < this.simParticipants.length; i++) {
            console.log(this.simParticipants[i]);
        }
    }

    assignPhysicsProps() {
        for(let i = 0; i < this.simParticipants.length; i++) {
            this.simParticipants[i]['mass'] = 10
            this.simParticipants[i]['velocity'] = {x: 0, y: 0, z: 0}
            this.simParticipants[i]['acceleration'] = {x: 0, y: 0, z: 0}
            this.simParticipants[i]['netForce'] = new THREE.Vector3()
        }
    }

    calculateForces() {
        for(let i = 0; i < this.simParticipants.length; i++) {
            for(let j = 0; j < this.simParticipants.length; j++) {
            
                
            }
        }
    }   

    runDebug() {
        if(this.debug.active) {
            for(let i = 0; i < this.simParticipants.length; i++) {
                // this.debug.addFolder(`${this.simParticipants[i].name}`)
                this.debugFolder
                    .add(this.simParticipants[i], 'mass')
                    .name('mass')
                    .min(0.1)
                    .max(100)
                    .step(0.1)

                this.debugFolder
                    .add(this.simParticipants[i].velocity, 'x')
                    .name('xPos')
                    .min(0)
                    .max(100)
                    .step(0.1)

                this.debugFolder
                    .add(this.simParticipants[i].velocity, 'y')
                    .name('yPos')
                    .min(0)
                    .max(100)
                    .step(0.1)
                    
                this.debugFolder
                    .add(this.simParticipants[i].velocity, 'z')
                    .name('zPos')
                    .min(0)
                    .max(100)
                    .step(0.1)
                
            }
        }
    }
}
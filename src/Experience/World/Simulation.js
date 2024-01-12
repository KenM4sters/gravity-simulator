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
        this.earth = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 10, 10),
            new THREE.MeshBasicMaterial({wireframe: true})
        )

        this.sun = new THREE.Mesh(
            new THREE.SphereGeometry(2, 10, 10),
            new THREE.MeshBasicMaterial({wireframe: true})
        )
        
        // Modifying positions as needed
        this.earth.position.x = 16
        this.earth.position.z = 1
        this.sun.position.x = -16
        this.sun.position.z = -1
        
        // Add to the scene
        this.scene.add(this.earth)
        this.scene.add(this.sun)

        
        // Traverses the scene for meshes and adds them to an array
        this.collectSimParticipants()
        this.assignPhysicsProps()
        this.runDebug()
        this.calculateForces()

        /* 
            Testing
        */
        
        
        // console.log(this.physicsUtils.getNormalVector(this.sun, this.earth));
        // console.log(this.physicsUtils.getForce(this.sun, this.earth));

    }

    collectSimParticipants() {
        this.scene.traverse((child) => {
            if(child instanceof THREE.Mesh) {
                child.name = `${child.uuid}`
                this.simParticipants.push(child)
            }
        })

        // for(let i = 0; i < this.simParticipants.length; i++) {
            // console.log(this.simParticipants[i]);
        // }
    }

    assignPhysicsProps() {
        for(let i = 0; i < this.simParticipants.length; i++) {
            this.simParticipants[i]['mass'] = 10
            this.simParticipants[i]['velocity'] = {x: 0, y: 0, z: 0}
            this.simParticipants[i]['acceleration'] = {x: 0, y: 0, z: 0}
            this.simParticipants[i]['netForce'] = {value: 0, angle: 0}

            // Scaling mass to approximate real celestial values  
            this.simParticipants[i].mass *= Math.pow(10, 12)
        }


    }

    calculateForces() {
        let forces = []
        for(let i = 0; i < this.simParticipants.length; i++) {
            for(let j = 0; j < this.simParticipants.length; j++) {
                forces.push(this.physicsUtils.getForce(this.simParticipants[i], this.simParticipants[j]))
            }
            
        }

        console.log(this.earth.netForce);
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
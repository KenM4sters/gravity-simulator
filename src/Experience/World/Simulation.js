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
        this.params = {}
        this.params.timeStep = 0

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
            new THREE.SphereGeometry(0.2, 10, 10),
            new THREE.MeshBasicMaterial({wireframe: true})
        )

        this.test = new THREE.Mesh(
            new THREE.SphereGeometry(0.2, 10, 10),
            new THREE.MeshBasicMaterial({wireframe: true})
        )
        
        // Modifying positions as needed
        this.earth.position.x = 16
        this.earth.position.z = 5
        this.sun.position.x = -16
        this.sun.position.z = -1
        this.test.position.x = -5
        this.test.position.z = 9
        
        // Add to the scene
        this.scene.add(this.earth)
        this.scene.add(this.sun)
        // this.scene.add(this.test)

        
        // Traverses the scene for meshes and adds them to an array
        this.collectSimParticipants()
        this.assignPhysicsProps()
        this.runDebug()
        this.calculateForces() 

        // Adding an initial velocity to alllow orbits

        /* 
            Testing
        */
       this.earth.velocity.x = Math.pow(10, -9)*Math.cos(1.8)
       this.earth.velocity.z = -Math.pow(10, -9)*Math.sin(1.8)
       this.sun.velocity.x = Math.pow(10, -9)*Math.cos(5)
       this.sun.velocity.z = -Math.pow(10, -9)*Math.sin(5)



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
            this.simParticipants[i]['mass'] = 100
            this.simParticipants[i]['velocity'] = {x: 0, y: 0, z: 0}
            this.simParticipants[i]['acceleration'] = {x: 0, y: 0, z: 0}
            this.simParticipants[i]['netForce'] = {x: 0, y: 0, z: 0}

            // Scaling mass to approximate real celestial values  
            this.simParticipants[i].mass *= Math.pow(10, 12)
        }
    }

    calculateForces() {
        let forces = []
        for(let i = 0; i < this.simParticipants.length; i++) {
            forces = []
            for(let j = 0; j < this.simParticipants.length; j++) {

                if(i !== j)
                    forces.push(this.physicsUtils.getForce(this.simParticipants[i], this.simParticipants[j]))
                else
                    continue

            }
            
            let netForce = {x: 0, y: 0, z: 0}
            for(let z = 0; z < forces.length; z++) {
                netForce.x += (forces[z].force*Math.cos(forces[z].angle)) 
                netForce.z += (-forces[z].force*Math.sin(forces[z].angle)) 
                // console.log(forces);
            }
            this.simParticipants[i].netForce = netForce

        }

        // console.log('earth', this.earth.netForce)
        // console.log('sun', this.sun.netForce)
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

                this.debugFolder
                    .add(this.params, 'timeStep')
                    .name('timeStep')
                    .min(1)
                    .max(1000000)
                    .step(10)
                
            }
        }
    }

    updatePositions() {
        for(let i = 0; i < this.simParticipants.length; i++) {
            this.simParticipants[i].acceleration.x = 
                this.simParticipants[i].netForce.x / this.simParticipants[i].mass

            this.simParticipants[i].acceleration.y = 
                this.simParticipants[i].netForce.y / this.simParticipants[i].mass

            this.simParticipants[i].acceleration.z = 
                this.simParticipants[i].netForce.z / this.simParticipants[i].mass

            this.simParticipants[i].velocity.x += 
                this.simParticipants[i].acceleration.x

            this.simParticipants[i].velocity.y += 
                this.simParticipants[i].acceleration.y

            this.simParticipants[i].velocity.z += 
                this.simParticipants[i].acceleration.z

            this.simParticipants[i].position.x += 
                (this.simParticipants[i].velocity.x / 60) * 1000000000

            this.simParticipants[i].position.y += 
                (this.simParticipants[i].velocity.y / 60) * 1000000000

            this.simParticipants[i].position.z += 
                (this.simParticipants[i].velocity.z / 60) * 1000000000

            // console.log(this.earth.velocity);
        }
    }
}
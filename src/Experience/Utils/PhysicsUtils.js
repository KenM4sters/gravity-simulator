import * as THREE from 'three'


export default class PhysicsUtils {
    constructor() {
        
    }  

    getDistanceBetween(referenceObj, targetObj) {
        let deltaX = targetObj.position.x - referenceObj.position.x
        let deltaZ = targetObj.position.z - referenceObj.position.z

        return Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaZ, 2))

    }

    getAngleBetween(referenceObj, targetObj) {
        let deltaX = targetObj.position.x - referenceObj.position.x
        let deltaZ = targetObj.position.z - referenceObj.position.z

        
        return targetObj.position.z > referenceObj.position.z ? 
            (Math.PI * 2) - Math.abs(Math.atan2(deltaZ, deltaX)) 
            : 
            Math.abs(Math.atan2(deltaZ, deltaX))
        
 
    }

    getNormalVector(referenceObj, targetObj) {
        let normalVec = {
            x: 0, y: 0, z: 0
        }
        let magnitude = this.getDistanceBetween(referenceObj, targetObj)
        let angle = this.getAngleBetween(referenceObj, targetObj)
        // console.log(angle);
        // console.log(this.radsToDegs(angle));

        normalVec.x = -(magnitude*Math.sin(angle))
        normalVec.z = magnitude*Math.cos(angle)

        return normalVec
    }

    getLength(vec) {
        return Math.sqrt(Math.pow(vec.x, 2) + Math.pow(vec.z, 2))
    }

    radsToDegs(rads) {
        return rads * (180 / Math.PI)
    }

    getForce(objectA, objectB) {

        let r = this.getDistanceBetween(objectA, objectB)

        //scaling distance to approximate real celestial values
        r *= Math.pow(10, 6)

        let angle = this.getAngleBetween(objectA, objectB)
        let force = (6.674*Math.pow(10, -11) * ((objectA.mass * objectB.mass) / Math.pow(r, 2)))

        let forceVector = {force: force , angle: angle}

        // console.log(forceVector);
        
        return forceVector
    }
}
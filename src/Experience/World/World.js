import Experience from '../Experience.js'
import Resources from '../Utils/Resources.js'
import Environment from './Environment.js'
import Particles from './Particles.js'
import Simulation from './Simulation.js'


export default class World
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.particles = new Particles()
        this.simulation = new Simulation()

        this.resources.on('ready', () => {
            console.log('resources are ready')
            // Setup
            this.environment = new Environment()
        })

    }

    update() {
        // this.simulation.cube.position.x += 0.1
    }

}
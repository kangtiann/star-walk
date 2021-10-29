import {RaDecLocation} from "./location.js"

export class Star {
    constructor(name, location, radius) {
        this.name = name
        this.location = location
        this.radius = radius
    }
}

export const STARS = [
    new Star("Sun (太阳)", new RaDecLocation(286.13, 63.87, 499), 696000),
    new Star("Mercury (水星)", new RaDecLocation(281.01, 61.45, 30), 2439),
    new Star("Venus (金星)", new RaDecLocation(272.76, 67.16, 40), 6051),
    new Star("Earth (地球)", new RaDecLocation(0, 0, 0), 6371),
    new Star("Mars (火星)", new RaDecLocation(317.68, 52.88, 667), 3389),
    new Star("Jupiter (木星)", new RaDecLocation(268.05, 64.495, 999), 43441),
    new Star("Saturn (土星)", new RaDecLocation(40.589, 83.53, 4333), 58232),
    new Star("Uranus (天王星)", new RaDecLocation(257.31, -15.17, 5000), 25362),
    new Star("Neptune (海王星)", new RaDecLocation(299.3, 42.95, 15066), 24622),
]
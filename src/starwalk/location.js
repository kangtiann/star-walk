export class CartesianLocation {
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

export class RaDecLocation {
    constructor(ra, dec, distance) {
        this.ra = ra; // like: 286.13°
        this.dec = dec; // like: +63.87°
        this.distance = distance; // like: 8 * 60 + 19 seconds
    }

    getCartesianLocation() {
        let a = this.ra
        let b = this.dec
        let c = this.distance

        let x = (c * Math.cos(b)) * Math.cos(a)
        let y = (c * Math.cos(b)) * Math.sin(a)
        let z = c * Math.sin(b)

        return new CartesianLocation(x, y, z)
    }
}


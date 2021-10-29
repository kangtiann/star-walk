import {STARS} from "./data.js"
import * as THREE from "three"
import {Text} from 'troika-three-text'

export class Ship {
    constructor() {
        this.x = 0; // -180 ~ 180
        this.y = 0; // -180 ~ 180
        this.z = -90; // -180 ~ 180
        this.speed = 60 // 60 per sec
        this.bindKeyboard();
        this.bindTouch();
        // this.bindOrientation();
    }

    getSpeedXYZ() {
        let ex = this.x * 0.0174532925;
        let ey = this.y * 0.0174532925;
        let ez = this.z * 0.0174532925;
        
        let x = Math.sin(ex) * Math.cos(ey) * Math.cos(ez) + Math.cos(ex) * Math.sin(ey) * Math.sin(ez);
        let y = Math.cos(ex) * Math.sin(ey) * Math.cos(ez) - Math.sin(ex) * Math.cos(ey) * Math.sin(ez);
        let z = Math.cos(ex) * Math.cos(ey) * Math.sin(ez) - Math.sin(ex) * Math.sin(ey) * Math.cos(ez);
        let scale = 1 / Math.sqrt(x*x + y*y + z*z)
        return [x * this.speed * scale, y * this.speed * scale, z * this.speed * scale];
    }

    bindKeyboard() {
        document.addEventListener('keydown', (event) => {
            const keyName = event.key;

            if (keyName === "d") {
                this.x += 3
            } else if (keyName === "a") {
                this.x -= 3
            } else if (keyName === "w") {
                this.y += 3
            } else if (keyName === "s") {
                this.y -= 3
            } else if (keyName === "e") {
                this.z += 3
            } else if (keyName === "q") {
                this.z -= 3
            } else if (keyName === "ArrowUp") {
                this.speed += 5
            } else if (keyName === "ArrowDown") {
                this.speed -= 5
            } else if (keyName === "ArrowRight") {
                this.speed += 0.1
            } else if (keyName === "ArrowLeft") {
                this.speed -= 0.1
            }

            console.log(`Key pressed ${keyName}, z: ${this.z}`);
        }, false);
    }

    bindOrientation() {
        // 陀螺仪
        let _this = this;
        if (window.DeviceOrientationEvent) {
            if (window.DeviceOrientationEvent.requestPermission) {
                window.DeviceOrientationEvent.requestPermission().then(r => {
                    console.log("Orientation enabled");
                    window.addEventListener("deviceorientation", function(event) {
                        // alpha: 围绕垂直手机屏幕的轴转动的旋转角度
                        _this.x = event.alpha;
                        // gamma: 围绕平行充电口的轴转动的旋转角度
                        _this.y = event.gamma;
                        // beta: 围绕平行音量键的轴转动的旋转角度
                        _this.z = event.beta;

                        console.log(`Orientation: ${_this.x}, ${_this.y}, ${_this.z}`);

                    }, true);
                })
            }
        } else {
            console.log("Orientation disabled");
        }
    }

    bindTouch() {
        let _this = this;
        const startCallback = function(event) {
            console.log("startCallback, in");
            let touch = event.targetTouches[0];
            _this.startPos = {x: touch.pageX, y: touch.pageY};
            _this.lastPos = {x: _this.x, y: _this.y, z: _this.z}
            window.addEventListener("touchmove", moveCallback, true);
            window.addEventListener("touchend", endCallback, true);
        }

        const moveCallback = function(event) {
            let touch = event.targetTouches[0];
            let deltaX = touch.pageX - _this.startPos.x;
            let deltaY = touch.pageY - _this.startPos.y
            _this.x = _this.lastPos.x + (deltaX / 400.0) * 90.0;
            _this.y = _this.lastPos.y + (deltaY / 400.0) * 90.0;
            _this.z = _this.lastPos.z + (_this.x + _this.y) / 400.0 * 90.0 / 2;

            console.log(`moveCallback, x: ${_this.x}, y: ${_this.y}`);
        }

        const endCallback = function(event) {
            window.removeEventListener('touchmove', moveCallback,true);
            window.removeEventListener('touchend', startCallback,true);
        }

        window.addEventListener("touchstart", startCallback, true);

    }
}

export class StarWalk {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 0.1, 200000);
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.ship = new Ship();

        document.getElementById("container").appendChild(this.renderer.domElement);
        this.addStars()

        this.camera.position.z = 2000;

        let animate = function() {
            requestAnimationFrame(animate);
            let v = this.ship.getSpeedXYZ()
            this.camera.rotation.x = this.ship.x / 180.0;
            this.camera.rotation.y = this.ship.y / 180.0;
            this.camera.rotation.z = this.ship.z / 180.0;
            this.camera.position.z += v[2] / 60.0;
            this.camera.position.y += v[1] / 60.0;
            this.camera.position.x += v[0] / 60.0;
            // console.log("this.camera.position.z", new Date(), this.camera.position.z);
            this.showInfo();
            this.renderer.render(this.scene, this.camera);
        }.bind(this);

        animate();

    }

    showInfo() {
        let old = document.getElementById("info")
        if (old) { old.remove(); }

        let text2 = document.createElement('div');
        text2.id = "info"
        text2.style.position = 'absolute';
        text2.style.width = 100;
        text2.style.height = 100;
        text2.style.color = "white"
        text2.style.top = 200 + 'px';
        text2.style.left = 200 + 'px';
        let v = this.ship.getSpeedXYZ();

        text2.innerHTML = `<pre>X: ${this.ship.x.toFixed(2)}</pre><pre>Y: ${this.ship.y.toFixed(2)}</pre>
            <pre>Z: ${this.ship.z.toFixed(2)}</pre><pre>Speed: ${this.ship.speed} (${v[0].toFixed(2)}, ${v[1].toFixed(2)}, ${v[2].toFixed(2)})</pre>`;

        document.body.appendChild(text2);
    }

    addStars() {
        STARS.forEach(s => {
            let size = s.radius / 6371
            let geometry = new THREE.SphereGeometry(size, 32, 16);
            let edges = new THREE.EdgesGeometry(geometry);
            let line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 0xffffff } ) );
            this.scene.add(line);
            let location = s.location.getCartesianLocation();
            console.log("location", s.name, location.x, location.y, location.z);
            line.position.set(location.x, location.y, location.z);

            const starName = new Text()
            this.scene.add(starName)

            // Set properties to configure:
            starName.text = s.name;
            starName.font = "NotoSansSC-Medium.otf"
            starName.fontSize = 0.2;
            starName.position.set(location.x - size - 1, location.y - size - 1, location.z - size - 1);
            starName.color = "white";

            // Update the rendering:
            starName.sync();
        })
    }
}
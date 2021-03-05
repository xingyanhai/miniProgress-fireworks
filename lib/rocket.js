// 火箭类
import DataBus from './databus'
import Util from '../utils/util'
import Particle from './particle'
const databus = new DataBus()
export default class Rocket {
    constructor (x, y, canvas) {
        this.canvas = canvas
        this.x = x || 0;
        this.y = y || 0;
        // 起始位置
        this.originPos = {
            x: x,
            y: y
        }
        // 目标位置
        this.targetPos = null
        this.vel = {
            x: 0,
            y: 0 };

        this.shrink = .97;
        this.size = 2;

        this.resistance = 1;
        this.gravity = 0;

        this.flick = false;

        this.alpha = 1;
        this.fade = 0;
        this.color = 0;

        this.visible = true
        this.explosionColor = 0;
    }
    static originalSize = 8
    init (cos, targetPos) { // cos 取 -1 --- 1
        let angle
        if (targetPos && targetPos.x && targetPos.y) {
            this.targetPos = targetPos

        }
        if(cos !== undefined) {
            angle = Math.acos(cos)
        } else {
            angle = Math.acos(Util.rnd(-3, 3) / 10)
        }
        // emulate 3D effect by using cosine and put more particles in the middle
        var speed = 15
        this.vel.x = Math.cos(angle) * speed;
        this.vel.y = - Math.sin(angle) * speed;


        console.log(this.vel)
        this.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;

        this.size = Rocket.originalSize;
        this.shrink = 0.999;
        this.gravity = 0;
    }
    // 爆炸
    explode () {
        var count = Math.random() * 10 + 80;

        for (var i = 0; i < count; i++) {
            const particle = databus.pool.getItemByClass('particle', Particle, this.x, this.y, this.canvas)
            particle.init()
            databus.particles.push(particle);
        }
    }
    update () {
        // apply resistance 乘以阻力
        this.vel.x *= this.resistance;
        this.vel.y *= this.resistance;

        // gravity down 加上重力
        this.vel.y += this.gravity;

        // update position based on speed
        this.x += this.vel.x;
        this.y += this.vel.y;

        // shrink 乘以收缩
        this.size *= this.shrink;

        // fade out
        this.alpha -= this.fade;

        this.visible = this.visible && this.alpha >= 0.1 && this.size >= 1;

        // 对象回收
        if (this.y > databus.canvasHeight || this.visible === false || this.x < 0 || this.x > databus.canvasWidth) {
            databus.removeRocket(this)
        }
    }
    render (c) {
        if (!this.visible) {
            return;
        }

        c.save();

        c.globalCompositeOperation = 'lighter';

        var x = this.x,
            y = this.y,
            r = this.size / 2;

        var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
        gradient.addColorStop(0.1, "rgba(255, 255, 255 ," + this.alpha + ")");
        gradient.addColorStop(1, "rgba(0, 0, 0, " + this.alpha + ")");

        c.fillStyle = gradient;

        c.beginPath();
        c.arc(this.x, this.y, this.flick ? Math.random() * this.size / 2 + this.size / 2 : this.size, 0, Math.PI * 2, true);
        c.closePath();
        c.fill();

        c.restore();
    }
}

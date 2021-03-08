import DataBus from './databus'
import Util from '../utils/util'
const databus = new DataBus()
// 爆炸粒子类
export default class TextParticle {
    constructor (x, y, canvas) {
        this.canvas = canvas
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ay = 0.2;
        this.radius = 4;
        this.maxHealth = 200;
        this.health = 200;
    }
    init () {
    }
    update () {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.vy += this.ay;
        this.ay *= 0.95;

        this.radius = (this.health / this.maxHealth) * 4;
        this.health--;
        if (this.health <= 0) {
            databus.removeParticle(this)
        }
    }
    render (c) {
        if (!this.visible) {
            return;
        }
        let circle = function(x, y, radius, color, strokeColor, lineWidth, ctx) {
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            if (strokeColor) ctx.strokeStyle = strokeColor;
            if (lineWidth) ctx.lineWidth = lineWidth;
            ctx.fill();
            if (strokeColor) ctx.stroke();
        }

        circle(this.x, this.y, this.radius, "rgba(255, 255, 255, " + (this.health / this.maxHealth) + ")", c);

    }
}

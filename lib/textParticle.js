import DataBus from './databus'
import Util from '../utils/util'
import Particle from './particle'
const databus = new DataBus()
// 爆炸粒子类
export default class TextParticle {
    constructor (x, y,vx,vy, canvas) {
        this.canvas = canvas
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.ay = 0.2;
        // 改名点大小
        this.radius = 2;
        this.maxHealth = 200;
        this.health = 200;
        this.visible = true,
        this.renderColor = '255,255,255'
        this.isTimeout = false
    }
    init (renderColor, timeout = 0) {
        if(renderColor) {
            this.renderColor = renderColor
        }
        if(timeout) {
            setTimeout(() => {
                this.isTimeout = true
            }, timeout)
        }
    }
    update () {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.vy += this.ay;
        this.ay *= 0.95;
        this.health--;
        if (this.isTimeout) {
            databus.removeParticle(this)
            var count = 1
            for (var i = 0; i < count; i++) {
                const particle = databus.pool.getItemByClass('particle', Particle, this.x, this.y, this.canvas)
                particle.init(10)
                databus.particles.push(particle);
            }
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
        var x = this.x,
            y = this.y,
            r = 5;
        var gradient = c.createRadialGradient(x, y, 0.1, x, y, r);
        let a = (Math.random())// 1-this.health / this.maxHealth;
        let color1 = "rgba(255,255,255," + a + ")"
        let color2 = "rgba("+ this.renderColor +"," + a + ")"
        let color3 = "rgba("+ Util.rnd(0, 255) +","+ Util.rnd(0, 255) +","+ Util.rnd(0, 255) +",1" + ")"
        gradient.addColorStop(0.1, color1);
        gradient.addColorStop(0.5, color2);
        gradient.addColorStop(0.6, color3);

        circle(this.x, this.y, this.radius, gradient, null, null,c);

    }
}

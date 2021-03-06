// 火箭类
import DataBus from './databus'
import Util from '../utils/util'
import Particle from './particle'
import TextParticle from './textParticle'
import Music from './music'
const databus = new DataBus()

async function textToPoints(text, textSize, font) {
    return new Promise(resolve => {
        const query = wx.createSelectorQuery()
        query.select('#hide-canvas')
        .fields({ node: true, size: true })
        .exec((res) => {
            let textItemWidth = 26
            const canvas = res[0].node
            const ctx = canvas.getContext('2d')
            const radio = textSize / textItemWidth

            let renderWidth = textItemWidth * text.length
            let renderHeight = textItemWidth;
            ctx.clearRect(0, 0, renderWidth, renderHeight)
            ctx.textBaseline = "middle";
            ctx.font = textItemWidth + "px " + font;
            ctx.fillText(text, 0, renderHeight / 2 + 2);

            var imageData = ctx.getImageData(0, 0, renderWidth,renderHeight);
            var data = imageData.data;
            var points = [];
            var index = (x, y) => (x + renderWidth * y) * 4;
            // red   = imageData.data[index];
            // green = imageData.data[index + 1];
            // blue  = imageData.data[index + 2];
            // alpha = imageData.data[index + 3];
            var threshold = 10;
            for (var i = 0; i < data.length; i += 4) {
                if (data[i + 3] > threshold) {
                    var p = {
                        x: (i / 4) % renderWidth,
                        y: (i / 4) / renderWidth >> 0
                    };
                    // 取轮廓
                    if (data[index(p.x + 1, p.y) + 3] < threshold ||
                        data[index(p.x - 1, p.y) + 3] < threshold ||
                        data[index(p.x, p.y + 1) + 3] < threshold ||
                        data[index(p.x, p.y - 1) + 3] < threshold) {
                        points.push({
                            x: ((i / 4) % renderWidth) * radio,
                            y: ((i / 4) / renderWidth >> 0) * radio
                        });
                    }
                }
            }
            resolve(points)
        })

    })

}

export default class Rocket {
    constructor (x, y, canvas) {
        this.music = new Music()
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

        this.text = null;
    }
    static originalSize = 8
    init (targetPos, text) {
        this.text = text
        let angle
        if (targetPos && targetPos.x && targetPos.y) {
            this.targetPos = targetPos
            let p1 = this.originPos
            let p2 = this.targetPos
            angle =  Math.acos((p2.x - p1.x) / Math.sqrt(Math.pow(p2.x - p1.x,2) +  Math.pow(p2.y - p1.y,2)))
        } else {
            angle = Math.acos(Util.rnd(-3, 3) / 10)
        }
        // emulate 3D effect by using cosine and put more particles in the middle
        var speed = 15
        this.vel.x = Math.cos(angle) * speed;
        this.vel.y = - Math.sin(angle) * speed;


        this.explosionColor = Math.floor(Math.random() * 360 / 10) * 10;

        this.size = Rocket.originalSize;
        this.shrink = 0.999;
        this.gravity = 0;
    }
    // 爆炸
    async explode () {
        if (this.text) {
            const textSize = 20
            var points = await textToPoints(this.text, textSize, "微软雅黑");
            var scale = 0.3;
            let renderColor = [
                Util.rnd(0,255),
                Util.rnd(0,255),
                Util.rnd(0,255)
            ]
            for (var i = 0; i < points.length; i++) {
                var p = points[i];
                var v = {
                    x: (p.x - textSize*this.text.length/2) * scale + (Math.random() - 0.5) * 0.1,
                    y: (p.y - textSize/2 - 10) * scale + (Math.random() - 0.5) * 0.1
                }
                var particle = new TextParticle(this.x, this.y, v.x, v.y);
                particle.init(renderColor)
                databus.particles.push(particle);
            }
        } else {
            var count = Math.random() * 10 + 80;
            for (var i = 0; i < count; i++) {
                const particle = databus.pool.getItemByClass('particle', Particle, this.x, this.y, this.canvas)
                particle.init()
                databus.particles.push(particle);
            }
        }
    }
    // 判断是否爆炸
    isExplodeCheck () {
        if(this.targetPos) {
            let p2 = this.targetPos
            if(this.y <= p2.y) {
                this.visible = false
                this.explode()
                this.music.playPa()
            }
        } else {
            let randomChance = this.y < databus.canvasHeight * 2 / 3 ? Math.random() * 100 <= 1 : false;

            if (this.y < databus.canvasHeight / 5 || this.vel.y >= 0 || randomChance) {
                // 爆炸
                this.explode();
                this.visible = false
                this.music.playPa()
            }
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
        this.isExplodeCheck()
        this.visible = this.visible && this.alpha >= 0.1 && this.size >= 1;

        // 对象回收
        if (this.y < 0 || this.visible === false || this.x < 0 || this.x > databus.canvasWidth) {
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

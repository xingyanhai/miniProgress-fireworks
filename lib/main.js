import Rocket from './rocket'
import Particle from './particle'
import Music from './music'
import DataBus from './databus'
import Util from "../utils/util";
const databus = new DataBus()
/**
 * 游戏主函数
 */
export default class Main {
  constructor(canvas) {
    console.log(databus)
    // 维护当前requestAnimationFrame的id
    this.aniId = 0
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.restart()
  }
  // 重新开始
  restart() {
    databus.reset()

    this.music = new Music()

    this.bindLoop = this.loop.bind(this)

    // 清除上一局的动画
    this.canvas.cancelAnimationFrame(this.aniId)

    this.aniId = this.canvas.requestAnimationFrame(
      this.bindLoop,
      this.canvas
    )
  }


  // 全局碰撞检测
  collisionDetection() {
    const that = this

    // 判断是否烟火火箭爆炸
    for (var i = 0; i < databus.rockets.length; i++) {

      // calculate distance with Pythagoras
      // var distance = Math.sqrt(Math.pow(mousePos.x - rockets[i].pos.x, 2) + Math.pow(mousePos.y - rockets[i].pos.y, 2));

      // random chance of 1% if rockets is above the middle
      var randomChance = databus.rockets[i].y < this.canvas.height * 2 / 3 ? Math.random() * 100 <= 1 : false;

      /* Explosion rules
       - 80% of screen
       - going down
       - close to the mouse
       - 1% chance of random explosion
       */
      let rocket = databus.rockets[i]
      if (rocket.y < this.canvas.height / 5 || rocket.vel.y >= 0 ||  randomChance) {
        // 爆炸
        rocket.explode();
        rocket.visible = false
        this.music.playPa()
      }
    }

  }

  /**
   * 玩家射击烟花操作
   * 射击时机由外部决定
   */
  rocketShoot() {
    const rocket = databus.pool.getItemByClass('rocket', Rocket, this.canvas.width / 2, this.canvas.height, this.canvas)
    rocket.init()
    databus.rockets.push(rocket);
  }


  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    databus.rockets
    .concat(databus.particles)
    .forEach((item) => {
      item.render(this.ctx)
    })
  }

  // 游戏逻辑更新主函数
  update() {
    databus.frame++

    databus.rockets
      .concat(databus.particles)
      .forEach((item) => {
        item.update()
      })
    console.log(
        `
        火箭：${databus.rockets.length}
        微粒：${databus.particles.length}
        `
    )


    // 全局碰撞检测
    this.collisionDetection()

    if (databus.frame % 100 === 0) {
      // 发射烟花
      this.rocketShoot()
      this.music.playJiu()
    }
  }

  // 实现游戏帧循环
  loop() {

    this.update()
    this.render()

    this.aniId = this.canvas.requestAnimationFrame(
      this.bindLoop,
      this.canvas
    )
  }
}

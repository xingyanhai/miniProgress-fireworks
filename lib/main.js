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
  }

  /**
   * 玩家射击烟花操作
   * 射击时机由外部决定
   */
  rocketShoot() {
    const rocket = databus.pool.getItemByClass('rocket', Rocket, databus.canvasWidth / 2, databus.canvasHeight, this.canvas)
    rocket.init()
    databus.rockets.push(rocket);
  }

  textShoot () {
      const rocket = databus.pool.getItemByClass('rocket', Rocket, databus.canvasWidth / 2, databus.canvasHeight, this.canvas)
      rocket.init({x: databus.canvasWidth/2,y:databus.canvasHeight/2}, '新用户')
      databus.rockets.push(rocket);
  }


  /**
   * canvas重绘函数
   * 每一帧重新绘制所有的需要展示的元素
   */
  render() {
    this.ctx.clearRect(0, 0, databus.canvasWidth, databus.canvasHeight)

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

    if (databus.frame % 200 === 0) {
      // 发射烟花
      this.rocketShoot()
      this.music.playJiu()
    } else if(databus.frame % 100 === 0) {
      // 发射烟花
      this.textShoot()
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

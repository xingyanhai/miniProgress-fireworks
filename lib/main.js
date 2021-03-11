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
    this.shootIndex = 0
    this.shootText = '谢老板祝老板生五个儿子'
    this.shootArr = []
    this.restart()
  }
  // 重新开始
  restart() {
    let rowCount = 3 // 每行字的个数
    let itemWidth = databus.canvasWidth / rowCount
    this.shootArr = this.shootText.split('').map((e, i) => {
      let colIndex = i % rowCount // 第几列 （从0开始）
      let rowIndex = Math.floor(i / rowCount)/// 第几行（从0开始）
      let maxRow = Math.floor(databus.canvasHeight / itemWidth)
      let pos
      if(rowIndex < maxRow) {
        pos = {
          x: (0.5 + colIndex) * itemWidth,
          y: (0.5 + rowIndex) * itemWidth
        }
      }

      return {
        type: 'text',
        value: e,
        pos
      }
    })
    this.shootArr.push({
      type: 'textRenderOver'
    })
    this.shootArr.push({
      type: 'over'
    })
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
    const rocket = databus.pool.getItemByClass('rocket', Rocket, Util.rnd(0, databus.canvasWidth), databus.canvasHeight, this.canvas)
    rocket.init()
    databus.rockets.push(rocket);
  }

  textShoot (pos, text) {
      const rocket = databus.pool.getItemByClass('rocket', Rocket, Util.rnd(0, databus.canvasWidth), databus.canvasHeight, this.canvas)
      rocket.init(pos, text)
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

    if (databus.frame % 50 === 0) {
      let item = this.shootArr[this.shootIndex]
      if(item) {
        this.shootIndex ++
        if(item.type === 'text') {
          // // 发射文字
          this.textShoot(item.pos,item.value)
          this.music.playJiu()
        } else if(item.type === 'textRenderOver') {
          databus.particles.forEach(e => {
            e.isTimeout = true
          })
        } else if(item.type === 'over') {
          // // 发射烟花
          for(let i = 0;i< 20;i++) {
            this.rocketShoot()
          }
          this.music.playJiu()
        }
      } else {
        this.shootIndex = 0
      }
      // // 发射烟花
      // this.rocketShoot()
      // this.music.playJiu()

    } else if(databus.frame % 100 === 0) {
      // // 发射烟花
      // this.textShoot()
      // this.music.playJiu()
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

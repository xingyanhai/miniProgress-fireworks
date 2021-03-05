import Pool from './pool'
let instance
/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if (instance) return instance
    instance = this
    this.pool = new Pool()
    this.reset()
  }

  reset() {
    this.frame = 0
    this.rockets = []
    this.particles = []
  }

  /**
   * 回收烟花火箭，进入对象池
   * 此后不进入帧循环
   */
  removeRocket(rocket) {
    rocket.visible = false
    let index = this.rockets.findIndex(e => e === rocket)
    this.rockets.splice(index,1)
    // this.pool.recover('rocket', rocket)
  }

  /**
   * 回收烟花微粒，进入对象池
   * 此后不进入帧循环
   */
  removeParticle(particle) {
    particle.visible = false
    let index = this.particles.findIndex(e => e === particle)
    this.particles.splice(index,1)
  }
}

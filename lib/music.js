let instance

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if (instance) return instance

    instance = this

    this.bgmAudio = wx.createInnerAudioContext()
    this.bgmAudio.loop = true
    this.bgmAudio.src = 'audio/bgm.mp3'

    this.shootAudio = wx.createInnerAudioContext()
    this.shootAudio.src = 'audio/bullet.mp3'

    this.boomAudio = wx.createInnerAudioContext()
    this.boomAudio.src = 'audio/boom.mp3'

    this.jiuAudioList = [wx.createInnerAudioContext()]
    this.jiuAudioList[0].src = 'audio/jiu.mp3'

    this.paAudioList = [wx.createInnerAudioContext()]
    this.paAudioList[0].src = 'audio/pa.mp3'

    // this.playBgm()
  }

  playBgm() {
    this.bgmAudio.play()
  }

  playShoot() {
    this.shootAudio.startTime = 0
    this.shootAudio.play()
  }

  playExplosion() {
    this.boomAudio.startTime = 0
    this.boomAudio.play()
  }

  playJiu() {
    let jiuAudio = this.jiuAudioList.find(e => {
      return e.paused === true
    })
    if (!jiuAudio) {
      jiuAudio = wx.createInnerAudioContext()
      jiuAudio.src = 'audio/jiu.mp3'
      this.jiuAudioList.push(jiuAudio)
    }
    jiuAudio.startTime = 0
    jiuAudio.play()
  }

  playPa() {
    let paAudio = this.paAudioList.find(e => {
      return e.paused === true
    })
    if (!paAudio) {
      paAudio = wx.createInnerAudioContext()
      paAudio.src = 'audio/pa.mp3'
      this.paAudioList.push(paAudio)
    }
    paAudio.startTime = 0
    paAudio.play()
  }
}

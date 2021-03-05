// index.js
// 获取应用实例
import DataBus from '../../lib/databus'
import Main from '../../lib/main'
const dataBus = new DataBus()
const app = getApp()
Page({
  data: {
  },
  // 事件处理函数
  // bindViewTap() {
  //   wx.navigateTo({
  //     url: '../logs/logs'
  //   })
  // },
  onReady() {
    const query = wx.createSelectorQuery()
    query.select('#myCanvas')
    .fields({ node: true, size: true })
    .exec((res) => {
      const canvas = res[0].node
      const ctx = canvas.getContext('2d')

      const dpr = wx.getSystemInfoSync().pixelRatio
      canvas.width = res[0].width * dpr
      canvas.height = res[0].height * dpr
      ctx.scale(dpr, dpr)

      dataBus.reset(res[0].width, res[0].height)
      new Main(canvas)
    })
    wx.showShareMenu()
  },
})

// index.js
// 获取应用实例
import Main from '../../lib/main'
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
      canvas.width = res[0].width
      canvas.height = res[0].height
      // const ctx = canvas.getContext('2d')
      //
      // const dpr = wx.getSystemInfoSync().pixelRatio
      // canvas.width = res[0].width * dpr
      // canvas.height = res[0].height * dpr
      // ctx.scale(dpr, dpr)

      new Main(canvas)
    })
    wx.showShareMenu()
  },
})

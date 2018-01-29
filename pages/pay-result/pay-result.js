Page({
  data: {
    result: 1,
    msg_desc: '--',
    money: '-.--'
  },
  onLoad: function (options) {
    var msg_desc = options.shopName;
    var money = options.money;
    var that = this;
    that.setData({
      msg_desc: msg_desc,
      money: money
    })
  },
  complete: function () {
    var pages = getCurrentPages();
    console.log('pages:' + pages.length);
    for (var i = 0; i < pages.length; i++) {
      console.log(pages[i].__route__);
    }
    wx.reLaunch({
      url: '../pay/pay?shopId=' + wx.getStorageSync('shopId')
    })
  }
})

// cashier-manager.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopWindows: [{ id: 0, name: '全部档口' }, { id: 1, name: '档口1' }, { id: 2, name: '档口2' }, { id: 3, name: '档口3' }],
    cashiers: [{ id: 1, username: '翠花', tel: 10086, winName: '档口1' }, { id: 1, username: '小二', tel: 10086, winName: '档口1' }, { id: 1, username: '傻逼', tel: 10086, winName: '档口1' }],
    selectedWin: null,
    selectedCashier: null,
    showWins: false,
    showDialog: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.choseCashier();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 选择编辑收银员
   */
  choseCashier: function (e) {

    var idx = e.currentTarget.dataset.idx;
    this.setData({
      showDialog: true,
      selectedCashier: this.data.cashiers[idx]
    });
  },
  /**
   * 关闭弹框
   */
  closeDialog: function () {
    this.setData({
      showDialog: false,
      selectedCashier: null
    });
  }
  ,
  /**
   * 显示档口列表
   */
  showWins: function () {
    var that = this;
    var wins = [];
    for (var i = 0; i < this.data.shopWindows.length; i++) {
      wins.push(this.data.shopWindows[i].name);
    }
    this.setData({
      showWins: true
    });
    wx.showActionSheet({
      itemList: wins,
      success: function (res) {
        console.log(res.tapIndex)
        that.setData({
          selectedWin: that.data.shopWindows[res.tapIndex],
          showWins: false
        });
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  }
})
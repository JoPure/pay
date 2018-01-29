/* pages/index/index.js */
var utils = require('../../utils/util.js');
var config = require('../../utils/config.js').config;
Page({
  data: {
    showChose: false
  },
  onLoad: function (options) {
    // wx.showLoading({
    //   title: 'loading...',
    // });
    try {
      wx.clearStorageSync()
    } catch (e) {
      // Do something when catch error
      wx.showModal({
        title: '提示',
        content: '清理本地缓存失败',
      })
    }

    // var storageShopId = wx.getStorageSync('shopId');
    // storageShopId = storageShopId ? storageShopId : 6;
    var shopId = options.shopId ? options.shopId : config[config.env].defaultShopId;
    wx.setStorageSync('shopId', shopId);
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          var url = '/xcx/anon/code2Session';
          var requestParmas = {
            code: res.code,
            shopId: shopId
          };
          utils.request(url, requestParmas, function (result) {
            // wx.hideLoading();
            var sessionid = result.data.data.thirdSession;
            wx.setStorageSync('sessionid', sessionid);
            if (result.data.code == 200) {
              var cellphone = result.data.data.userInfo.cellphone;
              var userId = result.data.data.userInfo.userId;
              wx.setStorageSync('userId', userId);
              var balance = result.data.data.userInfo.balance;
              wx.setStorageSync('balance', balance);
              var shopName = result.data.data.userInfo.shopName;
              wx.setStorageSync('shopName', shopName);
              var type = result.data.data.userInfo.type;
              if (type == 2) {
                wx.redirectTo({
                  url: '../pay/pay' + '?shopId=' + shopId
                })
              } else if (type == 1) {
                wx.redirectTo({
                  url: '../shop-tips/shop-tips'
                })
              } else {
                that.setData({ showChose: true });
              }
            } else if (result.data.code == 202) {
              wx.redirectTo({
                url: '../bind/bind'
              });
            } else {
              utils.catchError(result);
            }
          });

        } else {
          alert('获取用户登录态失败！' + res.errMsg);
        }
      }

    })
  },
  choseYG: function () {
    wx.setStorageSync('choseType', 1);
    wx.redirectTo({
      url: '../pay/pay'
    })
  },

  choseShop: function (e) {
    wx.setStorageSync('choseType', 2);
    wx.redirectTo({
      url: '../shop-tips/shop-tips'
    })
  },
  onPullDownRefresh: function (e) {
    this.onload();
  },

})

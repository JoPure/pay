// pages/push-money/push-money.js
var utils = require('../../utils/util.js');
var config = require('../../utils/config.js').config;
Page({
  data: {
    total: '--',
    month: '--',
    youbaoMoney: '--',
    userName: '同学',
    moneyData: []
  },
  onLoad: function (options) {
    wx.showLoading({
      title: 'loading...',
    });
    var that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          var url = '/xcx/anon/code2Session';
          var requestParmas = {
            code: res.code,
            shopId: config[config.env].defaultShopId
          };
          utils.request(url, requestParmas, function (result) {
            // wx.hideLoading();
            var sessionid = result.data.data.thirdSession;
            var userName = result.data.data.userInfo.userName;
            wx.setStorageSync('sessionid', sessionid);

            that.setData({
              userName: userName
            });

            var getMoneyUrl = '/subsidy/history/total/get';
            utils.request(getMoneyUrl, {}, function (result) {
              if (result.data.code == 200) {
                that.setData({
                  loading: false
                });
                wx.hideLoading();
                var total = (Number(result.data.data.total).toFixed(2) * 1000) / 100 / 1000;
                wx.setStorageSync('total', total);
                var month = result.data.data.month;
                var youbaoMoney = (Number(result.data.data.youbao).toFixed(2) * 1000) / 100 / 1000;

                var count = (total - 150) / 50;
                count = count > 9 ? 9 : count;
                var moneyData = [];
                for (var i = 1; i <= count; i++) {
                  moneyData.push(50 * i);
                }

                that.setData({
                  total: total,
                  moneyData: moneyData,
                  month: month,
                  youbaoMoney: youbaoMoney
                })
              } else {
                utils.catchError(result);
              }
            }, function (err) {
              wx.hideLoading();
              alert(err);
            }, 'POST');
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      }
    })
  },
  payMoney: function (e) {
    var that = this;
    var total = wx.getStorageSync('total');
    var payMoney = e.currentTarget.dataset.money;
    var balance = (total - that.data.youbaoMoney);
    if (balance < payMoney) {
      wx.showModal({
        title: '充值提示',
        content: '抱歉,您的友宝充值金额超过补贴金额'
      })
      return;
    }
    wx.showModal({
      title: '提示',
      content: '确认充值' + e.currentTarget.dataset.money + '元？',
      success: function (res) {
        if (res.confirm) {
          // else {
          var setMoneyUrl = '/subsidy/history/set'
          var requestParmas = {
            youbao: payMoney * 100
          };
          utils.request(setMoneyUrl, requestParmas, function (result) {
            if (result.data.code == 200) {
              wx.showModal({
                title: '充值提示',
                content: '您已成功充值' + requestParmas.youbao / 100 + '元'
              })
              that.setData({
                youbaoMoney: that.data.youbaoMoney + payMoney
              })
            } else {
              utils.catchError(result);
            }
          }, function (err) {
            wx.hideLoading();
            alert(err);
          }, 'POST');
        }
      }
      // }
    })
  },

  onPullDownRefresh: function (e) {
    this.onLoad();
  },
  onShareAppMessage: function () {
    return {
      title: '七道小食堂',
      path: 'pages/recharge/recharge',
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  }
})
/* pages/confirm-pay/confirm-pay.js */
var app = getApp();
var common = require('../../utils/md5.js');
var utils = require('../../utils/util.js');

Page({
  data: {
    result: 1,
    shopName: '',
    money: '',
    transactionId: ''
  },
  onLoad: function (options) {
    var money = (options.price / 100).toFixed(2);
    var transactionId = options.transactionId;
    var shopName = options.shopName;
    var that = this;
    this.setData({
      transactionId: transactionId,
      shopName: shopName,
      money: money
    })
  },
  pay: function (e) {
    wx.showLoading({
      title: '支付中',
      mask: true
    });
    var formId = e.detail.formId;
    var that = this;
    var userId = wx.getStorageSync('userId');
    var secretKey = '7f6308be7c262e31652532d481daee71';
    var sign = common.hex_md5(userId + this.data.transactionId + formId + secretKey);

    var url = '/trade/pay';
    var requestParmas = {
      userId: userId,
      transactionId: this.data.transactionId,
      formId: formId,
      sign: sign
    };
    utils.request(url, requestParmas, function (result) {
      wx.hideLoading();
      if (result.data.code == 200) {
        var balance = wx.getStorageSync('balance');
        wx.setStorageSync('balance', balance - that.data.money * 100);
        var url = '../pay-result/pay-result' + '?money=' + that.data.money + '&shopName=' + that.data.shopName;
        wx.redirectTo({
          url: url
        })
      } else {
        utils.catchError(result);
      }
    }, function (err) {
      wx.hideLoading();
      wx.showModal({
        title: 'Error',
        content: err,
        success: function () {
          if (res.confirm) {
            wx.redirectTo({
              url: '../index/index'
            })
          }
        }
      })
    }, 'POST');
  }
})

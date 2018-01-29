
var app = getApp();
var common = require('../../utils/md5.js');
var utils = require('../../utils/util.js');
Page({
    data: {
        payMoney: '',
        focusNum: true,
        focusCode: true,
        shopName: '',
        personYue: '--',
        disabledUbox: false,
    },
    onLoad: function (options) {
        var shopId = options.shopId;
        var userId = wx.getStorageSync('userId');
        var balance = wx.getStorageSync('balance');
        var shopName = wx.getStorageSync('shopName');
        var day = new Date().getDate(); 
        var disabledUbox = false;

        if(day > 20){
          disabledUbox = true;
        }

        this.setData({
            payMoney: '',
            shopId: shopId,
            userId: userId,
            shopName: shopName,
            personYue: balance / 100,
            disabledUbox: disabledUbox
        });
    },
    bindfocus: function () {
        this.setData({
            payMoney: ''
        });
    },
    // 监听用户输入
    bindNumberInput: function (e) {
        var value = e.detail.value;
        if (value != '') {
            this.setData({
                payMoney: value
            });
        }
    },
    // 预支付确认
    confirmPay: function (e) {

        var formId = e.detail.formId;
        var that = this;
        if (this.data.payMoney == '') {
            wx.showModal({
                title: '提示',
                content: '请输入支付金额',
                showCancel: false,
                success: function (res) {
                    that.setData({
                        focusNum: true
                    });
                }
            })
        } else {
            wx.showLoading({
                title: '下单中...',
                mask: true
            });

            var url = '/trade/order';

            var secretKey = '7f6308be7c262e31652532d481daee71';
            var payMoney = (Number(this.data.payMoney).toFixed(2) * 1000) * 100 / 1000;
            var sign = common.hex_md5(this.data.userId + this.data.shopId + payMoney + secretKey);

            var requestParmas = {
                shopId: this.data.shopId,
                price: payMoney,
                sign: sign,
                userId: this.data.userId
            };
            utils.request(url, requestParmas, function (result) {
                wx.hideLoading();
                if (result.data.code == 200) {
                    var transactionId = result.data.data.transactionId;
                    var price = result.data.data.price;
                    var shopName = result.data.data.shopName;
                    wx.navigateTo({
                        url: '../confirm-pay/confirm-pay' + '?transactionId=' + transactionId + '&price=' + price +
                        '&shopName=' + shopName
                    })
                } else {
                    utils.catchError(result);
                }
            }, function (err) {
                wx.hideLoading();
                alert(err);
            }, 'POST');
        }
    },
    gotoOrders: function () {
        wx.navigateTo({
            url: '../orders/orders'
        })
    },
    gotoUboxRecharge: function(){
      wx.navigateTo({
        url: '../recharge/recharge'
      })
    },
    onPullDownRefresh: function (e) {
      wx.redirectTo({
        url: '../index/index'
      })
    },
    onShareAppMessage: function () {
      return {
        title: '七道小食堂',
        path: 'pages/index/index',
        success: function (res) {
          // 转发成功
        },
        fail: function (res) {
          // 转发失败
        }
      }
    }
})

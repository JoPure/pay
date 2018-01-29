// pages/bind/bind.js
var utils = require('../../utils/util.js');

Page({
  data: {
    cellphone: "",
    code: "",
    focusNum: true,
    focusCode: true,
    disabled: false,
    sended: false,
    sendCodeTitle: '点击获取验证码',
    sendedCodeTitle: '',
    times: 60
  },
  onLoad: function (options) {
    // 页面初始化 options为页面跳转所带来的参数

  },

  bindNumberInput: function (e) {
    var value = e.detail.value;
    if (value != '') {
      this.setData({
        cellphone: value
      })
    }
  },

  //监听用户输入的验证码
  bindCodeInput: function (e) {
    var value = e.detail.value;
    if (value != '') {
      this.setData({
        code: value
      })
    }
  },

  //监听点击获取验证时,用户是否输入手机号码
  getCode: function (e) {
    if (this.data.times > 0 && this.data.sended) {
      return;
    }
    var that = this;
    if (this.data.cellphone == '') {
      wx.showModal({
        title: '提示',
        content: '请输入手机号',
        showCancel: false,
        success: function (res) {
          that.setData({
            focusNum: true
          });
        }
      })
    }
    else {
      that.setData({
        sended: true,
      });

      var interval = setInterval(function () {
        that.setData({
          times: that.data.times - 1,
        });
        if (that.data.times == 0) {
          clearInterval(interval);
          that.setData({
            sended: false,
            times: 60
          });
        }
      }, 1000);

      var sendCodeUrl = '/user/anon/sendCode';
      var requestParmas = {
        cellphone: this.data.cellphone,
      };
      utils.request(sendCodeUrl, requestParmas, function (result) {
        if (result.data.code == 200) {
          wx.showToast({
            title: '发送成功',
            icon: 'success'
          });
        } else {
          utils.catchError(result);
        }
      });
    }
  },
  //监听绑定手机时，用户是否输入手机号及验证码
  bindCellphone: function () {
    var that = this;
    if (this.data.cellphone == '' || !(/^1[0-9]{10}$/.test(this.data.cellphone))) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的手机号',
        showCancel: false,
        success: function (res) {
          that.setData({
            focusNum: true,
            focusCode: true,
          });
        }
      })
    } else if (!this.data.code || this.data.code.length != 6) {
      wx.showModal({
        title: '提示',
        content: '请输入正确的验证码',
        showCancel: false,
        success: function (res) {
          that.setData({
            focusNum: true,
            focusCode: true,
          });
        }
      })
    } else {
      var bindCodeUrl = '/user/anon/bind';
      var requestParmas = {
        cellphone: this.data.cellphone,
        code: this.data.code
      };
      utils.request(bindCodeUrl, requestParmas, function (result) {
        if (result.data.code == 200) {
          var shopId = wx.getStorageSync('shopId');
          wx.redirectTo({
            url: '../index/index?shopId=' + shopId
          });
        } else {
          utils.catchError(result);
        }
      });
    }
  }
})
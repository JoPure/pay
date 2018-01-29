var utils = require('../../utils/util.js');
var config = require('../../utils/config.js').config;
Page({
    data: {
        dailyCount: '--',
        dailySum: '--',
        price: '--',
        transactionId: '--',
        orderData: [],
        audio: 'http://www.wan.com/huodong/media/bg-music.wav',
    },
    onReady: function (e) {
        this.audioCtx = wx.createAudioContext('myAudio')
    },
    onLoad: function (options) {
        wx.setNavigationBarTitle({
            title: wx.getStorageSync('shopName')
        })
        this.socketListener();
    },
    socketListener: function () {
        var that = this;
        var session_id = wx.getStorageSync('sessionid');
        if (session_id != "" && session_id != null) {
            var header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'SESSION=' + session_id }
        } else {
            var header = { 'content-type': 'application/x-www-form-urlencoded' }
        }
        //建立连接
        wx.connectSocket({
            url: config[config.env].baseScoketUrl ,
            data: {
            },
            header: header
        });
        //连接成功
        wx.onSocketOpen(function (res) {
            console.log('WebSocket连接已打开！');
        });
        //接受数据
        wx.onSocketMessage(function (res) {
            var data = JSON.parse(res.data);
            var dailyCount = data.dailyCount;
            var dailySum = data.dailySum;
            var price = that.data.price;
            var orderData = that.data.orderData;
            var transactionId = that.data.transactionId;
            // 如果有订单数据，则修改数组，并且音效提示
            if (data.order.length >= 1) {
                var order = data.order[0];
                orderData.unshift(order);
                if (orderData.length > 3) {
                    orderData.pop();
                }
                price = (order.price / 100).toFixed(2);
                transactionId = order.transactionId;
                that.audioCtx.seek(0);
                that.audioCtx.play();
                setTimeout(function () {
                    that.audioCtx.pause()
                }, 1000);
            }

            that.setData({
                dailyCount: dailyCount,
                dailySum: dailySum,
                price: price,
                transactionId: transactionId,
                orderData: orderData
            })
        });
        //连接失败
        wx.onSocketError(function (res) {
            wx.showModal({
                title: '提示',
                content: '连接失败，请检查网络'
            })
        });
        wx.onSocketClose(function (res) {
            wx.showModal({
                title: '提示',
                content: '连接关闭，是否重连？',
                success: function (res) {
                    if (res.confirm) {
                        that.socketListener();
                    }
                }
            })
        });
    },
    gotoDays: function () {
        wx.navigateTo({
            url: '../days/days'
        })
    }
})

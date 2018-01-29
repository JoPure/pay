// pages/days/days.js
var utils = require('../../utils/util.js');
const date = new Date()
const years = []
const months = []

for (let i = 2017; i <= date.getFullYear(); i++) {
    years.push(i)
}

for (let i = 1; i <= date.getMonth() + 1; i++) {
    months.push(i)
}

Page({
    data: {
        showColumn: false,
        showBg: false,
        showPicker: false,
        total: 0,
        years: years,
        months: months,
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        monthDataComplete: false,
        value: [9999, 1],
        payData: [],
        loading: false,
        current: 1,
        noMoreDataTips: true
    },
    onLoad: function () {
        this.requestData();
    },
    requestData: function (type) {
        wx.showLoading({
            title: '加载中',
            icon: 'loading',
            mask: true
        });
        this.setData({
            loading: true
        });
        var that = this;
        
        // var historyUrl = '/trade/day/view';
        var historyUrl = '/trade/order/view';
        var requestParmas = {
            current: this.data.current,
            size: 20,
            year: this.data.year,
            month: this.data.month,
        };
        utils.request(historyUrl, requestParmas, function (result) {
            that.setData({
                loading: false
            });
            wx.hideLoading();
            if (result.data.code == 200) {
                var data = result.data
                if (data.pages == data.current) {
                    that.setData({
                        monthDataComplete: true
                    })
                }
                let payData = [], noMoreDataTips = false;
                if (type == 'newMonthData') {
                    payData = data.data;
                } else {
                    payData = that.data.payData.concat(data.data);
                }
                if (data.data.length == 0) {
                    noMoreDataTips = true;
                }
                that.setData({
                    current: that.data.current + 1,
                    payData: payData,
                    total: data.total,
                    noMoreDataTips: noMoreDataTips
                });
            } else {
                utils.catchError(result);
            }
        }, function (err) {
            wx.hideLoading();
            alert(err);
        }, 'POST');
    },
    showColumn: function () {
        this.setData({
            showBg: true,
            showPicker: true
        })
    },
    onReady: function () {
        wx.hideNavigationBarLoading()
    },
    bindChange: function (e) {
        var that = this;
        const val = e.detail.value
        this.setData({
            year: this.data.years[val[0]],
            month: this.data.months[val[1]],
            current: 1,
            noMoreDataTips: false
        });
        setTimeout(function () {
            that.setData({
                showBg: false,
                showPicker: false,
                payData:[]
            });
            that.requestData('newMonthData');
        }, 100);
    },

    /**
     * 加载更多
     */
    loadmore: function () {
      if (this.data.loading || this.data.noMoreDataTips) {
            return;
        }
        // if (this.data.monthDataComplete) {
        //     let month = 0, year = 2017;
        //     if (this.data.month == 1) {
        //         if (year >= 2018) {
        //             month = 12;
        //             year = this.data.year - 1;
        //         } else {
        //             return;
        //         }
        //     } else {
        //         month = this.data.month - 1;
        //     }
        //     this.setData({
        //         month: month,
        //         year: year,
        //         current: 1
        //     });
        // }
        this.requestData();
    },


})

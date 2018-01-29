var config = require('./config.js').config;

function catchError(result) {
  if (result.data.code == 202) {
    wx.showModal({
      title: '提示',
      content: '该手机号没有使用权限',
    })
  } else if (result.data.code == 203) {
    wx.showModal({
      title: '提示',
      content: '数据操作失败，请联系客服',
    })
  } else if (result.data.code == 204) {
    wx.showModal({
      title: '提示',
      content: '该手机号输入错误或没有使用权限',
    })
  } else if (result.data.code == 205) {
    wx.showModal({
      title: '提示',
      content: '验证码错误，请重新输入',
    })
  }
  else if (result.data.code == 206) {
    wx.showModal({
      title: '提示',
      content: '消费金额不合法',
    })
  } else if (result.data.code == 207) {
    wx.showModal({
      title: '提示',
      content: '频繁请求，请稍后再试',
    })
  } else if (result.data.code == 208) {
    wx.showModal({
      title: '提示',
      content: '没有该用户的余额信息',
    })
  } else if (result.data.code == 209) {
    wx.showModal({
      title: '提示',
      content: '订单不存在或已经过期',
    })
  } else if (result.data.code == 210) {
    wx.showModal({
      title: '提示',
      content: '签名校验失败',
    })
  } else if (result.data.code == 211) {
    wx.showModal({
      title: '提示',
      content: '该订单已经支付',
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../index/index'
          })
        }
      }
    })
  } else if (result.data.code == 212) {
    wx.showModal({
      title: '提示',
      content: '用户余额不足',
    })
  } else if (result.data.code == 400) {
    wx.showModal({
      title: '提示',
      content: '请求参数错误',
    })
  } else if (result.data.code == 401) {
    wx.showModal({
      title: '提示',
      content: '未登录或登录超时',
      confirmText: '重新登录',
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../index/index'
          })
        }
      }
    })
  } else if (result.data.code == 402) {
    wx.showModal({
      title: '错误提示',
      content: '没有该查询权限'
    })
  }
  else if (result.data.code == 213) {
    wx.showModal({
      title: '错误提示',
      content: '非补贴设置时间'
    })
  } else if (result.data.code == 214) {
    wx.showModal({
      title: '错误提示',
      content: '友宝充值金额超过补贴金额'
    })
  }
  else if (result.data.code == 500) {
    wx.showModal({
      title: '提示',
      content: '系统错误',
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../index/index'
          })
        }
      }
    })
  } else {
    wx.showModal({
      title: '错误提示',
      content: '代码:' + result.data.code + ', 信息：' + result.data.message,
      success: function (res) {
        if (res.confirm) {
          wx.redirectTo({
            url: '../index/index'
          })
        }
      }
    });
  }
}

function request(url, params, successCallback, failCallback, method) {

  if (url.indexOf('http') == -1) {
    url = config[config.env].baseUrl + url;
  }

  method = method ? method : 'GET';
  var session_id = wx.getStorageSync('sessionid');//本地取存储的sessionID  
  if (session_id != "" && session_id != null) {
    var header = { 'content-type': 'application/x-www-form-urlencoded', 'Cookie': 'SESSION=' + session_id }
  } else {
    var header = { 'content-type': 'application/x-www-form-urlencoded' }
  }

  wx.request({
    url: url,
    method: method,
    header: header,
    data: params,
    success: function (result) {
      if (result && result.data && result.data.code) {
        successCallback(result);
      }
    },
    fail: function (err) {
      wx.showModal({
        title: '提示',
        content: '网络请求异常，请稍后再试',
      });
      failCallback(err);
    }
  })
}
module.exports = {
  catchError: catchError,
  request: request
}

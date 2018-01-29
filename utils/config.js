var config = {

  // 配置
  env: 'production',
  // 线上环境
  production: {
    baseUrl: 'https://xcx.employees.changic.net.cn',
    baseScoketUrl: 'wss://xcx.employees.changic.net.cn/websocket',
    defaultShopId: 6
  },
  // 测试环境
  staging: {
    baseUrl: 'https://t.employees.changic.net.cn/eat',
    baseScoketUrl: 'wss://t.employees.changic.net.cn/eat/websocket',
    defaultShopId: 6
  },
  // 开发环境
  dev: {
    baseUrl: 'https://dev.employees.changic.net.cn',
    baseScoketUrl: 'wss://dev.employees.changic.net.cn/websocket',
    defaultShopId: 6
  }
}

module.exports = {
  config: config
}

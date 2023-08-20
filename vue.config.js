module.exports = {
  devServer: {
    port: 8112,
    proxy: {
      '/api' : { // '/api'是代理标识，一般是每个接口前的相同部分
        target: "http://39.106.62.65:8113", // 请求地址，一般是服务器地址
        changeOrigin: true, // 是否进行跨域
        pathRewrite: { // pathRewrite的作用是把请求接口中的 '/api'替换掉，一般是替换为空""
          '^/api':""
        }
      }
    }
  },
  productionSourceMap: false
}

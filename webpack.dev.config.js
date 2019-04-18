const path = require('path');
const merge = require('webpack-merge');
const commom = require('./webpack.config.js');

module.exports = merge(commom, {
  mode: 'development',
  devtool: 'inline-source-map', // 代码关联显示方式
  devServer: {
    port: 8080,
    contentBase: path.resolve(__dirname, 'dist'), // 开发服务运行时的文件根目录
    historyApiFallback: true, // spa不跳转,history模式的路由需要true
    compress: true
  }
});

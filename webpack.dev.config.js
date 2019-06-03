const path = require('path');
const merge = require('webpack-merge');
const fs = require('fs');
const commom = require('./webpack.config.js');

module.exports = merge(commom, {
  mode: 'development',
  devtool: 'inline-source-map', // 代码关联显示方式
  devServer: {
    port: 8080,
    contentBase: [path.resolve(__dirname, 'dist')], // 开发服务运行时的文件根目录
    historyApiFallback: true, // spa不跳转,history模式的路由需要true
    compress: true,
    before: (app, server) => {
      app.get('/node_modules/*', (req, res) => {
        res.setHeader('content-type', 'application/javascript; charset=utf-8');
        const filePath = path.resolve(__dirname, '.' + req.url);
        fs.createReadStream(filePath).pipe(res);
      });
    },
    proxy: {
      '/proxy': 'http://localhost:3000',
      '/api': {
        target: 'http://testnet-jsonrpc.conflux-chain.org:18084',
        pathRewrite: { '^/api': '' },
      },
    },
  },
});

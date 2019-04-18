const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.js'), // 项目的起点入口

  // 项目输出配置
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    chunkFilename: '[name].[chunkhash].js',
    filename: '[name].[chunkhash].js',
  },
  module: {
    // 模块加载
    rules: [
      {
        test: /\.css$/, // 匹配规则
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
      {
        test: /\.less$/, // 匹配规则
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'less-loader',
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
          {
            loader: 'eslint-loader',
          },
        ],
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192, // 小于8192B的文件转为base64文件
            name: 'static/images/[name].[hash:5].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    // 插件配置
    new CleanWebpackPlugin(['dist']), // 清空编译输出文件夹
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname + '/static'), // 打包的静态资源目录地址
        to: 'static', // 打包到dist下面的static
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'), // 模板
      filename: 'index.html',
    }), // 生成Html5文件
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        commons: {
          name: 'commons',
          chunks: 'initial',
          minChunks: 2,
        },
      },
    },
  },
};

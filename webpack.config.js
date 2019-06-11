const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const fs = require('fs');
const webpack = require('webpack');

const devMode = process.env.NODE_ENV !== 'production';
/* eslint no-underscore-dangle: 0 */
const cdnGetJs = WebpackCdnPlugin._getJs;
const cdnModules = [
  {
    name: 'react',
    var: 'React',
    path: 'umd/react.production.min.js',
  },
  {
    name: 'prop-types',
    var: 'PropTypes',
    path: 'prop-types.min.js',
  },
  {
    name: 'react-dom',
    var: 'ReactDOM',
    path: 'umd/react-dom.production.min.js',
  },
  {
    name: 'react-router-dom',
    var: 'ReactRouterDOM',
    path: 'umd/react-router-dom.min.js',
  },
  {
    name: 'react-intl',
    var: 'ReactIntl',
    path: 'dist/react-intl.min.js',
  },
  {
    name: 'moment',
    var: 'moment',
    path: 'min/moment-with-locales.js',
  },
  {
    name: 'styled-components',
    var: 'styled',
    path: 'dist/styled-components.min.js',
  },
  {
    name: 'echarts',
    var: 'echarts',
    path: 'dist/echarts.min.js',
  },
];
function cpFile(inFilePath, outFilePath) {
  return new Promise((resolve, reject) => {
    const writeFile = fs.createWriteStream(outFilePath, {
      flags: 'a',
    });
    fs.createReadStream(inFilePath).pipe(writeFile);
    writeFile.on('error', reject);
    writeFile.on('close', resolve);
  });
}

const vendorPlugin = {
  apply: (compiler) => {
    compiler.hooks.afterEmit.tap('vendorPlugin', () => {
      if (devMode) return;
      const writeVendor = async () => {
        for (let i = 0; i < cdnModules.length; i++) {
          /* eslint no-await-in-loop: 0 */
          await cpFile(
            path.resolve(__dirname, './node_modules', cdnModules[i].name, cdnModules[i].path),
            path.resolve(__dirname, './dist/vendor.js')
          );
        }
      };
      writeVendor();
    });
  },
};

WebpackCdnPlugin._getJs = (...args) => {
  const cdnUrls = cdnGetJs(...args);
  if (devMode === false) {
    const combineUrl = 'https://cdn.jsdelivr.net/combine/';
    const cdnUrlPath = cdnUrls.map((v) => {
      return v.replace('https://cdn.jsdelivr.net/', '');
    });
    return [combineUrl + cdnUrlPath.join(',')];
  }
  return cdnUrls;
};

module.exports = {
  entry: path.resolve(__dirname, 'src', 'index.js'), // 项目的起点入口

  // 项目输出配置
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    chunkFilename: '[name].[chunkhash].js',
    filename: '[name].[chunkhash].js',
  },
  plugins: [
    // 插件配置
    new CleanWebpackPlugin(['dist']), // 清空编译输出文件夹
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname + '/static'), // 打包的静态资源目录地址
        to: '', // 打包到dist下面
      },
    ]),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src', 'index.html'), // 模板
      filename: 'index.html',
      inject: false,
    }), // 生成Html5文件
    new WebpackCdnPlugin({
      modules: cdnModules.map((v) => Object.assign({}, v)),
      prod: !devMode,
      publicPath: '/node_modules',
      prodUrl: 'https://cdn.jsdelivr.net/npm/:name@:version/:path',
    }),
    new MiniCssExtractPlugin({
      filename: devMode ? '[name].css' : '[name].[hash].css',
      chunkFilename: devMode ? '[id].css' : '[id].[hash].css',
    }),
    vendorPlugin,
    new webpack.NormalModuleReplacementPlugin(
      /node_modules\/antd\/lib\/style\/index\.less/,
      path.resolve(__dirname, './src/globalStyles/ant-pfx.less')
    ),
  ],
  module: {
    // 模块加载
    rules: [
      {
        test: /\.css$/, // 匹配规则
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              hmr: process.env.NODE_ENV === 'development',
            },
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
            options: {
              javascriptEnabled: true,
            },
          },
        ],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 8192, // 小于8192B的文件转为base64文件
            name: 'images/[name].[hash:5].[ext]',
          },
        },
      },
      { test: /\.(woff|woff|woff2|eot|ttf|otf)$/, loader: 'url-loader?limit=8192' },
    ],
  },
  optimization: {
    minimizer: [
      new OptimizeCSSAssetsPlugin({
        cssProcessorPluginOptions: {
          preset: ['default', { discardComments: { removeAll: true } }],
        },
      }),
    ],
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

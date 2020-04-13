const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const commom = require('./webpack.config.js');

module.exports = merge(commom, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [],
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true,
        sourceMap: true,
        terserOptions: {
          warnings: false,
          parse: {},
          compress: {
            drop_console: true,
          },
          mangle: true,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_fnames: false,
        },
      }),
    ],
  },
});

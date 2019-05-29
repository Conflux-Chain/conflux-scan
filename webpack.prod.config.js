const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const merge = require('webpack-merge');
const WebpackCdnPlugin = require('webpack-cdn-plugin');
const commom = require('./webpack.config.js');

module.exports = merge(commom, {
  mode: 'production',
  devtool: 'source-map',
  plugins: [
    new WebpackCdnPlugin({
      modules: [
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
      ],
      publicPath: '/node_modules',
      prodUrl: 'https://cdn.jsdelivr.net/npm/:name@:version/:path',
    }),
  ],
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        parallel: true,
        sourceMap: true,
        uglifyOptions: {
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

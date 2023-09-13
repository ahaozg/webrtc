'use strict';
const path = require('path');
const utils = require('./utils');
const webpack = require('webpack');
const chalk = require('chalk');
const config = require('../config');
const merge = require('webpack-merge');
const baseWebpackConfig = require('./webpack.base.conf');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const vueLoaderConfig = require('./vue-loader.conf');

const env = process.env.NODE_ENV === 'testing'
  ? require('../config/test.env')
  : require('../config/prod.env');


function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay,
  },
});


const assetsPath = function (_path) {

  return path.posix.join('static', _path);
};

function getWebpackConfig(configOptions) {
  console.log(chalk.blue('【当前构建参数是】：' + JSON.stringify(configOptions, null, 4)));
  const options = configOptions || {
    entry: {
      // 名称
      name: 'app',
      // 入口文件
      path: './src/main.js',
    },
    output: {
      // 输出路径
      path: config.build.assetsRoot,
    },

  };
  const entryName = options.entry.name;
  const entryPath = options.entry.path;
  const outputPath = options.output.path;

  const webpackConfig = {
    context: path.resolve(__dirname, '../'),
    resolve: {
      extensions: ['.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        '@': resolve('src'),
      },
    },
    entry: {
      [entryName]: [entryPath],
    },
    devtool: config.build.productionSourceMap ? config.build.devtool : false,
    output: {
      path: path.resolve(__dirname, outputPath),
      filename: assetsPath('[name].js'),
      chunkFilename: assetsPath('[id].js'),
    },
    module: {
      rules: [
        ...utils.styleLoaders({
          sourceMap: config.build.productionSourceMap,
          extract: true,
          usePostCSS: true,
        }),
        ...(config.dev.useEslint ? [createLintingRule()] : []),
        {
          test: /\.vue$/,
          loader: 'vue-loader',
          options: vueLoaderConfig,
        },
        {
          //以.worker.js结尾的文件将被worker-loader加载
          test: /\.worker\.js$/,
          use: {
            loader: 'worker-loader',
            options: {inline: true, name: 'workerName.[hash].js'},
          },
        },
        {
          test: /\.js$/,
          include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')],
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@vue/babel-preset-jsx',
              ],
              plugins: [
                [
                  '@babel/plugin-transform-runtime',
                  {'corejs': 2},
                ],
                '@babel/plugin-proposal-optional-chaining',
                '@babel/plugin-proposal-nullish-coalescing-operator',
                '@babel/plugin-transform-modules-commonjs',
              ],
            },
          },
        },
        {
          test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('img/[name].[hash:7].[ext]'),
          },
        },
        {
          test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('media/[name].[hash:7].[ext]'),
          },
        },
        {
          test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: utils.assetsPath('fonts/[name].[hash:7].[ext]'),
          },
        },
      ],
    },
    plugins: [
      // http://vuejs.github.io/vue-loader/en/workflow/production.html
      new webpack.DefinePlugin({
        'process.env': env,
      }),
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
          },
        },
        sourceMap: config.build.productionSourceMap,
        parallel: true,
      }),
      new MiniCssExtractPlugin({
        filename: 'css/[name].css',
        chunkFilename: 'css/[contenthash].css',  // use contenthash *
      }),
      new VueLoaderPlugin(),
      // Compress extracted CSS. We are using this plugin so that possible
      // duplicated CSS from different components can be deduped.
      new OptimizeCSSPlugin({
        cssProcessorOptions: config.build.productionSourceMap
          ? {safe: true, map: {inline: false}}
          : {safe: true},
      }),
      // enable scope hoisting
      new webpack.optimize.ModuleConcatenationPlugin(),
    ],
    node: {
      // prevent webpack from injecting useless setImmediate polyfill because Vue
      // source contains it (although only uses it if it's native).
      setImmediate: false,
      // prevent webpack from injecting mocks to Node native modules
      // that does not make sense for the client
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty',
      child_process: 'empty',
    },
  };
  return webpackConfig;
}

module.exports = getWebpackConfig;

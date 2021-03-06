const path = require('path');
const merge = require('webpack-merge');
const webpack = require('webpack');

// webpack plugins
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WriteFilePlugin = require('write-file-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const loaders = require('./loaders');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

function prodConfig(config) {
  return {
    entry: {
      main: [config.paths.entryFile],
    },
    plugins: [
      new ExtractTextPlugin({
        filename: `css/[name].css`,
        allChunks: true,
      }),
    ],
  };
}

function devConfig(config) {
  return {
    watch: true,
    entry: {
      main: [config.paths.entryFile],
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new WriteFilePlugin(),
    ],
    devtool: 'cheap-module-source-map',
    devServer: {
      contentBase: config.paths.build,
      inline: true,
      hot: true,
      publicPath: config.paths.assetPath,
    },
  };
}

function configByEnv(config) {
  if (isDev) {
    return devConfig(config);
  }
  if (isProd) {
    return prodConfig(config);
  }
  throw new Error(`Unknown NODE_ENV`);
}

function base(config) {
  return {
    target: 'web',
    output: {
      path: config.paths.build,
      publicPath: './',
      pathinfo: isDev,
      filename: `[name].js`,
      chunkFilename: 'c[name].js',
    },
    resolve: {
      modules: [
        config.paths.appRoot,
        path.resolve(__dirname, '../node_modules'),
      ],
      extensions: ['.tsx', '.ts', '.jsx', '.js', '.scss', '.json'],
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: 'birdofbytes',
        filename: 'index.html',
        template: config.paths.template,
        inject: true,
      }),
    ],
  };
}

module.exports.configureWebpack = (config) => merge(
  base(config),
  loaders,
  configByEnv(config),
);

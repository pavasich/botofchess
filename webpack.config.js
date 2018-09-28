const path = require('path');
const build = require('./webpack/build');

const buildConfig = {
  paths: {
    entryFile: path.resolve(__dirname, './src/bird-of-bytes/index.tsx'),
    appRoot: path.resolve(__dirname, './src'),
    projectRoot: __dirname,
    build: path.resolve(__dirname, './build'),
    assetPath: path.resolve(__dirname, './assets'),
    template: path.resolve(__dirname, './index.html'),
  },
  alias: {},
};

module.exports = build.configureWebpack(buildConfig);

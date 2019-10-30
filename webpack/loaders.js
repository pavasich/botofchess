const ExtractTextPlugin = require('extract-text-webpack-plugin');

const PRODUCTION = process.env.NODE_ENV === 'production';

function cssLoader() {
  if (PRODUCTION) {
    return {
      test: /\.s?css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader?sourceMap',
          {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [
                  require('autoprefixer'),
                  require('postcss-reporter'),
                ];
              },
            },
          },
          'sass-loader',
        ],
      }),
      exclude: '/node_modules/',
    };
  }
  return {
    test: /\.s?css$/,
    exclude: /node_modules\/.*/,
    use: [
      'style-loader',
      'css-loader',
      {
        loader: 'postcss-loader',
        options: {
          plugins() {
            return [
              require('autoprefixer'),
              require('postcss-reporter'),
            ];
          },
        },
      },
      'sass-loader',
    ],
  };
}

const assetLoaders = [
  {
    test: /\.[jt]sx?$/,
    loader: 'babel-loader',
    exclude: /node_modules/,
    options: {
      presets: ['@babel/preset-typescript', '@babel/preset-react', ['@babel/preset-env', { modules: false }]],
    },
  },
  {
    test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'file-loader',
  },
  {
    test: /\.otf(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'file-loader',
    exclude: /node_modules/,
  },
  {
    test: /\.jpe?g$|\.gif$|\.png$/i,
    loader: 'file-loader?name=[path][name].[ext]',
    exclude: /node_modules/,
  },
  {
    test: /\.woff(\d+|\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url-loader?limit=10000&mimetype=application/font-woff',
  },
  {
    test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url-loader?limit=10000&mimetype=application/octet-stream',
  },
  {
    test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
    loader: 'url-loader?limit=10000&mimetype=image/svg+xml',
  },
];


module.exports = {
  module: {
    rules: [
      ...assetLoaders,
      cssLoader(),
    ],
  },
};

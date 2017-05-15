const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: [
    './components/utils/mouse.js',
    './components/landing_animation.jsx',
    './components/hue.jsx',
    './components/saturation.jsx',
    './components/value.jsx',
    './components/verbs.jsx'
  ],
  output: {
    path: path.resolve(__dirname),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    })
  ],
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react']
        }
      },
      {
        test: /\.scss$/,
        loaders: [
          'style-loader',
          { loader: 'css-loader', options: { importLoaders: 2 } },
          'sass-loader'
        ],
      }
    ]
  }
};

const path = require('path');

module.exports = {
  entry: './lib/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    loaders: [
      {
        test: [/\.jsx?$/],
        exclude: /(node_modules)/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015']
        }
      }
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8000
  }
};

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');

// const extractSass = new ExtractTextPlugin({
//     filename: "./styles.css",
//     // disable: process.env.NODE_ENV === "development"
// });

module.exports = {
  entry: './lib/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/'
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
    ],
    rules: [
        {
          test: /\.scss$/,
          use: ['css-hot-loader'].concat(ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: ['css-loader', 'sass-loader']
          }))
        },
      ]
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'styles.css'
    })
  ],
  devtool: 'inline-source-map',
  devServer: {
    contentBase: path.join(__dirname, "dist"),
    compress: true,
    port: 8000
  }
};

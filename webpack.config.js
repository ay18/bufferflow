const ExtractTextWebpackPlugin = require('extract-text-webpack-plugin');
const path = require('path');

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
      },
    ],
    rules: [
			{
        test: /\.scss/,
        // HMR for styles
        use: ['css-hot-loader'].concat(ExtractTextWebpackPlugin.extract({
          fallback: 'style-loader',
          use: ['css-loader','sass-loader'],
        })),
      },
			{
				test: /\.(js)$/,
				exclude: /(node_modules|bower_components)/,
				use : ['babel-loader']
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[path][name].[ext]',
            }
          }
        ]
      }
		]
  },
  plugins: [
    new ExtractTextWebpackPlugin({ 
      filename: 'styles.css', disable: false, allChunks: true 
    }),
  ],
  devtool: 'inline-source-map',
  devServer: {
    // contentBase: path.join(__dirname, "dist"),
    hot: true,
    compress: true,
    inline: true,
    port: 8000
  }
};

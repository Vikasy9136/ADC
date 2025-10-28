const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/renderer/src/index.tsx',
  target: 'web',  // Changed from 'electron-renderer'
  devtool: 'source-map',
  
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
  },
  
  output: {
    filename: 'renderer.js',
    path: path.resolve(__dirname, 'dist/renderer'),
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/renderer/public/index.html',
    }),
  ],
  
  devServer: {
    port: 3000,
    hot: false,        // ❌ Disable hot reload
    liveReload: false, // ❌ Disable live reload
    historyApiFallback: true,
    static: {
      directory: path.join(__dirname, 'public'),
    },
  },
};

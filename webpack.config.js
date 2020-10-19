const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/react/index.tsx',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  output: {
    path: path.join(__dirname, '/out'),
    filename: 'boxhero-ui.js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'awesome-typescript-loader',
        options: {
          configFileName: './src/react/tsconfig.json',
          useCache: true,
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './templates/main.html',
    }),
  ],
  externals: {
    electron: 'electron',
  },
};

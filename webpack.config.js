const path = require('path');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
  .BundleAnalyzerPlugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'production',
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
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      reportFilename: '../last-bundle-info.html',
      openAnalyzer: false,
    }),
  ],
  externals: {
    electron: 'electron',
  },
  watchOptions: {
    ignored: ['src/electron/**', 'node_modules/**'],
  },
};

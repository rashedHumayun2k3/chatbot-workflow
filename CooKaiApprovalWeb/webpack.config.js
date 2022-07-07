const path = require('path');
const Dotenv = require('dotenv-webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: {
    // "babel-polyfill",
    index: './ClientApp/src/index.js',
  },
  output: {
    path: path.resolve(__dirname, './ClientApp/dist/'),
    filename: 'bundle.js',
  },
  // optimization: {
  //    splitChunks: {
  //        chunks: 'all',
  //    },
  // },
  // devtool: "inline-source-map",
  plugins: [
    new Dotenv(),
    // new BundleAnalyzerPlugin(),
    // new CompressionPlugin({
    //    algorithm: "gzip",
    //    test: /\.js$|\.css$|\.html$/,
    //    threshold: 10240,
    //    minRatio: 0.8
    // }),
  ],
  module: {
    rules: [
      {
        use: {
          loader: 'babel-loader',
        },
        test: /\.jsx?$/,
        exclude: /node_modules/, // excludes node_modules folder from being transpiled by babel. We do this because it's a waste of resources to do so.
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
};

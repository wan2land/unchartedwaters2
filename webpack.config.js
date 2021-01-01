const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')


module.exports = {
  mode: 'production',
  entry: __dirname + '/src/entry.ts',
  output: {
    path: __dirname +  '/dist',
    filename: '[name]_[hash].js',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loaders: 'vue-loader',
      },
      {
        test: /\.(js|ts)$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: {
          loader: 'url-loader',
        },
      },
      {
        test: /\.css$/,
        use: [
          // 'style-loader',
          MiniCssExtractPlugin.loader,
          { loader: 'css-loader', options: { importLoaders: 1 } },
          'postcss-loader',
        ],
      },
    ],
  },
  devtool: '#source-map',
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: __dirname + '/src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name]_[hash].css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: __dirname + '/CNAME' },
        { from: 'static', to: '' },
        { from: __dirname + '/node_modules/js-dos/dist/wdosbox.js', to: 'static' },
        { from: __dirname + '/node_modules/js-dos/dist/wdosbox.wasm.js', to: 'static' },
        { from: 'game/water2.zip', to: 'static' },
        { from: 'game/mod_junghwa_v3.0.zip', to: 'static' },
        { from: 'game/mod_ernst_v1.11.zip', to: 'static' },
      ],
    }),
  ],
}

const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')


module.exports = {
  mode: 'production',
  entry: __dirname + '/src/index.ts',
  output: {
    path: __dirname +  '/dist',
    filename: 'index.js',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
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
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: __dirname + '/src/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'style.css',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: __dirname + '/CNAME' },
        { from: __dirname + '/node_modules/js-dos/dist/wdosbox.js', to: 'static' },
        { from: __dirname + '/node_modules/js-dos/dist/wdosbox.wasm.js', to: 'static' },
        { from: 'game/water2.zip', to: 'static' },
      ],
    }),
  ],
}

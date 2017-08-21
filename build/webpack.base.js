const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const helpers = require('./helpers')
const tslintConfig = require('../tslint.json')

module.exports = {
  entry: {
    'polyfills': './ex/polyfills.ts',
    'vendor': './ex/vendor.ts',
    'app': './ex/main.ts',
  },
  
  resolve: {
    extensions: ['.ts', '.js', '.json'],
  },
  
  module: {
    rules: [
      {
        test: /\.ts/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'tslint-loader',
        options: {
          configuration: tslintConfig,
        },
      },
      {
        test: /\.ts$/,
        loaders: [
          'ng-router-loader',
          {
            loader: 'awesome-typescript-loader',
            options: { configFileName: helpers.root('ex', 'tsconfig.json') },
          },
          'angular2-template-loader',
          'angular-router-loader',
        ],
      },
      {
        test: /\.html$/,
        loader: 'html-loader',
      },
      {
        test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
        loader: 'url-loader?name=assets/[name].[hash].[ext]',
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader',
        }),
      },
      {
        test: /\.css$/,
        include: helpers.root('src', 'app'),
        loader: 'raw-loader',
      },
      {
        test: /\.(sass|scss)$/,
        use: [
          'raw-loader',
          'sass-loader',
        ],
      },
    ],
    // clear critical dependency warning
    exprContextCritical: false,
  },
  
  plugins: [
    // angular issues#11580
    new webpack.ContextReplacementPlugin(
      /angular(\\|\/)core(\\|\/)@angular/,
      helpers.root('./ex'),
      {}
    ),
    
    new webpack.optimize.CommonsChunkPlugin({
      name: ['app', 'vendor', 'polyfills'],
    }),
    
    new HtmlWebpackPlugin({
      template: 'ex/index.html',
    }),
  ],
}
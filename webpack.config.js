const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const loader = require('sass-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

const devServer = (isDev) => !isDev ? {} : {
  devServer : {
    open: true,
    hot: true,
    port: 8080,
    contentBase: path.join(__dirname, 'app')
  }
};

// const esLintPlugin = (isDev) => isDev ? [] : [ new ESLintPlugin({ extensions: ['ts', 'js'] }) ];



module.exports = ({develop}) => ({
  mode: develop ? 'development' : 'production',
  devtool: develop ? 'inline-source-map' : false,  
  entry: {
    async: './src/ts/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'app'),
    filename: '[name].[contenthash].js',
    assetModuleFilename: 'assets/[hash][ext]',
  },
  experiments: {
    topLevelAwait: true,
    asset: true,
  },
  module: {
    rules: [
      {
        test: /\.[tj]s$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg|svg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ]
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      // title: 'myApp',
      template: './index.html',
    }),
    new CopyPlugin({
      patterns: [
        {
          from: './src/assets', to: './assets',
        },
      ]
    }),
    new CleanWebpackPlugin({
      cleanStaleWebpackAssets: false,
    }),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    // new ESLintPlugin({ extensions: ['ts', 'js'] }),
    // ...esLintPlugin(develop),
  ],
  ...devServer(develop),
});
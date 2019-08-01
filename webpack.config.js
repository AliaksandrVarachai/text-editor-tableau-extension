const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');

const resources = path.resolve(__dirname, 'resources');
const src = path.resolve(__dirname, 'src');
const dist = path.resolve(__dirname, 'dist');
const nodeModules = path.resolve(__dirname, 'node_modules');
const images = path.resolve(resources, 'images');
const ssl = path.resolve(resources, 'ssl');
const vendors = path.resolve(resources, 'vendors');
const config = path.resolve(src, 'config');
const devServerKey = fs.readFileSync('./resources/ssl/dev-server-key.pem');
const devServerCert = fs.readFileSync('./resources/ssl/dev-server-cert.pem');

const polyfills = [
  'whatwg-fetch',
  //'idempotent-babel-polyfill',  !!!deprecated!!!
];

module.exports = function(env, argv) {
  const isProduction = argv.mode === 'production';
  const isWebpackDevServerStarted = process.argv[1].indexOf('webpack-dev-server') > -1;

  return {
    entry: {
      'index': [...polyfills, './src/index']
    },
    output: {
      filename: '[name].js',
      path: dist,
      publicPath: '/'
    },
    devtool: isProduction ? 'source-map' : 'cheap-source-map', //'eval' does not meet CSP

    plugins: [
      isWebpackDevServerStarted ? null : new CleanWebpackPlugin(),
      new webpack.DefinePlugin({
        // 'process.env.NODE_ENV': JSON.stringify(argv.mode), will be set by Webpack mode option
        'process.env.NODE_IS_WEBPACK_DEV_SERVER_STARTED': JSON.stringify(isWebpackDevServerStarted),
      }),
      new HtmlPlugin({
        filename: '[name].[ext]',
        template: path.join(src, 'index.html')
      }),
      new CopyPlugin([
        {
          from: `${vendors}/*`,
          to: `${dist}/vendors/[name].[ext]`
        }, {
          from: path.join(src, 'TextEditorTableauExtension.trex')
        }
      ]),
    ].filter(Boolean),

    module: {
      rules: [
        {
          // CSS from third-party modules
          test: /\.css$/,
          include: [path.resolve(nodeModules, 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css')],
          use: [
            {
              loader: 'style-loader',

            }, {
              loader: 'css-loader',
            }
          ]
        },
        {
          test: /\.p?css$/,
          include: [src, path.resolve(resources, 'webpack/dev-server-local-test-tools')],
          use: [
            {
              loader: 'style-loader',

            }, {
              loader: 'css-loader',
              options: {
                modules: true,
                sourceMap: !isProduction,
                localIdentName: '[name]__[local]--[hash:base64:5]' //must be the same as for react-css-modules
              }
            // TODO: add post-css loader
            // }, {
            //   loader: 'postcss-loader'
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|gif)$/,
          include: [images],
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: getOutputPathRelativelyToSrc
              }
            }
          ]
        },
        {
          type: 'javascript/auto',
          test: /\.json$/,
          include: config,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                // outputPath: getOutputPathRelativelyToSrc
              }
            }
          ]
        },
        {
          test: /\.html$/,
          include: src,
          use: 'html-loader'
        },
        {
          test: /\.js$/,
          include: src,
          use: 'babel-loader'
        }
      ]
    },

    devServer: {
      contentBase: dist,
      allowedHosts: [
        '.epam.com', // the safe alternative to {disableHostCheck: true} option
        '.tableau.com',
      ],
      port: 8765,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      https: env && env.https === 'true' ? {
        key: devServerKey,
        cert: devServerCert,
        ca: devServerCert
      } : false
    }
  };
};


function getOutputPathRelativelyToSrc(url, resourcePath, context) {
  const relativePath = path.relative(resources, resourcePath);
  return path.join(dist, relativePath);
}

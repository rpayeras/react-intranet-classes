const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const EncodingPlugin = require('webpack-encoding-plugin');

const sourcePath = path.join(__dirname, 'src');
const staticsPath = path.join(__dirname, 'public');

//Configuracion de plugins y entorno
module.exports = function (env) {
  const nodeEnv = env && env.prod ? 'production' : 'development';
  const isProd = nodeEnv === 'production';
  
  const plugins = [
    new EncodingPlugin({
      encoding: 'UTF-8'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor',
      filename: 'vendor.bundle.js',
      minChunks: Infinity
    }),
    new webpack.EnvironmentPlugin({
      NODE_ENV: nodeEnv,
    }),
    new ExtractTextPlugin('app.css'),
    new webpack.NamedModulesPlugin(),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default']
    })
  ];

  //Si es producción (minificacion, encoding...) si es desarrollo (server, autoreload...)
  if (isProd) {
    plugins.push(
      // Solo extraemos un idioma de la libreria moment js
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /es/),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
        debug: false
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
          screw_ie8: true,
          conditionals: true,
          unused: true,
          comparisons: true,
          sequences: true,
          dead_code: true,
          evaluate: true,
          if_return: true,
          join_vars: true,
        },
        output: {
          comments: false,
        },
      })
    );
  } else {
    plugins.push(
      new webpack.ContextReplacementPlugin(/moment[\/\\]locale$/, /es/),
      new webpack.HotModuleReplacementPlugin()
    )
  }

  //Inicio de webpack
  return {
    devtool: isProd ? 'source-map' : 'eval',
    context: sourcePath,
    entry: {
      js: './index.js',
      vendor: ['react', 'react-dom','react-router-dom','jquery','popper.js','bootstrap','moment','flatpickr']
    },
    output: {
      path: staticsPath,
      filename: '[name].bundle.js',
    },
    //Aplicamos plugins para tratar todos los tipos de archivo del proyecto
    module: {
      rules: [
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: {
            loader: 'file-loader',
            query: {
              name: '[name].[ext]'
            }
          }
        },
        { test: /\.scss/, loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader!sass-loader'}) },
        { test: /\.css/, loader: ExtractTextPlugin.extract({fallback:'style-loader', use:'css-loader'}) },
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: [
            'babel-loader'
          ],
        },
        { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader?mimetype=image/svg+xml&name=[name].[ext]&outputPath=fonts/' },
        { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader?mimetype=application/font-woff&name=[name].[ext]&outputPath=fonts/' },
        { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader?mimetype=application/font-woff&name=[name].[ext]&outputPath=fonts/' },
        { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader?mimetype=application/octet-stream&name=[name].[ext]&outputPath=fonts/' },
        { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader?name=[name].[ext]&outputPath=fonts/'},
        { test: /\.png(\?v=\d+\.\d+\.\d+)?$/, use: 'file-loader?name=[name].[ext]&outputPath=img/'}
      ],
    },
    resolve: {
      extensions: ['.webpack-loader.js', '.web-loader.js', '.loader.js', '.js', '.jsx'],
      modules: [
        path.resolve(__dirname, 'node_modules'),
        sourcePath
      ]
    },
    //Incluimos las utilidades configuradas anteriormente
    plugins,
    //Opciones de optimizacion
    performance: isProd && {
      maxAssetSize: 100,
      maxEntrypointSize: 300,
      hints: 'warning',
    },
    //Opciones de la consola
    stats: {
      colors: {
        green: '\u001b[32m',
      }
    },
    //Server de desarrollo y live reload
    devServer: {
      contentBase: './public',
      historyApiFallback: true,
      port: 3000,
      compress: isProd,
      inline: !isProd,
      hot: !isProd,
      quiet: false,
      noInfo: false,
      stats: {
        assets: true,
        children: false,
        chunks: false,
        hash: false,
        modules: false,
        publicPath: true,
        timings: true,
        version: false,
        warnings: true,
        colors: {
          green: '\u001b[32m',
        }
      },
      watchOptions: {
        poll: true,
        ignored: /node_modules/        
      },
    }
  };
};

const TerserPlugin = require('terser-webpack-plugin');
module.exports = {
    //mode: 'development',
    mode: 'production',
    //production
    entry: {
        index: __dirname + '/index.js'
    },
    output: {
        path: __dirname + '/dist',//产出路径，一般放在dist目录下
        filename: '[name]_substrate.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules|bower_components)/,
                use: 'babel-loader'
            }
        ]
    },
    resolve: {
        alias: {
          crypto: false,
          stream: false,
          assert: false,
          http: false,
          https: false
        }
    },
   
    optimization: {
        minimizer: [new TerserPlugin({
             //sourceMap: true,
             terserOptions: {
                 safari10: true
             }
        })],
    }
}


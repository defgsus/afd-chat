/*
 * GPL 3.0 (C) 2017 Stephan S. Hepper
 *
 */

// ./node_modules/i18next-parser/bin/cli.js ./frontend/js -r -o ./frontend/i18n -l en,de

var path = require('path');
var webpack = require('webpack');

const PathConfig = {
    main_project: './frontend'
};


const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackShellPlugin = require('webpack-shell-plugin');

const extractSass = new ExtractTextPlugin({
    filename: 'css/[name].css',
    disable: process.env.NODE_ENV === 'development'
});

const runI18nextParser = new WebpackShellPlugin({
    onBuildStart: ['./node_modules/i18next-parser/bin/cli.js ./frontend/js -r -o ./frontend/i18n -n app -l en,de']
})


module.exports = {
    entry: PathConfig.main_project+'/js/main.js',
    devtool: 'source-map',
    output: {
        path: path.resolve('./static/'),
        filename: '[name].js',
        publicPath: '../static/'
    },
    resolve: {
        modules: [
            path.resolve('./frontend/js'),
            path.resolve('./frontend/css'),
            path.resolve('./node_modules')
        ],
        /*alias: {
           'jquery-ui': 'jquery-ui-dist/jquery-ui.js'
        }*/
    },

    // we need to make jquery available in global scope to every plugin in order to avoid
    // missing imports - try to remove this and see foundation fail :(
    plugins: [
        //extractSass,
        //runI18nextParser,
        new ExtractTextPlugin("[name].css")
    ],


    module: {
        rules: [
            {
                test: /\.js(x?)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015', 'stage-0'],
                    plugins: [
                        'transform-decorators-legacy',
                        'syntax-dynamic-import',
                        'transform-async-to-generator',
                        'transform-regenerator',
                        'transform-runtime'
                    ]
                }
            },
            {
                test: /\.scss$/,
                use: extractSass.extract({
                    use: [{
                        loader: 'css-loader'
                    }, {
                        loader: 'sass-loader'
                    }],
                    // use style-loader in development
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract({ fallback: 'style-loader', use: 'css-loader' })
            },
            {
                test: /\.(jpg|png|svg)$/,
                loader: 'file-loader',
                options: {
                    name: './images/[name].[hash].[ext]',
                    limit: 32768,
                }
            },
        ]
    }
}
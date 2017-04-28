var webpack = require('webpack');

module.exports = {
    //插件项
    plugins: [],
    //页面入口文件配置
    entry: {
        "tomato-jquery": "./src/tomato-jquery"
    },
    //入口文件输出配置
    output: {
        filename: '[name].js',
        library: '[name]',
        libraryTarget: 'umd',
        //umdNamedDefine: true
    },
    module: {
        //加载器配置
        loaders: [
            { test: /\.scss$/, loader: 'style-loader!css-loader!sass-loader' },
            { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' },
            { test: /\.html$/,loader: 'html' }
        ],
    },
    resolve: {
        extensions: ['','.js', '.scss','.html']
    },
    externals: {
        "@po-to/tomato": "@po-to/tomato"
    },
};

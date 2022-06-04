const spritesGeneratorPlugin = require('./webpack-plugins/spritesGenerator').default;
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

let lang = process.env.VUE_APP_LANG.split("_")[0]
let filename = `AAPLVN_BN1_${process.env.VUE_APP_NAME.toUpperCase()}_${lang.toUpperCase()}_${process.env.VUE_APP_VERSION.toUpperCase()}`

module.exports = {
    publicPath: '',
    outputDir: 'app/',
    indexPath: filename + '.html',
    configureWebpack: {
        plugins: [
            new HtmlWebpackPlugin({
                inlineSource: '.(js|css)$', // embed all javascript and css inline
                template: 'public/index.html'
            }),
            new HtmlWebpackInlineSourcePlugin()
        ],
        optimization: {
            splitChunks: false
        }
    },
    chainWebpack: config => {
        config.plugins.delete('prefetch');

        const svgRule = config.module.rule('svg');

        svgRule.uses.clear();
        svgRule
            .use('vue-svg-loader')
            .loader('vue-svg-loader')
            .options({
                svgo: {
                    plugins: [{removeDimensions: false}, {removeViewBox: false}, {prefixIds: true}]
                }
            });
    }
};

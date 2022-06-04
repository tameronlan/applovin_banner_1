const path = require('path');
const SpritesmithPlugin = require('webpack-spritesmith');

/**
 * @param {string} spriteName Folder name at /src/assets/**spriteName**
 */
module.exports.default = function(spriteName) {
    return new SpritesmithPlugin({
        src: {
            cwd: path.resolve(__dirname, '../src/assets/' + spriteName),
            glob: '*.png'
        },
        retina: '-2x',
        target: {
            image: path.resolve(__dirname, '../src/assets/generated-sprite-' + spriteName + '-[hash:5].png'),
            css: [
                [
                    path.resolve(__dirname, '../src/scss/_sprites-' + spriteName + '.scss'),
                    {
                        format: 'sprites_template',
                        spritesheetName: spriteName
                    }
                ]
            ]
        },
        spritesmithOptions: {
            algorithm: 'left-right',
            padding: 5
        },
        apiOptions: {
            cssImageRef: '~@/assets/generated-sprite-' + spriteName + '-[hash:5].png'
        }
    });
};

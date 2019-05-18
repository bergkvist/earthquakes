const webpack = require('webpack')

// This means we get autocomplete:
const { options } = webpack({
    entry: './src/index.js',
    mode: 'production',
    
    // Used for webpack-dev-server
    devServer: {
        contentBase: './dist/',
        compress: true,
        port: 9000,
        host: '0.0.0.0'
    }
})

module.exports = options
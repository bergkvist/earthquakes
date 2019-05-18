const webpack = require('webpack')

// This means we get autocomplete:
const { options } = webpack({
    entry: './src/index.js',
    mode: 'development',
    
    // Use typescript
    resolve: { extensions: ['.ts', '.tsx', '.js'] },
    module: {
        rules: [{ test: /\.tsx?$/, loader: 'ts-loader' }]
    },
    
    // Used for webpack-dev-server
    devServer: {
        contentBase: './dist/',
        compress: true,
        port: 9000,
        host: '0.0.0.0'
    }
})

module.exports = options
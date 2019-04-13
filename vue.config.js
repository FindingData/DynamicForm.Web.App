module.exports = {
    publicPath:process.env.NODE_ENV === 'production' ? './' : '/',
    devServer: {
        proxy: {
            '/api': {
                target: 'http://192.168.10.222:57850',
                changeOrigin: true,
                pathRewrite: {
                    '^/api': '/api'
                }
            }
        }
    }
}
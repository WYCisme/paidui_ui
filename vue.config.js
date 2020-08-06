

module.exports = {
    //axios域代理，解决axios跨域问题
    publicPath:  '/',
    devServer: {
        proxy: {
            '/': {
                target: 'http://localhost:8080',
                // ws: false,
                changeOrigin: true,
                pathRewrite: {
                    // '^/api': ''
                }
            },
        }
    },
    build:{
        
    }
}
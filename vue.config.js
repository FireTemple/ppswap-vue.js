module.exports = {
    devServer: {
        overlay: {
            warnings: false, //不显示警告
            errors: false	//不显示错误
        },
        proxy:{ //配置跨域
            '/api':{
                target:'http://localhost:8081/',
                ws:true,
                changeOrigin:true,//允许跨域
                // pathRewrie:{
                //     '^/api':''   //请求的时候使用这个api就可以
                // }
            }
        }
    },
    lintOnSave:false, //关闭eslint检查，

}

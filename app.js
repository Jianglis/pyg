//程序核心(入口)文件
const path = require('path')

const express = require('express')
const createError = require('http-errors')
const Youch = require('youch')
const artTemplate = require('express-art-template')
const bodyParser = require('body-parser')
const favicon = require('express-favicon')
const logger = require('morgan')
const router = require('./router')
const middleware = require('./middleware')

const app = express()

app.listen(3000,()=> console.log('=== Server started !==='))

// 中间件

// 配置日志信息
app.use(logger('dev'))
// 模板引擎配置
app.engine('html', artTemplate);
app.set('view engine','html')
app.set('view options', {
    // debug启动模板引擎调试模式。
    // 如果为 true: {cache:false, minimize:false, compileDebug:true}
    // 开发环境: 不缓存,不压缩,编译调试版
    //  // 是否开启缓存
    // cache: true,
    // // 是否开启压缩。它会运行 htmlMinifier，将页面 HTML、CSS、CSS 进行压缩输出
    // // 如果模板包含没有闭合的 HTML 标签，请不要打开 minimize，否则可能被 htmlMinifier 修复或过滤
    // minimize: true,
    // // 是否编译调试版
    // compileDebug: false,

    debug: process.env.NODE_ENV !== 'production'
});

// 开放静态资源
app.use('/',express.static(path.join(__dirname,'./public')))

// 请求体解析
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:false}))

//网站小图标
app.use(favicon(path.join(__dirname,'./favicon.ico')))

//自定义中间件
app.use(middleware.global)

// 设置路由
app.use(router)

 

//404情况 上面的路由没有去处理用户的请求
app.use((req,res,next)=> {
    // const err = new Error('not Found')
    // err.status = 404
    next(createError(404, 'Not Found'))
})

//500情况 服务器出错了
app.use((err,req,res,next)=> {
    const env = req.app.get('env')
    // console.log(env)
    if (env === 'development') {   
        //开发  错误更详细  使用 第三方错误输出页面 youch     
        return new Youch(err, req).toHTML().then(html => res.send(html))
    } 
    //生产  渲染页面  art-template express-art-template
    //locals 模版引擎中可以直接使用的数据（locals对象下数据）
    res.locals.status = err.status === 404 ? 404 :500
    res.render('error')

})
//处理用户相关业务逻辑
const svgCaptcha = require('svg-captcha')
const createError = require('http-errors')
const accountModel = require('../models/account')
const config = require('../config')
const cartModel = require('../models/cart')

module.exports.index = (req,res,next)=> {
    const captcha = svgCaptcha.createMathExpr({width:100,height:32,fontSize:32});
    // console.log(captcha);
    res.locals.svg = captcha.data
    req.session.captchaText = captcha.text
    res.locals.returnUrl = req.query.returnUrl || '/member'
    res.render('login')
} 

module.exports.login = (req,res,next) => {
    const body = req.body
    Promise.resolve().then(() => {     
       // 1.表单完整性
        if(!(body.username && body.password && body.captcha)) {
            throw createError(400,'表单输入不能有空')
        }
        //2.验证码校验
        if (req.session.captchaText !== body.captcha) {
            throw createError(400,'验证码错误')
        }
        //3.登录检验用户名和密码
        return accountModel.getUser(body.username,body.password)
    }).then(user => {
        if (!(user && user.id)) {
            throw createError(400,'用户名或密码错误')
        }

        // 记录登录信息
        req.session.user = user

        //4.自动登录功能
        if (body.auto == 1) {
            const info = {uid: user.id,password: user.password} 
            const expires = new Date(Date.now() + config.cookie.remember_expires)
            res.cookie(config.cookie.remember_key,JSON.stringify(info),{expires})
        }
        // 5.合并购物车到账号中
        const cookieStr = req.cookies[config.cookie.cart_key] || '[]'
        const cartList = JSON.parse(cookieStr)
        // console.log(cartList)
        const promiseArr = cartList.map(item => cartModel.add(user.id, item.id, item.amount))
        return Promise.all(promiseArr)
        
    }).then((data)=> {
        // 合并成功
        res.clearCookie(config.cookie.cart_key)
        delete req.session.captchaText
        res.redirect(body.returnUrl ||'/member')
    })
    .catch(err => {
        // 统一处理错误
        console.log('-----------------'+err)
        if(err.status !== 400) {
            res.locals.message = '用户名或密码错误'
        }else {
            res.locals.message = err.message
        }
        res.locals.username = body.username
        res.locals.password = body.password
        // 重新加载login页面
        const captcha = svgCaptcha.createMathExpr({width:100,height:32,fontSize:32});
        res.locals.svg = captcha.data
        req.session.captchaText = captcha.text
        res.render('login')
    })
}

module.exports.logout = (req,res,next) => {
    delete req.session.user
    res.redirect('/login')
}
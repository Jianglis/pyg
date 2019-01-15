//自定义中间件
const config = require('./config')
const categoryModel = require('./models/category')
const cartModel = require('./models/cart')
const productModel = require('./models/product')
const qs = require('querystring')

module.exports.global = (req,res,next)=> {
    // 网页头部信息
    res.locals.site = config.site
    // 设置用户信息
    if(req.session.user){
        res.locals.user = req.session.user
    }

     // 分类目录
    const getCategory = () => {
        //没有缓存,去请求接口
        if (!req.app.locals.category) {
            return categoryModel.getCategories().then(data=> {
                res.locals.category = data
                req.app.locals.category = data
            }) 
        }else {
            // 有缓存 去拿数据
            res.locals.category =  req.app.locals.category
            return Promise.resolve()
        }
    }

    // 购物车信息
    const getCart = () => {
        // 登录
        if(req.session.user) {
            return cartModel.find(req.session.user.id).then(data => {
                res.locals.headerCart = {
                    list: data.map(item => item.name),
                    amount: data.reduce((prev,item) => prev + item.amount,0)
                }
            })       
        }else {
            const cookieStr = req.cookies[config.cookie.cart_key] || '[]'
            const cartList = JSON.parse(cookieStr)
            const promiseArr = cartList.map(item => productModel.getProduct(item.id,true))
            return Promise.all(promiseArr).then(data => {
                res.locals.headerCart =  {
                    list: data.map(item => item.name),
                    amount: cartList.reduce((prev,item)=> prev + item.amount,0)
                }
            })
        }
    }
    //同时去获取  分类信息  购物车信息  等都获取成功  next()
    Promise.all([getCategory(),getCart()])
    .then((data)=> {
        next()
    })
    .catch(err => next(err))
}

module.exports.checkLogin = (req,res,next) => {
    if (!req.session.user) {
        return res.redirect('/login?returnUrl=' + qs.escape(req.url))
    }
    next()
}
//集合所有的路由  具体路由业务在controllers
const express = require('express')
const home = require('./controllers/home')
const account = require('./controllers/account')
const product = require('./controllers/product')
const cart = require('./controllers/cart')
const member = require('./controllers/member')
const order = require('./controllers/order')
const {checkLogin} = require('./middleware')
const pay = require('./controllers/pay')

const router = module.exports =  express.Router()

// 首页
router.get('/',home.index)
//猜你喜欢
router.get('/like',home.like)

// 产品相关
// 商品列表
router.get('/list/:id',product.list)
//搜索
router.get('/search',product.search)
// 商品详情页
router.get('/item/:id',product.item)

// 购物车
router.get('/cart',cart.index)
router.get('/cart/find',cart.find)
router.get('/cart/add',cart.add)
router.get('/cart/success',cart.addScu)
router.post('/cart/edit',cart.edit)
router.post('/cart/remove',cart.remove)


//用户登录
router.get('/login',account.index)
router.post('/login',account.login)
router.get('/logout',account.logout)

//个人相关
router.get('/member',checkLogin,member.index)
router.get('/order',checkLogin,order.index)
router.get('/order/create',checkLogin,order.create)
router.get('/order/checkout',checkLogin,order.checkout)

router.get('/pay',checkLogin,pay.index)
router.get('/pay/callback',checkLogin,pay.callback)
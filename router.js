//集合所有的路由  具体路由业务在controllers
const express = require('express')
const home = require('./controllers/home')
const account = require('./controllers/account')
const product = require('./controllers/product')
const cart = require('./controllers/cart')

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
router.post('/cart/edit',cart.edit)
router.post('/cart/remove',cart.remove)


//用户登录
router.get('/login',account.login)
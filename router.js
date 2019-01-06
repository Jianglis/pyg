//集合所有的路由  具体路由业务在controllers
const express = require('express')
const home = require('./controllers/home')
const account = require('./controllers/account')
const product = require('./controllers/product')


const router = module.exports =  express.Router()


router.get('/',home.index)

//猜你喜欢
router.get('/like',home.like)

// 商品列表
router.get('/list/:id',product.list)

//用户登录
router.get('/login',account.login)
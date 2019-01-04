//集合所有的路由  具体路由业务在controllers
const express = require('express')
const home = require('./controllers/home')
const account = require('./controllers/account')


const router = module.exports =  express.Router()

router.get('/',home.index)

router.get('/login',account.login)
// 购物车相关业务
const productModel = require('../models/product')
const config = require('../config')

// 跳转至购物车页面
exports.index = (req,res,next) => {
    res.render('cart')
}
 

exports.find = (req,res,next) => {
    const cookieStr = req.cookies[config.cookie.cart_key] || '[]'
    const cartList = JSON.parse(cookieStr)
    const promiseArr = cartList.map(item => productModel.getProduct(item.id, true))

    Promise.all(promiseArr).then(results => {
        // res.json(results)
        const list = results.map((item,i) => ({
            id: item.id,
            name: item.name,
            thumbnail: item.thumbnail,
            price: item.price,
            amount: cartList[i].amount
        }))
        res.json(list)
    }).catch(err => res.json([]))
}

exports.add = (req,res,next) => {
    if(req.session.user) {
        // 待做
    }else {

        const id = req.query.id
        const amount = +req.query.amount || 1
        const cookieStr = req.cookies[config.cookie.cart_key] || '[]'
        const cartList = JSON.parse(cookieStr)
        const cart = cartList.find(item => item.id == id)
        if (cart) {
            // 有相同商品
            cart.amount += amount
        }else {
            // 没有相同商品
            cartList.push({id,amount})
        }

        // 修改好的购物车,重新存储
        const expires = new Date(Date.now() + config.cookie.cart_expires)
        res.cookie(config.cookie.cart_key,JSON.stringify(cartList),{expires})

        productModel.getProduct(id,true).then(data => {
            // res.json(data)
            res.locals.cateInfo = {
                id: data.id,
                name: data.name,
                thumbnail: data.thumbnail,
                amount
            }
            res.render('cart-add')
        }).catch(err => next(err))

    }
}
exports.edit = (req,res,next) => {
    
}



exports.remove = (req,res,next) => {
    
}
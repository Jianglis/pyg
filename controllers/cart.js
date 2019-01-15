// 购物车相关业务
const productModel = require('../models/product')
const config = require('../config')
const cartModel = require('../models/cart')

// 跳转至购物车页面
exports.index = (req,res,next) => {
    res.render('cart')
}
 
/*查询列表  响应json*/
exports.find = (req,res,next) => {
    if (req.session.user) {
        cartModel.find(req.session.user.id).then(data => {
            res.json(data)
        }
        ).catch(err => res.json([]))
    }else {
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
}

exports.add = (req,res,next) => {
    const id = req.query.id
    const amount = +req.query.amount || 1
    if(req.session.user) {
        cartModel.add(req.session.user.id,id,amount).then(() => {
          res.redirect(`/cart/success?id=${id}&amount=${amount}`) 
        }).catch(err => next(err))
    }else {
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
        res.redirect(`/cart/success?id=${id}&amount=${amount}`) 
    }
}

//添加成功的页面展示
exports.addScu = (req,res,next) => {
    const {id,amount} = req.query
    productModel.getProduct(id,true).then(data => {
        res.locals.cateInfo = {
            id: data.id,
            name: data.name,
            thumbnail: data.thumbnail,
            amount
        }
        res.render('cart-add')
    }).catch(err => next(err))
}


exports.edit = (req,res,next) => {
    const {id, amount} = req.body
    if (req.session.user) {    
        cartModel.edit(req.session.user.id,id,amount).then(data => {
            res.json({success:true})
        }).catch(() => {
            res.json({success:false})
        })
    }else {
        const cookieStr = req.cookies[config.cookie.cart_key] || '[]'
        const cartList = JSON.parse(cookieStr)
        const cart = cartList.find(item => item.id == id)
        cart.amount = amount
        const expires = new Date(Date.now() + config.cookie.cart_expires)
        res.cookie(config.cookie.cart_key,JSON.stringify(cartList),{expires})
        res.json({success:true})
    }
}

exports.remove = (req,res,next) => {
    const {id} = req.body
    if (req.session.user) {
        cartModel.remove(req.session.user.id,id).then(data => {
            res.json({success:true})
        }).catch(() => {
            res.json({success:false})
        })
    }else {
        const cookieStr = req.cookies[config.cookie.cart_key] || '[]'
        const cartList = JSON.parse(cookieStr)
        const index = cartList.findIndex(item => item.id == id)
        cartList.splice(index,1)
        const expires = new Date(Date.now() + config.cookie.cart_expires)
        res.cookie(config.cookie.cart_key,JSON.stringify(cartList),{expires})
        res.json({success:true})
    }
}
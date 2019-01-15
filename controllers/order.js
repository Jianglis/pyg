const orderModel = require('../models/order')

exports.index = (req,res,next)=> {
    orderModel.all(req.session.user.id).then(lists => {
        res.locals.orderLists = lists
        res.render('order')
    }).catch(err => next(err))
}

exports.create = (req,res,next)=> {
    const ids = req.query.ids
    console.log(ids)
    orderModel.add(req.session.user.id,ids).then(order => {
        console.log(1111)
        res.redirect('/order/checkout?num=' + order.order_number)
    }).catch(err => next(err))
}

exports.checkout = (req,res,next) => {
    const num = req.query.num
    orderModel.single(num).then(order => {
        res.locals.order = order
        res.render('checkout')
    }).catch(err => next(err))
}


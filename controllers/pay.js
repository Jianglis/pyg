const orderModel = require('../models/order')
const alipay = require('../utils/alipay')

exports.index = (req,res,next) => {
    const num = req.query.num
    orderModel.single(num).then(order => {
        res.redirect(alipay.getPayUrl(order))
    }).catch(err => next(err))
}

exports.callback =(req,res,next) => {
    // 交易
    const out_trade_no = req.query.out_trade_no
    // 支付宝流水号
    const trade_no = req.query.trade_no
    orderModel.editSuccess(out_trade_no,1,trade_no).then(order => {
        res.locals.order = order
        res.render('callback')
    }).catch(err => next(err))
}
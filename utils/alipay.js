// 支付宝支付工具
const path = require('path');
const Alipay = require('alipay-node-sdk');

const ali = new Alipay({
    //商户id
    appId: '2016092300579138',
    // 支付结果通知
    notifyUrl: 'http://localhost:3000/pay/notify',
    rsaPrivate: path.resolve(__dirname,'./rsa_private_key.pem'),
    rsaPublic: path.resolve(__dirname,'./rsa_public_key.pem'),
    sandbox: true,
    signType: 'RSA2'
})

exports.getPayUrl = (order) => {
    const params = ali.pagePay({
        subject: '[品优购]商品',
        body: order.products.map(item => item.name).join('\n'),
        outTradeId: order.order_number,
        timeout: '10m',
        amount: order.total_price,
        goodsType: '1',
        qrPayMode: 2,
        //支付成功的回调地址
        return_url: 'http://localhost:3000/pay/callback'
    })
    return  'https://openapi.alipaydev.com/gateway.do?' + params
}
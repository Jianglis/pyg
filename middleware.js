//自定义中间件
const config = require('./config')

module.exports.global = (req,res,next)=> {
    res.locals.site = config.site
    next()
}
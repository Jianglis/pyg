//自定义中间件
const config = require('./config')
const categoryModel = require('./models/category')

module.exports.global = (req,res,next)=> {
    // 网页头部信息
    res.locals.site = config.site

    // 分类目录
    //没有缓存,去请求接口
    if (!req.app.locals.category) {
        categoryModel.getCategories().then(data=> {
            res.locals.category = data
            req.app.locals.category = data
            next()
        }).catch(err => next(err))

    }else {
        // 有缓存 去拿数据
        res.locals.category =  req.app.locals.category
        next()
    }
}
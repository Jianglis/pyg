//处理首页相关业务逻辑
const homeModel = require('../models/home');
const productModel = require('../models/product')

module.exports.index = (req, res, next) => {

	Promise.all([
		homeModel.getSlide(),
		productModel.getLike()
	]).then(data=> {
		// res.json(data)
		res.locals.slide = data[0];
		res.locals.likeLists = data[1]
		// res.json(res.locals)
		res.render('home');
	}).catch((err) => next(err));
	
};

module.exports.like = (req,res,next)=> {
	productModel.getLike().then(data => res.json(data)).catch(err => next(err))
}
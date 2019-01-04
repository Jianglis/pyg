//处理首页相关业务逻辑
const homeModel = require('../models/home');

module.exports.index = (req, res, next) => {
	homeModel
		.getSlide()
		.then((data) => {
            res.locals.slide = data;
			res.render('home');
		})
		.catch((err) => next(err));
};

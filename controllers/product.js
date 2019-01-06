// 产品相关路由业务
const productModel = require('../models/product');
const categoryModel = require('../models/category');

exports.list = (req, res, next) => {
	const cateId = req.params.id;
	const page = req.query.page || 1;
	const size = req.query.per_page || 10;
	const sort = req.query.sort || 'commend';

	// productModel
	// 	.getCateProducts(cateId, page, size, sort)
	// 	.then((data) => {
	// 		// res.json(data)
	// 		res.locals.list = data.list;
	// 		res.locals.totalPage = data.totalPage;
	// 		// res.json(res.locals)
	// 		res.render('list');
	// 	})
	// 	.catch((err) => next(err));

	Promise.all([ productModel.getCateProducts(cateId, page, size, sort), categoryModel.getCateParent(cateId) ])
		.then((results) => {
			res.locals.list = results[0].list;
			res.locals.totalPage = results[0].totalPage;
			res.locals.cate = results[1];
            res.locals.sort = sort;
            // res.json(res.locals)
            res.render('list')
		})
		.catch((err) => next(err));
};

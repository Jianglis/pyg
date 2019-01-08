// 产品相关路由业务
const productModel = require('../models/product');
const categoryModel = require('../models/category');
const pagination = require('../utils/pagination')

exports.list = (req, res, next) => {
	const cateId = req.params.id;
	const page = req.query.page || 1;
	const size = req.query.per_page || 10;
	const sort = req.query.sort || 'commend';

	Promise.all([ productModel.getCateProducts(cateId, page, size, sort), categoryModel.getCateParent(cateId) ])
		.then((results) => {
			res.locals.list = results[0].list;
			// res.locals.totalPage = results[0].totalPage;
			res.locals.cate = results[1];
            res.locals.sort = sort;
			// res.json(res.locals)
			res.locals.pagination = pagination({page,sort,total:results[0].totalPage,req})
            res.render('list')
		})
		.catch((err) => next(err));
};

// 产品相关路由业务
const productModel = require('../models/product');
const categoryModel = require('../models/category');
const pagination = require('../utils/pagination')
const qs = require('querystring')

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

//搜索
exports.search = (req,res,next) => {
	const q = req.query.q
	const page = req.query.page || 1
	const size = req.query.size || 5
	const sort = req.query.sort ||'commend'
	productModel.getSearchProducts(qs.escape(q),page,size,sort).then(data => {
		// res.json(data)
		res.locals.list = data.list
		res.locals.q = q
		res.locals.sort = sort
		res.locals.pagination = pagination({page,sort,total:data.totalPage,req})
		res.render('list')
	}).catch(err => next(err))
}

// 商品详情页
exports.item = (req,res,next) => {
	req.session.abc = 123
	const id = req.params.id
	// productModel.getProduct(id,false).then(data => {
	// 	// res.json(data)
	// 	res.locals.detail = data
	// 	res.render('item')
	// }).catch(err => next(err))

	Promise.all([productModel.getProduct(id,false),productModel.getLike()]).then(results => {
		// res.json(results)
		res.locals.detail = results[0]
		res.locals.list = results[1]
		res.render('item')
	}).catch(err => next(err))
}
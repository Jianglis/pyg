//产品相关操作. 
//获取产品数据
const axios = require('./api')

exports.getLike = () => {
	return axios.get('products?type=like&limit=6').then(res=> res.data).catch(err => Promise.reject(err));
}

exports.getCateProducts = (cateId,page,size,sort) => {
	const url = `categories/${cateId}/products?page=${page}&per_page=${size}&sort=${sort}`
	return axios.get(url).then(res=>( {
		list:res.data,
		totalPage:res.headers['x-total-pages']
	})).catch(err=> Promise.reject(err))
}

exports.getSearchProducts = (q,page,size,sort) =>{
	const url = `products?q=${q}&page=${page}&per_page=${size}&sort=${sort}`
	return axios.get(url).then(res=>( {
		list:res.data,
		totalPage:res.headers['x-total-pages']
	})).catch(err=> Promise.reject(err))
}

exports.getProduct = (id,isBasic) => {
	return axios.get(`products/${id}` + (isBasic ? '':'?include=introduce,category,pictures')).then(res => res.data).catch(err => Promise.reject(err))
}
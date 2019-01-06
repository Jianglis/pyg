// 操作分类相关数据
const axios = require('./api')

exports.getCategories = () => {
    return axios.get('categories?format=tree').then(res => res.data).catch(err => Promise.reject(err))
}

exports.getCateParent = (cateId) => {
    return axios.get(`categories/${cateId}?include=parent`).then(res=> res.data).catch(err => Promise.reject(err))
}
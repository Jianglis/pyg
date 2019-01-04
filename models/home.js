//获取另外一台服务器数据
//使用axios进行数据的提交和获取
//配置一些公用的请求信息
const axios = require('./api')

exports.getSlide = () => {
  return axios.get('settings/home_slides')
    .then(res => res.data)
    .catch(err => Promise.reject(err));    
}
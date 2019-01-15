const axios = require('./api')

exports.getUser = (username,password) => {
    return axios.post('users/login',{username,password}).then(res =>{
        console.log(res)
        return res.data}).catch(err => Promise.reject(err))
}
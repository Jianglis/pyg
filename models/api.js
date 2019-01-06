// 获取数据，携带信息
const axios = require('axios')
const config = require('../config')

const instance = axios.create({
    baseURL: config.api.baseURL,
    timeout: config.api.timeout,
    auth: {
        username: config.api.username,
        password: config.api.password
    }
});

module.exports = instance


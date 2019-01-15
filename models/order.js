const axios = require('./api')

exports.add = (userId,items) => {
    return axios.post('orders',{user_id:userId,items}).then(res => res.data).catch(err => Promise.reject(err))
}

exports.all = (userId) => {
    return axios.get(`orders?user_id=${userId}`).then(res => res.data).catch(err => Promise.reject(err))
}

exports.single = (num) => {
    return axios.get(`orders/${num}`).then(res => res.data).catch(err => Promise.reject(err))
}

exports.editSuccess = (num,pay_status,trade_no) => {
    const send_status = 1
    const express_address = '汪磊 安徽省宣城市宣州区向阳镇街道409号 13288889999 242052'
    return axios.get(`orders/${num}`,{
        pay_status,
        send_status,
        trade_no,
        express_address
    }).then(res => res.data).catch(err => Promise.reject(err))
}
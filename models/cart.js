const axios = require('./api')

exports.add = (userId,productId,amount) => {
    return axios.post(`users/${userId}/cart`,{id:productId,amount}).then(res => res.data).catch(err => Promise.reject(err))
}

exports.find = (uid) => {
    return axios.get(`users/${uid}/cart`).then(res => res.data).catch(err => Promise.reject(err))
}

exports.edit = (uid,productId,amount) => {
    return axios.patch(`users/${uid}/cart/${productId}`,{amount}).then(res => res.data).catch(err => Promise.reject(err))
}

exports.remove = (uid,productId) => {
    return axios.delete(`users/${uid}/cart/${productId}`).then(res => res.data).catch(err => Promise.reject(err))
}
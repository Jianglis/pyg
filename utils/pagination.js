//生成分页的HTML
const template = require('art-template')
const path = require('path')
const url = require('url')

module.exports = (options) => {
    const req = options.req
    const urlObject = url.parse(req.url,true)
    // console.log(urlObject)
    const getUrl = (page)=> {
        
        urlObject.query.page = page
        urlObject.search = undefined
        return url.format(urlObject)
        // console.log(createUrl)
    }
    // console.log(getUrl(3))


    // page 当前页码
    // total 总页码
    // btnNum 按钮个数
    const {page,total,btnNum= 5 } = options
    // 计算起始页码
    let begin = page - Math.floor(btnNum/2)
    begin = begin < 1 ? 1 : begin

    // 计算结束页码
    let end = begin + btnNum - 1
    end = end > total ? total : end

    begin = end - btnNum + 1
    begin = begin < 1 ? 1 : begin

    const urlTemplate = path.join(__dirname,'../views/component/pagination.html')
    return template(urlTemplate,{page,total,begin,end,getUrl,query:req.query})
}
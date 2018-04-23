const domin = 'https://www.xiatianlong.com/xiaochengxu';
// 首页请求url
const homeUrl = domin + '/home';
// 首页条件查询，加载更多请求url
const homeQueryUrl = domin + '/home/query';
// 添加留言接口
const commentAddUrl = domin + '/addComment';
// 初始化留言、加载更多留言接口
const commentInitAndMoreUrl = domin + '/initAndMore';


module.exports = {
    domin: domin,
    homeUrl: homeUrl,
    homeQueryUrl: homeQueryUrl,
    commentAddUrl: commentAddUrl,
    commentInitAndMoreUrl: commentInitAndMoreUrl
}
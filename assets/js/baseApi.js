$(function() {
    //管理接口的根路径 做优化
    //每次调用$.get 或者 $.post 或者 $.ajax请求时候都会调用ajaxPrefilter这个函数

    $.ajaxPrefilter(function(options) {


        // console.log(options.url);  // /api/login
        // 在发起真正的ajax请求之前 统一凭借请求的根路径
        options.url = 'http://api-breakingnews-web.itheima.net' + options.url


        //统一为有权限的接口设置请求头
        // Headers
        if (options.url.indexOf('/my/') !== -1) {
            options.headers = {
                Authorization: localStorage.getItem('token') || ''

            }
        }

        //全局统一挂载complete回调函数 来控制有权限的访问接口
        options.complete = function(res) {

            //在complete回调函数中可以使用res.responseJSON 拿到服务器响应回来的数据
            if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                //清除token值 
                localStorage.removeItem('token');
                //强制在登陆页上
                location.href = '/login.html';
            }




        }

    })
})
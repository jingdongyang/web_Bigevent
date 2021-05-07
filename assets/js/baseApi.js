$(function() {
    //管理接口的根路径 做优化
    //每次调用$.get 或者 $.post 或者 $.ajax请求时候都会调用ajaxPrefilter这个函数

    $.ajaxPrefilter(function(options) {


        // console.log(options.url);  // /api/login
        // 在发起真正的ajax请求之前 统一凭借请求的根路径
        options.url = 'http://api-breakingnews-web.itheima.net' + options.url

    });
})
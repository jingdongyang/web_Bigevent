$(function() {
    //调用用户的基本信息
    getUserInfo();

    var layer = layui.layer;

    $('#btnLoginOut').on('click', function() {

        layer.confirm('确定退出登录?', { icon: 3, title: '提示' }, function(index) {
            //do something
            //1.退出成功之后清除本地token的值
            localStorage.removeItem('token')
                //2.返回登录页面
            location.href = '/login.html'
            layer.close(index);
        })
    })
})


//获取用户的基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        data: {},
        //header 是请求头配置对象;
        // headers: {
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function(res) {
            if (res.status !== 0) {
                return layui.layer.msg('用去用户失败!')
            }
            //调用renderAvatar函数 渲染用户的头像
            // console.log(res);
            renderAvatar(res.data)
        },
        //控制用户的访问权限 当用户没有登录的时候禁止用户访问后台页 index页
        //无论成功还是失败 都会调用complete函数
        // complete: function(res) {
        //     console.log(res);
        //     //在complete回调函数中可以使用res.responseJSON 拿到服务器响应回来的数据
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         //清除token值 
        //         localStorage.removeItem('token');
        //         //强制在登陆页上
        //         location.href = '/login.html';
        //     }
        // } //complete结束;


    })

}
//渲染用户的头像
function renderAvatar(user) {
    var name = user.nickname || user.username;
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name);
    //按需渲染用户的头像
    if (user.user_pic !== null) {
        //有头像
        $(".layui-nav-img").attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    } else {
        //没有头像
        var first = name[0].toUpperCase()
        $(".layui-nav-img").hide()
        $('.text-avatar').html(first).show()
    }


}
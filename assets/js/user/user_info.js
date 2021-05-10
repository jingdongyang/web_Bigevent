$(function() {
    //
    var form = layui.form;
    var layer = layui.layer;

    form.verify({
        nickname: function(value) {
            if (value > 6) {
                return "昵称长度必须在1~6位字符之间"
            }
        }


    });

    initUserInfo()
        //填充值到表单中 先初始化
        //初始化用户的基本信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户信息失败!')
                }
                console.log(res);
                form.val('formUserInfo', res.data)
            }
        })

    }
    //表单重置功能
    $("#btnReset").on('click', function(e) {
        e.preventDefault()
        initUserInfo()

    })

    //监听表单提交成功
    $(".layui-form").on('submit', function(e) {
        e.preventDefault()
        $.ajax({
            method: "POST",
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新用户信息失败!')
                }
                layer.msg('更新用户信息成功!')

                //调用父页面的方法渲染用户欢迎昵称
                window.parent.getUserInfo()
            }
        })
    })


})
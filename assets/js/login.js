$(function() {
    //视频中接口已经更改 下面是备用接口 使用下方接口文件

    // http://api-breakingnews-web.itheima.net


    $("#link_reg").on('click', function() {
        $('.reg_box').show()
        $('.login-box').hide()
    })

    $("#link_login").on('click', function() {
        $('.login-box').show()
        $('.reg_box').hide()
    });
    //layui表单验证规则
    var form = layui.form;
    //使用layer 弹出层提示
    var layer = layui.layer
        // 通过form.verify()函数自定义校验规则
    form.verify({
        //自定义一个pwd密码的校验规则
        pwd: [
            /^[\S]{6,12}$/, '密码必须6到12位，且不能出现空格'
        ],


        //校验两次密码是否一致的正则规则
        repwd: function(value) {
            //通过value拿到确认密码框中的值 
            //还需要拿到密码框中的值 进行比较是否全等
            var pwd = $('.reg_box [name=password]').val()

            if (pwd !== value) {
                return '两次输入的密码不一致!'
            }

        }

    });

    //监听注册表单的提交事件
    $('#form_reg').on('submit', function(e) {
        //阻止表单的默认提交行为
        e.preventDefault()
        var data = {
                username: $('#form_reg [name=username]').val(),
                password: $('#form_reg [name=password]').val()
            }
            //发起ajax的post请求  http://api-breakingnews-web.itheima.net
        $.post('/api/reguser', data, function(res) {
            if (res.status !== 0) {
                // return console.log(res.message);
                return layer.msg(res.message);
            };
            // console.log('注册成功');
            layer.msg('注册成功! 请登录');
            //模拟点击去登录按钮 注册成功之后让自动到登录表单
            $('#link_login').click()

        })
    });
    //监听登录表单的提交事件
    $("#form_login").submit(function(e) {
        //阻止默认提交行为
        e.preventDefault()
        $.ajax({
            method: 'post',
            url: '/api/login',
            //快速获取表单中的数据serialize()
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('登录失败!')
                }
                layer.msg('登录成功!');

                //将登录成功得到的token值 存到localstorage
                //本地存储中
                localStorage.setItem('token', res.token)

                //拿到token值 做身份验证
                // console.log(res.token);
                //跳转到后台首页
                location.href = '/index.html'


            }
        })
    })


})
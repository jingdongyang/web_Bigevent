$(function() {

    var layer = layui.layer
    var form = layui.form;
    //调用文章分类的方法
    initCate();

    // 初始化富文本编辑器
    initEditor();
    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // layer.msg('获取文章分类列表成功!')
                console.log(res);
                //渲染模板引擎
                var htmlStr = template('tpl-cate', res)
                $("[name=cate_id]").html(htmlStr)

                form.render()
            }

        })

    }

    // cropper
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)

    //为选择的封面按钮绑定点击事件
    $('#btnChooseImage').on('click', function() {
            $("#coverFile").click()
        })
        //为隐藏的input file 的表单 绑定change事件
    $("#coverFile").on('change', function(e) {
        console.log(e);
        var files = e.target.files;
        if (files.length === 0) {
            return;
        }
        // 根据选择的文件，创建一个对应的 URL 地址：
        var newImgURL = URL.createObjectURL(files[0])
            //为裁剪区重新添加图片

        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域


    })

    //定义文章的发布状态 默认是已发布
    var art_state = '已发布';

    //为存为草稿按钮绑定事件
    $("#btnSave2").on('click', function() {
        art_state = '草稿'

    })

    //为表单绑定submit监听事件
    $("#form_pub").on('submit', function(e) {
        e.preventDefault()

        //基于form表单快速创建一个FormData对象
        var fd = new FormData($(this)[0])

        fd.append('state', art_state)

        // fd.forEach(function(v, k) {
        //     console.log(v, k);
        // })

        //将封面裁剪过后的图片 输出为一个文件对象

        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function(blob) { // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作

                //将文件对象 存到fd中
                fd.append('cover_img', blob)

                //发起ajax请求
                publishArticle(fd)

            })




    })

    //定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: "POST",
            url: "/my/article/add",
            data: fd,
            contentType: false,
            processData: false,

            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败!')
                }
                layer.msg('发布文章成功!')
                    //跳转到文章列表的页面
                location.href = '/article/art_list.html'
            }
        })

    }



})
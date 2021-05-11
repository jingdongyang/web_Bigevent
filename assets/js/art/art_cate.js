$(function() {

    var form = layui.form;

    var layer = layui.layer;

    initArtCateList()

    function initArtCateList() {
        $.ajax({
            method: "GET",
            url: "/my/article/cates",

            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败!')
                }
                // layer.msg('获取文章列表成功!')
                // console.log(res);
                var htmlStr = template('tpl-table', res)
                $("tbody").html(htmlStr)
                    // $("tbody").append(htmlStr)
            }
        })
    }

    //添加类别绑定事件
    var indexAdd = null;
    $("#btnAddCate").on('click', function(e) {
        indexAdd = layer.open({
            // type是值顶下面的确按钮 默认是0 有一个确定按钮
            type: 1,
            title: '添加文章分类',
            area: ['500px', '250px'],
            content: $("#dialog-add").html(),
        });

    })

    //为form-add表单绑定submit事件  因为是动态生成的 所以需要用代理的方式来绑定
    $("body").on('submit', '#form_add', function(e) {
        e.preventDefault()
            // 发起ajax请求
        $.ajax({
            method: "POST",
            url: "/my/article/addcates",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('新增文章类别失败!')
                }
                layer.msg('新增文章类别成功!')
                initArtCateList()

                //根据索引关闭弹出层
                layer.close(indexAdd)
            }
        })
    })

    //为编辑按钮绑定点击事件
    //同样使用事件代理的方式

    var indexEdit = null
    $('tbody').on('click', '.btn_edit', function() {

        indexEdit = layer.open({
            // type是值顶下面的确按钮 默认是0 有一个确定按钮
            type: 1,
            title: '修改文章分类',
            area: ['500px', '250px'],
            content: $("#dialog-edit").html(),
        });
        //拿到编辑按钮的data-id
        var id = $(this).attr('data-id');
        //发起ajax请求 拿到对应的分类数据
        $.ajax({
            method: "GET",
            url: "/my/article/cates/" + id,
            // data: { id: id },
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类数据失败！')
                }
                layer.msg('获取文章分类数据成功！')
                    //拿到输入填充值 form.val()
                form.val('form_edit', res.data)
            }
        })



    })

    //通过事件代理为编辑表单绑定submit事件
    $("body").on('submit', "#form_edit", function(e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类信息失败！')
                }
                layer.close(indexEdit)
                layer.msg('更新分类信息成功！')
                initArtCateList()

            }
        })


    })


    //删除操作
    $("tbody").on('click', ".btn-delete", function() {
        var id = $(this).attr('data-id')

        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            //当用户点击确认 要发请求删除数据
            $.ajax({
                method: "GET",
                url: "/my/article/deletecate/" + id,
                data: { id: id },
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除失败!')
                    }
                    layer.msg('删除数据成功!')
                    layer.close(index);
                    initArtCateList()
                }
            })


        });
    })




})
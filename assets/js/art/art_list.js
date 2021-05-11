$(function() {

    var layer = layui.layer;
    var form = layui.form;
    var laypage = layui.laypage;

    //定义事件过滤器
    template.defaults.imports.dataFormat = function(date) {
            var dt = new Date(date)

            var y = dt.getFullYear()
            var m = dt.getMonth() + 1
            m = m < 10 ? '0' + m : m
            var d = dt.getDate()
            d = d < 10 ? '0' + d : d

            var hh = dt.getHours()
            hh = hh < 10 ? '0' + hh : hh
            var mm = dt.getMinutes()
            mm = mm < 10 ? '0' + mm : mm
            var ss = dt.getSeconds()
            ss = ss < 10 ? '0' + ss : ss


            return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss


        }
        //定义一个查询参数 将来请求数据的时候把查询参数发送到服务器
        //
    var q = {
        pagenum: 1, //页码值
        pagesize: 2, //每页显示几条
        cate_id: '', //文章分类的id
        state: '', //文章的发布状态

    }

    initTable()

    initCate()



    //获取文章列表数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function(res) {


                if (res.status !== 0) {
                    return layer.msg('获取文章数据列表失败!')
                }
                // layer.msg('获取文章数据列表成功!')
                //使用模板引擎渲染数据
                // console.log(res);

                var htmlStr = template('tpl-table', res)
                $("tbody").html(htmlStr)

                //调用分页的方法 
                //把总记录条数传入进去
                renderPage(res.total)


            }
        })

    }

    //初始化文章分类列表


    function initCate() {
        $.ajax({
            method: "GET",
            url: '/my/article/cates',
            success: function(res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章分类列表失败！')
                }
                // layer.msg('获取文章分类列表成功！')
                // console.log(res);

                var htmlStr1 = template('tpl-cateId', res)
                $("[name=cate_id]").html(htmlStr1)
                    //layui的render方法 渲染到select区域
                form.render()
            }

        })

    }

    //筛选按钮提交 发起表单监听
    $("#form-search").on('submit', function(e) {
        e.preventDefault()
            //拿到表单中获取到的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        //为查询对象q 中赋值
        q.cate_id = cate_id
        q.state = state

        //重新渲染表格中的数据
        initTable()



    })

    //渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        //调用laypage.render()方法来渲染数据
        laypage.render({
            elem: 'pageBox', //分页容器的id
            count: total, //总记录条数
            limit: q.pagesize, //每页显示的条数
            curr: q.pagenum, //当前页面的页码值
            // 自定义分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10, 12],
            //jump分页发生切换的时候 发生jump回调
            jump: function(obj, first) {
                // console.log(first);
                // console.log(obj.curr);
                // 将拿到的最新页码值放在q对象中
                q.pagenum = obj.curr
                    //把最新的条目数重新赋值
                q.pagesize = obj.limit
                    // initTable() //直接调用会出现死循环
                if (!first) {
                    initTable()

                }
            }
        })

    }

    //删除行的操作
    $('tbody').on('click', '.btn_delete', function() {
        //获取当前页中删除按钮的个数
        var len = $('.btn_delete').length;
        console.log(len);

        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function(index) {
            //do something
            $.ajax({
                method: "GET",
                url: "/my/article/delete/" + id,
                // data: {
                //     id: id
                // },
                success: function(res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败!')
                    }

                    layer.msg('删除成功!')
                        //解决小bug
                        //当数据删除完成后 需要判断当前页面中是否还有数据
                    if (len === 1) {
                        //表示删除之后当前页没有数据需要页码值-1
                        //页码值最小不能小于1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1

                    }
                    initTable()

                    layer.close(index);
                }
            })


        });
    })




})
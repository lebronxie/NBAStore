require(["./requirejs-config"], () => {
    //引入index需要依赖的模块
    require(["jquery", "item", "url", "template", "cookie", "header", "footer"], ($, item, url, template) => {
        //通过产品列表传过来的id 渲染 页面 
        var id = location.search.split("=")[1];
        var path;
        //假装根据id 为1  去请求写好的接口  其余的随机接口
        if (id == "NSJB18417100005") {
            path = "/single";
        } else {
            path = "/single-Random"
        }
        //拿着这个id去请求数据
        $.ajax({
            data: {
                id
            },
            url: url.baseUrlRap + path,
            type: "get",
            success: function (res) {
                // console.log(res);
                if (res.res_code === 1) {
                    let list = res.res_body.data;
                    // console.log(list)
                    //通过模板引擎渲染结构
                    let html = template("detail", {
                        productDetail: res.res_body.data
                    });
                    $("#container").html(html);
                    /*只能在这里面写js逻辑吗？？*/


                    // 图片移动特效 点击小图移动 大图 超大图都跟着显示
                    let btns = $(".rowlist-content li");
                    let magnify = $(".content .magnify");
                    btns.on("click", function () {
                        $(this).addClass("active").siblings().removeClass("active");
                        let index = $(this).index();
                        $(".content .big img").eq(index).addClass("active").siblings().removeClass("active");
                        $(".content .bigger img").eq(index).addClass("active").siblings().removeClass("active");
                    })
                    //判断临界值
                    $(".rowlist .next").on("click", function () {
                        $(".rowlist-content ul").animate({
                            top: -105
                        });
                        if (btns.eq(0).hasClass("active")) {
                            btns.eq(0).removeClass("active");
                            btns.eq(1).addClass("active");
                            $(".content .big img").eq(1).addClass("active").siblings().removeClass("active");
                            $(".content .bigger img").eq(1).addClass("active").siblings().removeClass("active");

                        }
                    });

                    //判断临界值
                    $(".rowlist .prev").on("click", function () {
                        $(".rowlist-content ul").animate({
                            top: 0
                        });
                        if (btns.eq(4).hasClass("active")) {
                            btns.eq(4).removeClass("active");
                            btns.eq(3).addClass("active");
                            $(".content .big img").eq(3).addClass("active").siblings().removeClass("active");
                            $(".content .bigger img").eq(3).addClass("active").siblings().removeClass("active");
                        }

                    })

                    //鼠标移动大图 超大图显示 放大镜显示 跟着鼠标移动
                    $(".content .big").on("mouseenter", function () {
                        $(".content .bigger").show(300);
                        magnify.show();
                        var maxLeft = $(".content .big").width() - magnify.width()
                        var maxTop = $(".content .big").height() - magnify.height()
                        $(document).on("mousemove", function (e) {
                            // 获取鼠标相对于big图片的位置赋值给放大镜
                            let left = e.pageX - $(".content .big").offset().left - magnify.width() / 2;
                            let top = e.pageY - $(".content .big").offset().top - magnify.height() / 2;
                            if (left < 0) left = 0;
                            if (top < 0) top = 0;
                            if (left > maxLeft) left = maxLeft;
                            if (top > maxTop) top = maxTop;
                            magnify.css({
                                left: left,
                                top: top
                            })

                            //超大图也要跟着鼠标动
                            $(".content .bigger img").css({
                                left: -3.333 * left,
                                top: -3.333 * top
                            })

                        })

                    })
                    $(".content .big").on("mouseleave", function () {
                        $(".content .bigger").hide();
                        magnify.hide();



                    })

                    //选尺码
                    $(".size span:gt(0)").on("click", function () {
                        $(this).addClass("active").siblings().removeClass("active")
                    })
                    // 添加购物车功能
                    $("#add").on("click", function () {
                        /* let count = $("#cart").html();
                         $("#cart").html(++count)*/
                        //把当前商品信息存在cookie 
                        let id = $("#product-id").html(),
                            title = $("#itemName_pc").html(),
                            picSrc = $(".rowlist-content li").eq(0).children().attr("src"),
                            price = $("#pdpPrice_pc").html(),
                            size = $(".size span.active").html(),
                            number = parseInt($(".number").val());
                        let tempPrice = price.replace(/¥/g, " ").trim().split(" ");
                        let newPrice = parseFloat(tempPrice[0]);
                        let oldPrice = parseFloat(tempPrice[1]);

                        // 传给数据库
                        $.ajax({
                            url: url.baseUrlPhp + "/project/nbastore/api/v1/addCart.php",
                            type: "post",
                            data: {
                                id,
                                title,
                                picSrc,
                                newPrice,
                                oldPrice,
                                size,
                                number
                            },
                            success: function (res) {
                                //拿到返回回来的 allNum 放在购物车图标小数字上
                                $("#cart").html(res.res_body.allNum);
                                $("#cart-info").stop().fadeIn(function () {
                                    setTimeout(function () {
                                        $("#cart-info").stop().fadeOut();
                                    }, 800)
                                });

                            },
                            dataType: "json"

                        })


                    })


                    // 立即购买功能 检测时候登录 未登录跳到登录界面 已登录到结算页面
                    $("#pay").on("click", function () {
                        //先判断是否登录
                        if (!$.cookie("user")) {
                            window.location.href = "/html/loginandsignup.html";
                        } else {
                            //发送请求 将该单品的信息传给数据库 
                            let list = res.res_body.data;
                            let proId = list.id;
                            let title = list.title;
                            let newPrice = list.priceDis;
                            let oldPrice = list.priceDel;
                            let picSrc = list.src.bigpic.bigpic1;
                            let size = $(".size span.active").html();
                            let number = $(".number").val();
                            // console.log(proId,title,newPrice,oldPrice,picSrc,size,number)
                            $.ajax({
                                type: "get",
                                dataType: "json",
                                url: url.baseUrlPhp + "/project/nbastore/api/v1/isBuyNow.php",
                                data: {
                                    proId,
                                    title,
                                    newPrice,
                                    oldPrice,
                                    picSrc,
                                    size,
                                    number
                                },
                                success: function (res) {
                                    // console.log(res);
                                    if (res.res_code === 1) {
                                        //添加isBuyNow 成功跳到支付界面
                                        window.location.href = "/html/pay.html?id=" + $("#product-id").html();
                                    }
                                }
                            })


                        }
                    })
                }
            }
        })


    })
})
require(["./requirejs-config"], () => {
    //引入index需要依赖的模块
    require(["jquery", "item", "url", "template", "cookie", "header", "footer"], ($, item, url, template) => {
        //拿到数据库数据动态渲染
        $.ajax({
            url: url.baseUrlPhp + "/project/nbastore/api/v1/pullCart.php",
            type: "post",
            dataType: "json",
            success: function (res) {
                // console.log(res)
                // 请求成功但是没有商品就显示如下页面信息
                if (res.res_code === 1 && res.res_body.length == 0) {
                    $("#cart-box").html(`<div class="cart-empty">
                                            <h4>您的购物车是空的。</h4>
                                            <p> 您还未添加商品<br>点击&nbsp;<a href="/">此处</a>&nbsp;继续购物</p>
                                            <a onclick="javascript :history.back(-1);" class="btn btn-blueBorder">返回</a>
                                        </div>`)
                    return;
                }

                //请求成功并有购物车有商品
                if (res.res_code === 1 && res.res_body.length > 0) {
                    //用模板渲染购物车页面 
                    let html = template("cart-template", {
                        cartList: res.res_body
                    });
                    // console.log(html)
                    $("#cart-box").html(html)


                    //写购物车逻辑  单选 全选 计算总价 修改数据库等。。。

                    //全选按钮点击事件
                    $("#all-btn").on("click", function () {
                        //全选按钮改变状态
                        $(this).children().eq(0).toggleClass("on");
                        // 全选 商品列表
                        $("#cart-box .checkbox").prop("checked", $(this).children().eq(0).hasClass("on")).toggleClass("on");
                        count(); //计算总价
                    })

                    //点击顶部删除按钮 删除选中的商品
                    $("#del-checked").on("click", function () {
                        //判断是否有商品被选中
                        if ($("#cart-box .checkbox:checked").length > 0) {
                            if (confirm("确定删除选中商品吗？")) {
                                //将要删除的商品id 打包以数组的方式发给后台 
                                let delArr = [];
                                $.each($("#cart-box .checkbox:checked"), function (i, item) {
                                    let proId = $(item).parent().find(".proId").html();
                                    delArr.push(proId);
                                })
                                // console.log(delArr);
                                $.ajax({
                                    data: {
                                        delArr: delArr,
                                    },
                                    url: url.baseUrlPhp + "/project/nbastore/api/v1/delCarts.php",
                                    type: "post",
                                    dataType: "json",
                                    success: function (res) {
                                        console.log(res)
                                        //删除数据库成功 前端删除相应商品行 更新商品总数和选中的商品总价 如果被全部删除完就判断 然后刷新页面
                                        if (res.res_code === 1) {
                                            $("#cart").html(res.res_body.allNum);
                                            $("#cart-box .checkbox:checked").each(function (i, item) {
                                                $(item).parent().parent().remove();
                                            })
                                            //删除之后查页面还有多少条商品如果为0 count函数会返回所有的checkbox jQuery对象 如果length =0 即代表购物车没有商品了
                                            let num = count();
                                            if (num.length === 0) {
                                                location.reload(); //刷新页面
                                            }
                                        }

                                    }
                                })


                            }
                        }

                    })


                    //单个选择按钮点击事件 每点击一次都计算一次选中的总价
                    $("#cart-box .checkbox").on("click", function () {
                        //判断是否全选
                        if ($("#cart-box .checkbox:checked").length === $("#cart-box .checkbox").length) {
                            $("#all-btn").children().eq(0).addClass("on");
                        } else {
                            $("#all-btn").children().eq(0).removeClass("on");
                        }

                        //将勾选过的当前商品目录发送给后台 计算总价

                        count();


                    })

                    //定义一个计算当前选中商品的总价
                    function count() {
                        let count = 0;
                        //计算所有打钩 的 商品行 总价 
                        $.each($("#cart-box .checkbox:checked"), function (i, item) {
                            count += parseInt($(item).parent().parent().find(".colprice").html().replace("¥", ""));
                        })
                        $("#all-price").html("¥" + count + ".00");
                        return $("#cart-box .checkbox"); //计算完成后返回当前页所有的商品 checkbox jQuery对象 留着有用
                    }


                    //每一行的价格 数量 * 单价   每次改变商品数量都会重新计算 重新改变数据库
                    $(".number").on("change", function () {
                        //判断当前行有没有选择

                        //取消当前行选中按钮
                        // $(this).parent().prev().prev().children().eq(0).prop("checked",false)
                        let num = $(this).val(); //获取当前改变的数量
                        let price = $(this).parent().prev().children().eq(1).html().replace("¥", ""); //获取当前行的单价
                        let proId = $(this).parent().prev().prev().find(".proId").html(); //获取当前行的商品编号proId

                        let that = $(this);
                        //发送数据给数据库修改购物车的值
                        $.ajax({
                            data: {
                                proId: proId,
                                number: num,
                                newPrice: price
                            },
                            url: url.baseUrlPhp + "/project/nbastore/api/v1/updateCart.php",
                            type: "post",
                            dataType: "json",
                            success: function (res) {
                                // console.log(res)
                                // 修改对应的总价
                                let allprice = res.res_body.newPrice * res.res_body.number;
                                //将接收到的返回值 计算后 赋值给当前行的总计
                                that.parent().next().children().eq(0).html("¥" + allprice);
                                if (that.parent().prev().prev().children().eq(0).prop("checked")) {
                                    count();
                                }
                                //更改 购物车小图标上的数字
                                $("#cart").html(res.res_body.allNum);

                            }
                        })
                    })


                    //点击删除按钮删除数据
                    $(".coldel").on("click", function () {
                        if (confirm("确定删除当前商品吗？")) {
                            //找到当前商品的 proId 发送请求 删除数据库
                            // console.log($(this).parent().parent().find(".proId"));
                            let proId = $(this).parent().parent().find(".proId").html();
                            let that = $(this);
                            $.ajax({
                                data: {
                                    proId: proId,
                                },
                                url: url.baseUrlPhp + "/project/nbastore/api/v1/delCart.php",
                                type: "post",
                                dataType: "json",
                                success: function (res) {
                                    console.log(res)
                                    $("#cart").html(res.res_body.allNum);

                                    that.parent().parent().remove();
                                    let num = count(); //删除之后查页面还有多少条商品如果为0
                                    if (num.length === 0) {
                                        location.reload(); //刷新页面
                                    }
                                }
                            })
                        }
                    })


                    //点击支付按钮事件
                    $("#payAll").on("click", function () {
                        // 判断是否登录
                        if (!$.cookie("user")) {
                            alert("请先登录,登录后有优惠")
                        } else {
                            if ($("#cart-box .checkbox:checked").length > 0) {
                                let allPayArr = [];
                                // 将选中的商品传给数据库
                                $.each($("#cart-box .checkbox:checked"), function (i, item) {
                                    // console.log(res)
                                    let current_proId = $(item).parent().find(".proId").html();
                                    let current_number = $(item).parent().parent().find(".number").val();
                                    $.each(res.res_body, function (i, item) {
                                        if (item["proid"] === current_proId) {
                                            //将当前行的数据添加到结算pay数据库 带上数量
                                            item.number = current_number;
                                            allPayArr.push(item)
                                        }
                                    })
                                })
                                //获取要支付的所有商品信息 传给后台 由于前端的后台技术不过硬 前端直接将sql 语句写好 传给后台 直接执行即可
                                //console.log(allPayArr);//将数组总的数据拼接成这样的字符串发送php文件
                                let allPayStr = "insert into allPay (proid,title,picSrc,newPrice,oldPrice,size,number) values";
                                let tempArr = [];
                                $.each(allPayArr, function (i, item) {
                                    let tempStr = `('${item.proid}','${item.title}','${item.picSrc}','${item.newPrice}','${item.oldPrice}','${item.size}','${item.number}')`;
                                    // console.log(tempStr);
                                    tempArr.push(tempStr);
                                })
                                // console.log(tempArr);
                                // console.log(tempArr.join(" ,"));
                                let Str = tempArr.join(" ,");
                                allPayStr += Str;
                                // console.log(allPayStr);
                                // "insert into allPay (proid,title,picSrc,newPrice,oldPrice,size,number) values 
                                // ('$proId','$title','$picSrc','$newPrice','$oldPrice','$size','$number')"
                                $.ajax({
                                    type: "get",
                                    dataType: "json",
                                    url: url.baseUrlPhp + "/project/nbastore/api/v1/allPay.php",
                                    data: {
                                        allPayStr: allPayStr
                                    },
                                    success: function (res) {
                                        console.log(res);
                                        window.location.href = "/html/pay.html"
                                    }
                                })
                            } else {
                                alert("请先选中商品再支付")
                            }
                        }



                    })



                }

            }
        })
    })
})
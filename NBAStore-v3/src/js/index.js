//首页的业务逻辑
require(["./requirejs-config"], () => {
    //引入index需要依赖的模块
    require(["jquery", "url", "header", "footer"], ($, url) => {
        //发送请求  请求图片
        $.ajax({
            type: "get",
            dataType: "json",
            url: url.baseUrlRap + "/NBAStore-index-imgs",
            success: function(res) {
                if (res.res_code === 1) {
                    console.log(res);
                    let imgArr = res.res_body.imgSrc;
                    let ulStr = '';
                    let olStr = '';
                    $.each(imgArr, function(i, item) {
                        ulStr += `<li>
			                   <a href="javascript:console.log(${i});">
			                       <img src="${item.img}${i+1}.jpg">
			                   </a>
			               </li>`;
                        olStr += `<li></li>`;
                    })
                    $("#carousel ul").html(ulStr);
                    $("#carousel ul li:first").addClass("active");
                    //动态生成小圆点
                    $("#carousel ol").html(olStr);
                    $("#carousel ol li:first").addClass("active");
                    // 添加轮播事件
                    //轮播图
                    (function() {
                        var $carousel = $("#carousel");
                        var $index = 0;
                        var $aBtns = $("#carousel ol li");
                        var $aImg = $("#carousel ul li")
                        $aBtns.on("click", function() {
                            //清除上一个的active
                            $(this).addClass("active").siblings().removeClass("active");
                            $index = $(this).index();
                            $aImg.eq($index).stop().fadeIn().siblings().stop().fadeOut();
                        })
                        $("#next").on("click", function() {
                            $index++
                            if ($index >= $aImg.length) $index = 0;
                            $aBtns.eq($index).addClass("active").siblings().removeClass("active");
                            $aImg.eq($index).stop().fadeIn().siblings().stop().fadeOut();
                        })

                        $("#prev").on("click", function() {
                            $index--
                            if ($index < 0) $index = $aImg.length - 1;
                            $aBtns.eq($index).addClass("active").siblings().removeClass("active");
                            $aImg.eq($index).stop().fadeIn().siblings().stop().fadeOut();
                        })

                        //判断页面加载完成后鼠标在没在轮播图中
                        //在的话 就不要开启自动轮播功能
                        //不在的话就开启自动轮播功能 
                        $carousel.timer = null;
                        $carousel.one("mouseout", function(e) {
                            console.log("鼠标在轮播图中");
                            clearInterval($carousel.timer);
                        })
                        $carousel.timer = setInterval(() => {
                            $("#next").trigger("click");
                        }, 2000);

                        $carousel.on("mouseenter", function() {
                            clearInterval($carousel.timer);
                        });
                        $carousel.on("mouseleave", function() {
                            $carousel.timer = setInterval(() => {
                                $("#next").trigger("click");
                            }, 2000);
                        });

                        //阻止点击按钮文本被选中
                        $("#next").get(0).onselectstart = function() {
                            return false;
                        };
                        $("#prev").get(0).onselectstart = function() {
                            return false;
                        };
                    }());
                }

            }
        })
    })
})
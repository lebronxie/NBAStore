//登陆注册页面的业务逻辑
require(["./requirejs-config"], () => {
	//引入index需要依赖的模块
	require(["jquery", "item", "url", "cookie", "header", "footer"], ($, item, url) => {

		//实例化 列表
		item.init(url.baseUrlRap + "/all-list");


		//分类栏鼠标点击 展开效果 左侧栏一级导航
		$(".list-yijinav>li>a").attr("log", "off")
		$(".list-yijinav>li>a").on("click", function () {
			if ($(this).attr("log") === "off") {
				var height = $(this).next().find("li").length * 28;
				$(this).next().animate({
					height: height
				});
				$(this).children().css({
					"background-position": "-40px -319px"
				})
				$(this).attr("log", "on")
			} else if ($(this).attr("log") === "on") {
				$(this).next().animate({
					height: 0
				});
				$(this).children().css({
					"background-position": "-10px -319px"
				})
				$(this).attr("log", "off")
			}

		})

		//分类栏鼠标点击 展开效果 左侧栏二级导航
		$(".list-erjinav li").attr("log", "off")
		$(".list-erjinav li").on("click", function () {
			if ($(this).attr("log") === "off") {
				//清除其他所有的on
				$(".icon-list-choice").css({
					"background-position": "-63px -630px"
				}).parent().attr("log", "off");
				$(this).children().css({
					"background-position": "-10px -630px"
				});

				$(this).attr("log", "on")
			} else if ($(this).attr("log") === "on") {
				$(this).children().css({
					"background-position": "-63px -630px"
				});
				$(this).attr("log", "off");
			}
		})

		//给主内容排序方法添加点击事件
		$(".content-menu").on("click", "span", function () {
			$(this).next().show()
		})
		$(".content-menu").on("click", "li", function () {
			let html = $(this).text();
			$(this).addClass("active").siblings().removeClass("active").parent().hide().prev().find("a").html(html)
		})
	})
})
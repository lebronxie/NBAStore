//首页的业务逻辑
require(["./requirejs-config"], () => {
	//引入index需要依赖的模块
	require(["jquery", "header", "footer"], () => {
	    //轮播图
	       (function(){
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
            $carousel.one("mouseout",function(e){
		    	console.log("鼠标在轮播图中");
		    	clearInterval($carousel.timer);
		    })
			$carousel.timer = setInterval(() => {
				$("#next").trigger("click");
			}, 2000);

			$carousel.on("mouseenter",function(){
				clearInterval($carousel.timer);
			});
			$carousel.on("mouseleave",function(){
				$carousel.timer = setInterval(() => {
					$("#next").trigger("click");
				}, 2000);
			});
			/*$carousel.hover(function() {
				console.log(1)
				clearInterval($carousel.timer);
			}, autoPlay);*/
           //阻止点击按钮文本被选中
			$("#next").get(0).onselectstart = function () {
				    return false;
				};
			$("#prev").get(0).onselectstart = function () {
				    return false;
				};
	      }());
	})
})
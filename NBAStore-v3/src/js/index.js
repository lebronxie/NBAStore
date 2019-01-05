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
			$carousel.timer = null;
			$carousel.hover(function() {
				clearInterval($carousel.timer);
			}, (function autoPlay() {
				$carousel.timer = setInterval(() => {
					$("#next").trigger("click");
				}, 2000);
				return autoPlay;
			})());
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
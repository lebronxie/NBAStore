define(["jquery"], () => {
	class Footer {
		constructor() {
			this.init();
		}
		init() {
			//加载foot.html
			new Promise((resolve, reject) => {
				$("footer").load("/html/commonhtml/foot.html", () => {
					resolve();
				})
			}).then(() => {
				this.goTop()
			})
		}
		goTop() {
			$(".goTop").on("click", function () {
				$('html,body').animate({
					scrollTop: '0px'
				}, 800)
			})


			$(window).on("scroll", function () {
				if ($(document).scrollTop() > 300) {
					$(".goTop").show()
				} else {
					$(".goTop").hide()
				}
			})
		}

	}
	return new Footer();
})
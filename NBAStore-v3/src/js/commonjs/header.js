define(["jquery","cookie"], () => {
	class Header {
		constructor() {
			this.init();
		}
		init() {
			//加载header.html
			new Promise((resolve, reject) => {
				$("header").load("/html/commonhtml/head.html", () => {
					resolve();
				})
			}).then(() => {
				this.search();
				this.hasCookie()
			})
		}
		search() {
			$("#search").on("input", function() {
				$("#list").html("").show()
				var str = this.value;
				// console.log(str);
				$.getJSON("https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su?cb=?&wd=" + str, function(res) {
					var data = res.s
					// console.log(data);
					$.each(data, function(index, item) {
						$("<li>").html(item).appendTo($("#list")).on("click", function() {
							$("input").val(($(this).html()));
							$("#list").hide();
						});
					})
				})
			})
		}
		hasCookie() {
			//判断用户是否登录 即有没有user cookie
			if ($.cookie("user")) {
				$("#loginandsignup").parent().html(`<a id="seeyou">注销</a>`);
				$("#seeyou").on("click", function() {
					$(this).parent().html(`<a href="/html/loginandsignup.html" id="loginandsignup">登录/注册</a>`)
					 $.removeCookie('user');
					location.href="/html/loginandsignup.html"
				})
			}
		}
	}
	return new Header();
})
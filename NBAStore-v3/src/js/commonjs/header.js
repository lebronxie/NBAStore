define(["url","jquery","cookie"], (url) => {
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
				this.hasCookie();
				this.headerCart();
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
					if(confirm("确定退出登录")){
						$(this).parent().html(`<a href="/html/loginandsignup.html" id="loginandsignup">登录/注册</a>`);
						 $.removeCookie('user',{path:"/"});
						 location.reload();
					}
				})
			}
		}
		headerCart(){
               $.ajax({
	                url: url.baseUrlPhp + "/project/nbastore/api/v1/getAllNum.php",
	                type: "post",
	                success: function(res) {
	                    //拿到返回回来的 allNum 放在购物车图标小数字上
	                    $("#cart").html(res.res_body.allNum);
	                },
	                dataType: "json"

                })
		}
	}
	return new Header();
})
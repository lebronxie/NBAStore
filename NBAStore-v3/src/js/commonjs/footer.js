define(["jquery"], () => {
	class Footer{
		constructor(){
			this.init();
		}
		init(){
			//加载foot.html
			new Promise((resolve, reject) => {
				$("footer").load("/html/commonhtml/foot.html", () => {
					resolve();
				})
			}).then(() => {
				// 待续
			})
		}
		
	}
	return new Footer();
})
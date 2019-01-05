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
				this.search();
			})
		}
		search(){
			console.log("footer成功了")
		}
	}
	return new Footer();
})
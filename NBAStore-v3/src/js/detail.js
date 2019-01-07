require(["./requirejs-config"], () => {
  //引入index需要依赖的模块
  require(["jquery", "item","url","template","cookie", "header", "footer"], ($, item, url,template) => {
         //通过产品列表传过来的id 渲染 页面 
         var id = location.search.split("=")[1];
         //拿着这个id去请求数据
           $.ajax({
           	    data:{id:id},
				url: url.baseUrlRap + "/single",
				type: "get",
				success: function(res){
					// console.log(res);
					if(res.res_code === 1){
					   let list = res.res_body.data;
					   console.log(list)
						//通过模板引擎渲染结构
						let html = template("detail", {productDetail: res.res_body.data});
						$("#container").html(html);
						 /*只能在这里面写js逻辑吗？？*/
                         

                         // 图片移动特效 点击小图移动 大图 超大图都跟着显示
                         let btns = $(".rowlist-content li");
                         let magnify = $(".content .magnify");
						 btns.on("click",function(){
						 	 $(this).addClass("active").siblings().removeClass("active");
						 	 let index = $(this).index();
						 	 $(".content .big img").eq(index).addClass("active").siblings().removeClass("active");
						 	 $(".content .bigger img").eq(index).addClass("active").siblings().removeClass("active");
						 })
                        //判断临界值
						 $(".rowlist .next").on("click",function(){
						 	 $(".rowlist-content ul").animate({top:-105});
						 	 	 if(btns.eq(0).hasClass("active")){
							 	 	btns.eq(0).removeClass("active");
							 	 	btns.eq(1).addClass("active");
							 	 	 $(".content .big img").eq(1).addClass("active").siblings().removeClass("active");
							 	 	  $(".content .bigger img").eq(1).addClass("active").siblings().removeClass("active");

						 	 }
						 });

                        //判断临界值
						 $(".rowlist .prev").on("click",function(){
						 	 $(".rowlist-content ul").animate({top:0});
						 	  if(btns.eq(4).hasClass("active")){
						 	 	btns.eq(4).removeClass("active");
						 	 	btns.eq(3).addClass("active");
						 	 	 $(".content .big img").eq(3).addClass("active").siblings().removeClass("active");
						 	 	  $(".content .bigger img").eq(3).addClass("active").siblings().removeClass("active");
						 	 }
						 
						 })
                        
                       //鼠标移动大图 超大图显示 放大镜显示 跟着鼠标移动
                       $(".content .big").on("mouseenter",function(){
                       	  $(".content .bigger").show(600);
                       	     magnify.show();
                       	    var maxLeft = $(".content .big").width() - magnify.width()
        	                var maxTop = $(".content .big").height() - magnify.height()
                       	   $(document).on("mousemove",function(e){
                                   // 获取鼠标相对于big图片的位置赋值给放大镜
                                  let left =  e.pageX - $(".content .big").offset().left - magnify.width()/2 ;
                                  let top =  e.pageY - $(".content .big").offset().top - magnify.height()/2 ;
                                  if(left < 0) left = 0;
                                  if(top < 0) top = 0;
                                  if(left > maxLeft) left =  maxLeft;
                                  if(top > maxTop) top =  maxTop;
                                   magnify.css({left:left,top:top})

                                  //超大图也要跟着鼠标动
                                  $(".content .bigger img").css({left:-3.333 * left,top:-3.333 * top})
                                  
                       	    })

                       })    
                        $(".content .big").on("mouseleave",function(){
                       	  $(".content .bigger").hide();
                       	  magnify.hide();
                       	  

                       })    

					}
				}
			})
        

     })
})

require(["./requirejs-config"], () => {
  //引入index需要依赖的模块
  require(["jquery", "item","url","template","cookie", "header", "footer"], ($, item, url,template) => {
       //拿到数据库数据动态渲染
       $.ajax({
       	   url: url.baseUrlPhp + "/project/nbastore/api/v1/pullCart.php",
           type: "post",
           dataType: "json",
           success : function(res){
            // console.log(res)
            if(res.res_code === 1 && res.res_body.length == 0){
                $("#cart-box").html(`<div class="cart-empty">
                    <h4>您的购物车是空的。</h4>
                    <p>
                      您还未添加商品<br>点击&nbsp;<a href="/">此处</a>&nbsp;继续购物</p>
                    <a onclick="javascript :history.back(-1);" class="btn btn-blueBorder">返回</a>
                  </div>`)
            }

           	 if(res.res_code === 1 && res.res_body.length > 0){
                let html = template("cart-template", {cartList: res.res_body});
             // console.log(html)
             $("#cart-box").html(html)


             //写购物车逻辑  单选 全选 计算总价 修改数据库等。。。
               $("#all-btn").on("click",function(){
                  $(this).children().eq(0).toggleClass("on");
                  // 全选
                  $("#cart-box .checkbox").prop("checked", $(this).children().eq(0).hasClass("on")).toggleClass("on");
                  count();
               })
            //点击顶部删除按钮 删除选中的商品
            $("#del-checked").on("click",function(){
                if($("#cart-box .checkbox:checked").length > 0){
                   if(confirm("确定删除选中商品吗？")){
                     $.each($("#cart-box .checkbox:checked"),function(i,item){
                        $(item).parent().parent().find(".coldel").trigger("click");
                     })
                       
                   }
                }
                
            })
              //单个选择按钮点击事件
              $("#cart-box .checkbox").on("click",function(){
                  if( $("#cart-box .checkbox:checked").length === $("#cart-box .checkbox").length){
                     $("#all-btn").children().eq(0).addClass("on");
                  }else{
                      $("#all-btn").children().eq(0).removeClass("on");
                  }

                //将勾选过的当前商品目录发送给后台 计算总价
                // console.log(count())
                count();
                
                 
              })

              function count(){
                 let count = 0;
                 //计算所有打钩 的 商品行 总价 
                
                 $.each( $("#cart-box .checkbox:checked"),function(i,item){
                    count += parseInt($(item).parent().parent().find(".colprice").html().replace("¥",""));
                 })
                 $("#all-price").html("¥" + count + ".00");
                 return  $("#cart-box .checkbox")
              }


              //每一行的价格 数量 * 单价 
              $(".number").on("change",function(){
                //判断当前行有没有选择
                
                //取消当前行选中按钮
                // $(this).parent().prev().prev().children().eq(0).prop("checked",false)
                let num = $(this).val(); //获取当前改变的数量
                let price = $(this).parent().prev().children().eq(1).html().replace("¥","")
                ;//获取当前行的单价
               let proId = $(this).parent().prev().prev().find(".proId").html(); //获取当前行的商品编号proId

              let that = $(this);
               //发送数据给数据库修改购物车的值
             $.ajax({
                   data:{
                     proId : proId,
                     number : num,
                     newPrice:price
                   },
                   url: url.baseUrlPhp + "/project/nbastore/api/v1/updateCart.php",
                   type: "post",
                   dataType: "json",
                   success : function(res){
                      // console.log(res)
                      // 修改对应的总价
                      let allprice = res.res_body.newPrice * res.res_body.number;
                      //将接收到的返回值 计算后 赋值给当前行的总计
                      that.parent().next().children().eq(0).html("¥" + allprice);
                      if(that.parent().prev().prev().children().eq(0).prop("checked")){
                       count();
                      }
                      //更改 购物车小图标上的数字
                       $("#cart").html(res.res_body.allNum);

                   }
               })
              })
              
           
           //点击删除按钮删除数据
           $(".coldel").on("click",function(){
              if(confirm("确定删除当前商品吗？")){
                 //找到当前商品的 proId 发送请求 删除数据库
                 // console.log($(this).parent().parent().find(".proId"));
                 let proId = $(this).parent().parent().find(".proId").html();
                 let that = $(this);
                 $.ajax({
                   data:{
                     proId : proId,
                   },
                   url: url.baseUrlPhp + "/project/nbastore/api/v1/delCart.php",
                   type: "post",
                   dataType: "json",
                   success : function(res){
                      that.parent().parent().remove();
                       let num = count();//删除之后查页面还有多少条商品如果为0
                       if(num.length === 0){
                         location.reload();//刷新页面
                       }
                   }
               })
              }
           })


             }
       
           }
       })
  })
})
require(["./requirejs-config"], () => {
  //引入index需要依赖的模块
  require(["jquery","url","template", "cookie", "header", "footer"], ($,url,template) => {
         // 通过判断url地址 是否 有 id 判断 是否 是直接购买过来的 
        if(window.location.search === ""){
           console.log("从购物车跳过来的");
             $.ajax({
                type : "post",
                dataType : "json",
                url : url.baseUrlPhp + "/project/nbastore/api/v1/getAllPay.php",
                success : function(res){
                  if(res.res_code === 1){
                    console.log(res)
                 
                     let msg = res.res_body;
                     // console.log(msg);
                    let html = template("pay-template", { payList: msg });
                    // console.log(html)
                    $("#payList").html(html);

                    //加载成功后 修改 订单产品总额
                    
                    let proPrice = 0;
                    $.each(msg,function(i,item){
                       proPrice += item["newPrice"] * item["number"];
                    })
                    // console.log(proPrice);
                    $("#proPrice").html("¥" + proPrice + ".00");
                    $("#allPrice").html("¥" + proPrice + ".00");
                  }
                }
             })
  

        }else{
           console.log("从详情页直接支付过来的");

           let proArr = window.location.search.replace("?","").split("=");
             let tempObj = {};
             tempObj[proArr[0]] = proArr[1];
             console.log(tempObj)
             $.ajax({
                type : "post",
                dataType : "json",
                url : url.baseUrlPhp + "/project/nbastore/api/v1/getIsBuyNow.php",
                data : {proId : tempObj.id},
                success : function(res){
                  if(res.res_code === 1){
                      //添加isBuyNow 成功跳到支付界面
                     let msg = res.res_body;
                     // console.log(msg);
                    let html = template("pay-template", { payList: msg });
                    // console.log(html)
                    $("#payList").html(html);

                    //加载成功后 修改 订单产品总额
                    $("#proPrice").html("¥" + msg[0].newPrice * msg[0].number + ".00");
                    $("#allPrice").html("¥" + msg[0].newPrice * msg[0].number + ".00");
                  }
                }
             })
        }

  })
})
require(["./requirejs-config"], () => {
  //引入index需要依赖的模块
  require(["jquery", "url", "cookie", "header", "footer"], () => {
    //判断有没有登录 没有登录跳转到登录页面
    if (!$.cookie("user")) {
      window.location.href = "/html/loginandsignup.html";
    }

    //登录了就根据数据库的内容渲染页面
  })
})
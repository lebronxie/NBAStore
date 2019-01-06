//登陆注册页面的业务逻辑
require(["./requirejs-config"], () => {
  //引入index需要依赖的模块
  require(["jquery","url", "cookie", "header", "footer"], ($,url) => {
    //注册功能
    var flag = false,
      flag1 = true;
    $("#signup-from input").on("focus", function() {
      $(this).css({
        "border-color": "#ccc"
      }).parent().next().hide().next().hide();

    })
    $("#signup-from input").on("blur", function() {
      //先验证输入框内容
      if (this === $("#signup_userphone")[0]) {
        var reg = /^[1][3,4,5,7,8][0-9]{9}$/;
        var phone = $(this).val();
        if (!reg.test(phone)) {
          $(this).css({
            "border-color": "red"
          }).parent().next().show();
          flag = false;
          flag1 = false;

        } else {
          $(this).css({
            "border-color": "#ccc"
          }).parent().next().hide();
          flag = true;
          flag1 = true;
        }
      } else if (this === $("#signup_password")[0]) {
        var reg = /^[0-9A-Za-z]{8,16}$/;
        var phone = $(this).val();
        if (!reg.test(phone)) {
          $(this).css({
            "border-color": "red"
          }).parent().next().show();
          flag = false;
          flag1 = false;
        } else {
          $(this).css({
            "border-color": "#ccc"
          }).parent().next().hide();
          flag = true;
          flag1 = true;
        }
      } else if (this === $("#signup_password2")[0]) {
        if ($(this).val() !== $("#signup_password").val()) {
          $(this).css({
            "border-color": "red"
          }).parent().next().show();
          flag = false;
          flag1 = false;

        } else {
          $(this).css({
            "border-color": "#ccc"
          }).parent().next().hide();
          flag = true;
        }
      }
    })

    //判断同意条款进行注册
    $("#agree").on("click", function() {
      if ($(this).prop("checked")) {
        $("#signup").css({
          "background": "#00559a",
          "color": "#fff"
        })
      } else {
        $("#signup").css({
          "background": "#ddd",
          "color": "#000"
        })
      }

    })
    $("#signup").on("click", function() {
      if ($("#signup_userphone").val() === "") {
        $("#signup_userphone").css({
          "border-color": "red"
        }).parent().next().hide().next().show();
        flag1 = false;
      }
      if ($("#signup_password").val() === "") {
        $("#signup_password").css({
          "border-color": "red"
        }).parent().next().hide().next().show();
        flag1 = false;
      }
      if ($("#signup_password2").val() === "") {
        $("#signup_password2").css({
          "border-color": "red"
        }).parent().next().hide().next().show();
        flag1 = false;
      }

      // console.log( flag,flag1,$("#agree").prop("checked"))
      if (flag && flag1 && $("#agree").prop("checked")) {
        // 进入这里表示能够提交数据了但是有可能再次更改密码所以得在判断两次密码相不相等
        //点击注册按钮 再次判断两次密码是否相等
        if ($("#signup_password2").val() !== $("#signup_password").val()) {
          $("#signup_password2").css({
            "border-color": "red"
          }).parent().next().show();
        } else {
          //全部符合 可以存入数据库 和 cookie 
          // console.log("ok全部符合 可以交给后台判断 数据库有没有重名的 和 存入cookie ")
          $("#signup_password2").css({
            "border-color": "#ccc"
          }).parent().next().hide();
          //将数据交给后台
          $.ajax({
            url: url.baseUrlPhp + "/project/nbastore/api/v1/signup.php",
            type: "post",
            data: {
              phone: $("#signup_userphone").val(),
              password: $("#signup_password").val()
            },
            success: function(res) {
              if (res.res_code === 0) {
                alert("该手机号已注册请登录")
                location.href = "/html/loginandsignup.html";
              }
              if (res.res_code === 1) {
                alert("注册成功，马上去登录");
                // console.log(res)
                $.cookie("currentuser", JSON.stringify(res.res_body))
                location.href = "/html/loginandsignup.html";
              }
            },
            dataType: "json"
          })
        }
      }
      return false;
    })



    //登陆功能
    // 先判断有没有cookie 有就自动登录
    // currentuser cookie是 用户注册的时候保留的cookie  只用一次在 注册完了之后放在登陆框里面
    // rememberme  cookie是 用户登陆的时候点击了保留7天 存的
    // user cookie 是当前用户登陆中 的 退出登陆和关闭浏览器都会删除
    var $userCookie = $.cookie("currentuser");
    var $remembermeCookie = $.cookie("rememberme");

    // var $login = $("#login-from");
    if ($userCookie) { //如果有自动放在登陆框里面
      let $userJson = JSON.parse($userCookie);
      $("#login_userphone").val($userJson.phone);
      $("#login_password").val($userJson.password);
      $.removeCookie('currentuser')
    } else if ($remembermeCookie) {
      // console.log($remembermeCookie)
      let $userJson = JSON.parse($remembermeCookie);
      $("#login_userphone").val($userJson.phone);
      $("#login_password").val($userJson.password);
    }

    //注册登陆 按钮 事件 
    $("#login").on("click", function() {
      $.ajax({
        url:  url.baseUrlPhp + "/project/nbastore/api/v1/login.php",
        type: "post",
        data: {
          phone: $("#login_userphone").val(),
          password: $("#login_password").val()
        },
        success: function(res) {
          // console.log(res);
          // console.log($("#rememberme").prop("checked"));
          if (res.res_code) {
            $.cookie("user", JSON.stringify(res.res_body), {
              path: "/"
            })
            alert("登录成功");
            if ($("#rememberme").prop("checked")) {
              $.cookie("rememberme", JSON.stringify(res.res_body), {
                path: "/",
                expires: 7
              })
            }
            $("#loginandsignup").parent().html(`<a id="seeyou">注销</a>`);
            $("#login_userphone").val("");
            $("#login_password").val("");
            // 跳回上一个网页
            window.history.back(-1); 
          } else {
            alert(res.res_body);
            location.href = "/html/loginandsignup.html";
          }
        },
        dataType: "json"
      })


      return false;
    })

  })
})
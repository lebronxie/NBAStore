要求：

​    满足电商基本业务要求

​    模块化开发

​    逻辑清晰

​    代码飘逸。

### src 是开发文件

​       **package.json**极为重要 

​       要换电脑开发可以删除 dist文件  和 node_modules 文件

​       用命令行在NBAStore文件下执行 npm-install 可以自动下载所有的所需工具 如下：

```javascript
"devDependencies": {
    "@babel/core": "^7.2.2",
    "@babel/preset-env": "^7.2.3", 
    "gulp": "^3.9.1",  //gulp
    "gulp-babel": "^8.0.0",//es6转es5
    "gulp-connect": "^5.7.0", //建立服务器
    "gulp-htmlmin": "^5.0.1", //html 压缩
    "gulp-clean-css": "^1.2.4",//css 压缩
    "gulp-uglify": "^3.0.1"//js 压缩
    "gulp-sass": "^4.0.2",// sass
    "node-sass": "^4.11.0"// sass
  }
```

​      gulpfile.js是导入第三方模块功能

```javascript
//引入第三方模块
const gulp = require("gulp");

const cleanCss = require("gulp-clean-css");

const htmlmin = require("gulp-htmlmin");

const uglify = require("gulp-uglify");

const babel = require('gulp-babel');
//定义一个服务器
const connect = require("gulp-connect");

const sass = require("gulp-sass");

//指定任务  默认任务 可不写
gulp.task("default",function(){
	console.log("hhh")
})
//css 任务 sass转css 再压缩 再保存 修改后自动刷新页面
gulp.task("css",function(){
	gulp.src("src/scss/**/*.scss")
	    .pipe(sass())
	    .pipe(cleanCss())
	    .pipe(gulp.dest("dist/css"))
	    .pipe(connect.reload());
})
//html 任务  html压缩 再保存 修改后自动刷新页面
gulp.task("html",function(){
	gulp.src("src/**/*.html")
	    .pipe(htmlmin({
	    	removeComments: true,//清除HTML注释
               collapseWhitespace: true,//压缩HTML
               collapseBooleanAttributes: true,//省略布尔属性的值 <input checked="true"/> ==> <input />
               removeEmptyAttributes: true,//删除所有空格作属性值 <input id="" /> ==> <input />
               removeScriptTypeAttributes: true,//删除<script>的type="text/javascript"
               removeStyleLinkTypeAttributes: true//删除<style>和<link>的type="text/css"
	    }))
	    .pipe(gulp.dest("dist"))
	    .pipe(connect.reload());
})
//js 任务 先es6转es5 再压缩js代码 后保存  修改后自动刷新页面
gulp.task("js",function(){
	gulp.src("src/js/**/*.js")
	    .pipe(babel({
		  presets: ['@babel/env']
		}))
	    .pipe(uglify())
	    .pipe(gulp.dest("dist/js"))
	    .pipe(connect.reload());
})
// 开启服务器任务 利用connect模块 
gulp.task("server", function(){
	//开启服务器
	connect.server({
		port:5500,
		livereload: true,
		root: "dist"
	})
})
//移动静态文件
gulp.task("static", function(){
	gulp.src("src/static/**/*")
		.pipe(gulp.dest("dist/static"))
		.pipe(connect.reload());;
})
//移动libs 公用库
gulp.task("libs", () => {
	gulp.src("src/libs/**/*")
		.pipe(gulp.dest("dist/libs"));
})
//监听html css js 变化
gulp.task("watch", function(){
	gulp.watch("src/**/*.html", ["html"]);
	gulp.watch("src/scss/**/*.scss", ["css"]);
	gulp.watch("src/js/**/*.js", ["js"]);
})
//统一执行任务  第一个参数必写
gulp.task("default", ["html", "css", "js","server","static","libs", "watch"]);
```



### dist是生产文件

​        可以在localhost:5500上直接运行


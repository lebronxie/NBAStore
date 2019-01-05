//引入模块
const gulp = require("gulp");

const cleanCss = require("gulp-clean-css");

const htmlmin = require("gulp-htmlmin");

const uglify = require("gulp-uglify");

const babel = require('gulp-babel');
//定义一个服务器
const connect = require("gulp-connect");

const sass = require("gulp-sass");

//指定任务
gulp.task("css",function(){
	gulp.src("src/scss/**/*.scss")
	    .pipe(sass())
	    .pipe(cleanCss())
	    .pipe(gulp.dest("dist/css"))
	    .pipe(connect.reload());
})
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

gulp.task("js",function(){
	gulp.src("src/js/**/*.js")
	    .pipe(babel({
		  presets: ['@babel/env']
		}))
	    .pipe(uglify())
	    .pipe(gulp.dest("dist/js"))
	    .pipe(connect.reload());
})

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
gulp.task("watch", function(){
	gulp.watch("src/**/*.html", ["html"]);
	gulp.watch("src/scss/**/*.scss", ["css"]);
	gulp.watch("src/js/**/*.js", ["js"]);
})

gulp.task("default", ["html", "css", "js","server","static","libs", "watch"]);
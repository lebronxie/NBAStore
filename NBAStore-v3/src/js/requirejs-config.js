require.config({
	baseUrl: "/",

	paths: {
		"jquery": "libs/jquery/jquery-1.11.3.min",
		"cookie": "libs/jquery/jquery-plugins/jquery.cookie",
		"header": "js/commonjs/header",
		"footer": "js/commonjs/footer",
		"item": "js/commonjs/item",
		"url": "js/commonjs/url",
		"template": "libs/template/template-web"
	},
	//不符合AMD规范的模块，垫片
	shim: {
		"cookie": {
			deps: ["jquery"]
		}
	}
})
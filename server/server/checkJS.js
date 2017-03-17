var http = require("http");
var fs = require("fs");//文件系统
var cheerio = require("./cheerio/index.js");//生成Dom结构
var i=0;

function checkJS(resolve, website, JSlibrary){
	var website = "http://"+website;
	var prom = new Promise(function(resolve, reject){
		http.get(website, function(res){
			var html = "";
			var title = [];
			res.setEncoding("utf-8");//防止中文乱码
		
			//
			res.on("data",function(chunk){
				html += chunk;
			})
			//当整个页面都被读取完毕
			res.on("end",function(){
				var $ = cheerio.load(html);
				
				var JSreg = new RegExp(/([a-zA-Z]{1,}?)\./);
				var Js = JSlibrary.match(JSreg);
				if(JSreg.test(JSlibrary)){
					var Js = JSlibrary.match(JSreg)[1];
				}
				else{
					Js = JSlibrary;
				}
				console.log(Js);
				var reg = new RegExp("/"+Js+"/", "i");
				
				//获取所有的script中的src属性
				result = "notfind";
				var src = $('script');//.attr("src");
				for(var i=0; i < src.length; i++){
					if(reg.test(src.eq(i).attr("src"))){
						result = "find";
					}
				}
				resolve(result);
			});
		}).on("error",function(err){
			console.log(err);
		});
	})
	prom.then(function(result){
		resolve(result);
	});
}

exports.checkJS = checkJS;
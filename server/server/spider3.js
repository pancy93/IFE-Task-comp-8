var http = require("http");
var cheerio = require("./cheerio/index.js");//生成Dom结构
var qs = require("querystring");
var fs = require("fs");
var turn = 0;
var JSlibrary = ["jquery", "react", "vue", "echarts", "angular", "angular2", "DHTMLX", "Rico", "YUI", "Prototype"];//一共十种常用的JS库用来排名
function spider(website){
	console.log(website);
	var option = {
		hostname : website,
		port: 80,
		method: 'GET',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'IE8 on Windows Vista'
		}
	};
	http.get(option, function(res){
		var html = "";
		res.on("data",function(chunk){
			html+=chunk;
		});
		res.on("end",function(){
			var $ = cheerio.load(html);
			var src = $("script");
			for(var i=0; i<src.length; i++){
				for(var x=0; x<JSlibrary.length; x++){
					var JS = JSlibrary[x];
					var reg = new RegExp("/"+JS+"/","i");
					if(reg.test(src.eq(i).attr("src"))){
						refresh(JS);
					}
				}
			}
		});
	}).on("error",(err)=>{
		console.log("错误"+err);
	});
	return;
}
function init(url){
	//如果是重新排名则清空文件中的文本
	if(!url){
		clearFile();
	}
	console.log(url);
	var option = {
		hostname : "www.alexa.cn",
		path: url ? url : "/siterank",
		port: 80,
		method: 'GET',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded',
			'User-Agent': 'IE8 on Windows Vista'
		}
	};
	http.get(option, function(res){
		var html = "";
		res.setEncoding("utf-8");
		
		res.on("data",function(chunk){
			html+=chunk;
		});
		res.on("end",function(){
			var $ = cheerio.load(html);
			var src = $('.siterank-sitelist').eq(0).children("li");//获取一个页面的20个横向标题
			for(var i=0; i<src.length; i++){
				var website = "www." + src.eq(i).children(".info-wrap").eq(0).children(".domain").eq(0).children("a").eq(0).text().trim().toLowerCase();
				spider(website);
				turn++;
			}
			
			if(turn < 500){
				var newurl = null;
				var nexturl = $('.pager').eq(0).children("a");
				for(var i=0; i<nexturl.length; i++){
					if(nexturl.eq(i).text().trim() == "下一页"){
						newurl = nexturl.eq(i).attr("href");
						break;
					}
				}
				init(newurl);
			}
			else{
				return;
			}
		});
	}).on('error', (e) => {
		console.log('错误: '+e.message);
	});
}

function clearFile(){
	var newjson = '{"jquery":0, "react":0, "vue":0, "echarts":0, "angular":0, "angular2":0, "DHTMLX":0, "Rico":0, "YUI":0, "Prototype":0}';
	fs.writeFile("./rank.txt", newjson,"utf8",(err)=>{
			if(err) throw err;
		});
}

function refresh(JS){
	console.log(JS);
	var option = {
		encoding:"utf8",
		flag:"r"
	};
	var data = fs.readFileSync("./rank.txt",option);
	//加上.trim()去掉文件开头处的空白字符，并转化为object类型便于操作
	var json = JSON.parse(data.trim());
	//找到对应的JS库，并将他的数量自加1
	json[JS]++;
	var json = JSON.stringify(json);
	//将新的信息录入文件中
	fs.writeFileSync("./rank.txt", json);
};
exports.refresh = init;
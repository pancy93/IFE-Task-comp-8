var http = require("http");
var fs = require("fs");//文件系统
var cheerio = require("./cheerio/index.js");//生成Dom结构
var checkJS = require("./spider.js");
var turn = 0;
var vlueArray = new Array();//定义一个全局变量保存结果
var findJS = new Array();//定义一个保存所有promise的数组

function spider(resolve, url){
	if(!url){
		var option = {
			hostname : "www.alexa.cn",
			path: "/siterank",
			port: 80,
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': 'IE8 on Windows Vista'
			}
		};
	}
	else{
		var option = {
			hostname : "www.alexa.cn",
			path: url,
			port: 80,
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': 'IE8 on Windows Vista'
			}
		};
	}
	http.get(option, function(res){
		var html = "";
		var title = [];
		res.setEncoding("utf-8");//防止中文乱码
		
		res.on("data",function(chunk){
			html += chunk;
		})
		//当整个页面都被读取完毕
		res.on("end",function(){
			var $ = cheerio.load(html);
			var src = $('.siterank-sitelist').eq(0).children("li");//.attr("src");
			for(var i=0; i<src.length; i++){
				vlueArray[turn] = new Object();
				vlueArray[turn]["rank"] = src.eq(i).children(".rank-index").eq(0).text().trim();
				vlueArray[turn]["website"] = "www." + src.eq(i).children(".info-wrap").eq(0).children(".domain").eq(0).children("a").eq(0).text().trim().toLowerCase();
				vlueArray[turn]["name"] = src.eq(i).find(".infos").eq(0).text().trim().match(/([\u4E00-\u9FA5a-zA-Z0-9]{1,})[\uFF08,\(,\.]/)[1];
				
				//用另外一个爬虫查找指定的网站有没有使用Jquery
				findJS[i] = new Promise(function(solution, reject){
					var object = new Object();
					object["index"] = turn;
					object["website"] = vlueArray[turn]["website"];
					checkJS.spider(solution ,object, "jquery");
				});
				findJS[i].then(object=>{
					vlueArray[object.index]["jquery"] = object.find;
				})
				
				if(++turn == amount){
					break;
				}
				
			}
			
			var nexturl = $('.pager').eq(0).children("a");
			for(var i=0; i<nexturl.length; i++){
				if(nexturl.eq(i).text().trim() == "下一页"){
					nexturl = nexturl.eq(i).attr("href");
					break;
				}
			}
			
			
			if(turn < amount){
				spider(null, nexturl);
			}
			//如果函数在递归中并且并不是调用栈的最顶端
			else if(turn >20 && turn == amount){
				return;
			}
			Promise.all(findJS).then(function(){
					//没事不要乱传参数
					resolve();
				})
		});
	}).on("error",function(err){
		console.log(err);
	});
}

function initSpider(resolve, rank){
	amount = parseInt(rank);
	var prom = new Promise(function(resolve, reject){
			
			//此时创建第一个爬虫
			var spider = createSpider();
			spider.then(function(){
				resolve();
			})
		});
	prom.then(function(){
		resolve(vlueArray);
		turn = 0;
		vlueArray = new Array();
	});
}

//继续爬取信息
function createSpider(url){
	return new Promise(function(resolve, reject){
		spider(resolve, url);
	});
}

exports.initSpider = initSpider;
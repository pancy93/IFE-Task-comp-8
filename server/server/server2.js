var http = require("http");
var url = require("url");
var qs = require("querystring");
var spider = require("./spider2");
var url = "http://www.alexa.cn/siterank/";

var writeOut = function(result, res){
	res.write(JSON.stringify(result));
	res.end();
};

function server2(){
	http.createServer(function(req,res){
		res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*"});
		if(req.method.toUpperCase() == 'POST'){
			var postData = "";
			req.addListener("data", function(data){
				postData += data;
			});
			req.addListener("end", function(){
				var query = qs.parse(postData);
				var rank = query.rank;
				
				//通过爬虫爬取消息
				var result = null;
				var promise = new Promise(
					function(resolve, reject){
						spider.initSpider(resolve, rank);
				});
				promise.then(function(result){
					console.log("work");
					writeOut(result, res);
				});
			});
		}
		else if(req.method.toUpperCase() == 'GET'){
			var query = url.parse(req.url, true).query;
			writeOut(query, res);
		}
	}).listen(8002,function(){
		console.log("listen on port 8002");
	});
}

exports.server2 = server2;
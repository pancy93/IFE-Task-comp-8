var http = require("http");
var url = require("url");
var qs = require("querystring");
var spider = require("./spider");


var writeOut = function(result, res){
	res.write(result);
	res.end();
};

function server1(){
	http.createServer(function(req,res){
		res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*"});
		if(req.method.toUpperCase() == 'POST'){
			var postData = "";
			req.addListener("data", function(data){
				postData += data;
			});
			req.addListener("end", function(){
				var query = qs.parse(postData);
				var website = query.website;
				var library = query.library;
				
				//通过爬虫爬取消息
				var result = null;
				var promise = new Promise(
					function(resolve, reject){
						spider.spider(resolve, website, library);
				});
				promise.then(function(result){
					writeOut(result, res);
				});
			});
		}
		else if(req.method.toUpperCase() == 'GET'){
			var query = url.parse(req.url, true).query;
			writeOut(query, res);
		}
	}).listen(8001,function(){
		console.log("listen on port 8001");
	});
}



exports.server1 = server1;
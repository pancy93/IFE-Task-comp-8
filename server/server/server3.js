var http = require("http");
var url = require("url");
var qs = require("querystring");
var fs = require("fs");
var spider = require("./spider3");
var url = "http://www.alexa.cn/siterank/";

var writeOut = function(result, res){
	res.write(result);
	res.end();
};

function server3(){
	http.createServer(function(req,res){
		res.writeHead(200,{"Content-Type":"text/plain","Access-Control-Allow-Origin":"*"});
		if(req.method.toUpperCase() == 'POST'){
			var postData = "";
			req.addListener("data", function(data){
				postData += data;
			});
			req.addListener("end", function(){
				//读取文件中的文字
				var message = getMessage();
				//设置一个间隔半小时更新一次的代码
				setInterval(function(){
					spider.refresh(false);
				},1800000);
				
				writeOut(message, res);
			});
		}
		else if(req.method.toUpperCase() == 'GET'){
			var query = url.parse(req.url, true).query;
			writeOut(query, res);
		}
	}).listen(8003,function(){
		console.log("listen on port 8003");
	});
}
function getMessage(){
	var message = fs.readFileSync("./rank.txt","utf8");
	return message;
};

exports.server3 = server3;
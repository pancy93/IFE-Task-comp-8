var http = require("http");
var fs = require("fs");//�ļ�ϵͳ
var cheerio = require("./cheerio/index.js");//����Dom�ṹ

function spider(solution, website, JSlibrary){
	//�����spider2��������������Ӧ�����ֿ�����
	if(typeof website == "object"){
		var option = {
			hostname : website.website,
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
			hostname : website,
			port: 80,
			method: 'GET',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': 'IE8 on Windows Vista'
			}
		};
	}
	var prom = new Promise(function(resolve, reject){
		http.get(option, function(res){
			var html = "";
			var title = [];
			res.setEncoding("utf-8");//��ֹ��������
		
			//
			res.on("data",function(chunk){
				html += chunk;
			})
			//������ҳ�涼����ȡ���
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
				var reg = new RegExp("/"+Js+"/", "i");
				
				//��ȡ���е�script�е�src����
				if(typeof website == "object"){
					result = new Object();
					result["index"] = website.index;
					result["find"] = "notfind";
					var src = $('script');//.attr("src");
					for(var i=0; i < src.length; i++){
						if(reg.test(src.eq(i).attr("src"))){
							result.find = src.eq(i).attr("src");
						}
					}
				}
				else{
					result = "notfind";
					var src = $('script');//.attr("src");
					for(var i=0; i < src.length; i++){
						if(reg.test(src.eq(i).attr("src"))){
							result = "find";
						}
					}
				}
				resolve(result);
			});
		}).on("error",function(err){
			console.log(err);
		});
	})
	prom.then(function(object){
		solution(object);
	});
}

exports.spider = spider;
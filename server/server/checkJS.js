var http = require("http");
var fs = require("fs");//�ļ�ϵͳ
var cheerio = require("./cheerio/index.js");//����Dom�ṹ
var i=0;

function checkJS(resolve, website, JSlibrary){
	var website = "http://"+website;
	var prom = new Promise(function(resolve, reject){
		http.get(website, function(res){
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
				console.log(Js);
				var reg = new RegExp("/"+Js+"/", "i");
				
				//��ȡ���е�script�е�src����
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
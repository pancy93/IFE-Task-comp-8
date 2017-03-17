var fs = require("fs");
function file(){
	fs.writeFile("./rank.txt", '{"a":1}',"utf8",(err)=>{
			if(err) throw err;
			console.log("saved");
	});
	fs.readFile("./rank.txt","utf8",function(err,data){
		if(err){
			console.log(err);
		}
			
		//加上.trim()去掉文件开头处的空白字符
		var json = JSON.parse(data.trim());
		console.log(json.a++);
		var json = JSON.stringify(json);
		console.log(json);
		fs.writeFile("./rank.txt", json,"utf8",(err)=>{
			if(err) throw err;
			console.log("saved");
		});
	});
};
file();
exports.getMessage = file;
var fs = require("fs");
function file(){
	fs.open("./rank.txt","r",(err,fd)=>{
		if(err){
			if(err.code === "ENOENT"){
				console.error("myfile does not exist");
				return;
			}else{
			throw err;
			}
		}
		fs.readFile("./rank.txt","utf8",function(err,data){
			if(err){
				console.log(err);
			}
			
			//����.trim()ȥ���ļ���ͷ���Ŀհ��ַ�
			var json = JSON.parse(data.trim());
			console.log(json.a++);
			var json = JSON.stringify(json);
			console.log(json);
		})
	});
}
file();
exports.getMessage = file;
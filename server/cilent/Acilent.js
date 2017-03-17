function init(){
	var advance_submit = document.getElementById("advance_submit");
	advance_submit.addEventListener("click",function(){
		submit();
	})
}

function submit(){
	var rank = document.getElementById("rank");
	if(rank.value.length == 0){
		alert("请输入您想要查询排名前多少的网站");
	}
	else if(parseInt(rank.value)>50 || parseInt(rank.value)<0){
		alert("请输入0-50的数字");
	}
	else{
		ajax(rank.value);
	}
	return;
}

function ajax(rank){
	
	var xmlHttp = createXmlHttpRequest();
	var url = "http://127.0.0.1:8002";
	xmlHttp.open("POST",url); 
	xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
	xmlHttp.send("rank="+rank); 
	xmlHttp.onreadystatechange = function(){
		if ((xmlHttp.readyState == 4) && (xmlHttp.status == 200)){
			var res = xmlHttp.response;//此处不是responseText
			console.log(res);
			res = JSON.parse(res);
			insertValue(res);
		}
	}
	
}

function insertValue(res){
	for(var i=0; i<res.length; i++){
		newnode(res[i].rank, res[i].website, res[i].name, res[i].jquery);
	}
	if(res.length>0){
		document.getElementById("table").style.visibility = "visible";
	}
}

function newnode(){
	var result = document.getElementById("results");
	console.log(result);
	var tr = document.createElement("tr");
	for(var i=0; i<arguments.length; i++){
		var th = document.createElement("th");
		th.innerText = arguments[i];
		tr.appendChild(th);
	}
	if(arguments[3] == "notfind"){
		tr.setAttribute("class", "notfind");
	}
	else{
		tr.setAttribute("class", "found");
	}
	result.appendChild(tr);
}

function createXmlHttpRequest(){//创建原生的ajax方法
	var xmlHttp;
	if(window.XMLHttpRequest){//主流浏览器兼容
		xmlHttp=new XMLHttpRequest();
		if(xmlHttp.overrideMimeType){
			xmlHttp.overrideMimeType("text/xml");
		}
    }
	else if(window.ActiveXObject){//IE浏览器的兼容
		try{
			xmlHttp=new ActiveXObject("Msxml2.XMLHTTP");   
        }
		catch(e){
			xmlHttp=new ActiveXObject("Microsoft.XMLHTTP");   
        }
    }
	if(!xmlHttp){
		window.alert("你的浏览器不支持创建XMLhttpRequest对象");
    }
    return xmlHttp;
}

init();
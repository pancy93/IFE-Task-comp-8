function init(){
	var basic_submit = document.getElementById("basic_submit");
	basic_submit.addEventListener("click",function(){
		submit();
	})
}

function submit(){
	var basic_website = document.getElementById("basic_website");
	var basic_JSlibrary = document.getElementById("basic_JSlibrary");
	if(basic_website.value.length == 0){
		alert("请输入您要查询的网站");
	}
	else if(basic_JSlibrary.value.length == 0){
		alert("请输入您要查询的js库");
	}
	else{
		ajax(basic_website.value, basic_JSlibrary.value);
	}
}

function ajax(website, library){
	
	var xmlHttp = createXmlHttpRequest();
	var url = "http://127.0.0.1:8001";
	xmlHttp.open("POST",url); 
	xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
	xmlHttp.send("website="+website+"&library="+library); 
	xmlHttp.onreadystatechange = function(){
		if ((xmlHttp.readyState == 4) && (xmlHttp.status == 200)){
			var res = xmlHttp.response;//此处不是responseText
			var value = document.getElementById("result");
			if(res == "find"){
				value.childNodes[value.childNodes.length-1].innerText = "存在这个JS函数库";
			}
			else if(res == "notfind"){
				value.childNodes[value.childNodes.length-1].innerText = "不存在这个JS函数库";
			}
		}
	}
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
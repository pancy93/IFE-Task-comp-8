var JSlibrary = ["jquery", "react", "vue", "echarts", "angular", "angular2", "DHTMLX", "Rico", "YUI", "Prototype"];
function ajax(){
	
	var xmlHttp = createXmlHttpRequest();
	var url = "http://127.0.0.1:8003";
	xmlHttp.open("POST",url); 
	xmlHttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded"); 
	xmlHttp.send("getRank"); 
	xmlHttp.onreadystatechange = function(){
		if ((xmlHttp.readyState == 4) && (xmlHttp.status == 200)){
			var res = xmlHttp.response;//此处不是responseText
			res = JSON.parse(res);
			var temp = sort(res);
			insertNode(temp);
		}
	}
	
}
function insertNode(temp){
	var results = document.getElementById("results");
	for(var i=0; i<temp.length; i++){
		var tr = document.createElement("tr");
		var rank = document.createElement("th");
		rank.innerText = String(i+1);
		tr.appendChild(rank);
		
		var name = document.createElement("th");
		for(var N in temp[i]){
			name.innerText = N;
		}
		tr.appendChild(name);
		
		var use = document.createElement("th");
		use.innerText = temp[i][name.innerText];
		tr.appendChild(use);
		
		results.appendChild(tr);
	}
}
function createXmlHttpRequest(){//创建原生的ajax方法

	var xmlHttp = null;
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
function sort(object){
	var temp = new Array();
	for(var i=0; i<JSlibrary.length; i++){
		temp[i] = new Object();
		temp[i][JSlibrary[i]] = object[JSlibrary[i]];
	}
	for(var x=0; x<temp.length; x++){
		for(var y=0; y<temp.length-x-1; y++){
			if(temp[y][JSlibrary[y]] < temp[y+1][JSlibrary[y+1]]){
				var clonetemp = clone(temp[y]);
				temp[y] = temp[y+1];
				temp[y+1] = clonetemp;
			}
		}
	}
	return temp;
}
function clone(object){
	if(typeof object != "object") return object;
	else if(object == null) return object;
	var newobject = new Object();
	for(var i in object){
		newobject[i] = object[i];
	}
	return newobject;
}
window.onload = ajax();
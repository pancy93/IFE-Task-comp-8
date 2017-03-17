var server1 = require("./server1");
var server2 = require("./server2");
var server3 = require("./server3");

function initServer(){
	server1.server1();
	server2.server2();
	server3.server3();
}
initServer();
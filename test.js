
var http = require('http');
var server = http.createServer();
function control(petic, resp) {
	resp.writeHead(200, {'content-type': 'text/html'});
	resp.write('<h1>prueba dfghjk</h1><script>xmlHttp = new XMLHttpRequest();xmlHttp.open( "GET", "http://localhost:8888/?operador=cadenas"); xmlHttp.setRequestHeader("Accept", "application/json"); xmlHttp.send("zlkfdjhj");console.log	(xmlHttp.responseText)</script>');
	resp.end();
}
server.on('request', control);
server.listen(8080);
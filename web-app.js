var http = require('http');
var express = require('express');
var socket = require('socket.io');
var request = require("request");


var app = express();
var server = http.createServer(app);
var io = socket.listen(server);


var GetRequest = function(qs,funct){
  var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded',
    'Accept': "application/json"
  }
    var options = {
      url: 'http://localhost:8888',
      method: 'GET',
      headers: headers,
      qs: qs
  }
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
      //console.log("err : "+error+"\nreponse :"+ response+"\n body"+  body) 
          funct(JSON.parse(body));
      }
      else{

        return null;
      }
  });
}

var PutRequest = function(data,funct){
  var headers = {
    'User-Agent':       'Super Agent/0.0.1',
    'Content-Type':     'application/x-www-form-urlencoded',
    'Accept': "application/json"
  }
    var options = {
      url: 'http://localhost:8888',
      method: 'PUT',
      headers: headers,
       multipart: [{
         'content-type':'application/json',
         body: JSON.stringify(data) 
      }]
  }
  request(options, function (error, response, body) {
      if (!error && response.statusCode == 200) {
      //console.log("err : "+error+"\nreponse :"+ response+"\n body"+  body) 
      
          funct(JSON.parse(body));
      }
      else{

        return null;
      }
  });
}

//Routing con Express

app.get('/', function (req, res) {
    console.log('Express: Conexión en "/" sirviendo archivo estático...');
    res.sendfile(__dirname + '/index.html');

});
app.use("/css", express.static(__dirname + '/css'));
app.use("/js", express.static(__dirname + '/js'));
app.use("/font", express.static(__dirname + '/font'));


//Sockets events con socket.io
io.sockets.on('connection', function(socket){
  console.log('SocketIO: Usuario Conectado...');
  var cadenas;
  var menues;
  var carta_menues;
  GetRequest({'operador': 'cadenas'},function(par){
    cadenas=par;
  });
  GetRequest({'operador': 'menus'},function(par){
    menues=par;
  });
  GetRequest({'operador': 'carta_menus'},function(par){
    carta_menues=par;
    socket.emit('conectado',{restaurantes:cadenas,menus:menues,carta_menus:carta_menues});
    console.log("enviando datos");
  });

  //socket.emit('notification', { mensaje: time + ': Nueva notificación enviada desde el servidor.'});
  //
  socket.on('stopNotifications', function () {
      console.log('SocketIO: Notificaciones detenidas por el usuario...');
      //clearInterval(sendNotificationInterval);
  });
  socket.on('agregarInformacion', function (data) {
      console.log(data.nombre+" "+data.apellido);
  });
  socket.on('agregarMenu', function (data) {
      console.log(data);
      //deberia hacer un put

      //un update
  });
  socket.on('disconnect', function () {
      console.log('SocketIO: Usuario Desconetado...');
      //clearInterval(sendNotificationInterval);
  });
});

server.listen(3000);
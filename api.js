var http= require('http'),
    url = require('url'),
    qs  = require('querystring');

var cadenas = require('./cadena.js');
var menus = require('./cadena.js');
var carta_menus = require('./cadena.js');
var server = http.createServer();
//http.createServer(procesa).listen(8888);
server.on('request', procesa);
server.listen(8888);

console.log("Servidor arrancado en puerto 8888");
function procesa(req,resp) {
	
	var urlparsed = url.parse(req.url,true);
	var id = urlparsed.query['id'];
	console.log(urlparsed);
	var operador = urlparsed.query['operador'];
	switch (req.method) {
		case 'GET': 
			if(operador=="cadenas")
			{
				if (id) listarRestaurant(id,req,resp);
				else showCadenas(req,resp);
				break;			
			}
			else if(operador=="menus")
			{
				if (id) listarMenu(id,req,resp);
				else showMenus(req,resp);
				break;						
			}
			else if(operador=="carta_menus")
			{
				if (id) listarCarta_Menu(id,req,resp);
				else showCarta_Menu(req,resp);
				break;						
			}				
		case 'DELETE':
			if(operador=="cadenas")
			{
				if (id) borrarRestaurant(id,req,resp);
				else notAllowed("Intento de borrar todos los restaurantes",resp);
				break;			
			}
			else if(operador=="menus")
			{
				if (id) borrarMenu(id,req,resp);
				else notAllowed("Intento de borrar todos los menus",resp);
				break;							
			}
			else if(operador=="carta_menus")
			{
				if (id) borrarCarta_Menu(id,req,resp);
				else notAllowed("Intento de borrar todos los Carta_Menu",resp);
				break;			
			}				
		case 'POST':
			if(operador=="cadenas")
			{
				if (id) notAllowed("No se puede hacer POST sobre un Restaurant concreto",resp);
				else parseBody(req,resp,crearRestaurant); 
				break;
			}
			else if(operador=="menus")
			{
				if (id) notAllowed("No se puede hacer POST sobre un Menu concreto",resp);
				else parseBody(req,resp,crearMenu); 
				break;
			}
			else if(operador=="carta_menus")
			{
				if (id) notAllowed("No se puede hacer POST sobre un carta_menu concreto",resp);
				else parseBody(req,resp,crearCarta_Menu); 
				break;
			}						

		case 'PUT':
			if(operador=="cadenas")
			{
				if (id) {
				 parseBody(req,resp,function (post) {
					modificarRestaurant(post,id,req,resp);
				 });
				} else 
					notAllowed("Intento de modificar todos los restaurantes",resp);
				break;
			}
			else if(operador=="menus")
			{
				if (id) {
				 parseBody(req,resp,function (post) {
					modificarMenu(post,id,req,resp);
				 });
				} else 
					notAllowed("Intento de modificar todos los Menus",resp);
				break;

			}
			else if(operador=="carta_menus")
			{
				if (id) {
				 parseBody(req,resp,function (post) {
					modificarCarta_Menu(post,id,req,resp);
				 });
				} else 
					notAllowed("Intento de modificar todos los carta_menus",resp);
				break;
			}
		/*default:
			resp.writeHead(200, {'content-type': 'text/html'});

			resp.write('<style>*{background:#08F;color:#FFF;font-family:verdana;margin:2em}</style><h1>:(</h1><h2>403 forbidden</h2>');
			resp.end();*/			
		};
}

function isEmpty(query) {
	return Object.keys(query) == 0 ;
}

function listarRestaurant(id,req,resp) {
	cadenas.getRestaurant(id,function (err,restaurant) {
		if (err) 
			notAllowed("No se encuentra restaurant " + id, resp);
		else 
		{
			var accept = req.headers["accept"];
			console.log("Accept = " + accept[0]);
			console.log(accept.indexOf("application/xml") > -1);
			if(accept.indexOf("application/json") > -1)
			{
				resp.setHeader('content-type','application/json');
				resp.write(JSON.stringify(restaurant));
				resp.end();			
			}
			else if(accept.indexOf("application/xml") > -1)

			{
				console.log("devolviendo XML")
				resp.setHeader('content-type','application/xml');
				resp.end('<cadenas><restaurant codigo=\"' + id + '\"><nombre_restaurant>' + restaurant.nombre_restaurant + '</nombre_restaurant><telefono>' + restaurant.telefono + '</telefono><direccion>'+restaurant.direccion+'</direccion></restaurant></cadenas>');				
				resp.end();			
			}
			else 
			{
				resp.setHeader('content-type','text/html');
				resp.end('<ul><li>' + id + ": " + restaurant.nombre_restaurant + ' | ' + restaurant.telefono + ' | '+restaurant.direccion +'</li></ul>');				
				resp.end();			
			}
		}
	});
}

function showCadenas(req,resp) {
	var accept = req.headers["accept"];
	console.log("Accept = " + accept);
        if(accept.indexOf("application/json") > -1)
        {

            resp.setHeader('content-type','application/json');
            resp.write(cadenas.CadenastoJson());
            resp.end();            
            
        }
        else if(accept.indexOf("application/xml") > -1)
        {
            resp.setHeader('content-type','application/xml');
            resp.end(cadenas.CadenastoXML());                                    
        }
        else
        {
            resp.setHeader('content-type','text/html');
            resp.end(cadenas.CadenastoHTML());            
        }        
}

function borrarRestaurant(id,req,resp) {
	console.log("Borrando restaurant " + id);
	cadenas.borraRestaurant(id, function(err,restaurant) {
	 if (err) notAllowed("No se puede borrar " + id, resp);
	 else showCadenas(req,resp);
	});
}

function crearRestaurant(post,req,resp) {
    var codigo = post.codigo ;
	if (!codigo) notAllowed("No se puede crear un restaurant sin codigo", resp);
	else {
	var restaurant = { "nombre_restaurant" : post.nombre_restaurant, "telefono": post.telefono ,"direccion": post.direccion} ;
	console.log("Creando restaurant " + codigo + ": " + restaurant.nombre_restaurant + ", " + restaurant.telefono + ", "+ restaurant.direccion);
    cadenas.insertaRestaurant(codigo, restaurant, function(err,restaurant) {
    	if (err) notAllowed("No se puede crear restaurant: " + err, resp);
    	else showCadenas(req,resp);
    });
	}
}

function modificarRestaurant(post,id,req,resp) {
	var restaurant = { "nombre_restaurant" : post.nombre_restaurant, "telefono": post.telefono,"direccion": post.direccion } ;
	cadenas.modificaRestaurant(id,restaurant,function(err,restaurant) {
		if (err) notAllowed("No se puede modificar restaurant " + id,resp);
		else showCadenas(req,resp);
	});
}
//Menus
function listarMenu(id,req,resp) {
	menus.getMenu(id,function (err,menu) 
        {
            if (err) 
                notAllowed("No se encuentra menu " + id, resp);
            else 
            {
                var accept = req.headers["accept"];
                console.log("Accept = " + accept);
                if(accept.indexOf("application/json") > -1)
                {
                    resp.setHeader('content-type','application/json');
                    resp.write(JSON.stringify(menu));
                    resp.end();                                        
                }
                else if(accept.indexOf("application/xml") > -1)
                {
                    resp.setHeader('content-type','application/xml');
                    resp.end('<menu codigo=\"' + id + '\"><nombre>' + menu.nombre + '</nombre><plato_pp>' + menu.plato_pp + '</plato_pp><horario_inicio>'+menu.horario_inicio+'</horario_inicio><horario_fin>'+menu.horario_fin+'</horario_fin><postre>'+menu.postre+'</postre><precio>'+menu.precio+'</precio><guarnicion>'+menu.guarnicion+'</guarnicion></menu>');				
                    resp.end();			
                }                
                else
                {
                    resp.setHeader('content-type','text/html');
                    resp.end('<ul><li>' + id + ": " + menu.nombre + ' | ' + menu.plato_pp + ' | '+menu.horario_inicio +' | '+menu.horario_fin+' | ' +menu.postre+' | '+menu.guarnicion+' | '+menu.precio+'</li></ul>');				
                    resp.end();	                    
                }

            }
	});
}

function showMenus(req,resp) {
	var accept = req.headers["accept"];
	console.log("Accept = " + accept);
        if(accept.indexOf("application/json") > -1)
        {
            resp.setHeader('content-type','application/json');            
            resp.end(menus.MenustoJson());                              
        }
        else if(accept.indexOf("application/xml") > -1)
        {
            resp.setHeader('content-type','application/xml');
            resp.end(menus.MenustoXML());  
        }
        else
        {
            resp.setHeader('content-type','text/html');
            resp.end(menus.MenustoHTML());            
        }
}

function borrarMenu(id,req,resp) {
	console.log("Borrando menu " + id);
	menus.borraMenu(id, function(err,menu) {
	 if (err) notAllowed("No se puede borrar " + id, resp);
	 else showMenus(req,resp);
	});
}

function crearMenu(post,req,resp) {
    var codigo = post.codigo ;
	if (!codigo) notAllowed("No se puede crear un menu sin codigo", resp);
	else {
	var menu = { "nombre": post.nombre, "plato_pp": post.plato_pp,"guarnicion":post.guarnicion,"postre":post.postre,"precio":post.precio,"horario_inicio":post.horario_inicio, "horario_fin":post.horario_fin } ;
	console.log("Creando menu " + codigo + ": " + menu.nombre + ", " + menu.plato_pp + ", "+ menu.guarnicion+ ", "+menu.postre+ ", "+menu.precio+ ", "+menu.horario_inicio+ ", "+menu.horario_fin);
    menus.insertaMenu(codigo, menu, function(err,menu) {
    	if (err) notAllowed("No se puede crear menu: " + err, resp);
    	else showMenus(req,resp);
    });
	}
}

function modificarMenu(post,id,req,resp) {
	var menu = { "nombre": post.nombre, "plato_pp": post.plato_pp,"guarnicion":post.guarnicion,"postre":post.postre,"precio":post.precio,"horario_inicio":post.horario_inicio, "horario_fin":post.horario_fin } ;
	menus.modificaMenu(id,menu,function(err,menu) {
		if (err) notAllowed("No se puede modificar menu " + id,resp);
		else showMenus(req,resp);
	});
}
//Carta_Menu
//Menus
function listarCarta_Menu(id,req,resp) {
	menus.getCarta_Menu(id,function (err,carta_menu) 
        {
            if (err) 
                notAllowed("No se encuentra carta menu " + id, resp);
            else 
            {
                var accept = req.headers["accept"];
                console.log("Accept = " + accept);
                if(accept.indexOf("application/json") > -1)
                {
                    resp.setHeader('content-type','application/json')
                    resp.write(JSON.stringify(carta_menu));
                    resp.end();                    
                }
                else if(accept.indexOf("application/xml") > -1)
                {
                    resp.setHeader('content-type','application/xml');
                    resp.write('<menu codigo=\"' + id + '\"><nombre_restaurant>' + carta_menu.nombre_restaurant + '</nombre_restaurant><nombre_Menu>' + carta_menu.nombre_Menu + '</nombre_Menu></menu>');
                    resp.end();
                }
                else
                {
                    resp.setHeader('content-type','text/html');
                    resp.write('<ul><li>' + codigo + ": " + carta_menu.nombre_restaurant + ' | ' + carta_menu.nombre_Menu + '</li></ul>');
                    resp.end();                    
                }                
            }
	});
}

function showCarta_Menu(req,resp) {
	var accept = req.headers["accept"];
	console.log("Accept = " + accept);
        if(accept.indexOf("application/json") > -1)
        {
            resp.setHeader('content-type','application/json')            
            resp.end(carta_menus.Carta_MenutoJson());
        }
        else if(accept.indexOf("application/xml") > -1)
        {
            resp.setHeader('content-type','application/xml');
            resp.end(carta_menus.Carta_MenutoXML());                        
        }
        else
        {
            resp.setHeader('content-type','text/html');
            resp.end(carta_menus.Carta_MenutoHTML());            
        }
}

function borrarCarta_Menu(id,req,resp) {
	console.log("Borrando carta_menu " + id);
	carta_menus.borraCarta_Menu(id, function(err,carta_menu) {
	 if (err) notAllowed("No se puede borrar carta_menu " + id, resp);
	 else showCarta_Menu(req,resp);
	});
}

function crearCarta_Menu(post,req,resp) {
    var codigo = post.codigo ;
	if (!codigo) notAllowed("No se puede crear una carta_menu sin codigo", resp);
	else {
	var carta_menu = { "nombre_restaurant": post.nombre_restaurant, "nombre_Menu": post.nombre_Menu};
	console.log("nombre_restaurant: "+post.nombre_restaurant+"nombre_Menu :"+ post.nombre_Menu);
    carta_menus.insertaCarta_Menu(codigo, carta_menu, function(err,carta_menu) {
    	if (err) notAllowed("No se puede crear carta_menu: " + err, resp);
    	else showCarta_Menu(req,resp);
    });
	}
}

function modificarCarta_Menu(post,id,req,resp) {
	var carta_menu = { "nombre_restaurant": post.nombre_restaurant, "nombre_Menu": post.nombre_Menu};
	carta_menus.modificaCarta_Menu(id,carta_menu,function(err,carta_menu) {
		if (err) notAllowed("No se puede modificar carta_menu " + id,resp);
		else showCarta_Menu(req,resp);
	});
}


function notAllowed(msg, resp) {
	resp.statusCode = 405;
	resp.write(msg);
	resp.end();
}

function parseBody(req, resp, next) {
	var body = '';
    req.on('data', function (data) {
        body += data;
        if (body.length > 1e6) {
        	console.log("Body too big!");
            req.connection.destroy();
        }
    });
    req.on('end', function () {
        var post = qs.parse(body);
		console.log("Body: " + body);
		console.log(post);
        next(post,req,resp);
    });
}

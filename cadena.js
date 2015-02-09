/*

 */

// Internamente se representan como una sola lista
var cadenas = []; 
var menus = []; 
var carta_menus = []; 

// Se inicializan un par de productos
cadenas[0] = { "nombre_restaurant": "Apoquindo", "telefono": 22162596, "direccion":"Apoquindo 2222", "comuna":"Las Condes", "ciudad":"Santiago", "pais":"Chile" };
cadenas[1] = { "nombre_restaurant": "Alameda", "telefono": 29366186, "direccion":"Alameda 803", "comuna":"Santiago", "ciudad":"Santiago", "pais":"Chile" };
cadenas[2] = { "nombre_restaurant": "Gran Avenida", "telefono": 24375432, "direccion":"Gran avenida 1765", "comuna":"San Miguel", "ciudad":"Santiago", "pais":"Chile" };
cadenas[3] = { "nombre_restaurant": "Vicuña Mackenna", "telefono": 25649870, "direccion":"Vicuña Mackenna 1100", "comuna":"La Florida", "ciudad":"Santiago", "pais":"Chile" };
menus[0] = { "nombre": "Italiano", "plato": "Tormenta de Mariscos","guarnicion":"Pesto","postre":"Cannoli","precio":"4500","horario_inicio":"12:00:00", "horario_fin":"16:00:00" };
menus[1] = { "nombre": "Campestre", "plato": "Pastel de Choclo","guarnicion":"Tomate","postre":"Helado","precio":"5000","horario_inicio":"12:00:00", "horario_fin":"16:00:00" };
menus[2] = { "nombre": "Nocturno", "plato": "Alitas Marinadas","guarnicion":"Papas Fritas","postre":"Fruta","precio":"3500","horario_inicio":"16:00:00", "horario_fin":"22:00:00" };
menus[3] = { "nombre": "Desayuno", "plato": "Paila de Huevos","guarnicion":"Tomate","postre":"Fruta","precio":"3000","horario_inicio":"10:00:00", "horario_fin":"12:00:00" };
menus[4] = { "nombre": "Delicias", "plato": "Frutos Silvestres","guarnicion":"Palta","postre":"Batido","precio":"6000","horario_inicio":"12:00:00", "horario_fin":"16:00:00" };

carta_menus[0]= {"nombre_restaurant":"Apoquindo", "nombre_Menu":"Desayuno"};
carta_menus[1]= {"nombre_restaurant":"Alameda", "nombre_Menu":"Desayuno"};
carta_menus[2]= {"nombre_restaurant":"Gran Avenida", "nombre_Menu":"Desayuno"};
carta_menus[3]= {"nombre_restaurant":"Vicuña Mackenna", "nombre_Menu":"Desayuno"};

carta_menus[4]= {"nombre_restaurant":"Apoquindo", "nombre_Menu":"Nocturno"};
carta_menus[5]= {"nombre_restaurant":"Alameda", "nombre_Menu":"Nocturno"};
carta_menus[6]= {"nombre_restaurant":"Gran Avenida", "nombre_Menu":"Nocturno"};
carta_menus[7]= {"nombre_restaurant":"Vicuña Mackenna", "nombre_Menu":"Nocturno"};

carta_menus[8]= {"nombre_restaurant":"Apoquindo", "nombre_Menu":"Italiano"};
carta_menus[9]= {"nombre_restaurant":"Alameda", "nombre_Menu":"Delicias"};
carta_menus[10]= {"nombre_restaurant":"Alameda", "nombre_Menu":"Italiano"};
carta_menus[11]= {"nombre_restaurant":"Gran Avenida", "nombre_Menu":"Campestre"};
carta_menus[12]= {"nombre_restaurant":"Gran Avenida", "nombre_Menu":"Delicias"};
carta_menus[13]= {"nombre_restaurant":"Vicuña Mackenna", "nombre_Menu":"Campestre"};
carta_menus[14]= {"nombre_restaurant":"Vicuña Mackenna", "nombre_Menu":"Delicias"};
// Funciones que se exportan

exports.getRestaurant = function(codigo,next) {
  var restaurant = cadenas[codigo];
  if (cadenas == undefined) 
	  next("No se puede encontrar restaurant con codigo = " + codigo);
  else 
	  next(null,restaurant);
};

exports.insertaRestaurant = function (codigo, restaurant, next) {
 if (cadenas[codigo]) 
   next("Ya existe restaurant con codigo " + codigo,cadenas);
 else {
   cadenas[codigo] = restaurant;
   next(null,cadenas);
 }
};

exports.borraRestaurant = function (codigo,next) {
 if (cadenas[codigo]) { 
	delete cadenas[codigo]; 
	next(null,cadenas);
 } else 
	next(new Error("No existe restaurant con codigo " + codigo));
};

exports.modificaRestaurant = function(codigo,restaurant,next) {
 if (cadenas[codigo]) {
	cadenas[codigo] = restaurant;
	next(null,cadenas);
 }
 else
	next(new Error("No se puede modificar restaurant que no existe. codigo = " + codigo)) ; 
};

exports.CadenastoHTML = function() {
 return '<ul>' + Object.keys(cadenas).map(function(codigo){
    var restaurant = cadenas[codigo];  
    return '<li>' + codigo + ": " + restaurant.nombre_restaurant + ' | ' + restaurant.telefono + ' | '+restaurant.direccion +'</li>';
 }).join('') + '</ul>' ;
}; 

exports.CadenastoJson = function() {
	return JSON.stringify(cadenas);
};

exports.CadenastoXML = function() {
  return '<cadenas>' + Object.keys(cadenas).map(function(codigo){
       var restaurant = cadenas[codigo];
	   return '<restaurant codigo=\"' + codigo + '\"><nombre_restaurant>' + restaurant.nombre_restaurant + '</nombre_restaurant><telefono>' + restaurant.telefono + '</telefono><direccion>'+restaurant.direccion+'</direccion></restaurant>';
   }).join('') + '</cadenas>';	
};

//Menus
exports.getMenu = function(codigo,next) {
  var menu = menus[codigo];
  if (menus == undefined) 
	  next("No se puede encontrar menu con codigo = " + codigo);
  else 
	  next(null,menu);
};

exports.insertaMenu = function (codigo, menu, next) {
 if (menus[codigo]) 
   next("Ya existe menu con codigo " + codigo,menus);
 else {
   menus[codigo] = menu;
   next(null,menus);
 }
};

exports.borraMenu = function (codigo,next) {
 if (menus[codigo]) { 
	delete menus[codigo]; 
	next(null,menus);
 } else 
	next(new Error("No existe menu con codigo " + codigo));
};

exports.modificaMenu = function(codigo,menu,next) {
 if (menus[codigo]) {
	menus[codigo] = menu;
	next(null,menu);
 }
 else
	next(new Error("No se puede modificar menu que no existe. codigo = " + codigo)) ; 
};

exports.MenustoHTML = function() {
 return '<ul>' + Object.keys(menus).map(function(codigo){
    var menu = menus[codigo];  
    return '<li>' + codigo + ": " + menu.nombre + ' | ' + menu.plato_pp + ' | '+menu.horario_inicio +' | '+menu.horario_fin+' | ' +menu.postre+' | '+menu.guarnicion+' | '+menu.precio+'</li>';
 }).join('') + '</ul>' ;
}; 

exports.MenustoJson = function() {
	return JSON.stringify(menus);
};

exports.MenustoXML = function() {
  return '<carta_menus>' + Object.keys(menus).map(function(codigo){
       var menu = menus[codigo];
	   return '<menu codigo=\"' + codigo + '\"><nombre>' + menu.nombre + '</nombre><plato_pp>' + menu.plato_pp + '</plato_pp><horario_inicio>'+menu.horario_inicio+'</horario_inicio><horario_fin>'+menu.horario_fin+'</horario_fin><postre>'+menu.postre+'</postre><precio>'+menu.precio+'</precio><guarnicion>'+menu.guarnicion+'</guarnicion></menu>';
   }).join('') + '</carta_menus>';	
};

//Carta_Menu
exports.getCarta_Menu = function(codigo,next) {
  var carta_menu = carta_menus[codigo];
  if (carta_menus == undefined) 
	  next("No se puede encontrar Carta con codigo = " + codigo);
  else 
	  next(null,carta_menu);
};

exports.insertaCarta_Menu = function (codigo, carta_menu, next) {
 if (carta_menus[codigo]) 
   next("Ya existe carta con codigo " + codigo,carta_menus);
 else {
   carta_menus[codigo] = carta_menu;
   next(null,carta_menus);
 }
};

exports.borraCarta_Menu = function (codigo,next) {
 if (carta_menus[codigo]) { 
	delete carta_menus[codigo]; 
	next(null,carta_menus);
 } else 
	next(new Error("No existe carta_asociada con codigo " + codigo));
};

exports.modificaCarta_Menu = function(codigo,carta_menu,next) {
 if (carta_menus[codigo]) {
	carta_menus[codigo] = carta_menu;
	next(null,carta_menus);
 }
 else
	next(new Error("No se puede modificar carta menu que no existe. codigo = " + codigo)) ; 
};

exports.Carta_MenutoHTML = function() {
 return '<ul>' + Object.keys(carta_menus).map(function(codigo){
    var carta_menu = carta_menus[codigo];  
    return '<li>' + codigo + ": " + carta_menu.nombre_restaurant + ' | ' + carta_menu.nombre_Menu + '</li>';
 }).join('') + '</ul>' ;
}; 

exports.Carta_MenutoJson = function() {
	return JSON.stringify(carta_menus);
};

exports.Carta_MenutoXML = function() {
  return '<carta_menus>' + Object.keys(carta_menus).map(function(codigo){
       var carta_menu = carta_menus[codigo];
	   return '<menu codigo=\"' + codigo + '\"><nombre_restaurant>' + carta_menu.nombre_restaurant + '</nombre_restaurant><nombre_Menu>' + carta_menu.nombre_Menu + '</nombre_Menu></menu>';
   }).join('') + '</carta_menus>';	
};
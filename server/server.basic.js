
import * as http from "node:http";
import * as url from "node:url";

const circuitJSON = `[
    {
        "id": "circuit_1",
        "name": "Big Karting Indoor",
        "distance": "5",
        "location": {
                        "latitude": "42.912124", 
                        "longitude": "-2.712425"
                     },
        "url": "https://bigkartingvitoria.com/",
        "description": "El Circuito de Kotarr también conocido como Circuito de Velocidad Kotarr es un circuito de velocidad tipo corto que se encuentra en Tubilla del Lago. Es el primer circuito de velocidad de toda Castilla y León y fue inaugurado en agosto de 2008.",
        "bestlap": "1:00:00",
        "prices": {
            "tandas": "20€",
            "miniGP": "30€",
            "GP": "50€",
            "SuperGP": "70€"
            
        },
        "map": "imgs/kotar.JPG"

    },
    {
        "id": "circuit_2",
        "name": "Logroño Karting Indoor",
        "distance": "55",
        "location": {
            "latitude": "42.485641", 
            "longitude": "-2.487524"
         } ,
        "url": "https://bigkartingvitoria.com/",
        "description": "El Circuito de Kotarr también conocido como Circuito de Velocidad Kotarr es un circuito de velocidad tipo corto que se encuentra en Tubilla del Lago. Es el primer circuito de velocidad de toda Castilla y León y fue inaugurado en agosto de 2008.",
        "bestlap": "1:00:00",
        "prices": {
            "tandas": "20€",
            "miniGP": "30€",
            "GP": "50€",
            "SuperGP": "70€"
            
        },
        "map": "imgs/kotar.JPG"
    },
    {
        "id": "circuit_3",
        "name": "Circuito Kotarr Burgos",
        "distance": "95",
        "location":{
            "latitude": "41.791225", 
            "longitude": "-3.583966"
         },
        "url": "https://bigkartingvitoria.com/",
        "description": "El Circuito de Kotarr también conocido como Circuito de Velocidad Kotarr es un circuito de velocidad tipo corto que se encuentra en Tubilla del Lago. Es el primer circuito de velocidad de toda Castilla y León y fue inaugurado en agosto de 2008.",
        "bestlap": "1:00:00",
        "prices": {
            "tandas": "20€",
            "miniGP": "30€",
            "GP": "50€",
            "SuperGP": "70€"
            
        },
        "map": "imgs/kotar.JPG"
    },
    {
        "id": "circuit_4",
        "name": "Karting Castroponce",
        "distance": "155",
        "location": {
            "latitude": "42.153641", 
            "longitude": "-5.763708"
         },
        "url": "https://bigkartingvitoria.com/",
        "description": "El Circuito de Kotarr también conocido como Circuito de Velocidad Kotarr es un circuito de velocidad tipo corto que se encuentra en Tubilla del Lago. Es el primer circuito de velocidad de toda Castilla y León y fue inaugurado en agosto de 2008.",
        "bestlap": "1:00:00",
        "prices": {
            "tandas": "20€",
            "miniGP": "30€",
            "GP": "50€",
            "SuperGP": "70€"
            
        },
        "map": "imgs/kotar.JPG"
    },
    {
        "id": "circuit_5",
        "name": "Circuito y Museo Fernando Alonso",
        "distance": "155",
        "location": {
            "latitude": "43.429136",
            "longitude": "-5.831937"
         },
        "url": "https://bigkartingvitoria.com/",
        "description": "El Circuito de Kotarr también conocido como Circuito de Velocidad Kotarr es un circuito de velocidad tipo corto que se encuentra en Tubilla del Lago. Es el primer circuito de velocidad de toda Castilla y León y fue inaugurado en agosto de 2008.",
        "bestlap": "1:00:00",
        "prices": {
            "tandas": "20€",
            "miniGP": "30€",
            "GP": "50€",
            "SuperGP": "70€"
            
        },
        "map": "imgs/kotar.JPG"
    },
    {
        "id": "circuit_6",
        "name": "Karting Valladolid",
        "distance": "255",
        "location": {
            "latitude": "41.600783", 
            "longitude": "-4.693809"
         },
        "url": "https://bigkartingvitoria.com/",
        "description": "El Circuito de Kotarr también conocido como Circuito de Velocidad Kotarr es un circuito de velocidad tipo corto que se encuentra en Tubilla del Lago. Es el primer circuito de velocidad de toda Castilla y León y fue inaugurado en agosto de 2008.",
        "bestlap": "1:00:00",
        "prices": {
            "tandas": "20€",
            "miniGP": "30€",
            "GP": "50€",
            "SuperGP": "70€"
            
        },
        "map": "imgs/kotar.JPG"
    }
]`;

http.createServer(function server_onRequest (request, response) {
    let pathname = url.parse(request.url).pathname;

    console.log(`Request for ${pathname} received.`);

    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    response.setHeader("Access-Control-Allow-Headers", "*");
    response.setHeader('Access-Control-Max-Age', 2592000); // 30 days
    response.writeHead(200);


    response.write(circuitJSON);
    response.end();
}).listen(process.env.PORT, process.env.IP);

console.log('Server running at http://' + process.env.IP + ':' + process.env.PORT + '/');
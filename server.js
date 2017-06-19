var http = require('http');
var gpio = require("gpio");

var server = http.createServer();

let waterTemp = -95;

server.on('request', function(req,res) {
    let msg = "";

    if(req.method === "PUT"){
        if(req.url.indexOf("/temp/water/") !== -1){
            waterTemp = parseInt(req.url.substr(12, req.url.length));
            //console.log(waterTemp);

        }
    }

    else if(req.method === "GET"){
        if(req.url.indexOf("/temp/water") !== -1){
            msg = waterTemp.toString();
        }      
    }

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8',
                         'Access-Control-Allow-Origin': 'null',
                         'Access-Control-Allow-Methods' : 'PUT'});
    res.end(msg);
});

server.listen(3000);

let gpio12 = gpio.export(12, {
    direction: 'out'
});

console.log('Servidor iniciado em localhost:3000. Ctrl+C para encerrar…');

setInterval(function(){
    console.log(waterTemp);
    if(waterTemp === 15){
        gpio12.set();
    }
    else{
        gpio12.reset();
    }
}, 1000);

let http = require('http');
let gpio = require('rpi-gpio');
 
function write() {
	gpio.write(12, false, function(err) {
		if (err) throw err;
		console.log('Written to pin');
	});
}

let server = http.createServer();

let waterTemp = 0;
let homeTemp = 0;

server.on('request', function(req,res) {
    let msg = "";

    if(req.method === "PUT"){
        if(req.url.indexOf("/temp/water/") !== -1){
            waterTemp = parseInt(req.url.substr(12, req.url.length));
            //console.log(waterTemp);
        }
        if(req.url.indexOf("/temp/home/") !== -1){
            homeTemp = parseInt(req.url.substr(12, req.url.length));
            //console.log(homeTemp);
        }
    }

    else if(req.method === "GET"){
        if(req.url.indexOf("/temp/water") !== -1){
            msg = waterTemp.toString();
        }
        if(req.url.indexOf("/temp/home") !== -1){
            msg = homeTemp.toString();
        }      
    }

    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8',
                         'Access-Control-Allow-Origin': '*',
                         'Access-Control-Allow-Methods' : 'PUT'});
    res.end(msg);
});

server.listen(3000);

console.log('Servidor iniciado em localhost:3000. Ctrl+C para encerrar…');

function write_to_pin(pin, val) {
	gpio.write(pin, val, function(err) {
		if (err) throw err;
	});
}

let pin_ready = false;
gpio.setup(12, gpio.DIR_OUT, function () {
	write_to_pin(12, false);
	pin_ready = true;
});

setInterval(function(){
	console.log(waterTemp);
	if (pin_ready === true) {
		if(waterTemp === 15) {
			write_to_pin(12, 1);
		}
		else {
			write_to_pin(12, 0);
		}
	}
}, 200);

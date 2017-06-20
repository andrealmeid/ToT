let http = require('http');
let gpio = require('rpi-gpio');
 
function write() {
	gpio.write(12, false, function(err) {
		if (err) throw err;
		console.log('Written to pin');
	});
}

let server = http.createServer();

let waterTemp = 15;
let homeTemp = 15;

let windowFlag = false;
let boilerFlag = false;
let coolerFlag = false;

server.on('request', function(req,res) {
    let msg = "";

    if(req.method === "PUT"){
        if(req.url.indexOf("/temp/water/") !== -1){
            waterTemp = parseInt(req.url.substr(12, req.url.length));
            console.log("Water: " + waterTemp.toString());
        }
        if(req.url.indexOf("/temp/home/") !== -1){
            homeTemp = parseInt(req.url.substr(11, req.url.length));
            console.log("Home: " + homeTemp.toString());
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

function getCurWater(){
    return 20;
}

function getCurHome(){
    return 25;
}

setInterval(function(){
	if (pin_ready === true) {
		if(getCurHome() < homeTemp && Math.abs(homeTemp - getCurHome()) >= 1.5){
			write_to_pin(12, 1);
            coolerFlag = true;
        }
		else{
			write_to_pin(12, 0);
            coolerFlag = false;
        }

		/*if(getCurWater() > waterTemp && Math.abs(waterTemp - getCurWater()) >= 1.5){
			write_to_pin(12, 1);
            boilerFlag = true;
        }
		else{
			write_to_pin(12, 0);
            boilerFlag = false;
        }*/
    }
}, 200);

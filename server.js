let http = require('http');
let gpio = require('rpi-gpio');
let serialport = require('serialport');
let serial = new serialport('/dev/ttyACM0', {parser: serialport.parsers.readline('!')});

function write() {
    gpio.write(12, false, function(err) {
        if (err) throw err;
        console.log('Written to pin');
    });
}

let server = http.createServer();

let targetWaterTemp = 15;
let targetHomeTemp = 15;

let currentWaterTemp = 60;
let currentHomeTemp = 0;

let windowFlag = false;
let boilerFlag = false;
let coolerFlag = false;

serial.on('data', function (data) {
	currentHomeTemp = parseFloat('' + data);
});

server.on('request', function(req,res) {
    let msg = "";

    if(req.method === "PUT"){
        if(req.url.indexOf("/temp/water/") !== -1){
            targetWaterTemp = parseInt(req.url.substr(12, req.url.length));
            console.log("Water: " + targetWaterTemp.toString());
        }
        if(req.url.indexOf("/temp/home/") !== -1){
            targetHomeTemp = parseInt(req.url.substr(11, req.url.length));
            console.log("Home: " + targetHomeTemp.toString());
        }
    }

    else if(req.method === "GET"){
        if(req.url.indexOf("/temp/water") !== -1){
            msg = targetWaterTemp.toString();
        }
        if(req.url.indexOf("/temp/home") !== -1){
            msg = targetHomeTemp.toString();
        }
        if(req.url.indexOf('/flag/boiler') !== -1){
            msg = boilerFlag.toString();
        }
        if(req.url.indexOf('/flag/cooler') !== -1){
            msg = coolerFlag.toString();
        }
        if(req.url.indexOf('/flag/window') !== -1){
            msg = windowFlag.toString();
        }
        if(req.url.indexOf('/temp/curwater') !== -1){
            msg = currentWaterTemp.toString();
        }
        if(req.url.indexOf('/temp/curhome') !== -1){
            msg = currentHomeTemp.toString();
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
    if (pin_ready === true) {
        if(currentHomeTemp > targetHomeTemp && Math.abs(targetHomeTemp - currentHomeTemp) >= 2){
            write_to_pin(12, 1);
            coolerFlag = true;
        }
        else if(Math.abs(targetHomeTemp - currentHomeTemp) <= 1){
            write_to_pin(12, 0);
            coolerFlag = false;
        }

        if(currentWaterTemp < targetWaterTemp && Math.abs(targetWaterTemp - currentWaterTemp) >= 2){
            //write_to_pin(12, 1);
            boilerFlag = true;
        }
        else if(Math.abs(targetWaterTemp - currentWaterTemp) <= 1){
            //write_to_pin(12, 0);
            boilerFlag = false;
        }
    }
}, 200);

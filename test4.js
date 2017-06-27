let serial = require('serialport');

let s = new serial('/dev/ttyACM0', {parser: serial.parsers.readline('!')});

s.on('data', function (data) {
	console.log('' + data);
});

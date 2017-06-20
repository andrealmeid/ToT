var gpio = require('rpi-gpio');
 
function write() {
	gpio.write(12, false, function(err) {
		if (err) throw err;
		console.log('Written to pin');
	});
}
gpio.setup(12, gpio.DIR_OUT, write);

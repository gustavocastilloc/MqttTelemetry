const mqtt = require('mqtt')
var ip_broker = '192.168.1.21'
const pub = mqtt.connect('mqtt://'+ip_broker+':9000');

pub.on('connect',function(){
	const interval = setInterval(()=>{
		pub.publish('server1state', 'Power On');
	});

});

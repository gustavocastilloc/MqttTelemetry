var ThingSpeakClient = require('thingspeakclient');
var client = new ThingSpeakClient();

var client = new ThingSpeakClient({server:'https://api.thingspeak.com'});
client.attachChannel(1784256, { writeKey:'E7MU9WI3NW0D7N5E'});
const mqtt = require('mqtt');
var broker_ip = 'localhost';
const sub  = mqtt.connect("mqtt://"+broker_ip+":9000");

const mysql = require('mysql');
const db = mysql.createConnection({
	host: '192.168.1.15',
	port: 3306,
	user: 'gustavocastillo',
	password: 'mqtt96',
	database: 'telemetry'
})
var actual=22;
db.connect((err)=>{
	if(err){
		throw err;
	}
	console.log('db connected!')
})
sub.on('connect',()=>{
	sub.subscribe("GetTemperature");
	sub.subscribe("server1state");
	sub.subscribe("server2state");
})
var count=0;
var temperature;
var estadoServidor='Power OFF';
var estadoServidor2;
sub.on('message',(topic, message)=>{
	//console.log(message.toString());
	if (topic === 'GetTemperature'){
		temperature = Math.round(message);
	}
	if(topic === "server1state"){
		estadoServidor = message.toString();
		if(estadoServidor === 'Power ON'){
			console.log("server 1 state: ",estadoServidor);
		}else{
			console.log("server 1 state: ", estadoServidor)
		}
	}
	if(topic === "server1state"){
		estadoServidor2 = message.toString();
		console.log("server 2 state: ", estadoServidor2);
	}
	var sql ="insert into Temperatura (temperatura,fecha) values("+temperature+",now())"
	count = count+1;
	console.log("temp: ",temperature )
	if(actual!=temperature){
	db.query(sql, function(err,result){
		if(err) throw err;
		console.log(count+' record inserted')
	}
	 
	);}

	actual = Math.round(temperature);
	client.updateChannel(1784256, {field1: temperature}, function(err, resp) {
        	if (!err && resp > 0) {
            		console.log('update successfully. Entry number was: ' + resp);
        	}
    	});
})

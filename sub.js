var ThingSpeakClient = require('thingspeakclient');
var client = new ThingSpeakClient();

var client = new ThingSpeakClient({server:'https://api.thingspeak.com'});
client.attachChannel(1784256, { writeKey:'E7MU9WI3NW0D7N5E'});
const mqtt = require('mqtt');
var broker_ip = 'localhost';
const sub  = mqtt.connect("mqtt://"+broker_ip+":9000");

const mysql = require('mysql');
const db = mysql.createConnection({
	host: '192.168.1.102',
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
var temperature=0;
//var estadoServidor1='Power Off';
//var estadoServidor2='Power Off';
var servidores = ["server1state","server2state","server3state","server4state"];
var estados = new Array(4);
var index;
var cantEstados = new Array(10);
sub.on('message',(topic, message)=>{
	
	if(topic==="GetTemperature"){
		temperature = Math.round(message);
	}
	//if(servidores.includes(topic) && topic!=="GetTemperature" ){
	//	index= servidores.indexOf(topic);
	//	estados[index]="ON";
		
	//}else {for(let i in estados){estados[i]="off";}}
	
	console.log('topic: ', topic);
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
	//console.log("Server 1 state :",estados[0]);
	//nsole.log("Server 2 state :",estados[1]);
	//for(let i in cantEstados){cantEstados[i]=estados[0]}
	//let est1 = cantEstados.filter(element => element==="ON");
	//console.log(est1)
	//if (est1.length>4){console.log("server1 on");}
	//est1.splice(1,9);
})

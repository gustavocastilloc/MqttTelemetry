var ThingSpeakClient = require('thingspeakclient');
var client = new ThingSpeakClient();

var client = new ThingSpeakClient({server:'https://api.thingspeak.com'});
client.attachChannel(1784256, { writeKey:'E7MU9WI3NW0D7N5E'});
const mqtt = require('mqtt');
const sub  = mqtt.connect("mqtt://localhost:9000");

const mysql = require('mysql');
const db = mysql.createConnection({
	host: '192.168.1.15',
	port: 3306,
	user: 'gustavocastillo',
	password: 'mqtt96',
	database: 'telemetry'
})
var actual=25;
db.connect((err)=>{
	if(err){
		throw err;
	}
	console.log('db connected!')
})
sub.on('connect',()=>{
	sub.subscribe("GetTemperature");
})
var count=0;
sub.on('message',(topic, message)=>{
	console.log(message.toString());
	message = Math.round(message);
	var sql ="insert into Temperatura (temperatura,fecha) values("+message+",now())"
	count = count+1;
	console.log("temp: ",message )
	if(actual!=message){
	db.query(sql, function(err,result){
		if(err) throw err;
		console.log(count+' record inserted')
	}
	 
	);}
	actual = Math.round(message);
	client.updateChannel(1784256, {field1: message}, function(err, resp) {
        if (!err && resp > 0) {
            console.log('update successfully. Entry number was: ' + resp);
        }
    });
})

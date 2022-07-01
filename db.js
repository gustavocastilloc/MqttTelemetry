const mysql = require('mysql');
const db = mysql.createConnection({
	host : '192.168.1.101',
	user: 'gustavocastillo',
	password: 'mqtt96',
	databse: 'telemetry'
})

db.connect((err)=>{
	if(err){
		throw err;
	}
	console.log('db connected');
})

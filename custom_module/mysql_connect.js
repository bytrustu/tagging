const mysql = require('mysql');
const func = require('./func.js');

module.exports.mysqlconfig = {
	host : "localhost",
	port : "3306",
	user : "root",
	password : "1234",
	database : "tagging",
	connectionLimit:100,
    waitForConnections:true
};

module.exports.getPool=function(){
	return mysql.createPool(module.exports.mysqlconfig);
};


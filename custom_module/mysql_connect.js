const mysql = require('mysql');
const func = require('./func.js');

module.exports.mysqlconfig = {
	host : "133.186.216.202",
	port : "3306",
	user : "root",
	password : "dkagh123??",
	database : "tagging",
	connectionLimit:100,
    waitForConnections:true
};

module.exports.getPool=function(){
	return mysql.createPool(module.exports.mysqlconfig);
};


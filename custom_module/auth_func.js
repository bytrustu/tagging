const path 					= require("path");
const url 					= require('url');
const db_ 					= require("./db_query.js");
const func 					= require("./func.js");


function send(res, code, data) {
	if (!data) data = {};
	res.statusCode = code;
	res.send(data);
}

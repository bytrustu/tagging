const path 					= require("path");
const ejs 					= require('ejs');
const url 					= require('url');
const os						= require('os');
const fs						= require('fs');
const async					= require('async');
const crypto				= require('crypto');
const iconv = require("iconv-lite");
const func				= require("./../custom_module/func.js");
const db_ 					= require("./../custom_module/db_query.js");
const request = require('request');


function send(res, code, data) {
	if (!data) data = {};
	res.statusCode = code;
	res.send(data);
}

module.exports.category_list = function(req, res){
	db_.categoryList(function(data){
		if (data) {
			send(res, 200, data);
		} else {
			send(res, 404);
		}
	});
};

module.exports.is_register_data = function(req, res){
	const {key} = req.body;
	
	db_.isRegisterData(key, function(result){
		if (result) {
			send(res, 200, result.data);
		} else {
			send(res, 404);
		}
	});
};
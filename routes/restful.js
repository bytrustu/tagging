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
	const cat_id = req.params.cat_id;
	if (!cat_id) send(res, 404);
	const keyDic = {
		sports : '스포츠',
		game : '게임',
		animal : '애완동물',
		etc : '기타',
		all : '전체'
	}
	const key = keyDic[cat_id];

	db_.categoryList(key, function(data){
		if (data) {
			send(res, 200, data);
		} else {
			send(res, 404);
		}
	});
};
const path 					= require("path");
const ejs 					= require('ejs');
const url 					= require('url');
const os						= require('os');
const fs						= require('fs');
const xlsx                      = require('xlsx');
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

const makeCSV = (data,fileName) => {
	const workSheet = xlsx.utils.json_to_sheet(data);
	const stream = xlsx.stream.to_csv(workSheet);
	stream.pipe(fs.createWriteStream(`${__dirname}/../public/csv/${fileName}.csv`));
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

module.exports.is_complete_step1 = function(req, res){
	const {url} = req.body;
	if (!url) {
		send(res, 404);
		return;
	}
	db_.isCompleteStep1(url, function(data){
		if (data) {
			send(res, 200, data);
		} else {
			send(res, 404);
		}
	});
};


module.exports.is_complete_step2 = function(req, res){
	const {data_id} = req.body;
	if (!data_id) {
		send(res, 404);
		return;
	}
	db_.isCompleteStep2(data_id, function(data){
		if (data) {
			send(res, 200, data);
		} else {
			send(res, 404);
		}
	});
};

module.exports.make_coludword = function(req, res){
	const {data_id} = req.body;
	if (!data_id) {
		send(res, 404);
		return;
	}
	db_.getUrl(data_id, function(url){
		if (url) {
			let isFile;
			try {
				fs.statSync(`${__dirname}/../public/csv/${url}.csv`);
				isFile = true;
			} catch (err) {
				if (err.code === 'ENOENT') {
					isFile = false;
				}
			}
			if (!isFile) {
				db_.getKeyword(data_id, function(data){
					data.map((v,i) => {
						if (i < 5) {
							data[i]["frequency"] = 60;
						} else if (i < 10) {
							data[i]["frequency"] = 30;
						} else {
							data[i]["frequency"] = 20;
						}
					});
					if (data) {
						makeCSV(data, url);
						send(res, 200, true);
					} else {
						send(res, 404);
					}
				});
			} else {
				send(res, 200, true);
			}
		} else {
			send(res, 404);
		}
	});
	
};

module.exports.get_keyword = function(req, res){
	const data_id = req.params.data_id;
	db_.getKeyword(data_id, function(data){
		if (data) {
			send(res, 200, data);
		} else {
			send(res, 404);
		}
	});
};

module.exports.analysis_result = function(req, res){
	const data_id = req.params.data_id;
	db_.analysisResult(data_id, function(data){
		if (data) {
			send(res, 200, data);
		} else {
			send(res, 404);
		}
	});
};

module.exports.get_category_result = function(req, res){
	const category = req.params.category;
	db_.getCategoryResult(category, function(data){
		if (data) {
			send(res, 200, data);
		} else {
			send(res, 404);
		}
	});
};


module.exports.getDetail = function(req, res){
	const no = req.params.no;
	db_.getDetail(no, function(data){
		if (data) {
			send(res, 200, data);
		} else {
			send(res, 404);
		}
	});
};

module.exports.makeCSV = function(no, callback){
	db_.getUrl(no, function(url){
		if (url) {
			let isFile;
			try {
				fs.statSync(`${__dirname}/../public/csv/${url}.csv`);
				isFile = true;
			} catch (err) {
				if (err.code === 'ENOENT') {
					isFile = false;
				}
			}
			if (!isFile) {
				db_.getKeyword(no, function(data){
					data.map((v,i) => {
						if (i < 5) {
							data[i]["frequency"] = 60;
						} else if (i < 10) {
							data[i]["frequency"] = 30;
						} else {
							data[i]["frequency"] = 20;
						}
					});
					if (data) {
						makeCSV(data, url);
						callback(true);
					} else {
						callback(false);
					}
				});
			} else {
				callback(true);
			}
		} else {
			callback(false);
		}
	});
};

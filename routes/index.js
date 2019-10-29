
var url = require("url");
var xss = require("xss");
var func = require("./../custom_module/func.js");
var db_ = require("./../custom_module/db_query.js");


function send(res, code, data) {
	if (!data) data = {};
	res.statusCode = code;
	res.send(data);
}

exports.index = (req, res) => {
	res.render('index');
};

exports.tagging = (req, res) => {
	res.render('tagging');
};

exports.category = (req, res) => {
	res.render('category');
};

exports.detail = (req, res) => {
	res.render('detail');
};

exports.statistics = (req, res) => {
	res.render('statistics');
};


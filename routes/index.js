
var url = require("url");
var xss = require("xss");
var func = require("./../custom_module/func.js");
var db_ = require("./../custom_module/db_query.js");
const restful = require("./restful.js");


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
	const no = req.params.no;
	db_.getDetail(no, function(data){
		data.image.map((v,i) => {
			data.image[i].img_name = v.img_name.substring(v.img_name.lastIndexOf('/')+1, v.img_name.length);
		});
		console.log(data.image)
		restful.makeCSV(no, result => {
			console.log(result);
			res.render('detail', data);
		});;
		
	});
	
};

exports.statistics = (req, res) => {
	res.render('statistics');
};


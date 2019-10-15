
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

exports.write_consulting = (req, res) => {
	var Recaptcha = require('recaptcha-v2').Recaptcha;
	var recaptcha = new Recaptcha(func.system.PUBLIC_KEY, func.system.PRIVATE_KEY);
  	res.render('write_consulting', {recaptcha_form: recaptcha.toHTML()});
};

exports.confirm_consulting = (req, res) => {
	res.render('confirm_consulting');
};

exports.info_consulting = (req, res) => {
	res.render('info_consulting');
};

exports.login = function(req, res){
	var data = { user_id : null, user : null };
	//send(res, 404, '<script>location.href="' + func.system.polcyber_domain + '"; </script>');
	res.render('login', data);
};

exports.logout = function(req, res){
	res.clearCookie('sid');
	req.session.destroy(function(err) {
		res.redirect("/");
	});
};

exports.error = function(req, res){
	var data = { user_id : null, user : null };
	res.render('error', data);
};

exports.permission_deny = function(req, res){
	var data = { user_id : null, user : null };
	res.render('permission_deny', data);
};

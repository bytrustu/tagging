const express = require('express');
const routes = require('./routes');
const http = require('http');
const path = require('path');
const engine = require('ejs-locals');
const restful = require("./routes/restful.js");
const app = express();

app.set('port', process.env.PORT || 8888);
app.engine('ejs', engine);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon(path.join(__dirname, 'public','images','favicon.ico')));
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(require('express-useragent').express());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.use(function (req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next()
});

process.on('uncaughtException', function (err) {
	 console.log('Process Exception: ' + err);
	 console.log(err.stack);
});

app.all("*", function(req, res, next){
	res.header("Cache-Control", "no-cache, no-store, must-revalidate");
	res.header("Pragma", "no-cache");
	res.header("Expires", 0);
	next();
});


app.get('/', routes.index);
app.get('/tagging', routes.tagging);
app.get('/category', routes.statistics);
app.get('/category/detail/:no', routes.detail);

app.get('/rest/category_list', restful.category_list);
app.post('/rest/is_register_data', restful.is_register_data);

app.post('/rest/is_complete_step1', restful.is_complete_step1);
app.post('/rest/is_complete_step2', restful.is_complete_step2);

app.post('/rest/make_coludword', restful.make_coludword);
app.get('/rest/get_keyword/:data_id', restful.get_keyword);

app.get('/rest/analysis_result/:data_id', restful.analysis_result);
app.get('/rest/get_category_result/:category', restful.get_category_result);


http.createServer(app).listen(app.get('port'), '0.0.0.0', function(){
	console.log("Https server listening on port " + app.get('port'));
});

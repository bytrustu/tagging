const func = require('./func.js');
const async = require('async');
const db_pool = require('./mysql_connect.js').getPool();

module.exports.getTest = function(start_date, end_date, callback){
	db_pool.getConnection(function(err, db){
		try{
			if (err){
				callback(false);
			} else {
				const query = `select	* from test`;
				const query_list = [];
				db.query(query, query_list, function(err, data) {
					if(err){
						callback(false);
					} else {
						callback(data);
					}
				});
			}
		}catch(e){}finally{
			db.release();
		}
	});
};

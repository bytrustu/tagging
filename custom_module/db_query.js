const func = require('./func.js');
const async = require('async');
const db_pool = require('./mysql_connect.js').getPool();

module.exports.categoryList = function(key, callback){
	db_pool.getConnection(function(err, db){
		try{
			if (err){
				callback(false);
			} else {
				let query;
				let query_list;

				if (key === '전체') {
					query = `select 
									DataCollection.data_id,
									DataCollection.title,
									DataCollection.text,
									DataCollection.thumbnail,
									DataCategory.cat_name
								from DataCollection 
								inner join DataCategory on DataCollection.data_id = DataCategory.data_id;`;
					query_list = [];
				} else {
					query = `select 
									DataCollection.data_id,
									DataCollection.title,
									DataCollection.text,
									DataCollection.thumbnail,
									DataCategory.cat_name
								from DataCollection 
								inner join DataCategory on DataCollection.data_id = DataCategory.data_id
								where DataCategory.cat_name = ?`;
					query_list = [key];
				}
				console.log(query, key);
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

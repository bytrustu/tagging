const func = require('./func.js');
const async = require('async');
const db_pool = require('./mysql_connect.js').getPool();

module.exports.categoryList = function(callback){
	db_pool.getConnection(function(err, db){
		try{
			if (err){
				callback(false);
			} else {
				db.beginTransaction(function(err){
					if (err){
						db.rollback();
						callback(false);
					} else {
						var result = {};
						async.series([
							function(cb) {
								const query = `select 
												DataCollection.data_id,
												DataCollection.title,
												DataCollection.text,
												DataCollection.thumbnail,
												DataCategory.cat_name
											from DataCollection 
											inner join DataCategory on DataCollection.data_id = DataCategory.data_id
											where DataCategory.cat_name = ?
											limit 100`;
								const query_list = ['스포츠'];

								db.query(query, query_list, function(err, data){
									if(err){
										db.rollback();
										callback(false);
									} else {
										result.sports = data;
										cb(null, null);
									}
								});
							},
							function(cb) {
								const query = `select 
												DataCollection.data_id,
												DataCollection.title,
												DataCollection.text,
												DataCollection.thumbnail,
												DataCategory.cat_name
											from DataCollection 
											inner join DataCategory on DataCollection.data_id = DataCategory.data_id
											where DataCategory.cat_name = ?
											limit 100`;
								const query_list = ['게임'];

								db.query(query, query_list, function(err, data){
									if(err){
										db.rollback();
										callback(false);
									} else {
										result.game = data;
										cb(null, null);
									}
								});
							},
							function(cb) {
								const query = `select 
												DataCollection.data_id,
												DataCollection.title,
												DataCollection.text,
												DataCollection.thumbnail,
												DataCategory.cat_name
											from DataCollection 
											inner join DataCategory on DataCollection.data_id = DataCategory.data_id
											where DataCategory.cat_name = ?
											limit 100`;
								const query_list = ['동물'];

								db.query(query, query_list, function(err, data){
									if(err){
										db.rollback();
										callback(false);
									} else {
										result.animal = data;
										cb(null, null);
									}
								});
							},
							function(cb) {
								const query = `select 
												DataCollection.data_id,
												DataCollection.title,
												DataCollection.text,
												DataCollection.thumbnail,
												DataCategory.cat_name
											from DataCollection 
											inner join DataCategory on DataCollection.data_id = DataCategory.data_id
											where DataCategory.cat_name = ?
											limit 100`;
								const query_list = ['음식'];

								db.query(query, query_list, function(err, data){
									if(err){
										db.rollback();
										callback(false);
									} else {
										result.food = data;
										cb(null, null);
									}
								});
							},
							function(cb) {
								db.commit(function (err) {
				                    if (err) {
				                    	db.rollback();
				                    	callback(false);
				                    } else {
				                    	cb(null, null);
				                    }
				                });
						}],
						function(err, data) {
							callback(result);
						});
					}
				});
			}
		}catch(e){}finally{
			db.release();
		}
	});
};

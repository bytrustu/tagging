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



module.exports.isRegisterData = function(key, callback){
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
								const query = `select DataCollection.data_id from DataCollection 
												inner join DataCategory on DataCollection.data_id = DataCategory.data_id 
												where DataCollection.unique_id = ?;`;
								const query_list = [key];

								db.query(query, query_list, function(err, data){
									if(err){
										db.rollback();
										callback(false);
									} else {
										result.data = data;
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


module.exports.isCompleteStep1 = function(url, callback){
	db_pool.getConnection(function(err, db){
		try{
			if (err){
				callback(0);
			} else {
				const query = `select 
								data_id
								, unique_id
								, name, channel
								, regist_date
								, title
								, text
								, thumbnail
								, url
								, create_date 
							from DataCollection
							where unique_id = ?;`
				const query_list = [url];
				db.query(query, query_list, function(err, data) {
					if (err) {
						callback(false);
					} else {
						callback(data)
					}
				});
			}
		}catch(e){}finally{
			db.release();
		}
	});
};


module.exports.isCompleteStep2 = function(data_id, callback){
	db_pool.getConnection(function(err, db){
		try{
			if (err){
				callback(0);
			} else {
				const query = `select count(*) count from DataCategory where data_id = ?;`
				const query_list = [data_id];
				db.query(query, query_list, function(err, data) {
					console.log(err, data);
					if (err) {
						callback(false);
					} else {
						callback(data)
					}
				});
			}
		}catch(e){}finally{
			db.release();
		}
	});
};

module.exports.getUrl = function(data_id, callback){
	db_pool.getConnection(function(err, db){
		try{
			if (err){
				callback(0);
			} else {
				const query = `select unique_id from DataCollection where data_id = ?;`
				const query_list = [data_id];
				db.query(query, query_list, function(err, data) {
					if (err) {
						callback(false);
					} else {
						callback(data[0].unique_id)
					}
				});
			}
		}catch(e){}finally{
			db.release();
		}
	});
};

module.exports.getKeyword = function(data_id, callback){
	db_pool.getConnection(function(err, db){
		try{
			if (err){
				callback(0);
			} else {
				const query = `select word_name as text, word_frequency as frequency  from DataWord where data_id = ? 
								order by word_frequency desc limit 20;`
				const query_list = [data_id];
				db.query(query, query_list, function(err, data) {
					if (err) {
						callback(false);
					} else {
						callback(data)
					}
				});
			}
		}catch(e){}finally{
			db.release();
		}
	});
};
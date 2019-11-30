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
											order by DataCollection.data_id desc
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
											order by DataCollection.data_id desc
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
											order by DataCollection.data_id desc
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
											order by DataCollection.data_id desc
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
				callback(false);
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
				callback(false);
			} else {
				const query = `select count(*) count from DataCategory where data_id = ?;`
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

module.exports.getUrl = function(data_id, callback){
	db_pool.getConnection(function(err, db){
		try{
			if (err){
				callback(false);
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
				callback(false);
			} else {
				const query = `select word as text, score as frequency from DataResult
								where data_id = ?
								order by score desc limit 20;`
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

module.exports.analysisResult = function(data_id, callback){
	db_pool.getConnection(function(err, db){
		try{
			if (err){
				callback(false);
			} else {
				const query = `select DataResult.word as text, DataResult.score as total, DataDictionary.score as score, round(DataResult.score/DataDictionary.score) as cnt, DataDictionary.category  from DataResult
								inner join DataDictionary on DataResult.word = DataDictionary.word
								where DataResult.data_id = ?
								order by DataResult.score desc limit 20;`
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

module.exports.getCategoryResult = function(category, callback){
	db_pool.getConnection(function(err, db){
		try{
			if (err){
				callback(false);
			} else {
				const query = `select DataResult.word, sum(DataResult.score) as score, DataCategory.cat_name from DataResult
								inner join DataCategory on DataResult.data_id = DataCategory.data_id
								where DataCategory.cat_name = ?
								group by DataResult.word
								order by score desc
								limit 20;`
				const query_list = [category];
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




module.exports.getDetail = function(no, callback){
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
												DataCollection.data_id
												, DataCollection.unique_id
												, DataCollection.name
												, DataCollection.regist_date
												, DataCollection.title
												, DataCollection.text
												, DataCollection.timedtext
												, DataCollection.thumbnail
												, DataCollection.url
												, DataCollection.create_date
												, DataWord.word_count 
												, DataCategory.cat_name
											from DataCollection
											left join ( select data_id, count(*) word_count from DataWord group by data_id ) DataWord 
											on DataCollection.data_id = DataWord.data_id
											left join DataCategory on DataCollection.data_id = DataCategory.data_id
											where DataCollection.data_id = ?;`;
								const query_list = [no];

								db.query(query, query_list, function(err, data){
									if(err){
										db.rollback();
										callback(false);
									} else {
										result.data = data[0];
										cb(null, null);
									}
								});
							},
							function(cb) {
								const query = `select img_id, img_name, create_date from DataImage where data_id = ?;`;
								const query_list = [no];

								db.query(query, query_list, function(err, data){
									if(err){
										db.rollback();
										callback(false);
									} else {
										result.image = data;
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
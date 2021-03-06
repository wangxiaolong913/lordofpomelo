// mysql CRUD
var sqlclient = module.exports;

var _pool = null;

var NND = {};

/*
 * Innit sql connection pool
 * @param {Object} app The app for the server.
 */
NND.init = function () {
	if (!_pool)
		_pool = require('./dao-pool').createMysqlPool();
};

/**
 * Excute sql statement
 * @param {String} sql Statement The sql need to excute.
 * @param {Object} args The args for the sql.
 * @param {fuction} callback Callback function.
 * 
 */
NND.query = function (sql, args, callback) {

	const resourcePromise = _pool.acquire();
	resourcePromise
		.then(function (client) {
			client.query(sql, args, function (err, res) {
				_pool.release(client);
				callback.apply(null, [err, res]);
			});
		}).catch(function (err) {
			console.error('[sqlqueryErr] ' + err);
			console.error('看到这句话就知道问题在哪了')
			_pool = require('./dao-pool').createMysqlPool(app);
			this.query(sql, args, cb);
			// return;
		});
};

/**
 * Close connection pool.
 */
NND.shutdown = function () {
	_pool.destroyAllNow();
};

/**
 * init database
 */
sqlclient.init = function () {
	if (!!_pool) {
		return sqlclient;
	} else {
		NND.init();
		sqlclient.insert = NND.query;
		sqlclient.update = NND.query;
		//sqlclient.delete = NND.query;
		sqlclient.query = NND.query;
		return sqlclient;
	}
};

/**
 * shutdown database
 */
sqlclient.shutdown = function () {
	NND.shutdown();
};
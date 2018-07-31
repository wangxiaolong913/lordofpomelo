var _poolModule = require('generic-pool');
var mysqlConfig = require('../../../../shared/config/mysql');
var mysql = require('mysql');

var env = process.env.NODE_ENV || 'development';
if(mysqlConfig[env]) {
  mysqlConfig = mysqlConfig[env];
}

/*
 * Create mysql connection pool.
 */
var createMysqlPool = function(){
  return _poolModule.createPool({
    name     : 'mysql',
    create   : function() {
      var client = mysql.createConnection({
        host: mysqlConfig.host,
        user: mysqlConfig.user,
        password: mysqlConfig.password,
        database: mysqlConfig.database
      });
      // callback(null, client);
      return client
    },
    destroy  : function(client) {
      client.disconnect();
    },
    max      : 10,
    idleTimeoutMillis : 30000,
    log : false
  });
};

exports.createMysqlPool = createMysqlPool;

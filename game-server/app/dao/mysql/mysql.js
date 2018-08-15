var mysql = require('mysql');
var mysqlConfig;
var sqlclient=module.exports;

var pools;

//使用数据库连接池  回调函数
function mysqlPools(...args) {
    if (pools == null) {
        pools = mysql.createPool(mysqlConfig);
    }

    var data = args[1] || [];
    console.log('Print SQL:' + args[0] + JSON.stringify(data));

    pools.query(args[0], data, function (error, results, fields) {
        console.log('The solution is: ' + JSON.stringify(results));
        args[args.length - 1](error, results)
    });
}


sqlclient.init= function (app) {
    if(!!pools){
        return sqlclient;
    }else{
        mysqlConfig = app.get('mysql');
        
        pools = mysql.createPool(mysqlConfig);
        sqlclient.insert = mysqlPools;
		sqlclient.update = mysqlPools;
		sqlclient.delete = mysqlPools;
		sqlclient.query = mysqlPools;
        return sqlclient;
    }
}

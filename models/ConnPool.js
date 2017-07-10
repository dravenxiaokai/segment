//引入mysql模块
var mysql = require('mysql');
//通过闭包导出，供其他模块引用
module.exports = (function(){
	//创建连接池对象
	var pool = mysql.createPool({
		host:'localhost',
		user:'root',
		password:'root',
		database:'segment',
		port:'3306'
	});
	//监听connection连接，回调函数
	pool.on('connection',function(connection){
		connection.query('SET SESSION auto_increment_increment=1');
	});
	//返回一个匿名函数
	return function(){
		//返回这个连接，保证每次拿到的都是这一个连接
		return pool;
	}
})();
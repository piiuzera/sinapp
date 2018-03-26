var mysql = require('mysql');

var _connection = function() {
	return mysql.createConnection({
		host     : 'localhost',
		user     : 'developer',
		password : 'Piu.3141569',
		database : 'sinapp'
	});
};

module.exports.connection = _connection;
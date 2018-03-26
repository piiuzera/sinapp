var Database = require('../database/Database');

var _create = function(crawler, callback) {
	var db = Database.connection();

	db.connect();

	db.query('INSERT INTO tb_crawler SET ?', crawler, function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			crawler.id = result.insertId;
			callback({
				'create' : true,
				'date' : new Date(),
				'crawler' : crawler
			});
		} catch(ex) {
			callback({
				'create': false,
				'date' : new Date(),
				'mensagem': ex
			});
		}
	 });

	db.end();
};

var _update = function(crawler, id, callback) {
	var db = Database.connection();

	db.connect();

	crawler.data_atualizacao = new Date();

	db.query('UPDATE tb_crawler SET ? WHERE id = ?', [crawler, id], function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			aluno.id = id;
			callback({
				'update': true,
				'date' : new Date(),
				'crawler': crawler
			});
		} catch(ex) {
			callback({
				'update': false,
				'date' : new Date(),
				'mensagem': ex
			});
		}
	 });

	db.end();
};

var _remove = function(id, callback) {
	var db = Database.connection();

	db.connect();

	db.query('DELETE FROM tb_crawler WHERE id = ?', id, function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			callback({
				'remove': true,
				'date' : new Date(),
				'mensagem': 'Crawler removido com sucesso'
			});
		} catch(ex) {
			callback({
				'remove': false,
				'date' : new Date(),
				'mensagem': ex
			});
		}
	 });

	db.end();
};

var _findAll = function(callback) {
	var db = Database.connection();

	db.connect(function(err) {
		db.query('SELECT * FROM tb_crawler', function(err, rows) {
			try {
				if(err) {
					throw err.message;
				}

				callback({
					'all' : true,
					'date' : new Date(),
					'crawlers' : rows
				});
			} catch(ex) {
				callback({
					'all': false,
					'date' : new Date(),
					'mensagem': ex
				});
			}
			db.end();
		 });
	});
};

var _findById = function(id, callback) {
	var db = Database.connection();

	db.connect();

	db.query('SELECT * FROM tb_crawler WHERE id = ?', [id], function(err, rows) {
		try {
			if(err) {
				throw err.message;
			}

			var crawler = {};

			rows.map(function(row) {
				crawler = row;
			});

			callback({
				'byId' : true,
				'date' : new Date(),
				'crawler' : crawler
			});
		} catch(ex) {
			callback({
				'byId': false,
				'date' : new Date(),
				'mensagem': ex
			});
		}
		db.end();
	 });
};

var _where = function(field, value, callback) {
	var db = Database.connection();

	db.connect();

	db.query('SELECT * FROM tb_crawler WHERE ?? = ?', [field, value], function(err, rows) {
		try {
			if(err) {
				throw err.message;
			}

			callback({
				'where' : true,
				'date' : new Date(),
				'crawler' : rows
			});
		} catch(ex) {
			callback({
				'where': false,
				'date' : new Date(),
				'mensagem': ex
			});
		}
	 });

	db.end();
};

var _findByType = function(tipo, callback) {
	var db = Database.connection();

	db.connect();

	db.query('SELECT * FROM tb_crawler WHERE tipo = ? AND salvo = 0', [tipo], function(err, rows) {
		try {
			if(err) {
				throw err.message;
			}

			callback({
				'byType' : true,
				'date' : new Date(),
				'crawlers' : rows
			});
		} catch(ex) {
			callback({
				'byType': false,
				'date' : new Date(),
				'mensagem': ex
			});
		}
		db.end();
	 });
};

module.exports.create = _create;
module.exports.update = _update;
module.exports.remove = _remove;
module.exports.findAll = _findAll;
module.exports.findById = _findById;
module.exports.where = _where;
module.exports.findByType = _findByType;
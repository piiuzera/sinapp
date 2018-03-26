var Database = require('../database/Database');

var _create = function(notificacao, callback) {
	var db = Database.connection();

	db.connect();

	db.query('INSERT INTO tb_notificacao SET ?', notificacao, function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			notificacao.id = result.insertId;
			callback({
				'create' : true,
				'date' : new Date(),
				'notificacao' : notificacao
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

var _update = function(notificacao, id, callback) {
	var db = Database.connection();

	db.connect();

	notificacao.data_atualizacao = new Date();
	db.query('UPDATE tb_notificacao SET ? WHERE id = ?', [notificacao, id], function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			notificacao.id = id;
			callback({
				'update': true,
				'date' : new Date(),
				'notificacao': notificacao
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

var _updateTest = function(callback) {
	var db = Database.connection();

	db.connect();
	
	db.query('UPDATE tb_notificacao SET enviado = false WHERE id > 0', [], function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			callback({
				'updateAll': true,
				'date' : new Date()
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

	db.query('DELETE FROM tb_notificacao WHERE id = ?', id, function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			callback({
				'remove': true,
				'date' : new Date(),
				'mensagem': 'Notificação removida com sucesso'
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
		db.query('SELECT * FROM tb_notificacao', function(err, rows) {
			try {
				if(err) {
					throw err.message;
				}

				callback({
					'all' : true,
					'date' : new Date(),
					'notificacoes' : rows
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

	db.query('SELECT * FROM tb_notificacao WHERE id = ?', [id], function(err, rows) {
		try {
			if(err) {
				throw err.message;
			}

			var notificacao = {};

			rows.map(function(row) {
				notificacao = row;
			});

			callback({
				'byId' : true,
				'date' : new Date(),
				'notificacao' : notificacao
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

	db.query('SELECT * FROM tb_notificacao WHERE ?? = ?', [field, value], function(err, rows) {
		try {
			if(err) {
				throw err.message;
			}

			callback({
				'where' : true,
				'date' : new Date(),
				'notificacoes' : rows
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

var _location = function(registro_academico, senha, tipo_notificacao, callback) {
	var db = Database.connection();

	var sql = "SELECT tb_aluno.registro_academico, tb_aluno.nome, 					" +
	   		  "		  tb_notificacao.tipo_notificacao, tb_notificacao.mensagem,		" +
	   		  "		  tb_notificacao.data_cadastro, tb_notificacao.id				" +
  			  "	 FROM tb_notificacao												" +
  			  "	 JOIN tb_aluno ON (tb_aluno.id = tb_notificacao.fk_aluno)			" +
 			  " WHERE tb_notificacao.enviado = 0									" +
   			  "   AND tb_notificacao.tipo_notificacao = ?							" +
   			  "   AND tb_aluno.registro_academico = ?								" +
   			  "   AND tb_aluno.senha = ?;											";

	db.connect();

	db.query(sql, [tipo_notificacao, registro_academico, senha], function(err, rows) {
		try {
			if(err) {
				throw err.message;
			}

			callback({
				'location' : true,
				'date' : new Date(),
				'notificacoes' : rows
			});
		} catch(ex) {
			callback({
				'location': false,
				'date' : new Date(),
				'mensagem': ex
			});
		}
	 });

	db.end();
};

module.exports.create = _create;
module.exports.update = _update;
module.exports.updateTest = _updateTest;
module.exports.remove = _remove;
module.exports.findAll = _findAll;
module.exports.findById = _findById;
module.exports.where = _where;
module.exports.location = _location;
var Database = require('../database/Database');

var _create = function(aluno, callback) {
	var db = Database.connection();

	db.connect();

	db.query('INSERT INTO tb_aluno SET ?', aluno, function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			aluno.id = result.insertId;
			callback({
				'create' : true,
				'date' : new Date(),
				'aluno' : aluno
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

var _update = function(aluno, id, callback) {
	var db = Database.connection();

	db.connect();

	aluno.data_atualizacao = new Date();
	delete aluno.nome;
	db.query('UPDATE tb_aluno SET ? WHERE id = ?', [aluno, id], function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			aluno.id = id;
			callback({
				'update': true,
				'date' : new Date(),
				'aluno': aluno
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

	db.query('DELETE FROM tb_aluno WHERE id = ?', id, function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			callback({
				'remove': true,
				'date' : new Date(),
				'mensagem': 'Aluno removido com sucesso'
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
		db.query('SELECT * FROM tb_aluno', function(err, rows) {
			try {
				if(err) {
					throw err.message;
				}

				rows.map(function(row) {
					row.ativo = row.ativo == 1;
				});

				callback({
					'all' : true,
					'date' : new Date(),
					'alunos' : rows
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

	db.query('SELECT * FROM tb_aluno WHERE id = ?', [id], function(err, rows) {
		try {
			if(err) {
				throw err.message;
			}

			var aluno = {};

			rows.map(function(row) {
				row.ativo = row.ativo == 1;
				aluno = row;
			});

			callback({
				'byId' : true,
				'date' : new Date(),
				'aluno' : aluno
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

	db.query('SELECT * FROM tb_aluno WHERE ?? = ?', [field, value], function(err, rows) {
		try {
			if(err) {
				throw err.message;
			}

			rows.map(function(row) {
				row.ativo = row.ativo == 1;
			});

			callback({
				'where' : true,
				'date' : new Date(),
				'alunos' : rows
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

var _verifyAndSave = function(aluno, callback) {
	_where('registro_academico', aluno.registro_academico, function(data) {
		if(data.where) {
			if(data.alunos.length == 0) {
				_create(aluno, function(data) {
					if(data.create) {
						aluno.id = data.aluno.id;
						callback({
							'verify' : true,
							'date' : new Date(),
							'aluno' : aluno
						});
					} else {
						callback({
							'verify' : false,
							'date' : new Date(),
							'mensagem' : data.mensagem
						});
					}
				});
			} else {
				aluno.id = data.alunos[0].id;
				_update(aluno, aluno.id, function(data) {
					if(data.update) {
						aluno.id = data.aluno.id;
						callback({
							'verify' : true,
							'date' : new Date(),
							'aluno' : aluno
						});
					} else {
						callback({
							'verify' : false,
							'date' : new Date(),
							'mensagem' : data.mensagem
						});
					}
				});
			}
		}
	});
};

module.exports.create = _create;
module.exports.update = _update;
module.exports.remove = _remove;
module.exports.findAll = _findAll;
module.exports.findById = _findById;
module.exports.where = _where;
module.exports.verifyAndSave = _verifyAndSave;
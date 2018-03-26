var Database = require('../database/Database');

var _create = function(nota, callback) {
	var db = Database.connection();

	db.connect();

	db.query('INSERT INTO tb_notas SET ?', nota, function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			nota.id = result.insertId;
			callback({
				'create' : true,
				'date' : new Date(),
				'nota' : nota
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

var _update = function(nota, id, callback) {
	var db = Database.connection();

	db.connect();

	nota.data_atualizacao = new Date();

	db.query('UPDATE tb_notas SET ? WHERE id = ?', [nota, id], function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			nota.id = id;
			callback({
				'update': true,
				'date' : new Date(),
				'nota': nota
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

	db.query('DELETE FROM tb_notas WHERE id = ?', id, function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			callback({
				'remove': true,
				'date' : new Date(),
				'mensagem': 'Nota removida com sucesso'
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
		db.query('SELECT * FROM tb_notas', function(err, rows) {
			try {
				if(err) {
					throw err.message;
				}

				callback({
					'all' : true,
					'date' : new Date(),
					'notas' : rows
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

	db.query('SELECT * FROM tb_notas WHERE id = ?', [id], function(err, rows) {
		try {
			if(err) {
				throw err.message;
			}

			var nota = {};

			rows.map(function(row) {
				nota = row;
			});

			callback({
				'byId' : true,
				'date' : new Date(),
				'nota' : nota
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

	db.query('SELECT * FROM tb_notas WHERE ?? = ?', [field, value], function(err, rows) {
		try {
			if(err) {
				throw err.message;
			}

			callback({
				'where' : true,
				'date' : new Date(),
				'notas' : rows
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

var _findAggregate = function(fk_aluno, fk_disciplina, turma, callback) {
	var db = Database.connection();

	db.connect();

	db.query('SELECT * FROM tb_notas WHERE fk_aluno = ? AND fk_disciplina = ? AND turma = ?', [fk_aluno, fk_disciplina, turma], function(err, rows) {
		try {
			if(err) {
				throw err.message;
			}

			callback({
				'aggregate' : true,
				'date' : new Date(),
				'notas' : rows
			});
		} catch(ex) {
			callback({
				'aggregate': false,
				'date' : new Date(),
				'mensagem': ex
			});
		}
	 });

	db.end();
};

var _verifyAndSave = function(nota, callback) {
	_findAggregate(nota.fk_aluno, nota.fk_disciplina, nota.turma, function(data) {
		if(data.aggregate) {
			if(data.notas.length == 0) {
				_create(nota, function(data) {
					if(data.create) {
						nota.id = data.nota.id;
						callback({
							'verify' : true,
							'date' : new Date(),
							'nota' : nota
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
				nota.id = data.notas[0].id;
				_update(nota, nota.id, function(data) {
					if(data.update) {
						nota.id = data.nota.id;
						callback({
							'verify' : true,
							'date' : new Date(),
							'nota' : nota
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
module.exports.findAggregate = _findAggregate;
module.exports.verifyAndSave = _verifyAndSave;
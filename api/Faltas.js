var Database = require('../database/Database');

var _create = function(falta, callback) {
	var db = Database.connection();

	db.connect();

	db.query('INSERT INTO tb_faltas SET ?', falta, function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			falta.id = result.insertId;
			callback({
				'create' : true,
				'date' : new Date(),
				'falta' : falta
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

var _update = function(falta, id, callback) {
	var db = Database.connection();

	db.connect();

	falta.data_atualizacao = new Date();

	db.query('UPDATE tb_faltas SET ? WHERE id = ?', [falta, id], function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			falta.id = id;
			callback({
				'update': true,
				'date' : new Date(),
				'falta': falta
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

	db.query('DELETE FROM tb_faltas WHERE id = ?', id, function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			callback({
				'remove': true,
				'date' : new Date(),
				'mensagem': 'Falta removida com sucesso'
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
		db.query('SELECT * FROM tb_faltas', function(err, rows) {
			try {
				if(err) {
					throw err.message;
				}

				callback({
					'all' : true,
					'date' : new Date(),
					'faltas' : rows
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

	db.query('SELECT * FROM tb_faltas WHERE id = ?', [id], function(err, rows) {
		try {
			if(err) {
				throw err.message;
			}

			var falta = {};

			rows.map(function(row) {
				falta = row;
			});

			callback({
				'byId' : true,
				'date' : new Date(),
				'falta' : falta
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

	db.query('SELECT * FROM tb_faltas WHERE ?? = ?', [field, value], function(err, rows) {
		try {
			if(err) {
				throw err.message;
			}

			callback({
				'where' : true,
				'date' : new Date(),
				'faltas' : rows
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

	db.query('SELECT * FROM tb_faltas WHERE fk_aluno = ? AND fk_disciplina = ? AND turma = ?', [fk_aluno, fk_disciplina, turma], function(err, rows) {
		try {
			if(err) {
				throw err.message;
			}

			callback({
				'aggregate' : true,
				'date' : new Date(),
				'faltas' : rows
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

var _verifyAndSave = function(falta, callback) {
	_findAggregate(falta.fk_aluno, falta.fk_disciplina, falta.turma, function(data) {
		if(data.aggregate) {
			if(data.faltas.length == 0) {
				_create(falta, function(data) {
					if(data.create) {
						falta.id = data.falta.id;
						callback({
							'verify' : true,
							'date' : new Date(),
							'falta' : falta
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
				falta.id = data.faltas[0].id;
				_update(falta, falta.id, function(data) {
					if(data.update) {
						falta.id = data.falta.id;
						callback({
							'verify' : true,
							'date' : new Date(),
							'falta' : falta
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
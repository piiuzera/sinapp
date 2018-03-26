var Database = require('../database/Database');

var _create = function(disciplina, callback) {
	var db = Database.connection();

	db.connect();

	db.query('INSERT INTO tb_disciplina SET ?', disciplina, function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			disciplina.id = result.insertId;
			callback({
				'create' : true,
				'date' : new Date(),
				'disciplina' : disciplina
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

var _update = function(disciplina, id, callback) {
	var db = Database.connection();

	db.connect();

	disciplina.data_atualizacao = new Date();

	db.query('UPDATE tb_disciplina SET ? WHERE id = ?', [disciplina, id], function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			disciplina.id = id;
			callback({
				'update': true,
				'date' : new Date(),
				'disciplina': disciplina
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

	db.query('DELETE FROM tb_disciplina WHERE id = ?', id, function(err, result) {
		try {
			if(err) {
				throw err.message;
			}

			callback({
				'remove': true,
				'date' : new Date(),
				'mensagem': 'Disciplina removida com sucesso'
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
		db.query('SELECT * FROM tb_disciplina', function(err, rows) {
			try {
				if(err) {
					throw err.message;
				}

				callback({
					'all' : true,
					'date' : new Date(),
					'disciplinas' : rows
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

	db.query('SELECT * FROM tb_disciplina WHERE id = ?', [id], function(err, rows) {
		try {
			if(err) {
				throw err.message;
			}

			var disciplina = {};

			rows.map(function(row) {
				disciplina = row;
			});

			callback({
				'byId' : true,
				'date' : new Date(),
				'disciplina' : disciplina
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

	db.query('SELECT * FROM tb_disciplina WHERE ?? = ?', [field, value], function(err, rows) {
		try {
			if(err) {
				throw err.message;
			}

			callback({
				'where' : true,
				'date' : new Date(),
				'disciplinas' : rows
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

var _verifyAndSave = function(disciplina, callback) {
	_where('sigla', disciplina.sigla, function(data) {
		if(data.where) {
			if(data.disciplinas.length == 0) {
				_create(disciplina, function(data) {
					if(data.create) {
						disciplina.id = data.disciplina.id;
						callback({
							'verify' : true,
							'date' : new Date(),
							'disciplina' : disciplina
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
				disciplina.id = data.disciplinas[0].id;
				_update(disciplina, disciplina.id, function(data) {
					if(data.update) {
						disciplina.id = data.disciplina.id;
						callback({
							'verify' : true,
							'date' : new Date(),
							'disciplina' : disciplina
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
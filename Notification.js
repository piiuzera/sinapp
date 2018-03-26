var cheerio = require('cheerio');
var requireNew = require('require-new');
var Notificacao = require('./api/Notificacao');

var _realTimeNotification = function(registro_academico, senha, callback) {
	Notificacao.location(registro_academico, senha, 1, function(data) {
		if(data.location) {
			if(data.notificacoes.length > 0) {

				var notificacoes = [];
				data.notificacoes.forEach(function(notif) {
					notificacoes.push({
						'data' : notif.data_cadastro,
						'mensagem' : notif.mensagem
					});

					Notificacao.update({'enviado' : true}, notif.id, function(data) {
						console.log(data);
					});
				});

				callback({
					'newNotification' : true,
					'date' : new Date(),
					'notificacoes' : notificacoes
				});

			} else {
				callback({
					'newNotification' : false,
					'date' : new Date()
				});
			}
		} else {
			callback({
				'newNotification' : false,
				'date' : new Date()
			});
		}
	});
};

var _morningNotification = function(registro_academico, senha, callback) {
	Notificacao.location(registro_academico, senha, 2, function(data) {
		if(data.location) {
			if(data.notificacoes.length > 0) {

				var notificacoes = [];
				data.notificacoes.forEach(function(notificacao) {
					notificacoes.push({
						'data' : notificacao.data_cadastro,
						'mensagem' : notificacao.mensagem
					});

					notificacao.enviado = true;
					Notificacao.update(notificacao, notificacao.id, function(data) {

					});
				});

				callback({
					'newNotification' : true,
					'date' : new Date(),
					'notificacoes' : notificacoes
				});

			} else {
				callback({
					'newNotification' : false,
					'date' : new Date()
				});
			}
		} else {
			callback({
				'newNotification' : false,
				'date' : new Date()
			});
		}
	});
};

var _afternoonNotification = function(registro_academico, senha, callback) {
	Notificacao.location(registro_academico, senha, 3, function(data) {
		if(data.location) {
			if(data.notificacoes.length > 0) {

				var notificacoes = [];
				data.notificacoes.forEach(function(notificacao) {
					notificacoes.push({
						'data' : notificacao.data_cadastro,
						'mensagem' : notificacao.mensagem
					});

					notificacao.enviado = true;
					Notificacao.update(notificacao, notificacao.id, function(data) {

					});
				});

				callback({
					'newNotification' : true,
					'date' : new Date(),
					'notificacoes' : notificacoes
				});

			} else {
				callback({
					'newNotification' : false,
					'date' : new Date()
				});
			}
		} else {
			callback({
				'newNotification' : false,
				'date' : new Date()
			});
		}
	});
};

var _nightNotification = function(registro_academico, senha, callback) {
	Notificacao.location(registro_academico, senha, 4, function(data) {
		if(data.location) {
			if(data.notificacoes.length > 0) {

				var notificacoes = [];
				data.notificacoes.forEach(function(notificacao) {
					notificacoes.push({
						'data' : notificacao.data_cadastro,
						'mensagem' : notificacao.mensagem
					});

					notificacao.enviado = true;
					Notificacao.update(notificacao, notificacao.id, function(data) {

					});
				});

				callback({
					'newNotification' : true,
					'date' : new Date(),
					'notificacoes' : notificacoes
				});

			} else {
				callback({
					'newNotification' : false,
					'date' : new Date()
				});
			}
		} else {
			callback({
				'newNotification' : false,
				'date' : new Date()
			});
		}
	});
};

var _dailyNotification = function(registro_academico, senha, callback) {
	Notificacao.location(registro_academico, senha, 5, function(data) {
		if(data.location) {
			if(data.notificacoes.length > 0) {

				var notificacoes = [];
				data.notificacoes.forEach(function(notificacao) {
					notificacoes.push({
						'data' : notificacao.data_cadastro,
						'mensagem' : notificacao.mensagem
					});

					notificacao.enviado = true;
					Notificacao.update(notificacao, notificacao.id, function(data) {

					});
				});

				callback({
					'newNotification' : true,
					'date' : new Date(),
					'notificacoes' : notificacoes
				});

			} else {
				callback({
					'newNotification' : false,
					'date' : new Date()
				});
			}
		} else {
			callback({
				'newNotification' : false,
				'date' : new Date()
			});
		}
	});
};

var _pointsNotification = function(registro_academico, senha, callback) {
	Notificacao.location(registro_academico, senha, 6, function(data) {
		if(data.location) {
			if(data.notificacoes.length > 0) {

				var notificacoes = [];
				data.notificacoes.forEach(function(notificacao) {
					notificacoes.push({
						'data' : notificacao.data_cadastro,
						'mensagem' : notificacao.mensagem
					});

					notificacao.enviado = true;
					Notificacao.update(notificacao, notificacao.id, function(data) {

					});
				});

				callback({
					'newNotification' : true,
					'date' : new Date(),
					'notificacoes' : notificacoes
				});

			} else {
				callback({
					'newNotification' : false,
					'date' : new Date()
				});
			}
		} else {
			callback({
				'newNotification' : false,
				'date' : new Date()
			});
		}
	});
};

var _faultsNotification = function(registro_academico, senha, callback) {
	Notificacao.location(registro_academico, senha, 7, function(data) {
		if(data.location) {
			if(data.notificacoes.length > 0) {

				var notificacoes = [];
				data.notificacoes.forEach(function(notificacao) {
					notificacoes.push({
						'data' : notificacao.data_cadastro,
						'mensagem' : notificacao.mensagem
					});

					notificacao.enviado = true;
					Notificacao.update(notificacao, notificacao.id, function(data) {

					});
				});

				callback({
					'newNotification' : true,
					'date' : new Date(),
					'notificacoes' : notificacoes
				});

			} else {
				callback({
					'newNotification' : false,
					'date' : new Date()
				});
			}
		} else {
			callback({
				'newNotification' : false,
				'date' : new Date()
			});
		}
	});
};

module.exports.realTimeNotification = _realTimeNotification;
module.exports.morningNotification = _morningNotification;
module.exports.afternoonNotification = _afternoonNotification;
module.exports.nightNotification = _nightNotification;
module.exports.dailyNotification = _dailyNotification;
module.exports.pointsNotification = _pointsNotification;
module.exports.faultsNotification = _faultsNotification;
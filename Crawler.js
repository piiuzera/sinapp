var cheerio = require('cheerio');
var requireNew = require('require-new');
var CrawlerHistory = require('./api/Crawler');

var _logout = function(callback) {
	var request = requireNew('request-promise');
	request({
		'uri' : 'https://ww2.fumec.br/sinefmobile/processos/login/logout',
		'encoding' : null,
		'method' : 'GET',
		'jar' : true
	}).then(function(data) {
		callback({
			'logout' : true,
			'date' : new Date(),
			'mensagem' : 'Logout efetuado com sucesso'
		});
	}).catch(function(ex) {
		callback({
			'logout' : false,
			'date' : new Date(),
			'mensagem' : 'Problemas ao solicitar requisição com o servidor',
			'error': ex
		});
	});
};

var _index = function(callback) {
	var request = requireNew('request-promise');
	request({
		'uri' : 'https://ww2.fumec.br/sinefmobile/',
		'encoding' : null,
		'method' : 'GET',
		'jar' : true
	}).then(function(data) {
		var $ = cheerio.load(data);

		callback({
			'index' : true,
			'date' : new Date(),
			'token' : $('input[name=\'snf_sec_tkn\']').val()
		}, request);
	}).catch(function(ex) {
		callback({
			'index' : false,
			'date' : new Date(),
			'mensagem' : 'Problemas ao solicitar requisição com o servidor',
			'error': ex
		});
	});
}

var _attempt = function(registro_academico, senha, callback) {
	_index(function(data, request) {
		if(data.index) {
			request({
				'uri' : 'https://ww2.fumec.br/sinefmobile/processos/login/validaLogin',
				'encoding' : null,
				'method' : 'POST',
				'followAllRedirects' : true,
				'jar' : true,
				'form': {
					'snf_sec_tkn': data.token,
					'registro': registro_academico,
					'senha': senha,
					'submit': ''
				}
			}).then(function(data) {
				var $ = cheerio.load(data);

				if($('header > ul > li > a').text() != '') {
					CrawlerHistory.create({
						'tipo' : 1,
						'json' : JSON.stringify({
							'auth' : true,
							'date' : new Date(),
							'aluno' : {
								'nome' : $('header > ul > li > a').text(),
								'registro_academico' : registro_academico,
								'senha' : senha,
								'ativo' : true
							}
						})
					}, function(data) {

					});

					callback({
						'auth' : true,
						'date' : new Date(),
						'aluno' : {
							'nome' : $('header > ul > li > a').text(),
							'registro_academico' : registro_academico,
							'ativo' : true
						}
					}, request);
				} else {
					callback({
						'auth' : false,
						'date' : new Date(),
						'mensagem' : 'Usuário ou senha inválidos'
					});
				}
			}).catch(function(ex) {
				callback({
					'auth' : false,
					'date' : new Date(),
					'mensagem' : 'Problemas ao solicitar requisição com o servidor',
					'error': ex
				});
			});
		} else {
			callback(data);
		}
	});
};

var _points = function(registro_academico, senha, callback) {
	var aluno = {};
	_attempt(registro_academico, senha, function(data, request) {
		if(data.auth) {
			aluno = data.aluno;
			request({
				'uri' : 'https://ww2.fumec.br/sinefmobile/academico/notas',
				'encoding' : null,
				'method' : 'GET',
				'jar' : true
			}).then(function(data) {
				var $ = cheerio.load(data);

				var notas = [];

				$('table > tbody > tr').each(function(index) {
					var obj = {};
					$(this).find('td').each(function(index) {
						if(index == 0) {
							obj.sigla_disciplina = $(this).text().trim();
						} else if(index == 1) {
							obj.disciplina = $(this).text().trim();
						} else if(index == 2) {
							obj.carga_horaria = $(this).text().trim();
						} else if(index == 3) {
							obj.turma = $(this).text().trim();
						} else if(index == 4) {
							obj.faltas_total = isNaN($(this).text().trim()) || $(this).text().trim() == '' ? 0 : Number($(this).text().trim());
						} else if(index == 5) {
							obj.faltas_maxima = isNaN($(this).text().trim()) || $(this).text().trim() == '' ? 0 : Number($(this).text().trim());
							obj.atividade_autoinstrucional = null;
							obj.revisao_conteudo = null;
							obj.exame_especial = null;
						} else if(index == 6) {
							obj.aval_1 = isNaN($(this).text().trim()) || $(this).text().trim() == '' ? null : Number($(this).text().trim());
						} else if(index == 7) {
							var objStr = $(this).text().trim().split('/');
							obj.aval_2 = objStr.length > 0 && objStr[0].trim() != '' ? Number(objStr[0].trim()) : null;
							obj.atividade_autoinstrucional = objStr.length > 1 && objStr[1].trim() != '' ? Number(objStr[1].trim()) : null;
							obj.revisao_conteudo = objStr.length > 2 && objStr[0].trim() != '' ? Number(objStr[2].trim()) : null;
						} else if(index == 8) {
							obj.aval_3 = isNaN($(this).text().trim()) || $(this).text().trim() == '' ? null : Number($(this).text().trim());
						} else if(index == 9) {
							obj.aval_4 = isNaN($(this).text().trim()) || $(this).text().trim() == '' ? null : Number($(this).text().trim());
						} else if(index == 10) {
							obj.aval_5 = isNaN($(this).text().trim()) || $(this).text().trim() == '' ? null : Number($(this).text().trim());
						} else if(index == 11) {
							obj.aval_6 = isNaN($(this).text().trim()) || $(this).text().trim() == '' ? null : Number($(this).text().trim());
						} else if(index == 12) {
							obj.aval_7 = isNaN($(this).text().trim()) || $(this).text().trim() == '' ? null : Number($(this).text().trim());
						} else if(index == 13) {
							obj.aval_8 = isNaN($(this).text().trim()) || $(this).text().trim() == '' ? null : Number($(this).text().trim());
						} else if(index == 14) {
							obj.aval_9 = isNaN($(this).text().trim()) || $(this).text().trim() == '' ? null : Number($(this).text().trim());
						} else if(index == 15) {
							obj.aval_10 = isNaN($(this).text().trim()) || $(this).text().trim() == '' ? null : Number($(this).text().trim());
						} else if(index == 16) {
							obj.exame_especial = isNaN($(this).text().trim()) || $(this).text().trim() == '' ? null : Number($(this).text().trim());
						} else if(index == 17) {
							obj.total = isNaN($(this).text().trim()) || $(this).text().trim() == '' ? null : Number($(this).text().trim());
						}
					});

					notas.push(obj);
				});

				aluno.senha = senha;
				CrawlerHistory.create({
					'tipo' : 2,
					'json' : JSON.stringify({
						'auth' : true,
						'date' : new Date(),
						'aluno' : aluno,
						'notas' : notas
					})
				}, function(data) {
					
				});

				delete aluno.senha;

				callback({
					'auth' : true,
					'date' : new Date(),
					'aluno' : aluno,
					'notas' : notas
				}, request);

			}).catch(function(ex) {
				callback({
					'auth' : false,
					'date' : new Date(),
					'mensagem' : 'Problemas ao solicitar requisição com o servidor',
					'error': ex
				});
			});
		} else {
			callback(data);
		}
	});
};

var _schedules = function(registro_academico, senha, callback) {
	var aluno = {};
	_attempt(registro_academico, senha, function(data, request) {
		if(data.auth) {
			aluno = data.aluno;
			request({
				'uri' : 'https://ww2.fumec.br/sinefmobile/academico/horario_aula',
				'encoding' : null,
				'method' : 'GET',
				'followAllRedirects' : true,
				'jar' : true
			}).then(function(data) {
				var $ = cheerio.load(data);

				var horarios = [];

				$('table > tbody > tr').each(function(index) {
					var obj = {};

					obj.cod_dia_semana = 0;
					obj.dia_semana = '';
					obj.horarios = [];
					$(this).find('td').each(function(index) {
						if(index == 0) {
							switch($(this).text().trim()) {
								case 'Segunda':
									obj.cod_dia_semana = 1;
									break;
								case 'Terca':
									obj.cod_dia_semana = 2;
									break;
								case 'Quarta':
									obj.cod_dia_semana = 3;
									break;
								case 'Quinta':
									obj.cod_dia_semana = 4;
									break;
								case 'Sexta':
									obj.cod_dia_semana = 5;
									break;
								case 'Sabado':
									obj.cod_dia_semana = 6;
									break;
								default:
									obj.cod_dia_semana = 0;
									break;
							}
							obj.dia_semana = $(this).text().trim();
						} else {
							var horario = {};
							$(this).find('span').each(function(index) {
								var objStr = $(this).text().trim().split('-');

								horario.horario_inicio = objStr[0].trim();
								horario.horario_termino = objStr[1].trim();
							});

							var objStr = $(this).first().contents().filter(function() {
								return this.type === 'text';
							}).text().split(' - ');

							if(objStr.length > 1) {
								horario.disciplina = objStr[0].trim();
								var turma_sala = objStr[1].replace('(', '').replace(')', '').split(' ');
								horario.turma = turma_sala[0].trim();
								horario.sala = turma_sala[1].trim();
							}

							if(Object.keys(horario).length > 0) {
								obj.horarios.push(horario);
							}
						}
					});

					horarios.push(obj);
				});

				callback({
					'auth' : true,
					'date' : new Date(),
					'aluno' : aluno,
					'calendario_semanal' : horarios
				}, request);

			}).catch(function(ex) {
				callback({
					'auth' : false,
					'date' : new Date(),
					'mensagem' : 'Problemas ao solicitar requisição com o servidor',
					'error': ex
				});
			});
		} else {
			callback(data);
		}
	});
};

module.exports.index = _index;
module.exports.attempt = _attempt;
module.exports.logout = _logout;
module.exports.points = _points;
module.exports.schedules = _schedules;
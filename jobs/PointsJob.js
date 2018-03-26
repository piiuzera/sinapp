var jsonfile = require('jsonfile');
var fs = require('fs');
var Alunos = require('../api/Alunos');
var CrawlerHistory = require('../api/Crawler');
var Disciplinas = require('../api/Disciplinas');
var Notas = require('../api/Notas');
var Faltas = require('../api/Faltas');
var schedule = require('node-schedule');

var _start = function() {
	schedule.scheduleJob('30 * * * * *', function() {
		_allFiles(function(data) {
			if(data.exists) {
				data.files.forEach(function(crawler) {
					var points = JSON.parse(crawler.json);

					var aluno = points.aluno;

					Alunos.verifyAndSave(aluno, function(data) {
						if(data.verify) {
							aluno.id = data.aluno.id;

							points.notas.forEach(function(nota) {
								var disciplina = {
									'sigla' : nota.sigla_disciplina,
									'nome' : nota.disciplina,
									'carga_horaria' : nota.carga_horaria
								};

								var falta = {
									'fk_aluno' : aluno.id,
									'fk_disciplina' : disciplina.id,
									'turma' : nota.turma,
									'faltas_total' : nota.faltas_total,
									'faltas_maxima' : nota.faltas_maxima
								};

								var nota = {
									'fk_aluno' : aluno.id,
									'fk_disciplina' : disciplina.id,
									'turma' : nota.turma,
									'atividade_autoinstrucional' : nota.atividade_autoinstrucional,
									'revisao_conteudo' : nota.revisao_conteudo,
									'exame_especial' : nota.exame_especial,
									'aval_1' : nota.aval_1,
									'aval_2' : nota.aval_2,
									'aval_3' : nota.aval_3,
									'aval_4' : nota.aval_4,
									'aval_5' : nota.aval_5,
									'aval_6' : nota.aval_6,
									'aval_7' : nota.aval_7,
									'aval_8' : nota.aval_8,
									'aval_9' : nota.aval_9,
									'aval_10' : nota.aval_10,
									'total' : nota.total
								};

								Disciplinas.verifyAndSave(disciplina, function(data) {
									if(data.verify) {
										disciplina.id = data.disciplina.id;

										falta.fk_disciplina = data.disciplina.id;
										nota.fk_disciplina = data.disciplina.id;

										Faltas.verifyAndSave(falta, function(data) {
											if(data.verify) {
												falta.id = data.falta.id;
											}
										});

										Notas.verifyAndSave(nota, function(data) {
											if(data.verify) {
												nota.id = data.nota.id;
											}
										});
									}
								});
							});
						}
					});

					crawler.salvo = true;
					CrawlerHistory.update(crawler, crawler.id, function(data) {
						
					});
				});
			}
		});
	});
};

var _allFiles = function(callback) {
	CrawlerHistory.findByType(2, function(data) {
		if(data.byType) {
			callback({
				'exists': true,
				'files' : data.crawlers
			});
		} else {
			callback({
				'exists': false,
				'mensagem' : data.mensagem
			});
		}
	});
};

module.exports.start = _start;
module.exports.allFiles = _allFiles;
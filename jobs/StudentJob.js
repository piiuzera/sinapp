var jsonfile = require('jsonfile');
var fs = require('fs');
var Alunos = require('../api/Alunos');
var CrawlerHistory = require('../api/Crawler');
var schedule = require('node-schedule');

var _start = function() {
	schedule.scheduleJob('30 * * * * *', function() {
		_allFiles(function(data) {
			if(data.exists) {
				data.files.forEach(function(crawler) {
					var student = JSON.parse(crawler.json);

					Alunos.verifyAndSave(student.aluno, function(data) {
						
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
	CrawlerHistory.findByType(1, function(data) {
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
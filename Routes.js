var crawler = require('./Crawler');
var express = require('express');
var path = require('path');
var session = require('express-session');
var bodyParser = require('body-parser');
var cors = require('cors');
var Notification = require('./Notification');
var Notificacao = require('./api/Notificacao');

var _app = express();
_app.set('views', './public');
_app.set('view engine', 'ejs');

_app.use(bodyParser.json());
_app.use(cors());
_app.use(bodyParser.urlencoded({
	extended: true
}));
_app.use(express.static(path.join(__dirname, 'public')));

_app.engine('html', require('ejs').renderFile);

_app.use(session({
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: {
		secure: true
	}
}));

/*
* /
*/
_app.get('/', function(req, res) {
	res.render('index.html');
});

/*
* /crawler
*/
_app.get('/crawler/index', function(req, res) {
	crawler.index(function(data) {
		if(data.index) {
			res.status(200).json(data);
		} else {
			res.status(403).json(data);
		}
	});
});
_app.post('/crawler/attempt', function(req, res) {
	var registro_academico = req.body.registro_academico == null ? '' : req.body.registro_academico.trim();
	var senha = req.body.senha == null ? '' : req.body.senha.trim();

	crawler.attempt(registro_academico, senha, function(data) {
		if(data.auth) {
			res.status(200).json(data);
		} else {
			res.status(403).json(data);
		}
	});
});
_app.get('/crawler/logout', function(req, res) {
	crawler.logout(function(data) {
		if(data.logout) {
			res.status(200).json(data);
		} else {
			res.status(403).json(data);
		}
	});
});
_app.post('/crawler/points', function(req, res) {
	var registro_academico = req.body.registro_academico == null ? '' : req.body.registro_academico.trim();
	var senha = req.body.senha == null ? '' : req.body.senha.trim();

	crawler.points(registro_academico, senha, function(data) {
		if(data.auth) {
			res.status(200).json(data);
		} else {
			res.status(403).json(data);
		}
	});
});
_app.post('/crawler/schedules', function(req, res) {
	var registro_academico = req.body.registro_academico == null ? '' : req.body.registro_academico.trim();
	var senha = req.body.senha == null ? '' : req.body.senha.trim();

	crawler.schedules(registro_academico, senha, function(data) {
		if(data.auth) {
			res.status(200).json(data);
		} else {
			res.status(403).json(data);
		}
	});
});

/*
* /notification
*/
_app.get('/notification', function(req, res) {
	Notificacao.updateTest(function(data) {
		res.status(200).json(data);
	});
});
_app.post('/notification/realTime', function(req, res) {
	var registro_academico = req.body.registro_academico == null ? '' : req.body.registro_academico.trim();
	var senha = req.body.senha == null ? '' : req.body.senha.trim();

	Notification.realTimeNotification(registro_academico, senha, function(data) {
		res.status(200).json(data);
	});
});
_app.post('/notification/morning', function(req, res) {
	var registro_academico = req.body.registro_academico == null ? '' : req.body.registro_academico.trim();
	var senha = req.body.senha == null ? '' : req.body.senha.trim();

	Notification.morningNotification(registro_academico, senha, function(data) {
		res.status(200).json(data);
	});
});
_app.post('/notification/afternoon', function(req, res) {
	var registro_academico = req.body.registro_academico == null ? '' : req.body.registro_academico.trim();
	var senha = req.body.senha == null ? '' : req.body.senha.trim();

	Notification.afternoonNotification(registro_academico, senha, function(data) {
		res.status(200).json(data);
	});
});
_app.post('/notification/night', function(req, res) {
	var registro_academico = req.body.registro_academico == null ? '' : req.body.registro_academico.trim();
	var senha = req.body.senha == null ? '' : req.body.senha.trim();

	Notification.nightNotification(registro_academico, senha, function(data) {
		res.status(200).json(data);
	});
});
_app.post('/notification/daily', function(req, res) {
	var registro_academico = req.body.registro_academico == null ? '' : req.body.registro_academico.trim();
	var senha = req.body.senha == null ? '' : req.body.senha.trim();

	Notification.dailyNotification(registro_academico, senha, function(data) {
		res.status(200).json(data);
	});
});
_app.post('/notification/points', function(req, res) {
	var registro_academico = req.body.registro_academico == null ? '' : req.body.registro_academico.trim();
	var senha = req.body.senha == null ? '' : req.body.senha.trim();

	Notification.pointsNotification(registro_academico, senha, function(data) {
		res.status(200).json(data);
	});
});
_app.post('/notification/faults', function(req, res) {
	var registro_academico = req.body.registro_academico == null ? '' : req.body.registro_academico.trim();
	var senha = req.body.senha == null ? '' : req.body.senha.trim();

	Notification.faultsNotification(registro_academico, senha, function(data) {
		res.status(200).json(data);
	});
});

/*
* ERRORS
*/
_app.use(function(req, res, next) {
	res.status(404).json({
		'status' : 404,
		'date' : new Date(),
		'mensagem' : 'Esta página não foi encontrada'
	});
});

module.exports.app = _app;
angular.module('sinapp').factory('crawlerService', function($http) {
	var _attempt = function(registro_academico, senha) {
		return $http.post('/crawler/attempt/', {
			'registro_academico' : registro_academico,
			'senha' : senha
		});
	};

	var _logout = function() {
		return $http.get('/crawler/logout/');
	};

	var _points = function(registro_academico, senha) {
		return $http.post('/crawler/points/', {
			'registro_academico' : registro_academico,
			'senha' : senha
		});
	};

	var _schedules = function(registro_academico, senha) {
		return $http.post('/crawler/schedules/', {
			'registro_academico' : registro_academico,
			'senha' : senha
		});
	};

	return {
		attempt : _attempt,
		logout : _logout,
		points : _points,
		schedules : _schedules
	};
});
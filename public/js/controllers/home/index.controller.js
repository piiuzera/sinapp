angular.module('sinapp').controller('homeIndexController', function($scope, crawlerService) {
	if(localStorage.getItem("aluno") != null) {
		$scope.aluno = JSON.parse(localStorage.getItem("aluno"));
	}

	$scope.attempt = function() {
		delete $scope.error;

		crawlerService.attempt($scope.registro_academico, $scope.senha).then(function(obj) {
			$scope.aluno = obj.data.aluno;
			$scope.aluno.senha = $scope.senha;

			localStorage.setItem("aluno", JSON.stringify($scope.aluno));

			$('button').button('reset');
		}, function(ex) {
			$scope.error = ex.data;

			$('button').button('reset');
		});
	};

	$scope.logout = function() {
		delete $scope.error;
		delete $scope.notas;
		delete $scope.calendario_semanal;

		crawlerService.logout().then(function(obj) {
			delete $scope.aluno;

			localStorage.clear();

			$scope.success = obj.data;

			$('.nav li').removeClass('active');

			$('a[data-button=\'true\']').button('reset');
		}, function(ex) {
			$scope.error = ex.data;

			$('a[data-button=\'true\']').button('reset');
		});
	};

	$scope.points = function() {
		delete $scope.error;
		delete $scope.notas;
		delete $scope.calendario_semanal;

		crawlerService.points($scope.aluno.registro_academico, $scope.aluno.senha).then(function(obj) {
			$scope.aluno.notas = obj.data.notas;
			$scope.notas = obj.data.notas;

			$('#modalPoints').modal('show');

			$('a[data-button=\'true\']').button('reset');
		}, function(ex) {
			$scope.error = ex.data;

			$('a[data-button=\'true\']').button('reset');
		});
	};

	$scope.schedules = function() {
		delete $scope.error;
		delete $scope.notas;
		delete $scope.calendario_semanal;

		crawlerService.schedules($scope.aluno.registro_academico, $scope.aluno.senha).then(function(obj) {
			$scope.aluno.calendario_semanal = obj.data.calendario_semanal;
			$scope.calendario_semanal = obj.data.calendario_semanal;

			$('#modalSchedules').modal('show');

			$('a[data-button=\'true\']').button('reset');
		}, function(ex) {
			$scope.error = ex.data;

			$('a[data-button=\'true\']').button('reset');
		});
	};
});
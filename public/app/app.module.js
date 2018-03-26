angular.module('sinapp', ['ngRoute']);

angular.module('sinapp').config(['$locationProvider', function($locationProvider) {
	$locationProvider.hashPrefix('');
}]);

angular.module('sinapp').config(function($routeProvider) {
	$routeProvider

	.when('/', {
		templateUrl: 'views/home/index.view.html',
		title: 'Sinapp | Universidade FUMEC',
		controller:  'homeIndexController'
	})

	/*
	* OTHERS
	*/
	.otherwise({
		redirectTo: '/'
	});
});

angular.module('sinapp').run(['$rootScope', function($rootScope) {
    $rootScope.$on('$routeChangeSuccess', function(_, current) {
        document.title = current.$$route.title;
    });
}]);
var app = angular.module('miClaroApp',['ngRoute','ngFileSaver','MiClaroService']);

app.config(function($routeProvider,$sceDelegateProvider){
		
	$routeProvider.when('/', {
		templateUrl: 'angular/view/corporativo-corporativo-reportes.html', 
		controller: 'ConsultaReporteCorporativoController', 
		controllerAs: 'consultaReporteCorporativoCtr'}
	);
	$routeProvider.when('/errorWiew', {templateUrl: 'angular/view/error.html'});
	$routeProvider.when('/nuevoServicioView', { templateUrl: 'angular/view/nuevoServicio.html' });
	$routeProvider.otherwise({redirectTo: '/'});
});
 
angular.element(document).ready(function() {

    angular.bootstrap(document.getElementById("consultaReporteCorporativo"),['miClaroApp']);
});
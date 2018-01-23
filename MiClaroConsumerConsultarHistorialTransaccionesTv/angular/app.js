var app = angular.module('miClaroApp',['ngRoute','MiClaroService','ngFileSaver']);
app.config(function($routeProvider){
		
	$routeProvider.when('/', {templateUrl: 'angular/view/consumer-historial-transacciones.html', controller: 'ConsultarHistorialTransaccionesController',controllerAs: 'consultarHistorialTransaccionesCtr'});
	
	$routeProvider.when('/errorWiew', {templateUrl: 'angular/view/error.html'});
	$routeProvider.when('/errorGeneralWiew', {templateUrl: 'angular/view/errorGeneral.html'});
	$routeProvider.when('/nuevoServicioView', {templateUrl: 'angular/view/nuevoServicio.html'});
	
	$routeProvider.otherwise({redirectTo: '/'});
});

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("consultarHistorialTransaccionesTv"),['miClaroApp']);
});
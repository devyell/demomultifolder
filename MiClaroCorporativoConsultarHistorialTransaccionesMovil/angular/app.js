var app = angular.module('miClaroApp',['ngRoute','MiClaroService','ngFileSaver']);
app.config(function($routeProvider){
		
	$routeProvider.when('/', {templateUrl: 'angular/view/consumer-historial-transacciones.html', controller: 'ConsultarHistorialTransaccionesController',controllerAs: 'consultarHistorialTransaccionesCtr'});
	$routeProvider.when('/nuevoServicioView', {templateUrl: 'angular/view/nuevoServicio.html'});
	$routeProvider.when('/errorWiew', {templateUrl: 'angular/view/errorGeneral.html'});
	
	$routeProvider.otherwise({redirectTo: '/'});
	
});

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("consultarHistorialTransacciones"),['miClaroApp']);
});
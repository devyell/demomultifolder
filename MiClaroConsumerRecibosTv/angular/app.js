var app = angular.module('miClaroApp',['ngRoute','MiClaroService','ngFileSaver','ngStorage']);
app.config(function($routeProvider){
		
	$routeProvider.when('/', {templateUrl: 'angular/view/consumer-recibos.html', controller: 'RecibosTvController',controllerAs: 'recibosTvCtr'});
	$routeProvider.when('/confirmacionPagoView', {templateUrl: 'angular/view/confirmacion.html', controller: 'ConfirmacionPagoController',controllerAs: 'confirmacionPagoCtr'});
	$routeProvider.when('/confirmacionErrorPagoView', {templateUrl: 'angular/view/consumer-recibos-confirmacion-error.html', controller: 'ConfirmacionPagoController',controllerAs: 'confirmacionPagoCtr'});
	$routeProvider.when('/confirmacionErrorPagoPasarelaView', {templateUrl: 'angular/view/consumer-recibos-confirmacion-error-pasarela.html', controller: 'RecibosTvController',controllerAs: 'recibosTvCtr'});
	$routeProvider.when('/errorWiew', {templateUrl: 'angular/view/error.html'});
	$routeProvider.when('/errorGeneralWiew', {templateUrl: 'angular/view/errorGeneral.html'});
	$routeProvider.when('/nuevoServicioView', {templateUrl: 'angular/view/nuevoServicio.html'});
	$routeProvider.when('/usuarioPrepagoView', {templateUrl: 'angular/view/usuarioPrepago.html', controller: 'RecibosTvController',controllerAs: 'recibosTvCtr'});
	
	$routeProvider.otherwise({redirectTo: '/'});
	
});

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("recibosTv"),['miClaroApp']);
});
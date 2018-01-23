var app = angular.module('miClaroApp',['ngRoute','MiClaroService','ngStorage','ngFileSaver']);

app.config(function($routeProvider){
		
	$routeProvider.when('/', {templateUrl: 'angular/view/consumer-orden-servicio-tecnico.html', controller: 'ConsultasOrdenDeServicioTecnicoController',controllerAs: 'consultasOrdenDeServicioTecnicoCtr'});
	$routeProvider.when('/orderServicioTecnicoAprobadoWiew', {templateUrl: 'angular/view/consumer-orden-servicio-tecnico-aprobado.html', controller: 'DetalleConsultasOrdenDeServicioTecnicoController',controllerAs: 'detalleConsultasOrdenDeServicioTecnicoCtr'});
	$routeProvider.when('/orderServicioTecnicoEsperandoWiew', {templateUrl: 'angular/view/consumer-orden-servicio-tecnico-esperando.html', controller: 'DetalleConsultasOrdenDeServicioTecnicoController',controllerAs: 'detalleConsultasOrdenDeServicioTecnicoCtr'});
	$routeProvider.when('/orderServicioTecnicoRechazadoWiew', {templateUrl: 'angular/view/consumer-orden-servicio-tecnico-rechazado.html', controller: 'DetalleConsultasOrdenDeServicioTecnicoController',controllerAs: 'detalleConsultasOrdenDeServicioTecnicoCtr'});
	$routeProvider.when('/orderServicioTecnicoRecogerWiew', {templateUrl: 'angular/view/consumer-orden-servicio-tecnico-recoger.html', controller: 'DetalleConsultasOrdenDeServicioTecnicoController',controllerAs: 'detalleConsultasOrdenDeServicioTecnicoCtr'});
	$routeProvider.when('/orderServicioTecnicoVacioWiew', {templateUrl: 'angular/view/consumer-orden-servicio-tecnico-vacio.html', controller: 'ConsultasOrdenDeServicioTecnicoController',controllerAs: 'consultasOrdenDeServicioTecnicoCtr'});
	$routeProvider.when('/errorWiew', {templateUrl: 'angular/view/error.html'});
	$routeProvider.when('/errorGeneralWiew', {templateUrl: 'angular/view/errorGeneral.html'});
	$routeProvider.when('/nuevoServicioView', {templateUrl: 'angular/view/nuevoServicio.html'});
	$routeProvider.otherwise({redirectTo: '/'});
});

angular.element(document).ready(function() {

    angular.bootstrap(document.getElementById("consultasOrdenDeServicioTecnico"),['miClaroApp']);
});
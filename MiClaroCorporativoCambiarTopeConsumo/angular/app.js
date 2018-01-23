var app = angular.module('myapp',['ngRoute','ngStorage', 'miClaroController','miClaroControllerMasivo','miClaroControllerSimple','myservice']);





app.config(['$routeProvider', function($routeProvider){		
	$routeProvider.when('/', {templateUrl: 'angular/view/cambioTopeConsumo.html', controller: 'mycontroller'});	
	$routeProvider.when('/viewConfirmarMasivo', {templateUrl: 'angular/view/cambioTopeConsumoConfirmarMasivo.html', controller: 'confirmarMasivo'});	
	$routeProvider.when('/viewConfirmarSimple', {templateUrl: 'angular/view/cambioTopeConsumoConfirmarSimple.html', controller: 'confirmarSimple'});	
	
}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("myid"),['myapp']);
}); 
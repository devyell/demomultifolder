var miClaroApp = angular.module('miClaroApp',['ngRoute','miClaroController','miClaroServices','imageupload']);


  
miClaroApp.config(function($routeProvider){		
	
	$routeProvider.when('/cuenta', {templateUrl: 'angular/view/tu-cuenta.html', controller: 'ControllerTuCuenta'});
	$routeProvider.when('/terminos', {templateUrl: 'angular/view/pop.terminos-condiciones.html', controller: 'ControllerTerminos'});		
	$routeProvider.otherwise({redirectTo: '/cuenta'});
			
});


 

angular.element(document).ready(function() {

   
  angular.bootstrap(document.getElementById("idMiClaroApp"),['miClaroApp']);
});


var miClaroApp = angular.module('miClaroApp',['ngRoute','miClaroController','miClaroServices']);



  
miClaroApp.config(function($routeProvider){		
	$routeProvider.when('/configuracion', {templateUrl: 'angular/view/tu-configuracion.html', controller: 'ConfiguracionController'});
	$routeProvider.otherwise({redirectTo: '/configuracion'});
  
		
});
  


angular.element(document).ready(function() {
   
  angular.bootstrap(document.getElementById("idMiClaroAppConfiguracion"),['miClaroApp']);
});


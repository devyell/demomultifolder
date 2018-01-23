var miClaroApp = angular.module('miClaroApp',['ngRoute','miClaroServices','miClaroServicesSesion','ngFileSaver']);



miClaroApp.config(function($routeProvider){
        $routeProvider.when('/', {templateUrl: 'angular/view/detalle-consumo.html', controller: 'ControllerDetalleConsumosMovil', controllerAs:'miClaroDetConsMovilCtr'});
	 	
 });
  
angular.element(document).ready(function() {
  angular.bootstrap(document.getElementById("idMiClaroApp"),['miClaroApp']);
});

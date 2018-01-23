var miClaroApp = angular.module('miClaroApp',['ngRoute','miClaroServices','miClaroServicesSesion']);





miClaroApp.config(function($routeProvider){
        $routeProvider.when('/', {templateUrl: 'angular/view/envio-sms.html', controller: 'ControllerEnvioSMS', controllerAs:'miClaroEnvioSMSCtr'});
	 	
	 	
 });
  
angular.element(document).ready(function() {
  angular.bootstrap(document.getElementById("idMiClaroApp"),['miClaroApp']);
});

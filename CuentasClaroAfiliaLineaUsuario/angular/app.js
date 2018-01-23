var miClaroAppV1 = angular.module('miClaroAppV1',['ngRoute','miClaroControllerV1','miClaroController2','miClaroServicesV1']);


miClaroAppV1.config(['$routeProvider','$locationProvider', function($routeProvider,$locationProvider){
			
	$routeProvider.when('/', {templateUrl: 'angular/view/all-afilia-usuario.html', controller: 'AfiliaUsuarioController'});
	$routeProvider.when('/AfiliaUsuarioOk', {templateUrl: 'angular/view/all-afilia-usuario-ok.html', controller: 'AfiliaUsuarioOkController'});
	$routeProvider.when('/AfiliaUsuarioTern', {templateUrl: 'angular/view/all-afilia-usuario-term.html'});
      
  }]);
  
 

angular.element(document).ready(function() {
   
    angular.bootstrap(document.getElementById("idMiClaroAppAfilia"),['miClaroAppV1']);
});

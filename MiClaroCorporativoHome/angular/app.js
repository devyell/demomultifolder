var miClaroApp = angular.module('miClaroApp',['ngRoute','MiClaroController' ,'MiClaroService']);


miClaroApp.config(['$routeProvider', function($routeProvider){
		
        $routeProvider.when('/', {templateUrl: 'angular/view/miclaroCorporativoHome.html', controller: 'MiClaroHomeController'});		
        
  }]);

angular.element(document).ready(function() {

    angular.bootstrap(document.getElementById("MiClaroCorporativoHome"),['miClaroApp']);
}); 
var miClaroApp = angular.module('miClaroApp',['ngRoute', 'MiClaroService']);


miClaroApp.config(['$routeProvider', function($routeProvider){
		
        $routeProvider.when('/', {templateUrl: 'angular/view/miclaroCorporativoMovil.html', controller: 'MiClaroHomeMovilController',controllerAs: 'miClaroHomeCtr'});		
        
  }]);

angular.element(document).ready(function() {

    angular.bootstrap(document.getElementById("miClaroHomeMovil"),['miClaroApp']);
}); 
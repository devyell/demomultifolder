var miClaroApp = angular.module('miClaroApp',['ngRoute','MiClaroController' ,'MiClaroService']);


miClaroApp.config(['$routeProvider', function($routeProvider){
		
        $routeProvider.when('/', {templateUrl: 'angular/view/MiClaroCorporativoHomeDetalleConsumo.html', controller: 'MiClaroHomeController'});		
        
  }]);

angular.element(document).ready(function() {

    angular.bootstrap(document.getElementById("MiClaroCorporativoHomeDetalleConsumo"),['miClaroApp']);
}); 
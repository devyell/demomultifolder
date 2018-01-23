var miClaroApp = angular.module('miClaroApp',['ngRoute', 'MiClaroService','ngFileSaver']);


miClaroApp.config(['$routeProvider', function($routeProvider){
		
        $routeProvider.when('/', {templateUrl: 'angular/view/miclaroConsumerDetalleConsumosFijo.html', controller: 'MiClaroHomeController',controllerAs: 'miClaroHomeCtr'});		
        
  }]);

angular.element(document).ready(function() {

    angular.bootstrap(document.getElementById("miClaroConsumerDetalleConsumosFijo"),['miClaroApp']);
}); 
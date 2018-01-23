var miClaroApp = angular.module('miClaroApp',['ngRoute', 'MiClaroService']);


miClaroApp.config(['$routeProvider', function($routeProvider){
		
        $routeProvider.when('/', {templateUrl: 'angular/view/miclaroConsumerSaldosConsumosMovil.html', controller: 'MiClaroHomeController',controllerAs: 'miClaroHomeCtr'});		
        
  }]);

angular.element(document).ready(function() {

    angular.bootstrap(document.getElementById("miClaroConsumerSaldosConsumosFijo"),['miClaroApp']);
}); 
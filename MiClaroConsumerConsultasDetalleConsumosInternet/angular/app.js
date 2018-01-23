var miClaroApp = angular.module('miClaroApp',['ngRoute']);


miClaroApp.config(['$routeProvider', function($routeProvider){
		
        $routeProvider.when('/', {templateUrl: 'angular/view/miclaroConsumerDetalleConsumosInternet.html', controller: 'MiClaroHomeController',controllerAs: 'miClaroHomeCtr'});		
        
  }]);

angular.element(document).ready(function() {

    angular.bootstrap(document.getElementById("miclaroConsumerDetalleConsumosInternet"),['miClaroApp']);
}); 
var miClaroApp = angular.module('miClaroApp',['ngRoute','MiClaroService']);


miClaroApp.config(['$routeProvider', function($routeProvider){
		
        $routeProvider.when('/', {templateUrl: 'angular/view/miclaroConsumerHome.html', controller: 'MiClaroHomeController'});		
        
  }]);

angular.element(document).ready(function() {

    angular.bootstrap(document.getElementById("MiClaroConsumerHome"),['miClaroApp']);
}); 
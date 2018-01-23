var miClaroApp = angular.module('miClaroApp', ['ngRoute', 'MiClaroService']);


miClaroApp.config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/', { 
    	templateUrl: 'angular/view/appView.html', 
    	controller: 'appController', 
    	controllerAs: 'appCtr' });

}]);

angular.element(document).ready(function() {

    angular.bootstrap(document.getElementById("miClaroView"), ['miClaroApp']);
});
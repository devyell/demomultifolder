var app = angular.module('myapp',['ngRoute','ngStorage', 'miClaroController', 'ngFileSaver', 'myservice']);

app.config(['$routeProvider', function($routeProvider){		
	$routeProvider.when('/', {templateUrl: 'angular/view/tus-aprobaciones.html', controller: 'mycontroller'});	
		
}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("myid"),['myapp']);
});

var app = angular.module('myapp',['ngRoute','ngStorage', 'miClaroController','myservice']);


app.config(['$routeProvider', function($routeProvider){			
	$routeProvider.when('/', {templateUrl: 'angular/view/SolicitudesLinea.html', controller: 'mycontroller',controllerAs: 'miClaroSolicitudCtr'});
		
			
}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("myid"),['myapp']);
}); 
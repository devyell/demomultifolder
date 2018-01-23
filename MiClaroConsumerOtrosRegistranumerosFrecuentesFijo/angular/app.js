var app = angular.module('myapp',['ngRoute','ngStorage', 'miClaroController','myservice']);




app.config(function($routeProvider){		
	$routeProvider.when('/', {templateUrl: 'angular/view/MiClaroConsumerOtrosRegistraNumerosFrecuentesFijo.html', controller: 'mycontroller'});
	$routeProvider.otherwise({redirectTo: '/'});
    	
		
});

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("myid"),['myapp']);
}); 

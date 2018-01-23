var app = angular.module('miClaroApp',['ngRoute','miClaroController','miClaroServices']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/',{
		templateUrl : 'angular/view/consumercorporativo-servicio-principal.html',
		controller : 'miClaroCtr',
		controllerAs: 'myCtrServPrincipal'
	});
}]);
angular.element(document).ready(function() {
angular.bootstrap(document.getElementById("configuracionServicioPrincipal"),['miClaroApp']);
});
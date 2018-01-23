var app = angular.module('myapp',['ngRoute', 'myservice']);

app.config(['$routeProvider', function($routeProvider){		
	$routeProvider.when('/', {templateUrl: 'angular/view/appView.html', controller: 'mycontroller', controllerAs: 'myCtr'});		        
}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("myid"),['myapp']);
});
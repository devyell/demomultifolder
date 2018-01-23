var app = angular.module('miClaroCambioPlan',['ngRoute','ctrlCambioPlanConsumer','serviceCambioPlanConsumer']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/',{
		templateUrl : 'angular/view/corporativo-residencial-cambiar-plan-movil.html',
		controller : 'ctrlCambioPlanMovil',
		controllerAs: 'asCtrlCambioPlanMovil'
	});
}]);

angular.element(document).ready(function() {
angular.bootstrap(document.getElementById("idMiClaroCambioPlanMovil"),['miClaroCambioPlan']);
});
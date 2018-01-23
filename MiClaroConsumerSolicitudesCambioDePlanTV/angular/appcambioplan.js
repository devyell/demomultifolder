var app = angular.module('miClaroCambioPlan',['ngRoute','ctrlCambioPlanConsumer','serviceCambioPlanConsumer']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/',{
		templateUrl : 'angular/view/corporativo-residencial-cambiar-plan-tv.html',
		controller : 'ctrlCambioPlanTv',
		controllerAs: 'asCtrlCambioPlanTv'
	});
}]);

angular.element(document).ready(function() {
angular.bootstrap(document.getElementById("idMiClaroCambioPlanTv"),['miClaroCambioPlan']);
});
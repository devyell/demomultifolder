var app = angular.module('miClaroCambioPlan',['ngRoute','ctrlCambioPlanConsumer','serviceCambioPlanConsumer']);

app.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/',{
		templateUrl : 'angular/view/corporativo-residencial-cambiar-plan-fijo.html',
		controller : 'ctrlCambioPlanFijo',
		controllerAs: 'asCtrlCambioPlanFijo'
	});
}]);

angular.element(document).ready(function() {
angular.bootstrap(document.getElementById("idMiClaroCambioPlanFijo"),['miClaroCambioPlan']);
});
var app = angular.module('miClaroCambioPlanCorporativo', ['ngRoute', 'ctrlCambioPlanCorporativo', 'serviceCambioPlanCorporativo']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-corporativo-cambiar-plan-internet.html',
        controller: 'ctrlCambioPlanInternet',
        controllerAs: 'asCtrlCambioPlanInternet'
    });
}]);
angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idMiClaroCambioPlanCorporativoInternet"), ['miClaroCambioPlanCorporativo']);
});

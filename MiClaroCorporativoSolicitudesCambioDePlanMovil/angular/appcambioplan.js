var app = angular.module('miClaroCambioPlanCorporativo', ['ngRoute', 'ctrlCambioPlanCorporativo', 'serviceCambioPlanCorporativo']);
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-corporativo-cambiar-plan-movil.html',
        controller: 'ctrlCambioPlanMovil',
        controllerAs: 'asCtrlCambioPlanMovil'
    });
}]);
angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idMiClaroCambioPlanCorporativoMovil"), ['miClaroCambioPlanCorporativo']);
});

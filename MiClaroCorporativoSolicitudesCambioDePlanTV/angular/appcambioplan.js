var app = angular.module('miClaroCambioPlanCorporativo', ['ngRoute', 'ctrlCambioPlanCorporativo', 'serviceCambioPlanCorporativo']);
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-corporativo-cambiar-plan-tv.html',
        controller: 'ctrlCambioPlanTv',
        controllerAs: 'asCtrlCambioPlanTv'
    });
}]);
angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idMiClaroCambioPlanCorporativoTv"), ['miClaroCambioPlanCorporativo']);
});

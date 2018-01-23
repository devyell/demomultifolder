var app = angular.module('miClaroCambioPlanCorporativo', ['ngRoute', 'ctrlCambioPlanCorporativo', 'serviceCambioPlanCorporativo']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-corporativo-cambiar-plan-fijo.html',
        controller: 'ctrlCambioPlanFijo',
        controllerAs: 'asCtrlCambioPlanFijo'
    });
}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idMiClaroCambioPlanCorporativoFijo"), ['miClaroCambioPlanCorporativo']);
});

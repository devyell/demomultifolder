var app = angular.module('miClaroCambioPlan', ['ngRoute', 'ctrlCambioPlanConsumer', 'serviceCambioPlanConsumer']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-residencial-cambiar-plan-internet.html',
        controller: 'ctrlCambioPlanInternet',
        controllerAs: 'asCtrlCambioPlanInternet'
    });
}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idMiClaroCambioPlanInternet"), ['miClaroCambioPlan']);
});

var app = angular.module('miClaroNuevoServicioCorporativo', ['ngRoute', 'ctrlNuevoServicioCorporativo', 'serviceNuevoServicioCorporativo']);
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-corporativo-nuevo-servicio-internet.html',
        controller: 'ctrlNuevoServicioInternet',
        controllerAs: 'asCtrlNuevoServicioInternet'
    });
}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idMiClaroNuevoServicioCorporativoInternet"), ['miClaroNuevoServicioCorporativo']);
});

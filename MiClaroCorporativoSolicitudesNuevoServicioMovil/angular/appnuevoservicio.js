var app = angular.module('miClaroNuevoServicioCorporativo', ['ngRoute', 'ctrlNuevoServicioCorporativo', 'serviceNuevoServicioCorporativo']);
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-corporativo-nuevo-servicio-movil.html',
        controller: 'ctrlNuevoServicioMovil',
        controllerAs: 'asCtrlNuevoServicioMovil'
    });
}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idMiClaroNuevoServicioCorporativoMovil"), ['miClaroNuevoServicioCorporativo']);
});

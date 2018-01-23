var app = angular.module('miClaroNuevoServicioCorporativo', ['ngRoute', 'ctrlNuevoServicioCorporativo', 'serviceNuevoServicioCorporativo']);
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-corporativo-nuevo-servicio-tv.html',
        controller: 'ctrlNuevoServicioTv',
        controllerAs: 'asCtrlNuevoServicioTv'
    });
}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idMiClaroNuevoServicioCorporativoTv"), ['miClaroNuevoServicioCorporativo']);
});

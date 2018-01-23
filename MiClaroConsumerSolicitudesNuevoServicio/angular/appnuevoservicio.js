var app = angular.module('miClaroNuevoServicio', ['ngRoute', 'ctrlNuevoServicioConsumer', 'serviceNuevoServicioConsumer']);

app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-residencial-nuevo-servicio.html',
        controller: 'ctrlNuevoServicio',
        controllerAs: 'asCtrlNuevoServicio'
    });
}]);
angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idMiClaroNuevoServicio"), ['miClaroNuevoServicio']);
});

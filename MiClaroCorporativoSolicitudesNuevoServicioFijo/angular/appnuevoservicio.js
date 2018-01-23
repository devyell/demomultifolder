var app = angular.module('miClaroNuevoServicioCorporativo', ['ngRoute', 'ctrlNuevoServicioCorporativo', 'serviceNuevoServicioCorporativo']);
app.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-corporativo-nuevo-servicio-fijo.html',
        controller: 'ctrlNuevoServicioFijo',
        controllerAs: 'asCtrlNuevoServicioFijo'
    });

}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idMiClaroNuevoServicioCorporativoFijo"), ['miClaroNuevoServicioCorporativo']);
});

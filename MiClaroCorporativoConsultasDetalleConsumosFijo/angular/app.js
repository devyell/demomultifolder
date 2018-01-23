var appsaldosyconsumos = angular.module('miClaroSaldosConsumosFijo', ['ngRoute','controllerDetalleConsumosFijo','servicesDetalleConsumosFijo','ngFileSaver']);

appsaldosyconsumos.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-corporativo-detalle-consumos-Fijo.html',
        controller: 'ctrlSaldosyConsumosFijo',
        controllerAs: 'asCtrlSaldosyConsumosFijo'
    });

}]);
angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idSaldosyConsumosFijo"), ['miClaroSaldosConsumosFijo']);
});

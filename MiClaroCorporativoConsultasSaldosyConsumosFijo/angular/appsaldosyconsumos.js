var appsaldosyconsumos = angular.module('miClaroSaldosConsumosFijo', ['ngRoute','controllerSaldosyConsumosFijo','servicesSaldosyConsumosFijo']);

appsaldosyconsumos.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-corporativo-saldos-consumos-Fijo.html',
        controller: 'ctrlSaldosyConsumosFijo',
        controllerAs: 'asCtrlSaldosyConsumosFijo'
    });

}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idSaldosyConsumosFijo"), ['miClaroSaldosConsumosFijo']);
});

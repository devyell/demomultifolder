var appsaldosyconsumos = angular.module('miClaroSaldosConsumos', ['ngRoute', 'controllerSaldosyConsumos', 'servicesSaldosyConsumos']);

appsaldosyconsumos.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-corporativo-saldos-consumos.html',
        controller: 'ctrlSaldosyConsumos',
        controllerAs: 'asCtrlSaldosyConsumos'
    });

}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idSaldosyConsumos"), ['miClaroSaldosConsumos']);
});

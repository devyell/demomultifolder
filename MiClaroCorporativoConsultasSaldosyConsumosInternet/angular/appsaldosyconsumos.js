var appsaldosyconsumos = angular.module('miClaroSaldosConsumosInternet', ['ngRoute','controllerSaldosyConsumosInternet','servicesSaldosyConsumosInternet']);

appsaldosyconsumos.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-corporativo-saldos-consumos-internet.html',
        controller: 'ctrlSaldosyConsumosInternet',
        controllerAs: 'asCtrlSaldosyConsumosInternet'
    });

}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idSaldosyConsumosInternet"), ['miClaroSaldosConsumosInternet']);
});

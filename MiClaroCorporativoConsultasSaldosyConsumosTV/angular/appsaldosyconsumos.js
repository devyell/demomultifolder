var appsaldosyconsumos = angular.module('miClaroSaldosConsumosTV', ['ngRoute','controllerSaldosyConsumosTV','servicesSaldosyConsumosTV']);

appsaldosyconsumos.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-corporativo-saldos-consumos-tv.html',
        controller: 'ctrlSaldosyConsumosTV',
        controllerAs: 'asCtrlSaldosyConsumosTV'
    });

}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idSaldosyConsumosTV"), ['miClaroSaldosConsumosTV']);
});

var appsaldosyconsumos = angular.module('miClaroDirectorioTelfTv', ['ngRoute','ctrlDirectorioTelefonicoCorpoTv','servicesDirectorioTelefonicoCorpoTv']);

appsaldosyconsumos.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-corporativo-directorio-telefonico-tv.html',
        controller: 'ctrlDirectorioTelfTv',
        controllerAs: 'asCtrlDirectorioTelfTv'
    });

}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idmiClaroDirectorioTelfTv"), ['miClaroDirectorioTelfTv']);
});

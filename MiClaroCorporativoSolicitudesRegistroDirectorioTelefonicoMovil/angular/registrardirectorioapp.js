var appsaldosyconsumos = angular.module('miClaroDirectorioTelefonicoCorpoMovil', ['ngRoute', 'ctrlDirectorioTelefonicoCorpoMovil', 'servicesDirectorioTelefonicoCorpoMovil']);

appsaldosyconsumos.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-corporativo-directorio-telefonico-movil.html',
        controller: 'ctrlDirectorioCorpoMovil',
        controllerAs: 'asCtrlDirectorioCorpoMovil'
    });

}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idDirectorioTelefonicoCorpoMovil"), ['miClaroDirectorioTelefonicoCorpoMovil']);
});

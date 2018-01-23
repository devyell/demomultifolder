var appsaldosyconsumos = angular.module('miClaroDirectorioTelefonicoCorpoFijo', ['ngRoute', 'ctrlDirectorioTelefonicoCorpoFijo', 'servicesDirectorioTelefonicoCorpoFijo']);

appsaldosyconsumos.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-corporativo-directorio-telefonico-fijo.html',
        controller: 'ctrlDirectorioCorpoFijo',
        controllerAs: 'asCtrlDirectorioCorpoFijo'
    });

}]);


angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idDirectorioTelefonicoCorpoFijo"), ['miClaroDirectorioTelefonicoCorpoFijo']);
});

var appsaldosyconsumos = angular.module('miClaroRegistrarDirectorioFijo', ['ngRoute','controllerRegistrarDirectorioFijo','servicesRegistrarDirectorioFijo']);

appsaldosyconsumos.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-residencial-directorio-telefonico-fijo.html',
        controller: 'ctrlRegistrarDirectorioFijo',
        controllerAs: 'asCtrlRegistrarDirectorioFijo'
    });

}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idRegistrarDirectorioFijo"), ['miClaroRegistrarDirectorioFijo']);
});

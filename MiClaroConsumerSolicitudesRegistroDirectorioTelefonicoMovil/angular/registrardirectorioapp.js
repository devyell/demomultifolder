var appsaldosyconsumos = angular.module('miClaroRegistrarDirectorioMovil', ['ngRoute','controllerRegistrarDirectorioMovil','servicesRegistrarDirectorioMovil']);

appsaldosyconsumos.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-residencial-directorio-telefonico-movil.html',
        controller: 'ctrlRegistrarDirectorioMovil',
        controllerAs: 'asCtrlRegistrarDirectorioMovil'
    });

}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idRegistrarDirectorioMovil"), ['miClaroRegistrarDirectorioMovil']);
});

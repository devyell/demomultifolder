var appsaldosyconsumos = angular.module('miClaroDirectorioTelfInternet', ['ngRoute','ctrlDirectorioTelefonicoConsumerInternet','servicesDirectorioTelefonicoConsumerInternet']);

appsaldosyconsumos.config(['$routeProvider', function($routeProvider) {
    $routeProvider.when('/', {
        templateUrl: 'angular/view/corporativo-residencial-directorio-telefonico-internet.html',
        controller: 'ctrlDirectorioTelfInternet',
        controllerAs: 'asCtrlDirectorioTelfInternet'
    });

}]);

angular.element(document).ready(function() {
    angular.bootstrap(document.getElementById("idmiClaroDirectorioTelfInternet"), ['miClaroDirectorioTelfInternet']);
});

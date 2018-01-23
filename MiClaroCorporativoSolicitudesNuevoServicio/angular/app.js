var miClaroApp = angular.module('miClaroCorporativoNuevoServicio', ['ngRoute', 'ctrlNuevoServicioCorporativoHome', 'serviceNuevoServicioCorporativoHome']);


miClaroApp.config(['$routeProvider', function($routeProvider) {

    $routeProvider.when('/', { templateUrl: 'angular/view/miclaroConsumerHome.html', controller: 'ctrlNuevoServicioHome' });

}]);

angular.element(document).ready(function() {

    angular.bootstrap(document.getElementById("MiClaroConsumerHome"), ['miClaroCorporativoNuevoServicio']);
});

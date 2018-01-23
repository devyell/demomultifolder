var servicesaldosyconsumos = angular.module('servicesSaldosyConsumosInternet', []);
servicesaldosyconsumos.service('servSaldosyConsumosInternet', ['$http', function($http) {
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };

    var UrlObtenerdatosSession = urlComunUsuario.obtenerDatosUsuarioSesion;

    this.obtenerDatosUsuarioSesion = function() {
        return $http.get(UrlObtenerdatosSession);
    }

}]);

var moduleService = angular.module('myservice', []);

moduleService.service('modService', function($http) {

    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    this.getObtenerDatosSesion = function() {
        return $http.post(urlComunUsuario.obtenerDatosSesion);
    };

});

var serviceDirectorioTelefonico = angular.module('servicesRegistrarDirectorioMovil', []);
serviceDirectorioTelefonico.service('servRegistrarDirectorioMovil', ['$http', function($http) {
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };

    var UrlObtenerDatosUsuario = urlComunUsuario.obtenerDatosUsuarioSesion;
    var UrlObtenerDirectorioTelefonico = comprasyRecargasUrl.obtenerDirectorioTelefonico;
    var UrlModificarAfiliacionDirectorioTelefonico = comprasyRecargasUrl.modificarAfiliacionDirectorioTelefonico;
    var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;

    this.obtenerDatosUsuario = function() {
        return $http.get(UrlObtenerDatosUsuario);
    }

    this.obtenerDirectorioTelefonico = function(data) {
        return $http.post(UrlObtenerDirectorioTelefonico, data);
    }

    this.modificarAfiliacionDirectorioTelefonico = function(request) {
        return $http.post(UrlModificarAfiliacionDirectorioTelefonico, request);
    }

    this.guardarAuditoria = function(audi) {
        return $http.post(urlEnviarAuditoria, audi);
    }

}]);

var servicesaldosyconsumos = angular.module('servicesRegistrarDirectorioFijo', []);
servicesaldosyconsumos.service('servRegistrarDirectorioFijo', ['$http', function($http) {
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };


    var urlObtenerDatosUsuario = urlComunUsuario.obtenerDatosUsuarioSesion;
    var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;
    var urlObtenerDirectorioTelefonico = comprasyRecargasUrl.obtenerDirectorioTelefonico;
    var urlModificarAfiliacionDirectorioTelefonico = comprasyRecargasUrl.modificarAfiliacionDirectorioTelefonico;
    

    this.obtenerDatosUsuario = function() {
        return $http.get(urlObtenerDatosUsuario);
    }

    this.obtenerDirectorioTelefonico = function(data) {
        return $http.post(urlObtenerDirectorioTelefonico, data);
    }

    this.modificarAfiliacionDirectorioTelefonico = function(request) {
        return $http.post(urlModificarAfiliacionDirectorioTelefonico, request);
    }

    this.guardarAuditoria = function(audi) {
        return $http.post(urlEnviarAuditoria, audi);
    }
    
}]);

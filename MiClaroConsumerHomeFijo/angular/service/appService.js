var appServices = angular.module('MiClaroService', []);

appServices.service('serviciosHome', function($http) {

    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var UrlObtenerFlagProductoFijo = urlComunUsuario.obtenerDatosUsuarioSesion;
    var UrlObtenerDatosSesion = urlComunUsuario.obtenerDatosSesion;
    var actualizarProductoPrincipalWSUrl = urlComunUsuario.actualizarProductoPrincipal;
    var obtenerServiciosWSUrl = urlServicios.obtenerServicios;
    var obtenerEstadoServicioWSURL = urlServicios.obtenerEstadoServicio;
    var obtenerConsumoGeneralFijaWSURL = urlConsumosGenerales.obtenerConsumoGeneralFija;
    var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;

    this.enviarAuditoria = function(request) {
        return $http.post(urlEnviarAuditoria, request);
    };
    this.getObtenerFlagProductoFijo = function() {
        return $http.post(UrlObtenerFlagProductoFijo);
    };
    this.getObtenerDatosSesion = function() {
        return $http.post(UrlObtenerDatosSesion);
    };
    this.actualizarProductoPrincipalSesion = function(request) {
        return $http.post(actualizarProductoPrincipalWSUrl, request);
    };
    this.getObtenerServiciosWS = function(request) {
        return $http.post(obtenerServiciosWSUrl, request);
    };
    this.getObtenerEstadoServicioWS = function(request) {
        return $http.post(obtenerEstadoServicioWSURL, request);
    };
    this.getObtenerConsumoGeneralFijaWS = function(request) {
        return $http.post(obtenerConsumoGeneralFijaWSURL, request);
    };
});

var appServices = angular.module('MiClaroService', []);

appServices.service('serviceHomeMoviles', function($http) {

    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var UrlObtenerFlagProductoTV = urlComunUsuario.obtenerDatosUsuarioSesion;
    var UrlObtenerServicioPrincipal = urlComunUsuario.obtenerDatosSesion;
    var UrlObtenerListadoFijoDireccion = urlMiclaroHome.obtenerListadoFijoDireccion;
    var obtenerServiciosWSUrl = urlServicios.obtenerServicios;
    var solicitarDecosAdicionalesTv = comprasyRecargasUrl.solicitarDecosAdicionalesTV;
    var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;
    var obtenerDecosAdicionalesTv = comprasyRecargasUrl.obtenerDecosAdicionalesTV;
    var actualizarProductoPrincipalWSUrl = urlComunUsuario.actualizarProductoPrincipal;

    this.enviarAuditoria = function(request) {
        return $http.post(urlEnviarAuditoria, request);
    };
    this.getObtenerFlagProductoTV = function() {
        return $http.post(UrlObtenerFlagProductoTV);
    };
    this.getObtenerServicioPrincipal = function() {
        return $http.post(UrlObtenerServicioPrincipal);
    };
    this.getObtenerListadoFijoDireccionWS = function(request) {
        return $http.post(UrlObtenerListadoFijoDireccion, request);
    };
    this.getObtenerServiciosWS = function(request) {
        return $http.post(obtenerServiciosWSUrl, request);
    };
    this.getDirecciones = function(request) {
        return $http.post(obtenerDirecciones, request);
    };
    this.obtenerListaTvDecosAdicionales = function(request) {
        return $http.post(obtenerDecosAdicionalesTv, request);
    };
    this.solicitarDecosAdicionales = function(request) {
        return $http.post(solicitarDecosAdicionalesTv, request);
    };
    this.actualizarProductoPrincipalSesion = function(request) {
        return $http.post(actualizarProductoPrincipalWSUrl, request);
    };

});

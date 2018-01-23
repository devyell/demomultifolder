var appServices = angular.module('MiClaroService', []);

appServices.service('serviceHomeMoviles', function($http) {

    console.log("appService!");

    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var UrlObtenerFlagProductoMovil = urlComunUsuario.obtenerDatosUsuarioSesion;
    var UrlObtenerServicioPrincipal = urlComunUsuario.obtenerDatosSesion;
    var obtenerServiciosWSUrl = urlServicios.obtenerServicios;
    // var obtenerDirecciones = urlServicios.obtenerDatosAdicionalesServicioFijo;
    // var obtenerDecosAdicionalesTv = comprasyRecargasUrl.obtenerDecosAdicionalesTV;
    // var solicitarDecosAdicionalesTv = comprasyRecargasUrl.solicitarDecosAdicionalesTV;
    var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;
    var actualizarProductoPrincipalWSUrl = urlComunUsuario.actualizarProductoPrincipal;

    this.enviarAuditoria = function(request) {
        return $http.post(urlEnviarAuditoria, request);
    };
    this.getObtenerFlagProductoTV = function() {
        return $http.post(UrlObtenerFlagProductoMovil);
    };
    this.getObtenerServicioPrincipal = function() {
        return $http.post(UrlObtenerServicioPrincipal);
    };
    this.getObtenerServiciosWS = function(request) {
        return $http.post(obtenerServiciosWSUrl, request);
    };
    // this.getDirecciones = function(request) {
    //     return $http.post(obtenerDirecciones, request);
    // };
    // this.obtenerListaTvDecosAdicionales = function(request) {
    //     return $http.post(obtenerDecosAdicionalesTv, request);
    // };
    // this.solicitarDecosAdicionales = function(request) {
    //     return $http.post(solicitarDecosAdicionalesTv, request);
    // };
    this.actualizarProductoPrincipalSesion = function(request) {
        return $http.post(actualizarProductoPrincipalWSUrl, request);
    };
});

var appServices = angular.module('MiClaroService', []);

appServices.service('ServiciosFijaService', function($http) {

    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var UrlObtenerFlagProductoFijo = urlComunUsuario.obtenerDatosUsuarioSesion;
    var UrlObtenerDatosSesion = urlComunUsuario.obtenerDatosSesion;
    var obtenerServiciosWSUrl = urlServicios.obtenerServicios;
    var obtenerDatosAdicionalesServicioFijoWSUrl = urlServicios.obtenerDatosAdicionalesServicioFijo;
    var obtenerPeriodosFacturacionWSUrl = urlServicios.obtenerPeriodosFacturacion;
    var obtenerConsumoGeneralFijaWSUrl = urlConsumosGenerales.obtenerConsumoGeneralFija
    var actualizarProductoPrincipalWSUrl = urlComunUsuario.actualizarProductoPrincipal;
    var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;

    this.getObtenerFlagProductoFijo = function() {
        return $http.post(UrlObtenerFlagProductoFijo);
    };
    this.getObtenerDatosSesion = function() {
        return $http.post(UrlObtenerDatosSesion);
    };
    this.getObtenerServiciosWS = function(request) {
        return $http.post(obtenerServiciosWSUrl, request);
    };
    this.getObtenerDatosAdicionalesFijoWS = function(request) {
        return $http.post(obtenerDatosAdicionalesServicioFijoWSUrl, request);
    };
    this.getObtenerPeriodosFacturacionWS = function(request) {
        return $http.post(obtenerPeriodosFacturacionWSUrl, request);
    };
    this.getObtenerConsumoGeneralFijaWS = function(request) {
        return $http.post(obtenerConsumoGeneralFijaWSUrl, request);
    };
    this.actualizarProductoPrincipalSesion = function(request){
        return $http.post(actualizarProductoPrincipalWSUrl, request);
    };
    this.enviarAuditoria = function(request) {
        return $http.post(urlEnviarAuditoria, request);
    };
});

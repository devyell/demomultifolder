var appServices = angular.module('MiClaroService', []);

appServices.service('ServiciosFijaService', function($http) {

    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var UrlObtenerFlagProductoMovil = urlComunUsuario.obtenerDatosUsuarioSesion;
    var UrlObtenerDatosSesion = urlComunUsuario.obtenerDatosSesion;
    var obtenerServiciosWSUrl = urlServicios.obtenerServicios;
    var obtenerDatosAdicionalesServicioMovilWSUrl = urlServicios.obtenerDatosAdicionalesServicioMovil;
    var obtenerConsumoGeneralMovilWSUrl = urlConsumosGenerales.obtenerConsumoGeneralMovil;
    var actualizarProductoPrincipalWSUrl = urlComunUsuario.actualizarProductoPrincipal;
    var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;
    
    this.getObtenerFlagProductoMovil = function() {
        return $http.post(UrlObtenerFlagProductoMovil);
    };
    this.getObtenerDatosSesion = function() {
        return $http.post(UrlObtenerDatosSesion);
    };
    this.getObtenerServiciosWS = function(request) {
        return $http.post(obtenerServiciosWSUrl, request);
    };
    this.getObtenerDatosAdicionalesMovilWS = function(request) {
        return $http.post(obtenerDatosAdicionalesServicioMovilWSUrl, request);
    };
    this.getObtenerConsumosGeneralesMovilWS = function(request) {
        return $http.post(obtenerConsumoGeneralMovilWSUrl, request);
    };
    this.enviarAuditoria = function(request) {
        return $http.post(urlEnviarAuditoria, request);
    };
    this.actualizarProductoPrincipalSesion = function(request){
        return $http.post(actualizarProductoPrincipalWSUrl, request);
    };
});

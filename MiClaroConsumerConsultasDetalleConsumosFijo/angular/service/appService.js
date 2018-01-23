var appServices = angular.module('MiClaroService', []);

appServices.service('ServiciosFijaService', function($http) {

    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var UrlObtenerFlagProductoFijo = urlComunUsuario.obtenerFlagProductoFijoSesion;
    var UrlObtenerDatosSesion = urlComunUsuario.obtenerDatosUsuarioSesion; 
    var obtenerServiciosWSUrl = urlConsultasComun.obtenerServicios;
    var obtenerDatosAdicionalesServicioFijoWSUrl = urlConsultasComun.obtenerDatosAdicionalesServicioFijo;
    var obtenerPeriodosFacturacionWSUrl = urlConsultasComun.obtenerPeriodosFacturacion;
    var obtenerConsumoGeneralFijaWSUrl = urlConsultasComun.obtenerConsumoGeneralFija
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
	
	   this.obtenerLinesFijas = function(datafijas) {
        return $http.post(urlConsultasComun.obtenerLineasFijas, datafijas);
    }
	
    this.getObtenerPeriodosFacturacionWS = function(request) {
        return $http.post(obtenerPeriodosFacturacionWSUrl, request);
    };
  
    this.actualizarProductoPrincipalSesion = function(request){
        return $http.post(actualizarProductoPrincipalWSUrl, request);
    };
    this.enviarAuditoria = function(request) {
        return $http.post(urlEnviarAuditoria, request);
    };
	
	this.obtenerLlamadasFijo = function(dataAuto) {
        return $http.post(urlConsultasComun.obtenerLlamadasFijo, dataAuto);
    };
	
	this.obtenerReporteLlamadas = function(dataAuto) {
        return $http.post(urlConsultasComun.obtenerReporteLlamadas, dataAuto);
    };
	
	this.obtenerDatosAdicionalesServicioFijo = function(dataAuto) {
        return $http.post(urlConsultasComun.obtenerDatosAdicionalesServicioFijo, dataAuto);
    };
	
	
	
});

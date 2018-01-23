var appServices = angular.module('MiClaroService',[]);

appServices.service('serviciosHome', function($http){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	var UrlObtenerFlagProductoTV = urlComunUsuario.obtenerDatosUsuarioSesion;
	var UrlObtenerDatosSesion = urlComunUsuario.obtenerDatosSesion;
	var actualizarProductoPrincipalWSUrl = urlComunUsuario.actualizarProductoPrincipal;
	var obtenerServiciosWSUrl = urlServicios.obtenerServicios;
	var obtenerEstadoServicioWSUrl = urlServicios.obtenerEstadoServicio;
	var obtenerDetallePlanTVWSUrl = urlPlanesProductoServicio.obtenerDetallePlanTV;
	var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;

    this.enviarAuditoria = function(request) {
        return $http.post(urlEnviarAuditoria, request);
    };
	this.getObtenerFlagProductoTV = function(){
		return $http.post(UrlObtenerFlagProductoTV);
	};
	this.getObtenerDatosSesion = function(){
		return $http.post(UrlObtenerDatosSesion);
	};
	this.actualizarProductoPrincipalSesion = function(request){
		return $http.post(actualizarProductoPrincipalWSUrl, request);
	};
	this.getObtenerServiciosWS = function(request){
		return $http.post(obtenerServiciosWSUrl, request);
	};
	this.getObtenerEstadoServicioWS = function(request){
		return $http.post(obtenerEstadoServicioWSUrl, request);
	};
	this.getObtenerDetallePlanTVWS = function(request){
		return $http.post(obtenerDetallePlanTVWSUrl, request);
	};
});
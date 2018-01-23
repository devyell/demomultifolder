var appServices = angular.module('MiClaroService',[]);

appServices.service('serviciosHome', function($http){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	var UrlObtenerFlagProductoInternet = urlComunUsuario.obtenerDatosUsuarioSesion;
	var UrlObtenerDatosSesion = urlComunUsuario.obtenerDatosSesion;
	var actualizarProductoPrincipalWSUrl = urlComunUsuario.actualizarProductoPrincipal;
	var obtenerServiciosWSUrl = urlServicios.obtenerServicios;
	var obtenerEstadoServicioWSUrl = urlServicios.obtenerEstadoServicio;
	var obtenerDetallePlanInternetWSUrl = urlPlanesProductoServicio.obtenerDetallePlanInternet;
	var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;

    this.enviarAuditoria = function(request) {
        return $http.post(urlEnviarAuditoria, request);
    };
	this.getObtenerFlagProductoInternet = function(){
		return $http.post(UrlObtenerFlagProductoInternet);
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
	this.getObtenerDetallePlanInternetWS = function(request){
		return $http.post(obtenerDetallePlanInternetWSUrl, request);
	};
});
var appServices = angular.module('MiClaroService',[]);

appServices.service('serviceHomeMoviles', function($http){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	var UrlObtenerFlagProductoTV = urlComunUsuario.obtenerDatosUsuarioSesion;
	var UrlObtenerServicioPrincipal = urlComunUsuario.obtenerDatosSesion;
	var UrlObtenerListadoFijoDireccion = urlMiclaroHome.obtenerListadoFijoDireccion;
    var UrlProductosServiciosMoviles = urlMiclaroHome.obtenerServicios;
    var UrlObtenerEstadoServicio = urlMiclaroHome.obtenerEstadoServicio;
    var obtenerDetallePlanTVWSUrl = urlPlanesProductoServicio.obtenerDetallePlanTV;
    var actualizarProductoPrincipalWSUrl = urlComunUsuario.actualizarProductoPrincipal;
    var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;
    
    this.enviarAuditoria = function(request) {
        return $http.post(urlEnviarAuditoria, request);
    };
    this.getObtenerFlagProductoTV = function(){
		return $http.post(UrlObtenerFlagProductoTV);
	};
	this.getObtenerServicioPrincipal = function(){
		return $http.post(UrlObtenerServicioPrincipal);
	};
	this.getObtenerListadoFijoDireccionWS = function(request){
		return $http.post(UrlObtenerListadoFijoDireccion, request);
	};
	this.getobtenerServiciosMoviles= function(dataMoviles){
		return $http.post(UrlProductosServiciosMoviles,dataMoviles);
	};
	this.getobtenerEstadoServicio= function(dataServicio){
		return $http.post(UrlObtenerEstadoServicio,dataServicio);
	};
	this.getObtenerDetallePlanTVWS = function(request){
		return $http.post(obtenerDetallePlanTVWSUrl, request);
	};
	this.actualizarProductoPrincipalSesion = function(request){
		return $http.post(actualizarProductoPrincipalWSUrl, request);
	};
});
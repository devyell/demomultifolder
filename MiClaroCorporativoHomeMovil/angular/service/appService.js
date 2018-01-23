var appServices = angular.module('MiClaroService',[]);

appServices.service('serviceHomeMoviles', function($http){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	var UrlObtenerFlagProductoMovil = urlComunUsuario.obtenerDatosUsuarioSesion;
	var UrlObtenerServicioPrincipal = urlComunUsuario.obtenerDatosSesion;
	var UrlObtenerListadoMovilCorporativoCuenta = urlServiciosFiltros.obtenerCorporativoCuenta;
    var UrlObtenerListadoMovilCorporativoRecibo = urlServiciosFiltros.obtenerCorporativoRecibo;
    var UrlObtenerListadoFijoDireccion = urlServiciosFiltros.obtenerDireccionesFija;
    var UrlProductosServiciosMoviles = urlServicios.obtenerServicios;
    var UrlObtenerEstadoServicio = urlServicios.obtenerEstadoServicio;
    var obtenerConsumoGeneralMovilWSUrl = urlConsumosGenerales.obtenerConsumoGeneralMovil;
    var actualizarProductoPrincipalWSUrl = urlComunUsuario.actualizarProductoPrincipal;
    var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;
    
    this.enviarAuditoria = function(request) {
        return $http.post(urlEnviarAuditoria, request);
    };
    this.getObtenerFlagProductoMovil = function(){
		return $http.post(UrlObtenerFlagProductoMovil);
	};
	this.getObtenerServicioPrincipal = function(){
		return $http.post(UrlObtenerServicioPrincipal);
	};
	this.getobtenerCorporativoCuenta = function(){
		return $http.post(UrlObtenerListadoMovilCorporativoCuenta);
	};
	this.getobtenerCorporativoRecibo = function(dataCuenta){
		return $http.post(UrlObtenerListadoMovilCorporativoRecibo,dataCuenta);
	};
	this.getobtenerServiciosMoviles= function(dataMoviles){
		return $http.post(UrlProductosServiciosMoviles,dataMoviles);
	};
	this.getobtenerEstadoServicio= function(dataServicio){
		return $http.post(UrlObtenerEstadoServicio,dataServicio);
	};
	this.getObtenerConsumoGeneralMovilWS = function(request){
		return $http.post(obtenerConsumoGeneralMovilWSUrl, request);
	};
	this.actualizarProductoPrincipalSesion = function(request){
		return $http.post(actualizarProductoPrincipalWSUrl, request);
	};
});
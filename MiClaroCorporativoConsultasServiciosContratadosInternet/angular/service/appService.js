var moduleService = angular.module('myservice',[]);

moduleService.service('CapaServicio', function($http){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	this.getObtenerFlagProductoInternetSesion = function(){
		return $http.post(urlComunUsuario.obtenerFlagProductoInternetSesion);
	};

	this.getObtenerServicioPrincipal = function(){
		return $http.post(urlComunUsuario.obtenerDatosSesion);
	};

	this.obtenerListadoDireccion = function(request){
		return $http.post(urlConsultasComun.obtenerListadoFijoDireccion, request);		
	};

	this.obtenerListadoServicio= function(request){
		return $http.post(urlConsultasComun.obtenerServicios, request);
	};

	this.getObtenerDatosAdicionalesServicioFijo = function(request){
		return $http.post(urlConsultasComun.obtenerDatosAdicionalesServicioFijo, request);
	};

	this.getObtenerDetallePlanInternet = function(request){
		return $http.post(urlConsultasComun.obtenerDetallePlanInternet, request);
	};

	this.enviarAuditoria = function(request) {
        return $http.post(urlComunUsuario.enviarAuditoria, request);
    };

    this.actualizarProductoPrincipalSesion = function(request){
		return $http.post(urlComunUsuario.actualizarProductoPrincipal, request);
	};

});
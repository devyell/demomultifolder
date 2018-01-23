var moduleService = angular.module('myservice',[]);

moduleService.service('CapaServicio', function($http){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	this.getObtenerFlagProductoTV = function(){
		return $http.post(urlComunUsuario.obtenerFlagProductoTVSesion);
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

	this.getobtenerEstadoServicio= function(request){
		return $http.post(urlServicios.obtenerEstadoServicio,request);
	};

	this.getObtenerDetallePlanTV = function(request){
		return $http.post(urlConsultasComun.obtenerDetallePlanTV, request);
	};

	this.getObtenerServiciosAdicionales = function(request){
		return $http.post(urlConsultasComun.obtenerServiciosAdicionales, request);
	};

	this.getSolicitarServicioAdicional = function(request){
		return $http.post(urlConsultasComun.solicitarServicioAdicional, request);
	};

	this.enviarAuditoria = function(request) {
        return $http.post(urlComunUsuario.enviarAuditoria, request);
    };

    this.actualizarProductoPrincipalSesion = function(request){
		return $http.post(urlComunUsuario.actualizarProductoPrincipal, request);
	};

});
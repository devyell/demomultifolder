var moduleService = angular.module('myservice',[]);

moduleService.service('CapaServicio', function($http){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	this.getObtenerFlagProductoMovil = function(){
		return $http.post(urlComunUsuario.obtenerFlagProductoMovilSesion);
	};

	this.getObtenerServicioPrincipal = function(){
		return $http.post(urlComunUsuario.obtenerDatosSesion);
	};

	this.obtenerListadoMovilCorporativoCuentaService = function(){
		return $http.post(urlConsultasComun.obtenerListadoMovilCorporativoCuenta);
	};

	this.obtenerListadoMovilCorporativoReciboService = function(request){
		return $http.post(urlConsultasComun.obtenerListadoMovilCorporativoRecibo, request);
	};

	this.enviarAuditoria = function(request) {
        return $http.post(urlComunUsuario.enviarAuditoria, request);
    };

	this.getObtenerDatosAdicionalesServicioMovil = function(request){
		return $http.post(urlConsultasComun.obtenerDatosAdicionalesServicioMovil, request);	
	};

	this.getObtenerDetallePlanMovil = function(request){
		return $http.post(urlConsultasComun.obtenerDetallePlanMovil, request);
	};

    this.getObtenerServiciosAdicionales = function(request){
		return $http.post(urlConsultasComun.obtenerServiciosAdicionales, request);
	};
	
	this.getObtenerListadoMoviles = function(request){
		return $http.post(urlConsultasComun.obtenerListadoMoviles, request);
	};
	
	this.getSolicitarServicioAdicional = function(request){
		return $http.post(urlConsultasComun.solicitarServicioAdicional, request);
	};
	
	
	this.enviarAuditoria = function(request) {
        return $http.post(urlComunUsuario.enviarAuditoria, request);
    };

    this.obtenerListadoServicio= function(request){
		return $http.post(urlConsultasComun.obtenerServicios, request);
	};

	this.getProductoPrincipal = function(request){
		return $http.post(urlConsultasComun.obtenerServicios, request);
	};

	this.actualizarProductoPrincipalSesion = function(request){
		return $http.post(urlComunUsuario.actualizarProductoPrincipal, request);
	};

});
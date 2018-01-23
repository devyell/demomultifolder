var moduleService = angular.module('myservice',[]);

moduleService.service('CapaServicio', function($http){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	
	this.getObtenerFlagProductoMovilSesion = function(){
		return $http.post(urlComunUsuario.obtenerFlagProductoMovilSesion);
	};

	this.getObtenerServicioPrincipal = function(){
		return $http.post(urlComunUsuario.obtenerDatosSesion);
	};

	this.getObtenerServicios = function(request){
		return $http.post(urlConsultasComun.obtenerServicios, request);
	};

	this.getObtenerDatosAdicionalesServicioFijo = function(request){
		return $http.post(urlConsultasComun.obtenerDatosAdicionalesServicioFijo, request);
	};

	this.getObtenerDatosAdicionalesServicioMovil = function(request){
		return $http.post(urlConsultasComun.obtenerDatosAdicionalesServicioMovil, request);	
	};

	this.getobtenerDetallePlanMovil = function(request){
		return $http.post(urlConsultasComun.obtenerDetallePlanMovil, request);
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
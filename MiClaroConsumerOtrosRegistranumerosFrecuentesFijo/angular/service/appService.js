var moduleService = angular.module('myservice',[]);

moduleService.service('managerservice', function($http){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	
	this.getObtenerDatosSesion = function(){
		return $http.post(urlComunUsuario.obtenerDatosSesion);
	};
	
	this.enviarAuditoria = function (request) {  

	return $http.post(urlComunUsuario.enviarAuditoria,request);
};


	this.getObtenerFlagProductoFijo = function(){
		return $http.post(urlComunUsuario.obtenerFlagProductoFijoSesion);
	};
	
	this.obtenerDatosUsuario = function(resquest){
		return $http.post(urlComunUsuario.obtenerDatosUsuario,resquest);
	};
	
	this.obtenerServicioPrincipal = function(resquest){
		return $http.post(urlComunUsuario.obtenerDatosSesion,resquest);
	};
	
	this.getObtenerServicios = function(resquest){
		return $http.post(comprasyRecargasUrl.obtenerServicios,resquest);
	};
	
	this.obtenerOpcionesNumerosFrecuentes = function(resquest){
		return $http.post(comprasyRecargasUrl.obtenerOpcionesNumerosFrecuentes,resquest);
	};
	
	this.obtenerNumerosFrecuentes = function(resquest){
		return $http.post(comprasyRecargasUrl.obtenerNumerosFrecuentes,resquest);
	};
	
	this.obtenerDatosAdicionalesServicioFijo = function(resquest){
		return $http.post(comprasyRecargasUrl.obtenerDatosAdicionalesServicioFijo,resquest);
	};
	
	this.grabarNumerosFrecuentes = function(resquest){
		return $http.post(comprasyRecargasUrl.grabarNumerosFrecuentes,resquest);
	};
	

	
	

});
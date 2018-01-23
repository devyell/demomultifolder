var moduleService = angular.module('myservice',[]);

moduleService.service('managerservice', function($http){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	
	this.obtenerDatosUsuario = function(){
		return $http.post(urlComunUsuario.obtenerDatosUsuarioSesion);
	};
	
	this.enviarSolicitud = function(resquest){
		return $http.post(comprasyRecargasUrl.enviarSolicitud,resquest);
	};
	
	this.obtenerCaptchaSolicitud = function(){
		return $http.post(comprasyRecargasUrl.obtenerCaptchaSolicitud);
	};
	
	this.registrarAuditoria = function(dataAudi) {
        return $http.post(urlComunUsuario.enviarAuditoria, dataAudi);
    }
	
	
	
	
	
});
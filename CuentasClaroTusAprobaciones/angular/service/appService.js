var moduleService = angular.module('myservice',[]);

moduleService.service('managerservice', function($http){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	var obtenerListaSecUrl = urlAprobacionSec.obtenerListadoSecPendientes;
	var obtenerListaDocsSecUrl = urlAprobacionSec.obtenerListadoDocumentosSEC;
	var actualizaEstadoSecUrl = urlAprobacionSec.actualizarEstadoSEC;
	var obtenerDocSecUrl = urlAprobacionSec.obtenerDocumentoSEC;

	this.getObtenerDatosUsuarioSesion = function(){  
		return $http.post(urlComunUsuario.obtenerDatosUsuarioSesion);
	};
	
	this.obtenerListaSec = function(request){
		return $http.post(obtenerListaSecUrl, request);
	};

	this.obtenerListaDocsSec = function(request){
		return $http.post(obtenerListaDocsSecUrl, request);
	};

	this.actualizaEstadoSec = function(request){
		return $http.post(actualizaEstadoSecUrl, request);
	};

	this.obtenerDocSec = function(request){
		return $http.post(obtenerDocSecUrl, request);
	};

	this.enviarAuditoria = function (request) {  

	return $http.post(urlComunUsuario.enviarAuditoria,request);
	};

});
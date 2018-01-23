var appServices = angular.module('MiClaroService',[]);

appServices.service('serviceHome', function($http){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	var UrlObtenerDatosSesion = urlComunUsuario.obtenerDatosSesion;
	var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;

    this.enviarAuditoria = function(request) {
        return $http.post(urlEnviarAuditoria, request);
    };
	this.getObtenerDatosSesion = function(){
		return $http.post(UrlObtenerDatosSesion);
	};
});
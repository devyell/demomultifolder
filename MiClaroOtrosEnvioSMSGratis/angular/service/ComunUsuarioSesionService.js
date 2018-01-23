var appServices = angular.module('miClaroServicesSesion',[]);   
 
appServices.service('ComunUsuarioSesionService', function($http,$q,$httpParamSerializer) {

$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'; 
$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};  

	var urlObtenerDatosUsuario = urlComunUsuario.obtenerDatosUsuarioSesion;
	var urlObtenerDatosSesion = urlComunUsuario.obtenerDatosSesion;
	var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;
		

	this.obtenerDatosUsuario = function () {
		return $http.post(urlObtenerDatosUsuario);
	};
	this.obtenerDatosSesion = function(){
		return $http.post(urlObtenerDatosSesion);
	};

	this.enviarAuditoria = function(request) {
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
        return $http.post(urlEnviarAuditoria, requestFormat);
    };
  
});
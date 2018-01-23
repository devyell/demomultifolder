var appServices = angular.module('serviceNuevoServicioCorporativoHome',[]);

appServices.service('srvNuevoServicioHome', function($http){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	var UrlObtenerDatosSesion = urlComunUsuario.obtenerDatosSesion;

	this.getObtenerDatosSesion = function(){
		return $http.post(UrlObtenerDatosSesion);
	};
});
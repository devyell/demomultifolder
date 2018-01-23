var appServices = angular.module('serviceHomeDirectorio',[]);

appServices.service('srvDirectorioHome', function($http){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	var UrlObtenerDatosSesion = urlComunUsuario.obtenerDatosSesion;

	this.getObtenerDatosSesion = function(){
		return $http.post(UrlObtenerDatosSesion);
	};
});
var appServices = angular.module('miClaroServices',[]);   
 
appServices.service('EnvioSMSService', function($http,$httpParamSerializerJQLike,$httpParamSerializer) {

$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'; 
$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};  

	var urlObtenerSMSDia = comprasyRecargasUrl.obtenerCantidades;
	var urlEnviarSMSClaro = comprasyRecargasUrl.enviarSMSClaro;
	var urlObtenerCaptcha = comprasyRecargasUrl.obtenerCaptcha;
	
	this.obtenerCantidades = function () {
		return $http.post(urlObtenerSMSDia);
	};	
  
	this.enviarSMSClaro = function (request) {
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlEnviarSMSClaro,requestFormat);
	};
	this.obtenerCaptcha = function () {
		return $http.get(urlObtenerCaptcha);
	};
});
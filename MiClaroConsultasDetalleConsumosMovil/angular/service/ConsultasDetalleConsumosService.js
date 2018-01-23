var appServices = angular.module('miClaroServices',[]);   
 
appServices.service('DetalleConsumosService', function($http,$httpParamSerializerJQLike,$httpParamSerializer) {

$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'; 
$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};  

	var urlObtenerServicios = urlConsultasComun.obtenerServicios;
	var urlObtenerDatosAdicServicioMovil = urlConsultasComun.obtenerDatosAdicionalesServicioMovil;
	var urlObtenerPeriodos = urlConsultasComun.obtenerPeriodos;
	var urlObtenerPeriodosFact = urlConsultasComun.obtenerPeriodosFacturacion;
	var urlObtenerLlamadasMovil = urlConsultasComun.obtenerLlamadasMovil;
	var urlObtenerMensajesMovil = urlConsultasComun.obtenerMensajesMovil
	var urlObtenerTraficoMovil = urlConsultasComun.obtenerTraficoMovil;

	var urlListadoMovCorpCuenta = urlConsultasComun.obtenerListadoMovilCorporativoCuenta;
	var urlListadoMovCorpRecibo = urlConsultasComun.obtenerListadoMovilCorporativoRecibo;

	var urlObtenerReporteLlamadas = urlConsultasComun.obtenerReporteLlamadas;

   
	this.obtenerServicios = function (request) {
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlObtenerServicios,requestFormat);
	};	
  
	this.obtenerDatosAdicionalesServicioMovil = function(request){
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlObtenerDatosAdicServicioMovil, requestFormat);	
	};
	this.obtenerPeriodos = function (request) {
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlObtenerPeriodos,requestFormat);
	};

	this.obtenerPeriodosFacturacion = function (request) {
		
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlObtenerPeriodosFact,requestFormat);
	};

	this.obtenerLlamadasMovil = function (request) {
		
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlObtenerLlamadasMovil,requestFormat);
	};
	this.obtenerMensajesMovil = function (request) {
		
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlObtenerMensajesMovil,requestFormat);
	};
	this.obtenerTraficoMovil = function (request) {
		
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlObtenerTraficoMovil,requestFormat);
	};
	
	this.obtenerListadoMovCorpCuenta = function () {

		return $http.post(urlListadoMovCorpCuenta);
	};
	this.obtenerListadoMovCorpRecibo = function (request) {

		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlListadoMovCorpRecibo,requestFormat);
	};
	this.obtenerReporteLlamadas = function (request, tipoReporte) {

		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) ,"tipoReporte":tipoReporte});
		return $http.post(urlObtenerReporteLlamadas,requestFormat);
	};


	this.obtenerListadoMoviles = function(request){
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlConsultasComun.obtenerListadoMoviles,requestFormat);
	};
	
});
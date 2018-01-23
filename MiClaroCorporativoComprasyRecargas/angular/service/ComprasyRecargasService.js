var appServices = angular.module('miClaroServices',[]);   
 
appServices.service('ComprasyRecargasService', function($http,$httpParamSerializerJQLike,$httpParamSerializer) {

$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'; 
$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};  


	var urlObtenerServicios = comprasyRecargasUrl.obtenerServicios;
	var urlObtenerCreditoSaldoProducto = comprasyRecargasUrl.obtenerCreditoSaldoProducto;
	var urlObtenerCategoriasDeCompra = comprasyRecargasUrl.obtenerCategoriasDeCompra;
	var urlObtenerProductosDeCompra = comprasyRecargasUrl.obtenerProductosDeCompra;
	var urlObtenerMetodosPago = comprasyRecargasUrl.obtenerMetodosPago;
	var urlPagarProductoDeCompra = comprasyRecargasUrl.pagarProductoDeCompra;
		
	var urlListadoMovCorpCuenta = comprasyRecargasUrl.obtenerListadoMovilCorporativoCuenta;
	var urlListadoMovCorpRecibo = comprasyRecargasUrl.obtenerListadoMovilCorporativoRecibo;

	var urlRegInicioTransaccionPagoTC = comprasyRecargasUrl.registrarInicioTransaccionPagoTC;
	var urlRegFinTransaccionPagoTC = comprasyRecargasUrl.registrarFinTransaccionPagoTC;

	var urlActualizarClaroPuntos = comprasyRecargasUrl.actualizarClaroPuntosSesion;
 
	this.obtenerServicios = function (request) {
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlObtenerServicios,requestFormat);
	};	
  
	this.obtenerCategoriasDeCompra = function (request) {
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlObtenerCategoriasDeCompra,requestFormat);
	};

	this.obtenerCreditoSaldoProducto = function (request) {
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlObtenerCreditoSaldoProducto,requestFormat);
	};

	this.obtenerProductosDeCompra = function (request) {
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlObtenerProductosDeCompra,requestFormat);
	};

	this.obtenerMetodosPago = function (request) {
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlObtenerMetodosPago,requestFormat);
	};
	
	this.pagarProductoDeCompra = function (request) {
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlPagarProductoDeCompra,requestFormat);
	};

	this.obtenerListadoMovCorpCuenta = function () {
		
		return $http.post(urlListadoMovCorpCuenta);
	};
	this.obtenerListadoMovCorpRecibo = function (request) {
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlListadoMovCorpRecibo,requestFormat);
	};

	
	this.obtenerListadoMoviles = function(request){
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(comprasyRecargasUrl.obtenerListadoMoviles,requestFormat);
	};

	
	this.registrarInicioTransaccionPagoTC = function(request){
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlRegInicioTransaccionPagoTC,requestFormat);
	};

	this.registrarFinTransaccionPagoTC = function(request){
		var requestFormat = $httpParamSerializer({ requestJson: angular.toJson(request) });
		return $http.post(urlRegFinTransaccionPagoTC,requestFormat);
	};
  	this.actualizarClaroPuntosSesion = function(){
		return $http.post(urlActualizarClaroPuntos);
	};
});
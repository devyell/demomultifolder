var moduleService = angular.module('myservice',[]);

moduleService.service('CapaService', function($http, $httpParamSerializer){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	this.getObtenerServicioPrincipal = function(){
		return $http.post(urlComunUsuario.obtenerDatosSesion);
	};

	this.getObtenerFlagProductoTV = function(){
		return $http.post(urlComunUsuario.obtenerFlagProductoTVSesion);
	};

	this.getObtenerServicios = function(trama){
		request = $httpParamSerializer({requestJson:angular.toJson(trama)});
		return $http.post(comprasyRecargasUrl.obtenerServicios, request);
	};

	this.getObtenerDatosAdicionalesServicioFijo = function(trama){
		request = $httpParamSerializer({requestJson:angular.toJson(trama)});
		return $http.post(urlConsultasComun.obtenerDatosAdicionalesServicioFijo, request);
	};

	this.getObtenerPaquetesAdicionalesTV = function(trama){
		request = $httpParamSerializer({requestJson:angular.toJson(trama)});
		return $http.post(comprasyRecargasUrl.obtenerPaquetesAdicionalesTV, request);
	};

	this.solicitarPaquetesAdicionalesTV = function(trama){
		request = $httpParamSerializer({requestJson:angular.toJson(trama)});
		return $http.post(comprasyRecargasUrl.solicitarPaquetesAdicionalesTV, request);
	};

	this.obtenerListadoDireccion = function(trama){
		request = $httpParamSerializer({requestJson:angular.toJson(trama)});
		return $http.post(urlConsultasComun.obtenerListadoFijoDireccion, request);		
	};

	this.obtenerListadoServicio= function(trama){
		request = $httpParamSerializer({requestJson:angular.toJson(trama)});
		return $http.post(urlConsultasComun.obtenerServicios, request);
	};
	
	this.enviarAuditoria = function(trama) {
		request = $httpParamSerializer({ requestJson: angular.toJson(trama)});
        return $http.post(urlComunUsuario.enviarAuditoria, request);
    };
    
});
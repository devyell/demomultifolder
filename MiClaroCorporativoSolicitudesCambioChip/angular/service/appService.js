var moduleService = angular.module('myservice',[]);

moduleService.service('CapaService', function($http, $httpParamSerializer){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	this.getObtenerDatosSesion = function(){
		return $http.post(urlComunUsuario.obtenerDatosSesion);
	};

    this.obtenerListadoMovilCorporativoCuentaService = function() {
        return $http.get(comprasyRecargasUrl.obtenerListadoMovilCorporativoCuenta);
    }

    this.obtenerListadoMovilCorporativoReciboService = function(trama) {
    	request = $httpParamSerializer({requestJson:angular.toJson(trama)});
        return $http.post(comprasyRecargasUrl.obtenerListadoMovilCorporativoRecibo, request);
    }

    this.obtenerListadoServicio= function(trama){
        request = $httpParamSerializer({requestJson:angular.toJson(trama)});
        return $http.post(comprasyRecargasUrl.obtenerServicios, request);
    };

    this.obtenerDirectorioTelefonicoService = function(trama) {
    	request = $httpParamSerializer({requestJson:angular.toJson(trama)});
        return $http.post(comprasyRecargasUrl.obtenerDirectorioTelefonico, request);
    }

    
	this.enviarAuditoria = function(request) {
        return $http.post(urlComunUsuario.enviarAuditoria, request);
    };

    this.getObtenerListadoMovilesAutocomplete = function(trama) {
        request = $httpParamSerializer({requestJson:angular.toJson(trama)});
        return $http.post(comprasyRecargasUrl.obtenerListadoMoviles, request);
    }

    this.getBuscarChipPackEmergencia = function(trama){
        request = $httpParamSerializer({requestJson:angular.toJson(trama)});
        return $http.post(comprasyRecargasUrl.buscarChipPackEmergencia, request);   
    }

    this.asignarChipPackEmergencia = function(trama){
        request = $httpParamSerializer({requestJson:angular.toJson(trama)});
        return $http.post(comprasyRecargasUrl.asignarChipPackEmergencia, request);   
    }
    
    
    
});
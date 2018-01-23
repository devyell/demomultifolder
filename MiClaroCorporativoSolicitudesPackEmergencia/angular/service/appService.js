var moduleService = angular.module('myservice',[]);

moduleService.service('CapaService', function($http, $httpParamSerializer){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	this.getObtenerFlagProductoMovil = function(){
		return $http.post(urlComunUsuario.obtenerFlagProductoMovilSesion);
	};

	this.ServiceObtenerDatosUsuario = function(){
		return $http.post(urlComunUsuario.obtenerDatosSesion);
	};
	
	this.ServiceObtenerDireccionesDespacho = function(data){
		
		var trama = {
    		tipoCliente:  data.tipoCliente
    	};

    	request = $httpParamSerializer({requestJson:angular.toJson(trama)});
		return $http.post(comprasyRecargasUrl.obtenerDireccionesDespacho, request);

	};
	
	this.ServiceObtenerTipoPackEmergencia = function(){    	
		return $http.post(comprasyRecargasUrl.obtenerTipoPackEmergencia);
	};

	this.ServiceSolicitarChipPackEmergencia = function(data){
		
		var trama = {
			idDireccion : data.idDireccion,
			idTipoPack : data.idTipoPack,
			cantidadPacks : data.cantidadPacks
		};

    	request = $httpParamSerializer({requestJson:angular.toJson(trama)});
		return $http.post(comprasyRecargasUrl.solicitarChipPackEmergencia, request);

	};

	this.enviarAuditoria = function(trama) {
		request = $httpParamSerializer({ requestJson: angular.toJson(trama)});
        return $http.post(urlComunUsuario.enviarAuditoria, request);
    };

});
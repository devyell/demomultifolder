var moduleService = angular.module('myservice',[]);

moduleService.service('managerservice', function($http){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	
	 this.getObtenerDatosSesion = function() {
        return $http.post(urlComunUsuario.obtenerDatosUsuarioSesion);
    };
	
	 this.obtenerServicioPrincipal = function() {
        return $http.post(urlComunUsuario.obtenerDatosSesion);
    };
	
	this.actualizarProductoPrincipalSesion = function(request){
        return $http.post(urlComunUsuario.actualizarProductoPrincipal, request);
    };
	
	 this.registrarAuditoria = function(dataAudi) {
        return $http.post(urlComunUsuario.enviarAuditoria, dataAudi);
    }
	
	this.obtenerListadoMoviles = function(resquest){
		return $http.post(comprasyRecargasUrl.obtenerListadoMoviles,resquest);
	};
	
	this.obtenerDatosUsuario = function(resquest){
		return $http.post(urlComunUsuario.obtenerListadoMoviles,resquest);
	};
	
	this.obtenerListadoMovilCorporativoCuenta = function(){
		return $http.post(comprasyRecargasUrl.obtenerListadoMovilCorporativoCuenta);
	};
	
	this.obtenerListadoMovilCorporativoRecibo = function(resquest){
		return $http.post(comprasyRecargasUrl.obtenerListadoMovilCorporativoRecibo,resquest);
	};
	
	this.obtenerServicios = function(resquest){
		return $http.post(comprasyRecargasUrl.obtenerServicios,resquest);
	};
	
	this.obtenerBolsasMinutos = function(resquest){
		return $http.post(comprasyRecargasUrl.obtenerBolsasMinutosContratadas,resquest);
	};
	
	this.obtenerDetalleConsumoBolsaMinutos = function(resquest){
		return $http.post(comprasyRecargasUrl.obtenerDetalleConsumoBolsaContratada,resquest);
	};
	
	this.modificarTopeBolsaMinutos = function(resquest){
		return $http.post(comprasyRecargasUrl.modificarTopeConsumoBolsaMinutos,resquest);
	};

});
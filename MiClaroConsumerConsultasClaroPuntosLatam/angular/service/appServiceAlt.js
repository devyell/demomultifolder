var moduleService = angular.module('myservice',[]);

moduleService.service('CapaService', function($http){

	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

	this.obtenerClaroPuntosRS = function(){
		return $http.post(urlClaroPuntos.obtenerClaroPuntosClaroPuntos);
	}

	this.obtenerMovimientosClaroPuntosRS = function(){
		return $http.post(urlClaroPuntos.obtenerMovimientosClaroPuntos);
	}
	this.enviarAuditoria = function(request) {
        return $http.post(urlComunUsuario.enviarAuditoria, request);
    };
	 this.getObtenerDatosSesion = function() {
        return $http.post(urlComunUsuario.obtenerDatosUsuarioSesion);
    };

    this.getSocioConvenio = function() {
        return $http.post(urlSocioConvenio.consultarSocio);
    }
    
    this.consultarMillas = function(request){
        return $http.post(urlCanjeLatam.consultarSaldoKm, request);
    }

    this.canjearMillasLatam = function(request){
        return $http.post(urlCanjeLatam.ejecutarCanjeKm, request);
    }

    this.canjearClaroPuntos = function(request){
        return $http.post(urlCanjeLatam.ejecutarCanjeClaroPuntos, request);
    }

});
var appServices = angular.module('MiClaroService',[]);
appServices.service('consultarHistorialTransaccionesService', function($http){
	
	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	
	var UrlObtenerServicios = urlConsultasComun.obtenerServicios;
	var UrlObtenerPeriodos = urlConsultasComun.obtenerPeriodos;
	var UrlObtenerComprasRecargasPeriodo  = urlConsultasComun.obtenerComprasRecargasPeriodo;
	var UrlObtenerSolicitudesPeriodo = urlConsultasComun.obtenerSolicitudesPeriodo;
	var UrlObtenerArchivoSolicitudPeriodo = urlConsultasComun.obtenerArchivoSolicitudPeriodo;
	var UrlObtenerContratosServiciosPeriodo = urlConsultasComun.obtenerContratosServiciosPeriodo;
	var UrlObtenerArchivoContratoServiciosPeriodo = urlConsultasComun.obtenerArchivoContratoServiciosPeriodo;
	var UrlObtenerDatosUsuario = urlComunUsuario.obtenerDatosUsuarioSesion; 
	var UrlEnviarAuditoria = urlComunUsuario.enviarAuditoria;
	var UrlServicioPrincipal = urlComunUsuario.obtenerDatosSesion;
	var UrlActualizarProductoPrincipal = urlComunUsuario.actualizarProductoPrincipal;

    this.actualizarProductoPrincipal = function(actualizar) {
        return $http.post(UrlActualizarProductoPrincipal, actualizar);
    }
    
	this.obtenerServicioPrincipal = function() {
        return $http.get(UrlServicioPrincipal);
    };
	
	this.getObtenerServicios = function(request){
		return $http.post(UrlObtenerServicios,request);
	};
	
	this.obtenerPeriodos = function(request){
		return $http.post(UrlObtenerPeriodos,request);
	};
	
	this.obtenerComprasRecargasPeriodo = function(request){
		return $http.post(UrlObtenerComprasRecargasPeriodo,request);
	};
	
	this.obtenerSolicitudesPeriodo = function(request){
		return $http.post(UrlObtenerSolicitudesPeriodo,request);
	};
	
	this.obtenerArchivoSolicitudPeriodo = function(request){
		return $http.post(UrlObtenerArchivoSolicitudPeriodo,request);
	};
	
	this.obtenerContratosServiciosPeriodo = function(request){
		return $http.post(UrlObtenerContratosServiciosPeriodo,request);
	};
	
	this.obtenerArchivoContratoServiciosPeriodo = function(request){
		return $http.post(UrlObtenerArchivoContratoServiciosPeriodo,request);
	};
	
	this.obtenerDatosUsuarioSesion = function(){
		return $http.get(UrlObtenerDatosUsuario);
	};
	
	this.enviarAuditoria = function(request){
		return $http.post(UrlEnviarAuditoria,request);
	};
});
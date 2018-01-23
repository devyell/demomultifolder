var appServices = angular.module('MiClaroService',[]);

appServices.service('consultaReporteCorporativoService', function($http){
	
	$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	
	var UrlObtenerListadoMovilCorporativoCuenta = urlConsultasComun.obtenerListadoMovilCorporativoCuenta; 
    var UrlObtenerListadoMovilCorporativoRecibo = urlConsultasComun.obtenerListadoMovilCorporativoRecibo;
	var UrlObtenerPeriodos = urlConsultasComun.obtenerPeriodos;
	var UrlSolicitarReporte = urlConsultasComun.solicitarReporte;
	var UrlObtenerEstadoReportes = urlConsultasComun.obtenerEstadoReportes;
	var UrlObtenerReporte = urlConsultasComun.obtenerReporte;
	var UrlEnviarAuditoria = urlComunUsuario.enviarAuditoria;
	var UrlObtenerFlagProductoMovilAdminSesion = urlComunUsuario.obtenerFlagProductoMovilAdminSesion;
	var UrlServicioPrincipal = urlComunUsuario.obtenerDatosSesion;
	var UrlActualizarProductoPrincipal = urlComunUsuario.actualizarProductoPrincipal;
	var UrlObtenerDatosUsuario = urlComunUsuario.obtenerDatosUsuarioSesion;

    this.actualizarProductoPrincipal = function(actualizar) {
        return $http.post(UrlActualizarProductoPrincipal, actualizar);
    };

	this.getCuentasCoorporativos = function () {
		return $http.post(UrlObtenerListadoMovilCorporativoCuenta);
	};

    this.getReciboCoorporativos = function (request) {
		return $http.post(UrlObtenerListadoMovilCorporativoRecibo,request);
	};
	
	  this.obtenerPeriodosFacturacion = function (request) {
		return $http.post(urlConsultasComun.obtenerPeriodosFacturacion,request);
	};
	
	this.obtenerDatosUsuarioSesion = function() {
        return $http.get(UrlObtenerDatosUsuario);
    };

	this.obtenerPeriodos = function(request){
		return $http.post(UrlObtenerPeriodos,request);
	};
	
	this.solicitarReporte = function(request){
		return $http.post(UrlSolicitarReporte,request);
	};
	
	this.obtenerEstadoReportes = function(){
		return $http.get(UrlObtenerEstadoReportes);
	};
	
	this.obtenerReporte = function(request){
		return $http.post(UrlObtenerReporte,request);
	};
	
	this.enviarAuditoria = function(request){
		return $http.post(UrlEnviarAuditoria,request);
	};
	
	this.obtenerFlagProductoMovilAdminSesion = function(){
		return $http.get(UrlObtenerFlagProductoMovilAdminSesion);
	};
	
	this.obtenerServicioPrincipal = function() {
        return $http.get(UrlServicioPrincipal);
    };
});
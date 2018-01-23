var appServicesV1 = angular.module('miClaroServicesV1',[]);

appServicesV1.service('AfiliaUsuarioService', ['$http', function($http) {
 
$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'; 
$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};  
 

		this.validarAfiliacion = function (direccion) {
            return $http.post(urlServiceConfiguracion.validarAfiliacion, direccion);
        };
	
		this.afiliarCelular = function (direccion) {
            return $http.post(urlServiceConfiguracion.afiliarCelular, direccion);
        };
		
		this.administrarCantMaxCuentasAAfiliar = function (direccion) {
            return $http.post(urlServiceConfiguracion.administrarCantMaxCuentasAAfiliar, direccion);
        };
	
		
		this.enviarCodigoSecreto = function (direccion) {
            return $http.post(urlAdminCredenciales.enviarCodigoSecreto, direccion);
        };
		
		this.obtenerDatosUsuario = function () {	
		return $http.post(urlComunUsuario.obtenerDatosUsuarioSesion);

		};
		
		this.enviarAuditoria = function (request) {  
		return $http.post(urlComunUsuario.enviarAuditoria,request);
		};

		
		
		this.obtenerServicios = function(request) {
		return $http.post(urlServicios.obtenerServicios , request);
		};

	
		this.urlsRetorno = function () {
		var retorno="/wps/wcm/myconnect/Mi Claro Content Library/Servicios Json/urlsRetorno.json?subtype=json"	
		var config={
		method:"GET",
		url:retorno
		}
		return $http(config);
		};

		

}]);
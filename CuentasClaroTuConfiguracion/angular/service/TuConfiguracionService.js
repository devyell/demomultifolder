var appServices = angular.module('miClaroServices',[]);

appServices.service('TuConfiguracionService', ['$http', function($http) {
 
$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'; 
$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};  

var urlObtenerListadoMovilCorporativoCuenta=urlsComunTuConfiguracion.obtenerCorporativoCuenta;  
var urlObtenerListadoMovilCorporativoRecibo=urlsComunTuConfiguracion.obtenerCorporativoRecibo;  
var urlObtenerListadoFijoDireccion=urlsComunTuConfiguracion.obtenerDireccionesFija;  
var urlObtenerServicios=urlsComunTuConfiguracion.obtenerServicios;
var urlPersonalizarAliasCuenta=urlsComunTuConfiguracion.personalizarAliasCuenta ; 
var urlModificarPermiso=urlsComunTuConfiguracion.modificarPermiso ;  
var urlObtenerUsuariosVinculados=urlsComunTuConfiguracion.obtenerUsuariosVinculados ; 
var urlObtenerServicioPrincipal=urlComunUsuario.obtenerDatosSesion ;  
var urlObtenerUsuariosQueMeVincularon=urlsComunTuConfiguracion.obtenerUsuariosQueMeVincularon ; 
var urlDesvincularUsuarios=urlsComunTuConfiguracion.desvincularUsuario ;
var urlGuardarCheckPermitirVincular=urlsComunTuConfiguracion.guardarCheckPermitirVincular ;
var urlObtenerCheckPermitirVincular=urlsComunTuConfiguracion.obtenerCheckPermitirVincular ;
var urlObtenerCheckPromociones=urlsComunTuConfiguracion.obtenerCheckPromociones ;
var urlGuardarCheckPromociones=urlsComunTuConfiguracion.guardarCheckPromociones ;
var urlObtenerListadoMovilesAfiliados=urlsComunTuConfiguracion.obtenerListadoMovilesAfiliados; 
var urlObtenerMovilesAfiliados=urlsComunTuConfiguracion.obtenerMovilesAfiliados; 	
var urlObtenerListadoMoviles=urlsComunTuConfiguracion.obtenerListadoMoviles; 	
var urlObtenerDatosUsuario=urlComunUsuario.obtenerDatosUsuarioSesion; 
var urlEnviarAuditoria=urlComunUsuario.enviarAuditoria;
	
	
		this.obtenerDatosUsuario = function () {
			
		return $http.post(urlObtenerDatosUsuario);
	 
		};
		
		
		this.obtenerListadoMovilCorporativoCuenta = function (datos) {
            return $http.post(urlObtenerListadoMovilCorporativoCuenta,datos);
          
        };
		
		this.obtenerListadoMovilCorporativoRecibo = function (datos) {
            return $http.post(urlObtenerListadoMovilCorporativoRecibo,datos);
            
        };
		
		
		this.obtenerListadoFijoDireccion = function (datos) {
            return $http.post(urlObtenerListadoFijoDireccion,datos);
            
        };
		
		this.obtenerServicios = function (valor) {
            return $http.post(urlObtenerServicios,valor);
        };
		
		this.ObtenerMovilesAfiliados = function (valor) {
            return $http.post(urlObtenerMovilesAfiliados,valor);
        };
		
		
		this.personalizarAliasCuenta = function (datos) {
            return $http.post(urlPersonalizarAliasCuenta, datos);
        };
		
		this.modificarPermiso = function (direccion) {
            return $http.post(urlModificarPermiso, direccion);
        };
		
		this.obtenerUsuariosVinculados = function () {
            return $http.post(urlObtenerUsuariosVinculados);
        };
		
		this.obtenerUsuariosQueMeVincularon = function () {
            return $http.post(urlObtenerUsuariosQueMeVincularon);
        };
		
		this.desvincularUsuarios = function (datos) {
            return $http.post(urlDesvincularUsuarios,datos);
        };
		
		
		this.guardarCheckPermitirVincular = function (datos) {
            return $http.post(urlGuardarCheckPermitirVincular,datos);
        };
		
		
		this.obtenerCheckPermitirVincular = function (datos) {
            return $http.post(urlObtenerCheckPermitirVincular,datos);
        };
		
		this.obtenerServicioPrincipal = function () {
            return $http.post(urlObtenerServicioPrincipal);
        };
		
		
		this.obtenerCheckPromociones = function (datos) {
            return $http.post(urlObtenerCheckPromociones, datos);
        };
		
		
		this.guardarCheckPromociones = function (datos) {
            return $http.post(urlGuardarCheckPromociones, datos);
        };
		
		
		this.administrarCantMaxCuentasAVincular = function (datos) {
            return $http.post(urlsComunTuConfiguracion.administrarCantMaxCuentasAVincular, datos);
        };
		
	
		this.obtenerListadoMovilesAfiliados = function (datos) {
            return $http.post(urlObtenerListadoMovilesAfiliados, datos);
        };
		
		this.obtenerListadoMoviles = function (datos) {
            return $http.post(urlObtenerListadoMoviles, datos);
        };
			
		this.urlsRetorno = function () {
		var retorno="/wps/wcm/myconnect/Mi Claro Content Library/Servicios Json/urlsRetorno.json?subtype=json"	
		var config={
		method:"GET",
		url:retorno
		}
		return $http(config);
		};
		
		
		this.enviarAuditoria = function (request) {  
		return $http.post(urlEnviarAuditoria,request);
		};

		

}]);
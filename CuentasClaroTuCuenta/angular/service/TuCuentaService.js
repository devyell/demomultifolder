var appServices = angular.module('miClaroServices',[]);   
 
appServices.service('TuCuentaService', ['$http','$httpParamSerializerJQLike', function($http,$httpParamSerializerJQLike) {

$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'; 
$http.defaults.headers.post = {'Access-Control-Allow-Origin':undefined};  

var urlObtenerServicios=urlsComunTuCuenta.obtenerServicios;
var urlObtenerDirecciones=urlsComunTuCuenta.obtenerDirecciones ;
var urlGrabarDireccion=urlsComunTuCuenta.grabarDireccion ;
var urlObtenerDatosUsuario=urlComunUsuario.obtenerDatosUsuarioSesion; 
var urlModificaDatosUsuario=urlsComunTuCuenta.modificarDatosUsuario;
var urlObtenerDatosUsuarioFoto="/wps/um/secure/currentuser/profile/jpegPhoto"; 
var urlModificaDatosUsuarioFoto2="/wps/um/secure/currentuser/profile?update=replace";
var urlModificaDatosUsuarioFoto=urlComunUsuario.actualizarFoto;
var urlModificaDatosUsuarioTelefono=urlsComunTuCuenta.modificarDatosUsuario; 
var urlObtenerClaroPuntosClaroPuntos=urlComunUsuario.obtenerClaroPuntosClaroPuntos; 
var urlObtenerServicioPrincipal=urlComunUsuario.obtenerDatosSesion; 
var urlObtenerFoto=urlComunUsuario.obtenerFoto;
var urlObtenerListadoDirecciones=autoCompletarService.obtenerListadoDirecciones;
var urlActualizarAfiliacionFacturacionElectronica=urlsComunTuCuenta.actualizarAfiliacionFacturacionElectronica;
var urlEnviarAuditoria=urlComunUsuario.enviarAuditoria;

this.obtenerServicios = function (valor) {
	return $http.post(urlObtenerServicios,valor);
};

this.obtenerListadoMoviles = function (valor) {
	return $http.post(autoCompletarService.obtenerListadoMoviles,valor);
};

this.obtenerSesion  = function (valor) {
	return $http.post(urlComunUsuario.obtenerSesion);
};
	
this.obtenerDirecciones = function (request) {
	return $http.post(urlObtenerDirecciones, request);
};

this.grabarDireccion = function (direccion) {
	return $http.post(urlGrabarDireccion, direccion);
};

this.actualizarAfiliacionFacturacionElectronica = function (request) {
	return $http.post(urlActualizarAfiliacionFacturacionElectronica, request);
};

this.obtenerDatosUsuario = function () {			
	 return $http.post(urlObtenerDatosUsuario);
};

this.obtenerUsuarioFoto = function () {  
	return $http.get(urlObtenerFoto);
};

this.obtenerUsuarioFoto2 = function () { 
	return $http.get(urlObtenerDatosUsuarioFoto);
};

this.modificaDatosUsuarioFoto = function (xmlPhotoUpload) { 
	return $http.post(urlModificaDatosUsuarioFoto,xmlPhotoUpload);	
};


this.obtenerUsuarioVinculado = function () { 
	return $http.post(urlComunUsuario.obtenerUsuarioVinculado);	
};

this.modificaDatosUsuarioFoto2 = function (xmlPhotoUpload) { 	
	var req = {
		method: 'POST',
		url: urlModificaDatosUsuarioFoto2,
		headers: {
		'Content-Type': undefined
	},
		data: xmlPhotoUpload
	}				
	return $http(req);
};

this.modificaDatosUsuarioTelefono = function (request) { 
	return $http.post(urlModificaDatosUsuarioTelefono, request);
};


this.obtenerClaroPuntos = function (request) {  	
	return $http.post(urlObtenerClaroPuntosClaroPuntos, request);
};

this.obtenerServicioPrincipal = function () {  
	return $http.post(urlObtenerServicioPrincipal);
};

this.enviarAuditoria = function (request) {  

	return $http.post(urlEnviarAuditoria,request);
};

this.obtenerFoto = function (request) {  

	return $http.post(urlComunUsuario.obtenerFotoUsuarioSession,request); 
};



this.departamento = function () {
	var departamento="/wps/wcm/connect/Mi Claro Content Library/Servicios Json/departamentos.json?subtype=json"	
		 var config={
			method:"GET",
			url:departamento
		  }
	return $http(config);
};

this.provincias = function () {
	var provincia="/wps/wcm/connect/Mi Claro Content Library/Servicios Json/provincias.json?subtype=json";	
	 var config={
		method:"GET",
		url:provincia
	  }
	return $http(config);
};

this.distritos = function () {
	var distrito="/wps/wcm/connect/Mi Claro Content Library/Servicios Json/distritos.json?subtype=json";	
	 var config={
		method:"GET",
		url:distrito
	  }
	return $http(config);
};

this.tipoVia = function () {
	var tipoVia="/wps/wcm/connect/Mi Claro Content Library/Servicios Json/tipoVia.json?subtype=json";	
	 var config={
		method:"GET",
		url:tipoVia
	  }
	return $http(config);
};


this.tipoUrbanizacion = function () {
	var tipoUrbanizacion="/wps/wcm/myconnect/Mi Claro Content Library/Servicios Json/tipoUrbanizacion.json?subtype=json";	
	var config={
		method:"GET",
		url:tipoUrbanizacion
	}
	return $http(config);
};


this.tipoVivienda = function () {
	var tipoVivienda="/wps/wcm/myconnect/Mi Claro Content Library/Servicios Json/tipoVivienda.json?subtype=json";	
	 var config={
		method:"GET",
		url:tipoVivienda
	  }
	return $http(config);
};

this.terminoCondiciones = function (nomyape,tipodoc,numdoc,codcliente,servicio,correo,cliente) {
	var termino="/wps/wcm/myconnect/mi claro content library/mi claro/terminos y condiciones/afiliacion recibo email?nomyape="+nomyape+"&tipodoc="+tipodoc+"&numdoc="+numdoc+"&cliente="+cliente+"&codcliente="+codcliente+"&servicio="+servicio+"&correo="+correo;	
	var config={
		method:"GET",
		url:termino
	}
	return $http(config);
};



this.obtenerListadoDirecciones = function (request) { 
	return $http.post(urlObtenerListadoDirecciones, request);
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
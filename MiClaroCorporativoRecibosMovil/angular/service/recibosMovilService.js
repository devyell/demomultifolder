var appServices = angular.module('MiClaroService', []);
appServices.service('recibosMovilService', function($http) {

    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var UrlObtenerServicios = urlConsultasComun.obtenerServicios;
    var UrlObtenerDatosUsuario = urlComunUsuario.obtenerDatosUsuarioSesion;
    var UrlEnviarAuditoria = urlComunUsuario.enviarAuditoria;
    var UrlServicioPrincipal = urlComunUsuario.obtenerDatosSesion;
    var UrlObtenerAfiliacionFacturacionElectronica = comprasyRecargasUrl.obtenerAfiliacionFacturacionElectronica;
    var UrlActualizarAfiliacionFacturacionElectronica = comprasyRecargasUrl.actualizarAfiliacionFacturacionElectronica
    var UrlObtenerDeudaPendiente = comprasyRecargasUrl.obtenerDeudaPendiente;
    var UrlObtenerRecibosProducto = comprasyRecargasUrl.obtenerRecibosProducto;
    var UrlObtenerDeudaPendientePorPagar = comprasyRecargasUrl.obtenerDeudaPendientePorPagar;
    var UrlRegistrarInicioTransaccionPagoTC = comprasyRecargasUrl.registrarInicioTransaccionPagoTC;
    var UrlRegistrarFinTransaccionPagoTC = comprasyRecargasUrl.registrarFinTransaccionPagoTC;
    var UrlObtenerRecibosFisico = comprasyRecargasUrl.obtenerRecibosFisico;
    var UrlObtenerListadoMovilCorporativoCuenta = urlConsultasComun.obtenerListadoMovilCorporativoCuenta;
    var UrlObtenerListadoMovilCorporativoRecibo = urlConsultasComun.obtenerListadoMovilCorporativoRecibo;
    var UrlActualizarProductoPrincipal = urlComunUsuario.actualizarProductoPrincipal;

    this.actualizarProductoPrincipal = function(actualizar) {
        return $http.post(UrlActualizarProductoPrincipal, actualizar);
    }

    this.getObtenerServicios = function(request) {
        return $http.post(UrlObtenerServicios, request);
    };

    this.obtenerDatosUsuarioSesion = function() {
        return $http.get(UrlObtenerDatosUsuario);
    };

    this.enviarAuditoria = function(request) {
        return $http.post(UrlEnviarAuditoria, request);
    };

    this.obtenerServicioPrincipal = function() {
        return $http.get(UrlServicioPrincipal);
    };

    this.obtenerAfiliacionFacturacionElectronica = function(request) {
        return $http.post(UrlObtenerAfiliacionFacturacionElectronica, request);
    };

    this.actualizarAfiliacionFacturacionElectronica = function(request) {
        return $http.post(UrlActualizarAfiliacionFacturacionElectronica, request);
    };

    this.obtenerDeudaPendiente = function(request) {
        return $http.post(UrlObtenerDeudaPendiente, request);
    };

    this.obtenerRecibosProducto = function(request) {
        return $http.post(UrlObtenerRecibosProducto, request);
    };

    this.obtenerDeudaPendientePorPagar = function(request) {
        return $http.post(UrlObtenerDeudaPendientePorPagar, request);
    };

    this.registrarInicioTransaccionPagoTC = function(request) {
        return $http.post(UrlRegistrarInicioTransaccionPagoTC, request);
    };

    this.registrarFinTransaccionPagoTC = function(request) {
        return $http.post(UrlRegistrarFinTransaccionPagoTC, request);
    };

    this.obtenerRecibosFisico = function(request) {
        return $http.post(UrlObtenerRecibosFisico, request);
    };

    this.getCuentasCoorporativos = function() {
        return $http.get(UrlObtenerListadoMovilCorporativoCuenta);
    };

    this.getReciboCoorporativos = function(request) {
        return $http.post(UrlObtenerListadoMovilCorporativoRecibo, request);
    };

    this.terminosCondiciones = function(o) {
        var termino = "/wps/wcm/myconnect/mi claro content library/mi claro/terminos y condiciones/afiliacion recibo email?nomyape=" + o.nombreApe + "&tipodoc=" + o.tipoDocu + "&numdoc=" + o.numDocu + "&cliente=" + o.modalidad + "&codcliente=" + o.codCliente + "&servicio=" + o.servicioTermi + "&correo=" + o.correoTermi;
        var config = {
            method: "GET",
            url: termino
        }
        return $http(config);
    };

});

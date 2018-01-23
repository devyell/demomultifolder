var appServices = angular.module('MiClaroService', []);

appServices.service('consultasOrdenDeServicioTecnicoService', function($http) {

    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var UrlObtenerOrdenesServicioTecnico = urlConsultasComun.obtenerOrdenesServicioTecnico;
    var UrlObtenerDetalleOrdenServicioTecnico = urlConsultasComun.obtenerDetalleOrdenServicioTecnico;
    var UrlCambiarEstadoOrdenServicioTecnico = urlConsultasComun.cambiarEstadoOrdenServicioTecnico;
    var UrlObtenerServicios = urlConsultasComun.obtenerServicios;
    var UrlObtenerListadoMovilCorporativoCuenta = urlConsultasComun.obtenerListadoMovilCorporativoCuenta;
    var UrlObtenerListadoMovilCorporativoRecibo = urlConsultasComun.obtenerListadoMovilCorporativoRecibo;
    var UrlObtenerListadoMoviles = urlConsultasComun.obtenerListadoMoviles;
    var UrlExportarReporteOrdenServicio = urlConsultasComun.exportarReporteOrdenServicio;
    var UrlEnviarAuditoria = urlComunUsuario.enviarAuditoria;
    var UrlObtenerDatosUsuario = urlComunUsuario.obtenerDatosUsuarioSesion;
    var UrlServicioPrincipal = urlComunUsuario.obtenerDatosSesion;
    var UrlActualizarProductoPrincipal = urlComunUsuario.actualizarProductoPrincipal;

    this.getOrdenesServicioTecnico = function(request) {
        return $http.post(UrlObtenerOrdenesServicioTecnico, request);
    };

    this.getDetalleOrdenServicioTecnico = function(request) {
        return $http.post(UrlObtenerDetalleOrdenServicioTecnico, request);
    };

    this.cambiarEstadoOrdenServicioTecnico = function(request) {
        return $http.post(UrlCambiarEstadoOrdenServicioTecnico, request);
    };

    this.getObtenerServicios = function(request) {
        return $http.post(UrlObtenerServicios, request);
    };

    this.getCuentasCoorporativos = function() {
        return $http.get(UrlObtenerListadoMovilCorporativoCuenta);
    };

    this.getReciboCoorporativos = function(request) {
        return $http.post(UrlObtenerListadoMovilCorporativoRecibo, request);
    };

    this.getObtenerListadoMovilCorporativoReciboAutoCompletar = function(request) {
        return $http.post(UrlObtenerListadoMoviles, request);
    };

    this.getExportarReporteOrdenServicio = function(request) {
        return $http.post(UrlExportarReporteOrdenServicio, request);
    };

    this.enviarAuditoria = function(request) {
        return $http.post(UrlEnviarAuditoria, request);
    };

    this.obtenerDatosUsuarioSesion = function() {
        return $http.get(UrlObtenerDatosUsuario);
    };

    this.obtenerServicioPrincipal = function() {
        return $http.get(UrlServicioPrincipal);
    };

    this.actualizarProductoPrincipal = function(request) {
        return $http.post(UrlActualizarProductoPrincipal, request);
    };
});

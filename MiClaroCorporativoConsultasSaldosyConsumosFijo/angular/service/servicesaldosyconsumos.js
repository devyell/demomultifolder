var servicesaldosyconsumos = angular.module('servicesSaldosyConsumosFijo', []);
servicesaldosyconsumos.service('servSaldosyConsumosFijo', ['$http', function($http) {
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };

    var UrlServicioPrincipal = urlComunUsuario.obtenerDatosSesion;
    var UrlObtenerServicios = urlConsultasComun.obtenerServicios;
    var UrlObtenerListadoFijoDireccion = urlConsultasComun.obtenerListadoFijoDireccion;
    var UrlObtenerPeriodosFacturacion = urlConsultasComun.obtenerPeriodosFacturacion;
    var UrlObtenerConsumoGeneralFija = urlConsultasComun.obtenerConsumoGeneralFija;
    var UrlObtenerDatosAdicionalesServicioFijo = urlConsultasComun.obtenerDatosAdicionalesServicioFijo;
    var UrlObtenerLineasFijas = urlConsultasComun.obtenerLineasFijas;
    var UrlObtenerListadoLineasFijas = urlConsultasComun.obtenerListadoLineasFijas;
    var UrlEnviarAuditoria = urlComunUsuario.enviarAuditoria;
    var UrlObtenerdatosSession = urlComunUsuario.obtenerDatosUsuarioSesion;
    var urlActualizarProductoPrincipal = urlComunUsuario.actualizarProductoPrincipal;

    this.actualizarProductoPrincipal = function(actualizar) {
        return $http.post(urlActualizarProductoPrincipal, actualizar);
    }

    this.obtenerDatosUsuarioSesion = function() {
        return $http.get(UrlObtenerdatosSession);
    }

    this.obtenerServicioPrincipal = function() {
        return $http.get(UrlServicioPrincipal);
    }

    this.obtenerListadoFijoDireccion = function(dataDireccion) {
        return $http.post(UrlObtenerListadoFijoDireccion, dataDireccion);
    }

    this.obtenerServiciosFijos = function(data) {
        return $http.post(UrlObtenerServicios, data);
    }

    this.obtenerPeriodosFacturacion = function(dataPeriodo) {
        return $http.post(UrlObtenerPeriodosFacturacion, dataPeriodo);
    }

    this.obtenerConsumoGeneralFija = function(dataFija) {
        return $http.post(UrlObtenerConsumoGeneralFija, dataFija);
    }

    this.obtenerDatosAdicionalesServicioFijo = function(dataAdicional) {
        return $http.post(UrlObtenerDatosAdicionalesServicioFijo, dataAdicional);
    }

    this.obtenerLinesFijas = function(datafijas) {
        return $http.post(UrlObtenerLineasFijas, datafijas);
    }

    this.obtenerListadoLineasFijas = function(dataAuto) {
        return $http.post(UrlObtenerListadoLineasFijas, dataAuto);
    }

    this.registrarAuditoria = function(dataAudi) {
        return $http.post(UrlEnviarAuditoria, dataAudi);
    }

}]);

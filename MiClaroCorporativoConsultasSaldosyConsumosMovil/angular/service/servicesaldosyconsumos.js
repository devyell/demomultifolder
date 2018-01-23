var servicesaldosyconsumos = angular.module('servicesSaldosyConsumos', []);
servicesaldosyconsumos.service('servSaldosyConsumos', ['$http', function($http) {
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };

    var urlServicioPrincipal = urlComunUsuario.obtenerDatosSesion;
    var urlListadoCuenta = urlConsultasComun.obtenerListadoMovilCorporativoCuenta;
    var urlListadoRecibo = urlConsultasComun.obtenerListadoMovilCorporativoRecibo;
    var urlObtenerServicios = urlConsultasComun.obtenerServicios;
    var urlObtenerDatosAdicionalesServicioMovil = urlConsultasComun.obtenerDatosAdicionalesServicioMovil;
    var urlObtenerConsumoGeneralMovilBolsa = urlConsultasComun.obtenerConsumoGeneralMovilBolsa;
    var urlObtenerConsumoGeneralMovilLineas = urlConsultasComun.obtenerConsumoGeneralMovil;
    var urlAutocomplete = urlConsultasComun.obtenerListadoMoviles;
    var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;
    var urlObtenerDatosUsuario = urlComunUsuario.obtenerDatosUsuarioSesion;
    var urlActualizarProductoPrincipal = urlComunUsuario.actualizarProductoPrincipal;


    this.actualizarProductoPrincipal = function(actualizar) {
        return $http.post(urlActualizarProductoPrincipal,actualizar);
    }
    this.obtenerDatosUsuarioSesion = function() {
        return $http.get(urlObtenerDatosUsuario);
    }

    this.obtenerServicioPrincipal = function() {
        return $http.get(urlServicioPrincipal);
    }

    this.obtenerListadoMovilCorporativoCuenta = function() {
        return $http.get(urlListadoCuenta);
    }

    this.obtenerObtenerListadoMovilCorporativoRecibo = function(dataRecibo) {
        return $http.post(urlListadoRecibo, dataRecibo);
    }

    this.obtenerServiciosCorporativos = function(data) {
        return $http.post(urlObtenerServicios, data);
    }

    this.obtenerDatosAdicionalesServicioMovil = function(dataAdicional) {
        return $http.post(urlObtenerDatosAdicionalesServicioMovil, dataAdicional);
    }

    this.obtenerConsumoGeneralMovilBolsa = function(dataConsumo) {
        return $http.post(urlObtenerConsumoGeneralMovilBolsa, dataConsumo);
    }

    this.obtenerConsumoGeneralMovilLineas = function(dataConsumoLineas) {
        return $http.post(urlObtenerConsumoGeneralMovilLineas, dataConsumoLineas);
    }

    this.obtenerServiciosAutocomplete = function(dataAuto) {
        return $http.post(urlAutocomplete, dataAuto);
    }

    this.guardarAuditoria = function(dataAudi) {
        return $http.post(urlEnviarAuditoria, dataAudi);
    }
}]);

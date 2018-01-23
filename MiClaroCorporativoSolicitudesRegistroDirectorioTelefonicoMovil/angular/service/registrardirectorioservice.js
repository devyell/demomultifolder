var serviceDirectorioTelefonico = angular.module('servicesDirectorioTelefonicoCorpoMovil', []);
serviceDirectorioTelefonico.service('servDirectorioCorpoMovil', ['$http', function($http) {
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };

    var urlObtenerListadoMovilCorporativoCuenta = comprasyRecargasUrl.obtenerListadoMovilCorporativoCuenta;
    var urlObtenerListadoMovilCorporativoRecibo = comprasyRecargasUrl.obtenerListadoMovilCorporativoRecibo;
    var urlObtenerDirectorioTelefonico = comprasyRecargasUrl.obtenerDirectorioTelefonico;
    var urlModificarAfiliacionDirectorioTelefonico = comprasyRecargasUrl.modificarAfiliacionDirectorioTelefonico;
    var urlObtenerDatosSesion = urlComunUsuario.obtenerDatosSesion;
    var urlObtenerDatosUsuarioSesion = urlComunUsuario.obtenerDatosUsuarioSesion;
    var urlObtenerServicios = comprasyRecargasUrl.obtenerServicios;
    var urlObtenerListadoMoviles = comprasyRecargasUrl.obtenerListadoMoviles;
    var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;

    var urlActualizarProductoPrincipal = urlComunUsuario.actualizarProductoPrincipal;


    this.actualizarProductoPrincipal = function(actualizar) {
        return $http.post(urlActualizarProductoPrincipal,actualizar);
    }
    
    this.obtenerDatosUsuario = function() {
        return $http.get(urlObtenerDatosUsuarioSesion);
    }

    this.obtenerProductoPrincipal = function() {
        return $http.get(urlObtenerDatosSesion);
    }

    this.obtenerListadoMovilCorporativoCuenta = function() {
        return $http.get(urlObtenerListadoMovilCorporativoCuenta);
    }

    this.obtenerListadoMovilCorporativoRecibo = function(recibo) {
        return $http.post(urlObtenerListadoMovilCorporativoRecibo, recibo);
    }

    this.obtenerDirectorioTelefonico = function(directorio) {
        return $http.post(urlObtenerDirectorioTelefonico, directorio);
    }

    this.modificarAfiliacionDirectorioTelefonico = function(modificar) {
        return $http.post(urlModificarAfiliacionDirectorioTelefonico, modificar);
    }

    this.obtenerServiciosCorporativos = function(data1) {
        return $http.post(urlObtenerServicios,data1);
    }

     this.obtenerListadoMovilesAutocomplete = function(data2) {
        return $http.post(urlObtenerListadoMoviles,data2);
    }

     this.guardarAuditoria = function(audi) {
        return $http.post(urlEnviarAuditoria, audi);
    }

}]);

var serviceDirectorioTelefonico = angular.module('servicesDirectorioTelefonicoCorpoFijo', []);
serviceDirectorioTelefonico.service('servDirectorioCorpoFijo', ['$http', function($http) {
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };

    
    var urlObtenerListadoFijoDireccion = comprasyRecargasUrl.obtenerListadoFijoDireccion;
    var urlObtenerDirectorioTelefonico = comprasyRecargasUrl.obtenerDirectorioTelefonico;
    var urlModificarAfiliacionDirectorioTelefonico = comprasyRecargasUrl.modificarAfiliacionDirectorioTelefonico;
    var urlObtenerDatosSesion = urlComunUsuario.obtenerDatosSesion;
    var urlObtenerDatosUsuarioSesion = urlComunUsuario.obtenerDatosUsuarioSesion;
    var urlObtenerServicios = comprasyRecargasUrl.obtenerServicios;
    var urlObtenerListadoLineasFijas = comprasyRecargasUrl.obtenerListadoLineasFijas;
    var urlEnviarAuditoria = urlComunUsuario.enviarAuditoria;
    var urlObtenerLineasFijas = comprasyRecargasUrl.obtenerLineasFijas;
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

    this.obtenerListadoFijoDireccion = function(direcciones) {
        return $http.post(urlObtenerListadoFijoDireccion,direcciones);
    }

    this.obtenerDirectorioTelefonico = function(directorio) {
        return $http.post(urlObtenerDirectorioTelefonico, directorio);
    }

    this.modificarAfiliacionDirectorioTelefonico = function(modificar) {
        return $http.post(urlModificarAfiliacionDirectorioTelefonico, modificar);
    }

    this.obtenerServiciosFijos = function(data1) {
        return $http.post(urlObtenerServicios, data1);
    }

    this.obtenerLineasFijas = function(fijos) {
        return $http.post(urlObtenerLineasFijas, fijos);
    }

    this.obtenerListadoLineasFijasAutocomplete = function(data2) {
        return $http.post(urlObtenerListadoLineasFijas, data2);
    }

    this.guardarAuditoria = function(audi) {
        return $http.post(urlEnviarAuditoria, audi);
    }
}]);

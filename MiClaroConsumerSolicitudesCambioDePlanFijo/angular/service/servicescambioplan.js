var appCambioPlan = angular.module('serviceCambioPlanConsumer', []);

appCambioPlan.service('srvCambioPlanFijo', ['$http', function($http) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };

    var urlObtenerDatosSesion = urlComunUsuario.obtenerDatosSesion;
    var urlObtenerDatosUsuarioSesion = urlComunUsuario.obtenerDatosUsuarioSesion;
    var urlGuardarAuditoria = urlComunUsuario.enviarAuditoria;
    var urlObtenerPlanSugerido = comprasyRecargasUrl.obtenerPlanSugerido;
    var urlSolicitarPlan = comprasyRecargasUrl.solicitarPlan;
    var urlObtenerDatosAdicionalesServicioFijo = comprasyRecargasUrl.obtenerDatosAdicionalesServicioFijo;
    var urlActualizarProductoPrincipal = urlComunUsuario.actualizarProductoPrincipal;
    var urlObtenerServicios = comprasyRecargasUrl.obtenerServicios;
    


    this.obtenerProductoPrincipal = function() {
        return $http.get(urlObtenerDatosSesion);
    }
    this.obtenerTipoCliente = function() {
        return $http.get(urlObtenerDatosUsuarioSesion);
    }

    this.actualizarProductoPrincipal = function(actualizar) {
        return $http.post(urlActualizarProductoPrincipal, actualizar);
    }

    this.guardarAuditoria = function(audi) {
        return $http.post(urlGuardarAuditoria, audi);
    }

    this.obtenerPlanSugerido = function(sugerido) {
        return $http.post(urlObtenerPlanSugerido, sugerido);
    }

    this.solicitarNuevoServicio = function(plan) {
        return $http.post(urlSolicitarPlan, plan);
    }

    this.obtenerDatosAdicionalesServicioFijo = function(adicional) {
        return $http.post(urlObtenerDatosAdicionalesServicioFijo, adicional);
    }

    this.obtenerServicios = function(data) {
        return $http.post(urlObtenerServicios, data);
    }

    
}]);

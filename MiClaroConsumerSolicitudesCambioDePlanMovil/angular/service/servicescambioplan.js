var appCambioPlan = angular.module('serviceCambioPlanConsumer', []);

appCambioPlan.service('srvCambioPlanMovil', ['$http', function($http) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };

    var urlObtenerDatosSesion = urlComunUsuario.obtenerDatosSesion;
    var urlObtenerDatosUsuarioSesion = urlComunUsuario.obtenerDatosUsuarioSesion;
    var urlGuardarAuditoria = urlComunUsuario.enviarAuditoria;
    var urlSolicitarPlan = comprasyRecargasUrl.solicitarPlan;
    var urlObtenerDatosAdicionalesServicioMovil = comprasyRecargasUrl.obtenerDatosAdicionalesServicioMovil;
    var urlObtenerServicios = comprasyRecargasUrl.obtenerServicios;
    var urlObtenerPlanSugerido = comprasyRecargasUrl.obtenerPlanSugerido;
    var urlActualizarProductoPrincipal = urlComunUsuario.actualizarProductoPrincipal;

    this.obtenerProductoPrincipal = function() {
        return $http.get(urlObtenerDatosSesion);
    }
    this.obtenerTipoCliente = function() {
        return $http.get(urlObtenerDatosUsuarioSesion);
    }

    this.actualizarProductoPrincipal = function(actualizar) {
        return $http.post(urlActualizarProductoPrincipal,actualizar);
    }

    this.guardarAuditoria = function(audi) {
        return $http.post(urlGuardarAuditoria, audi);
    }

    this.solicitarNuevoServicio = function(plan) {
        return $http.post(urlSolicitarPlan, plan);
    }

    this.obtenerDatosAdicionalesServicioMovil = function(adicional) {
        return $http.post(urlObtenerDatosAdicionalesServicioMovil, adicional);
    }

    this.obtenerServiciosConsumer = function(servicios) {
        return $http.post(urlObtenerServicios, servicios);
    }

    this.obtenerPlanSugerido = function(planes) {
        return $http.post(urlObtenerPlanSugerido, planes);
    }


}]);

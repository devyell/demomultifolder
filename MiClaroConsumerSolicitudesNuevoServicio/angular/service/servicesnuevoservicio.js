var appNuevoService = angular.module('serviceNuevoServicioConsumer', []);

appNuevoService.service('srvNuevoServicio', ['$http', function($http) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };

    
    var urlObtenerDatosUsuarioSesion = urlComunUsuario.obtenerDatosUsuarioSesion;
    var urlGuardarAuditoria = urlComunUsuario.enviarAuditoria;
    var urlObtenerCriterios = comprasyRecargasUrl.obtenerCriterios;
    var urlDevolverPlanPorCriterios = comprasyRecargasUrl.devolverPlanPorCriterios;
    var urlSolicitarPlan = comprasyRecargasUrl.solicitarPlan;

    
    this.obtenerTipoCliente = function() {
        return $http.get(urlObtenerDatosUsuarioSesion);
    }

    this.guardarAuditoria = function(audi) {
        return $http.post(urlGuardarAuditoria,audi);
    }

    this.obtenerCriterios = function() {
        return $http.get(urlObtenerCriterios);
    }

    this.devolverPlanPorCriterios = function(planxcriterio) {
        return $http.post(urlDevolverPlanPorCriterios,planxcriterio);
    }

    this.solicitarNuevoServicio = function(plan) {
        return $http.post(urlSolicitarPlan,plan);
    }
}]);

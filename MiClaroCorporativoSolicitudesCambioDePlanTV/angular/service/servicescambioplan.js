var appNuevoService = angular.module('serviceCambioPlanCorporativo', []);

appNuevoService.service('srvCambioPlanTv', ['$http', function($http) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };

   var urlObtenerDatosUsuario =  urlComunUsuario.obtenerDatosUsuarioSesion;
   var urlSolicitarNuevoServicio =  comprasyRecargasUrl.solicitarPlan;
   var urlGuardarAuditoria = urlComunUsuario.enviarAuditoria;

    this.guardarAuditoria = function(audi) {
        return $http.post(urlGuardarAuditoria, audi);
    }
    
   this.obtenerDatosUsuario = function() {
        return $http.get(urlObtenerDatosUsuario);
    }

    this.solicitarNuevoServicios = function(dataGuardar) {
        return $http.post(urlSolicitarNuevoServicio, dataGuardar);
    }

}]);

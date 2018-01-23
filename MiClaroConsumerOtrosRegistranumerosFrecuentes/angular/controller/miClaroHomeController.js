var appController = angular.module('MiClaroController', []);
appController.controller("MiClaroHomeController", function($scope, $http, $httpParamSerializer, serviceHome) {


    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

 

    var tipoCliente = "";
    var categoriaPrincipal = "";

    serviceHome.getObtenerDatosSesion().then(function(response) {
 
        categoriaPrincipal = response.data.comunResponseType.categoria;
        tipoCliente = response.data.comunResponseType.tipoClienteProductoPrincipal;
        $scope.datosSesionError = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        $scope.datosSesionIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;

		 var href='';	 
        
        if (categoriaPrincipal == 1) {
           
           href="/wps/portal/miclaro/consumer/otros/registranumerosfrecuentes/movil";
        } else if (categoriaPrincipal == 2) {
          
            href="/wps/portal/miclaro/consumer/otros/registranumerosfrecuentes/fijo";
        } else if (categoriaPrincipal == 3) {
           
            href="/wps/portal/miclaro/consumer/otros/registranumerosfrecuentes/internet";
        } else if (categoriaPrincipal == 4) {
             href="/wps/portal/miclaro/consumer/otros/registranumerosfrecuentes/tv";
        }else {
		 href="/wps/portal/miclaro/consumer/otros/registranumerosfrecuentes/movil";
		}
        $(location).attr('href', href);

    }, function(error) {

    });

    function auditoria(ResquestAuditoria) {

        ResquestAuditoria = $httpParamSerializer({ requestJson: angular.toJson(ResquestAuditoria) });
        serviceHome.enviarAuditoria(ResquestAuditoria).then(function(response) {

           
        }, function(error) {
            
        });
    }

});

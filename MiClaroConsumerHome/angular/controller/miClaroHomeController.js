miClaroApp.controller("MiClaroHomeController", function($scope, $http, $httpParamSerializer, serviceHome) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var tipoCliente = "";
    var categoriaPrincipal = "";
    var requestAuditoria = {
        operationCode: 'T0001',
        pagina: '',
        transactionId: '',
        estado: '',
        servicio: '',
        tipoProducto: '',
        tipoLinea: '',
        tipoUsuario: '',
        perfil: '',
        monto: '',
        descripcionoperacion: 'consultaHome',
        responseType: ''
    };

    serviceHome.getObtenerDatosSesion().then(function(response) {

        $scope.datosSesionError = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        $scope.transactionId = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
        $scope.mensaje = response.data.comunResponseType.defaultServiceResponse.mensaje;
        

        if ($scope.datosSesionError == 0) {

            categoriaPrincipal = response.data.comunResponseType.categoria;
            tipoCliente = response.data.comunResponseType.tipoClienteProductoPrincipal;

            if (categoriaPrincipal == 2) {
                window.location.replace("/wps/myportal/miclaro/consumer/home/fijo");
            } else if (categoriaPrincipal == 3) {
                window.location.replace("/wps/myportal/miclaro/consumer/home/internet");
            } else if (categoriaPrincipal == 4) {
                window.location.replace("/wps/myportal/miclaro/consumer/home/tv");
            } else {
                window.location.replace("/wps/myportal/miclaro/consumer/home/movil");
            }
        } else {
            window.location.replace("/wps/myportal/miclaro/error");
            requestAuditoria.transactionId = $scope.transactionId;
            requestAuditoria.estado = 'ERROR';
            requestAuditoria.descripcionoperacion = $scope.mensaje;
            auditoria();
        }

    }, function(error) {

    });

    function auditoria() {

        auditoriaReq = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });
        serviceHome.enviarAuditoria(auditoriaReq).then(function(response) {

        }, function(error) {

        });
    }

});

var appController = angular.module('ctrlNuevoServicioCorporativo', []);

appController.controller('ctrlNuevoServicioInternet', ['$scope', '$http', '$timeout', 'srvNuevoServicioInternet', '$httpParamSerializer',
    function($scope, $http, $timeout, srvNuevoServicioInternet, $httpParamSerializer) {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        var flagSolicitarPlan = "1";
        var tipoClienteCorporativo = WPSTipoCliente.corporativo;
        var categoriaCorporativo = WPSCategoria.internet;

        var urlConsumer = '/wps/myportal/miclaro/consumer/solicitudes/nuevoservicio';
        var pageIdNuevoServicio = WPSPageID.miclaro_corporativo_solicitudes_nuevoservicio_internet;
        var codOperacionNuevoServicio = WPSTablaOperaciones.solicitarNuevoServicio;
        var estadoExito = 'SUCCESS';
        var estadoError = 'ERROR';
        var tipoProductoFijo = 'INTERNET';
        $scope.mostrarSwitchCorporativo = false;
        $scope.switchSelect = true;
        $scope.errorTotalRedirect = false;
        $scope.mostrarInfoCorporativo = true;
        $scope.mensaje_error_titulo = WPSMensajeError.upps;
        $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
        $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion03;
        $scope.urlInicio = '/wps/myportal/miclaro/corporativo/solicitudes/nuevoservicio/internet';
        var nombreLinea = '-';
        var tipoLineaAuditoria = 5;
        var tipoClienteSession = '-';

        angular.element(document).ready(function() {
            init();
        });

        function init() {
            srvNuevoServicioInternet.obtenerDatosUsuario().then(function(response) {
                tipoClienteSession = response.data.comunResponseType.tipoCliente;
                nombreLinea = response.data.comunResponseType.idDireccion;
                if (nombreLinea == '') {
                    nombreLinea = response.data.comunResponseType.idRecibo;
                }
                var flagInternetSesion = parseInt(response.data.comunResponseType.flagProductoInternetSesion);

                if (flagInternetSesion == -1) {
                    $scope.errorTotalRedirect = true;
                    $scope.mostrarInfoCorporativo = false;
                }

                if (tipoClienteSession == 4) {
                    $scope.mostrarSwitchCorporativo = true;
                }
            }, function(error) {

            });
        };

        $scope.switchChange = function() {
            window.location.href = urlConsumer;
        };

        $scope.solicitarNuevoServicio = function() {
            abrirPopUp();
            var dataPlan = dataSolicitarPlan();
            srvNuevoServicioInternet.solicitarNuevoServicios(dataPlan).then(function(response) {
                var rpta = parseInt(response.data.solicitarPlanResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.solicitarPlanResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.solicitarPlanResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    var respuestaPlan = response.data.solicitarPlanResponse.resultado;
                    if (respuestaPlan == "true") {
                        $timeout(function() {
                            mostrarConfirmacion();
                        }, 1050);
                    } else {
                        $timeout(function() {
                            mostrarError();
                        }, 1050);
                    }
                    guardarAuditoria(rpta, idTransaccion, "-");
                } else {
                    $timeout(function() {
                        mostrarError();
                    }, 1050);
                    var mensajeAuditoria = 'solicitarPlan -' + mensajeServicio;
                    guardarAuditoria(rpta, idTransaccion, mensajeAuditoria);
                }
            }, function(error) {

            });


        };

        $scope.cerrarPopup = function() {
            esconderPopUp();
        };

        function dataSolicitarPlan() {
            var requestSolicitarPlan = {
                "tipoOperacion": null,
                "tipoCliente": null,
                "categoria": null,
                "idCuenta": null,
                "idRecibo": null,
                "idDireccion": null,
                "idProductoServicio": null,
                "idTipoProductoServicio": null,
                "idPlan": null,
                "tipoPlan": null
            }
            requestSolicitarPlan.tipoOperacion = flagSolicitarPlan;
            requestSolicitarPlan.tipoCliente = tipoClienteCorporativo;
            requestSolicitarPlan.categoria = categoriaCorporativo;

            dataListDir = $httpParamSerializer({ requestJson: angular.toJson(requestSolicitarPlan) });
            return dataListDir;
        };

        function guardarAuditoria(rpta, idTransaccion, mensajeAuditoria) {
            if (rpta != 0) {
                var dataAuditoria = dataAuditoriaRequest(idTransaccion, estadoError, mensajeAuditoria);
            } else {
                var dataAuditoria = dataAuditoriaRequest(idTransaccion, estadoExito, mensajeAuditoria);
            }

            srvNuevoServicioInternet.guardarAuditoria(dataAuditoria).then(function(response) {}, function(error) {

            });
        };

        function dataAuditoriaRequest(transactionId, estadoAuditoria, mensajeAuditoria) {
            var requestAuditoria = {
                operationCode: null,
                pagina: null,
                transactionId: null,
                estado: null,
                servicio: null,
                tipoProducto: null,
                tipoLinea: null,
                tipoUsuario: null,
                perfil: null,
                monto: null,
                descripcionoperacion: null,
                responseType: null
            }
            requestAuditoria.operationCode = codOperacionNuevoServicio;
            requestAuditoria.pagina = pageIdNuevoServicio;
            requestAuditoria.transactionId = transactionId;
            requestAuditoria.estado = estadoAuditoria;
            requestAuditoria.servicio = nombreLinea;
            requestAuditoria.tipoProducto = tipoProductoFijo;
            requestAuditoria.tipoLinea = tipoLineaAuditoria;
            requestAuditoria.tipoUsuario = tipoClienteSession;
            requestAuditoria.perfil = '-';
            requestAuditoria.monto = '';
            requestAuditoria.descripcionoperacion = mensajeAuditoria;
            requestAuditoria.responseType = '-';

            dataAuditoria = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });
            return dataAuditoria;
        };

    }
]);

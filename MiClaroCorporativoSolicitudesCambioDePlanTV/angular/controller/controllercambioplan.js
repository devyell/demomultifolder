var appController = angular.module('ctrlCambioPlanCorporativo', []);

appController.controller('ctrlCambioPlanTv', ['$scope', '$http', '$timeout', 'srvCambioPlanTv', '$httpParamSerializer',
    function($scope, $http, $timeout, srvCambioPlanTv, $httpParamSerializer) {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        $scope.mensaje_error_titulo = WPSMensajeError.upps;
        $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
        $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion03;
        var flagSolicitarPlan = 2;
        var tipoClienteCorporativo = WPSTipoCliente.corporativo;
        var categoriaCorporativo = WPSCategoria.tv;
        $scope.mostrarServicios = false;
        $scope.showSinServicios = false;
        $scope.errorTotalRedirect = false;
        $scope.mostrarDataCambioPlan = false;
        var urlConsumer = '/wps/myportal/miclaro/consumer/solicitudes/cambiodeplan/tv';
        var codOperacionCambioPlan = WPSTablaOperaciones.solicitarCambioPlan;
        var pageIdeCambioPlan = WPSPageID.miclaro_corporativo_solicitudes_cambiodeplan_tv;
        var estadoExito = 'SUCCESS';
        var estadoError = 'ERROR';
        var tipoProductoFijo = 'CLAROTV';
        $scope.mostrarSwitchCorporativo = false;
        $scope.switchSelect = true;
        var nombreLinea = '-';
        var tipoLineaAuditoria = 5;
        var tipoClienteSession = '-';

        angular.element(document).ready(function() {
            init();
        });

        function init() {
            srvCambioPlanTv.obtenerDatosUsuario().then(function(response) {
                $scope.mostrarServicios = true;
                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                if (rpta == 0) {
                    var flagTvSesion = parseInt(response.data.comunResponseType.flagProductoTVSesion);
                    tipoClienteSession = response.data.comunResponseType.tipoCliente;
                    nombreLinea = response.data.comunResponseType.idDireccion;
                    if (nombreLinea == '') {
                        nombreLinea = response.data.comunResponseType.idRecibo;
                    }

                    if (flagTvSesion == 2 || flagTvSesion == 3) {
                        $scope.mostrarDataCambioPlan = true;
                    } else if (flagTvSesion == -1) {
                        $scope.errorTotalRedirect = true;
                        var mensajeAuditoria = 'obtenerServicios -' + 'flagTv';
                        guardarAuditoria(flagTvSesion, idTransaccion, mensajeAuditoria);
                    } else {
                        $scope.showSinServicios = true;
                        guardarAuditoria(rpta, idTransaccion, '-');
                    }
                    if (tipoClienteSession == 4) {
                        $scope.mostrarSwitchCorporativo = true;
                    }
                } else {
                    $scope.errorTotalRedirect = true;
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
            srvCambioPlanTv.solicitarNuevoServicios(dataPlan).then(function(response) {
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
                    guardarAuditoria(rpta, idTransaccion,"-");
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

        function guardarAuditoria(rpta, idTransaccion,mensajeAuditoria) {
            if (rpta != 0) {
                var dataAuditoria = dataAuditoriaRequest(idTransaccion, estadoError,mensajeAuditoria);
            } else {
                var dataAuditoria = dataAuditoriaRequest(idTransaccion, estadoExito,mensajeAuditoria);
            }

            srvCambioPlanTv.guardarAuditoria(dataAuditoria).then(function(response) {}, function(error) {
            });
        };

        function dataAuditoriaRequest(transactionId, estadoAuditoria,mensajeAuditoria) {
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
            requestAuditoria.operationCode = codOperacionCambioPlan;
            requestAuditoria.pagina = pageIdeCambioPlan;
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

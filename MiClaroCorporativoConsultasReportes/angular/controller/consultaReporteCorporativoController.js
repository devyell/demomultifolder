app.controller("ConsultaReporteCorporativoController", function($scope, $timeout, $location, $httpParamSerializer, FileSaver, Blob, consultaReporteCorporativoService) {

    $scope.tipoReporte = { "facturacionDetallada": false, "detalleTodasLineas": false, "consolidadoMinutos": false, "relacionPlanes": false };

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion03 = WPSMensajeError.upps_descripcion03;

    $scope.upps = WPSMensajeError.upps;
    $scope.mensaje1 = WPSMensajeError.mensaje1;
    $scope.mensaje3 = WPSMensajeError.mensaje3;
    $scope.mensaje5 = WPSMensajeError.mensaje5;

    $scope.ayCaramba = WPSMensajeError.exlamacion1;

    var operacionObtenerServicio = 'getObtenerServicios';
    var operacionObtenerCuenta = 'obtenerListadoMovilCorporativoCuenta';
    var operacionObtenerRecibos = 'obtenerListadoMovilCorporativoRecibo';
    var operacionObtenerPeriodos = 'obtenerPeriodosFacturacion';
    var operacionObtenerEstadoReporte = 'obtenerEstadoReportes';
    var operacionSolicitarReporte = 'solicitarReporte';
    var operacionObtenerReporte = 'obtenerReporte';

    var codDescargaReporte = WPSTablaOperaciones.descargarReporte;
    var codGenerarReporte = WPSTablaOperaciones.generarReporte;
    var codConsultarReporte = WPSTablaOperaciones.consultarReportesGenerados;
    var pageIdReportesCorporativos = WPSPageID.miclaro_corporativo_consultas_reportes;

    var categoriaMovil = WPSCategoria.movil;
    $scope.mostrarReportes = false;
    $scope.mostrarSolicitudes = false;
    $scope.checkRadioSolicitudes = true;
    $scope.checkRadioReportes = false;
    var servicioParam = '';
    var estadoExito = 'SUCCESS';
    var estadoError = 'ERROR';
    var tipoProductoMovil = 'MOVIL';
    var permisoAuditoria = '-';

    this.inicializar = function() {

        obtenerFlagProductoMovilAdminSesionFn();

    };

    this.inicializar();

    function obtenerFlagProductoMovilAdminSesionFn() {
        consultaReporteCorporativoService.obtenerDatosUsuarioSesion().then(function(response) {
            var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            if (rpta == 0) {
                $scope.tipoClienteSession = response.data.comunResponseType.tipoCliente;
                var flagProductoMovilSesion = response.data.comunResponseType.flagProductoMovilSesion;

                if (flagProductoMovilSesion == "2" || flagProductoMovilSesion == "3") {
                    $scope.obtenerServicioPrincipal();
                } else if (flagProductoMovilSesion == "0" || flagProductoMovilSesion == "1") {
                    registrarAuditoriaExito(rpta, idTransaccion, "FLAG");
                    $location.path("/nuevoServicioView");

                } else if (flagProductoMovilSesion == "-1") {

                    var mensajeAuditoria = operacionObtenerServicio + "- flagMovil";
                    registrarAuditoriaError(flagProductoMovilSesion, idTransaccion, mensajeAuditoria, null);
                    $location.path("/errorWiew");
                }

            } else {
                $location.path("/errorWiew");
            }

        }, function(error) {});
    };

    $scope.obtenerServicioPrincipal = function() {
        consultaReporteCorporativoService.obtenerServicioPrincipal().then(function(response) {
            var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;

            if (rpta == 0) {
                var categoriaPrincipal = response.data.comunResponseType.categoria;
                var tipoClientePrincipal = response.data.comunResponseType.tipoClienteProductoPrincipal;
                servicioParam = response.data.comunResponseType.nombre;
                if (tipoClientePrincipal == WPSTipoCliente.corporativo) {
                    $scope.lineaPrincipal = response.data.comunResponseType.nombreProductoPrincipal;
                    $scope.consultaReporteCorporativoCtr.idCuentaPrincipal = response.data.comunResponseType.idCuenta;
                    $scope.consultaReporteCorporativoCtr.idReciboPrincipal = response.data.comunResponseType.idRecibo;

                } else {
                    $scope.consultaReporteCorporativoCtr.idCuentaPrincipal = null;
                    $scope.consultaReporteCorporativoCtr.idReciboPrincipal = null;
                }

                getCuentasCoorporativosFn();

            } else {
                $location.path("/errorWiew");
            }
        }, function(error) {
            $location.path("/errorWiew");
        });
    };

    function getCuentasCoorporativosFn() {
        consultaReporteCorporativoService.getCuentasCoorporativos().then(function(response) {
            var rpta = parseInt(response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.mensaje;

            if (rpta == 0) {
                var dataCuentas = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta;
                $scope.cuentasCorporativasList = [];

                if (dataCuentas != undefined && dataCuentas != '') {
                    if (angular.isArray(dataCuentas)) {
                        $scope.cuentasCorporativasList = dataCuentas;
                    } else {
                        $scope.cuentasCorporativasList.push(dataCuentas);
                    }

                    if ($scope.consultaReporteCorporativoCtr.idCuentaPrincipal != null) {
                        angular.forEach($scope.cuentasCorporativasList, function(val, key) {
                            if (val.idCuenta === $scope.consultaReporteCorporativoCtr.idCuentaPrincipal) {
                                $scope.selectIdCuenta = $scope.cuentasCorporativasList[key];
                            }
                        });
                    } else {
                        $scope.selectIdCuenta = $scope.cuentasCorporativasList[0];
                    }
                    servicioParam = $scope.selectIdCuenta.idCuenta;
                    $scope.consultaReporteCorporativoCtr.obtenerRecibos();
                }
            } else {
                var mensajeAuditoria = operacionObtenerCuenta + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, null);
                $location.path("/errorWiew");
            }
        }, function(error) {
            $location.path("/errorWiew");
        });
    };

    this.obtenerRecibos = function() {


        var idCuenta = $scope.selectIdCuenta.idCuenta;

        var requestReciboCoor = {
            "idCuenta": idCuenta
        };

        var dataReciboCoor = $httpParamSerializer({ requestJson: angular.toJson(requestReciboCoor) });

        consultaReporteCorporativoService.getReciboCoorporativos(dataReciboCoor).then(function(response) {
            var rpta = parseInt(response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.mensaje;


            if (rpta == 0) {
                var dataRecibosList = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo;
                $scope.recibosCorporativosList = [];
                
                if (angular.isArray(dataRecibosList)) {
                    $scope.recibosCorporativosList = dataRecibosList;


                } else {

                    $scope.recibosCorporativosList.push(dataRecibosList);
                }
                var breakLoopP = false;
                if ($scope.consultaReporteCorporativoCtr.idReciboPrincipal != null) {
                    angular.forEach($scope.recibosCorporativosList, function(val, key) {
                        if (!breakLoopP) {
                            if (val.idRecibo === $scope.consultaReporteCorporativoCtr.idReciboPrincipal) {
                                $scope.selectIdRecibo = $scope.recibosCorporativosList[key];
                                breakLoopP = true;
                            } else {
                                $scope.selectIdRecibo = $scope.recibosCorporativosList[0];
                            }
                        }
                    });
                }

                $scope.consultaReporteCorporativoCtr.obtenerPeriodosFacturacion();
                registrarAuditoriaExito(rpta, idTransaccion, "CONSULTAR");
            } else {
                var mensajeAuditoria = operacionObtenerRecibos + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, null);
                $location.path("/errorWiew");
            }
        }, function(response) {
            $location.path("/errorWiew");
        });
    };

    $scope.changeCuenta = function() {

        $scope.consultaReporteCorporativoCtr.obtenerRecibos();

    };

    $scope.changeRecibo = function() {

        $scope.consultaReporteCorporativoCtr.obtenerPeriodosFacturacion();

    };


    this.obtenerPeriodosFacturacion = function() {
        var idCuenta = $scope.selectIdCuenta.idCuenta;
        var idRecibo = $scope.selectIdRecibo.idRecibo;

        var requestPeriodoFacturacion = {
            "categoria": categoriaMovil,
            "idProductoServicio": "",
            "idDireccion": "",
            "idLinea": "",
            "idCuenta": idCuenta,
            "idRecibo": idRecibo,
            "cantPeriodos": "3",
            "flagSoloPeriodosFacturados": "true"

        };

        data = $httpParamSerializer({ requestJson: angular.toJson(requestPeriodoFacturacion) });

        consultaReporteCorporativoService.obtenerPeriodosFacturacion(data).then(function(response) {
            var rptaExito = response.data.obtenerPeriodosFacturacionResponse.defaultServiceResponse.idRespuesta;
            var idTransaccion = response.data.obtenerPeriodosFacturacionResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerPeriodosFacturacionResponse.defaultServiceResponse.mensaje;

            if (rptaExito == 0) {
                var dataPeriodosList = response.data.obtenerPeriodosFacturacionResponse.listado;
                $scope.periodosFacturacionList = [];
                if (dataPeriodosList != undefined && dataPeriodosList != '') {
                    $scope.mostrarSolicitudes = true;
                    if (angular.isArray(dataPeriodosList)) {
                        $scope.periodosFacturacionList = dataPeriodosList;
                    } else {
                        $scope.periodosFacturacionList.push(dataPeriodosList);
                    }

                    $scope.periodoFacturacion = $scope.periodosFacturacionList[0];
                }
            } else {
                var mensajeAuditoria = operacionObtenerPeriodos + "-" + mensajeServicio;
                registrarAuditoriaError(rptaExito, idTransaccion, mensajeAuditoria, null);
                $location.path("/errorWiew");
            }

        }, function(error) {
            $location.path("/errorWiew");
        });
    };


    function obtenerEstadoReportesFn() {
        var estadoReporte = null;
        consultaReporteCorporativoService.obtenerEstadoReportes().then(function(response) {
            var rpta = parseInt(response.data.obtenerEstadoReportesResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerEstadoReportesResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerEstadoReportesResponse.defaultServiceResponse.mensaje;

            if (rpta == 0) {
                var dataEstadoReportesList = response.data.obtenerEstadoReportesResponse.listaReportes;
                $scope.estadoReportesList = [];

                if (dataEstadoReportesList != undefined && dataEstadoReportesList != '') {
                    if (angular.isArray(dataEstadoReportesList)) {
                        $scope.estadoReportesList = dataEstadoReportesList;
                    } else {
                        $scope.estadoReportesList.push(dataEstadoReportesList);
                    }

                    angular.forEach($scope.estadoReportesList, function(val, key) {
                        estadoReporte = $scope.estadoReportesList[key];

                        if (estadoReporte.tipoReporte == '1') {
                            estadoReporte.descripcionTipoReporte = "Facturación Detallada";
                        } else if (estadoReporte.tipoReporte == '2') {
                            estadoReporte.descripcionTipoReporte = "Detalle todas las líneas";
                        } else if (estadoReporte.tipoReporte == '3') {
                            estadoReporte.descripcionTipoReporte = "Consolidado Minutos";
                        } else if (estadoReporte.tipoReporte == '4') {
                            estadoReporte.descripcionTipoReporte = "Relacion Planes";
                        }
                    });
                }
                registrarAuditoriaExito(rpta, idTransaccion, "CONSULTAR");
            } else {
                var mensajeAuditoria = operacionObtenerEstadoReporte + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'CONSULTAR');
                $location.path("/errorWiew");
            }
        }, function(error) {
            $location.path("/errorWiew");
        });
    };

    $scope.solicitarReportes = function() {

        var idCuenta = $scope.selectIdCuenta.idCuenta;
        var idRecibo = $scope.selectIdRecibo.idRecibo;
        var periodo = $scope.periodoFacturacion;
        var repFactDetallada = $scope.tipoReporte.facturacionDetallada;
        var repDetLineas = $scope.tipoReporte.detalleTodasLineas;
        var repConMinutos = $scope.tipoReporte.consolidadoMinutos;
        var repRelPlanes = $scope.tipoReporte.relacionPlanes;

        if (repFactDetallada != false || repDetLineas != false || repConMinutos != false || repRelPlanes != false) {
            abrirPopUp();
            var requestSolicitarReportes = {
                "idCuenta": idCuenta,
                "idRecibo": idRecibo,
                "periodo": periodo.idPeriodo,
                "repFactDetallada": repFactDetallada,
                "repDetLineas": repDetLineas,
                "repConMinutos": repConMinutos,
                "repRelPlanes": repRelPlanes
            };

            data = $httpParamSerializer({ requestJson: angular.toJson(requestSolicitarReportes) });

            consultaReporteCorporativoService.solicitarReporte(data).then(function(response) {
                var rpta = parseInt(response.data.solicitarReporteResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.solicitarReporteResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.solicitarReporteResponse.defaultServiceResponse.mensaje;

                if (rpta == 0) {
                    $timeout(function() {
                        mostrarConfirmacion();
                    }, 350);
                    registrarAuditoriaExito(rpta, idTransaccion, "GENERAR");
                } else if (rpta == 3) {
                    $scope.mensajeServicio3 = mensajeServicio;
                    $timeout(function() {
                        mostrarMensaje3();
                    }, 350);
                    registrarAuditoriaExito(rpta, idTransaccion, "GENERAR");
                } else if (rpta == 4) {
                    $scope.mensajeServicio4 = 'Al parecer ya había solicitado estos reportes para el recibo y periodo seleccionados. Verifique el estado ';
                    $timeout(function() {
                        mostrarMensaje4();
                    }, 350);
                    registrarAuditoriaExito(rpta, idTransaccion, "GENERAR");
                } else {
                    $timeout(function() {
                        mostrarError();
                    }, 350);

                    var mensajeAuditoria = operacionSolicitarReporte + "-" + mensajeServicio;
                    registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'GENERAR');
                }
            }, function(error) {

            });
        } else {

        }
    };

    $scope.cambiarClaseRadioButton = function(valorRadio) {

        $("#cntrpta").slideUp(350);
        $scope.cerrarPopup();
        if (valorRadio == '101') {
            $scope.mostrarReportes = false;
            $scope.checkRadioReportes = false;
            $scope.checkRadioSolicitudes = true;
            $timeout(function() {
                $("#cntrpta").slideDown(350)
                $scope.mostrarSolicitudes = true;
            }, 550);

        } else {
            $scope.mostrarSolicitudes = false;
            $scope.checkRadioSolicitudes = false;
            $scope.checkRadioReportes = true;
            $timeout(function() {
                $("#cntrpta").slideDown(350)
                obtenerEstadoReportesFn();
                $scope.mostrarReportes = true;
            }, 550);
        }

    };

    $scope.cerrarPopup = function() {

        esconderPopUp();
    };

    $scope.descargarReporte = function(idDescargaParam) {

        var obtenerReporteRequest = {
            idDescarga: idDescargaParam
        };

        data = $httpParamSerializer({ requestJson: angular.toJson(obtenerReporteRequest) });

        consultaReporteCorporativoService.obtenerReporte(data).then(function(response) {
            var rpta = parseInt(response.data.obtenerReporteResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerReporteResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerReporteResponse.defaultServiceResponse.mensaje;

            if (rpta == 0) {
                var reporteBase64 = response.data.obtenerReporteResponse.reporte;
                var wps_apple = false;
                var userAgent = navigator.userAgent || navigator.vendor || window.opera;

                if (/iPad|Mac|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                    wps_apple = true;
                }

                if (wps_apple) {
                    var urlbase64 = "data:application/CDFV2-encrypted;base64," + reporteBase64;
                    window.open(urlbase64, '_blank');
                } else {
                    var reporteBlob = b64toBlob(reporteBase64, 'application/CDFV2-encrypted');

                    FileSaver.saveAs(reporteBlob, 'reporte.xls');
                }

                registrarAuditoriaExito(rpta, idTransaccion, "DESCARGAR");
            } else {
                var mensajeAuditoria = operacionObtenerReporte + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'DESCARGAR');
            }

        }, function(response) {

        });
    };

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var base64test = /[^A-Za-z0-9\+\/\=]/g;
        if (base64test.exec(b64Data)) {
            alert("Había caracteres base64 no válidos en la entrada.\n" +
                "Los caracteres validos base64 son A-Z, a-z, 0-9, '+', '/',and '='\n" +
                "Esperar errores en la decodificacion.");
        }

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };


    function registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, operacion) {
        var codTipoOperacion = '-';
        if (operacion == 'CONSULTAR') {
            codTipoOperacion = codConsultarReporte;
        } else if (operacion == 'GENERAR') {
            codTipoOperacion = codGenerarReporte;
        } else if (operacion == 'DESCARGAR') {
            codTipoOperacion = codDescargaReporte;
        }

        guardarAuditoria(idTransaccion, estadoError, codTipoOperacion, mensajeAuditoria);
    };

    function registrarAuditoriaExito(rpta, idTransaccion, op) {

        var codTipoOperacion = '-';
        if (op == 'CONSULTAR') {
            codTipoOperacion = codConsultarReporte;
        } else if (op == 'GENERAR') {
            codTipoOperacion = codGenerarReporte;
        } else if (op == 'DESCARGAR') {
            codTipoOperacion = codDescargaReporte;
        }
        guardarAuditoria(idTransaccion, estadoExito, codTipoOperacion, "-");
    };

    function guardarAuditoria(idTransaccion, estadoAuditoria, codOperacion, mensajeAuditoria) {
        var requestAuditoria = {
            operationCode: codOperacion,
            pagina: pageIdReportesCorporativos,
            transactionId: idTransaccion,
            estado: estadoAuditoria,
            servicio: servicioParam,
            tipoProducto: tipoProductoMovil,
            tipoLinea: WPSTipoLinea.postpago,
            tipoUsuario: $scope.tipoClienteSession,
            perfil: permisoAuditoria,
            monto: '',
            descripcionoperacion: mensajeAuditoria,
            responseType: '-'
        };

        var dataAuditoria = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });

        consultaReporteCorporativoService.enviarAuditoria(dataAuditoria).then(function(response) {

        }, function() {});
    };


});
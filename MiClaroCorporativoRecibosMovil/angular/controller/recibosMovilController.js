app.controller("RecibosMovilController", function($scope, $timeout, $location, $httpParamSerializer, recibosMovilService, FileSaver, Blob, $sessionStorage) {

    $scope.fechaActual = new Date();
    $scope.mostrarBotonDeudaTotal = false;
    $scope.mostrarSwitchFacturaElectronica = false;
    $scope.errorSwitchFacturaElectronica = false;
    $scope.mostrarDeudaPendiente = false;
    $scope.errorDeudaPendiente = false;
    $scope.mostrarListaRecibos = false;
    $scope.errorListaRecibos = false;
    var objCondiciones = {};
    $scope.mostrarCombos = false;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    $scope.upps_ocurrio_error = WPSVisualizaryPagarRecibos.EXCEPCION16_1;
    $scope.transaccion_error = WPSVisualizaryPagarRecibos.EXCEPCION16_2;
    
    $scope.upps_error = WPSVisualizaryPagarRecibos.EXCEPCION17_1;
    $scope.vuelve_a_intentar = WPSVisualizaryPagarRecibos.EXCEPCION17_2;

    $scope.upps_sin_recibos = WPSVisualizaryPagarRecibos.EXCEPCION18_1;
    $scope.no_titular = WPSVisualizaryPagarRecibos.EXCEPCION18_2;

    var pageIdRecibosCorporativo = WPSPageID.miclaro_corporativo_recibos_movil;

    var codOperacionConsultaRecibo = WPSTablaOperaciones.consultaRecibos;
    var codOperacionPagoTotalRecibo = WPSTablaOperaciones.pagoTotalRecibos;
    var codOperacionAfiliacionFacElec = WPSTablaOperaciones.afiliacionReciboElectronico;
    var codOperacionDesafiliacionFacElec = WPSTablaOperaciones.desafiliarReciboElectronico;
    var codOperacionDescargarRecibo = WPSTablaOperaciones.descargarRecibo;
    var codOperacionVisualizarRecibo = WPSTablaOperaciones.visualizarRecibo;
    var codOperacionPagoReciboSelec = WPSTablaOperaciones.pagoRecibosSeleccionados;
    var servicioParam = '';
    var estadoExito = 'SUCCESS';
    var estadoError = 'ERROR';
    var tipoProductoFijo = 'MOVIL';
    var operacionObtenerServicio = 'getObtenerServicios';
    var operacionAfiliacionElectronica = 'obtenerAfiliacionFacturacionElectronica';
    var operacionActualizarFactElec = 'actualizarAfiliacionFacturacionElectronica';
    var operacionObtenerDeudaPendiente = 'obtenerDeudaPendiente';
    var operacionObtenerRecibosProduc = 'obtenerRecibosProducto';
    var operacionDeudaporPagar = 'ObtenerDeudaPendientePorPagar';
    var operacionInicioTransaccion = 'registrarInicioTransaccionPagoTC';
    var operacionFinTransaccion = 'registrarFinTransaccionPagoTC';
    var operacionObtenerRecibosFisicos = 'obtenerRecibosFisico';
    var operacionObtenerCuenta = 'obtenerListadoMovilCorporativoCuenta';
    var operacionObtenerRecibos = 'obtenerListadoMovilCorporativoRecibo';
    var permisoAuditoria = '-';
    var flagTipoPago = false;
    $scope.switchSelect = true;

    this.inicializar = function() {
        this.obtenerDatosUsuarioSesion();
    };

    this.obtenerDatosUsuarioSesion = function() {

        recibosMovilService.obtenerDatosUsuarioSesion().then(function(response) {
            var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;

            if (rpta == 0) {

                $scope.tipoClienteUsuario = response.data.comunResponseType.tipoCliente;

                if ($scope.tipoClienteUsuario == 4) {
                    $scope.showSwitch = true;
                }

                $scope.recibosMovilCtr.tipoClienteSession = response.data.comunResponseType.tipoCliente;
                $scope.recibosMovilCtr.emailUsuarioEnProceso = response.data.comunResponseType.usuarioVinculado;

                var flagProductoMovilSesion = response.data.comunResponseType.flagProductoMovilSesion;
                objCondiciones = setearTerminosyCondiciones(response);
                if (flagProductoMovilSesion == "2" || flagProductoMovilSesion == "3") {
                    $scope.recibosMovilCtr.obtenerServicioPrincipal();
                } else if (flagProductoMovilSesion == "0" || flagProductoMovilSesion == "1") {
                    registrarAuditoriaExito(rpta, idTransaccion, "FLAG");
                    $location.path("/nuevoServicioView");
                } else if (flagProductoMovilSesion == "-1") {
                    var mensajeAuditoria = operacionObtenerServicio + "- flagMovil";
                    registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, null);
                    $location.path("/errorGeneralWiew");
                }

            } else {
                $location.path("/errorWiew");
            }

        }, function(error) {});
    };

    function setearTerminosyCondiciones(response) {

        var nombre = response.data.comunResponseType.nombreUsuario;
        var apellido = response.data.comunResponseType.apellidos;
        var tipoDocumento = response.data.comunResponseType.tipoDocumento;
        var numDocumento = response.data.comunResponseType.numeroDocumento;
        var correoTermi = response.data.comunResponseType.usuarioVinculado;
        var modalidad = '';
        var nombreDocu = '';
        var tipoCliente = response.data.comunResponseType.tipoCliente;
        if (tipoCliente == 1) {
            modalidad = 'RESIDENCIAL';
        } else {
            modalidad = 'CORPORATIVO';
        }
        switch (tipoDocumento) {
            case '001':
                nombreDocu = 'RUC';
                break;
            case '002':
                nombreDocu = 'DNI';
                break;
            case '004':
                nombreDocu = 'Carnet Extranjeria';
                break;
            case '006':
                nombreDocu = 'Pasaporte';
                break;
            default:
                nombreDocu = 'Otros';
        }

        var objTerminosCondiciones = {
            nombreApe: nombre + " " + apellido,
            tipoDocu: nombreDocu,
            numDocu: numDocumento,
            codCliente: null,
            servicioTermi: null,
            correoTermi: correoTermi,
            modalidad: modalidad
        }

        return objTerminosCondiciones;
    };

    this.obtenerServicioPrincipal = function() {
        recibosMovilService.obtenerServicioPrincipal().then(function(response) {
            var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;

            if (rpta == 0) {
                var categoriaPrincipal = response.data.comunResponseType.categoria;
                var tipoClientePrincipal = response.data.comunResponseType.tipoClienteProductoPrincipal;
                servicioParam = response.data.comunResponseType.nombre;
                if (categoriaPrincipal == "1" && tipoClientePrincipal == "2") {
                    $scope.recibosMovilCtr.idProductoPrincial = response.data.comunResponseType.productoPrincipal;
                    $scope.recibosMovilCtr.idReciboPrincipal = response.data.comunResponseType.idRecibo;
                    $scope.recibosMovilCtr.idCuentaPrincipal = response.data.comunResponseType.idCuenta;
                } else {
                    $scope.recibosMovilCtr.idProductoPrincial = null;
                }
                $scope.recibosMovilCtr.getCuentasCoorporativosFn();
            } else {
                $location.path("/errorWiew");
            }
        }, function(error) {

        });
    };

    this.getCuentasCoorporativosFn = function() {
        recibosMovilService.getCuentasCoorporativos().then(function(response) {
            var rpta = parseInt(response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                var dataCuentas = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta;
                $scope.recibosMovilCtr.cuentasCorporativasList = [];
                if (angular.isArray(dataCuentas)) {
                    $scope.recibosMovilCtr.cuentasCorporativasList = dataCuentas;
                } else {
                    $scope.recibosMovilCtr.cuentasCorporativasList.push(dataCuentas);
                }

                var breakLoopC = false;

                if ($scope.recibosMovilCtr.idCuentaPrincipal != null) {
                    angular.forEach($scope.recibosMovilCtr.cuentasCorporativasList, function(val, key) {
                        if (!breakLoopC) {
                            if (val.idCuenta === $scope.recibosMovilCtr.idCuentaPrincipal) {
                                $scope.recibosMovilCtr.cuenta = $scope.recibosMovilCtr.cuentasCorporativasList[key];
                                breakLoopC = true;
                            } else {
                                $scope.recibosMovilCtr.cuenta = $scope.recibosMovilCtr.cuentasCorporativasList[0];

                            }
                        }
                    });
                } else {
                    $scope.recibosMovilCtr.cuenta = $scope.recibosMovilCtr.cuentasCorporativasList[0];

                }

                $scope.recibosMovilCtr.obtenerRecibos();
                registrarAuditoriaExito(rpta, idTransaccion, "CUENTA");
            } else {
                var mensajeAuditoria = operacionObtenerCuenta + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "CUENTA");
                $location.path("/errorWiew");
            }
        }, function(error) {

        });
    };

    this.obtenerRecibos = function() {
        var idCuenta = this.cuenta.idCuenta;
        var requestReciboCoor = {
            "idCuenta": idCuenta
        };

        dataReciboCoor = $httpParamSerializer({ requestJson: angular.toJson(requestReciboCoor) });

        recibosMovilService.getReciboCoorporativos(dataReciboCoor).then(function(response) {
            var rpta = parseInt(response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                $scope.mostrarCombos = true;
                var dataRecibosList = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo;
                $scope.recibosMovilCtr.recibosCorporativosList = [];

                if (angular.isArray(dataRecibosList)) {
                    $scope.recibosMovilCtr.recibosCorporativosList = dataRecibosList;
                } else {
                    $scope.recibosMovilCtr.recibosCorporativosList.push(dataRecibosList);
                }

                var breakLoopP = false;
                if ($scope.recibosMovilCtr.idReciboPrincipal != null) {
                    angular.forEach($scope.recibosMovilCtr.recibosCorporativosList, function(val, key) {
                        if (!breakLoopP) {
                            if (val.idRecibo === $scope.recibosMovilCtr.idReciboPrincipal) {
                                $scope.recibosMovilCtr.recibo = $scope.recibosMovilCtr.recibosCorporativosList[key];
                                breakLoopP = true;

                            }else { 

                                 $scope.recibosMovilCtr.recibo = $scope.recibosMovilCtr.recibosCorporativosList[0];
                            }

                        }
                    });
                } else {
                    $scope.recibosMovilCtr.recibo = $scope.recibosMovilCtr.recibosCorporativosList[0];
                }

                $scope.recibosMovilCtr.obtenerLineas();
                registrarAuditoriaExito(rpta, idTransaccion, "RECIBO");
            } else {
                var mensajeAuditoria = operacionObtenerRecibos + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "RECIBO");
                $location.path("/errorWiew");
            }
        }, function(error) {

        });
    };

    this.obtenerLineas = function() {
        var requestObtenerServicios = {
            categoria: WPSCategoria.movil,
            tipoLinea: WPSTipoLinea.postpago,
            tipoCliente: WPSTipoCliente.corporativo,
            idProductoServicio: null,
            tipoPermiso: WPSTipoPermiso.todos,
            idCuenta: $scope.recibosMovilCtr.cuenta.idCuenta,
            idRecibo: $scope.recibosMovilCtr.recibo.idRecibo,
            idDireccion: null,
            nombreProducto: null,
            pagina: 0,
            cantResultadosPagina: 0,
            productoPrincipalXidRecibo: "false",
            titularidadServicio: WPSTitularidadServicio.serviciosTitularesAfiliados
        };

        var dataObtenerServicios = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerServicios) });
        recibosMovilService.getObtenerServicios(dataObtenerServicios).then(function(response) {

            var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                var dataLineaList = response.data.obtenerServiciosResponse.listadoProductosServicios;
                if (dataLineaList != null && dataLineaList != undefined) {
                    $scope.recibosMovilCtr.lineasCorporativoList = [];
                    if (angular.isArray(dataLineaList)) {
                        $scope.recibosMovilCtr.lineasCorporativoList = dataLineaList;
                    } else {
                        $scope.recibosMovilCtr.lineasCorporativoList.push(dataLineaList);
                    }

                    if ($scope.recibosMovilCtr.idProductoPrincial != null) {
                        angular.forEach($scope.recibosMovilCtr.lineasCorporativoList, function(val, key) {
                            if (val.ProductoServicioResponse.idProductoServicio == $scope.recibosMovilCtr.idProductoPrincial) {
                                $scope.recibosMovilCtr.linea = $scope.recibosMovilCtr.lineasCorporativoList[key];
                                $scope.lineaCorporativaMostrar = $scope.recibosMovilCtr.lineasCorporativoList[key].ProductoServicioResponse.nombreAlias;
                            }
                        });
                    } else {
                        $scope.recibosMovilCtr.linea = $scope.recibosMovilCtr.lineasCorporativoList[0];
                        $scope.lineaCorporativaMostrar = $scope.recibosMovilCtr.lineasCorporativoList[0].ProductoServicioResponse.nombreAlias;

                    }
                    servicioParam = $scope.recibosMovilCtr.linea.ProductoServicioResponse.nombre;
                    objCondiciones.codCliente = $scope.recibosMovilCtr.linea.ProductoServicioResponse.idCuenta;
                    objCondiciones.servicioTermi = $scope.recibosMovilCtr.linea.ProductoServicioResponse.nombre;
                    permisoAuditoria = $scope.recibosMovilCtr.linea.ProductoServicioResponse.tipoPermiso;
                    actualizarProductoPrincipal($scope.recibosMovilCtr.linea);

                    $scope.recibosMovilCtr.obtenerAfiliacionFacturacionElectronica();

                    $scope.recibosMovilCtr.buscarDatosRecibo();

                    $scope.recibosMovilCtr.obtenerRecibosProducto();
                    registrarAuditoriaExito(rpta, idTransaccion, "LINEAS");
                } else {
                    $location.path("/errorWiew");
                }
            } else {
                var mensajeAuditoria = operacionObtenerServicio + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "LINEAS");
                $location.path("/errorWiew");
            }

        }, function(error) {

        });
    };

    this.buscarDatosRecibo = function() {
        $scope.errorDeudaPendiente = false;
        var requestObtenerDeudaPendiente = {
            categoria: WPSCategoria.movil,
            idCuenta: $scope.recibosMovilCtr.linea.ProductoServicioResponse.idCuenta,
            idRecibo: $scope.recibosMovilCtr.linea.ProductoServicioResponse.idRecibo,
            idDireccion: null,
            idProductoServicio: $scope.recibosMovilCtr.linea.ProductoServicioResponse.idProductoServicio
        };

        var dataObtenerDeudaPendiente = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerDeudaPendiente) });

        recibosMovilService.obtenerDeudaPendiente(dataObtenerDeudaPendiente).then(function(response) {
            var rpta = parseInt(response.data.obtenerDeudaPendienteResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerDeudaPendienteResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerDeudaPendienteResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                $scope.recibosMovilCtr.montoDeudaPendiente = response.data.obtenerDeudaPendienteResponse.montoDeudaPendiente;
                $scope.recibosMovilCtr.simboloMoneda = response.data.obtenerDeudaPendienteResponse.simboloMoneda;

                $scope.recibosMovilCtr.flagMensajeDeudaNoCorte = false;
                if ($scope.recibosMovilCtr.montoDeudaPendiente > 0 && $scope.recibosMovilCtr.montoDeudaPendiente < 1) {
                    $scope.recibosMovilCtr.flagMensajeDeudaNoCorte = true;
                }

                if ($scope.recibosMovilCtr.montoDeudaPendiente > 1) {
                    $scope.mostrarBotonDeudaTotal = true;
                }
                $scope.mostrarDeudaPendiente = true;
                registrarAuditoriaExito(rpta, idTransaccion, "DEUDAPENDIENTE");
            } else {
                var mensajeAuditoria = operacionObtenerDeudaPendiente + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "DEUDAPENDIENTE");
                $scope.errorDeudaPendiente = true;
            }
        }, function(error) {

        });
    };

    this.refrescarDatosReciboAfiliacionFacturaElectronica = function() {
        $scope.recibosMovilCtr.obtenerAfiliacionFacturacionElectronica();
        $scope.recibosMovilCtr.buscarDatosRecibo();
    };

    this.obtenerRecibosProducto = function() {
        $scope.errorListaRecibos = false;
        var requestObtenerRecibosProducto = {
            idDireccion: null,
            idCuenta: this.cuenta.idCuenta,
            idRecibo: this.recibo.idRecibo
        };

        var dataObtenerRecibosProducto = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerRecibosProducto) });

        recibosMovilService.obtenerRecibosProducto(dataObtenerRecibosProducto).then(function(response) {
            var rpta = parseInt(response.data.obtenerRecibosProductoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerRecibosProductoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerRecibosProductoResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {

                var dataRecibosProductoList = response.data.obtenerRecibosProductoResponse.listaRecibos;
                $scope.recibosMovilCtr.recibosProductoList = [];

                if (angular.isArray(dataRecibosProductoList)) {
                    $scope.recibosMovilCtr.recibosProductoList = dataRecibosProductoList;
                } else {
                    $scope.recibosMovilCtr.recibosProductoList.push(dataRecibosProductoList);
                }

                $scope.mostrarListaRecibos = true;
                registrarAuditoriaExito(rpta, idTransaccion, "RECIBOSPRODU");
            } else {
                var mensajeAuditoria = operacionObtenerRecibosProduc + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "RECIBOSPRODU");
                $scope.errorListaRecibos = true;
            }

        }, function(error) {

        });
    };

    $scope.buscarServiciosxChange = function(indicador) {
        $scope.lineaCorporativaMostrar = null;
        $scope.recibosMovilCtr.idProductoPrincial = null;
        $scope.mostrarBotonDeudaTotal = false;
        $scope.mostrarSwitchFacturaElectronica = false;
        $scope.errorSwitchFacturaElectronica = false;
        $scope.mostrarDeudaPendiente = false;
        $scope.errorDeudaPendiente = false;
        $scope.mostrarListaRecibos = false;
        $scope.errorListaRecibos = false;
        if (indicador == 1) {
            $scope.recibosMovilCtr.obtenerRecibos();
        } else {
            $scope.recibosMovilCtr.obtenerLineas();
        }
    };

    this.recibosSeleccionadosList = [];

    this.palanca = function(reciboSeleccionado) {

        var idx = this.recibosSeleccionadosList.indexOf(reciboSeleccionado);

        if (idx > -1) {
            this.recibosSeleccionadosList.splice(idx, 1);
        } else {
            this.recibosSeleccionadosList.push(reciboSeleccionado);
        }
    };

    this.isExists = function(reciboSeleccionado) {
        return this.recibosSeleccionadosList.indexOf(reciboSeleccionado) > -1;
    };

    this.obtenerAfiliacionFacturacionElectronica = function() {
        $scope.errorSwitchFacturaElectronica = false;
        var requestAfiliacionFacturacionElectronica = {
            categoria: WPSCategoria.movil,
            idCuenta: $scope.recibosMovilCtr.linea.ProductoServicioResponse.idCuenta,
            idRecibo: $scope.recibosMovilCtr.linea.ProductoServicioResponse.idRecibo,
            idDireccion: null
        };

        var dataAfiliacionFacturacionElectronica = $httpParamSerializer({ requestJson: angular.toJson(requestAfiliacionFacturacionElectronica) });

        recibosMovilService.obtenerAfiliacionFacturacionElectronica(dataAfiliacionFacturacionElectronica).then(function(response) {
            var rpta = parseInt(response.data.obtenerAfiliacionFacturacionElectronicaResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerAfiliacionFacturacionElectronicaResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerAfiliacionFacturacionElectronicaResponse.defaultServiceResponse.mensaje;
            $scope.recibosMovilCtr.afiliacionFacturaElectronicaFlag = false;

            if (rpta == 0) {
                $scope.mostrarSwitchFacturaElectronica = true;
                $scope.recibosMovilCtr.afiliacionFacturaElectronicaFlag = ("true" === response.data.obtenerAfiliacionFacturacionElectronicaResponse.resultado);

                $scope.recibosMovilCtr.direccionFisica = response.data.obtenerAfiliacionFacturacionElectronicaResponse.direccionFisicaFacturacion;
                registrarAuditoriaExito(rpta, idTransaccion, "AFILIACION");
            } else {
                var mensajeAuditoria = operacionAfiliacionElectronica + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "AFILIACION");
                $scope.errorSwitchFacturaElectronica = true;
            }
        }, function(error) {

        });
    };

    this.actualizarAfiliacionFacturaElectronica = function() {

        if (this.afiliacionFacturaElectronicaFlag) {
            mostrarPopUp(true);
        } else {
            mostrarPopUp(false);
        }
    };

    function mostrarPopUp(flagAfiliarEmail) {
        var $h = $(window).height();
        var $popup = $('.popup');
        var $pop = $(".popup .pop");

        if (flagAfiliarEmail) {
            $('.step-01').fadeIn(150);
            $('.step-direccion-fisica').fadeOut(150);
        } else {
            $('.step-01').fadeOut(150);
            $('.step-direccion-fisica').fadeIn(150);
        }

        $('.step-02').fadeOut(150);
        $('.step-term').fadeOut(150);
        $('.step-progreso').fadeOut(150);
        $pop.css({ 'margin-top': Math.round(($h - 300) / 2) });
        $popup.fadeIn(350);
        $scope.recibosMovilCtr.checkTermAfiliacion = false;
        $scope.recibosMovilCtr.checkTermAfiliacionOtro = false;
    }

    this.actualizarAfiliarDireccionFisica = function() {

        $form = $('#idformpoprecibo3');
        var valid = $form.validate();
        if (valid) {
            $form.find('.msg-error').hide();

            $timeout(function() {
                $('.step-direccion-fisica').fadeOut(150);
                $timeout(function() {

                    afiliarDesafiliarEmail(2, null);

                    $('.step-progreso').fadeIn(250);
                }, 350);
                $timeout(function() { $scope.recibosMovilCtr.ocultarPopUp(true) }, 1500);
            }, 350);
        } else {
            $form.find('.msg-error').html("Por favor, acepta los Términos y Condiciones.").show();
        }
    };

    this.ocultarPopUp = function(parmExito) {

        if (!parmExito) {
            this.afiliacionFacturaElectronicaFlag = !this.afiliacionFacturaElectronicaFlag;
        }

        $('.popup').fadeOut(250);
    };

    this.otroCorreo = function() {

        $('.step-01').fadeOut(150);
        $timeout(function() { $('.step-02').fadeIn(250); }, 350);
    };

    this.enviarEmail = function() {

        $form = $('#idformpoprecibo1');
        var valid = $form.validate();
        if (valid) {
            $form.find('.msg-error').hide();

            $timeout(function() {
                $('.step-01').fadeOut(150);
                $timeout(function() {

                    afiliarDesafiliarEmail(1, $scope.recibosMovilCtr.emailUsuarioEnProceso);

                    $('.step-progreso').fadeIn(250);
                }, 350);
                $timeout(function() { $scope.recibosMovilCtr.ocultarPopUp(true) }, 1500);
            }, 350);
        } else {
            $form.find('.msg-error').html("Por favor, acepta los Términos y Condiciones.").show();
        }
    };

    function afiliarDesafiliarEmail(tipoAccionParm, emailParam) {
        var requestAfiliarEmail = {
            categoria: WPSCategoria.movil,
            idCuenta: $scope.recibosMovilCtr.linea.ProductoServicioResponse.idCuenta,
            idRecibo: $scope.recibosMovilCtr.linea.ProductoServicioResponse.idRecibo,
            idDireccion: null,
            tipoAccion: tipoAccionParm,
            email: emailParam
        };

        var dataActualizarAfiliacionFacturacionElectronica = $httpParamSerializer({ requestJson: angular.toJson(requestAfiliarEmail) });

        var operacion = null;

        if (tipoAccionParm === 1) {
            operacion = WPSTablaOperaciones.afiliacionReciboElectronico;
        } else if (tipoAccionParm === 2) {
            operacion = WPSTablaOperaciones.desafiliarReciboElectronico;
        }

        recibosMovilService.actualizarAfiliacionFacturacionElectronica(dataActualizarAfiliacionFacturacionElectronica).then(function(response) {

            var rpta = parseInt(response.data.actualizarAfiliacionFacturacionElectronicaResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.actualizarAfiliacionFacturacionElectronicaResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.actualizarAfiliacionFacturacionElectronicaResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                $scope.recibosMovilCtr.afiliacionFacturaElectronicaFlag = ("true" === response.data.actualizarAfiliacionFacturacionElectronicaResponse.resultado);

                if (tipoAccionParm === 1) {
                    $scope.recibosMovilCtr.afiliacionFacturaElectronicaFlag = true;
                    registrarAuditoriaExito(rpta, idTransaccion, "AFILIAR");
                } else if (tipoAccionParm === 2) {
                    $scope.recibosMovilCtr.afiliacionFacturaElectronicaFlag = false;
                    registrarAuditoriaExito(rpta, idTransaccion, "DESAFILIAR");
                }

            } else {
                var mensajeAuditoria = operacionActualizarFactElec + "-" + mensajeServicio;
                if (tipoAccionParm === 1) {
                    $scope.recibosMovilCtr.afiliacionFacturaElectronicaFlag = false;
                    registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "AFILIAR");
                } else if (tipoAccionParm === 2) {
                    $scope.recibosMovilCtr.afiliacionFacturaElectronicaFlag = true;
                    registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "DESAFILIAR");
                }
            }
        }, function(error) {

        });
    }

    this.enviarOtroEmail = function() {

        $form = $('#idformpoprecibo2');
        var valid = $form.validate();
        if (valid) {
            $form.find('.msg-error').hide();

            $timeout(function() {
                $('.step-02').fadeOut(150);
                $timeout(function() {
                    afiliarDesafiliarEmail(1, $scope.recibosMovilCtr.emailOtro);
                    $('.step-progreso').fadeIn(250);
                }, 350);
                $timeout(function() { $scope.recibosMovilCtr.ocultarPopUp(true) }, 1500);
            }, 350);
        } else {
            $form.find('.msg-error').html("Por favor, ingresa un correo electrónico válido y/o acepta los Términos y Condiciones.").show();
        }
    };

    var $curStep = undefined;

    this.terminosCondiciones = function() {
        recibosMovilService.terminosCondiciones(objCondiciones).then(function(response) {
            $timeout(function() {
                $('#terminosCondiciones').html("");
                $("#terminosCondiciones").append(response.data);
            }, 200);
        }, function(error) {

        });

        $curStep = $('.step-01');
        $curStep.fadeOut(150);
        $timeout(function() { $('.step-term').fadeIn(250); }, 350);
    };

    this.terminosCondicionesOtros = function() {

        $curStep = $('.step-02');
        $curStep.fadeOut(150);
        $timeout(function() { $('.step-term').fadeIn(250); }, 350);
    };

    this.cancelarOtros = function() {

        $('.step-02').fadeOut(150);
        $timeout(function() { $('.step-01').fadeIn(250); }, 350);
    };

    this.terminosCondicionesCancelar = function() {

        $('.step-term').fadeOut(150);
        $timeout(function() { $curStep.fadeIn(250); }, 350);
    };

    this.terminosCondicionesAceptar = function() {

        var $check = $curStep.find(".check input");

        if ($curStep.selector === ".step-01") {
            $scope.recibosMovilCtr.checkTermAfiliacion = true;
        } else if ($curStep.selector === ".step-02") {
            $scope.recibosMovilCtr.checkTermAfiliacionOtro = true;
        }

        $('.step-term').fadeOut(150);
        $timeout(function() { $curStep.fadeIn(250); }, 350);
    };

    this.descargarRecibo = function(reciboObject, indicador) {

        var requestObtenerRecibosFisico = {
            categoria: WPSCategoria.movil,
            idProductoServicio: $scope.recibosMovilCtr.linea.ProductoServicioResponse.idProductoServicio,
            idDireccion: null,
            idCuenta: $scope.recibosMovilCtr.linea.ProductoServicioResponse.idCuenta,
            idRecibo: $scope.recibosMovilCtr.linea.ProductoServicioResponse.idRecibo,
            idReciboProducto: reciboObject.idReciboProducto,
            periodoRecibo: reciboObject.periodoRecibo,
            numeroRecibo: reciboObject.numeroRecibo,
            tipoReciboDocumentoPago: reciboObject.tipoReciboDocumentoPago
        };

        var dataObtenerRecibosFisico = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerRecibosFisico) });

        recibosMovilService.obtenerRecibosFisico(dataObtenerRecibosFisico).then(function(response) {

            var rpta = parseInt(response.data.obtenerRecibosFisicoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerRecibosFisicoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerRecibosFisicoResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                if (indicador == '1') {
                    var archivoBase64 = response.data.obtenerRecibosFisicoResponse.recibo;
                    var reciboBlob = b64toBlob(archivoBase64, 'application/pdf');
                    FileSaver.saveAs(reciboBlob, 'recibo.pdf');
                    registrarAuditoriaExito(rpta, idTransaccion, "DESCARGAR");
                } else {
                    var archivoBase64 = response.data.obtenerRecibosFisicoResponse.recibo;
                    var urlbase64 = "data:application/pdf;base64," + archivoBase64;
                    window.open(urlbase64, '_blank');
                    registrarAuditoriaExito(rpta, idTransaccion, "VISUALIZAR");
                }
            } else {
                var mensajeAuditoria = operacionObtenerRecibosFisicos + "-" + mensajeServicio;
                if (indicador == '1') {
                    registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "DESCARGAR");
                } else {
                    registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "VISUALIZAR");
                }
            }
        }, function(error) {

        });
    };

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

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
    }

    this.pagarRecibosSeleccionados = function() {

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Recibos - Movil',
            'action': 'Clic en botón',
            'label': 'Pagar seleccionados'
        });

        var flagTipoPago = false;
        var montoPagar = parseFloat(0);
        var recibo = null;
        for (i = 0; i < this.recibosSeleccionadosList.length; i++) {
            recibo = this.recibosSeleccionadosList[i];
            montoPagar = montoPagar + parseFloat(recibo.montoPendiente);
        }

        var montoPagarFinal = montoPagar.toFixed(2);

        var arrSelec = [];

        for (var i = 0; i < $scope.recibosMovilCtr.recibosSeleccionadosList.length; i++) {
            var objSelec = {
                id: $scope.recibosMovilCtr.recibosSeleccionadosList[i].numeroRecibo,
                name: 'Recibo móvil - ' + $scope.recibosMovilCtr.recibosSeleccionadosList[i].mesRecibo,
                price: $scope.recibosMovilCtr.recibosSeleccionadosList[i].montoPendiente,
                category: 'Pago recibo móvil',
                quantity: '1',
                list: 'Recibo móvil'
            }
            arrSelec.push(objSelec);
        }


        dataLayer.push({
            'event': 'addToCart',
            'ecommerce': {
                'add': {
                    'products': arrSelec
                }
            }
        });

        dataLayer.push({
            'event': 'productCheckout',
            'ecommerce': {
                'checkout': {
                    'actionField': { 'step': 1 },
                    'products': arrSelec
                }
            }
        });


        ejecutarPago($scope.recibosMovilCtr.recibosSeleccionadosList, montoPagarFinal, 1);
    };

    function ejecutarPasarela(idComercio, nombreComercio, numeroOrden, codigoMoneda, descripcionPago, montoFacturar, guardarToken) {

        $timeout(function() {

            Culqi.codigoComercio = idComercio;
            Culqi.configurar({
                nombre: nombreComercio,
                orden: numeroOrden,
                moneda: codigoMoneda,
                descripcion: descripcionPago,
                monto: montoFacturar * 100,
                guardar: guardarToken
            });
            culqi = function() {

                if (Culqi.token) {

                    var requestRegistrarFinTransaccionPagoTC = {
                        numeroOrden: numeroOrden,
                        objeto: Culqi.token.id
                    };

                    var dataRegistrarFinTransaccionPagoTC = $httpParamSerializer({ requestJson: angular.toJson(requestRegistrarFinTransaccionPagoTC) });

                    recibosMovilService.registrarFinTransaccionPagoTC(dataRegistrarFinTransaccionPagoTC).then(function(response) {

                        var rpta = parseInt(response.data.registrarFinTransaccionPagoTCResponse.defaultServiceResponse.idRespuesta);
                        var idTransaccion = response.data.registrarFinTransaccionPagoTCResponse.defaultServiceResponse.idTransaccional;
                        var mensajeServicio = response.data.registrarFinTransaccionPagoTCResponse.defaultServiceResponse.mensaje;
                        if (rpta == 0) {
                            $sessionStorage.dataTransaccionExitosa = response.data.registrarFinTransaccionPagoTCResponse;
                            $sessionStorage.dataTransaccionExitosa.idCuenta = $scope.recibosMovilCtr.linea.ProductoServicioResponse.idCuenta;
                            $location.path("/confirmacionPagoView");
                            registrarAuditoriaExito(rpta, idTransaccion, "FINTRANSACCION");

                            dataLayer.push({
                                'event': 'checkoutOption',
                                'ecommerce': {
                                    'checkout_option': {
                                        'actionField': { 'step': 1, 'option': 'Pago conTarjeta ' + response.data.registrarFinTransaccionPagoTCResponse.marcaTC }
                                    }
                                }
                            });

                            var arrProdTC = [];

                            if (angular.isArray(response.data.registrarFinTransaccionPagoTCResponse.listaRecibos)) {
                                arrProdTC = response.data.registrarFinTransaccionPagoTCResponse.listaRecibos;
                            } else {
                                arrProdTC.push(response.data.registrarFinTransaccionPagoTCResponse.listaRecibos);
                            }

                            var arrProductsTC = [];

                            for (var i = 0; i < arrProdTC.length; i++) {
                                var objProducts = {
                                    id: arrProdTC[i].idReciboProducto,
                                    name: 'Recibo movil - ' + arrProdTC[i].mesRecibo,
                                    price: arrProdTC[i].monto,
                                    category: 'Pago recibo movil',
                                    quantity: 1
                                }
                                arrProductsTC.push(objProducts);
                            }

                            dataLayer.push({
                                'event': 'orderPurchase',
                                'ecommerce': {
                                    'purchase': {
                                        'actionField': {
                                            'id': response.data.registrarFinTransaccionPagoTCResponse.numeroOperacion,
                                            'affiliation': 'MiClaro',
                                            'revenue': response.data.registrarFinTransaccionPagoTCResponse.importePagado,
                                            'tax': '0',
                                            'shipping': '0'
                                        },
                                        'products': arrProductsTC
                                    }
                                }
                            });
                            

                        } else if (rpta == 1) {
                            registrarAuditoriaExito(rpta, idTransaccion, "FINTRANSACCION");
                            $location.path("/confirmacionErrorPagoView");
                        } else {
                            var mensajeAuditoria = operacionFinTransaccion + "-" + mensajeServicio;
                            registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "FINTRANSACCION");
                            $location.path("/confirmacionErrorPagoPasarelaView");
                        }
                    }, function(error) {

                    });
                } else {
                    $location.path("/confirmacionErrorPagoView");
                }
            };

            $timeout(function() {
                Culqi.abrir();
            }, 100);
        }, 500);
    }

    this.pagarTotalDeuda = function() {

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Recibos - Movil',
            'action': 'Clic en botón',
            'label': 'Pagar todo'
        });

        var flagTipoPago = true;
        var requestObtenerDeudaPendientePorPagar = {
            categoria: WPSCategoria.movil,
            idCuenta: $scope.recibosMovilCtr.linea.ProductoServicioResponse.idCuenta,
            idRecibo: $scope.recibosMovilCtr.linea.ProductoServicioResponse.idRecibo,
            idDireccion: null,
            idProductoServicio: $scope.recibosMovilCtr.linea.ProductoServicioResponse.idProductoServicio
        };

        var dataObtenerDeudaPendientePorPagar = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerDeudaPendientePorPagar) });

        recibosMovilService.obtenerDeudaPendientePorPagar(dataObtenerDeudaPendientePorPagar).then(function(response) {

            var rpta = parseInt(response.data.obtenerDeudaPendientePorPagarResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerDeudaPendientePorPagarResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerDeudaPendientePorPagarResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {

                var simboloMoneda = response.data.obtenerDeudaPendientePorPagarResponse.simboloMoneda;
                var montoDeudaPendientePorPagar = response.data.obtenerDeudaPendientePorPagarResponse.montoDeudaPendientePorPagar;
                var dataRecibosPorPagarList = response.data.obtenerDeudaPendientePorPagarResponse.listaRecibos;

                var recibosPorPagarList = [];

                if (angular.isArray(dataRecibosPorPagarList)) {
                    recibosPorPagarList = dataRecibosPorPagarList;
                } else {
                    recibosPorPagarList.push(dataRecibosPorPagarList);
                }

                var arrProducts = [];

                for (var i = 0; i < recibosPorPagarList.length; i++) {
                    var objProducts = {
                        id: recibosPorPagarList[i].numeroRecibo,
                        name: 'Recibo móvil - ' + recibosPorPagarList[i].mesRecibo,
                        price: recibosPorPagarList[i].montoAPagar,
                        category: 'Pago recibo móvil',
                        quantity: '1',
                        list: 'Recibo móvil'
                    }
                    arrProducts.push(objProducts);
                }

                dataLayer.push({
                    'event': 'addToCart',
                    'ecommerce': {
                        'add': {
                            'products': arrProducts
                        }
                    }
                });

                dataLayer.push({
                    'event': 'productCheckout',
                    'ecommerce': {
                        'checkout': {
                            'actionField': { 'step': 1 },
                            'products': arrProducts
                        }
                    }
                });

                ejecutarPago(recibosPorPagarList, montoDeudaPendientePorPagar, 2);
                registrarAuditoriaExito(rpta, idTransaccion, "DEUDAPORPAGAR");
            } else {
                var mensajeAuditoria = operacionDeudaporPagar + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "DEUDAPORPAGAR");
                $location.path("/errorWiew");
            }

        }, function(error) {

        });
    };

    function ejecutarPago(recibosPorPagarList, montoPagar, tipoEjecucionPago) {

        var reciboReciboPorPargar = null;
        var recibosPorPagarPasarelaList = [];

        for (i = 0; i < recibosPorPagarList.length; i++) {
            reciboObject = recibosPorPagarList[i];

            if (tipoEjecucionPago == 1) {
                reciboReciboPorPargar = {
                    idReciboProducto: reciboObject.idReciboProducto,
                    fechaEmision: reciboObject.fechaEmision,
                    monto: reciboObject.montoPendiente,
                    numeroRecibo: reciboObject.numeroRecibo,
                    tipoReciboDocumentoPago: reciboObject.tipoReciboDocumentoPago
                };
            }

            if (tipoEjecucionPago == 2) {
                reciboReciboPorPargar = {
                    idReciboProducto: reciboObject.idReciboProducto,
                    fechaEmision: reciboObject.fechaEmision,
                    monto: reciboObject.montoAPagar,
                    numeroRecibo: reciboObject.numeroRecibo,
                    tipoReciboDocumentoPago: reciboObject.tipoReciboDocumentoPago
                };
            }

            recibosPorPagarPasarelaList.push(reciboReciboPorPargar);
        }

        $sessionStorage.listaRecibosPagar = recibosPorPagarPasarelaList;

        registrarInicioTransaccionPagoTC(null, null, montoPagar, null, null, recibosPorPagarPasarelaList);
    }

    function registrarInicioTransaccionPagoTC(idDireccion, idServicioPrincipalFijo, importePago, idCategoriaDeCompra, idProductoDeCompra, listaRecibos) {

        var requestRegistrarInicioTransaccionPagoTC = {
            tipoTransaccion: "1",
            categoria: WPSCategoria.movil,
            tipoCliente: $scope.recibosMovilCtr.tipoClienteSession,
            idCuenta: $scope.recibosMovilCtr.linea.ProductoServicioResponse.idCuenta,
            idRecibo: $scope.recibosMovilCtr.linea.ProductoServicioResponse.idRecibo,
            idDireccion: idDireccion,
            idProductoServicio: $scope.recibosMovilCtr.linea.ProductoServicioResponse.idProductoServicio,
            idServicioPrincipalFijo: idServicioPrincipalFijo,
            importePago: importePago,
            codigoMoneda: "1",
            idCategoriaDeCompra: idCategoriaDeCompra,
            idProductoDeCompra: idProductoDeCompra,
            listaRecibos: listaRecibos

        };

        var dataRegistrarInicioTransaccionPagoTC = $httpParamSerializer({ requestJson: angular.toJson(requestRegistrarInicioTransaccionPagoTC) });

        recibosMovilService.registrarInicioTransaccionPagoTC(dataRegistrarInicioTransaccionPagoTC).then(function(response) {

            var rpta = parseInt(response.data.registrarInicioTransaccionPagoTCResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.registrarInicioTransaccionPagoTCResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.registrarInicioTransaccionPagoTCResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {

                var idComercio = response.data.registrarInicioTransaccionPagoTCResponse.idComercio;
                var nombreComercio = response.data.registrarInicioTransaccionPagoTCResponse.nombreComercio;
                var numeroOrden = response.data.registrarInicioTransaccionPagoTCResponse.numeroOrden;
                var codigoMoneda = response.data.registrarInicioTransaccionPagoTCResponse.codigoMoneda;
                var descripcionPago = response.data.registrarInicioTransaccionPagoTCResponse.descripcionPago;
                var montoFacturar = response.data.registrarInicioTransaccionPagoTCResponse.montoFacturar;
                var guardarToken = ("true" === response.data.registrarInicioTransaccionPagoTCResponse.guardarToken);


                ejecutarPasarela(idComercio, nombreComercio, numeroOrden, codigoMoneda, descripcionPago, montoFacturar, guardarToken);
                registrarAuditoriaExito(rpta, idTransaccion, "INICIOTRANSACCION");
            } else {
                var mensajeAuditoria = operacionInicioTransaccion + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "INICIOTRANSACCION");
                $location.path("/errorWiew");
            }
        }, function(error) {

        });
    }

    function registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, operacion) {
        var codTipoOperacion = '';
        if (operacion == 'DEUDAPORPAGAR' || operacion == 'INICIOTRANSACCION' || operacion == 'FINTRANSACCION' || operacion == null) {
            if (flagTipoPago != false) {
                codTipoOperacion = codOperacionPagoTotalRecibo;
            } else {
                codTipoOperacion = codOperacionPagoReciboSelec;
            }
        } else if (operacion == 'DESCARGAR') {
            codTipoOperacion = codOperacionDescargarRecibo;
        } else if (operacion == 'VISUALIZAR') {
            codTipoOperacion = codOperacionVisualizarRecibo;
        } else if (operacion == 'AFILIACION') {
            codTipoOperacion = codOperacionAfiliacionFacElec;
        } else if (operacion == 'DESAFILIAR') {
            codTipoOperacion = codOperacionDesafiliacionFacElec;
        } else {
            codTipoOperacion = codOperacionConsultaRecibo;
        }

        guardarAuditoria(idTransaccion, estadoError, codTipoOperacion, mensajeAuditoria);
    };

    var objExitoAuditoria = {};
    var objPagar = {};

    function registrarAuditoriaExito(rpta, idTransaccion, op) {
        var codTipoOperacion = '';
        if (rpta == 0 && op == 'CUENTA') {
            objExitoAuditoria.cuenta = rpta;
        } else if (rpta == 0 && op == 'RECIBO') {
            objExitoAuditoria.recibo = rpta;
        } else if (rpta == 0 && op == 'LINEAS') {
            objExitoAuditoria.linea = rpta;
        } else if (rpta == 0 && op == 'RECIBOSPRODU') {
            objExitoAuditoria.reciboproduc = rpta;
        } else if (rpta == 0 && op == 'DEUDAPENDIENTE') {
            objExitoAuditoria.deuda = rpta;
        } else if (rpta == 0 && op == 'AFILIACION') {
            objExitoAuditoria.electronica = rpta;
        } else if (op == 'DESCARGAR') {
            codTipoOperacion = codOperacionDescargarRecibo;
        } else if (op == 'VISUALIZAR') {
            codTipoOperacion = codOperacionVisualizarRecibo;
        } else if (op == 'AFILIAR') {
            codTipoOperacion = codOperacionAfiliacionFacElec;
        } else if (op == 'DESAFILIAR') {
            codTipoOperacion = codOperacionDesafiliacionFacElec;
        } else if (op == 'DEUDAPORPAGAR') {
            objPagar.pagar = rpta;
        } else if (op == 'INICIOTRANSACCION') {
            objPagar.inicio = rpta;
        } else if (op == 'FINTRANSACCION') {
            objPagar.fin = rpta;
        }

        if (objExitoAuditoria.cuenta == 0 && objExitoAuditoria.recibo == 0 && objExitoAuditoria.linea == 0 && objExitoAuditoria.reciboproduc == 0 && objExitoAuditoria.deuda == 0 && objExitoAuditoria.electronica == 0) {
            guardarAuditoria(idTransaccion, estadoExito, codOperacionConsultaRecibo, "-");
        } else if (op == "FLAG") {
            guardarAuditoria(idTransaccion, estadoExito, codOperacionConsultaRecibo, "-");
        }


        if (op == 'DESCARGAR' || op == 'VISUALIZAR' || op == 'AFILIAR' || op == 'DESAFILIAR') {
            guardarAuditoria(idTransaccion, estadoExito, codTipoOperacion, "-");
        } else if (objPagar.pagar == 0 && objPagar.inicio == 0 && objPagar.fin == 0) {
            if (flagTipoPago != false) {
                codTipoOperacion = codOperacionPagoTotalRecibo;
            } else {
                codTipoOperacion = codOperacionPagoReciboSelec;
            }
            guardarAuditoria(idTransaccion, estadoExito, codTipoOperacion, "-");
        }

    };

    function guardarAuditoria(idTransaccion, estadoAuditoria, codOperacion, mensajeAuditoria) {
        var requestAuditoria = {
            operationCode: codOperacion,
            pagina: pageIdRecibosCorporativo,
            transactionId: idTransaccion,
            estado: estadoAuditoria,
            servicio: servicioParam,
            tipoProducto: tipoProductoFijo,
            tipoLinea: WPSTipoLinea.postpago,
            tipoUsuario: $scope.recibosMovilCtr.tipoClienteSession,
            perfil: permisoAuditoria,
            monto: '',
            descripcionoperacion: mensajeAuditoria,
            responseType: '-'
        };

        var dataAuditoria = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });

        recibosMovilService.enviarAuditoria(dataAuditoria).then(function(response) {}, function() {});
    };

    $scope.IrCuentasClaro = function() {
        $.cookie('CuentasClaroWPSRetornar', '1', { path: '/' });
        window.location = "/wps/myportal/cuentasclaro/root?flagTuCuenta=true";
    };


    function actualizarProductoPrincipal(objetoServicioActualizar) {
        var actualizar = enviarDataActualizar(objetoServicioActualizar);
        recibosMovilService.actualizarProductoPrincipal(actualizar).then(function(response) {}, function(error) {});
    };

    $scope.switchChange = function() {

        window.location.replace("/wps/myportal/miclaro/consumer/recibos/movil/");

    };

    function enviarDataActualizar(objetoServicioActualizar) {
        var requestActualizar = {
            productoPrincipal: null,
            nombreProductoPrincipal: null,
            idCuenta: null,
            idRecibo: null,
            idDireccion: null,
            idLinea: null,
            tipoLinea: null,
            numeroTelFijo: null,
            categoria: null,
            tipoClienteProductoPrincipal: null
        }

        requestActualizar.productoPrincipal = objetoServicioActualizar.ProductoServicioResponse.idProductoServicio;
        requestActualizar.nombreProductoPrincipal = objetoServicioActualizar.ProductoServicioResponse.nombre;
        requestActualizar.idCuenta = objetoServicioActualizar.ProductoServicioResponse.idCuenta;
        requestActualizar.idRecibo = objetoServicioActualizar.ProductoServicioResponse.idRecibo;
        requestActualizar.tipoLinea = objetoServicioActualizar.ProductoServicioResponse.tipoLinea;
        requestActualizar.categoria = objetoServicioActualizar.ProductoServicioResponse.categoria;
        requestActualizar.tipoClienteProductoPrincipal = WPSTipoCliente.corporativo;

        dataActualizar = $httpParamSerializer({ requestJson: angular.toJson(requestActualizar) });
        return dataActualizar;
    };

});
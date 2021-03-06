app.controller("RecibosTvController", function($scope, $timeout, $location, $httpParamSerializer, recibosTvService, FileSaver, Blob, $sessionStorage) {

    $scope.fechaActual = new Date();

    this.statusResponseService = false;
    this.flagMostrarSwitch = false;

    $scope.mostrarDeudaPendiente = false;
    $scope.errorDeudaPendiente = false;
    $scope.mostrarSwitchEmailElectronico = false;
    $scope.errorSwitchEmailElectronico = false;
    $scope.mostrarListadeFacturasaPagar = false;
    $scope.errorListaFacturasaPagar = false;
    $scope.flagPagarDeudaTotal = false;
    var objCondiciones = {};

    var pageIdRecibosCorporativo = WPSPageID.miclaro_consumer_recibos_tv;

    var codOperacionConsultaRecibo = WPSTablaOperaciones.consultaRecibos;
    var codOperacionPagoTotalRecibo = WPSTablaOperaciones.pagoTotalRecibos;
    var codOperacionAfiliacionFacElec = WPSTablaOperaciones.afiliacionReciboElectronico;
    var codOperacionDesafiliacionFacElec = WPSTablaOperaciones.desafiliarReciboElectronico;
    var codOperacionDescargarRecibo = WPSTablaOperaciones.descargarRecibo;
    var codOperacionVisualizarRecibo = WPSTablaOperaciones.visualizarRecibo;
    var codOperacionPagoReciboSelec = WPSTablaOperaciones.pagoRecibosSeleccionados;
    var servicioParam = '-';
    var estadoExito = 'SUCCESS';
    var estadoError = 'ERROR';
    var tipoProductoFijo = 'CLAROTV';
    var operacionObtenerServicio = 'getObtenerServicios';
    var operacionAfiliacionElectronica = 'obtenerAfiliacionFacturacionElectronica';
    var operacionActualizarFactElec = 'actualizarAfiliacionFacturacionElectronica';
    var operacionObtenerDeudaPendiente = 'obtenerDeudaPendiente';
    var operacionObtenerRecibos = 'obtenerRecibosProducto';
    var operacionDeudaporPagar = 'ObtenerDeudaPendientePorPagar';
    var operacionInicioTransaccion = 'registrarInicioTransaccionPagoTC';
    var operacionFinTransaccion = 'registrarFinTransaccionPagoTC';
    var operacionObtenerRecibosFisicos = 'obtenerRecibosFisico';
    var operacionDatosAdicionales = 'obtenerDatosAdicionalesServicioFijo';
    var tipoLineaAuditoria = '-';
    var tipoPermisoAuditoria = '-';
    var flagTipoPago = false;

    $scope.switchChange = function() {
        switchChangeEvent();
    };

    function switchChangeEvent() {
        window.location.href = "/wps/myportal/miclaro/consumer/recibos/tv/";
    }

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    $scope.upps_ocurrio_error = WPSVisualizaryPagarRecibos.EXCEPCION16_1;
    $scope.transaccion_error = WPSVisualizaryPagarRecibos.EXCEPCION16_2;
    
    $scope.upps_error = WPSVisualizaryPagarRecibos.EXCEPCION17_1;
    $scope.vuelve_a_intentar = WPSVisualizaryPagarRecibos.EXCEPCION17_2;

    $scope.upps_sin_recibos = WPSVisualizaryPagarRecibos.EXCEPCION18_1;
    $scope.no_titular = WPSVisualizaryPagarRecibos.EXCEPCION18_2;

    this.inicializar = function() {

        this.obtenerDatosUsuarioSesion();
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

    function devolverDataServicios() {
        var requestObtenerServicios = {
            categoria: null,
            tipoLinea: null,
            tipoCliente: null,
            idProductoServicio: null,
            tipoPermiso: null,
            idCuenta: null,
            idRecibo: null,
            idDireccion: null,
            nombreProducto: null,
            pagina: 0,
            cantResultadosPagina: 0,
            productoPrincipalXidRecibo: "false",
            titularidadServicio: null
        };

        requestObtenerServicios.categoria = WPSCategoria.tv;
        requestObtenerServicios.tipoLinea = WPSTipoLinea.postpago;
        requestObtenerServicios.tipoCliente = WPSTipoCliente.consumer;
        requestObtenerServicios.tipoPermiso = WPSTipoPermiso.todos;
        requestObtenerServicios.titularidadServicio = WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado;

        var dataObtenerServicios = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerServicios) });
        return dataObtenerServicios;
    };

    this.obtenerDatosUsuarioSesion = function() {

        recibosTvService.obtenerDatosUsuarioSesion().then(function(response) {
            var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;

            if (rpta == 0) {
                $scope.recibosTvCtr.tipoClienteSession = response.data.comunResponseType.tipoCliente;
                servicioParam = response.data.comunResponseType.telefono;
                $scope.recibosTvCtr.emailUsuarioEnProceso = response.data.comunResponseType.usuarioVinculado;

                var flagProductoTvSesion = response.data.comunResponseType.flagProductoTVSesion;
                objCondiciones = setearTerminosyCondiciones(response);
                if ($scope.recibosTvCtr.tipoClienteSession == WPSTipoCliente.mixto) {
                    $scope.recibosTvCtr.flagMostrarSwitch = true;
                }

                if (flagProductoTvSesion == "1" || flagProductoTvSesion == "3") {
                    $scope.recibosTvCtr.obtenerServicioPrincipal();
                } else if (flagProductoTvSesion == "0" || flagProductoTvSesion == "2") {
                    registrarAuditoriaExito(rpta, idTransaccion, "FLAG");
                    $location.path("/nuevoServicioView");
                } else if (flagProductoTvSesion == "-1") {
                    var mensajeAuditoria = operacionObtenerServicio + "- flagTv";
                    registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, null);
                    $location.path("/errorGeneralWiew");
                }
            } else {
                $location.path("/errorWiew");
            }
        }, function(error) {});
    };


    this.obtenerServicioPrincipal = function() {
        recibosTvService.obtenerServicioPrincipal().then(function(response) {
            var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            if (rpta == 0) {
                var categoriaPrincipal = response.data.comunResponseType.categoria;
                var tipoClientePrincipal = response.data.comunResponseType.tipoClienteProductoPrincipal;

                if (categoriaPrincipal == "1" && tipoClientePrincipal == "1") {
                    $scope.lineaPrincipal = response.data.comunResponseType.nombreProductoPrincipal;
                    $scope.recibosTvCtr.idProductoPrincial = response.data.comunResponseType.productoPrincipal;

                } else {
                    $scope.recibosTvCtr.idProductoPrincial = null;
                }
                $scope.recibosTvCtr.obtenerLineas();
            } else {
                $location.path("/errorWiew");
            }
        }, function(error) {});
    };

    this.obtenerLineas = function() {
        var dataPostpagoServicios = devolverDataServicios();
        recibosTvService.getObtenerServicios(dataPostpagoServicios).then(function(response) {
            var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                var dataLineaList = response.data.obtenerServiciosResponse.listadoProductosServicios;
                if (dataLineaList != null && dataLineaList != undefined) {
                    $scope.recibosTvCtr.statusResponseService = true;
                    $scope.recibosTvCtr.lineasCorporativoList = [];

                    if (angular.isArray(dataLineaList)) {
                        $scope.recibosTvCtr.lineasCorporativoList = dataLineaList;
                    } else {
                        $scope.recibosTvCtr.lineasCorporativoList.push(dataLineaList);
                    }

                    $scope.recibosTvCtr.linea = $scope.recibosTvCtr.lineasCorporativoList[0];

                    if ($scope.recibosTvCtr.idProductoPrincial != null) {
                        angular.forEach($scope.recibosTvCtr.lineasCorporativoList, function(val, key) {
                            if (val.ProductoServicioResponse.idProductoServicio === $scope.recibosTvCtr.idProductoPrincial) {
                                $scope.recibosTvCtr.linea = $scope.recibosTvCtr.lineasCorporativoList[key];
                            }
                        });
                    }
                    objCondiciones.codCliente = $scope.recibosTvCtr.linea.ProductoServicioResponse.idDireccion;
                    objCondiciones.servicioTermi = $scope.recibosTvCtr.linea.ProductoServicioResponse.nombre;
                    servicioParam = $scope.recibosTvCtr.linea.ProductoServicioResponse.nombre;
                    tipoLineaAuditoria = $scope.recibosTvCtr.linea.ProductoServicioResponse.tipoLinea;
                    tipoPermisoAuditoria = $scope.recibosTvCtr.linea.ProductoServicioResponse.tipoPermiso;

                    actualizarProductoPrincipal($scope.recibosTvCtr.linea);
                    $scope.recibosTvCtr.obtenerAfiliacionFacturacionElectronica();

                    $scope.recibosTvCtr.buscarDatosRecibo();

                    $scope.recibosTvCtr.obtenerRecibosProducto();
                    buscarDatosAdicionales();
                    registrarAuditoriaExito(rpta, idTransaccion, "LINEAFIJA");
                } else {
                    $location.path("/usuarioPrepagoView");
                    registrarAuditoriaExito(rpta, idTransaccion, "PREPAGO");
                }
            } else {
                var mensajeAuditoria = operacionObtenerServicio + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "LINEAFIJA");
                $location.path("/errorWiew");
            }
        }, function(error) {});
    };


    function buscarDatosAdicionales() {
        var datosAdicionalesRequest = {
            "idProductoServicio": null,
            "categoria": null,
            "idDireccion": null,
            "idLinea": null
        }
        datosAdicionalesRequest.idProductoServicio = $scope.recibosTvCtr.linea.ProductoServicioResponse.idProductoServicio;
        datosAdicionalesRequest.categoria = WPSCategoria.fijo;
        datosAdicionalesRequest.idDireccion = $scope.recibosTvCtr.linea.ProductoServicioResponse.idDireccion;
        datosAdicionalesRequest.idLinea = $scope.recibosTvCtr.linea.ProductoServicioResponse.idLinea;
        var serviciosRequest = $httpParamSerializer({ requestJson: angular.toJson(datosAdicionalesRequest) });

        recibosTvService.getObtenerDatosAdicionalesFijoWS(serviciosRequest).then(function(response) {
            var rpta = parseInt(response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.mensaje;

            if (rpta == 0) {
                $scope.recibosTvCtr.datosAdicionales = response.data.obtenerDatosAdicionalesServicioFijoResponse;
            } else {
                var mensajeAuditoria = operacionDatosAdicionales + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "ADICIONALES");
            }
        }, function(error) {});
    };


    $scope.motrarRecibosxServicio = function(objetoLinea) {
        $scope.mostrarDeudaPendiente = false;
        $scope.errorDeudaPendiente = false;
        $scope.mostrarSwitchEmailElectronico = false;
        $scope.errorSwitchEmailElectronico = false;
        $scope.mostrarListadeFacturasaPagar = false;
        $scope.errorListaFacturasaPagar = false;
        $scope.flagPagarDeudaTotal = false;

        $scope.recibosTvCtr.obtenerAfiliacionFacturacionElectronica();
        $scope.recibosTvCtr.buscarDatosRecibo();
        $scope.recibosTvCtr.obtenerRecibosProducto();
        buscarDatosAdicionales();
        actualizarProductoPrincipal(objetoLinea);
    };

    this.buscarDatosRecibo = function() {
        $scope.errorDeudaPendiente = false;
        var requestObtenerDeudaPendiente = {
            categoria: WPSCategoria.tv,
            idCuenta: $scope.recibosTvCtr.linea.ProductoServicioResponse.idCuenta,
            idRecibo: $scope.recibosTvCtr.linea.ProductoServicioResponse.idRecibo,
            idDireccion: $scope.recibosTvCtr.linea.ProductoServicioResponse.idDireccion,
            idProductoServicio: $scope.recibosTvCtr.linea.ProductoServicioResponse.idProductoServicio
        };
        var dataObtenerDeudaPendiente = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerDeudaPendiente) });

        recibosTvService.obtenerDeudaPendiente(dataObtenerDeudaPendiente).then(function(response) {
            var rpta = parseInt(response.data.obtenerDeudaPendienteResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerDeudaPendienteResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerDeudaPendienteResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                $scope.recibosTvCtr.montoDeudaPendiente = response.data.obtenerDeudaPendienteResponse.montoDeudaPendiente;
                $scope.recibosTvCtr.simboloMoneda = response.data.obtenerDeudaPendienteResponse.simboloMoneda;

                $scope.recibosTvCtr.flagMensajeDeudaNoCorte = false;
                if ($scope.recibosTvCtr.montoDeudaPendiente > 0 && $scope.recibosTvCtr.montoDeudaPendiente < 1) {
                    $scope.recibosTvCtr.flagMensajeDeudaNoCorte = true;
                }

                if ($scope.recibosTvCtr.montoDeudaPendiente > 1) {
                    $scope.flagPagarDeudaTotal = true;
                }

                $scope.mostrarDeudaPendiente = true;
                registrarAuditoriaExito(rpta, idTransaccion, "DEUDAPENDIENTE");
            } else {
                var mensajeAuditoria = operacionObtenerDeudaPendiente + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "DEUDAPENDIENTE");
                $scope.errorDeudaPendiente = true;
            }
        }, function(error) {});
    };

    this.obtenerRecibosProducto = function() {
        $scope.errorListaFacturasaPagar = false;
        var requestObtenerRecibosProducto = {
            idDireccion: $scope.recibosTvCtr.linea.ProductoServicioResponse.idDireccion,
            idCuenta: $scope.recibosTvCtr.linea.ProductoServicioResponse.idCuenta,
            idRecibo: $scope.recibosTvCtr.linea.ProductoServicioResponse.idRecibo
        };
        var dataObtenerRecibosProducto = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerRecibosProducto) });

        recibosTvService.obtenerRecibosProducto(dataObtenerRecibosProducto).then(function(response) {
            var rpta = parseInt(response.data.obtenerRecibosProductoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerRecibosProductoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerRecibosProductoResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                var dataRecibosProductoList = response.data.obtenerRecibosProductoResponse.listaRecibos;
                if (dataRecibosProductoList != undefined && dataRecibosProductoList != '') {
                    $scope.recibosTvCtr.recibosProductoList = [];

                    if (angular.isArray(dataRecibosProductoList)) {
                        $scope.recibosTvCtr.recibosProductoList = dataRecibosProductoList;
                    } else {
                        $scope.recibosTvCtr.recibosProductoList.push(dataRecibosProductoList);
                    }
                }
                $scope.mostrarListadeFacturasaPagar = true;
                registrarAuditoriaExito(rpta, idTransaccion, "RECIBOS");
            } else {
                $scope.errorListaFacturasaPagar = true;
                var mensajeAuditoria = operacionObtenerRecibos + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "RECIBOS");
            }
        }, function(error) {});
    };

    this.recibosSeleccionadosList = [];

    this.palanca = function(reciboSeleccionado) {

        var recibosProductoList = $scope.recibosTvCtr.recibosProductoList;
        var recibo = null;
        var idx = this.recibosSeleccionadosList.indexOf(reciboSeleccionado);
        var fechaVencimientoReciboSeleccionado = new Date(reciboSeleccionado.fechaVencimiento.substr(0, 10));

        if (idx > -1) {
            this.recibosSeleccionadosList.splice(idx, 1);

            for (x = 0; x < recibosProductoList.length; x++) {
                recibo = recibosProductoList[x];

                var fechaVencimientoRecibo = new Date(recibo.fechaVencimiento.substr(0, 10));
                var idxList = this.recibosSeleccionadosList.indexOf(recibo);
                if ((recibo.codEstado != '4' && recibo.montoPendiente > 0) &&
                    (fechaVencimientoRecibo >= fechaVencimientoReciboSeleccionado) &&
                    (reciboSeleccionado.idReciboProducto.localeCompare(recibo.idReciboProducto) !== 0) &&
                    idxList > -1) {

                    this.recibosSeleccionadosList.splice(idxList, 1);
                }
            }

        } else {
            this.recibosSeleccionadosList = null;
            this.recibosSeleccionadosList = [];
            this.recibosSeleccionadosList.push(reciboSeleccionado);

            for (i = 0; i < recibosProductoList.length; i++) {
                recibo = recibosProductoList[i];

                var fechaVencimientoRecibo = new Date(recibo.fechaVencimiento.substr(0, 10));

                if ((recibo.codEstado != '4' && recibo.montoPendiente > 0) &&
                    (fechaVencimientoRecibo <= fechaVencimientoReciboSeleccionado) &&
                    (reciboSeleccionado.idReciboProducto.localeCompare(recibo.idReciboProducto) !== 0)) {

                    this.recibosSeleccionadosList.push(recibo);
                }
            }
        }

    };

    this.isExists = function(reciboSeleccionado) {
        return this.recibosSeleccionadosList.indexOf(reciboSeleccionado) > -1;
    };

    this.obtenerAfiliacionFacturacionElectronica = function() {
        $scope.errorSwitchEmailElectronico = false;
        var requestAfiliacionFacturacionElectronica = {
            categoria: WPSCategoria.tv,
            idCuenta: $scope.recibosTvCtr.linea.ProductoServicioResponse.idCuenta,
            idRecibo: $scope.recibosTvCtr.linea.ProductoServicioResponse.idRecibo,
            idDireccion: $scope.recibosTvCtr.linea.ProductoServicioResponse.idDireccion
        };
        var dataAfiliacionFacturacionElectronica = $httpParamSerializer({ requestJson: angular.toJson(requestAfiliacionFacturacionElectronica) });

        recibosTvService.obtenerAfiliacionFacturacionElectronica(dataAfiliacionFacturacionElectronica).then(function(response) {
            var rpta = parseInt(response.data.obtenerAfiliacionFacturacionElectronicaResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerAfiliacionFacturacionElectronicaResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerAfiliacionFacturacionElectronicaResponse.defaultServiceResponse.mensaje;
            $scope.recibosTvCtr.afiliacionFacturaElectronicaFlag = false;
            if (rpta == 0) {
                $scope.recibosTvCtr.afiliacionFacturaElectronicaFlag = ("true" === response.data.obtenerAfiliacionFacturacionElectronicaResponse.resultado);
                $scope.recibosTvCtr.direccionFisica = response.data.obtenerAfiliacionFacturacionElectronicaResponse.direccionFisicaFacturacion;
                $scope.mostrarSwitchEmailElectronico = true;
                registrarAuditoriaExito(rpta, idTransaccion, "AFILIACION");
            } else {
                var mensajeAuditoria = operacionAfiliacionElectronica + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "AFILIACION");
                $scope.errorSwitchEmailElectronico = true;
            }
        }, function(error) {});
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
        $scope.recibosTvCtr.checkTermAfiliacion = false;
        $scope.recibosTvCtr.checkTermAfiliacionOtro = false;
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
                $timeout(function() { $scope.recibosTvCtr.ocultarPopUp(true) }, 1500);
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

                    afiliarDesafiliarEmail(1, $scope.recibosTvCtr.emailUsuarioEnProceso);

                    $('.step-progreso').fadeIn(250);
                }, 350);
                $timeout(function() { $scope.recibosTvCtr.ocultarPopUp(true) }, 1500);
            }, 350);
        } else {
            $form.find('.msg-error').html("Por favor, acepta los Términos y Condiciones.").show();
        }
    };

    function afiliarDesafiliarEmail(tipoAccionParm, emailParam) {
        var requestAfiliarEmail = {
            categoria: WPSCategoria.tv,
            idCuenta: $scope.recibosTvCtr.linea.ProductoServicioResponse.idCuenta,
            idRecibo: $scope.recibosTvCtr.linea.ProductoServicioResponse.idRecibo,
            idDireccion: $scope.recibosTvCtr.linea.ProductoServicioResponse.idDireccion,
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

        recibosTvService.actualizarAfiliacionFacturacionElectronica(dataActualizarAfiliacionFacturacionElectronica).then(function(response) {
            var rpta = parseInt(response.data.actualizarAfiliacionFacturacionElectronicaResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.actualizarAfiliacionFacturacionElectronicaResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.actualizarAfiliacionFacturacionElectronicaResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                $scope.recibosTvCtr.afiliacionFacturaElectronicaFlag = ("true" === response.data.actualizarAfiliacionFacturacionElectronicaResponse.resultado);
                if (tipoAccionParm === 1) {
                    $scope.recibosTvCtr.afiliacionFacturaElectronicaFlag = true;
                    registrarAuditoriaExito(rpta, idTransaccion, "AFILIAR");
                } else if (tipoAccionParm === 2) {
                    $scope.recibosTvCtr.afiliacionFacturaElectronicaFlag = false;
                    registrarAuditoriaExito(rpta, idTransaccion, "DESAFILIAR");
                }

            } else {
                var mensajeAuditoria = operacionActualizarFactElec + "-" + mensajeServicio;
                if (tipoAccionParm === 1) {
                    $scope.recibosTvCtr.afiliacionFacturaElectronicaFlag = false;
                    registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "AFILIAR");
                } else if (tipoAccionParm === 2) {
                    $scope.recibosTvCtr.afiliacionFacturaElectronicaFlag = true;
                    registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "DESAFILIAR");
                }
            }
        }, function(error) {});
    };

    this.enviarOtroEmail = function() {

        $form = $('#idformpoprecibo2');
        var valid = $form.validate();
        if (valid) {
            $form.find('.msg-error').hide();

            $timeout(function() {
                $('.step-02').fadeOut(150);
                $timeout(function() {
                    afiliarDesafiliarEmail(1, $scope.recibosTvCtr.emailOtro);
                    $('.step-progreso').fadeIn(250);
                }, 350);
                $timeout(function() { $scope.recibosTvCtr.ocultarPopUp(true) }, 1500);
            }, 350);
        } else {
            $form.find('.msg-error').html("Por favor, ingresa un correo electrónico válido y/o acepta los Términos y Condiciones.").show();
        }
    };

    var $curStep = undefined;

    this.terminosCondiciones = function() {
        recibosTvService.terminosCondiciones(objCondiciones).then(function(response) {
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
            $scope.recibosTvCtr.checkTermAfiliacion = true;
        } else if ($curStep.selector === ".step-02") {
            $scope.recibosTvCtr.checkTermAfiliacionOtro = true;
        }

        $('.step-term').fadeOut(150);
        $timeout(function() { $curStep.fadeIn(250); }, 350);
    };

    this.descargarRecibo = function(reciboObject, indicador) {

        var requestObtenerRecibosFisico = {
            categoria: WPSCategoria.tv,
            idProductoServicio: $scope.recibosTvCtr.linea.ProductoServicioResponse.idProductoServicio,
            idDireccion: $scope.recibosTvCtr.linea.ProductoServicioResponse.idDireccion,
            idCuenta: $scope.recibosTvCtr.linea.ProductoServicioResponse.idCuenta,
            idRecibo: $scope.recibosTvCtr.linea.ProductoServicioResponse.idRecibo,
            idReciboProducto: reciboObject.idReciboProducto,
            periodoRecibo: reciboObject.periodoRecibo,
            numeroRecibo: reciboObject.numeroRecibo,
            tipoReciboDocumentoPago: reciboObject.tipoReciboDocumentoPago
        };
        var dataObtenerRecibosFisico = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerRecibosFisico) });

        recibosTvService.obtenerRecibosFisico(dataObtenerRecibosFisico).then(function(response) {
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
        }, function(error) {});
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
            'category': 'Recibos - TV',
            'action': 'Clic en botón',
            'label': 'Pagar seleccionados'
        });

        flagTipoPago = false;
        if (this.recibosSeleccionadosList != '') {
            var montoPagar = parseFloat(0);
            var recibo = null;
            for (i = 0; i < this.recibosSeleccionadosList.length; i++) {
                recibo = this.recibosSeleccionadosList[i];
                montoPagar = montoPagar + parseFloat(recibo.montoPendiente);
            }
            var montoPagarFinal = montoPagar.toFixed(2);

            var arrSelec = [];

            for (var i = 0; i < $scope.recibosTvCtr.recibosSeleccionadosList.length; i++) {
                var objSelec = {
                    id: $scope.recibosTvCtr.recibosSeleccionadosList[i].numeroRecibo,
                    name: 'Recibo TV - ' + $scope.recibosTvCtr.recibosSeleccionadosList[i].mesRecibo,
                    price: $scope.recibosTvCtr.recibosSeleccionadosList[i].montoPendiente,
                    category: 'Pago recibo TV',
                    quantity: '1',
                    list: 'Recibo TV'
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

            ejecutarPago($scope.recibosTvCtr.recibosSeleccionadosList, montoPagarFinal, 1);
        }
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

                    recibosTvService.registrarFinTransaccionPagoTC(dataRegistrarFinTransaccionPagoTC).then(function(response) {
                        var rpta = parseInt(response.data.registrarFinTransaccionPagoTCResponse.defaultServiceResponse.idRespuesta);
                        var idTransaccion = response.data.registrarFinTransaccionPagoTCResponse.defaultServiceResponse.idTransaccional;
                        var mensajeServicio = response.data.registrarFinTransaccionPagoTCResponse.defaultServiceResponse.mensaje;
                        if (rpta == 0) {
                            $sessionStorage.dataTransaccionExitosa = response.data.registrarFinTransaccionPagoTCResponse;
                            $sessionStorage.dataTransaccionExitosa.idCuenta = $scope.recibosTvCtr.linea.ProductoServicioResponse.idCuenta;
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
                                    name: 'Recibo TV - ' + arrProdTC[i].mesRecibo,
                                    price: arrProdTC[i].monto,
                                    category: 'Pago recibo TV',
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
                    }, function(error) {});
                } else {
                    $location.path("/confirmacionErrorPagoView");
                }
            };
            $timeout(function() {
                Culqi.abrir();
            }, 100);
        }, 500);
    };

    this.pagarTotalDeuda = function() {

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Recibos - TV',
            'action': 'Clic en botón',
            'label': 'Pagar todo'
        });

        var flagTipoPago = true;
        var requestObtenerDeudaPendientePorPagar = {
            categoria: WPSCategoria.tv,
            idCuenta: $scope.recibosTvCtr.linea.ProductoServicioResponse.idCuenta,
            idRecibo: $scope.recibosTvCtr.linea.ProductoServicioResponse.idRecibo,
            idDireccion: $scope.recibosTvCtr.linea.ProductoServicioResponse.idDireccion,
            idProductoServicio: $scope.recibosTvCtr.linea.ProductoServicioResponse.idProductoServicio
        };
        var dataObtenerDeudaPendientePorPagar = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerDeudaPendientePorPagar) });

        recibosTvService.obtenerDeudaPendientePorPagar(dataObtenerDeudaPendientePorPagar).then(function(response) {
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
                        name: 'Recibo TV - ' + recibosPorPagarList[i].mesRecibo,
                        price: recibosPorPagarList[i].montoAPagar,
                        category: 'Pago recibo TV',
                        quantity: '1',
                        list: 'Recibo TV'
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
        }, function(error) {});
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

    function registrarInicioTransaccionPagoTC(idDireccion, idServicioPrincipalTvt, importePago, idCategoriaDeCompra, idProductoDeCompra, listaRecibos) {

        var requestRegistrarInicioTransaccionPagoTC = {
            tipoTransaccion: "1",
            categoria: WPSCategoria.tv,
            tipoCliente: WPSTipoCliente.consumer,
            idCuenta: $scope.recibosTvCtr.linea.ProductoServicioResponse.idCuenta,
            idRecibo: $scope.recibosTvCtr.linea.ProductoServicioResponse.idRecibo,
            idDireccion: idDireccion,
            idProductoServicio: $scope.recibosTvCtr.linea.ProductoServicioResponse.idProductoServicio,
            idServicioPrincipalTvt: idServicioPrincipalTvt,
            importePago: importePago,
            codigoMoneda: "1",
            idCategoriaDeCompra: idCategoriaDeCompra,
            idProductoDeCompra: idProductoDeCompra,
            listaRecibos: listaRecibos

        };
        var dataRegistrarInicioTransaccionPagoTC = $httpParamSerializer({ requestJson: angular.toJson(requestRegistrarInicioTransaccionPagoTC) });

        recibosTvService.registrarInicioTransaccionPagoTC(dataRegistrarInicioTransaccionPagoTC).then(function(response) {
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
        }, function(error) {});
    };


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
        if (op == 'LINEAFIJA') {
            objExitoAuditoria.lineafija = rpta;
        } else if (op == 'RECIBOS') {
            objExitoAuditoria.recibos = rpta;
        } else if (op == 'DEUDAPENDIENTE') {
            objExitoAuditoria.deuda = rpta;
        } else if (op == 'AFILIACION') {
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

        if (objExitoAuditoria.lineafija == 0 && objExitoAuditoria.recibos == 0 && objExitoAuditoria.deuda == 0 && objExitoAuditoria.electronica == 0) {
            guardarAuditoria(idTransaccion, estadoExito, codOperacionConsultaRecibo, "-");
        } else if (op == "FLAG" || op == "PREPAGO") {
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
            tipoLinea: tipoLineaAuditoria,
            tipoUsuario: $scope.recibosTvCtr.tipoClienteSession,
            perfil: tipoPermisoAuditoria,
            monto: '',
            descripcionoperacion: mensajeAuditoria,
            responseType: '-'
        };

        var dataAuditoria = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });

        recibosTvService.enviarAuditoria(dataAuditoria).then(function(response) {}, function() {});
    };

    $scope.IrCuentasClaro = function() {
        $.cookie('CuentasClaroWPSRetornar', '1', { path: '/' });
        window.location = "/wps/myportal/cuentasclaro/root?flagTuCuenta=true";
    };

    function actualizarProductoPrincipal(objetoActualizarFijo) {
        var actualizar = enviarDataActualizar(objetoActualizarFijo);
        recibosTvService.actualizarProductoPrincipal(actualizar).then(function(response) {}, function(error) {});
    };

    function enviarDataActualizar(objetoActualizarFijo) {
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

        requestActualizar.productoPrincipal = objetoActualizarFijo.ProductoServicioResponse.idProductoServicio;
        requestActualizar.nombreProductoPrincipal = objetoActualizarFijo.ProductoServicioResponse.nombre;
        requestActualizar.idDireccion = objetoActualizarFijo.ProductoServicioResponse.idDireccion;
        requestActualizar.idLinea = objetoActualizarFijo.ProductoServicioResponse.idLinea;
        requestActualizar.tipoLinea = objetoActualizarFijo.ProductoServicioResponse.tipoLinea;
        requestActualizar.categoria = objetoActualizarFijo.ProductoServicioResponse.categoria;
        requestActualizar.tipoClienteProductoPrincipal = WPSTipoCliente.consumer;

        dataActualizar = $httpParamSerializer({ requestJson: angular.toJson(requestActualizar) });
        return dataActualizar;
    };

});
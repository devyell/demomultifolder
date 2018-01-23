miClaroApp.controller("MiClaroHomeController", function($scope, $http, $httpParamSerializer, ServiciosFijaService) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    $scope.mostrarConsumos = false;
    var categoriaMovil = 1;
    var tipoPermiso = 5;
    var titularidadServicio = 7;
    var pagina = 0;
    var cantResultadosPagina = 0;
    var productoPrincipalXidRecibo = false;
    var tipoLinea = 3;
    var tipoCliente = 1;
    var allSuccess = true;
    var firstRender = true;
    var cantPeriodos = 3;
    $scope.datosAdicionalesFlag = null;
    $scope.rptaExito = null;
    $scope.showUpps = false;
    $scope.mostrarAdicional = false;
	var ResquestAuditoria = {
		operationCode: 'T0005',
		pagina: 'P009',
		transactionId: '',
		estado: '-',
		servicio: '-',
		tipoProducto: 'MOVIL',
		tipoLinea: '',
		tipoUsuario: '1',
		perfil: '',
		monto: '',
		descripcionoperacion: '-',
		responseType: '/'
	};

    ServiciosFijaService.getObtenerFlagProductoMovil().then(function(response) {

        $scope.flagServiciosMovil = response.data.comunResponseType.flagProductoMovilSesion;
        $scope.flagErrorServiciosMovil = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        $scope.flagIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
        $scope.tipoClienteUsuario = response.data.comunResponseType.tipoCliente;
        $scope.tipoLineaUsuario = response.data.comunResponseType.tipoLinea;

        if ($scope.tipoClienteUsuario == 4) {
            $scope.showSwitch = true;
        }

        if ($scope.flagErrorServiciosMovil == 0) {
            if ($scope.flagServiciosMovil != "-1") {
                if ($scope.flagServiciosMovil == 1 || $scope.flagServiciosMovil == 3) {
                    $scope.init();
                } else {
                    $("#movil").show();
                
                }
            } else {
                $("#movil").show();
               
                allSuccess = false;
            }
        } else {
            $scope.showUpps = true;
            $("#movil").show();
            allSuccess = false;
        }


    });

    $scope.init = function(objServicio) {

        ServiciosFijaService.getObtenerDatosSesion().then(function(response) {

            $scope.datosSesionFlag = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            $scope.datosSesionIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            $scope.servPrincipalMensaje = response.data.comunResponseType.defaultServiceResponse.mensaje;

            if ($scope.datosSesionFlag == 0) {
                getObtenerServiciosMovilWS(response.data);
            } else {
                $scope.showUpps = true;
                $("#movil").show();
                allSuccess = false;
            }

        });

    }

    getObtenerServiciosMovilWS = function(objServicio) {

        var obtenerServiciosRequest = {
            categoria: null,
            tipoLinea: null,
            tipoCliente: null,
            idProductoServicio: null,
            tipoPermiso: null,
            idCuenta: null,
            idRecibo: null,
            idDireccion: null,
            direccionCompleta: null,
            pagina: null,
            cantResultadosPagina: null,
            productoPrincipalXidRecibo: null,
            titularidadServicio: null
        }

        obtenerServiciosRequest.categoria = categoriaMovil;
        obtenerServiciosRequest.tipoLinea = tipoLinea;
        obtenerServiciosRequest.tipoCliente = tipoCliente;
        obtenerServiciosRequest.tipoPermiso = tipoPermiso;
        obtenerServiciosRequest.pagina = pagina;
        obtenerServiciosRequest.cantResultadosPagina = cantResultadosPagina;
        obtenerServiciosRequest.productoPrincipalXidRecibo = productoPrincipalXidRecibo;
        obtenerServiciosRequest.titularidadServicio = titularidadServicio;

        serviciosRequest = $httpParamSerializer({ requestJson: angular.toJson(obtenerServiciosRequest), tipoConsulta: '' });

        ServiciosFijaService.getObtenerServiciosWS(serviciosRequest).then(function(response) {

            $scope.serviciosList = response.data.obtenerServiciosResponse.listadoProductosServicios;
            $scope.errorFuncional = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;

            var breakEach = true;

            if ($scope.errorFuncional == 0) {
                if (Array.isArray($scope.serviciosList)) {
                    angular.forEach($scope.serviciosList, function(val, key) {
                        if (breakEach) {
                            if (val.ProductoServicioResponse.idProductoServicio == objServicio.comunResponseType.productoPrincipal) {
                                $scope.servicio = $scope.serviciosList[key];
								ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
								ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
								ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;
                                breakEach = false;
                            } else {
                                $scope.servicio = $scope.serviciosList[0];
								ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
								ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
								ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;
                            }
                        }
                    });
                } else {
                    $scope.serviciosList = [];
                    $scope.serviciosList.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                    $scope.servicio = $scope.serviciosList[0];
					ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
					ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
					ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;
                    $('select').css({ display: 'none' });
                    $('#textox').css({ background: 'none' });
                }
                getObtenerDatosAdicionalesMovilWS($scope.servicio);
                getObtenerConsumoGeneralMovilWS($scope.servicio);
                $("#textox").html($scope.servicio.ProductoServicioResponse.nombreAlias);
            } else {
                $scope.showUpps = true;
                $("#movil").show();
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerServicios "+mensaje;
				auditoria();
                allSuccess = false;
            }

        });

    };

    getObtenerDatosAdicionalesMovilWS = function(objServicio) {

        var idProdServ = objServicio.ProductoServicioResponse.idProductoServicio;
        var idC = objServicio.ProductoServicioResponse.idCuenta;
        var idR = objServicio.ProductoServicioResponse.idRecibo;
        var tCliente = objServicio.ProductoServicioResponse.tipoCliente;

        var obtenerDatosAdicionalesMovilRequest = {
            "idProductoServicio": null,
            "idCuenta": null,
            "idRecibo": null,
            "tipoCliente": null

        }

        obtenerDatosAdicionalesMovilRequest.idProductoServicio = idProdServ;
        obtenerDatosAdicionalesMovilRequest.idCuenta = idC;
        obtenerDatosAdicionalesMovilRequest.idRecibo = idR;
        obtenerDatosAdicionalesMovilRequest.tipoCliente = tCliente;

        serviciosRequest = $httpParamSerializer({ requestJson: angular.toJson(obtenerDatosAdicionalesMovilRequest) });
        ServiciosFijaService.getObtenerDatosAdicionalesMovilWS(serviciosRequest).then(function(response) {

            $scope.datosAdicionales = response.data.obtenerDatosAdicionalesServicioMovilResponse;
            $scope.datosAdicionalesFlag = $scope.datosAdicionales.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId  = $scope.datosAdicionales.defaultServiceResponse.idTransaccional;
            var mensaje = $scope.datosAdicionales.defaultServiceResponse.mensaje;

            if ($scope.datosAdicionales.saldoPrepago == 0 && $scope.servicio.ProductoServicioResponse.tipoLinea == 1) {
                $scope.mostrarConsumos = false;
            } else {
                $scope.mostrarConsumos = true;
            }

            if ($scope.datosAdicionalesFlag != 0) {
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerDatosAdicionalesServicioMovil - "+mensaje;
				auditoria();
                allSuccess = false;
            }
        });
    }

    getObtenerConsumoGeneralMovilWS = function(objServicio) {

        var idProdServ = objServicio.ProductoServicioResponse.idProductoServicio;
        var idC = objServicio.ProductoServicioResponse.idCuenta;
        var idR = objServicio.ProductoServicioResponse.idRecibo;
        var tCliente = objServicio.ProductoServicioResponse.tipoCliente;

        var obtenerConsumoGeneralMovilRequest = {
            "idProductoServicio": null,
            "idCuenta": null,
            "idRecibo": null,
            "tipoCliente": null
        }

        obtenerConsumoGeneralMovilRequest.idProductoServicio = idProdServ;
        obtenerConsumoGeneralMovilRequest.idCuenta = idC;
        obtenerConsumoGeneralMovilRequest.idRecibo = idR;
        obtenerConsumoGeneralMovilRequest.tipoCliente = tCliente;

        data = $httpParamSerializer({ requestJson: angular.toJson(obtenerConsumoGeneralMovilRequest) });
        ServiciosFijaService.getObtenerConsumosGeneralesMovilWS(data).then(function(response) {

            $scope.consumosResponse = response.data.obtenerConsumoGeneralMovilResponse;
            $scope.rptaExito = response.data.obtenerConsumoGeneralMovilResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId  = response.data.obtenerConsumoGeneralMovilResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerConsumoGeneralMovilResponse.defaultServiceResponse.mensaje;

            if ($scope.rptaExito == 0) {

                $scope.mostrarDataMmsSms = true;
                $scope.mostrarDataInternet = true;
                $scope.mostrarDataLlamadas = true;
                $scope.mostrarListaAdicionales = true;
                $scope.mostrarListaPrincipal = true;
                $scope.mostrarListaActivos = true;
                $scope.mostrarListaPendientes = true;
                $scope.mostrarLlaamadasAdicionales = true;
                $scope.mostrarLlaamadasPrincipal = true;
                $scope.mostrarLlaamadasRegalados = true;
                $scope.mostrarLlaamadasPendientes = true;
                $scope.mostrarSmsAdicional = true;
                $scope.mostrarMmsPrincipal = true;
                $scope.mostrarSmsPrincipal = true;
                $scope.mostrarSmsRegalado = true;
                $scope.mostrarMmsPendiente = true;
                $scope.mostrarSmsPendiente = true;
                $scope.mostrarConsumos = true;

                var objInternet = response.data.obtenerConsumoGeneralMovilResponse.internet;
                var objLlamadas = response.data.obtenerConsumoGeneralMovilResponse.llamadas;
                var objMmsSms = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms;

                if (objInternet != '' && objInternet != undefined) {

                    $scope.internetListaAdicionalesPlan = response.data.obtenerConsumoGeneralMovilResponse.internet.listaAdicionalesPlan;
                    $scope.internetListaBolsaPrincipalInternet = response.data.obtenerConsumoGeneralMovilResponse.internet.listaBolsaPrincipalInternet;
                    $scope.internetListaPaquetesActivos = response.data.obtenerConsumoGeneralMovilResponse.internet.listaPaquetesActivos;
                    $scope.internetListaPaquetesPendientes = response.data.obtenerConsumoGeneralMovilResponse.internet.listaPaquetesPendientes;

                    if ($scope.internetListaAdicionalesPlan != '' && $scope.internetListaAdicionalesPlan != undefined) {
                        if (angular.isArray($scope.internetListaAdicionalesPlan)) {
                            angular.forEach($scope.internetListaAdicionalesPlan, function(val, key) {
                                $scope.fechaVencimientoAdicional = $scope.internetListaAdicionalesPlan[0].fechaVencimiento;
                            });
                        } else {
                            $scope.internetListaAdicionalesPlan = [];
                            $scope.internetListaAdicionalesPlan.push(response.data.obtenerConsumoGeneralMovilResponse.internet.listaAdicionalesPlan);
                            angular.forEach($scope.internetListaAdicionalesPlan, function(val, key) {
                                $scope.fechaVencimientoAdicional = $scope.internetListaAdicionalesPlan[0].fechaVencimiento;
                            });
                        }
                    } else {
                        $scope.mostrarListaAdicionales = false;
                    }
                    if ($scope.internetListaBolsaPrincipalInternet != '' && $scope.internetListaBolsaPrincipalInternet != undefined) {
                        if (angular.isArray($scope.internetListaBolsaPrincipalInternet)) {} else {
                            $scope.internetListaBolsaPrincipalInternet = [];
                            $scope.internetListaBolsaPrincipalInternet.push(response.data.obtenerConsumoGeneralMovilResponse.internet.listaBolsaPrincipalInternet);
                        }
                    } else {
                        $scope.mostrarListaPrincipal = false;
                    }
                    if ($scope.internetListaPaquetesActivos != '' && $scope.internetListaPaquetesActivos != undefined) {
                        if (angular.isArray($scope.internetListaPaquetesActivos)) {} else {
                            $scope.internetListaPaquetesActivos = [];
                            $scope.internetListaPaquetesActivos.push(response.data.obtenerConsumoGeneralMovilResponse.internet.listaPaquetesActivos);
                        }
                    } else {
                        $scope.mostrarListaActivos = false;
                    }

                    if ($scope.internetListaPaquetesPendientes != '' && $scope.internetListaPaquetesPendientes != undefined) {


                        if (angular.isArray($scope.internetListaPaquetesPendientes)) {} else {
                            $scope.internetListaPaquetesPendientes = [];
                            $scope.internetListaPaquetesPendientes.push(response.data.obtenerConsumoGeneralMovilResponse.internet.listaPaquetesPendientes);
                        }
                    } else {
                        $scope.mostrarListaPendientes = false;
                    }

                } else {
                    $scope.mostrarDataInternet = false;
                }

                if (objLlamadas != '' && objLlamadas != undefined) {
                    $scope.llamadasListaAdicionalesPlan = response.data.obtenerConsumoGeneralMovilResponse.llamadas.listaAdicionalesPlan;
                    $scope.llamadasListaBolsaPrincipalLlamadas = response.data.obtenerConsumoGeneralMovilResponse.llamadas.listaBolsaPrincipalLlamadas;
                    $scope.llamadasListaBonosRegalados = response.data.obtenerConsumoGeneralMovilResponse.llamadas.listaBonosRegalados;
                    $scope.llamadasListaPaquetesPendientesLlamadas = response.data.obtenerConsumoGeneralMovilResponse.llamadas.listaPaquetesPendientesLlamadas;

                    if ($scope.llamadasListaAdicionalesPlan != '' && $scope.llamadasListaAdicionalesPlan != undefined) {
                        $scope.mostrarAdicional = true;
                        if (angular.isArray($scope.llamadasListaAdicionalesPlan)) {
                            angular.forEach($scope.llamadasListaAdicionalesPlan, function(val, key) {
                                $scope.fechaVencimientoAdicionalLlamadas = $scope.llamadasListaAdicionalesPlan[0].fechaVencimiento;
                            });
                        } else {
                            $scope.llamadasListaAdicionalesPlan = [];
                            $scope.llamadasListaAdicionalesPlan.push(response.data.obtenerConsumoGeneralMovilResponse.llamadas.listaAdicionalesPlan);
                            angular.forEach($scope.llamadasListaAdicionalesPlan, function(val, key) {
                                $scope.fechaVencimientoAdicionalLlamadas = $scope.llamadasListaAdicionalesPlan[0].fechaVencimiento;
                            });
                        }
                    } else {
                        $scope.mostrarLlaamadasAdicionales = false;
                    }
                    if ($scope.llamadasListaBolsaPrincipalLlamadas != '' && $scope.llamadasListaBolsaPrincipalLlamadas != undefined) {
                        if (angular.isArray($scope.llamadasListaBolsaPrincipalLlamadas)) {} else {
                            $scope.llamadasListaBolsaPrincipalLlamadas = [];
                            $scope.llamadasListaBolsaPrincipalLlamadas.push(response.data.obtenerConsumoGeneralMovilResponse.llamadas.listaBolsaPrincipalLlamadas);


                        }
                    } else {
                        $scope.mostrarLlaamadasPrincipal = false;
                    }
                    if ($scope.llamadasListaBonosRegalados != '' && $scope.llamadasListaBonosRegalados != undefined) {
                        if (angular.isArray($scope.llamadasListaBonosRegalados)) {} else {
                            $scope.llamadasListaBonosRegalados = [];
                            $scope.llamadasListaBonosRegalados.push(response.data.obtenerConsumoGeneralMovilResponse.llamadas.listaBonosRegalados);
                        }
                    } else {
                        $scope.mostrarLlaamadasRegalados = false;
                    }
                    if ($scope.llamadasListaPaquetesPendientesLlamadas != '' && $scope.llamadasListaPaquetesPendientesLlamadas != undefined) {
                        if (angular.isArray($scope.llamadasListaPaquetesPendientesLlamadas)) {} else {
                            $scope.llamadasListaPaquetesPendientesLlamadas = [];
                            $scope.llamadasListaPaquetesPendientesLlamadas.push(response.data.obtenerConsumoGeneralMovilResponse.llamadas.listaPaquetesPendientesLlamadas);
                        }
                    } else {
                        $scope.mostrarLlaamadasPendientes = false;
                    }
                } else {
                    $scope.mostrarDataLlamadas = false;
                }

                if (objMmsSms != '' && objMmsSms != undefined) {
                    $scope.smsyMmmsListaAdicionalesPlan = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaAdicionalesPlan;
                    $scope.smsyMmmsListaBolsaPrincipalMMS = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaBolsaPrincipalMMS;
                    $scope.smsyMmmsListaBolsaPrincipalSms = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaBolsaPrincipalSms;
                    $scope.smsyMmmsListaBonosRegalados = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaBonosRegalados;
                    $scope.smsyMmmsListaPaquetesPendientesMMS = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaPaquetesPendientesMMS;
                    $scope.smsyMmmsListaPaquetesPendientesSMS = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaPaquetesPendientesSMS;

                    if ($scope.smsyMmmsListaAdicionalesPlan != '' && $scope.smsyMmmsListaAdicionalesPlan != undefined) {
                        if (angular.isArray($scope.smsyMmmsListaAdicionalesPlan)) {} else {
                            $scope.smsyMmmsListaAdicionalesPlan = [];
                            $scope.smsyMmmsListaAdicionalesPlan.push(response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaAdicionalesPlan);
                        }
                    } else {
                        $scope.mostrarSmsAdicional = false;
                    }

                    if ($scope.smsyMmmsListaBolsaPrincipalMMS != '' && $scope.smsyMmmsListaBolsaPrincipalMMS != undefined) {
                        if (angular.isArray($scope.smsyMmmsListaBolsaPrincipalMMS)) {} else {
                            $scope.smsyMmmsListaBolsaPrincipalMMS = [];
                            $scope.smsyMmmsListaBolsaPrincipalMMS.push(response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaBolsaPrincipalMMS);
                        }
                    } else {
                        $scope.mostrarMmsPrincipal = false;
                    }

                    if ($scope.smsyMmmsListaBolsaPrincipalSms != '' && $scope.smsyMmmsListaBolsaPrincipalSms != undefined) {
                        if (angular.isArray($scope.smsyMmmsListaBolsaPrincipalSms)) {} else {
                            $scope.smsyMmmsListaBolsaPrincipalSms = [];
                            $scope.smsyMmmsListaBolsaPrincipalSms.push(response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaBolsaPrincipalSms);
                        }
                    } else {
                        $scope.mostrarSmsPrincipal = false;
                    }

                    if ($scope.smsyMmmsListaBonosRegalados != '' && $scope.smsyMmmsListaBonosRegalados != undefined) {
                        if (angular.isArray($scope.smsyMmmsListaBonosRegalados)) {} else {
                            $scope.smsyMmmsListaBonosRegalados = [];
                            $scope.smsyMmmsListaBonosRegalados.push(response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaBonosRegalados);
                        }
                    } else {
                        $scope.mostrarSmsRegalado = false;
                    }

                    if ($scope.smsyMmmsListaPaquetesPendientesMMS != '' && $scope.smsyMmmsListaPaquetesPendientesMMS != undefined) {
                        if (angular.isArray($scope.smsyMmmsListaPaquetesPendientesMMS)) {} else {
                            $scope.smsyMmmsListaPaquetesPendientesMMS = [];
                            $scope.smsyMmmsListaPaquetesPendientesMMS.push(response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaPaquetesPendientesMMS);
                        }
                    } else {
                        $scope.mostrarMmsPendiente = false;
                    }

                    if ($scope.smsyMmmsListaPaquetesPendientesSMS != '' && $scope.smsyMmmsListaPaquetesPendientesSMS != undefined) {
                        if (angular.isArray($scope.smsyMmmsListaPaquetesPendientesSMS)) {} else {
                            $scope.smsyMmmsListaPaquetesPendientesSMS = [];
                            $scope.smsyMmmsListaPaquetesPendientesSMS.push(response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaPaquetesPendientesSMS);
                        }
                    } else {
                        $scope.mostrarSmsPendiente = false;
                    }

                } else {
                    $scope.mostrarDataMmsSms = false;
                }

            } else {
                $scope.mostrarConsumos = true;
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerDatosAdicionalesServicioMovil - "+mensaje;
				auditoria();
                allSuccess = false;
            }

            if (allSuccess = true) {

               	ResquestAuditoria.estado = "SUCCESS";
				ResquestAuditoria.descripcionoperacion = "-";
				auditoria();
            }

            if (firstRender) {
                $("#movil").delay(400).show();
                aniamteBox(".box");
                firstRender = false;
            }

        }, function(error) {

        });
    };

    this.cambioServicio = function() {
        $scope.mostrarDataInternet = false;
        $scope.mostrarDataLlamadas = false;
        $scope.mostrarDataMmsSms = false;
        $scope.mostrarConsumos = false;
        $scope.datosAdicionalesFlag = null;
        $scope.rptaExito = null;
		ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
		ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
		ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;

        $("#textox").html($scope.servicio.ProductoServicioResponse.nombreAlias);


        getObtenerDatosAdicionalesMovilWS($scope.servicio);
        getObtenerConsumoGeneralMovilWS($scope.servicio);
        actualizarProductoPrincipalSesion($scope.servicio);

        $("#movil").hide()
        $("#movil").delay(400).show(0);
        setTimeout(function() { aniamteBox('.box'); }, 400);
    };

    function actualizarProductoPrincipalSesion(objServicio) {

        var appProductoPrincipal = objServicio.ProductoServicioResponse.idProductoServicio;
        var appNombreProductoPrincipal = objServicio.ProductoServicioResponse.nombreAlias;
        var appIdCuenta = objServicio.ProductoServicioResponse.idCuenta;
        var appIdRecibo = objServicio.ProductoServicioResponse.idRecibo;
        var appTipoLinea = objServicio.ProductoServicioResponse.tipoLinea;
        var appCategoria = objServicio.ProductoServicioResponse.categoria;
        var appTipoClientePrincipal = objServicio.ProductoServicioResponse.tipoCliente;

        var actualizarServicioSesion = {
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

        actualizarServicioSesion.productoPrincipal = appProductoPrincipal;
        actualizarServicioSesion.nombreProductoPrincipal = appNombreProductoPrincipal;
        actualizarServicioSesion.idCuenta = appIdCuenta;
        actualizarServicioSesion.idRecibo = appIdRecibo;
        actualizarServicioSesion.tipoLinea = appTipoLinea;
        actualizarServicioSesion.categoria = appCategoria;
        actualizarServicioSesion.tipoClienteProductoPrincipal = appTipoClientePrincipal;

        data = $httpParamSerializer({ requestJson: angular.toJson(actualizarServicioSesion) });

        ServiciosFijaService.actualizarProductoPrincipalSesion(data).then(function(response) {

        });

    };

    $scope.recargaDatosAdicionales = function() {

        getObtenerDatosAdicionalesMovilWS($scope.servicio);

        var $time = 0;
        var $tpos = 0;
        $('.box').each(function(ix, el) {
            var $tmp = $(this);
            var $pos = $(this).offset().top;

            if ($tpos != $pos) {
                $tpos = $pos;
                $time = $time + 150;
            }
            $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 250);
        });
    }

    $scope.recargaConsumos = function() {

        getObtenerConsumoGeneralMovilWS($scope.servicio);

        var $time = 0;
        var $tpos = 0;
        $('.boxConsumos').each(function(ix, el) {
            var $tmp = $(this);
            var $pos = $(this).offset().top;

            if ($tpos != $pos) {
                $tpos = $pos;
                $time = $time + 150;
            }
            $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 250);
        });
    }

    function auditoria() {

        var Resquest = $httpParamSerializer({ requestJson: angular.toJson(ResquestAuditoria) });
        ServiciosFijaService.enviarAuditoria(Resquest).then(function(response) {

        }, function(error) {

        });

    }

    aniamteBox = function(boxClass) {

        var $time = 0;
        var $tpos = 0;
        $(boxClass).each(function(ix, el) {
            var $tmp = $(this);
            var $pos = $(this).offset().top;

            if ($tpos != $pos) {
                $tpos = $pos;
                $time = $time + 150;
            }
            $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 400);
        });

    }

    $scope.switchChange = function() {

        window.location.replace("/wps/myportal/miclaro/corporativo/consultas/saldosyconsumos/movil");

    }

});

miClaroApp.directive('valCustom', function() {  
    return function(scope, element, attrs) {
        attrs.$observe('valCustom', function() {
            var percent = '<div class=\"percent\"></div>';
            element.append(percent);
            element.find('.percent').css({ background: element.attr("data-color") });
            element.find('.percent').animate({ width: element.attr("data-percent") + '%' }, 350);
            if (element.attr("data-value") !== undefined && element.attr("data-value") !== '') {
                var divvalue = $('<span class=\"txt\">' + element.attr("data-value") + element.attr("data-unidad") + '</span>');
                element.append(divvalue);
                element.find('.txt').animate({ left: element.attr("data-percent") + '%', opacity: 1 });
            }
        });
    }

})

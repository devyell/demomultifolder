app.controller("ConsultarHistorialTransaccionesController", function($scope, $timeout, $location, $httpParamSerializer, consultarHistorialTransaccionesService, FileSaver, Blob) {

    $(document).ready(function(e) {
        var $input = $("#autocomplete-filtro-movil");

        if ($input.val() == "") {
            $input.val($input.attr("data-holder"));
        }

        $input.focus(function() {
            $input.parent().addClass("focus");
            if ($input.val() == $input.attr("data-holder")) {
                $input.val("");
            }
        });

        $input.blur(function() {
            $input.parent().removeClass("focus");
            if ($input.val() == "") {
                $input.val($input.attr("data-holder"));
            }
        });

        $("#autocomplete-filtro-movil").autocomplete({
            lookup: function(query, done) {

                var criterioBusqueda = query;
                var arrayListAuto = [];
                var requestAutocompletar = {
                    "tipoLinea": null,
                    "tipoCliente": null,
                    "tipoPermiso": WPSTipoPermiso.todos,
                    "idCuenta": null,
                    "idRecibo": null,
                    "criterioBusqueda": null,
                    "pagina": null,
                    "cantResultadosPagina": null,
                    "titularidadServicio": WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado
                };

                requestAutocompletar.tipoLinea = WPSTipoLinea.postpago;
                requestAutocompletar.tipoCliente = WPSTipoCliente.corporativo;
                requestAutocompletar.criterioBusqueda = criterioBusqueda;
                requestAutocompletar.pagina = 0;
                requestAutocompletar.cantResultadosPagina = 0;

                var dataLineaAutoRequest = $httpParamSerializer({ requestJson: angular.toJson(requestAutocompletar) });

                consultarHistorialTransaccionesService.getObtenerListadoMovilCorporativoReciboAutoCompletar(dataLineaAutoRequest).then(function(response) {
                    var idRptaAutocomplete = response.data.obtenerListadoMovilesResponse.defaultServiceResponse.idRespuesta;

                    if (idRptaAutocomplete == 0) {
                        var dataArrayAutoComplete = response.data.obtenerListadoMovilesResponse.listadoProductosServicios;
                        $scope.consultarHistorialTransaccionesCtr.listLineasAutocompleted = [];

                        if (angular.isArray(dataArrayAutoComplete)) {
                            $scope.consultarHistorialTransaccionesCtr.listLineasAutocompleted = dataArrayAutoComplete;
                        } else {
                            $scope.consultarHistorialTransaccionesCtr.listLineasAutocompleted.push(dataArrayAutoComplete);
                        }

                        angular.forEach($scope.consultarHistorialTransaccionesCtr.listLineasAutocompleted, function(val, key) {
                            var objectAutoComplete = { value: val.nombreAlias, data: val.idCuenta + "|" + val.idRecibo + "|" + val.idProductoServicio }
                            arrayListAuto.push(objectAutoComplete);
                        });

                        var result = { suggestions: arrayListAuto };
                        done(result);
                    }
                }, function(error) {

                });
            },
            minChars: 4,
            onSelect: function(suggestion) {
                manejadorSeleccionAutocomplete(suggestion);
            }
        });
    });

    this.tab;

    var paginaVarComprasRecargas = 1;
    var paginaVarSolicitudes = 1;
    var paginaVarContratosServicios = 1;

    var contadorVerMasComprasRecargas = 0;
    var contadorVerMasSolicitudes = 0;
    var contadorVerMasContratosServicios = 0;

    $scope.contBotonVerMasComprasRecargas = true;
    $scope.contBotonVerMasComprasRecargasMsg = false
    this.contBotonVerMasSolicitudes = true;
    this.contBotonVerMasContratosServicios = true;

    this.barraCorporativo = false;

    this.idCuentaPrincipal = null;
    this.idReciboPrincipal = null;
    this.idProductoPrincial = null;

    $scope.mostrarCombos = false;
    $scope.mostrarContenidoLineas = false;
    $scope.errorComprasyRecargas = false;
    $scope.mostrarComprasyRecargas = false;
    $scope.errorSolicitudesPeriodo = false;
    $scope.mostrarSolicitudesPeriodo = false;
    $scope.errorContratosServiciosPeriodo = false;
    $scope.mostrarContratosServiciosPeriodo = false;
    $scope.mostrarMensajeSolicitud = false;
    $scope.mostrarMensajeCompras = false;
    $scope.mostrarMensajeContratos = false;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    $scope.mensaje_upps_documento = WPSConsultarHistorialTransaccionesConsumerB2E.FLUJOALTERNO10_1;
    $scope.mensaje_upps_fecha = WPSConsultarHistorialTransaccionesConsumerB2E.FLUJOALTERNO10_2;

    var pagIdHistorialTransaccionesMovil = WPSPageID.miclaro_corporativo_consultas_historialtransacciones_movil;
    var codComprasyRecargas = WPSTablaOperaciones.consultaHistorialTransaccionesComprasRecargas;
    var codConsultaSolicitud = WPSTablaOperaciones.consultaHistorialTransaccionesSolicitudes;
    var codDescargarSolicitud = WPSTablaOperaciones.descargaHistorialTransaccionesSolicitudes;
    var codConsultaContratos = WPSTablaOperaciones.consultaHistorialTransaccionesContratos;
    var codDescargarContrato = WPSTablaOperaciones.descargaHistorialTransaccionesContratos;

    var operacionObtenerServicio = 'getObtenerServicios';
    var operacionObtenerComprasRecargas = 'obtenerComprasRecargasPeriodo';
    var operacionArchivoSolicitudPeriodo = 'obtenerArchivoSolicitudPeriodo';
    var operacionContratosPeriodo = 'obtenerContratosServiciosPeriodo';
    var operacionArchivoServicioPeriodo = 'obtenerArchivoContratoServiciosPeriodo';
    var operacionObtenerSolicitudes = 'obtenerSolicitudesPeriodo';
    var operacionObtenerCuenta = 'obtenerListadoMovilCorporativoCuenta';
    var operacionObtenerRecibo = 'obtenerListadoMovilCorporativoRecibo';
    var tipoProductoAuditoria = 'MOVIL';
    var estadoExito = 'SUCCESS';
    var estadoError = 'ERROR';
    var servicioParam = '-';
    var tipoLineaAudi = '-';
    var tipoPermisoAudi = '-';
    var indiLoad = 1;
    this.flagMostrarSwitch = false;


    function manejadorSeleccionAutocomplete(input) {

        var idCuenta = input.data.split("|")[0];
        var idRecibo = input.data.split("|")[1];
        var idProductoServicio = input.data.split("|")[2];

        var listaCuentas = $scope.consultarHistorialTransaccionesCtr.cuentasCorporativasList;

        for (i = 0; i < listaCuentas.length; i++) {
            var cuenta = listaCuentas[i];

            if (cuenta.idCuenta === idCuenta) {
                $scope.consultarHistorialTransaccionesCtr.cuenta = cuenta;
                break;
            }
        }

        $scope.consultarHistorialTransaccionesCtr.obtenerRecibos();

        var listaRecibos = $scope.consultarHistorialTransaccionesCtr.recibosCorporativosList;

        for (x = 0; x < listaRecibos.length; x++) {
            var recibo = listaRecibos[x];

            if (recibo.idRecibo === idRecibo) {
                $scope.consultarHistorialTransaccionesCtr.recibo = recibo;
                break;
            }
        }

        $scope.consultarHistorialTransaccionesCtr.obtenerLineas();
    }

    this.getBarraCorporativo = function() {
        return this.barraCorporativo;
    };

    this.setBarraCorporativo = function() {
        this.barraCorporativo = !this.barraCorporativo;
    }

    $scope.switchChange = function() {
        switchChangeEvent();
    };

    function switchChangeEvent() {
        window.location.href = "/wps/myportal/miclaro/consumer/consultas/historialtransacciones/movil";
    };

    this.obtenerDatosUsuarioSesion = function() {
        consultarHistorialTransaccionesService.obtenerDatosUsuarioSesion().then(function(response) {
            var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            if (rpta == 0) {
                $scope.consultarHistorialTransaccionesCtr.tipoClienteSession = response.data.comunResponseType.tipoCliente;
                var flagProductoMovilSesion = response.data.comunResponseType.flagProductoMovilSesion;

                if ($scope.consultarHistorialTransaccionesCtr.tipoClienteSession == WPSTipoCliente.mixto) {
                    $scope.consultarHistorialTransaccionesCtr.flagMostrarSwitch = true;
                }

                if (flagProductoMovilSesion == "2" || flagProductoMovilSesion == "3") {
                    $scope.consultarHistorialTransaccionesCtr.obtenerServicioPrincipal();
                } else if (flagProductoMovilSesion == "0" || flagProductoMovilSesion == "1") {
                    $location.path("/nuevoServicioView");
                    registrarAuditoriaExito(rpta, idTransaccion, "FLAG");
                } else if (flagProductoMovilSesion == "-1") {
                    $location.path("/errorGeneralWiew");
                    var mensajeAuditoria = operacionObtenerServicio + "- flagMovil";
                    registrarAuditoriaError(flagProductoMovilSesion, idTransaccion, mensajeAuditoria, null);
                }
            } else {
                $location.path("/errorWiew");
            }

        }, function(error) {

        });
    };

    this.obtenerServicioPrincipal = function() {
        consultarHistorialTransaccionesService.obtenerServicioPrincipal().then(function(response) {
            var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;

            if (rpta == 0) {
                var categoriaPrincipal = response.data.comunResponseType.categoria;
                var tipoClientePrincipal = response.data.comunResponseType.tipoClienteProductoPrincipal;
                if (categoriaPrincipal == "1" && tipoClientePrincipal == "2") {
                    $scope.lineaPrincipal = response.data.comunResponseType.nombreProductoPrincipal;
                    $scope.consultarHistorialTransaccionesCtr.idCuentaPrincipal = response.data.comunResponseType.idCuenta;
                    $scope.consultarHistorialTransaccionesCtr.idReciboPrincipal = response.data.comunResponseType.idRecibo;
                    $scope.consultarHistorialTransaccionesCtr.idProductoPrincial = response.data.comunResponseType.productoPrincipal;

                    $scope.consultarHistorialTransaccionesCtr.getCuentasCoorporativosFn();
                } else {
                    $scope.consultarHistorialTransaccionesCtr.idCuentaPrincipal = null;
                    $scope.consultarHistorialTransaccionesCtr.idReciboPrincipal = null;
                    $scope.consultarHistorialTransaccionesCtr.idProductoPrincial = null;

                    $scope.consultarHistorialTransaccionesCtr.getCuentasCoorporativosFn();
                }

            } else {
                $location.path("/errorWiew");
            }
        }, function(error) {

        });
    };

    this.inicializar = function() {
        this.obtenerDatosUsuarioSesion();
    };

    this.inicializar();

    this.verMasComprasRecargas = function(indicador) {
        paginaVarComprasRecargas++;

        contadorVerMasComprasRecargas++;

        if (contadorVerMasComprasRecargas < 4) {
            this.obtenerComprasRecargasPeriodo(indicador);
        } else {
            $scope.contBotonVerMasComprasRecargas = false;
            $scope.contBotonVerMasComprasRecargasMsg = true;
        }
    };

    this.verMasSolicitudes = function(indicador) {
        paginaVarSolicitudes++;

        this.obtenerSolicitudes(indicador);

    };

    this.verMasContratos = function(indicador) {
        paginaVarContratosServicios++;

        this.obtenerContratosServicios(indicador);

    };

    this.getCuentasCoorporativosFn = function() {
        consultarHistorialTransaccionesService.getCuentasCoorporativos().then(function(response) {
            var rpta = parseInt(response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.mensaje;

            if (rpta == 0) {
                $scope.consultarHistorialTransaccionesCtr.cuentasCorporativasList = [];
                var dataCuentas = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta;

                if (angular.isArray(dataCuentas)) {
                    $scope.consultarHistorialTransaccionesCtr.cuentasCorporativasList = dataCuentas;
                } else {
                    $scope.consultarHistorialTransaccionesCtr.cuentasCorporativasList.push(dataCuentas);
                }

                $scope.consultarHistorialTransaccionesCtr.cuenta = $scope.consultarHistorialTransaccionesCtr.cuentasCorporativasList[0];

                if ($scope.consultarHistorialTransaccionesCtr.idCuentaPrincipal != null) {
                    angular.forEach($scope.consultarHistorialTransaccionesCtr.cuentasCorporativasList, function(val, key) {
                        if (val.idCuenta === $scope.consultarHistorialTransaccionesCtr.idCuentaPrincipal) {
                            $scope.consultarHistorialTransaccionesCtr.cuenta = $scope.consultarHistorialTransaccionesCtr.cuentasCorporativasList[key];
                        }
                    });
                }

                $scope.consultarHistorialTransaccionesCtr.obtenerRecibos();
            } else {
                var mensajeAuditoria = operacionObtenerCuenta + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'CUENTA');
                $location.path("/errorWiew");
            }
        }, function(error) {

            $location.path("/errorWiew");
        });
    };

    this.obtenerRecibos = function() {
        var idCuenta = this.cuenta.idCuenta;
        var requestReciboCoor = {
            "idCuenta": idCuenta
        };

        dataReciboCoor = $httpParamSerializer({ requestJson: angular.toJson(requestReciboCoor) });

        consultarHistorialTransaccionesService.getReciboCoorporativos(dataReciboCoor).then(function(response) {
            var rpta = parseInt(response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.mensaje;

            if (rpta == 0) {
                $scope.consultarHistorialTransaccionesCtr.recibosCorporativosList = [];
                var dataRecibosList = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo;

                if (angular.isArray(dataRecibosList)) {
                    $scope.consultarHistorialTransaccionesCtr.recibosCorporativosList = dataRecibosList;
                } else {
                    $scope.consultarHistorialTransaccionesCtr.recibosCorporativosList.push(dataRecibosList);
                }

                $scope.consultarHistorialTransaccionesCtr.recibo = $scope.consultarHistorialTransaccionesCtr.recibosCorporativosList[0];

                if ($scope.consultarHistorialTransaccionesCtr.idReciboPrincipal != null) {
                    angular.forEach($scope.consultarHistorialTransaccionesCtr.recibosCorporativosList, function(val, key) {
                        if (val.idRecibo === $scope.consultarHistorialTransaccionesCtr.idReciboPrincipal) {
                            $scope.consultarHistorialTransaccionesCtr.recibo = $scope.consultarHistorialTransaccionesCtr.recibosCorporativosList[key];
                        }
                    });
                }

                $scope.consultarHistorialTransaccionesCtr.obtenerLineas();
            } else {
                var mensajeAuditoria = operacionObtenerRecibo + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'RECIBO');
                $location.path("/errorWiew");
            }
        }, function(error) {

        });
    };

    this.obtenerLineas = function() {
        var idCuenta = this.cuenta.idCuenta;
        var idRecibo = this.recibo.idRecibo;

        var requestObtenerServicios = {
            categoria: WPSCategoria.movil,
            tipoLinea: WPSTipoLinea.todos,
            tipoCliente: WPSTipoCliente.corporativo,
            idProductoServicio: null,
            tipoPermiso: WPSTipoPermiso.administrador,
            idCuenta: idCuenta,
            idRecibo: idRecibo,
            idDireccion: null,
            nombreProducto: null,
            pagina: 0,
            cantResultadosPagina: 0,
            productoPrincipalXidRecibo: "false",
            titularidadServicio: WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado
        };
        var dataObtenerServicios = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerServicios) });

        consultarHistorialTransaccionesService.getObtenerServicios(dataObtenerServicios).then(function(response) {
            var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;

            if (rpta == 0) {
                var dataLineaList = response.data.obtenerServiciosResponse.listadoProductosServicios;
                $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList = [];
                if (angular.isArray(dataLineaList)) {
                    $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList = dataLineaList;
                } else {
                    $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList.push(dataLineaList);
                }

                $scope.consultarHistorialTransaccionesCtr.linea = $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList[0];

                if ($scope.consultarHistorialTransaccionesCtr.idProductoPrincial != null) {
                    angular.forEach($scope.consultarHistorialTransaccionesCtr.lineasCorporativoList, function(val, key) {
                        if (val.ProductoServicioResponse.idProductoServicio === $scope.consultarHistorialTransaccionesCtr.idProductoPrincial) {
                            $scope.consultarHistorialTransaccionesCtr.linea = $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList[key];
                        }
                    });
                }

                servicioParam = $scope.consultarHistorialTransaccionesCtr.linea.ProductoServicioResponse.nombre;
                tipoLineaAudi = $scope.consultarHistorialTransaccionesCtr.linea.ProductoServicioResponse.tipoLinea;
                tipoPermisoAudi = $scope.consultarHistorialTransaccionesCtr.linea.ProductoServicioResponse.tipoPermiso;

                $scope.consultarHistorialTransaccionesCtr.obtenerPeriodosFacturacion();
                actualizarProductoPrincipal($scope.consultarHistorialTransaccionesCtr.linea);
            } else {
                var mensajeAuditoria = operacionObtenerServicio + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'LINEA');
                $location.path("/errorWiew");
            }

        }, function(error) {
            $location.path("/errorWiew");

        });
    };


    this.obtenerPeriodosFacturacion = function() {
        var requestPeriodoFacturacion = {
            "cantMeses": "15",
            "mesMaximo": "0"
        };
        data = $httpParamSerializer({ requestJson: angular.toJson(requestPeriodoFacturacion) });

        consultarHistorialTransaccionesService.obtenerPeriodos(data).then(function(response) {
            $scope.mostrarCombos = true;
            var dataPeriodosList = response.data.comunResponseType.elemento;
            if (angular.isArray(dataPeriodosList)) {
                $scope.consultarHistorialTransaccionesCtr.periodosFacturacionList = dataPeriodosList;
            } else {
                $scope.consultarHistorialTransaccionesCtr.periodosFacturacionList.push(dataPeriodosList);
            }

            $scope.consultarHistorialTransaccionesCtr.periodoFacturacion = dataPeriodosList[0];
            if ($scope.consultarHistorialTransaccionesCtr.linea.ProductoServicioResponse.tipoLinea == WPSTipoLinea.prepago) {
                $scope.consultarHistorialTransaccionesCtr.obtenerComprasRecargasPeriodo(indiLoad);
            } else {
                $scope.consultarHistorialTransaccionesCtr.obtenerSolicitudes(indiLoad);
            }

        }, function(error) {

        });
    };

    this.obtenerComprasRecargasPeriodo = function(indicador) {

        if (indicador == 1) {
            $scope.consultarHistorialTransaccionesCtr.comprasRecargasList = [];
            paginaVarComprasRecargas = 1;
            $scope.mostrarComprasyRecargas = false;
            contadorVerMasComprasRecargas = 1;
        }

        var listaTemp = $scope.consultarHistorialTransaccionesCtr.comprasRecargasList;

        $scope.mostrarContenidoLineas = true;
        $scope.errorComprasyRecargas = false;
		$scope.mostrarMensajeCompras = false;
		$scope.mostrarComprasyRecargas = false;
        $scope.contBotonVerMasComprasRecargasMsg = false;
        
        this.tab = 1;
        var requestObtenerComprasRecargasPeriodo = {
            idProductoServicio: this.linea.ProductoServicioResponse.idProductoServicio,
            idPeriodo: this.periodoFacturacion.codigo,
            idCuenta: null,
            idRecibo: null,
            idDireccion: null,
            pagina: paginaVarComprasRecargas,
            categoria: WPSCategoria.movil,
            cantResultadosPagina: WPSpaginacion.cantResultadosPagina
        };
        $('#compras-recargas-movil').fadeIn(350).siblings().hide();
        var data = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerComprasRecargasPeriodo) });

        consultarHistorialTransaccionesService.obtenerComprasRecargasPeriodo(data).then(function(response) {
            var rpta = parseInt(response.data.obtenerComprasRecargasPeriodoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerComprasRecargasPeriodoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerComprasRecargasPeriodoResponse.defaultServiceResponse.mensaje;

            if (rpta == 0) {
                var dataComprasRecargasList = response.data.obtenerComprasRecargasPeriodoResponse.listado;
                $scope.totalPaginas= response.data.obtenerComprasRecargasPeriodoResponse.totalPaginas;
                $scope.verTamanioRecargas = response.data.obtenerComprasRecargasPeriodoResponse.listado;
                if (dataComprasRecargasList != undefined && dataComprasRecargasList != '') {
                    if (angular.isArray(dataComprasRecargasList)) {
                        if (paginaVarComprasRecargas > 1 && paginaVarComprasRecargas < 4) {
                            $scope.consultarHistorialTransaccionesCtr.comprasRecargasList = concatenarLista(listaTemp, dataComprasRecargasList);
                        } else {
                            $scope.consultarHistorialTransaccionesCtr.comprasRecargasList = dataComprasRecargasList;
                        }    
                    } else {
                        $scope.consultarHistorialTransaccionesCtr.comprasRecargasList.push(dataComprasRecargasList);
                    }

                    if ($scope.consultarHistorialTransaccionesCtr.comprasRecargasList.length < 1) {
                        $scope.mostrarMensajeCompras = true;
                    } else {
                        $scope.mostrarComprasyRecargas = true;
                    }
                    registrarAuditoriaExito(rpta, idTransaccion, 'COMPRAS');
                } else {
					$scope.mostrarMensajeCompras = true;
                    registrarAuditoriaExito(rpta, idTransaccion, 'COMPRAS');
                }
            } else {
                $scope.errorComprasyRecargas = true;
                var mensajeAuditoria = operacionObtenerComprasRecargas + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'COMPRAS');
            }
        }, function(error) {

        });
    };

    this.obtenerSolicitudes = function(indicador) {
        this.tab = 2;

        if (indicador == 1) {
            $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList = [];
            $scope.mostrarSolicitudesPeriodo = false;
            paginaVarSolicitudes = 1;
        }
        var listaTemp = $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList;

        $scope.mostrarContenidoLineas = true;
        $scope.errorSolicitudesPeriodo = false;
        $scope.mostrarMensajeSolicitud = false;
		$scope.mostrarSolicitudesPeriodo = false;
        var requestObtenerSolicitudesPeriodo = {
            categoria: WPSCategoria.movil,
            idProductoServicio: this.linea.ProductoServicioResponse.idProductoServicio,
            idPeriodo: this.periodoFacturacion.codigo,
            idCuenta: null,
            idRecibo: null,
            idDireccion: null,
            idLinea: this.linea.ProductoServicioResponse.idLinea,
            pagina: paginaVarSolicitudes,
            cantResultadosPagina: WPSpaginacion.cantResultadosPagina
        };
        $('#solicitudes-movil').fadeIn(350).siblings().hide();

        var data = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerSolicitudesPeriodo) });

        consultarHistorialTransaccionesService.obtenerSolicitudesPeriodo(data).then(function(response) {
            var rpta = parseInt(response.data.obtenerSolicitudesPeriodoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerSolicitudesPeriodoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerSolicitudesPeriodoResponse.defaultServiceResponse.mensaje;

            if (rpta == 0) {
                var dataSolicitudesPeriodoList = response.data.obtenerSolicitudesPeriodoResponse.listado;
                $scope.verTamanioSolicitudes = response.data.obtenerSolicitudesPeriodoResponse.listado;
                if (dataSolicitudesPeriodoList != undefined && dataSolicitudesPeriodoList != '') {
                    if (angular.isArray(dataSolicitudesPeriodoList)) {
                        $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList = dataSolicitudesPeriodoList;
                    } else {
                        $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList.push(dataSolicitudesPeriodoList);
                    }

                    if ($scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList.length < 1) {
                        $scope.mostrarMensajeSolicitud = true;
                    } else {
                        $scope.mostrarSolicitudesPeriodo = true;
                    }
                    registrarAuditoriaExito(rpta, idTransaccion, "SOLICITUD");
                } else { 
					  $scope.mostrarMensajeSolicitud = true;
                    registrarAuditoriaExito(rpta, idTransaccion, "SOLICITUD");
                }
            } else {
                var mensajeAuditoria = operacionObtenerSolicitudes + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'SOLICITUD');
                $scope.errorSolicitudesPeriodo = true;
            }
        }, function(error) {

        });
    };

    this.obtenerContratosServicios = function(indicador) {

        if (indicador == 1) {
            $scope.consultarHistorialTransaccionesCtr.contratosServiciosList = [];
            $scope.mostrarContratosServiciosPeriodo = false;
            paginaVarContratosServicios = 1;

        }

        var listaTemp = $scope.consultarHistorialTransaccionesCtr.contratosServiciosList;

        this.tab = 3;
        $scope.errorContratosServiciosPeriodo = false;
        $scope.mostrarMensajeContratos = false;
		 $scope.mostrarContratosServiciosPeriodo = false;
        var requestObtenerContratosServicios = {
            idProductoServicio: this.linea.ProductoServicioResponse.idProductoServicio,
            idPeriodo: this.periodoFacturacion.codigo,
            idCuenta: null,
            idRecibo: null,
            idDireccion: null,
            idLinea: this.linea.ProductoServicioResponse.idLinea,
            categoria: WPSCategoria.movil,
            pagina: paginaVarContratosServicios,
            cantResultadosPagina: WPSpaginacion.cantResultadosPagina
        };
        $('#contratos-servicios-movil').fadeIn(350).siblings().hide();
        var data = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerContratosServicios) });

        consultarHistorialTransaccionesService.obtenerContratosServiciosPeriodo(data).then(function(response) {
            var rpta = parseInt(response.data.obtenerContratosServiciosPeriodoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerContratosServiciosPeriodoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerContratosServiciosPeriodoResponse.defaultServiceResponse.mensaje;

            if (rpta == 0) {
                var dataContratosServicioList = response.data.obtenerContratosServiciosPeriodoResponse.listado;
                $scope.verTamanioContratos = response.data.obtenerContratosServiciosPeriodoResponse.listado;
                if (dataContratosServicioList != undefined && dataContratosServicioList != '') {
                    if (angular.isArray(dataContratosServicioList)) {
                        $scope.consultarHistorialTransaccionesCtr.contratosServiciosList = dataContratosServicioList;
                    } else {
                        $scope.consultarHistorialTransaccionesCtr.contratosServiciosList.push(dataContratosServicioList);
                    }
                    if ($scope.consultarHistorialTransaccionesCtr.contratosServiciosList.length < 1) {
                        $scope.mostrarMensajeContratos = true;
                    } else {
                        $scope.mostrarContratosServiciosPeriodo = true;
                    }
                    registrarAuditoriaExito(rpta, idTransaccion, "CONTRATOS");
                } else {
					  $scope.mostrarMensajeContratos = true;
                    registrarAuditoriaExito(rpta, idTransaccion, "CONTRATOS");
                }
            } else {
                $scope.errorContratosServiciosPeriodo = true;
                var mensajeAuditoria = operacionContratosPeriodo + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'CONTRATOS');
            }
        }, function(error) {

        });
    };

    this.descargarArchivoContratosServicios = function(idContratoArchivoDescarga) {
        var requestObtenerArchivoContratosServicios = {
            idProductoServicio: this.linea.ProductoServicioResponse.idProductoServicio,
            idPeriodo: this.periodoFacturacion.codigo,
            idCuenta: null,
            idRecibo: null,
            idDireccion: null,
            idLinea: this.linea.ProductoServicioResponse.idLinea,
            categoria: WPSCategoria.movil,
            idContratoArchivoDescarga: idContratoArchivoDescarga
        };

        var data = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerArchivoContratosServicios) });

        consultarHistorialTransaccionesService.obtenerArchivoContratoServiciosPeriodo(data).then(function(response) {
            var rpta = parseInt(response.data.obtenerArchivoContratoServiciosPeriodoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerArchivoContratoServiciosPeriodoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerArchivoContratoServiciosPeriodoResponse.defaultServiceResponse.mensaje;

            if (rpta == 0) {
                var archivoBase64 = response.data.obtenerArchivoContratoServiciosPeriodoResponse.archivo;

                var nombreArchivoWS = response.data.obtenerArchivoContratoServiciosPeriodoResponse.nombreArchivo;
                var arregloSplit = [];
                arregloSplit = nombreArchivoWS.split(".");
                var extencionArchivo = '';
                extencionArchivo = arregloSplit[1];
                var reporteBlob = b64toBlob(archivoBase64, 'application/' + extencionArchivo);
                FileSaver.saveAs(reporteBlob, nombreArchivoWS);

                registrarAuditoriaExito(rpta, idTransaccion, "DESCARGARCON");
            } else {
                var mensajeAuditoria = operacionArchivoServicioPeriodo + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'DESCARGARCON');
            }
        }, function(error) {

        });
    };

    this.descargaArchivoSolicitudPeriodo = function(idSolicitudArchivoDescarga) {
        var requestObtenerArchivoSolicitudPeriodo = {
            idProductoServicio: this.linea.ProductoServicioResponse.idProductoServicio,
            idPeriodo: this.periodoFacturacion.codigo,
            idCuenta: null,
            idRecibo: null,
            idDireccion: null,
            categoria: WPSCategoria.movil,
            idSolicitudArchivoDescarga: idSolicitudArchivoDescarga
        };

        var data = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerArchivoSolicitudPeriodo) });

        consultarHistorialTransaccionesService.obtenerArchivoSolicitudPeriodo(data).then(function(response) {
            var rpta = parseInt(response.data.obtenerArchivoContratoServiciosPeriodoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerArchivoContratoServiciosPeriodoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerArchivoContratoServiciosPeriodoResponse.defaultServiceResponse.mensaje;

            if (rpta == 0) {
                var archivoBase64 = response.data.obtenerArchivoSolicitudPeriodoResponse.archivo;

                var nombreArchivoWS = response.data.obtenerArchivoContratoServiciosPeriodoResponse.nombreArchivo;
                var arregloSplit = [];
                arregloSplit = nombreArchivoWS.split(".");
                var extencionArchivo = '';
                extencionArchivo = arregloSplit[1];
                var reporteBlob = b64toBlob(archivoBase64, 'application/' + extencionArchivo);
                FileSaver.saveAs(reporteBlob, nombreArchivoWS);
                
                registrarAuditoriaExito(rpta, idTransaccion, "DESCARGARSOL");
            } else {
                var mensajeAuditoria = operacionArchivoSolicitudPeriodo + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'DESCARGARSOL');
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
    };

    $scope.buscarHistorialTransacciones = function(indicador) {
        $scope.mostrarContenidoLineas = false;
        if (indicador == 1) {
            $scope.consultarHistorialTransaccionesCtr.obtenerRecibos();
        } else if (indicador == 2) {
            $scope.consultarHistorialTransaccionesCtr.obtenerLineas();
        } else if (indicador == 3) {
            $scope.consultarHistorialTransaccionesCtr.obtenerPeriodosFacturacion();
        } else {
            if ($scope.consultarHistorialTransaccionesCtr.linea.ProductoServicioResponse.tipoLinea == WPSTipoLinea.prepago) {
                $scope.consultarHistorialTransaccionesCtr.obtenerComprasRecargasPeriodo(indiLoad);
            } else {
                $scope.consultarHistorialTransaccionesCtr.obtenerSolicitudes(indiLoad);
            }
        }

        actualizarProductoPrincipal($scope.consultarHistorialTransaccionesCtr.linea);
    };


    function registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, operacion) {
        var codTipoOperacion = '';
        if (operacion == 'COMPRAS') {
            codTipoOperacion = codComprasyRecargas;
        } else if (operacion == 'SOLICITUD') {
            codTipoOperacion = codConsultaSolicitud;
        } else if (operacion == 'CONTRATOS') {
            codTipoOperacion = codConsultaContratos;
        } else if (operacion == 'DESCARGARCON') {
            codTipoOperacion = codDescargarContrato;
        } else if (operacion == 'DESCARGARSOL') {
            codTipoOperacion = codDescargarSolicitud;
        } else {
            codTipoOperacion = '-';
        }

        guardarAuditoria(idTransaccion, estadoError, codTipoOperacion, mensajeAuditoria);
    };

    function registrarAuditoriaExito(rpta, idTransaccion, operacion) {
        var codTipoOperacion = '';
        if (operacion == 'COMPRAS' || operacion == 'FLAG') {
            codTipoOperacion = codComprasyRecargas;
        } else if (operacion == 'SOLICITUD') {
            codTipoOperacion = codConsultaSolicitud;
        } else if (operacion == 'CONTRATOS') {
            codTipoOperacion = codConsultaContratos;
        } else if (operacion == 'DESCARGARCON') {
            codTipoOperacion = codDescargarContrato;
        } else if (operacion == 'DESCARGARSOL') {
            codTipoOperacion = codDescargarSolicitud;
        }
        guardarAuditoria(idTransaccion, estadoExito, codTipoOperacion, "-");
    };

    function guardarAuditoria(idTransaccion, estadoAuditoria, codOperacion, mensajeAuditoria) {

        var requestAuditoria = {
            operationCode: codOperacion,
            pagina: pagIdHistorialTransaccionesMovil,
            transactionId: idTransaccion,
            estado: estadoAuditoria,
            servicio: servicioParam,
            tipoProducto: tipoProductoAuditoria,
            tipoLinea: tipoLineaAudi,
            tipoUsuario: $scope.consultarHistorialTransaccionesCtr.tipoClienteSession,
            perfil: tipoPermisoAudi,
            monto: '',
            descripcionoperacion: mensajeAuditoria,
            responseType: '-'
        };

        var dataAuditoria = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });

        consultarHistorialTransaccionesService.enviarAuditoria(dataAuditoria).then(function(response) {}, function() {});
    };

    function actualizarProductoPrincipal(objetoActualizarFijo) {
        var actualizar = enviarDataActualizar(objetoActualizarFijo);
        consultarHistorialTransaccionesService.actualizarProductoPrincipal(actualizar).then(function(response) {}, function(error) {});
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
        requestActualizar.tipoClienteProductoPrincipal = WPSTipoCliente.corporativo;

        dataActualizar = $httpParamSerializer({ requestJson: angular.toJson(requestActualizar) });
        return dataActualizar;
    };

});

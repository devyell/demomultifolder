app.controller("ConsultarHistorialTransaccionesController", function($scope, $timeout, $location, $httpParamSerializer, consultarHistorialTransaccionesService, FileSaver, Blob) {

    $(document).ready(function(e) {
        var $input = $("#autocomplete-filtro-fijo");

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

        $("#autocomplete-filtro-fijo").autocomplete({
            lookup: function(query, done) {

                var criterioBusqueda = query;
                var arrayListAuto = [];
                var requestAutocompleteFijo = {
                    "tipoCliente": null,
                    "idDireccion": null,
                    "idProductoServicio": null,
                    "criterioBusqueda": null,
                    "pagina": null,
                    "cantResultadosPagina": null
                }
                requestAutocompleteFijo.tipoCliente = WPSTipoCliente.corporativo;
                requestAutocompleteFijo.criterioBusqueda = criterioBusqueda;
                requestAutocompleteFijo.pagina = WPSpaginacion.pagina;
                requestAutocompleteFijo.cantResultadosPagina = WPSpaginacion.cantResultadosPagina;

                var dataAutocompleteFijo = $httpParamSerializer({ requestJson: angular.toJson(requestAutocompleteFijo) });

                consultarHistorialTransaccionesService.obtenerListadoLineasFijas(dataAutocompleteFijo).then(function(response) {
                    var idRptaAutocomplete = response.data.obtenerListadoLineasFijasResponse.defaultServiceResponse.idRespuesta;
                    if (idRptaAutocomplete == 0) {
                        var dataArrayAutoComplete = response.data.obtenerListadoLineasFijasResponse.listadoProductosServicios;
                        $scope.consultarHistorialTransaccionesCtr.listLineasAutocompleted = [];
                        if (angular.isArray(dataArrayAutoComplete)) {
                            $scope.consultarHistorialTransaccionesCtr.listLineasAutocompleted = dataArrayAutoComplete;
                        } else {
                            $scope.consultarHistorialTransaccionesCtr.listLineasAutocompleted.push(dataArrayAutoComplete);
                        }
                        angular.forEach($scope.consultarHistorialTransaccionesCtr.listLineasAutocompleted, function(val, key) {
                            var objectAutoComplete = { value: val.nombreAlias, data: val.idDireccion + "|" + val.idProductoServicio + "|" + val.idLinea }
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
    var contadorVerMasSolicitudes = 0;
    var contadorVerMasContratosServicios = 0;

    this.contBotonVerMasComprasRecargas = true;
    this.contBotonVerMasSolicitudes = true;
    this.contBotonVerMasContratosServicios = true;

    this.barraCorporativo = false;

    this.idDireccionPrincipal = null;
    this.idProductoPrincial = null;

    this.flagMostrarSwitch = false;

    $scope.errorSolicitudesPeriodo = false;
    $scope.mostrarSolicitudesPeriodo = false;
    $scope.errorContratosServiciosPeriodo = false;
    $scope.mostrarContratosServiciosPeriodo = false;
    $scope.mostrarMensajeSolicitud = false;
    $scope.mostrarMensajeContratos = false;
    $scope.mostrarContenidoLineas = false;
    $scope.mostrarCombos = false;
    $scope.mostrarComprasyRecargas = false;
    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;
    $scope.ups_sin_documento = WPSConsultarHistorialTransaccionesConsumerB2E.FLUJOALTERNO10;

    $scope.mensaje_upps_documento = WPSConsultarHistorialTransaccionesConsumerB2E.FLUJOALTERNO10_1;
    $scope.mensaje_upps_fecha = WPSConsultarHistorialTransaccionesConsumerB2E.FLUJOALTERNO10_2;

    var pagIdHistorialTransaccionesFijo = WPSPageID.miclaro_corporativo_consultas_historialtransacciones_fijo;
    var codConsultaSolicitud = WPSTablaOperaciones.consultaHistorialTransaccionesSolicitudes;
    var codDescargarSolicitud = WPSTablaOperaciones.descargaHistorialTransaccionesSolicitudes;
    var codConsultaContratos = WPSTablaOperaciones.consultaHistorialTransaccionesContratos;
    var codDescargarContrato = WPSTablaOperaciones.descargaHistorialTransaccionesContratos;
    var operacionObtenerServicio = 'getObtenerServicios';
    var operacionArchivoSolicitudPeriodo = 'obtenerArchivoSolicitudPeriodo';
    var operacionContratosPeriodo = 'obtenerContratosServiciosPeriodo';
    var operacionArchivoServicioPeriodo = 'obtenerArchivoContratoServiciosPeriodo';
    var operacionObtenerSolicitudes = 'obtenerSolicitudesPeriodo';
    var operacionObtenerDireccion = 'obtenerListadoFijoDireccion';
    var operacionObtenerLineaFija = 'obtenerLineasFijas';
    var tipoProductoAuditoria = 'FIJO';
    var estadoExito = 'SUCCESS';
    var estadoError = 'ERROR';
    var servicioParam = '-';
    var tipoLineaAudi = '-';
    var tipoPermisoAudi = '-';
    var indiLoad = 1;

    function manejadorSeleccionAutocomplete(input) {

        var idDireccion = input.data.split("|")[0];
        var idProductoServicio = input.data.split("|")[1];
        var idLinea = input.data.split("|")[2];

        var listaDireccionesFijas = $scope.consultarHistorialTransaccionesCtr.direccionesFijasList;

        for (i = 0; i < listaDireccionesFijas.length; i++) {
            var direccionFija = listaDireccionesFijas[i];

            if (direccionFija.idDireccion === idDireccion) {
                $scope.consultarHistorialTransaccionesCtr.direccion = direccionFija;
                break;
            }
        }

        $scope.consultarHistorialTransaccionesCtr.obtenerLineas();

        var listaLineas = $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList;

        for (x = 0; x < listaLineas.length; x++) {
            var linea = listaLineas[x];

            if (linea.ProductoServicioResponse.idProductoServicio === idProductoServicio) {
                $scope.consultarHistorialTransaccionesCtr.linea = linea;
                break;
            }
        }

        $scope.consultarHistorialTransaccionesCtr.obtenerLinesFijas();
    }

    this.getBarraCorporativo = function() {
        return this.barraCorporativo;
    };

    this.setBarraCorporativo = function() {
        this.barraCorporativo = !this.barraCorporativo;
    };

    $scope.switchChange = function() {
        switchChangeEvent();
    };

    function switchChangeEvent() {
        window.location.href = "/wps/myportal/miclaro/consumer/consultas/historialtransacciones/fijo";
    };


    this.obtenerDatosUsuarioSesion = function() {
        consultarHistorialTransaccionesService.obtenerDatosUsuarioSesion().then(function(response) {
            var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            if (rpta == 0) {
                $scope.consultarHistorialTransaccionesCtr.tipoClienteSession = response.data.comunResponseType.tipoCliente;
                var flagProductoFijoSesion = response.data.comunResponseType.flagProductoFijoSesion;

                if ($scope.consultarHistorialTransaccionesCtr.tipoClienteSession == WPSTipoCliente.mixto) {
                    $scope.consultarHistorialTransaccionesCtr.flagMostrarSwitch = true;
                }

                if (flagProductoFijoSesion == "2" || flagProductoFijoSesion == "3") {
                    $scope.consultarHistorialTransaccionesCtr.obtenerServicioPrincipal();
                } else if (flagProductoFijoSesion == "0" || flagProductoFijoSesion == "1") {
                    registrarAuditoriaExito(rpta, idTransaccion, "FLAG");
                    $location.path("/nuevoServicioView");
                } else if (flagProductoFijoSesion == "-1") {
                    $location.path("/errorWiew");
                    var mensajeAuditoria = operacionObtenerServicio + "- flagFijo";
                    registrarAuditoriaError(flagProductoFijoSesion, idTransaccion, mensajeAuditoria, null);
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

                if (categoriaPrincipal == "2" && tipoClientePrincipal == "2") {
                    $scope.lineaPrincipal = response.data.comunResponseType.nombreProductoPrincipal;
                    $scope.consultarHistorialTransaccionesCtr.idDireccionPrincipal = response.data.comunResponseType.idDireccion;
                    $scope.consultarHistorialTransaccionesCtr.idProductoPrincial = response.data.comunResponseType.productoPrincipal;

                    $scope.consultarHistorialTransaccionesCtr.obtenerDireccionesFijos();
                } else {
                    $scope.consultarHistorialTransaccionesCtr.idDireccionPrincipal = null;
                    $scope.consultarHistorialTransaccionesCtr.idProductoPrincial = null;

                    $scope.consultarHistorialTransaccionesCtr.obtenerDireccionesFijos();
                }

            } else {
                $location.path("/errorWiew");
            }
        }, function(error) {});
    };

    this.inicializar = function() {
        this.obtenerDatosUsuarioSesion();
    };

    this.inicializar();

    this.verMasSolicitudes = function(indicador) {
        paginaVarSolicitudes++;

        this.obtenerSolicitudes(indicador);

    };

    this.verMasContratos = function(indicador) {
        paginaVarContratosServicios++;

        this.obtenerContratosServicios(indicador);

    };

    this.obtenerDireccionesFijos = function() {
        var requestDireccion = {
            "tipoCliente": null
        };
        requestDireccion.tipoCliente = WPSTipoClienteDir.corporativoFijo;
        var dataDireccion = $httpParamSerializer({ requestJson: angular.toJson(requestDireccion) });

        consultarHistorialTransaccionesService.obtenerListadoFijoDireccion(dataDireccion).then(function(response) {
            var rpta = parseInt(response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                var dataDireccionesList = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;
                $scope.consultarHistorialTransaccionesCtr.direccionesFijasList = [];
                if (angular.isArray(dataDireccionesList)) {
                    $scope.consultarHistorialTransaccionesCtr.direccionesFijasList = dataDireccionesList;
                } else {
                    $scope.consultarHistorialTransaccionesCtr.direccionesFijasList.push(dataDireccionesList);
                }

                if ($scope.consultarHistorialTransaccionesCtr.idDireccionPrincipal != null) {
                    angular.forEach($scope.consultarHistorialTransaccionesCtr.direccionesFijasList, function(val, key) {
                        if (val.idDireccion === $scope.consultarHistorialTransaccionesCtr.idDireccionPrincipal) {
                            $scope.consultarHistorialTransaccionesCtr.direccion = $scope.consultarHistorialTransaccionesCtr.direccionesFijasList[key];
                        }
                    });
                } else {
                    $scope.consultarHistorialTransaccionesCtr.direccion = $scope.consultarHistorialTransaccionesCtr.direccionesFijasList[0];
                }


                $scope.consultarHistorialTransaccionesCtr.obtenerLineas();

            } else {
                var mensajeAuditoria = operacionObtenerDireccion + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'DIRECCION');
                $location.path("/errorWiew");
            }
        }, function(error) {
            $location.path("/errorWiew");
        });
    };

    this.obtenerLineas = function() {
        var requestObtenerServicios = {
            categoria: WPSCategoria.fijo,
            tipoLinea: WPSTipoLinea.todos,
            tipoCliente: WPSTipoCliente.corporativo,
            idProductoServicio: null,
            tipoPermiso: WPSTipoPermiso.administrador,
            idCuenta: null,
            idRecibo: null,
            idDireccion: $scope.consultarHistorialTransaccionesCtr.direccion.idDireccion,
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
                if (dataLineaList != undefined && dataLineaList != '') {
                    if (angular.isArray(dataLineaList)) {
                        $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList = dataLineaList;
                    } else {
                        $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList.push(dataLineaList);
                    }

                    if ($scope.consultarHistorialTransaccionesCtr.idProductoPrincial != null) {
                        angular.forEach($scope.consultarHistorialTransaccionesCtr.lineasCorporativoList, function(val, key) {
                            if (val.ProductoServicioResponse.idProductoServicio === $scope.consultarHistorialTransaccionesCtr.idProductoPrincial) {
                                $scope.consultarHistorialTransaccionesCtr.linea = $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList[key];
                            }
                        });
                    } else {
                        $scope.consultarHistorialTransaccionesCtr.linea = $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList[0];
                    }

                    servicioParam = $scope.consultarHistorialTransaccionesCtr.linea.ProductoServicioResponse.nombreAlias;
                    tipoLineaAudi = $scope.consultarHistorialTransaccionesCtr.linea.ProductoServicioResponse.tipoLinea;
                    tipoPermisoAudi = $scope.consultarHistorialTransaccionesCtr.linea.ProductoServicioResponse.tipoPermiso;

                    $scope.consultarHistorialTransaccionesCtr.obtenerLinesFijas();
                    actualizarProductoPrincipal($scope.consultarHistorialTransaccionesCtr.linea);
                }
            } else {
                var mensajeAuditoria = operacionObtenerServicio + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'SERVICIO');
                $location.path("/errorWiew");
            }
        }, function(error) {
            $location.path("/errorWiew");
        });
    };

    this.obtenerLinesFijas = function() {
        var requestLineasFijas = {
            "tipoCliente": null,
            "idDireccion": null,
            "idProductoServicio": null,
            "nombreProducto": null,
            "pagina": null,
            "cantResultadosPagina": null
        };

        requestLineasFijas.tipoCliente = WPSTipoCliente.corporativo;
        requestLineasFijas.idProductoServicio = $scope.consultarHistorialTransaccionesCtr.linea.ProductoServicioResponse.idProductoServicio;
        requestLineasFijas.idDireccion = $scope.consultarHistorialTransaccionesCtr.direccion.idDireccion;
        requestLineasFijas.pagina = 0;
        requestLineasFijas.cantResultadosPagina = 0;

        var responseLineasFijas = $httpParamSerializer({ requestJson: angular.toJson(requestLineasFijas) });

        consultarHistorialTransaccionesService.obtenerLinesFijas(responseLineasFijas).then(function(response) {
            var rpta = parseInt(response.data.obtenerLineasFijasResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerLineasFijasResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerLineasFijasResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                var dataLineasFijasList = response.data.obtenerLineasFijasResponse.listadoProductosServicios;
                $scope.consultarHistorialTransaccionesCtr.lineasFijasList = [];

                if (angular.isArray(dataLineasFijasList)) {
                    $scope.consultarHistorialTransaccionesCtr.lineasFijasList = dataLineasFijasList;

                } else {
                    $scope.consultarHistorialTransaccionesCtr.lineasFijasList.push(dataLineasFijasList);
                }

                $scope.consultarHistorialTransaccionesCtr.lineaFija = $scope.consultarHistorialTransaccionesCtr.lineasFijasList[0];

                $scope.consultarHistorialTransaccionesCtr.obtenerPeriodosFacturacion();

            } else {
                var mensajeAuditoria = operacionObtenerLineaFija + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'SERVICIO');
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
            $scope.consultarHistorialTransaccionesCtr.periodosFacturacionList = [];
            if (angular.isArray(dataPeriodosList)) {
                $scope.consultarHistorialTransaccionesCtr.periodosFacturacionList = dataPeriodosList;
            } else {
                $scope.consultarHistorialTransaccionesCtr.periodosFacturacionList.push(dataPeriodosList);
            }

            $scope.consultarHistorialTransaccionesCtr.periodoFacturacion = dataPeriodosList[0];

            $scope.consultarHistorialTransaccionesCtr.obtenerSolicitudes(indiLoad);

        }, function(error) {

        });
    };

    this.obtenerComprasRecargasPeriodo = function() {
        $scope.mostrarContenidoLineas = true;
        this.tab = 1;
        $scope.mostrarComprasyRecargas = true;
    };


    this.obtenerSolicitudes = function(indicador) {

        if (indicador == 1) {
            $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList = [];
            $scope.mostrarSolicitudesPeriodo = false;
            paginaVarSolicitudes = 1;
        }
        var listaTemp = $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList;

        this.tab = 2;
        $scope.mostrarContenidoLineas = true;
        $scope.errorSolicitudesPeriodo = false;
        $scope.mostrarMensajeSolicitud = false;
		 $scope.mostrarSolicitudesPeriodo = false;
        var requestObtenerSolicitudesPeriodo = {
            categoria: WPSCategoria.fijo,
            idProductoServicio: this.linea.ProductoServicioResponse.idProductoServicio,
            idPeriodo: this.periodoFacturacion.codigo,
            idCuenta: null,
            idRecibo: null,
            idDireccion: this.direccion.idDireccion,
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
                        if (indicador == 2) {
                            $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList = concatenarLista(listaTemp, dataSolicitudesPeriodoList);
                        } else {
                            $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList = dataSolicitudesPeriodoList;
                        }    
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
            $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList = [];
            $scope.mostrarSolicitudesPeriodo = false;
            paginaVarSolicitudes = 1;
        }
        var listaTemp = $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList;

        this.tab = 3;
		$scope.mostrarContenidoLineas = true;
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
            categoria: WPSCategoria.fijo,
            pagina: paginaVarSolicitudes,
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
                $scope.verTamanioSolicitudes = response.data.obtenerSolicitudesPeriodoResponse.listado;
                if (dataContratosServicioList != undefined && dataContratosServicioList != '') {
                    if (angular.isArray(dataContratosServicioList)) {
                        if (indicador == 2) {
                            $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList = concatenarLista(listaTemp, dataSolicitudesPeriodoList);
                        } else {
                            $scope.consultarHistorialTransaccionesCtr.contratosServiciosList = dataContratosServicioList;
                        }    
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
                var mensajeAuditoria = operacionContratosPeriodo + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'CONTRATOS');
                $scope.errorContratosServiciosPeriodo = true;
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
            categoria: WPSCategoria.fijo,
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
            categoria: WPSCategoria.fijo,
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

    function registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, operacion) {
        var codTipoOperacion = '';
        if (operacion == 'SOLICITUD') {
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
        if (operacion == 'SOLICITUD' || operacion == 'FLAG') {
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
            pagina: pagIdHistorialTransaccionesFijo,
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

        consultarHistorialTransaccionesService.enviarAuditoria(dataAuditoria).then(function(response) {

        }, function() {});
    };

    $scope.buscarHistorialTransacciones = function(indicador) {
        $scope.mostrarContenidoLineas = false;
        if (indicador == 1) {
            $scope.consultarHistorialTransaccionesCtr.obtenerLineas();
        } else if (indicador == 2) {
            $scope.consultarHistorialTransaccionesCtr.obtenerLinesFijas();
        } else if (indicador == 3) {
            $scope.consultarHistorialTransaccionesCtr.obtenerPeriodosFacturacion();
        } else {
            $scope.consultarHistorialTransaccionesCtr.obtenerSolicitudes(indiLoad);
        }
        actualizarProductoPrincipal($scope.consultarHistorialTransaccionesCtr.linea);
    };

    function actualizarProductoPrincipal(objetoActualizarFijo) {
        var actualizar = enviarDataActualizar(objetoActualizarFijo);
        consultarHistorialTransaccionesService.actualizarProductoPrincipal(actualizar).then(function(response) {

        }, function(error) {});
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
        };

        requestActualizar.productoPrincipal = objetoActualizarFijo.ProductoServicioResponse.idProductoServicio;
        requestActualizar.nombreProductoPrincipal = objetoActualizarFijo.ProductoServicioResponse.nombre;
        requestActualizar.idDireccion = objetoActualizarFijo.ProductoServicioResponse.idDireccion;
        requestActualizar.idLinea = objetoActualizarFijo.ProductoServicioResponse.idLinea;
        requestActualizar.tipoLinea = objetoActualizarFijo.ProductoServicioResponse.tipoLinea;
        requestActualizar.categoria = objetoActualizarFijo.ProductoServicioResponse.categoria;
        requestActualizar.tipoClienteProductoPrincipal = WPSTipoCliente.corporativo;

        var dataActualizar = $httpParamSerializer({ requestJson: angular.toJson(requestActualizar) });
        return dataActualizar;
    };

});

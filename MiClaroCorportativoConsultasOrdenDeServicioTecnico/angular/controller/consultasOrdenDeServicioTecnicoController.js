app.controller("ConsultasOrdenDeServicioTecnicoController", function($scope, $timeout, $http, $location, $httpParamSerializer, $sessionStorage, consultasOrdenDeServicioTecnicoService) {

    $(document).ready(function(e) {
        var $input = $("#autocomplete-filtro");

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

        $("#autocomplete-filtro").autocomplete({
            lookup: function(query, done) {

                var criterioBusqueda = query;
                var arrayListAuto = [];
                var requestAutocompletar = {
                    "tipoLinea": 5,
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
                requestAutocompletar.tipoCliente = WPSTipoCliente.corporativo;;
                requestAutocompletar.criterioBusqueda = criterioBusqueda;
                requestAutocompletar.pagina = WPSpaginacion.pagina;
                requestAutocompletar.cantResultadosPagina = WPSpaginacion.cantResultadosPagina;

                var dataLineaAutoRequest = $httpParamSerializer({ requestJson: angular.toJson(requestAutocompletar) });

                consultasOrdenDeServicioTecnicoService.getObtenerListadoMovilCorporativoReciboAutoCompletar(dataLineaAutoRequest).then(function(response) {
                    var idRptaAutocomplete = response.data.obtenerListadoMovilesResponse.defaultServiceResponse.idRespuesta;
                    if (idRptaAutocomplete == 0) {
                        var dataArrayAutoComplete = response.data.obtenerListadoMovilesResponse.listadoProductosServicios;
                        $scope.consultasOrdenDeServicioTecnicoCtr.listLineasAutocompleted = [];

                        if (angular.isArray(dataArrayAutoComplete)) {
                            $scope.consultasOrdenDeServicioTecnicoCtr.listLineasAutocompleted = dataArrayAutoComplete;
                        } else {
                            $scope.consultasOrdenDeServicioTecnicoCtr.listLineasAutocompleted.push(dataArrayAutoComplete);
                        }
                        angular.forEach($scope.consultasOrdenDeServicioTecnicoCtr.listLineasAutocompleted, function(val, key) {
                            var objectAutoComplete = { value: val.nombreAlias, data: val.idCuenta + "|" + val.idRecibo + "|" + val.idProductoServicio }
                            arrayListAuto.push(objectAutoComplete);
                        });

                        var result = { suggestions: arrayListAuto };
                        done(result);
                    }
                }, function(error) {});
            },
            minChars: 4,
            onSelect: function(suggestion) {
                manejadorSeleccionAutocomplete(suggestion);
            }
        });

    });

    var cantidadResultadosServicioTecnico = 5;

    var aumentoResultados = 5;

    var paginaVar = 1;

    var contadorVerMas = 0;

    this.contBotonVerMas = true;
    this.barraCorporativo = false;
    this.lineaSeleccionada;
    this.idCuenta;
    this.idRecibo;
    this.idProductoServicio;
    this.cuenta;
    this.recibo;
    this.linea;
    this.flagErrorVerReporteDetalle = false;
    this.cuentasCorporativasList = [];
    this.recibosCorporativosList = [];
    $scope.mostrarTotalPagina = false;
    $scope.switchSelect = true;
    $scope.mostrarBoxSinOrdenServicioTecnico = false;

    $scope.switchChange = function() {
        switchChangeEvent();
    };

    function switchChangeEvent() {
        window.location.href = "/wps/myportal/miclaro/consumer/consultas/ordendeserviciotecnico/";
    }

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion03 = WPSMensajeError.upps_descripcion03;

    this.getBarraCorporativo = function() {
        return this.barraCorporativo;
    };

    this.setBarraCorporativo = function() {
        this.lineaAutocomplete = null;
        this.barraCorporativo = !this.barraCorporativo;
    }

    var estadosOrdenServicioTecnicoImg = {
        aprobadoReparacion: "icon-stat-reparacion.png",
        rechazado: "icon-stat-rechazado.png",
        esperando: "icon-stat-esperando.png",
        recoger: "icon-stat-recoger.png"
    };

    var estadoOrdenServicioTecnicoDescripcion = {
        aprobadoReparacion: "Aprobada",
        rechazado: "Rechazada",
        esperando: "En espera de aprobación",
        recoger: "Recoger Equipo"
    };

    var servicioParam = '';
    var estadoExito = 'SUCCESS';
    var estadoError = 'ERROR';
    var tipoProductoMovil = 'MOVIL';
    var pagIdOrdenServicioTecnicoCorporativo = WPSPageID.miclaro_corporativo_ordenserviciotecnico;
    var codOperacionConsulta = WPSTablaOperaciones.consultaOrdenServicioTecnico;
    var codOperacionConsultaDetalle = WPSTablaOperaciones.consultaDetalleOrdenServicioTecnico;
    var operacionOrdenServicioTecnico = 'obtenerOrdenesServicioTecnico';
    var operacionDetalleServicioTecnico = 'obtenerDetalleOrdenServicioTecnico';
    var operacionObtenerCuenta = 'obtenerListadoMovilCorporativoCuenta';
    var operacionObtenerRecibo = 'obtenerListadoMovilCorporativoRecibo';
    var operacionObtenerServicio = 'obtenerServicios';
    var permisoAuditoria = '-';
    $scope.switchSelect = true;

    this.inicializar = function() {
        this.obtenerDatosUsuarioSesion();
    };

    this.obtenerDatosUsuarioSesion = function() {

        consultasOrdenDeServicioTecnicoService.obtenerDatosUsuarioSesion().then(function(response) {
            var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            if (rpta == 0) {

                $scope.tipoClienteUsuario = response.data.comunResponseType.tipoCliente;
                if ($scope.tipoClienteUsuario == 4) {
                    $scope.showSwitch = true;
                }

                $scope.mostrarTotalPagina = true;
                $scope.consultasOrdenDeServicioTecnicoCtr.tipoClienteSession = response.data.comunResponseType.tipoCliente;
                $sessionStorage.usuarioSessionDetalle = $scope.consultasOrdenDeServicioTecnicoCtr.tipoClienteSession;
                $scope.consultasOrdenDeServicioTecnicoCtr.emailUsuarioEnProceso = response.data.comunResponseType.userId;
                $sessionStorage.razonSocialExcel = response.data.comunResponseType.razonSocial; 
                var flagProductoMovilSesion = response.data.comunResponseType.flagProductoMovilSesion;

                if (flagProductoMovilSesion == "2" || flagProductoMovilSesion == "3") {
                    $scope.consultasOrdenDeServicioTecnicoCtr.obtenerServicioPrincipal();
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

    this.obtenerServicioPrincipal = function() {

        consultasOrdenDeServicioTecnicoService.obtenerServicioPrincipal().then(function(response) {
            var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            if (rpta == 0) {
                var categoriaPrincipal = response.data.comunResponseType.categoria;
                var tipoClientePrincipal = response.data.comunResponseType.tipoClienteProductoPrincipal;
                servicioParam = response.data.comunResponseType.nombreProductoPrincipal;

                if (tipoClientePrincipal == WPSTipoCliente.corporativo && categoriaPrincipal == '1') {
                    $scope.lineaPrincipal = response.data.comunResponseType.nombreProductoPrincipal;
                    $scope.consultasOrdenDeServicioTecnicoCtr.idCuentaPrincipal = response.data.comunResponseType.idCuenta;
                    $scope.consultasOrdenDeServicioTecnicoCtr.idReciboPrincipal = response.data.comunResponseType.idRecibo;
                    $scope.consultasOrdenDeServicioTecnicoCtr.idProductoPrincipal = response.data.comunResponseType.productoPrincipal;
                } else {
                    $scope.consultasOrdenDeServicioTecnicoCtr.idCuentaPrincipal = null;
                    $scope.consultasOrdenDeServicioTecnicoCtr.idReciboPrincipal = null;
                }
                getCuentasCoorporativosFn();
            } else {
                $location.path("/errorWiew");
            }
        }, function(error) {});
    };

    this.actualizarProductoPrincipal = function() {
        var requestActualizarProductoPrincipal = {
            productoPrincipal: $scope.consultasOrdenDeServicioTecnicoCtr.linea.ProductoServicioResponse.idProductoServicio,
            nombreProductoPrincipal: $scope.consultasOrdenDeServicioTecnicoCtr.linea.ProductoServicioResponse.nombreAlias,
            idCuenta: $scope.consultasOrdenDeServicioTecnicoCtr.linea.ProductoServicioResponse.idCuenta,
            idRecibo: $scope.consultasOrdenDeServicioTecnicoCtr.linea.ProductoServicioResponse.idRecibo,
            idDireccion: null,
            idLinea: null,
            tipoLinea: $scope.consultasOrdenDeServicioTecnicoCtr.linea.ProductoServicioResponse.tipoLinea,
            numeroTelFijo: null,
            categoria: $scope.consultasOrdenDeServicioTecnicoCtr.linea.ProductoServicioResponse.categoria,
            tipoClienteProductoPrincipal: $scope.consultasOrdenDeServicioTecnicoCtr.linea.ProductoServicioResponse.tipoCliente
        };

        var dataActualizarProductoPrincipal = $httpParamSerializer({ requestJson: angular.toJson(requestActualizarProductoPrincipal) });
        consultasOrdenDeServicioTecnicoService.actualizarProductoPrincipal(dataActualizarProductoPrincipal).then(function(response) {
            
        }, function(error) {

        });
    };

    this.verMas = function() {
        paginaVar++;
        contadorVerMas++;
        if (contadorVerMas < 5) {
            this.getOrdenesServicioTecnicoList();
        } else {
            this.contBotonVerMas = false;
        }
    };

    $scope.mostrarIconosServicioTecnico = false;
    $scope.errorListaServicioTecnico = false;
    $scope.mostrarListaServicioTecnico = false;

    this.getOrdenesServicioTecnicoList = function() {
        $scope.mostrarListaServicioTecnico = false;
        var dataEstadoServicioTecnicoListFinal = [];
        this.estadoServicioTecnicoList = [];
        var requestOrdenesServicioTecnico = {
            idCuenta: $scope.consultasOrdenDeServicioTecnicoCtr.cuenta.idCuenta,
            idRecibo: $scope.consultasOrdenDeServicioTecnicoCtr.recibo.idRecibo,
            idProductoServicio: $scope.consultasOrdenDeServicioTecnicoCtr.linea.ProductoServicioResponse.idProductoServicio,
            pagina: paginaVar,
            cantResultadosPagina: cantidadResultadosServicioTecnico
        };
        dataOrdenesServicioTecnico = $httpParamSerializer({ requestJson: angular.toJson(requestOrdenesServicioTecnico) });

        consultasOrdenDeServicioTecnicoService.getOrdenesServicioTecnico(dataOrdenesServicioTecnico).then(function(response) {
            var rpta = parseInt(response.data.obtenerOrdenesServicioTecnicoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerOrdenesServicioTecnicoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerOrdenesServicioTecnicoResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                var dataEstadoServicioTecnicoList = response.data.obtenerOrdenesServicioTecnicoResponse.listaOrdenes;
                if (dataEstadoServicioTecnicoList != undefined && dataEstadoServicioTecnicoList != null && dataEstadoServicioTecnicoList != "") {
                    if (angular.isArray(dataEstadoServicioTecnicoList)) {
                        dataEstadoServicioTecnicoListFinal = dataEstadoServicioTecnicoList;
                    } else {

                        dataEstadoServicioTecnicoListFinal.push(dataEstadoServicioTecnicoList);
                    }

                    var dataEstadoServicioTecnico = null;
                    for (i = 0; i < dataEstadoServicioTecnicoListFinal.length; i++) {
                        dataEstadoServicioTecnico = dataEstadoServicioTecnicoListFinal[i];

                        if (dataEstadoServicioTecnico.estadoReparacion == "1") {
                            dataEstadoServicioTecnico.estadoReparacionImg = estadosOrdenServicioTecnicoImg.aprobadoReparacion;
                            dataEstadoServicioTecnico.estadoReparacionDescripcion = estadoOrdenServicioTecnicoDescripcion.aprobadoReparacion;
                        }

                        if (dataEstadoServicioTecnico.estadoReparacion == "2") {
                            dataEstadoServicioTecnico.estadoReparacionImg = estadosOrdenServicioTecnicoImg.rechazado;
                            dataEstadoServicioTecnico.estadoReparacionDescripcion = estadoOrdenServicioTecnicoDescripcion.rechazado;
                        }

                        if (dataEstadoServicioTecnico.estadoReparacion == "3") {
                            dataEstadoServicioTecnico.estadoReparacionImg = estadosOrdenServicioTecnicoImg.esperando;
                            dataEstadoServicioTecnico.estadoReparacionDescripcion = estadoOrdenServicioTecnicoDescripcion.esperando;
                        }

                        if (dataEstadoServicioTecnico.estadoReparacion == "4") {
                            dataEstadoServicioTecnico.estadoReparacionImg = estadosOrdenServicioTecnicoImg.recoger;
                            dataEstadoServicioTecnico.estadoReparacionDescripcion = estadoOrdenServicioTecnicoDescripcion.recoger;
                        }
                    }

                    $scope.consultasOrdenDeServicioTecnicoCtr.estadoServicioTecnicoList = $scope.consultasOrdenDeServicioTecnicoCtr.estadoServicioTecnicoList.concat(dataEstadoServicioTecnicoListFinal);

                    if (response.data.obtenerOrdenesServicioTecnicoResponse.pagina == response.data.obtenerOrdenesServicioTecnicoResponse.totalPaginas) {
                        $scope.consultasOrdenDeServicioTecnicoCtr.contBotonVerMas = false;
                    } else {
                        $scope.consultasOrdenDeServicioTecnicoCtr.contBotonVerMas = true;
                    }
                    $scope.mostrarListaServicioTecnico = true;
                } else {
                    $scope.mostrarBoxSinOrdenServicioTecnico = true;
                }

                $scope.consultasOrdenDeServicioTecnicoCtr.barraCorporativo = false;
                registrarAuditoriaExito(rpta, idTransaccion, "ORDEN");
            } else {
                var mensajeAuditoria = operacionOrdenServicioTecnico + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "ORDEN");
                $scope.errorListaServicioTecnico = true;
            }
        }, function(error) {});
    };

    this.verReporte = function(idOrdenParm) {

        var requestDetalleOrdenesServicioTecnico = {
            idCuenta: $scope.consultasOrdenDeServicioTecnicoCtr.cuenta.idCuenta,
            idRecibo: $scope.consultasOrdenDeServicioTecnicoCtr.recibo.idRecibo,
            idProductoServicio: $scope.consultasOrdenDeServicioTecnicoCtr.linea.ProductoServicioResponse.idProductoServicio,
            idOrden: idOrdenParm
        };
        var dataDetalleOrdenesServicioTecnico = $httpParamSerializer({ requestJson: angular.toJson(requestDetalleOrdenesServicioTecnico) });

        consultasOrdenDeServicioTecnicoService.getDetalleOrdenServicioTecnico(dataDetalleOrdenesServicioTecnico).then(function(response) {
            var rpta = parseInt(response.data.obtenerDetalleOrdenServicioTecnicoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerDetalleOrdenServicioTecnicoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerDetalleOrdenServicioTecnicoResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                var detalleEstadoServicioTecnicoObj = response.data.obtenerDetalleOrdenServicioTecnicoResponse;

                detalleEstadoServicioTecnicoObj.idOrden = idOrdenParm;
                detalleEstadoServicioTecnicoObj.cuentaNombreAlias = $scope.consultasOrdenDeServicioTecnicoCtr.cuenta.nombreAlias;

                if (!angular.isArray(detalleEstadoServicioTecnicoObj.listadoProblemas)) {
                    var listadoProblemas = [];
                    listadoProblemas.push(detalleEstadoServicioTecnicoObj.listadoProblemas);
                    detalleEstadoServicioTecnicoObj.listadoProblemas = listadoProblemas;
                }

                if (!angular.isArray(detalleEstadoServicioTecnicoObj.listadoRepuestos)) {
                    var listadoRepuestos = [];
                    listadoRepuestos.push(detalleEstadoServicioTecnicoObj.listadoRepuestos);
                    detalleEstadoServicioTecnicoObj.listadoRepuestos = listadoRepuestos;
                }

                if (detalleEstadoServicioTecnicoObj.estadoReparacion == "1") {
                    detalleEstadoServicioTecnicoObj.estadoReparacionDescripcion = estadoOrdenServicioTecnicoDescripcion.aprobadoReparacion;
                    $scope.consultasOrdenDeServicioTecnicoCtr.flagErrorVerReporteDetalle = false;
                    $location.path("/orderServicioTecnicoAprobadoWiew");
                } else if (detalleEstadoServicioTecnicoObj.estadoReparacion == "2") {
                    detalleEstadoServicioTecnicoObj.estadoReparacionDescripcion = estadoOrdenServicioTecnicoDescripcion.rechazado;
                    $scope.consultasOrdenDeServicioTecnicoCtr.flagErrorVerReporteDetalle = false;
                    $location.path("/orderServicioTecnicoRechazadoWiew");
                } else if (detalleEstadoServicioTecnicoObj.estadoReparacion == "3") {
                    detalleEstadoServicioTecnicoObj.estadoReparacionDescripcion = estadoOrdenServicioTecnicoDescripcion.esperando;
                    $scope.consultasOrdenDeServicioTecnicoCtr.flagErrorVerReporteDetalle = false;
                    $location.path("/orderServicioTecnicoEsperandoWiew");
                } else if (detalleEstadoServicioTecnicoObj.estadoReparacion == "4") {
                    detalleEstadoServicioTecnicoObj.estadoReparacionDescripcion = estadoOrdenServicioTecnicoDescripcion.recoger;
                    $scope.consultasOrdenDeServicioTecnicoCtr.flagErrorVerReporteDetalle = false;
                    $location.path("/orderServicioTecnicoRecogerWiew");
                } else {
                    $scope.consultasOrdenDeServicioTecnicoCtr.flagErrorVerReporteDetalle = true;
                }

                detalleEstadoServicioTecnicoObj.nombreAlias = $scope.consultasOrdenDeServicioTecnicoCtr.linea.ProductoServicioResponse.nombreAlias;
                detalleEstadoServicioTecnicoObj.idProductoServicio = $scope.consultasOrdenDeServicioTecnicoCtr.linea.ProductoServicioResponse.idProductoServicio;

                $sessionStorage.detalleEstadoServicioTecnicoSesion = detalleEstadoServicioTecnicoObj;
            } else {
                $scope.consultasOrdenDeServicioTecnicoCtr.flagErrorVerReporteDetalle = true;
                var mensajeAuditoria = operacionDetalleServicioTecnico + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "DETALLE");
            }
        }, function(error) {});
    };

    this.openPagina = function() {
        window.open(WPSPORTAL_UBICANOS_CLARO);
    };
    $scope.mostrarFormularioCombos = false;

    function getCuentasCoorporativosFn() {
        consultasOrdenDeServicioTecnicoService.getCuentasCoorporativos().then(function(response) {
            var rpta = parseInt(response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                var dataCuentas = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta;

                $scope.consultasOrdenDeServicioTecnicoCtr.cuentasCorporativasList = [];

                if (angular.isArray(dataCuentas)) {
                    $scope.consultasOrdenDeServicioTecnicoCtr.cuentasCorporativasList = dataCuentas;
                } else {
                    $scope.consultasOrdenDeServicioTecnicoCtr.cuentasCorporativasList.push(dataCuentas);
                }

                if ($scope.consultasOrdenDeServicioTecnicoCtr.idCuentaPrincipal != null) {
                    angular.forEach($scope.consultasOrdenDeServicioTecnicoCtr.cuentasCorporativasList, function(val, key) {
                        if (val.idCuenta === $scope.consultasOrdenDeServicioTecnicoCtr.idCuentaPrincipal) {
                            $scope.consultasOrdenDeServicioTecnicoCtr.cuenta = $scope.consultasOrdenDeServicioTecnicoCtr.cuentasCorporativasList[key];
                        }
                    });
                } else {
                    $scope.consultasOrdenDeServicioTecnicoCtr.cuenta = $scope.consultasOrdenDeServicioTecnicoCtr.cuentasCorporativasList[0];
                }

                $scope.consultasOrdenDeServicioTecnicoCtr.obtenerRecibos();
                registrarAuditoriaExito(rpta, idTransaccion, "CUENTA");
            } else {
                var mensajeAuditoria = operacionObtenerCuenta + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "CUENTA");
                $location.path("/errorWiew");
            }
        }, function(error) {});
    };

    this.obtenerRecibos = function() {

        var idCuenta = this.cuenta.idCuenta;

        var requestReciboCoor = {
            "idCuenta": idCuenta
        };
        dataReciboCoor = $httpParamSerializer({ requestJson: angular.toJson(requestReciboCoor) });

        consultasOrdenDeServicioTecnicoService.getReciboCoorporativos(dataReciboCoor).then(function(response) {
            var rpta = parseInt(response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                var dataRecibosList = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo;
                $scope.consultasOrdenDeServicioTecnicoCtr.recibosCorporativosList = [];
                if (angular.isArray(dataRecibosList)) {
                    $scope.consultasOrdenDeServicioTecnicoCtr.recibosCorporativosList = dataRecibosList;
                } else {
                    $scope.consultasOrdenDeServicioTecnicoCtr.recibosCorporativosList.push(dataRecibosList);
                }

                if ($scope.consultasOrdenDeServicioTecnicoCtr.idReciboPrincipal != null) {
                    angular.forEach($scope.consultasOrdenDeServicioTecnicoCtr.recibosCorporativosList, function(val, key) {
                        if (val.idRecibo === $scope.consultasOrdenDeServicioTecnicoCtr.idReciboPrincipal) {
                            $scope.consultasOrdenDeServicioTecnicoCtr.recibo = $scope.consultasOrdenDeServicioTecnicoCtr.recibosCorporativosList[key];
                        }
                    });
                } else {
                    $scope.consultasOrdenDeServicioTecnicoCtr.recibo = $scope.consultasOrdenDeServicioTecnicoCtr.recibosCorporativosList[0];
                }

                $scope.consultasOrdenDeServicioTecnicoCtr.obtenerLineas();
                registrarAuditoriaExito(rpta, idTransaccion, "RECIBO");
            } else {
                var mensajeAuditoria = operacionObtenerRecibo + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "RECIBO");
                $location.path("/errorWiew");
            }
        }, function(error) {});
    };

    this.obtenerLineas = function() {
        var idCuenta = this.cuenta.idCuenta;
        var idRecibo = this.recibo.idRecibo;

        var requestObtenerServicios = {
            categoria: WPSCategoria.movil,
            tipoLinea: WPSTipoLinea.todos,
            tipoCliente: WPSTipoCliente.corporativo,
            idProductoServicio: null,
            tipoPermiso: WPSTipoPermiso.todos,
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

        consultasOrdenDeServicioTecnicoService.getObtenerServicios(dataObtenerServicios).then(function(response) {
            var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                $scope.mostrarFormularioCombos = true;
                $scope.mostrarIconosServicioTecnico = true;
                var dataLineaList = response.data.obtenerServiciosResponse.listadoProductosServicios;
                $scope.consultasOrdenDeServicioTecnicoCtr.lineasCorporativoList = [];

                if (angular.isArray(dataLineaList)) {
                    $scope.consultasOrdenDeServicioTecnicoCtr.lineasCorporativoList = dataLineaList;
                } else {
                    $scope.consultasOrdenDeServicioTecnicoCtr.lineasCorporativoList.push(dataLineaList);
                }

                $scope.consultasOrdenDeServicioTecnicoCtr.linea = $scope.consultasOrdenDeServicioTecnicoCtr.lineasCorporativoList[0];


                if ($scope.consultasOrdenDeServicioTecnicoCtr.idProductoPrincipal != null) {

                    angular.forEach($scope.consultasOrdenDeServicioTecnicoCtr.lineasCorporativoList, function(val, key) {
                        if (val.ProductoServicioResponse.idProductoServicio === $scope.consultasOrdenDeServicioTecnicoCtr.idProductoPrincipal) {

                            $scope.consultasOrdenDeServicioTecnicoCtr.linea = $scope.consultasOrdenDeServicioTecnicoCtr.lineasCorporativoList[key];
                        }
                    });
                }

                permisoAuditoria = $scope.consultasOrdenDeServicioTecnicoCtr.linea.ProductoServicioResponse.tipoPermiso;
                servicioParam = $scope.consultasOrdenDeServicioTecnicoCtr.linea.ProductoServicioResponse.nombre;
     
                $scope.consultasOrdenDeServicioTecnicoCtr.actualizarProductoPrincipal();
                $scope.consultasOrdenDeServicioTecnicoCtr.getOrdenesServicioTecnicoList();
                registrarAuditoriaExito(rpta, idTransaccion, "LINEA");
            } else {
                var mensajeAuditoria = operacionObtenerRecibo + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "LINEA");
                $location.path("/errorWiew");
            }
        }, function(error) {});
    };

    $scope.obtenerServiciosxClick = function(indicador) {
    
        $scope.mostrarIconosServicioTecnico = false;
        $scope.mostrarListaServicioTecnico = false;
        $scope.errorListaServicioTecnico = false;
        $scope.mostrarBoxSinOrdenServicioTecnico = false;
        if (indicador == '1') {
            objExitoAuditoria.recibo = null;
            objExitoAuditoria.linea = null;
            objExitoAuditoria.orden = null;
            $scope.consultasOrdenDeServicioTecnicoCtr.obtenerRecibos();
        } else if (indicador == '2') {
            objExitoAuditoria.orden = null;
            objExitoAuditoria.linea = null;
            $scope.consultasOrdenDeServicioTecnicoCtr.obtenerLineas();
        } else {
            objExitoAuditoria.orden = null;
            $scope.mostrarIconosServicioTecnico = true;
            $scope.consultasOrdenDeServicioTecnicoCtr.actualizarProductoPrincipal();
            $scope.consultasOrdenDeServicioTecnicoCtr.getOrdenesServicioTecnicoList();
        }
    };

    this.lineaAutocomplete;
    this.listLineasAutocompleted;

    function manejadorSeleccionAutocomplete(input) {

        $scope.mostrarIconosServicioTecnico = false;
        $scope.mostrarListaServicioTecnico = false;
        $scope.errorListaServicioTecnico = false;
        $scope.mostrarBoxSinOrdenServicioTecnico = false;
        var idCuenta = input.data.split("|")[0];
        var idRecibo = input.data.split("|")[1];
        var idProductoServicio = input.data.split("|")[2];

        $scope.consultasOrdenDeServicioTecnicoCtr.idCuentaPrincipal = idCuenta;
        $scope.consultasOrdenDeServicioTecnicoCtr.idReciboPrincipal = idRecibo;
        $scope.consultasOrdenDeServicioTecnicoCtr.idProductoPrincipal = idProductoServicio;

        getCuentasCoorporativosFn();
    }

    function registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, operacion) {
        if (operacion == 'DETALLE') {
            guardarAuditoria(idTransaccion, estadoError, codOperacionConsultaDetalle, mensajeAuditoria);
        } else {
            guardarAuditoria(idTransaccion, estadoError, codOperacionConsulta, mensajeAuditoria);
        }
    };
    var objExitoAuditoria = {};

    function registrarAuditoriaExito(rpta, idTransaccion, operacion) {
        if (rpta == 0 && operacion == 'CUENTA') {
            objExitoAuditoria.cuenta = rpta;
        } else if (rpta == 0 && operacion == 'RECIBO') {
            objExitoAuditoria.recibo = rpta;
        } else if (rpta == 0 && operacion == 'LINEA') {
            objExitoAuditoria.linea = rpta;
        } else if (rpta == 0 && operacion == 'ORDEN') {
            objExitoAuditoria.orden = rpta;
        }

        if (objExitoAuditoria.cuenta == 0 && objExitoAuditoria.recibo == 0 && objExitoAuditoria.linea == 0 && objExitoAuditoria.orden == 0) {
            guardarAuditoria(idTransaccion, estadoExito, codOperacionConsulta, "-");
        } else if (operacion == 'FLAG') {
            guardarAuditoria(idTransaccion, estadoExito, codOperacionConsulta, "-");
        }

    };

    function guardarAuditoria(idTransaccion, estadoAuditoria, codOperacion, mensajeAuditoria) {
        var requestAuditoria = {
            operationCode: codOperacion,
            pagina: pagIdOrdenServicioTecnicoCorporativo,
            transactionId: idTransaccion,
            estado: estadoAuditoria,
            servicio: servicioParam,
            tipoProducto: tipoProductoMovil,
            tipoLinea: WPSTipoLinea.postpago,
            tipoUsuario: $scope.consultasOrdenDeServicioTecnicoCtr.tipoClienteSession,
            perfil: permisoAuditoria,
            monto: '',
            descripcionoperacion: mensajeAuditoria,
            responseType: '-'
        };

        var dataAuditoria = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });

        consultasOrdenDeServicioTecnicoService.enviarAuditoria(dataAuditoria).then(function(response) {}, function() {});
    };
});

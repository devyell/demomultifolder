var appController = angular.module('ctrlCambioPlanConsumer', []);

appController.controller('ctrlCambioPlanMovil', ['$scope', '$filter', '$window', '$sce', '$http', '$timeout', 'srvCambioPlanMovil', '$httpParamSerializer',
    function($scope, $filter, $window, $sce, $http, $timeout, srvCambioPlanMovil, $httpParamSerializer) {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        $scope.$sce = $sce;

        var categoriaMovil = WPSCategoria.movil;
        var titularidadServicioThree = WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado;
        var tipoPermisoCambioPlan = WPSTipoPermiso.administrador;
        var tipoClienteConsumer = WPSTipoCliente.consumer;
        var tipoLineaConsumer = WPSTipoLinea.todos;
        var flagSolicitarPlan = 2;
        var urlCorporativo = '/wps/myportal/miclaro/corporativo/solicitudes/cambiodeplan/movil';
        var codOperacionCambioPlan = WPSTablaOperaciones.solicitarCambioPlan;
        var pageIdeCambioPlan = WPSPageID.miclaro_consumer_solicitudes_cambiodeplan_movil;
        var estadoExito = 'SUCCESS';
        var estadoError = 'ERROR';
        var tipoProductoFijo = 'MOVIL';

        var tipoLineaMovil = '';
        var lineaPostpago = 'Línea Postpago';
        var lineaPrepago = 'Línea Prepago';
        var lineaSeleccionada = '';
        var idTabSeleccionado = '';
        var idTipoPlanSugerido = '';
        var idPlanSugerido = '';
        $scope.mensaje_error_titulo = WPSMensajeError.upps;
        $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
        $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;
        $scope.urlInicio = '/wps/myportal/miclaro/consumer/solicitudes/cambiodeplan/movil';
        $scope.mostrarServicios = false;
        $scope.showSinServicios = false;
        $scope.errorTotalRedirect = false;
        $scope.errorDatosAdicionales = false;
        $scope.mostrarPlanesSugeridos = false;
        $scope.mostrarServiciosConsumer = false;
        $scope.mostrarDatosAdicionales = false;
        $scope.errorPlanesSugeridos = false;
        $scope.desabilitarBoton = false;
        $scope.mostrarSwitchConsumer = false;
        $scope.mostrarTabs = false;
        $scope.ocultarPrepago = true;
        $scope.mostrarDetallePlan = false;
        $scope.planSugest = '';
        var tipoPermisoCambioPlan = WPSTipoPermiso.administrador;

        $scope.currentDate = new Date();

        var operacionDatosAdicionales = 'obtenerDatosAdicionalesServicioMovil';
        var operacionObtenerServicio = 'obtenerServicios';
        var operacionSolicitarPlan = 'solicitarPlan';
        var operacionPlanSugerido = 'obtenerPlanSugerido';
        var permisoAuditoria = '';
        var tipoClienteSession = '';
        $scope.listaServiciosConsumerCopiar = [];
        $scope.listaServiciosConsumer = [];

        angular.element(document).ready(function() {
            init();

        });


        function init() {
            srvCambioPlanMovil.obtenerTipoCliente().then(function(response) {
                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                if (rpta == 0) {
                    $scope.mostrarServicios = true;
                    tipoClienteSession = response.data.comunResponseType.tipoCliente;
                    var flagMovilSesion = parseInt(response.data.comunResponseType.flagProductoMovilSesion);
                    if (flagMovilSesion == 1 || flagMovilSesion == 3) {
                        obtenerServicioPrincipal();
                    } else if (flagMovilSesion == -1) {
                        var mensajeAuditoria = operacionObtenerServicio + "- flagMovil";
                        registrarAuditoria(rpta, idTransaccion, mensajeAuditoria);
                        $scope.errorTotalRedirect = true;
                    } else {
                        $scope.showSinServicios = true;
                        registrarAuditoria(rpta, idTransaccion, "-");
                    }
                    if (tipoClienteSession == 4) {
                        $scope.mostrarSwitchConsumer = true;
                    }
                } else {
                    $scope.errorTotalRedirect = true;
                }

            }, function(error) {});
        };

        $scope.switchChange = function() {
            window.location.href = urlCorporativo;
        };

        var idProductoServicioPrin = '';

        function obtenerServicioPrincipal() {
            srvCambioPlanMovil.obtenerProductoPrincipal().then(function(response) {
                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                if (rpta == 0) {
                    var categoriaPrincipal = parseInt(response.data.comunResponseType.categoria);
                    var tipoClienteConsumerPrin = response.data.comunResponseType.tipoClienteProductoPrincipal;
                    if (categoriaPrincipal == 1 && tipoClienteConsumerPrin == 1) {
                        idProductoServicioPrin = response.data.comunResponseType.productoPrincipal;
                        
                    } else {
                        
                        idProductoServicioPrin = null;
                    }
                    obtenerServiciosConsumer();
                } else {
                    $scope.errorTotalRedirect = true;
                }
            }, function(error) {});
        };

        function obtenerServiciosConsumer() {
            var listaServicios = '';
            var dataServicio = enviarDataServicios();
            srvCambioPlanMovil.obtenerServiciosConsumer(dataServicio).then(function(response) {
                var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;

                if (rpta == 0) {
                    var listaLineasTotal = [];
                    listaServicios = response.data.obtenerServiciosResponse.listadoProductosServicios;
                    if (listaServicios != '' && listaServicios != undefined) {

                        if (angular.isArray(listaServicios)) {
                            listaLineasTotal = listaServicios;
                        } else {
                            listaLineasTotal.push(listaServicios);
                        }


                        $scope.listaServiciosConsumer = [];
                        angular.forEach(listaLineasTotal, function(val, key) {
                            if (val.ProductoServicioResponse.tipoPermiso == tipoPermisoCambioPlan) {
                                $scope.listaServiciosConsumer.push(listaLineasTotal[key]);
                            }
                        });
                        
                        if ($scope.listaServiciosConsumer.length < 1) {

                            $scope.mostratMensajeSinServicio = true;
                        } else {
                            $scope.mostrarServiciosConsumer = true;


                            $scope.selectServicio = $scope.listaServiciosConsumer[0];

                            if (idProductoServicioPrin != null) {
                                angular.forEach($scope.listaServiciosConsumer, function(val, key) {
                                    if (val.ProductoServicioResponse.idProductoServicio === idProductoServicioPrin) {
                                        $scope.selectServicio = $scope.listaServiciosConsumer[key];
                                    }
                                });
                            }

                            var cantidadLineas = $scope.listaServiciosConsumer.length;
                            if (cantidadLineas < 2) {
                                $(".pullservicio").addClass("disabled");
                            }
                            tipoLineaMovil = $scope.selectServicio.ProductoServicioResponse.tipoLinea;
                            if (tipoLineaMovil == 1) {
                                $scope.lineaMovil = lineaPrepago;
                            } else if (tipoLineaMovil == 2) {
                                $scope.lineaMovil = lineaPostpago;
                            }

                            obtenerDatosAdicionalesServicioMovil();
                            actualizarProductoPrincipal($scope.selectServicio);
                        }

                    } else {
                        $scope.errorTotalRedirect = true;
                    }
                } else {
                    $scope.errorTotalRedirect = true;
                    var mensajeAuditoria = operacionObtenerServicio + "-" + mensajeServicio;
                    registrarAuditoria(rpta, idTransaccion, mensajeAuditoria);
                }
            }, function(error) {

            });
        };


        var planActualMovil = '';
        var cargoFijoMovil = '';
        var cargoFijoPrepago = 0;

        function obtenerDatosAdicionalesServicioMovil() {

            var dataAdicional = enviarDataAdicional();
            srvCambioPlanMovil.obtenerDatosAdicionalesServicioMovil(dataAdicional).then(function(response) {
                var rpta = parseInt(response.data.obtenerDatosAdicionalesServicioMovilResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerDatosAdicionalesServicioMovilResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.obtenerDatosAdicionalesServicioMovilResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    $scope.mostrarDatosAdicionales = true;
                    $scope.planActual = response.data.obtenerDatosAdicionalesServicioMovilResponse.planActual;
                    cargoFijoMovil = response.data.obtenerDatosAdicionalesServicioMovilResponse.cargoFijo;
                    planActualMovil = response.data.obtenerDatosAdicionalesServicioMovilResponse.planActual;

                    if (tipoLineaMovil == 1) {
                        $scope.ocultarPrepago = false;
                        obtenerPlanSugerido(cargoFijoPrepago, planActualMovil);
                    } else {
                        $scope.fechaRenovacion = response.data.obtenerDatosAdicionalesServicioMovilResponse.fechaRenovacionPlan;
                        obtenerPlanSugerido(cargoFijoMovil, planActualMovil);
                    }
                } else {
                    var mensajeAuditoria = operacionDatosAdicionales + "-" + mensajeServicio;
                    registrarAuditoria(rpta, idTransaccion, mensajeAuditoria);
                    $scope.errorDatosAdicionales = true;
                }
            }, function(error) {

            });
        };


        function obtenerPlanSugerido(cargoFijoMovil, planActualMovil) {
            var dataPlanSugerido = enviarDataPlanSugerido(cargoFijoMovil, planActualMovil);
            srvCambioPlanMovil.obtenerPlanSugerido(dataPlanSugerido).then(function(response) {
                var rpta = parseInt(response.data.obtenerPlanSugeridoResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerPlanSugeridoResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.obtenerPlanSugeridoResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    $scope.mostrarPlanesSugeridos = true;
                    var categoriaPlanSugerido = response.data.obtenerPlanSugeridoResponse.idCategoria;
                    idTipoPlanSugerido = response.data.obtenerPlanSugeridoResponse.tipoPlan;
                    idPlanSugerido = response.data.obtenerPlanSugeridoResponse.idPlan;
                    var listaPlanesWebcontent = planesWCM;
                    var arrayTabs = [];
                    var flagMostrar = '';
                    $scope.planesxTab = [];
                    var arraryPlanesPreliminar = [];

                    angular.forEach(listaPlanesWebcontent, function(val, key) {
                        if (val.categoria == categoriaPlanSugerido) {
                            arrayTabs = val.tabs;
                            flagMostrar = val.mostrarTabs;
                        }
                    });
                    if (flagMostrar == true) {
                        $scope.mostrarTabs = true;
                        $scope.arrayTabsMovil = arrayTabs;
                        var lengthArrayMovil = parseInt($scope.arrayTabsMovil.length);
                        var porcentajetab = 100 / lengthArrayMovil;
                        $scope.stiloRedimension = {
                            "width": porcentajetab + "%"
                        }
                        angular.forEach($scope.arrayTabsMovil, function(valor, llave) {
                            if (valor.idTab == idTipoPlanSugerido) {
                                idTabSeleccionado = idTipoPlanSugerido;
                                arraryPlanesPreliminar = valor.planesTab;
                                $scope.indice = [llave];
                                $scope.selectTab = $scope.arrayTabsMovil[llave];
                            }
                        });
                        arraryPlanesPreliminar = $filter('orderBy')(arraryPlanesPreliminar, '-idPlan');
                        $scope.planesxTab = arraryPlanesPreliminar;
                        var lengthPlanes = $scope.planesxTab.length;
                        renderSlidePlan(lengthPlanes);
                        clickxPlan($scope.planesxTab, idPlanSugerido);
                        $scope.planSugest = idPlanSugerido;
                    } else {
                        $scope.mostrarTabs = false;
                        var objArrayMovil = {};
                        angular.forEach(arrayTabs, function(val, key) {
                            var idTipoTab = arrayTabs[key].idTab;
                            angular.forEach(val.planesTab, function(v, k) {
                                objArrayMovil = {
                                    "idPlan": v.idPlan,
                                    "tipo": v.tipo,
                                    "nombre": v.nombre,
                                    "moneda": v.moneda,
                                    "precio": v.precio,
                                    "texto1": v.texto1,
                                    "texto2": v.texto2,
                                    "texto3": v.texto3,
                                    "texto4": v.texto4,
                                    "texto5": v.texto5,
                                    "texto6": v.texto6,
                                    "texto7": v.texto7,
                                    "texto8": v.texto8,
                                    "icono1": v.icono1,
                                    "icono2": v.icono2,
                                    "icono3": v.icono3,
                                    "icono4": v.icono4,
                                    "icono5": v.icono5,
                                    "icono6": v.icono6,
                                    "icono7": v.icono7,
                                    "icono8": v.icono8,
                                    "tipoTab": idTipoTab
                                };
                                $scope.planesxTab.push(objArrayMovil);
                            });
                        });
                        var lengthPlanes = $scope.planesxTab.length;
                        renderSlidePlan(lengthPlanes);
                    }

                } else {
                    $scope.errorPlanesSugeridos = true;
                    var mensajeAuditoria = operacionPlanSugerido + "-" + mensajeServicio;
                    registrarAuditoria(rpta, idTransaccion, mensajeAuditoria);
                }
            }, function(error) {});
        };

        $scope.agregarCss = function() {
            var totalsize = $margin + 10;
            return {
                "margin": '0px ' + totalsize + 'px 20px'
            }
        }

        $scope.refreshPortlet = function(valorInput) {

            if (valorInput == "1") {
                $scope.errorDatosAdicionales = false;
                obtenerDatosAdicionalesServicioMovil();
            } else if (valorInput == "2") {
                $scope.errorPlanesSugeridos = false;
                if (tipoLineaMovil == 1) {
                    obtenerPlanSugerido(cargoFijoPrepago, planActualMovil);
                } else {
                    obtenerPlanSugerido(cargoFijoMovil, planActualMovil);
                }
            }
        };

        $scope.obtenerPlanesxServicio = function() {
            $scope.errorDatosAdicionales = false;
            $scope.errorPlanesSugeridos = false;
            $scope.mostrarDatosAdicionales = false;
            $scope.mostrarPlanesSugeridos = false;
            $scope.direccionCompleta = null;
            $scope.ocultarPrepago = true;
            $scope.fechaRenovacion = '';
            
            tipoLineaMovil = $scope.selectServicio.ProductoServicioResponse.tipoLinea;
            
            
            var nombreProducto = $scope.selectServicio.ProductoServicioResponse.nombreAlias;
            if (tipoLineaMovil == 1) {
                $scope.lineaMovil = lineaPrepago;
            } else if (tipoLineaMovil == 2) {
                $scope.lineaMovil = lineaPostpago;
            }
            obtenerDatosAdicionalesServicioMovil();
            actualizarProductoPrincipal($scope.selectServicio);
        };

        $scope.buscarPlanes = function(idTabSelect, cate, index) {
            idTabSeleccionado = idTabSelect;
            $scope.indice = index;
            $scope.planesxTab = [];
            var listaPlanesWebcontent = planesWCM;
            var arrayTabsSelect = [];
            var arrayPlanesPreliminarClick = [];
            angular.forEach(listaPlanesWebcontent, function(val, key) {
                if (val.categoria == cate) {
                    arrayTabsSelect = val.tabs;
                }
            });

            angular.forEach(arrayTabsSelect, function(valor, llave) {
                if (valor.idTab == idTabSelect) {
                    arrayPlanesPreliminarClick = valor.planesTab;
                }
            });
            arrayPlanesPreliminarClick = $filter('orderBy')(arrayPlanesPreliminarClick, '-idPlan');
            $scope.planesxTab = arrayPlanesPreliminarClick;

            var lengthPlanes = $scope.planesxTab.length;
            renderSlidePlan(lengthPlanes);
            if (idTipoPlanSugerido == idTabSelect) {
                clickxPlan($scope.planesxTab, idPlanSugerido);
            }
        };

        $scope.buscarPlanesMobile = function() {

            var idtab = $scope.selectTab.idTab;
            var cateSelect = $scope.selectTab.categoria;
            $scope.buscarPlanes(idtab, cateSelect, null);
        };

        function actualizarProductoPrincipal(objetoActualizar) {
            var actualizar = enviarDataActualizar(objetoActualizar);
            srvCambioPlanMovil.actualizarProductoPrincipal(actualizar).then(function(response) {}, function(error) {});
        };

        $scope.mostrarPlanTerminos = function(objPlan) {

            $scope.planSugest = objPlan.idPlan;

            $scope.mostrarServiciosConsumer = false;
            $scope.mostrarPlanesSugeridos = false;
            $scope.mostrarDetallePlan = true;

            $scope.objPlanConfirmar = objPlan;

            $scope.idPlanSelect = objPlan.idPlan;

            if (typeof objPlan.tipoTab === "undefined") {
                $scope.idTipoCategoria = '';
            } else {
                $scope.idTipoCategoria = objPlan.tipoTab;
            }
            
        };

        var nuevoPlanSugerido = '';
        $scope.solicitarNuevoServicio = function() {
            nuevoPlanSugerido = $scope.idPlanSelect;
            var idCuentaSelect = $scope.selectServicio.ProductoServicioResponse.idCuenta;
            var idReciboSelect = $scope.selectServicio.ProductoServicioResponse.idRecibo;
            var idProductoServicioSelect = $scope.selectServicio.ProductoServicioResponse.idProductoServicio;
            abrirPopUp();
            var dataPlan = dataSolicitarPlan(idCuentaSelect, idReciboSelect, idProductoServicioSelect, $scope.idPlanSelect);
            srvCambioPlanMovil.solicitarNuevoServicio(dataPlan).then(function(response) {
                var rpta = parseInt(response.data.solicitarPlanResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.solicitarPlanResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.solicitarPlanResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    var respuestaPlan = response.data.solicitarPlanResponse.resultado;
                    if (respuestaPlan == "true") {
                        $timeout(function() {
                            mostrarConfirmacion();
                        }, 350);
                        registrarAuditoria(rpta, idTransaccion, "-");
                    } else {
                        $timeout(function() {
                            mostrarError();
                        }, 350);
                    }
                } else {
                    $timeout(function() {
                        mostrarError();
                    }, 350);
                    var mensajeAuditoria = operacionSolicitarPlan + "-" + mensajeServicio;
                    registrarAuditoria(rpta, idTransaccion, mensajeAuditoria);
                }
            }, function(error) {});
        };

        function dataSolicitarPlan(idCuentaSelect, idReciboSelect, idProductoServicioSelect, idPlanSelect) {
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
            requestSolicitarPlan.tipoCliente = tipoClienteConsumer;
            requestSolicitarPlan.categoria = categoriaMovil;
            requestSolicitarPlan.idCuenta = idCuentaSelect;
            requestSolicitarPlan.idRecibo = idReciboSelect;
            requestSolicitarPlan.idProductoServicio = idProductoServicioSelect;
            requestSolicitarPlan.idPlan = idPlanSelect;
            requestSolicitarPlan.tipoPlan = idTabSeleccionado;

            dataListDir = $httpParamSerializer({ requestJson: angular.toJson(requestSolicitarPlan) });
            return dataListDir;
        };


        $scope.cerrarPopup = function() {
            esconderPopUp();
        };

        $scope.cerrarConfirmacion = function() {
            esconderPopUp();
        };

        $scope.regresar = function() {
            $scope.mostrarDetallePlan = false;

            $scope.mostrarServiciosConsumer = true;
            $scope.mostrarPlanesSugeridos = true;

            $scope.modelAceptarTerminos = false;
            $("#checkboxTerminos").removeClass("checked");
            $("#btcontratar").addClass("bt-disabled");
            $("#btcontratar").attr("disabled", "disabled");
        };

        $scope.terminarAccion = function() {
            esconderPopUp();
            $scope.mostrarDetallePlan = false;

            $scope.mostrarServiciosConsumer = true;
            $scope.mostrarPlanesSugeridos = true;

            $scope.modelAceptarTerminos = false;
            $("#checkboxTerminos").removeClass("checked");
            $("#btcontratar").addClass("bt-disabled");
            $("#btcontratar").attr("disabled", "disabled");
        };

        $scope.mostrarPopUpTerminos = function() {

            $("#popupTerminos").fadeIn(350);
        };

        $scope.ocultarPopUpTerminos = function() {
            $('#popupTerminos').fadeOut(250);
        };

        $scope.aceptarTerminosCondiciones = function(modelAceptarTerminos) {
            if (modelAceptarTerminos == true) {
                $("#checkboxTerminos").addClass("checked");
                $("#btcontratar").removeClass("bt-disabled");
                $("#btcontratar").removeAttr("disabled");
            } else {
                $("#checkboxTerminos").removeClass("checked");
                $("#btcontratar").addClass("bt-disabled");
                $("#btcontratar").attr("disabled", "disabled");
            }
        };

        $scope.aceptarTerminos = function() {
            $("#checkboxTerminos").addClass("checked");
            $("#popupTerminos").hide();
            $("#btcontratar").removeClass("bt-disabled");
            $("#btcontratar").removeAttr("disabled");

        };

        function enviarDataActualizar(objetoActualizar) {
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

            requestActualizar.productoPrincipal = objetoActualizar.ProductoServicioResponse.idProductoServicio;
            requestActualizar.nombreProductoPrincipal = objetoActualizar.ProductoServicioResponse.nombre;
            requestActualizar.idCuenta = objetoActualizar.ProductoServicioResponse.idCuenta;
            requestActualizar.idRecibo = objetoActualizar.ProductoServicioResponse.idRecibo;
            requestActualizar.tipoLinea = objetoActualizar.ProductoServicioResponse.tipoLinea;
            requestActualizar.categoria = categoriaMovil;
            requestActualizar.tipoClienteProductoPrincipal = tipoClienteConsumer;

            dataActualizar = $httpParamSerializer({ requestJson: angular.toJson(requestActualizar) });
            return dataActualizar;
        };

        function enviarDataPlanSugerido(cargoFijoMovil, planActualMovil) {
            var requestPlanSugerido = {
                "categoria": null,
                "idCuenta": null,
                "idRecibo": null,
                "idDireccion": null,
                "idProductoServicio": null,
                "planActual": null,
                "cargoFijo": null
            }
            requestPlanSugerido.categoria = categoriaMovil;
            requestPlanSugerido.idProductoServicio = $scope.selectServicio.ProductoServicioResponse.idProductoServicio;
            requestPlanSugerido.idCuenta = $scope.selectServicio.ProductoServicioResponse.idCuenta;
            requestPlanSugerido.idRecibo = $scope.selectServicio.ProductoServicioResponse.idRecibo;
            requestPlanSugerido.planActual = planActualMovil;
            requestPlanSugerido.cargoFijo = cargoFijoMovil;

            dataPlanSugerido = $httpParamSerializer({ requestJson: angular.toJson(requestPlanSugerido) });
            return dataPlanSugerido;
        };


        function enviarDataAdicional() {
            var requestAdicional = {
                "idProductoServicio": null,
                "idCuenta": null,
                "idRecibo": null,
                "tipoCliente": null
            }
            requestAdicional.idProductoServicio = $scope.selectServicio.ProductoServicioResponse.idProductoServicio;
            requestAdicional.idCuenta = $scope.selectServicio.ProductoServicioResponse.idCuenta;
            requestAdicional.idRecibo = $scope.selectServicio.ProductoServicioResponse.idRecibo;
            requestAdicional.tipoCliente = tipoClienteConsumer;

            dataAdicionalServ = $httpParamSerializer({ requestJson: angular.toJson(requestAdicional) });
            return dataAdicionalServ;
        };

        function enviarDataServicios() {
            var requestServiciosMoviles = {
                "categoria": null,
                "tipoLinea": null,
                "tipoCliente": null,
                "idProductoServicio": null,
                "tipoPermiso": null,
                "idCuenta": null,
                "idRecibo": null,
                "idDireccion": null,
                "nombreProducto": null,
                "pagina": null,
                "cantResultadosPagina": null,
                "productoPrincipalXidRecibo": null,
                "titularidadServicio": null
            }
            requestServiciosMoviles.categoria = categoriaMovil;
            requestServiciosMoviles.tipoLinea = tipoLineaConsumer;
            requestServiciosMoviles.tipoCliente = tipoClienteConsumer;
            requestServiciosMoviles.tipoPermiso = tipoPermisoCambioPlan;
            requestServiciosMoviles.pagina = 0;
            requestServiciosMoviles.cantResultadosPagina = 0;
            requestServiciosMoviles.titularidadServicio = titularidadServicioThree;

            dataServiciosMoviles = $httpParamSerializer({ requestJson: angular.toJson(requestServiciosMoviles) });
            return dataServiciosMoviles;
        };

        function registrarAuditoria(rpta, idTransaccion, mensajeAuditoria) {
            if (rpta != 0) {
                guardarAuditoria(idTransaccion, estadoError, mensajeAuditoria);
            } else {
                guardarAuditoria(idTransaccion, estadoExito, mensajeAuditoria);
            }
        };

        function guardarAuditoria(idTransaccion, estadoAuditoria, mensajeAuditoria) {
            var dataAuditoria = dataAuditoriaRequest(idTransaccion, estadoAuditoria, mensajeAuditoria);
            srvCambioPlanMovil.guardarAuditoria(dataAuditoria).then(function(response) {}, function(error) {});
        };

        function dataAuditoriaRequest(transactionId, estadoAuditoria, mensajeAuditoria) {
            var permisoAudi = ''
            if (permisoAuditoria != '') {
                permisoAudi = permisoAuditoria;
            } else {
                permisoAudi = '-';
            }
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
            requestAuditoria.servicio = $scope.selectServicio.ProductoServicioResponse.nombreAlias;
            requestAuditoria.tipoProducto = tipoProductoFijo;
            requestAuditoria.tipoLinea = $scope.selectServicio.ProductoServicioResponse.tipoLinea;
            requestAuditoria.tipoUsuario = tipoClienteSession;
            requestAuditoria.perfil = $scope.selectServicio.ProductoServicioResponse.tipoPermiso;
            requestAuditoria.monto = '';
            requestAuditoria.descripcionoperacion = mensajeAuditoria;
            requestAuditoria.responseType = '-';

            dataAuditoria = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });
            return dataAuditoria;
        };
    }
]);

appController.directive('erCustomerror', function() {
    return {
        restrict: 'E',
        scope: {
            clickOn: '&onRefresh'
        },
        template: '<p class="error-server"><strong>' +
            WPSMensajeError.upps +
            '</strong><br>' +
            WPSMensajeError.mensaje1 + '<br>' + WPSMensajeError.mensaje2 + WPSMensajeError.mensaje4 + WPSMensajeError.mensaje5 +
            '<a href="" ><img src="/wpstheme/cuentasclaro/img/icon-actualizar.png" width="24" ng-click="clickOn()"></a>' +
            '</p>'
    }
})

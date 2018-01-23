var appController = angular.module('ctrlCambioPlanConsumer', []);

appController.controller('ctrlCambioPlanInternet', ['$scope', '$sce', '$window', '$http', '$timeout', 'srvCambioPlanInternet', '$httpParamSerializer',
    function($scope, $sce, $window, $http, $timeout, srvCambioPlanInternet, $httpParamSerializer) {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        $scope.$sce = $sce;
        $scope.mensaje_error_titulo = WPSMensajeError.upps;
        $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
        $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;
        $scope.urlInicio = '/wps/myportal/miclaro/consumer/solicitudes/cambiodeplan/internet';
        var urlCorporativo = '/wps/myportal/miclaro/corporativo/solicitudes/cambiodeplan/internet';
        var categoriaInternet = WPSCategoria.internet;
        var titularidadServicio = WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado;
        var tipoPermisoAll = WPSTipoPermiso.todos;
        var pagina = 0;
        var cantResultadosPagina = 0;
        var tipoClienteConsumer = WPSTipoCliente.consumer;
        var tipoLineaConsumer = WPSTipoLinea.todos;
        var flagSolicitarPlan = 2;
        var codOperacionCambioPlan = WPSTablaOperaciones.solicitarCambioPlan;
        var pageIdeCambioPlan = WPSPageID.miclaro_consumer_solicitudes_cambiodeplan_internet;
        var estadoExito = 'SUCCESS';
        var estadoError = 'ERROR';
        var tipoProductoFijo = 'INTERNET';
        var nombreLinea = '-';
        var tipoLineaAudi = '5';
        $scope.mostrarServicios = false;
        $scope.errorTotalRedirect = false;
        $scope.mostrarServiciosConsumer = false;
        $scope.mostrarDatosAdicionales = false;
        $scope.errorDatosAdicionales = false;
        $scope.mostrarPlanesSugeridos = false;
        $scope.errorPlanesSugeridos = false;
        $scope.desabilitarBoton = false;
        $scope.mostrarSwitchConsumer = false;
        $scope.planSugest = '';
        $scope.mostrarDetallePlan = false;

        var operacionDatosAdicionales = 'obtenerDatosAdicionalesServicioFijo';
        var operacionObtenerServicio = 'obtenerServicios';
        var operacionSolicitarPlan = 'solicitarPlan';
        var operacionPlanSugerido = 'obtenerPlanSugerido';
        var permisoAuditoria = '';
        var flagTipoCliente = '';

        angular.element(document).ready(function() {
            init();
        });

        function init() {
            srvCambioPlanInternet.obtenerTipoCliente().then(function(response) {
                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                if (rpta == 0) {
                    $scope.mostrarServicios = true;
                    flagTipoCliente = response.data.comunResponseType.tipoCliente;
                    var flagInternetSesion = parseInt(response.data.comunResponseType.flagProductoInternetSesion);

                    if (flagInternetSesion == 1 || flagInternetSesion == 3) {
                        obtenerServicioPrincipal();
                    } else if (flagInternetSesion == -1) {
                        $scope.errorTotalRedirect = true;
                        var mensajeAuditoria = operacionObtenerServicio + "- flagInternet";
                        registrarAuditoria(rpta, idTransaccion, mensajeAuditoria);
                    } else {
                        registrarAuditoria(rpta, idTransaccion, "-");
                        $scope.showSinServicios = true;
                    }
                    if (flagTipoCliente == 4) {
                        $scope.mostrarSwitchConsumer = true;
                    }
                } else {
                    $scope.errorTotalRedirect = true;
                }
            }, function(error) {});
        };

        $scope.switchChange = function() {
            $window.location.href = urlCorporativo;
        };

        function obtenerServicioPrincipal() {
            srvCambioPlanInternet.obtenerProductoPrincipal().then(function(response) {
                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                if (rpta == 0) {
                    var categoriaPrincipal = parseInt(response.data.comunResponseType.categoria);
                    var tipoClienteSession = response.data.comunResponseType.tipoClienteProductoPrincipal;
                    if (categoriaPrincipal == 3 && tipoClienteSession == 1) {
                        var idProductoServicioPrin = response.data.comunResponseType.productoPrincipal;
                        obtenerServiciosConsumer(idProductoServicioPrin, "1");
                    } else {
                        obtenerServiciosConsumer(null, "2");
                    }
                } else {
                    $scope.errorTotalRedirect = true;
                }
            }, function(error) {});
        };


        function obtenerServiciosConsumer(idProductoServicio, indicador) {
            var listaServicios = '';
            var idDireccionDefault = '';
            var idLineaInternet = '';
            var dataServicio = enviarDataServicios();
            srvCambioPlanInternet.obtenerServicios(dataServicio).then(function(response) {
                var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    $scope.mostrarServiciosConsumer = true;
                    listaServicios = response.data.obtenerServiciosResponse.listadoProductosServicios;
                    if (listaServicios != '' && listaServicios != undefined) {
                        if (angular.isArray(listaServicios)) {
                            $scope.listaServiciosConsumer = response.data.obtenerServiciosResponse.listadoProductosServicios;
                            if (indicador == "1") {
                                angular.forEach($scope.listaServiciosConsumer, function(val, key) {
                                    if (val.ProductoServicioResponse.idProductoServicio == idProductoServicio) {
                                        $scope.selectServicio = $scope.listaServiciosConsumer[key];
                                        idDireccionDefault = $scope.listaServiciosConsumer[key].ProductoServicioResponse.idDireccion;
                                        permisoAuditoria = $scope.listaServiciosConsumer[key].ProductoServicioResponse.tipoPermiso;
                                        tipoLineaAudi = $scope.listaServiciosConsumer[key].ProductoServicioResponse.tipoLinea;
                                        nombreLinea = $scope.listaServiciosConsumer[key].ProductoServicioResponse.nombreProducto;
                                    }
                                });
                            } else {
                                angular.forEach($scope.listaServiciosConsumer, function(val, key) {
                                    $scope.selectServicio = $scope.listaServiciosConsumer[0];
                                    idDireccionDefault = $scope.listaServiciosConsumer[0].ProductoServicioResponse.idDireccion;
                                    idLineaInternet = $scope.listaServiciosConsumer[0].ProductoServicioResponse.idLinea;
                                    idProductoServicioDefault = $scope.listaServiciosConsumer[0].ProductoServicioResponse.idProductoServicio;
                                    nombreLinea = $scope.listaServiciosConsumer[0].ProductoServicioResponse.nombreProducto;
                                    tipoLineaAudi = $scope.listaServiciosConsumer[0].ProductoServicioResponse.tipoLinea;
                                    permisoAuditoria = $scope.listaServiciosConsumer[0].ProductoServicioResponse.tipoPermiso;
                                });
                            }
                        } else {
                            $scope.listaServiciosConsumer = [];
                            $scope.listaServiciosConsumer.push(listaServicios);
                            if (indicador == "1") {
                                angular.forEach($scope.listaServiciosConsumer, function(val, key) {
                                    if (val.ProductoServicioResponse.idProductoServicio == idProductoServicio) {
                                        $scope.selectServicio = $scope.listaServiciosConsumer[key];
                                        idDireccionDefault = $scope.listaServiciosConsumer[key].ProductoServicioResponse.idDireccion;
                                        tipoLineaAudi = $scope.listaServiciosConsumer[key].ProductoServicioResponse.tipoLinea;
                                        permisoAuditoria = $scope.listaServiciosConsumer[key].ProductoServicioResponse.tipoPermiso;
                                        nombreLinea = $scope.listaServiciosConsumer[key].ProductoServicioResponse.nombreProducto;
                                    }
                                });
                            } else {
                                angular.forEach($scope.listaServiciosConsumer, function(val, key) {
                                    $scope.selectServicio = $scope.listaServiciosConsumer[0];
                                    idDireccionDefault = $scope.listaServiciosConsumer[0].ProductoServicioResponse.idDireccion;
                                    idLineaInternet = $scope.listaServiciosConsumer[0].ProductoServicioResponse.idLinea;
                                    idProductoServicioDefault = $scope.listaServiciosConsumer[0].ProductoServicioResponse.idProductoServicio;
                                    nombreLinea = $scope.listaServiciosConsumer[0].ProductoServicioResponse.nombreProducto;
                                    tipoLineaAudi = $scope.listaServiciosConsumer[0].ProductoServicioResponse.tipoLinea;
                                    permisoAuditoria = $scope.listaServiciosConsumer[0].ProductoServicioResponse.tipoPermiso;
                                });
                            }
                            var cantidadLineas = $scope.listaServiciosConsumer.length;
                            if (cantidadLineas < 2) {
                                $(".pullservicio").addClass("disabled");
                            }
                        }
                        if (indicador == "1") {
                            obtenerDatosAdicionalesServicioFijo(idDireccionDefault, idProductoServicio);
                        } else {
                            obtenerDatosAdicionalesServicioFijo(idDireccionDefault, idProductoServicioDefault);
                            actualizarProductoPrincipal(idDireccionDefault, idProductoServicioDefault, nombreLinea, tipoLineaAudi, idLineaInternet);
                        }
                    } else {
                        $scope.errorTotalRedirect = true;
                    }
                } else {
                    var mensajeAuditoria = operacionObtenerServicio + "-" + mensajeServicio;
                    registrarAuditoria(rpta, idTransaccion, mensajeAuditoria);
                    $scope.errorTotalRedirect = true;
                }
            }, function(error) {});
        };

        var idTipoProductoServicioSelect = '';

        function obtenerDatosAdicionalesServicioFijo(idDireccion, idProductoServicio) {
            var adicional = enviarDataAdicional(idDireccion, idProductoServicio);
            srvCambioPlanInternet.obtenerDatosAdicionalesServicioFijo(adicional).then(function(response) {
                var rpta = parseInt(response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    $scope.mostrarDatosAdicionales = true;
                    $scope.planActual = response.data.obtenerDatosAdicionalesServicioFijoResponse.planActual;
                    $scope.fechaRenovacion = response.data.obtenerDatosAdicionalesServicioFijoResponse.fechaRenovacionPlan;
                    $scope.direccionCompleta = response.data.obtenerDatosAdicionalesServicioFijoResponse.direccionCompleta;
                    idTipoProductoServicioSelect = response.data.obtenerDatosAdicionalesServicioFijoResponse.idTipoProductoServicio;
                    var cargoFijoFijo = response.data.obtenerDatosAdicionalesServicioFijoResponse.cargoFijo;
                    var planActualFijo = response.data.obtenerDatosAdicionalesServicioFijoResponse.planActual;
                    obtenerPlanSugerido(cargoFijoFijo, planActualFijo, idDireccion, idProductoServicio);
                } else {
                    $scope.errorDatosAdicionales = true;
                    var mensajeAuditoria = operacionDatosAdicionales + "-" + mensajeServicio;
                    registrarAuditoria(rpta, idTransaccion, mensajeAuditoria);
                }
            }, function(error) {});
        };

        function obtenerPlanSugerido(cargoFijoFijo, planActualFijo, idDireccion, idProductoServicio) {
            var dataPlanSugerido = enviarDataPlanSugerido(cargoFijoFijo, planActualFijo, idDireccion, idProductoServicio);
            srvCambioPlanInternet.obtenerPlanSugerido(dataPlanSugerido).then(function(response) {
                var rpta = parseInt(response.data.obtenerPlanSugeridoResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerPlanSugeridoResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.obtenerPlanSugeridoResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    $scope.mostrarPlanesSugeridos = true;

                    var categoriaPlanSugerido = response.data.obtenerPlanSugeridoResponse.idCategoria;
                    var idTipoPlanSugerido = response.data.obtenerPlanSugeridoResponse.tipoPlan;
                    var idPlanSugerido = response.data.obtenerPlanSugeridoResponse.idPlan;
                    var listaPlanesWebcontent = planesWCM;
                    var arrayTabs = '';
                    var flagMostrar = '';
                    $scope.planesSinTab = [];

                    angular.forEach(listaPlanesWebcontent, function(val, key) {
                        if (val.categoria == categoriaPlanSugerido) {
                            arrayTabs = val.tabs;
                            flagMostrar = val.mostrarTabs;
                        }
                    });
                    if (flagMostrar == true) {

                        $scope.arrayTabsMovil = arrayTabs;
                        var lengthArrayMovil = parseInt($scope.arrayTabsMovil.length);
                        var porcentajetab = 100 / lengthArrayMovil;
                        $scope.stiloRedimension = {
                            "width": porcentajetab + "%"
                        }
                        angular.forEach($scope.arrayTabsMovil, function(valor, llave) {
                            if (valor.idTab == idTipoPlanSugerido) {
                                $scope.planesSinTab = valor.planesTab;
                                $scope.indice = [llave];
                                $scope.selectTab = $scope.arrayTabsMovil[llave];
                            }
                        });
                        var lengthPlanes = $scope.planesxTab.length;
                        renderSlidePlan(lengthPlanes);
                        clickxPlan($scope.planesSinTab, idPlanSugerido);
                        $scope.planSugest = idPlanSugerido;
                    } else {
                        var objArrayInternet = {};
                        angular.forEach(arrayTabs, function(val, key) {
                            var idTipoTab = arrayTabs[key].idTab;
                            angular.forEach(val.planesTab, function(v, k) {
                                objArrayInternet = {
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
                                $scope.planesSinTab.push(objArrayInternet);
                            });
                        });
                        var lengthPlanes = $scope.planesSinTab.length;
                        renderSlidePlan(lengthPlanes);
                        clickxPlan($scope.planesSinTab, idPlanSugerido);
                        $scope.planSugest = idPlanSugerido;
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
            $scope.errorDatosAdicionales = false;
            var idDireccionSeleccionado = $scope.selectServicio.ProductoServicioResponse.idDireccion;
            var idProductoSeleccionado = $scope.selectServicio.ProductoServicioResponse.idProductoServicio;
            if (valorInput == "1") {
                $scope.errorDatosAdicionales = false;
                obtenerDatosAdicionalesServicioFijo(idDireccionSeleccionado, idProductoSeleccionado);
            } else if (valorInput == "2") {}
        }

        $scope.obtenerPlanesxServicio = function() {
            $scope.errorDatosAdicionales = false;
            $scope.errorPlanesSugeridos = false;
            $scope.mostrarDatosAdicionales = false;
            $scope.direccionCompleta = null;
            var idProductoServicioSelect = $scope.selectServicio.ProductoServicioResponse.idProductoServicio;
            var tipoLineaSelect = $scope.selectServicio.ProductoServicioResponse.tipoLinea;
            var idDireccionSelect = $scope.selectServicio.ProductoServicioResponse.idDireccion;
            var idLineaFijo = $scope.selectServicio.ProductoServicioResponse.idLinea;
            var nombreProducto = $scope.selectServicio.ProductoServicioResponse.nombreAlias;
            obtenerDatosAdicionalesServicioFijo(idDireccionSelect, idProductoServicioSelect);
            actualizarProductoPrincipal(idDireccionSelect, idProductoServicioSelect, nombreProducto, tipoLineaSelect, idLineaFijo);
        };

        function actualizarProductoPrincipal(idDireccion, idProductoServicio, nombreProducto, tipoLinea, idLineaFijo) {
            var actualizar = enviarDataActualizar(idDireccion, idProductoServicio, nombreProducto, tipoLinea, idLineaFijo);
            srvCambioPlanInternet.actualizarProductoPrincipal(actualizar).then(function(response) {}, function(error) {});
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


        $scope.solicitarNuevoServicio = function() {
            var idDireccionSelect = $scope.selectServicio.ProductoServicioResponse.idDireccion;
            var idProductoServicioSelect = $scope.selectServicio.ProductoServicioResponse.idProductoServicio;
            abrirPopUp();
            var dataPlan = dataSolicitarPlan(idDireccionSelect, idProductoServicioSelect, $scope.idPlanSelect, $scope.idTipoCategoria);
            srvCambioPlanInternet.solicitarNuevoServicio(dataPlan).then(function(response) {
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

        function dataSolicitarPlan(idDireccionSelect, idProductoServicioSelect, idPlanSelect, idTipoTab) {
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
            requestSolicitarPlan.categoria = categoriaInternet;
            requestSolicitarPlan.idDireccion = idDireccionSelect;
            requestSolicitarPlan.idProductoServicio = idProductoServicioSelect;
            requestSolicitarPlan.idPlan = idPlanSelect;
            requestSolicitarPlan.tipoPlan = idTipoTab;

            if (idTipoProductoServicioSelect != undefined && idTipoProductoServicioSelect != '') {
                requestSolicitarPlan.idTipoProductoServicio = idTipoProductoServicioSelect;
            }
            dataListDir = $httpParamSerializer({ requestJson: angular.toJson(requestSolicitarPlan) });
            return dataListDir;
        };


        $scope.cerrarPopup = function() {
            esconderPopUp();
        };

        $scope.cerrarConfirmacion = function() {
            esconderPopUp();
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

        $scope.regresar = function() {
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

        function enviarDataActualizar(idDireccion, idProductoServicio, nombreProducto, tipoLinea, idLineaFijo) {
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

            requestActualizar.productoPrincipal = idProductoServicio;
            requestActualizar.nombreProductoPrincipal = nombreProducto;
            requestActualizar.idDireccion = idDireccion;
            requestActualizar.idLinea = idLineaFijo;
            requestActualizar.tipoLinea = tipoLinea;
            requestActualizar.idLinea = idLineaFijo;
            requestActualizar.categoria = categoriaInternet;
            requestActualizar.tipoClienteProductoPrincipal = tipoClienteConsumer;

            dataActualizar = $httpParamSerializer({ requestJson: angular.toJson(requestActualizar) });
            return dataActualizar;
        };

        function enviarDataPlanSugerido(cargoFijoFijo, planActualFijo, idDireccion, idProductoServicio) {
            var requestPlanSugerido = {
                "categoria": null,
                "idCuenta": null,
                "idRecibo": null,
                "idDireccion": null,
                "idProductoServicio": null,
                "planActual": null,
                "cargoFijo": null
            }
            requestPlanSugerido.categoria = categoriaInternet;
            requestPlanSugerido.idProductoServicio = idProductoServicio;
            requestPlanSugerido.idDireccion = idDireccion;
            requestPlanSugerido.planActual = planActualFijo;
            requestPlanSugerido.cargoFijo = cargoFijoFijo;

            dataPlanSugerido = $httpParamSerializer({ requestJson: angular.toJson(requestPlanSugerido) });
            return dataPlanSugerido;
        };


        function enviarDataAdicional(idDireccion, idProductoServicio) {
            var requestAdicional = {
                "idProductoServicio": null,
                "categoria": null,
                "idDireccion": null,
                "idLinea": null
            }
            requestAdicional.idProductoServicio = idProductoServicio;
            requestAdicional.categoria = categoriaInternet;
            requestAdicional.idDireccion = idDireccion;

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
            requestServiciosMoviles.categoria = categoriaInternet;
            requestServiciosMoviles.tipoLinea = tipoLineaConsumer;
            requestServiciosMoviles.tipoCliente = tipoClienteConsumer;
            requestServiciosMoviles.tipoPermiso = tipoPermisoAll;
            requestServiciosMoviles.pagina = pagina;
            requestServiciosMoviles.cantResultadosPagina = cantResultadosPagina;
            requestServiciosMoviles.titularidadServicio = titularidadServicio;

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
            srvCambioPlanInternet.guardarAuditoria(dataAuditoria).then(function(response) {}, function(error) {});
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
            requestAuditoria.servicio = nombreLinea;
            requestAuditoria.tipoProducto = tipoProductoFijo;
            requestAuditoria.tipoLinea = tipoLineaAudi;
            requestAuditoria.tipoUsuario = flagTipoCliente;
            requestAuditoria.perfil = permisoAudi;
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

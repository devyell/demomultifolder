var appController = angular.module('ctrlNuevoServicioConsumer', []);

appController.controller('ctrlNuevoServicio', ['$scope', '$sce', '$window', '$filter', '$http', '$timeout', 'srvNuevoServicio', '$httpParamSerializer',
    function($scope, $sce, $window, $filter, $http, $timeout, srvNuevoServicio, $httpParamSerializer) {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        $scope.$sce = $sce;
        var flagSolicitarPlan = "1";
        var tipoClienteConsumer = WPSTipoCliente.consumer;
        var valorTwoMovil = '';
        var valorThreeMovil = '';
        var valorTwoFijo = '';
        var valorThreeFijo = '';
        var valorTwoInternet = '';
        var valorThreeInternet = '';
        var valorTwoTv = '';
        var valorThreeTv = '';
        var count = 0;
        var count1 = 0;
        var count2 = 0;
        var count3 = 0;
        var estadoActivoMovil = false;
        var estadoActivoFijo = false;
        var estadoActivoInternet = false;
        var estadoActivoTv = false;
        var operacionNuevoServicio = 'solicitarNuevoServicio';
        var urlCorporativo = '/wps/myportal/miclaro/corporativo/solicitudes/nuevoservicio';
        var pageIdNuevoServicio = WPSPageID.miclaro_consumer_solicitudes_nuevoservicio;
        var codOperacionNuevoServicio = WPSTablaOperaciones.solicitarNuevoServicio;
        var estadoExito = 'SUCCESS';
        var estadoError = 'ERROR';
        var tipoProductoFijo = '';
        var tipoConsultaDescripcion = 'solicitarNuevoServicioConsumer';
        var tipoPermisoAll = WPSTipoPermiso.todos;
        $scope.mostrarSwitchConsumer = false;
        var nombreLinea = '-';
        var tipoLinea = '';
        $scope.planSugest = '';

        var idTabSeleccionado = '';
        var tipoPlanRecomendado = '';
        var idPlanRecomendado = '';
        var tipoCategoriaRecomendado = '';
        $scope.mostrarSlideMovil = false;
        $scope.mostrarSlideInternet = false;
        $scope.mostrarSlideTv = false;
        $scope.mostrarSlideFijo = false;
        $scope.mostrarPlanes = false;
        $scope.mostrarBoton = false;
        $scope.mostrarIconos = false;
        $scope.errorTotalRedirect = false;
        $scope.errorPlanesSugeridos = false;
        $scope.mostrarTabsPlanes = false;
        $scope.desabilitarBoton = false;
        $scope.mostrarDetallePlan = false;
        $scope.terminosMovil = false;
        $scope.terminosNoMovil = false;
        $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
        $scope.mensaje_error_upps = WPSMensajeError.upps;
        $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
        $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;
        $scope.urlInicio = '/wps/myportal/miclaro/consumer/solicitudes/nuevoservicio';

        var operacionObtenerCriterios = 'obtenerCriterios';
        var operacionDevolverCriterios = 'devolverPlanPorCriterios';
        var operacionSolicitarPlan = 'solicitarPlan';
        var tipoClienteSession = '';

        angular.element(document).ready(function() {
            init();
            initTabs();
        });

        function init() {
            srvNuevoServicio.obtenerTipoCliente().then(function(response) {
                tipoClienteSession = response.data.comunResponseType.tipoCliente;
                var flagCategoria = response.data.comunResponseType.categoria;
                tipoLinea = response.data.comunResponseType.tipoLinea;

                if (flagCategoria != 1) {
                    nombreLinea = response.data.comunResponseType.idLinea;
                    if (flagCategoria == 2) {
                        tipoProductoFijo = 'FIJO';
                    } else if (flagCategoria == 3) {
                        tipoProductoFijo = 'INTERNET';
                    } else {
                        tipoProductoFijo = 'CLAROTV';
                    };
                } else {
                    nombreLinea = response.data.comunResponseType.nombreProductoPrincipal;
                    tipoProductoFijo = 'MOVIL';
                }
                obtenerCriterios();
                if (tipoClienteSession == 4) {
                    $scope.mostrarSwitchConsumer = true;
                }
            }, function(error) {
                $scope.errorTotalRedirect = true;
            });
        };

        $scope.switchChange = function() {
            window.location.href = urlCorporativo;
        };


        function obtenerCriterios() {
            srvNuevoServicio.obtenerCriterios().then(function(response) {
                var rpta = parseInt(response.data.obtenerCriteriosResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerCriteriosResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.obtenerCriteriosResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    $scope.mostrarIconos = true;

                    $scope.movilMin = parseInt(response.data.obtenerCriteriosResponse.cantMinMovil);
                    $scope.movilMax = parseInt(response.data.obtenerCriteriosResponse.cantMaxMovil);
                    $scope.internetMin = parseInt(response.data.obtenerCriteriosResponse.cantMinInternet);
                    $scope.internetMax = parseInt(response.data.obtenerCriteriosResponse.cantMaxInternet);
                    $scope.fijoMin = parseInt(response.data.obtenerCriteriosResponse.cantMinTelFijo);
                    $scope.fijoMax = parseInt(response.data.obtenerCriteriosResponse.cantMaxTelFijo);
                    $scope.tvMin = parseInt(response.data.obtenerCriteriosResponse.cantMinCanales);
                    $scope.tvMax = parseInt(response.data.obtenerCriteriosResponse.cantMaxCanales);


                    var restaValoresMovil = $scope.movilMax - $scope.movilMin;
                    var valorMediosMovil = restaValoresMovil / 3;
                    valorTwoMovil = parseInt($scope.movilMin + valorMediosMovil);
                    valorThreeMovil = parseInt(valorTwoMovil + valorMediosMovil);

                    var restaValoresFijo = $scope.fijoMax - $scope.fijoMin;
                    var valorMediosFijo = restaValoresFijo / 3;
                    valorTwoFijo = parseInt($scope.fijoMin + valorMediosFijo);
                    valorThreeFijo = parseInt(valorTwoFijo + valorMediosFijo);

                    var restaValoresInternet = $scope.internetMax - $scope.internetMin;
                    var valorMediosInternet = restaValoresInternet / 3;
                    valorTwoInternet = parseInt($scope.internetMin + valorMediosInternet);
                    valorThreeInternet = parseInt(valorTwoInternet + valorMediosInternet);

                    var restaValoresTv = $scope.tvMax - $scope.tvMin;
                    var valorMediosTv = restaValoresTv / 3;
                    valorTwoTv = parseInt($scope.tvMin + valorMediosTv);
                    valorThreeTv = parseInt(valorTwoTv + valorMediosTv);

                } else {
                    $scope.errorTotalRedirect = true;
                    var mensajeAuditoria = operacionObtenerCriterios + "-" + mensajeServicio;
                    grabarAuditoria(rpta, idTransaccion, mensajeAuditoria);
                }

            }, function(error) {});
        };

        $scope.mostrarMovil = function() {
            if (estadoActivoInternet != true && estadoActivoTv != true && estadoActivoFijo != true) {
                if (estadoActivoMovil == false) {
                    estadoActivoMovil = true;
                    agregarClassOtros();
                    agregarclassThis("movil");
                    $timeout(function() {
                        $scope.mostrarSlideMovil = true;
                        $scope.mostrarBoton = true;
                        if (count < 1) {
                            slideMovil($scope.movilMax, $scope.movilMin, valorTwoMovil, valorThreeMovil);
                            count++;
                        }
                    }, 250);
                } else {
                    estadoActivoMovil = false;
                    $timeout(function() {
                        $scope.mostrarSlideMovil = false;
                        $scope.mostrarBoton = false;
                    }, 350);
                    removerClassOtros();
                    removerClassThis("movil");
                }
            }
        };

        $scope.mostrarFijo = function() {
            if (estadoActivoMovil != true) {
                if (estadoActivoFijo == false) {
                    estadoActivoFijo = true;
                    agregarClassMovil();
                    agregarclassThis("fijo");
                    $timeout(function() {
                        $scope.mostrarSlideFijo = true;
                        $scope.mostrarBoton = true;
                        if (count1 < 1) {
                            slideFijo($scope.fijoMax, $scope.fijoMin, valorTwoFijo, valorThreeFijo);
                            count1++;
                        }
                    }, 250);
                } else {
                    estadoActivoFijo = false;
                    $timeout(function() {
                        $scope.mostrarSlideFijo = false;
                    }, 350);
                    removerClassdeDivs();
                    removerClassThis("fijo");
                }
            }
        };

        $scope.mostrarInternet = function() {
            if (estadoActivoMovil != true) {
                if (estadoActivoInternet == false) {
                    estadoActivoInternet = true;
                    agregarClassMovil();
                    agregarclassThis("internet");
                    $timeout(function() {
                        $scope.mostrarSlideInternet = true;
                        $scope.mostrarBoton = true;
                        if (count2 < 1) {
                            slideInternet($scope.internetMax, $scope.internetMin, valorTwoInternet, valorThreeInternet);
                            count2++;
                        }
                    }, 250);
                } else {
                    estadoActivoInternet = false;
                    $timeout(function() {
                        $scope.mostrarSlideInternet = false;
                    }, 350);
                    removerClassdeDivs();
                    removerClassThis("internet");
                }
            }
        };

        $scope.mostrarTv = function() {
            if (estadoActivoMovil != true) {
                if (estadoActivoTv == false) {
                    estadoActivoTv = true;
                    agregarClassMovil();
                    agregarclassThis("canalesTv");
                    $timeout(function() {
                        $scope.mostrarSlideTv = true;
                        $scope.mostrarBoton = true;
                        if (count3 < 1) {
                            slideTv($scope.tvMax, $scope.tvMin, valorTwoTv, valorThreeTv);
                            count3++;
                        }
                    }, 250);
                } else {
                    estadoActivoTv = false;
                    $timeout(function() {
                        $scope.mostrarSlideTv = false;
                    }, 350);
                    removerClassdeDivs();
                    removerClassThis("canalesTv");
                }
            }
        };

        function removerClassdeDivs() {
            if (estadoActivoFijo == false && estadoActivoTv == false && estadoActivoInternet == false) {
                removerClassMovil();
                $scope.mostrarBoton = false;
            }
        };

        function enviardataPlanes(valMovil, valInternet, valTv, valFijo) {
            var requestPlanes = {
                "valorLlamadasMovil": null,
                "valorLlamadasFija": null,
                "valorInternet": null,
                "valorCantidadCanales": null
            }
            if (valMovil != '') {
                requestPlanes.valorLlamadasMovil = valMovil;
            }
            if (valInternet != '') {
                requestPlanes.valorInternet = valInternet;
            }
            if (valFijo != '') {
                requestPlanes.valorLlamadasFija = valFijo;
            }
            if (valTv != '') {
                requestPlanes.valorCantidadCanales = valTv;
            }

            dataPlanes = $httpParamSerializer({ requestJson: angular.toJson(requestPlanes) });
            return dataPlanes;
        }

        $scope.classActive = false;

        $scope.mostrarPlanesRecomendados = function() {
            var valorFijoEnviar = '';
            var valorMovilEnviar = '';
            var valorInternetEnviar = '';
            var valorTvEnviar = '';
            if (estadoActivoFijo == true) {
                if (valFijo == 0 || valFijo == '') {
                    valorFijoEnviar = $scope.fijoMin;
                } else {
                    valorFijoEnviar = valFijo;
                }
            }
            if (estadoActivoMovil == true) {
                if (valMovil == 0 || valMovil == '') {
                    valorMovilEnviar = $scope.movilMin;
                } else {
                    valorMovilEnviar = valMovil;
                }
            }
            if (estadoActivoInternet == true) {
                if (valInternet == 0 || valInternet == '') {
                    valorInternetEnviar = $scope.internetMin;
                } else {
                    valorInternetEnviar = valInternet;
                }
            }
            if (estadoActivoTv == true) {
                if (valTv == 0 || valTv == '') {
                    valorTvEnviar = $scope.tvMin;
                } else {
                    valorTvEnviar = valTv;
                }
            }
            $scope.mostrarIconos = false;

            var dataPlanes = enviardataPlanes(valorMovilEnviar, valorInternetEnviar, valorTvEnviar, valorFijoEnviar);
            srvNuevoServicio.devolverPlanPorCriterios(dataPlanes).then(function(response) {
                var rpta = parseInt(response.data.devolverPlanPorCriteriosResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.devolverPlanPorCriteriosResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.devolverPlanPorCriteriosResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    $scope.mostrarPlanes = true;
                    idPlanRecomendado = response.data.devolverPlanPorCriteriosResponse.idPlan;
                    tipoPlanRecomendado = response.data.devolverPlanPorCriteriosResponse.tipoPlan;
                    tipoCategoriaRecomendado = response.data.devolverPlanPorCriteriosResponse.idCategoria;

                    var listaPlanesWebcontent = planesWCM;
                    var arrayTabs = [];
                    var flagMostrar = '';
                    var arraryPlanesPreliminar = [];
                    $scope.planesxTab = [];


                    angular.forEach(listaPlanesWebcontent, function(val, key) {
                        if (val.categoria == tipoCategoriaRecomendado) {
                            arrayTabs = val.tabs;
                            flagMostrar = val.mostrarTabs;
                        }
                    });

                    $scope.cargarTabs = arrayTabs;

                    if (flagMostrar == true) {
                        $scope.mostrarTabsPlanes = true;


                        var lengthArrayMovil = parseInt($scope.cargarTabs.length);
                        var porcentajetab = 100 / lengthArrayMovil;
                        $scope.stiloRedimension = {
                            "width": porcentajetab + "%"
                        }

                        angular.forEach($scope.cargarTabs, function(valor, llave) {
                            if (valor.idTab == tipoPlanRecomendado) {
                                idTabSeleccionado = tipoPlanRecomendado
                                arraryPlanesPreliminar = valor.planesTab;
                                $scope.indice = [llave];
                                $scope.selectTab = $scope.cargarTabs[llave];
                            }
                        });

                        arraryPlanesPreliminar = $filter('orderBy')(arraryPlanesPreliminar, '-idPlan');



                        $scope.planesxTab = arraryPlanesPreliminar;


                        var lengthPlanes = $scope.planesxTab.length;
                        renderSlidePlan(lengthPlanes);
                        clickxPlan($scope.planesxTab, idPlanRecomendado);
                        $scope.planSugest = idPlanRecomendado;

                    } else {
                        $scope.mostrarTabsPlanes = false;
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
                        clickxPlan($scope.planesxTab, idPlanRecomendado);
                        $scope.planSugest = idPlanRecomendado;


                    }
                } else {
                    $scope.errorPlanesSugeridos = true;
                    var mensajeAuditoria = operacionDevolverCriterios + "-" + mensajeServicio;
                    grabarAuditoria(rpta, idTransaccion, mensajeAuditoria);
                }

            }, function(error) {});
        };

        $scope.agregarCss = function() {
            var totalsize = $margin + 10;
            return {
                "margin": '0px ' + totalsize + 'px 20px'
            }
        }


        $scope.buscarPlanes = function(idTabSelect, cate, index) {
            idTabSeleccionado = idTabSelect;


            $scope.indice = index;

            var listaPlanesWebcontent = planesWCM;
            $scope.planesxTab = [];
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
            if (tipoPlanRecomendado == idTabSelect) {
                clickxPlan($scope.planesxTab, idPlanRecomendado);
            }

        };

        $scope.buscarPlanesMobile = function() {
            var idtab = $scope.selectTab.idTab;
            var cateSelect = $scope.selectTab.categoria;
            $scope.buscarPlanes(idtab, cateSelect, null);
        };

        $scope.mostrarPlanTerminos = function(objPlan) {

            $scope.planSugest = objPlan.idPlan;

            $scope.mostrarPlanes = false;
            $scope.mostrarDetallePlan = true;

            $scope.tipoServicio = $scope.cargarTabs[0].categoria;
            $scope.objPlanConfirmar = objPlan;


            $scope.idPlanSelect = objPlan.idPlan;

            if (typeof objPlan.tipoTab === "undefined") {
                $scope.idTipoCategoria = '';
            } else {
                $scope.idTipoCategoria = objPlan.tipoTab;
            }
            
        };

        $scope.solicitarNuevoServicio = function() {

            abrirPopUp();


            var dataPlan = dataSolicitarPlan($scope.idPlanSelect, $scope.idTipoCategoria);
            srvNuevoServicio.solicitarNuevoServicio(dataPlan).then(function(response) {
                var rpta = parseInt(response.data.solicitarPlanResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.solicitarPlanResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.solicitarPlanResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    var respuestaPlan = response.data.solicitarPlanResponse.resultado;
                    if (respuestaPlan == "true") {
                        $timeout(function() {
                            mostrarConfirmacion();
                        }, 350);
                        grabarAuditoria(rpta, idTransaccion, "-");
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
                    grabarAuditoria(rpta, idTransaccion, mensajeAuditoria);
                }
            }, function(error) {

            });
        };



        function dataSolicitarPlan(idPlanSelect, idTipoCategoria) {
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
            requestSolicitarPlan.idPlan = idPlanSelect;
            if (tipoCategoriaRecomendado == 'MOVIL') {
                requestSolicitarPlan.tipoPlan = idTabSeleccionado;
            } else {
                requestSolicitarPlan.tipoPlan = idTipoCategoria;
            }


            dataListDir = $httpParamSerializer({ requestJson: angular.toJson(requestSolicitarPlan) });
            return dataListDir;
        };

        


        $scope.cerrarPopup = function() {
            esconderPopUp();
        };

        $scope.cerrarConfirmacion = function() {
            esconderPopUp();

            $timeout(function() {
                $scope.desabilitarBoton = true;
                $window.location.href = $scope.urlInicio;
            }, 100);
        };

        $scope.regresar = function() {
            $scope.mostrarDetallePlan = false;
            $scope.mostrarPlanes = true;

            $scope.modelAceptarTerminos = false;
            $("#checkboxTerminos").removeClass("checked");
            $("#btcontratar").addClass("bt-disabled");
            $("#btcontratar").attr("disabled", "disabled");
        };

        $scope.mostrarPopUpTerminos = function() {

            if ($scope.cargarTabs[0].categoria == 'MOVIL') {
                $scope.terminosMovil = true;
                $scope.terminosNoMovil = false;
            } else {
                $scope.terminosNoMovil = true;
                $scope.terminosMovil = false;
            }

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

        var objAuditoria = {};

        function grabarAuditoria(rpta, idTransaccion, mensajeAuditoria) {
            if (rpta != 0) {
                guardarAuditoria(idTransaccion, estadoError, mensajeAuditoria);
            } else {
                guardarAuditoria(idTransaccion, estadoExito, mensajeAuditoria);
            }
        };

        function guardarAuditoria(idTransaccion, estadoAuditoria, mensajeAuditoria) {
            var dataAuditoria = dataAuditoriaRequest(idTransaccion, estadoAuditoria, mensajeAuditoria);
            srvNuevoServicio.guardarAuditoria(dataAuditoria).then(function(response) {}, function(error) {});
        };

        function dataAuditoriaRequest(transactionId, estadoAuditoria, mensajeAuditoria) {
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
            requestAuditoria.operationCode = codOperacionNuevoServicio;
            requestAuditoria.pagina = pageIdNuevoServicio;
            requestAuditoria.transactionId = transactionId;
            requestAuditoria.estado = estadoAuditoria;
            requestAuditoria.servicio = nombreLinea;
            requestAuditoria.tipoProducto = tipoProductoFijo;
            requestAuditoria.tipoLinea = tipoLinea;
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
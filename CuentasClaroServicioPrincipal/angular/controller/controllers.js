var appController = angular.module('miClaroController', []);

appController.controller('miClaroCtr', ['$scope', '$http', '$window', 'productoServicio', '$httpParamSerializer',
    function($scope, $http, $window, productoServicio, $httpParamSerializer) {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $('link[rel=stylesheet][href~="/wpstheme/cuentasclaro/css/intranet.css"]').prop('disabled', true);
        $('link[rel=stylesheet][href~="/wpstheme/cuentasclaro/css/intranet.css"]').remove();
        $('link[rel=stylesheet][href~="/wpstheme/cuentasclaro/css/ebm.css"]').prop('disabled', true);
        $('link[rel=stylesheet][href~="/wpstheme/cuentasclaro/css/ebm.css"]').remove();

        $scope.showMovilesConsumer = false;
        $scope.showCoorporativoMovil = false;
        $scope.showBotton = false;
        $scope.showBusquedaDirecciones = false;
        $scope.showListFijos = false;
        $scope.errorDivCoorporativo = false;
        $scope.allServiciosMoviles = false;
        $scope.errorTotal = false;
        $scope.showImformeCliente = true;
        $scope.showAllServiciosFijos = false;
        $scope.divInformacion = false;
        $scope.errorDivServiciosFijos = false;
        $scope.showConsumerFija = false;
        $scope.errorDivFijos = false;
        $scope.erroUlPostpago = false;
        $scope.erroUlPrepago = false;
        $scope.showCombosCorporativos = false;
        $scope.showSearchCoorpo = false;
        $scope.errorDivCorServicios = false;
        $scope.mostrarPostpago = true;
        $scope.mostrarPrepago = true;

        $scope.radioPost = null;
        $scope.radioPre = null;
        $scope.RadioCoor1 = null;
        $scope.RadioCoor2 = null;
        $scope.RadioFijo1 = null;
        $scope.RadioFijo2 = null;
        $scope.selectIdRecibo = null;
        $scope.selectIdDireccion = null;

        $scope.selected = '';
        $scope.inputBuscar = '';
        $scope.ulMayor = [];
        $scope.ulMenor = [];
        $scope.ulMayorFijo = [];
        $scope.ulMenorFijo = [];
        $scope.listRecibosCoor = [];
        $scope.listCuentasCoorporativas = [];
        $scope.listLineasAutocompleted = [];
        var objExito = {};
        var i, j;
        var tipoLineaPostpago = WPSTipoLinea.postpago;
        var tipoLineaPrepago = WPSTipoLinea.prepago;
        var tipoLineaTodos = WPSTipoLinea.todos;
        var categoriaMovil = WPSCategoria.movil;
        var tipoClienteConsumer = WPSTipoCliente.consumer;
        var tipoClienteCorporativo = WPSTipoCliente.corporativo;
        var tipoClienteMix = WPSTipoCliente.mixto;
        var categoriaTodos = WPSCategoria.todos;
        var titularidadServicio = WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado;
        var tipoPermisoAll = WPSTipoPermiso.todos;
        var tipoClienteFiltros = WPSTipoClienteDir.todos;
        var pagina = WPSpaginacion.pagina;
        var cantResultadosPagina = WPSpaginacion.cantResultadosPagina;
        var operationcodeConsulta = WPSTablaOperaciones.consultarServicioPrincipal;
        var operationcodeAsignar = WPSTablaOperaciones.asignarServicioPrincipal;
        var pageId = WPSPageID.cuentasclaro_servicioprincipal;
        var estadoExito = 'SUCCESS';
        var estadoError = 'ERROR';
        var tipoProductoMovil = 'MOVIL';
        var operacionObtenerServicio = 'obtenerServicios';
        var operacionObtenerCuenta = 'obtenerListadoMovilCorporativoCuenta';
        var operacionObtenerRecibo = 'obtenerListadoMovilCorporativoRecibo';
        var operacionObtenerDireccion = 'obtenerListadoFijoDireccion';
        var operacionGuardarServicio = 'guardarServicioPrincipal';
        var tipoClienteSession = '';
        var servicioAuditoria = '';
        var tipoLineaAuditoria = '-';
        var flagProductoFijoSession = '';
        var flagProductoMovilSession = '';
        var flagProductoInternetSession = '';
        var flagProductoTvSession = '';
        var perfilAuditoria = '-';
        angular.element(document).ready(function() {
            init();
            renderAutocomplete();
        });

        function init() {
            productoServicio.obtenerTipoCliente().then(function(response) {
                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                if (rpta == 0) {
                    var serviAudi = '';
                    tipoClienteSession = parseInt(response.data.comunResponseType.tipoCliente);
                    $scope.nombreUsuario = response.data.comunResponseType.nombreUsuario;
                    $scope.razonSocialCoorporativo = response.data.comunResponseType.razonSocial;
                    serviAudi = response.data.comunResponseType.telefono;
                    if (serviAudi == '') {
                        serviAudi = response.data.comunResponseType.idCuenta;
                        if (serviAudi == '') {
                            serviAudi = response.data.comunResponseType.numeroTelFijo;
                            if (serviAudi == '') {
                                serviAudi = response.data.comunResponseType.idDireccion;
                            }
                        }
                    }
                    servicioAuditoria = serviAudi;
                    var tipoLineaEnConsulta = response.data.comunResponseType.tipoLinea;
                    if (tipoLineaEnConsulta == "1") {
                        tipoLineaAuditoria = "1";
                    } else {
                        tipoLineaAuditoria = "2";
                    }
                    flagProductoMovilSession = parseInt(response.data.comunResponseType.flagProductoMovilSesion);
                    flagProductoFijoSession = parseInt(response.data.comunResponseType.flagProductoFijoSesion);
                    flagProductoInternetSession = parseInt(response.data.comunResponseType.flagProductoInternetSesion);
                    flagProductoTvSession = parseInt(response.data.comunResponseType.flagProductoTVSesion);
                    validarflags(rpta, idTransaccion);
                    $("#configuracionServicioPrincipal").show();
                } else {
                    $scope.errorTotal = true;
                }
            }, function(error) {

            });
        };

        function validarflags(rpta, idTransaccion) {
            if (flagProductoMovilSession == -1) {
                $scope.errorTotal = true;
                var mensajeAuditoriaFlags = operacionObtenerServicio + "- flagMovil";
                registrarAuditoria(rpta, idTransaccion, null, null, mensajeAuditoriaFlags);
            } else if (flagProductoFijoSession == -1) {
                $scope.errorTotal = true;
                var mensajeAuditoriaFlags = operacionObtenerServicio + "- flagFijo";
                registrarAuditoria(rpta, idTransaccion, null, null, mensajeAuditoriaFlags);
            } else if (flagProductoInternetSession == -1) {
                $scope.errorTotal = true;
                var mensajeAuditoriaFlags = operacionObtenerServicio + "- flagInternet";
                registrarAuditoria(rpta, idTransaccion, null, null, mensajeAuditoriaFlags);
            } else if (flagProductoTvSession == -1) {
                $scope.errorTotal = true;
                var mensajeAuditoriaFlags = operacionObtenerServicio + "- flagTv";
                registrarAuditoria(rpta, idTransaccion, null, null, mensajeAuditoriaFlags);
            } else {
                main();
            }
        }

        function main() {
            if (tipoClienteSession == 1) {
                $scope.divInformacion = true;
                $scope.showBotton = true;
                $scope.nombreAMostrar = $scope.nombreUsuario;
                if (flagProductoMovilSession == 1 || flagProductoMovilSession == 3) {
                    $scope.allServiciosMoviles = true;
                    $scope.showMovilesConsumer = true;
                    cargarServiciosPostpagoConsumer();
                    cargarServiciosPrepagoConsumer();
                }
                if (flagProductoFijoSession == 1 || flagProductoInternetSession == 1 || flagProductoTvSession == 1) {
                    $scope.showAllServiciosFijos = true;
                    cargarAllServiciosFijos();
                }

            } else if (tipoClienteSession == 2) {
                $scope.divInformacion = true;
                $scope.showBotton = true;
                $scope.nombreAMostrar = $scope.razonSocialCoorporativo;
                if (flagProductoMovilSession == 2 || flagProductoMovilSession == 3) {
                    $scope.allServiciosMoviles = true;
                    $scope.showCoorporativoMovil = true;
                    cargarServiciosCoorporativos();
                }
                if (flagProductoFijoSession == 2 || flagProductoInternetSession == 2 || flagProductoTvSession == 2) {
                    $scope.showAllServiciosFijos = true;
                    cargarAllServiciosFijos();
                }
            } else if (tipoClienteSession == 4) {
                $scope.divInformacion = true;
                $scope.showBotton = true;
                $scope.nombreAMostrar = $scope.razonSocialCoorporativo;
                if (flagProductoMovilSession == 1) {
                    $scope.allServiciosMoviles = true;
                    $scope.showMovilesConsumer = true;
                    cargarServiciosPostpagoConsumer();
                    cargarServiciosPrepagoConsumer();
                } else if (flagProductoMovilSession == 2) {
                    $scope.allServiciosMoviles = true;
                    $scope.showCoorporativoMovil = true;
                    cargarServiciosCoorporativos();
                } else if (flagProductoMovilSession == 3) {
                    $scope.allServiciosMoviles = true;
                    $scope.showCoorporativoMovil = true;
                    $scope.showMovilesConsumer = true;
                    cargarServiciosPostpagoConsumer();
                    cargarServiciosPrepagoConsumer();
                    cargarServiciosCoorporativos();
                }
                if (flagProductoFijoSession != 0 || flagProductoInternetSession != 0 || flagProductoTvSession != 0) {
                    $scope.showAllServiciosFijos = true;
                    cargarAllServiciosFijos();
                }
            } else if (tipoClienteSession == 3) {
                $scope.nombreAMostrar = $scope.nombreUsuario;
                if (flagProductoMovilSession == 1) {
                    $scope.allServiciosMoviles = true;
                    $scope.divInformacion = true;
                    $scope.showBotton = true;
                    $scope.showMovilesConsumer = true;
                    cargarServiciosPostpagoConsumer();
                    cargarServiciosPrepagoConsumer();
                } else {
                    $scope.divInformacion = true;
                    $scope.showImformeCliente = false;
                }
            }

        };


        function cargarServiciosPostpagoConsumer() {
            var listaProductoPostpago = '';
            $scope.listProductoPostpago = [];
            $('#loaderimagenPostpago').show();
            var dataPostpago = dataParaEnviar("2", null, null, null, null);
            productoServicio.obtenerProductosPostpago(dataPostpago).then(function(response) {
                var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                var mensajeService = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    listaProductoPostpago = response.data.obtenerServiciosResponse.listadoProductosServicios;
                    if (listaProductoPostpago != '' && listaProductoPostpago != undefined) {
                        if (angular.isArray(listaProductoPostpago)) {
                            $scope.listProductoPostpago = response.data.obtenerServiciosResponse.listadoProductosServicios;
                            angular.forEach($scope.listProductoPostpago, function(val, key) {
                                if (val.ProductoServicioResponse.principal == "true") {
                                    $scope.radioPost = key;
                                }
                            });
                        } else {
                            var listadoProductosServicios = [];
                            listadoProductosServicios.push(listaProductoPostpago);
                            angular.forEach(listadoProductosServicios, function(val, key) {
                                $scope.listProductoPostpago.push(listadoProductosServicios[key]);
                                if (val.ProductoServicioResponse.principal == "true") {
                                    $scope.radioPost = key;
                                }
                            });

                        }
                    } else {
                        $scope.mostrarPostpago = false;
                    }
                    $('#loaderimagenPostpago').hide();
                    $("#loadingPost").remove();
                    guardarConsultadeExito(rpta, "POST", idTransaccion);
                } else {
                    var mesajeOperacion = operacionObtenerServicio + "-" + mensajeService;
                    registrarAuditoria(rpta, idTransaccion, null, "POST", mesajeOperacion);
                    $('#loaderimagenPostpago').hide();
                    $("#loadingPost").remove();
                }
            }, function(error) {
                $scope.erroUlPostpago = true;
                $('#loaderimagenPostpago').hide();
                $("#loadingPost").remove();
            });
        };



        function cargarServiciosPrepagoConsumer() {
            var listaProductoPrepago = '';
            $scope.listProductoPrepago = [];
            $('#loaderimagenPrepago').show();
            var dataPrepago = dataParaEnviar("1", null, null, null, null);
            productoServicio.obtenerProductosPrepago(dataPrepago).then(function(response) {
                var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                var mensajeService = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    listaProductoPrepago = response.data.obtenerServiciosResponse.listadoProductosServicios;
                    if (listaProductoPrepago != '' && listaProductoPrepago != undefined) {
                        if (angular.isArray(listaProductoPrepago)) {
                            $scope.listProductoPrepago = response.data.obtenerServiciosResponse.listadoProductosServicios;
                            angular.forEach($scope.listProductoPrepago, function(val, key) {
                                if (val.ProductoServicioResponse.principal == "true") {
                                    $scope.radioPre = key;
                                }
                            });
                        } else {
                            $scope.listProductoPrepago.push(listaProductoPrepago);
                            angular.forEach($scope.listProductoPrepago, function(val, key) {
                                val
                                if (val.ProductoServicioResponse.principal == "true") {
                                    $scope.radioPre = key;
                                }
                            });
                        }
                    } else {
                        $scope.mostrarPrepago = false;
                    }
                    $('#loaderimagenPrepago').hide();
                    $("#loadingPre").remove();
                    guardarConsultadeExito(rpta, "PREP", idTransaccion);
                } else {
                    var mesajeOperacion = operacionObtenerServicio + "-" + mensajeService;
                    registrarAuditoria(rpta, idTransaccion, null, "PREP", mesajeOperacion);
                    $('#loaderimagenPrepago').hide();
                    $("#loadingPre").remove();
                }
            }, function(error) {
                $scope.erroUlPrepago = true;
                $('#loaderimagenPrepago').hide();
                $("#loadingPre").remove();
            });
        };

        function cargarServiciosCoorporativos() {
            $("#loaderimagenCombosCorporativos").show();
            productoServicio.obtenerProductoPrincipal().then(function(response) {
                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                if (rpta == 0) {
                    var tipoClientePrincipal = response.data.comunResponseType.tipoClienteProductoPrincipal;
                    var categoriaMovil = response.data.comunResponseType.categoria;
                    if (categoriaMovil == "1" && (tipoClientePrincipal == "2" || tipoClientePrincipal == "4")) {
                        var idReciboCoor = response.data.comunResponseType.idRecibo;
                        var idCuentaCoor = response.data.comunResponseType.idCuenta;
                        obtenerCuentas(idCuentaCoor, idReciboCoor, "101");
                    } else {
                        obtenerCuentas(null, null, "102");
                    }

                } else {
                    $('#loaderimagenCombosCorporativos').hide();
                }
            }, function(error) {

            });
        };

        function obtenerCuentas(idCuentaCoor, idReciboCoor, indicador) {
            var listadoCuentasCoorporativas = '';
            var idCuentaDefualt = '';
            productoServicio.obtenerCuentasCoorporativas().then(function(response) {
                var rpta = parseInt(response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idTransaccional;
                var mensajeService = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    listadoCuentasCoorporativas = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta;
                    if (angular.isArray(listadoCuentasCoorporativas)) {
                        $scope.listCuentasCoorporativas = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta;
                        if (indicador == "101") {
                            angular.forEach($scope.listCuentasCoorporativas, function(val, key) {
                                if (val.idCuenta == idCuentaCoor) {
                                    $scope.selectIdCuenta = $scope.listCuentasCoorporativas[key];
                                }
                            });
                        } else {
                            angular.forEach($scope.listCuentasCoorporativas, function(val, key) {
                                $scope.selectIdCuenta = $scope.listCuentasCoorporativas[0];
                                idCuentaDefualt = $scope.listCuentasCoorporativas[0].idCuenta;
                            });
                        }
                    } else {
                        $scope.listCuentasCoorporativas = [];
                        $scope.listCuentasCoorporativas.push(listadoCuentasCoorporativas);
                        if (indicador == "101") {
                            angular.forEach($scope.listCuentasCoorporativas, function(val, key) {
                                if (val.idCuenta == idCuentaCoor) {
                                    $scope.selectIdCuenta = $scope.listCuentasCoorporativas[key];
                                }
                            });
                        } else {
                            angular.forEach($scope.listCuentasCoorporativas, function(val, key) {
                                $scope.selectIdCuenta = $scope.listCuentasCoorporativas[0];
                                idCuentaDefualt = $scope.listCuentasCoorporativas[0].idCuenta;
                            });

                        }
                    }
                    if (indicador == "101") {
                        obtenerRecibos(idCuentaCoor, idReciboCoor, indicador);
                        guardarConsultadeExito(rpta, "CUENTA", idTransaccion);
                    } else {
                        obtenerRecibos(idCuentaDefualt, null, indicador);
                        guardarConsultadeExito(rpta, "CUENTA", idTransaccion);
                    }
                } else {
                    var mesajeOperacion = operacionObtenerCuenta + "-" + mensajeService;
                    registrarAuditoria(rpta, idTransaccion, null, "CUENTA", mesajeOperacion);
                    $('#loaderimagenCombosCorporativos').hide();
                }
            }, function(error) {

            });
        };

        function obtenerRecibos(idCuentaCoor, idReciboCoor, indicador) {
            var idReciboDefault = '';
            var listadoRecibosCoor = '';
            var dataReciboCorporativo = dataReciboEnviar(idCuentaCoor);
            productoServicio.obtenerRecibosCoorporativos(dataReciboCorporativo).then(function(response) {
                var rpta = parseInt(response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idTransaccional;
                var mensajeService = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    listadoRecibosCoor = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo;
                    if (angular.isArray(listadoRecibosCoor)) {
                        $scope.listRecibosCoor = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo;
                        if (indicador == "101") {
                            $scope.showCombosCorporativos = true;
                            angular.forEach($scope.listRecibosCoor, function(val, key) {
                                if (val.idRecibo == idReciboCoor) {
                                    $scope.selectIdRecibo = $scope.listRecibosCoor[key];
                                }
                            });
                        } else {
                            $scope.showCombosCorporativos = true;
                            angular.forEach($scope.listRecibosCoor, function(val, key) {
                                $scope.selectIdRecibo = $scope.listRecibosCoor[0];
                                idReciboDefault = $scope.listRecibosCoor[0].idRecibo;
                            });
                        }
                    } else {
                        $scope.listRecibosCoor = [];
                        $scope.listRecibosCoor.push(listadoRecibosCoor);
                        if (indicador == "101") {
                            $scope.showCombosCorporativos = true;
                            angular.forEach($scope.listRecibosCoor, function(val, key) {
                                if (val.idRecibo == idReciboCoor) {
                                    $scope.selectIdRecibo = $scope.listRecibosCoor[key];
                                }
                            });
                        } else {
                            $scope.showCombosCorporativos = true;
                            angular.forEach($scope.listRecibosCoor, function(val, key) {
                                $scope.selectIdRecibo = $scope.listRecibosCoor[0];
                                idReciboDefault = $scope.listRecibosCoor[0].idRecibo;
                            });
                        }
                    }
                    if (indicador == "101") {
                        getAllProductosCoorporativosxId(idCuentaCoor, idReciboCoor);
                        guardarConsultadeExito(rpta, "RECIBO", idTransaccion);
                    } else {
                        getAllProductosCoorporativosxId(idCuentaCoor, idReciboDefault);
                        guardarConsultadeExito(rpta, "RECIBO", idTransaccion);
                    }
                    $('#loaderimagenCombosCorporativos').hide();
                } else {
                    $scope.errorDivCoorporativo = true;
                    var mesajeOperacion = operacionObtenerRecibo + "-" + mensajeService;
                    registrarAuditoria(rpta, idTransaccion, null, "RECIBO", mesajeOperacion);
                    $('#loaderimagenCombosCorporativos').hide();
                }
            }, function(error) {

            });
        };

        function getAllProductosCoorporativosxId(idCuentaCoor, idReciboCoor) {
            var listadoServiciosCorporativos = '';
            $("#loaderimagenServiciosCoorporativos").show();
            var dataCorporativo = dataParaEnviar("3", idCuentaCoor, idReciboCoor, null, null);
            productoServicio.obtenerProductosCoorporativo(dataCorporativo).then(function(response) {
                var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                var mensajeService = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    listadoServiciosCorporativos = response.data.obtenerServiciosResponse.listadoProductosServicios;
                    if (listadoServiciosCorporativos != '') {
                        if (angular.isArray(listadoServiciosCorporativos)) {
                            var lengthProducCoorporativo = response.data.obtenerServiciosResponse.listadoProductosServicios.length;
                            distribuirServiciosCorporativos(lengthProducCoorporativo, listadoServiciosCorporativos);
                        } else {
                            $scope.listadoProductosServicios = [];
                            $scope.listadoProductosServicios.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                            $scope.ulMayor = response.data.obtenerServiciosResponse;
                            $scope.ulMayor = $scope.listadoProductosServicios;
                            $scope.showSearchCoorpo = true;
                            angular.forEach($scope.listadoProductosServicios, function(val, key) {
                                if (val.ProductoServicioResponse.principal == "true") {
                                    $scope.RadioCoor1 = key;
                                }
                            });
                        }
                    } else {
                        $("#loaderimagenServiciosCoorporativos").hide();
                        guardarConsultadeExito(rpta, "SERCORP", idTransaccion);
                    }
                    $("#loaderimagenServiciosCoorporativos").hide();
                    guardarConsultadeExito(rpta, "SERCORP", idTransaccion);
                } else {
                    var mesajeOperacion = operacionObtenerServicio + "-" + mensajeService;
                    registrarAuditoria(rpta, idTransaccion, null, "SERCORP", mesajeOperacion);
                    $("#loaderimagenServiciosCoorporativos").hide();
                }
            }, function(error) {

            });
        };

        function distribuirServiciosCorporativos(lengthProducCoorporativo, listPrimeroCinco) {
            limpiarxCriterios();
            $scope.showSearchCoorpo = true;
            if (lengthProducCoorporativo < 5) {
                angular.forEach(listPrimeroCinco, function(val, key) {
                    $scope.ulMayor.push(listPrimeroCinco[key]);
                    if (val.ProductoServicioResponse.principal == "true") {
                        $scope.RadioCoor1 = key;
                    }
                });
            } else {
                for (i = 0; i < 5; i++) {
                    $scope.ulMayor.push(listPrimeroCinco[i]);
                }
                angular.forEach($scope.ulMayor, function(val, key) {
                    if (val.ProductoServicioResponse.principal == "true") {
                        $scope.RadioCoor1 = key;
                    }
                });
                for (j = 5; j < lengthProducCoorporativo; j++) {
                    $scope.ulMenor.push(listPrimeroCinco[j]);
                }
                angular.forEach($scope.ulMenor, function(val, key) {
                    if (val.ProductoServicioResponse.principal == "true") {
                        $scope.RadioCoor2 = key;
                    }
                });
            }
            $("#loaderimagenServiciosCoorporativos").hide();
        };

        this.obtenerServiciosCoorporativos = function() {
            obtenerServiciosCoorporativosRefresh();
        };

        function obtenerServiciosCoorporativosRefresh() {
            if ($scope.selectIdRecibo !== null) {
                objExito.flagServicios = null;
                $scope.inputBuscar = '';
                $scope.valorReciboDefault = '';
                limpiarProducCoor();
                var idCuentaSeleccionada = $scope.selectIdCuenta.idCuenta;
                var idReciboSeleccionado = $scope.selectIdRecibo.idRecibo;
                getAllProductosCoorporativosxId(idCuentaSeleccionada, idReciboSeleccionado);
            } else {
                if ($scope.valorReciboDefault == '' || $scope.valorReciboDefault == undefined) {
                    $scope.valorReciboDefault = 'Seleccione Recibo';
                }
                $("#loaderimagenCombosCorporativos").hide();
                limpiarProducCoor();
            }
        };

        this.obtenerServiciosxRecibo = function() {
            if ($scope.selectIdCuenta !== null) {
                objExito.flagRecibo = null;
                objExito.flagServicios = null;
                $scope.inputBuscar = '';
                $scope.showCombosCorporativos = false;
                $scope.showSearchCoorpo = false;
                $scope.valorCuentaDefault = '';
                $scope.valorReciboDefault = '';
                limpiarCombosRecibos();
                var idCuentaSeleccionada = $scope.selectIdCuenta.idCuenta;
                obtenerRecibos(idCuentaSeleccionada, null, "103");
            } else {
                $scope.listRecibosCoor = []
                limpiarCombosRecibos("0");
            }
        };

        function cargarAllServiciosFijos() {
            var listaServiciosFijos = '';
            $("#loaderimagenFijo").show();
            if (tipoClienteSession == 1) {
                var dataFija = dataParaEnviar("4", null, null, null, null);
                productoServicio.obtenerProductosFijos(dataFija).then(function(response) {
                    var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
                    var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                    var mensajeService = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
                    if (rpta == 0) {
                        listaServiciosFijos = response.data.obtenerServiciosResponse.listadoProductosServicios;
                        if (angular.isArray(listaServiciosFijos)) {
                            var lengthAllFijos = response.data.obtenerServiciosResponse.listadoProductosServicios.length;
                            var listAllNumFijos = response.data.obtenerServiciosResponse.listadoProductosServicios;
                            if (lengthAllFijos < 10) {
                                $scope.showConsumerFija = true;
                                distribuirServiciosFijos(lengthAllFijos, listAllNumFijos);
                                $("#loaderimagenFijo").hide();
                                guardarConsultadeExito(rpta, "FIJO-0", idTransaccion);
                            } else {
                                guardarConsultadeExito(rpta, "FIJO-1", idTransaccion);
                                getObtenerProductoPrincipalFijo();
                            }
                        } else {
                            $scope.showConsumerFija = true;
                            $scope.showListFijos = true;
                            var listadoProductosServicios = [];
                            listadoProductosServicios.push(listaServiciosFijos);
                            angular.forEach(listadoProductosServicios, function(val, key) {
                                $scope.ulMayorFijo.push(listadoProductosServicios[key]);
                                if (val.ProductoServicioResponse.principal == "true") {
                                    $scope.RadioFijo1 = key;
                                }
                            });
                            $("#loaderimagenFijo").hide();
                        }
                    } else {
                        var mesajeOperacion = operacionObtenerServicio + "-" + mensajeService;
                        registrarAuditoria(rpta, idTransaccion, null, "FIJO-0", mesajeOperacion);
                        $("#loaderimagenFijo").hide();
                    }
                }, function(error) {

                });
            } else {
                getObtenerProductoPrincipalFijo();
            }
        };

        function getObtenerProductoPrincipalFijo() {
            productoServicio.obtenerProductoPrincipal().then(function(response) {
                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                if (rpta == 0) {
                    var idDireccionPrincipal = response.data.comunResponseType.idDireccion;
                    var categoriaFija = response.data.comunResponseType.categoria;
                    if (categoriaFija == 2 || categoriaFija == 3 || categoriaFija == 4) {
                        obtenerDireccionesFijas(idDireccionPrincipal, "301");
                    } else {
                        obtenerDireccionesFijas(null, "302");
                    }
                } else {
                    $("#loaderimagenFijo").hide();
                }
            }, function(error) {

            });
        };

        function obtenerDireccionesFijas(idDireccionPrincipal, indicadorFija) {
            var idDireccionFija = '';
            var listadoDireccionesFija = '';
            var dataListDir = dataDireccionEnviar();
            productoServicio.obtenerDireccionesFija(dataListDir).then(function(response) {
                var rpta = parseInt(response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idTransaccional;
                var mensajeService = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    $scope.showConsumerFija = true;
                    $scope.showBusquedaDirecciones = true;
                    listadoDireccionesFija = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;
                    if (angular.isArray(listadoDireccionesFija)) {
                        $scope.listDireccionesFija = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;
                        if (indicadorFija == "301") {
                            angular.forEach($scope.listDireccionesFija, function(val, key) {
                                if (val.idDireccion == idDireccionPrincipal) {
                                    $scope.selectIdDireccion = $scope.listDireccionesFija[key];
                                }
                            });
                        } else {
                            angular.forEach($scope.listDireccionesFija, function(val, key) {
                                $scope.selectIdDireccion = $scope.listDireccionesFija[0];
                                idDireccionFija = $scope.listDireccionesFija[0].idDireccion;
                            });
                        }
                    } else {
                        $scope.listDireccionesFija = [];
                        $scope.listDireccionesFija.push(listadoDireccionesFija);
                        if (indicadorFija == "301") {
                            angular.forEach($scope.listDireccionesFija, function(val, key) {
                                if (val.idDireccion == idDireccionPrincipal) {
                                    $scope.selectIdDireccion = $scope.listDireccionesFija[key];
                                }
                            });
                        } else {
                            angular.forEach($scope.listDireccionesFija, function(val, key) {
                                $scope.selectIdDireccion = $scope.listDireccionesFija[0];
                                idDireccionFija = $scope.listDireccionesFija[0].idDireccion;
                            });
                        }
                    }
                    $("#loaderimagenFijo").hide();
                    if (indicadorFija == "301") {
                        getAllProductosFijosxId(idDireccionPrincipal);
                        guardarConsultadeExito(rpta, "FIJO-3", idTransaccion);
                    } else {
                        getAllProductosFijosxId(idDireccionFija);
                        guardarConsultadeExito(rpta, "FIJO-3", idTransaccion);
                    }
                } else {
                    var mesajeOperacion = operacionObtenerDireccion + "-" + mensajeService;
                    registrarAuditoria(rpta, idTransaccion, null, "FIJO-3", mesajeOperacion);
                    $("#loaderimagenFijo").hide();
                }
            }, function(error) {

            });
        };

        function getAllProductosFijosxId(idDireccionPrincipal) {
            $("#loaderimagenServiciosFijos").show();
            var listadoServiciosFijos = '';
            var dataFijaxId = dataParaEnviar("5", null, null, idDireccionPrincipal, null);
            productoServicio.obtenerProductosFijos(dataFijaxId).then(function(response) {
                var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                var mensajeService = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    listadoServiciosFijos = response.data.obtenerServiciosResponse.listadoProductosServicios;
                    if (angular.isArray(listadoServiciosFijos)) {
                        var lengthAllFijos = response.data.obtenerServiciosResponse.listadoProductosServicios.length;
                        var listAllNumFijos = response.data.obtenerServiciosResponse.listadoProductosServicios;
                        distribuirServiciosFijos(lengthAllFijos, listAllNumFijos);

                    } else {
                        $scope.showListFijos = true;
                        var listadoProductosServicios = [];
                        listadoProductosServicios.push(listadoServiciosFijos);
                        angular.forEach(listadoProductosServicios, function(val, key) {
                            $scope.ulMayorFijo.push(listadoProductosServicios[key]);
                            if (val.ProductoServicioResponse.principal == "true") {
                                $scope.RadioFijo1 = key;
                            }
                        });
                        $("#loaderimagenServiciosFijos").hide();
                    }
                    guardarConsultadeExito(rpta, "FIJO-4", idTransaccion);
                } else {
                    var mesajeOperacion = operacionObtenerServicio + "-" + mensajeService;
                    registrarAuditoria(rpta, idTransaccion, null, "FIJO-4", mesajeOperacion);
                    $("#loaderimagenServiciosFijos").hide();
                }
            }, function(error) {

            });
        };

        function distribuirServiciosFijos(lengthAllFijos, listAllNumFijos) {
            $scope.showListFijos = true;
            if (lengthAllFijos < 5) {
                angular.forEach(listAllNumFijos, function(val, key) {
                    $scope.ulMayorFijo.push(listAllNumFijos[key]);
                    if (val.ProductoServicioResponse.principal == "true") {
                        $scope.RadioFijo1 = key;
                    }
                });
            } else {
                for (i = 0; i < 5; i++) {
                    $scope.ulMayorFijo.push(listAllNumFijos[i]);
                }
                angular.forEach($scope.ulMayorFijo, function(val, key) {
                    if (val.ProductoServicioResponse.principal == "true") {
                        $scope.RadioFijo1 = key;
                    }
                });
                for (j = 5; j < lengthAllFijos; j++) {
                    $scope.ulMenorFijo.push(listAllNumFijos[j]);
                    $scope.showUlMenorFijo = "true";
                }
                angular.forEach($scope.ulMenorFijo, function(val, key) {
                    if (val.ProductoServicioResponse.principal == "true") {
                        $scope.RadioFijo2 = key;
                    }
                });
            }
            $("#loaderimagenServiciosFijos").hide();
        };

        this.buscarServicesFijos = function() {
            limpiarProductosFijos();
            if ($scope.selectIdDireccion !== null) {
                objExito.flagFija_4 = null;
                $scope.errorDivServiciosFijos = false;
                $scope.valorDireccionDefault = '';
                var idDireccionSeleccionada = $scope.selectIdDireccion.idDireccion;
                getAllProductosFijosxId(idDireccionSeleccionada);

            } else {
                limpiarProductosFijos();
                $scope.valorDireccionDefault = 'Seleccionar dirección';
            }
        };

        $scope.guardarServicioPrincipal = function() {
            if ($scope.selected !== '') {
                var tipoClienteGuardar = $scope.selected.ProductoServicioResponse.tipoCliente;
                var categoriaGuardar = $scope.selected.ProductoServicioResponse.categoria;
                var idServicioGuardar = $scope.selected.ProductoServicioResponse.idProductoServicio;
                var idCuentaGuardar = $scope.selected.ProductoServicioResponse.idCuenta;
                var idReciboGuardar = $scope.selected.ProductoServicioResponse.idRecibo;
                var idDireccionGuardar = $scope.selected.ProductoServicioResponse.idDireccion;
                var dataGuardarPrincipal = dataAguardar(tipoClienteGuardar, categoriaGuardar, idServicioGuardar, idCuentaGuardar, idReciboGuardar, idDireccionGuardar);
                $("#idErrorGuardarServicio").empty();
                productoServicio.guardarServicioPrincipal(dataGuardarPrincipal).then(function(response) {
                    var rpta = parseInt(response.data.guardarServicioPrincipalResponse.defaultServiceResponse.idRespuesta);
                    var idTransaccion = response.data.guardarServicioPrincipalResponse.defaultServiceResponse.idTransaccional;
                    var mensajeService = response.data.guardarServicioPrincipalResponse.defaultServiceResponse.mensaje;
                    if (rpta == 0) {
                        var result = response.data.guardarServicioPrincipalResponse.resultado;
                        var urlConfigurar = '/wps/myportal/cuentasclaro/tucuenta';
                        $window.location.href = urlConfigurar;
                        registrarAuditoria(rpta, idTransaccion, "202", null);
                    } else {
                        if (tipoClienteSession == 1) {
                            var msjGuardarServiciosConsumer = '<br><p class="error-server1"><strong>' + WPSMensajeError.upps + '</strong>' + WPSMensajeError.mensaje1 + WPSMensajeError.mensaje2 + WPSMensajeError.mensaje3 + WPSMensajeError.mensaje5 + '</p>';
                            $("#idErrorGuardarServicio").append(msjGuardarServiciosConsumer);
                        } else {
                            var mesjGuardarServiciosOtros = '<br><p class="error-server1"><strong>' + WPSMensajeError.upps + '</strong>' + WPSMensajeError.mensaje1 + WPSMensajeError.mensaje2 + WPSMensajeError.mensaje4 + WPSMensajeError.mensaje5 + '</p>';
                            $("#idErrorGuardarServicio").append(mesjGuardarServiciosOtros);
                        }
                        var mesajeOperacion = operacionGuardarServicio + "-" + mensajeService;
                        registrarAuditoria(rpta, idTransaccion, "202", null, mesajeOperacion);
                    }
                }, function(error) {});

            } else {
                var urlConfigurar = '/wps/myportal/cuentasclaro/tucuenta';
                $window.location.href = urlConfigurar;
            }
        };

        function dataAguardar(tipoClienteGuardar, categoriaGuardar, idServicioGuardar, idCuentaGuardar, idReciboGuardar, idDireccionGuardar) {
            var requestGuardarSerPrincipal = {
                "categoria": null,
                "idCuenta": null,
                "idRecibo": null,
                "idDireccion": null,
                "idProductoServicio": null
            }
            if (categoriaGuardar == "1") {
                if (tipoClienteGuardar == 1) {
                    requestGuardarSerPrincipal.idProductoServicio = idServicioGuardar;
                    requestGuardarSerPrincipal.categoria = categoriaGuardar;
                } else if (tipoClienteGuardar == 2) {
                    requestGuardarSerPrincipal.categoria = categoriaGuardar;
                    requestGuardarSerPrincipal.idCuenta = idCuentaGuardar;
                    requestGuardarSerPrincipal.idRecibo = idReciboGuardar;
                    requestGuardarSerPrincipal.idProductoServicio = idServicioGuardar;
                }
            } else {
                requestGuardarSerPrincipal.idProductoServicio = idServicioGuardar;
                requestGuardarSerPrincipal.categoria = categoriaGuardar;
                requestGuardarSerPrincipal.idDireccion = idDireccionGuardar;
            }

            dataGuardar = $httpParamSerializer({ requestJson: angular.toJson(requestGuardarSerPrincipal) });
            return dataGuardar;
        };

        this.clickPost = function(index) {
            if ($scope.radioPre !== '') {
                $scope.radioPre = 'checkradio'
            }
            if ($scope.RadioCoor1 !== '') {
                $scope.RadioCoor1 = 'checkradio'
            }
            if ($scope.RadioCoor2 !== '') {
                $scope.RadioCoor2 = 'checkradio'
            }
            if ($scope.RadioFijo1 !== '') {
                $scope.RadioFijo1 = 'checkradio'
            }
            if ($scope.RadioFijo2 !== '') {
                $scope.RadioFijo2 = 'checkradio'
            }

            $scope.radioPost = index;
        };

        this.clickPre = function(index2) {
            if ($scope.radioPost !== '') {
                $scope.radioPost = 'checkradio'
            }
            if ($scope.RadioCoor1 !== '') {
                $scope.RadioCoor1 = 'checkradio'
            }
            if ($scope.RadioCoor2 !== '') {
                $scope.RadioCoor2 = 'checkradio'
            }
            if ($scope.RadioFijo1 !== '') {
                $scope.RadioFijo1 = 'checkradio'
            }
            if ($scope.RadioFijo2 !== '') {
                $scope.RadioFijo2 = 'checkradio'
            }
            $scope.radioPre = index2;
        };

        this.clickCoor1 = function(index3) {
            if ($scope.radioPre !== '') {
                $scope.radioPre = 'checkradio'
            }
            if ($scope.radioPost !== '') {
                $scope.radioPost = 'checkradio'
            }
            if ($scope.RadioCoor2 !== '') {
                $scope.RadioCoor2 = 'checkradio'
            }
            if ($scope.RadioFijo1 !== '') {
                $scope.RadioFijo1 = 'checkradio'
            }
            if ($scope.RadioFijo2 !== '') {
                $scope.RadioFijo2 = 'checkradio'
            }
            $scope.RadioCoor1 = index3;
        };

        this.clickCoor2 = function(index4) {
            if ($scope.radioPre !== '') {
                $scope.radioPre = 'checkradio'
            }
            if ($scope.radioPost !== '') {
                $scope.radioPost = 'checkradio'
            }
            if ($scope.RadioCoor1 !== '') {
                $scope.RadioCoor1 = 'checkradio'
            }
            if ($scope.RadioFijo1 !== '') {
                $scope.RadioFijo1 = 'checkradio'
            }
            if ($scope.RadioFijo2 !== '') {
                $scope.RadioFijo2 = 'checkradio'
            }
            $scope.RadioCoor2 = index4;
        };

        this.clickFijo1 = function(index5) {
            if ($scope.radioPre !== '') {
                $scope.radioPre = 'checkradio'
            }
            if ($scope.radioPost !== '') {
                $scope.radioPost = 'checkradio'
            }
            if ($scope.RadioCoor1 !== '') {
                $scope.RadioCoor1 = 'checkradio'
            }
            if ($scope.RadioCoor2 !== '') {
                $scope.RadioCoor2 = 'checkradio'
            }
            if ($scope.RadioFijo2 !== '') {
                $scope.RadioFijo2 = 'checkradio'
            }
            $scope.RadioFijo1 = index5;
        };

        this.clickFijo2 = function(index6) {
            if ($scope.radioPre !== '') {
                $scope.radioPre = 'checkradio'
            }
            if ($scope.radioPost !== '') {
                $scope.radioPost = 'checkradio'
            }
            if ($scope.RadioCoor1 !== '') {
                $scope.RadioCoor1 = 'checkradio'
            }
            if ($scope.RadioCoor2 !== '') {
                $scope.RadioCoor2 = 'checkradio'
            }
            if ($scope.RadioFijo1 !== '') {
                $scope.RadioFijo1 = 'checkradio'
            }
            $scope.RadioFijo2 = index6;
        };

        function limpiarCombosRecibos(limpiar) {
            if (limpiar == "0") {
                $scope.valorCuentaDefault = 'Seleccione Cuenta';
                $scope.valorReciboDefault = 'Seleccione Recibo';
            }

            if ($scope.RadioCoor1 !== '') {
                $scope.RadioCoor1 = 'checkradio'
            }
            if ($scope.RadioCoor2 !== '') {
                $scope.RadioCoor2 = 'checkradio'
            }
            $scope.ulMayor = [];
            $scope.ulMenor = [];

        };

        function limpiarProducCoor() {
            if ($scope.RadioCoor1 !== '') {
                $scope.RadioCoor1 = 'checkradio'
            }
            if ($scope.RadioCoor2 !== '') {
                $scope.RadioCoor2 = 'checkradio'
            }
            $scope.ulMayor = [];
            $scope.ulMenor = [];
        };

        function limpiarProductosFijos() {

            if ($scope.RadioFijo1 !== '') {
                $scope.RadioFijo1 = 'checkradio'
            }
            if ($scope.RadioFijo2 !== '') {
                $scope.RadioFijo2 = 'checkradio'
            }
            $scope.ulMayorFijo = [];
            $scope.ulMenorFijo = [];
        }

        function limpiarxCriterios() {
            $scope.ulMayor = [];
            $scope.ulMenor = [];
        };

        function dataParaEnviar(indicador, idCuentaCoor, idReciboCoor, idDireccion, criterioBusqueda) {
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
            if (indicador == "2") {
                requestServiciosMoviles.tipoLinea = tipoLineaPostpago;
                requestServiciosMoviles.categoria = categoriaMovil;
                requestServiciosMoviles.tipoCliente = tipoClienteConsumer;
            } else if (indicador == "1") {
                requestServiciosMoviles.tipoLinea = tipoLineaPrepago;
                requestServiciosMoviles.categoria = categoriaMovil;
                requestServiciosMoviles.tipoCliente = tipoClienteConsumer;
            } else if (indicador == "3") {
                requestServiciosMoviles.tipoLinea = tipoLineaPostpago;
                requestServiciosMoviles.categoria = categoriaMovil;
                requestServiciosMoviles.idCuenta = idCuentaCoor;
                requestServiciosMoviles.idRecibo = idReciboCoor;
                requestServiciosMoviles.tipoCliente = tipoClienteCorporativo;
            } else if (indicador == "4") {
                requestServiciosMoviles.tipoLinea = tipoLineaTodos;
                requestServiciosMoviles.categoria = categoriaTodos;
                if (tipoClienteSession == 1) {
                    requestServiciosMoviles.tipoCliente = tipoClienteConsumer;
                } else if (tipoClienteSession == 2) {
                    requestServiciosMoviles.tipoCliente = tipoClienteCorporativo;
                } else if (tipoClienteSession == 4) {
                    requestServiciosMoviles.tipoCliente = tipoClienteMix;
                }
            } else if (indicador == "5") {
                requestServiciosMoviles.idDireccion = idDireccion;
                requestServiciosMoviles.tipoLinea = tipoLineaTodos;
                requestServiciosMoviles.categoria = categoriaTodos;
                if (tipoClienteSession == 1) {
                    requestServiciosMoviles.tipoCliente = tipoClienteConsumer;
                } else if (tipoClienteSession == 2) {
                    requestServiciosMoviles.tipoCliente = tipoClienteCorporativo;
                } else if (tipoClienteSession == 4) {
                    requestServiciosMoviles.tipoCliente = tipoClienteMix;
                }
            } else if (indicador == "6") {
                requestServiciosMoviles.tipoCliente = tipoClienteCorporativo;
                requestServiciosMoviles.categoria = categoriaMovil;
                requestServiciosMoviles.tipoLinea = tipoLineaPostpago;
                requestServiciosMoviles.nombreProducto = criterioBusqueda;
            } else if (indicador == "7") {
                requestServiciosMoviles.tipoCliente = tipoClienteCorporativo;
                requestServiciosMoviles.categoria = categoriaMovil;
                requestServiciosMoviles.tipoLinea = tipoLineaPostpago;
                requestServiciosMoviles.idProductoServicio = criterioBusqueda;
            }
            requestServiciosMoviles.tipoPermiso = tipoPermisoAll;
            requestServiciosMoviles.pagina = pagina;
            requestServiciosMoviles.cantResultadosPagina = cantResultadosPagina;
            requestServiciosMoviles.productoPrincipalXidRecibo = false;
            requestServiciosMoviles.titularidadServicio = titularidadServicio;

            if (indicador == "4" || indicador == "5") {
                return dataServiciosMoviles = $httpParamSerializer({ requestJson: angular.toJson(requestServiciosMoviles), tipoConsulta: '1' });
            } else {
                dataServiciosMoviles = $httpParamSerializer({ requestJson: angular.toJson(requestServiciosMoviles) });
                return dataServiciosMoviles;
            }
        };

        function dataReciboEnviar(idCuentaCoor) {
            var requestReciboCoor = {
                "idCuenta": null
            };
            requestReciboCoor.idCuenta = idCuentaCoor;
            dataReciboCoor = $httpParamSerializer({ requestJson: angular.toJson(requestReciboCoor) });
            return dataReciboCoor;
        };

        function dataDireccionEnviar() {
            var requestDirFijo = {
                "tipoCliente": null
            }
            requestDirFijo.tipoCliente = tipoClienteFiltros;
            dataListDir = $httpParamSerializer({ requestJson: angular.toJson(requestDirFijo) });
            return dataListDir;
        }

        function dataAutocomplete(valorinput) {
            var requestAutocompletar = {
                "tipoLinea": null,
                "tipoCliente": null,
                "tipoPermiso": 1,
                "idCuenta": null,
                "idRecibo": null,
                "criterioBusqueda": null,
                "pagina": null,
                "cantResultadosPagina": null,
                "titularidadServicio": 1
            }
            requestAutocompletar.tipoLinea = WPSTipoLinea.postpago;
            requestAutocompletar.tipoCliente = WPSTipoCliente.corporativo;;
            requestAutocompletar.criterioBusqueda = valorinput;
            requestAutocompletar.pagina = WPSpaginacion.pagina;
            requestAutocompletar.cantResultadosPagina = WPSpaginacion.cantResultadosPagina;
            dataAuto = $httpParamSerializer({ requestJson: angular.toJson(requestAutocompletar) });
            return dataAuto;
        }

        function buscarxCriterio(criterio, indicador) {
            $("#loaderimagenServiciosCoorporativos").show();
            $scope.errorDivCorServicios = false;
            limpiarxCriterios();
            var dataCriterio = dataParaEnviar(indicador, null, null, null, criterio);
            productoServicio.obtenerServiciosxCriterio(dataCriterio).then(function(response) {
                var rpta = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
                if (rpta == 0) {
                    var datosArrayCoor = response.data.obtenerServiciosResponse.listadoProductosServicios;
                    if (datosArrayCoor != '' && datosArrayCoor != undefined) {
                        $scope.ulMayor.push(datosArrayCoor);
                        angular.forEach($scope.ulMayor, function(val, key) {
                            if (val.ProductoServicioResponse.principal == "true") {
                                $scope.RadioCoor1 = key;
                            }
                        });
                        $("#loaderimagenServiciosCoorporativos").hide();
                    } else {
                        $("#loaderimagenServiciosCoorporativos").hide();
                    }

                } else if (rpta > 0) {
                    $scope.errorDivCorServicios = true;
                    $("#loaderimagenServiciosCoorporativos").hide();
                } else {
                    $("#loaderimagenServiciosCoorporativos").hide();
                }
            }, function(error) {

            });
        };

        $scope.buscarOnCliclOnEnter = function() {
            var valorinput = $('#autocomplete-linea-principal').val();
            buscarxCriterio(valorinput, "6");
            $scope.disabledInput = false;
        };

        function obtenerServiciosAutocomplete(done) {
            var valorinput = $('#autocomplete-linea-principal').val();
            var listaAutocomplete = '';
            var dataServAutocomplete = dataAutocomplete(valorinput);
            var arrayAutocomplete = [];
            productoServicio.obtenerServiciosAutocompletar(dataServAutocomplete).then(function(response) {
                var rptaExito = response.data.obtenerListadoMovilesResponse.defaultServiceResponse.idRespuesta;
                if (rptaExito == 0) {
                    listaAutocomplete = response.data.obtenerListadoMovilesResponse.listadoProductosServicios;
                    if (listaAutocomplete != '' && listaAutocomplete != undefined) {
                        if (angular.isArray(listaAutocomplete)) {
                            angular.forEach(listaAutocomplete, function(val, key) {
                                arrayAutocomplete.push({
                                    value: val.nombreAlias,
                                    data: val.idProductoServicio
                                });
                            });
                            var result = {
                                suggestions: arrayAutocomplete
                            };
                            done(result);
                        } else {
                            var arrayObjetAutocomplete = [];
                            arrayObjetAutocomplete.push(listaAutocomplete);
                            angular.forEach(arrayObjetAutocomplete, function(val, key) {
                                arrayAutocomplete.push({
                                    value: val.nombreAlias,
                                    data: val.idProductoServicio
                                });
                            });
                            var result = {
                                suggestions: arrayAutocomplete
                            };
                            done(result);
                        }
                    }
                } else if (rptaExito > 0) {

                }
            }, function(error) {

            });
        };

        function renderAutocomplete() {
            $('#autocomplete-linea-principal').autocomplete({
                lookup: function(query, done) {
                    obtenerServiciosAutocomplete(done);
                },
                minChars: 4,
                onSelect: function(suggestion) {
                    var idDataServicio = suggestion.data;
                    buscarxCriterio(idDataServicio, "7");
                }
            });
        };

        $scope.onBlur = function() {
            $scope.disabledInput = false;
        };

        $scope.refreshPortlet = function(indicadorError) {
            if (indicadorError == '1') {
                $scope.erroUlPostpago = false;
                cargarServiciosPostpagoConsumer();
            } else if (indicadorError == '2') {
                $scope.erroUlPrepago = false;
                cargarServiciosPrepagoConsumer();
            } else if (indicadorError == '3') {
                $scope.errorDivCoorporativo = false;
                cargarServiciosCoorporativos();
            } else if (indicadorError == '4') {
                $scope.errorDivCorServicios = false;
                obtenerServiciosCoorporativosRefresh();
            } else if (indicadorError == '5') {
                $scope.errorDivFijos = false;
                cargarAllServiciosFijos();
            } else if (indicadorError == '6') {
                buscarServicesFijos();
            }

        };

        function dataAuditoriaRequest(idTransaccion, operation, estadoAuditoria, mensajeAuditoria) {
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
                responseType: 'null'
            }
            requestAuditoria.operationCode = operation;
            requestAuditoria.pagina = pageId;
            requestAuditoria.transactionId = idTransaccion;
            requestAuditoria.estado = estadoAuditoria;
            requestAuditoria.servicio = servicioAuditoria;
            requestAuditoria.tipoProducto = tipoProductoMovil;
            requestAuditoria.tipoLinea = tipoLineaAuditoria;
            requestAuditoria.tipoUsuario = tipoClienteSession;
            requestAuditoria.perfil = perfilAuditoria;
            requestAuditoria.monto = '';
            requestAuditoria.descripcionoperacion = mensajeAuditoria;
            requestAuditoria.responseType = '/';

            dataAuditoria = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });
            return dataAuditoria;
        };

        function guardarConsultadeExito(rpta, transaccion, idTransaccion) {
            if (tipoClienteSession == 1) {
                if (transaccion == "POST") {
                    objExito.flagConsultaPostpago = rpta;
                } else if (transaccion == "PREP") {
                    objExito.flagConsultaPrepago = rpta;
                } else if (transaccion == "FIJO-0") {
                    objExito.flagFija_0 = rpta;
                } else if (transaccion == "FIJO-1") {
                    objExito.flagFija_1 = rpta;
                } else if (transaccion == "FIJO-3") {
                    objExito.flagFija_3 = rpta;
                } else if (transaccion == "FIJO-4") {
                    objExito.flagFija_4 = rpta;
                }
                if (objExito.flagConsultaPostpago == 0 && objExito.flagConsultaPrepago == 0 && objExito.flagFija_0 == 0) {
                    registrarAuditoria(rpta, idTransaccion, null, null, null);
                } else if (objExito.flagConsultaPostpago == 0 && objExito.flagConsultaPrepago == 0 && objExito.flagFija_1 == 0 && objExito.flagFija_3 == 0 && objExito.flagFija_4 == 0) {
                    registrarAuditoria(rpta, idTransaccion, null, null, null);
                }
            } else if (tipoClienteSession == 2) {
                if (transaccion == "CUENTA") {
                    objExito.flagCuenta = rpta;
                } else if (transaccion == "RECIBO") {
                    objExito.flagRecibo = rpta;
                } else if (transaccion == "SERCORP") {
                    objExito.flagServicios = rpta;
                } else if (transaccion == "FIJO-3") {
                    objExito.flagFija_3 = rpta;
                } else if (transaccion == "FIJO-4") {
                    objExito.flagFija_4 = rpta;
                }
                if (objExito.flagCuenta === 0 && objExito.flagRecibo === 0 && objExito.flagServicios === 0 && objExito.flagFija_3 == 0 && objExito.flagFija_4 == 0) {
                    registrarAuditoria(rpta, idTransaccion, null, null, null);
                }
            } else if (tipoClienteSession == 3) {
                if (transaccion == "POST") {
                    objExito.flagConsultaPostpago = rpta;
                } else if (transaccion == "PREP") {
                    objExito.flagConsultaPrepago = rpta;
                }

                if (objExito.flagConsultaPostpago == 0 && objExito.flagConsultaPrepago == 0) {
                    registrarAuditoria(rpta, idTransaccion, null, null, null);
                }
            } else {
                if (transaccion == "POST") {
                    objExito.flagConsultaPostpago = rpta;
                } else if (transaccion == "PREP") {
                    objExito.flagConsultaPrepago = rpta;
                } else if (transaccion == "CUENTA") {
                    objExito.flagCuenta = rpta;
                } else if (transaccion == "RECIBO") {
                    objExito.flagRecibo = rpta;
                } else if (transaccion == "SERCORP") {
                    objExito.flagServicios = rpta;
                } else if (transaccion == "FIJO-3") {
                    objExito.flagFija_3 = rpta;
                } else if (transaccion == "FIJO-4") {
                    objExito.flagFija_4 = rpta;
                }
                if (objExito.flagConsultaPostpago === 0 && objExito.flagConsultaPrepago == 0 && objExito.flagCuenta == 0 && objExito.flagRecibo == 0 && objExito.flagServicios == 0 && objExito.flagFija_3 == 0 && objExito.flagFija_4 == 0) {
                    registrarAuditoria(rpta, idTransaccion, null, null, null);
                }
            }
        };

        function registrarAuditoria(rpta, idTransaccion, indicador, operacion, mensajeAuditoria) {
            if (operacion == "POST" && (rpta < 0 || rpta > 0)) {
                $scope.erroUlPostpago = true;
            } else if (operacion == "PREP" && (rpta < 0 || rpta > 0)) {
                $scope.erroUlPrepago = true;
            } else if (operacion == "CUENTA" && (rpta < 0 || rpta > 0)) {
                $scope.errorDivCoorporativo = true;
            } else if (operacion == "RECIBO" && (rpta < 0 || rpta > 0)) {
                $scope.errorDivCoorporativo = true;
            } else if (operacion == "SERCORP" && (rpta < 0 || rpta > 0)) {
                $scope.errorDivCorServicios = true;
                $scope.showSearchCoorpo = false;
            } else if (operacion == "FIJO-0" && (rpta < 0 || rpta > 0)) {
                $scope.errorDivFijos = true;
            } else if (operacion == "FIJO-3" && (rpta < 0 || rpta > 0)) {
                $scope.errorDivFijos = true;
            } else if (operacion == "FIJO-4" && (rpta < 0 || rpta > 0)) {
                $scope.showListFijos = false;
                $scope.errorDivServiciosFijos = true;
            }

            if (rpta == 0) {
                if (indicador == "202") {
                    guardarAuditoria(idTransaccion, operationcodeAsignar, estadoExito, "-");
                } else {
                    guardarAuditoria(idTransaccion, operationcodeConsulta, estadoExito, "-");
                }
            } else if (rpta > 0 || rpta < 0) {
                if (indicador == "202") {
                    guardarAuditoria(idTransaccion, operationcodeAsignar, estadoError, mensajeAuditoria);
                } else {
                    guardarAuditoria(idTransaccion, operationcodeConsulta, estadoError, mensajeAuditoria);
                }
            }

            if (tipoClienteSession == 1) {
                $scope.textoConsumer = WPSMensajeError.mensaje3;
                $scope.textoFija = WPSMensajeError.mensaje3;
            } else if (tipoClienteSession == 2) {
                $scope.textoCorporativo = WPSMensajeError.mensaje4;
                $scope.textoFija = WPSMensajeError.mensaje4;
            } else {
                $scope.textoConsumer = WPSMensajeError.mensaje3;
                $scope.textoCorporativo = WPSMensajeError.mensaje4;
                $scope.textoFija = WPSMensajeError.mensaje4;
            }
        };

        function guardarAuditoria(idTransaccion, operation, estadoAuditoria, mensajeAuditoria) {
            var dataAuditoriaMovil = dataAuditoriaRequest(idTransaccion, operation, estadoAuditoria, mensajeAuditoria);
            productoServicio.guardarAuditoria(dataAuditoriaMovil).then(function(response) {}, function(error) {

            });
        };

    }
]);
appController.directive('erCustomerror', function() {
    return {
        restrict: 'E',
        scope: {
            textoVariable: '=texto',
            clickOn: '&onRefresh'
        },
        template: '<p class="error-server"><strong>' +
            WPSMensajeError.upps +
            '</strong><br>' +
            WPSMensajeError.mensaje1 + '<br>' + WPSMensajeError.mensaje2 + '{{textoVariable}}' + WPSMensajeError.mensaje5 +
            '<a href="" ><img src="/wpstheme/cuentasclaro/img/icon-actualizar.png" width="24" ng-click="clickOn()"></a>' +
            '</p>'
    }
})

appController.directive('erCustomerrortotal', function() {
    return {
        restrict: 'E',
        template: '<div class="contenido-claro container-md ph-0 text-center absolute absolute-center " style="padding-top: 80px;">' +
            '<span class="icon-sh icon-sh_logoClaro"></span><div class="mensaje-error pv-42-mt-7 text-success">' +
            '<h1 class="fz-26 dinMed">' + WPSMensajeErrorTotal.upps + '</h1><p class="container-xs fz-14 pt-14">' +
            WPSMensajeErrorTotal.mensaje + '<br>' +
            WPSMensajeErrorTotal.mensaje2 + '</p><br/>' +
            '<a href="/wps/myportal/cuentasclaro/servicioprincipal" class="icon-sh icon-sh_refresh btn-refresh"></a></div></div>'
    }
})

miClaroApp.controller("ControllerDetalleConsumosMovil",
    function($scope, $http, $timeout, $location, DetalleConsumosService, ComunUsuarioSesionService,
        FileSaver, Blob) {

        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $scope.switchSelect = true;
        var AUDIT_EXITO = "SUCCESS";
        var AUDIT_ERROR = "ERROR";
        var urlInicio = WPSURLMiClaroRoot;
        var urlSwitch = "";
        var categoriaMovil = WPSCategoria.movil;
        var tipoPermisoReq = WPSTipoPermiso.todos;
        var titularesAfiliadosEmp = WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado;
        var idProductoPrincipal = "";
        var tipoLineaTodos = WPSTipoLinea.todos;

        $scope.usuarioSession = { tipoCliente: "", tipoClienteRequest: "", telefono: "", claroPuntos: 0, razonSocial: "" };

        $scope.prodPrincipalResponse = null;
        _controller = this;
        $scope.listadoCuentas = [];
        $scope.listadoRecibos = [];
        $scope.selectCuenta = null;
        $scope.selectRecibo = null;
        $scope.selectLinea = null;
        $scope.selectPeriodo = null;
        $scope.tipoDetalle = "L";
        $scope.tipoLlamadaRadio = WPSTipoLlamadas.salientes;
        $scope.tipoMensajeRadio = WPSTipoMensajes.sms;
        $scope.showListaMensajes = true;
        $scope.showListaInternet = true;
        $scope.showPantalla = false;
        $scope.showSinFormulario = false;
        $scope.showSelectorMixto = false;
        $scope.showCombos = true;
        $scope.showLlamadasMovil = null;
        $scope.showComboLinea = true;
        $scope.listaLlamadasVacio = false;
        $scope.listaMensajesVacio = false;

        $scope.listaVaciaMensaje = WPSConsultarDetalleConsumosMovilConsumer.EXCEPCION4;
        WPSConsultarDetalleConsumosMovilCorporativo.EXCEPCION100;

        $scope.esCorporativo = false;
        $scope.esConsumer = false;
        $scope.esPostpago = true;
        $scope.msgErrorConsumer = "";
        $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
        $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
        $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;
        $scope.mensaje_error_aycaramba = WPSMensajeError.exlamacion1;
        $scope.paginaActual = 1;
        $scope.cantidadPorPagina = 10;
        $scope.paginaMaximaDefault = 3;
        $scope.paginaMaxima = 3;
        $scope.paginaMaximaInternet = 3;
        $scope.paginaMaximaMensaje = 3;

        $scope.urlDetalleConsumoMov = "/wps/myportal/miclaro/consumer/consultas/detalleconsumos/movil";
        $scope.urlDetalleConsumoFij = "/wps/myportal/miclaro/consumer/consultas/detalleconsumos/fijo";
        $scope.urlDetalleConsumoInt = "/wps/myportal/miclaro/consumer/consultas/detalleconsumos/internet";
        $scope.urlDetalleConsumoTv = "/wps/myportal/miclaro/consumer/consultas/detalleconsumos/tv";
        $scope.show_datosadicionales = null;


        $scope.mailEnvioReporte = "";


        function getQueryStrings() {
            var assoc = {};
            var decode = function(s) { return decodeURIComponent(s.replace(/\+/g, " ")); };
            var queryString = location.search.substring(1);
            var keyValues = queryString.split('&');

            for (var i in keyValues) {
                var key = keyValues[i].split('=');
                if (key.length > 1) {
                    assoc[decode(key[0])] = decode(key[1]);
                }
            }

            return assoc;
        }

        var qs = getQueryStrings();

        if(jQuery.isEmptyObject(qs)){

        } else {
            $scope.tipoDetalle = qs.tipo;

            if($scope.tipoDetalle == 'L'){
                $( ".tabL" ).addClass( "active");
                $( ".tabM" ).removeClass( "active");
                $( ".tabT" ).removeClass( "active");

                $( "#consumo-llamadas" ).addClass( "active");
                $( "#consumo-mensajes" ).removeClass( "active");
                $( "#consumo-internet" ).removeClass( "active");

            } else if($scope.tipoDetalle == 'M'){
                $( ".tabL" ).removeClass( "active");
                $( ".tabM" ).addClass( "active");
                $( ".tabT" ).removeClass( "active");

                $( "#consumo-llamadas" ).removeClass( "active");
                $( "#consumo-mensajes" ).addClass( "active");
                $( "#consumo-internet" ).removeClass( "active");

            } else if($scope.tipoDetalle == 'T'){
                $( ".tabL" ).removeClass( "active");
                $( ".tabM" ).removeClass( "active");
                $( ".tabT" ).addClass( "active");

                $( "#consumo-llamadas" ).removeClass( "active");
                $( "#consumo-mensajes" ).removeClass( "active");
                $( "#consumo-internet" ).addClass( "active");
            }
        }


        angular.element(document).ready(function() {

            inicio();
            asignarEventoRadios();
            initTabs();
            initFormFields();
            asignarEventos();
        });

        $scope.switchChange = function() {
            window.location.replace(urlSwitch);
        };
        this.inicio = function() {
            $('.help').tooltip({ placement: "top" });
            inicio();
        }

        function inicio() {
            return cargarDatosUsuario().then(function() {

                configurarUrlsTabsExternos();
                if (verificarUsuarioMixto()) {
                    seleccionarSwitch();
                }
                $scope.flagServiciosFijo = $scope.usuarioSession.flagProductoMovilSesion;
                if ($scope.usuarioSession.tipoClienteRequest === WPSTipoCliente.corporativo) {
                    $scope.esCorporativo = true;
                    $scope.esConsumer = false;
                    $scope.listaVaciaMensaje = WPSConsultarDetalleConsumosMovilCorporativo.EXCEPCION100;

                    if ($scope.flagServiciosFijo == 2 || $scope.flagServiciosFijo == 3) {
                        if ($scope.usuarioSession.tipoClienteRequest === WPSTipoCliente.corporativo) {
                            asignarEventoAutoComplete();
                            agregarEventoBuscarLinea();
                            cargarComboCuentas();
                        } else {
                            cargarComboLinea();
                        }
                    } else {
                        $scope.showPantalla = false;
                        $scope.showErrorGeneral = false;
                        $("#sinServicios").show();
                    }
                } else {
                    $scope.esCorporativo = false;
                    $scope.esConsumer = true;
                    $scope.listaVaciaMensaje = WPSConsultarDetalleConsumosMovilConsumer.EXCEPCION4;
                    if ($scope.flagServiciosFijo == 1 || $scope.flagServiciosFijo == 3) {
                        if ($scope.usuarioSession.tipoClienteRequest === WPSTipoCliente.corporativo) {
                            asignarEventoAutoComplete();
                            agregarEventoBuscarLinea();
                            cargarComboCuentas();
                        } else {
                            cargarComboLinea();
                        }
                    } else {
                        $scope.showPantalla = false;
                        $scope.showErrorGeneral = false;
                        $("#sinServicios").show();
                    }
                }



            });
        }

        $scope.switchChange = function() {
            window.location.replace(urlSwitch);
        };

        function configurarUrlsTabsExternos() {
            if ($scope.usuarioSession.tipoClienteRequest === WPSTipoCliente.corporativo) {
                $scope.urlDetalleConsumoMov = $scope.urlDetalleConsumoMov.replace("/consumer/", "/corporativo/");
                $scope.urlDetalleConsumoFij = $scope.urlDetalleConsumoFij.replace("/consumer/", "/corporativo/");
                $scope.urlDetalleConsumoInt = $scope.urlDetalleConsumoInt.replace("/consumer/", "/corporativo/");
                $scope.urlDetalleConsumoTv = $scope.urlDetalleConsumoTv.replace("/consumer/", "/corporativo/");
            }
        }

        function cargarComboCuentas() {

            return DetalleConsumosService.obtenerListadoMovCorpCuenta().then(function(response) {


                var idRespuestaConsulta = parseInt(response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idRespuesta);
                var mensaje = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.mensaje;
                var dataResponse = response.data.obtenerListadoMovilCorporativoCuentaResponse;
                if (idRespuestaConsulta == 0) {
                    if (Array.isArray(response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta)) {
                        $scope.listadoCuentas = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta
                    } else {
                        $scope.listadoCuentas.push(response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta);
                    }
                    var flag_next = true;
                    angular.forEach($scope.listadoCuentas, function(val, key) {
                        if (flag_next) {
                            if (val.idCuenta == $scope.idCuentaPrincipal) {

                                $scope.selectCuenta = $scope.listadoCuentas[key];
                                flag_next = false;
                            } else {
                                $scope.selectCuenta = $scope.listadoCuentas[0];
                            }
                        }
                    });

                    $("#textoCuenta").html($scope.selectCuenta.nombreAlias);

                    $scope.showselectLinea = true;
                    cargarComboRecibos(true);
                } else {
                    $scope.showErrorGeneral = true;
                    $scope.showPantalla = false;
                    $scope.showselectLinea = false;
                    manejarErrores(idRespuestaConsulta);

                    enviarAuditoria('', dataResponse, AUDIT_ERROR, false, false, 'obtenerListadoMovCorpCuenta - ' + mensaje);
                }
            });
        }

        function cargarComboRecibos(isCargarLineas) {

            var request = crearRequestRecibos($scope.selectCuenta.idCuenta);
            return DetalleConsumosService.obtenerListadoMovCorpRecibo(request).then(function(response) {
                $scope.listadoRecibos = [];
                var idRespuestaConsulta = parseInt(response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idRespuesta);
                var mensaje = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.mensaje;
                var dataResponse = response.data.obtenerListadoMovilCorporativoReciboResponse;
                if (idRespuestaConsulta == 0) {
                    if (Array.isArray(response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo)) {
                        $scope.listadoRecibos = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo
                    } else {
                        $scope.listadoRecibos.push(response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo);
                    }


                    var flag_next = true;
                    angular.forEach($scope.listadoRecibos, function(val, key) {
                        if (flag_next) {
                            if (val.idRecibo == $scope.idReciboPrincipal) {

                                $scope.selectRecibo = $scope.listadoRecibos[key];
                                flag_next = false;
                            } else {
                                $scope.selectRecibo = $scope.listadoRecibos[0];
                            }
                        }
                    });


                    $scope.showselectLinea = true;
                    if (isCargarLineas) {
                        cargarComboLinea();
                    }
                } else {
                    $scope.showCombos = false;
                    manejarErrores(idRespuestaConsulta);

                    enviarAuditoria(request, dataResponse, AUDIT_ERROR, false, false, 'obtenerListadoMovCorpRecibo - ' + mensaje);
                }
            });
        }

        function cargarComboLinea() {

            return ComunUsuarioSesionService.obtenerDatosSesion().then(function(response) {
                $scope.prodPrincipalResponse = response.data.comunResponseType;
                idProductoPrincipal = response.data.comunResponseType.productoPrincipal;


            }).then(function() {
                var primeraVez = true;
                consultarProductoServicios(idProductoPrincipal, primeraVez).then(function() {
                    var encontroPrincipal = false;

                    if (WPSCategoria.movil == $scope.prodPrincipalResponse.categoria &&
                        idProductoPrincipal != null) {
                        angular.forEach($scope.listProductoPostpago, function(val, key) {

                            if (val.ProductoServicioResponse.idProductoServicio == idProductoPrincipal) {
                                $scope.selectLinea = $scope.listProductoPostpago[key];
                                encontroPrincipal = true;
                            }
                        });
                    }

                    if (!encontroPrincipal) {
                        actualizarProductoPrincipalSesion($scope.selectLinea);
                    }


                    cargarComboPeriodoYConsultaData();

                    if ($scope.usuarioSession.tipoClienteRequest === WPSTipoCliente.consumer) {
                        obtenerDatosAdicionalesServicioMovilWS();
                    }



                    if ($scope.usuarioSession.tipoClienteRequest === WPSTipoCliente.corporativo) {
                        if (encontroPrincipal) {

                            if (WPSCategoria.movil == $scope.prodPrincipalResponse.categoria &&
                                $scope.prodPrincipalResponse.productoPrincipal != null) {}

                            cargarComboRecibos(false).then(function() {
                                if (WPSCategoria.movil == $scope.prodPrincipalResponse.categoria &&
                                    $scope.prodPrincipalResponse.productoPrincipal != null) {}
                            });
                        }
                    }


                });
            }, function(error) {


            });
        }

        function consultarProductoServicios(idProdPrincipal, primeraVez) {

            var requestJson = crearRequestServicios(primeraVez);
            return DetalleConsumosService.obtenerServicios(requestJson).then(function(response) {
                var dataResponse = response.data.obtenerServiciosResponse;
                var idRespuestaConsulta = parseInt(dataResponse.defaultServiceResponse.idRespuesta);
                var mensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;

                if (idRespuestaConsulta == 0 && dataResponse.listadoProductosServicios != undefined) {

                    if (Array.isArray(dataResponse.listadoProductosServicios)) {
                        $scope.listProductoPostpago = dataResponse.listadoProductosServicios;

                        $scope.selectLinea = $scope.listProductoPostpago[0];

                    } else {
                        $scope.listProductoPostpago = [];
                        $scope.listProductoPostpago.push(dataResponse.listadoProductosServicios);
                        $scope.selectLinea = $scope.listProductoPostpago[0];
                    }
                    habilitarCombo($scope.listProductoPostpago, "pullservicio");
                    $scope.showComboLinea = true;
                    $scope.errorTecnico = false;
                    //_controller.cambiarLinea();

                    //actualizarProductoPrincipalSesion($scope.selectLinea);

                } else {
                    $scope.showCombos = false;
                    $scope.showComboLinea = false;
                    $scope.showPantalla = false;
                    manejarErrores();

                    enviarAuditoria(requestJson, dataResponse, AUDIT_ERROR, false, false, 'obtenerServicios - ' + mensaje);
                }
            }, function(error) {


            });
        }

        function cargarComboPeriodoYConsultaData() {
            if ($scope.selectLinea.ProductoServicioResponse.tipoLinea == WPSTipoLinea.postpago) {
                $scope.esPostpago = true;
                cargarComboPeriodosPostpago().then(function() {
                    if ($scope.showPantalla == true &&
                        ($scope.showCombos == true || $scope.showComboLinea == true)) {
                        cargarConsulta();
                    }
                });
            } else {
                $scope.esPostpago = false;
                cargarComboPeriodosPrepago().then(function() {
                    cargarConsulta();
                });
            }
        }



        function crearRequestRecibos(idCuenta) {

            var requestData = {
                'idCuenta': idCuenta
            };
            return requestData;
        }

        function crearRequestServicios(primeraVez) {

            var requestServiciosMoviles = {
                categoria: categoriaMovil,
                tipoLinea: null,
                tipoCliente: $scope.usuarioSession.tipoClienteRequest,
                idProductoServicio: null,
                tipoPermiso: tipoPermisoReq,
                idCuenta: null,
                idRecibo: null,
                idDireccion: null,
                nombreProducto: null,
                pagina: 0,
                cantResultadosPagina: 0,
                productoPrincipalXidRecibo: false,
                titularidadServicio: titularesAfiliadosEmp
            };
            if ($scope.usuarioSession.tipoClienteRequest === WPSTipoCliente.corporativo) {
                requestServiciosMoviles.tipoCliente = '2';
                if (!primeraVez) {
                    requestServiciosMoviles.idCuenta = $scope.selectCuenta.idCuenta;
                    requestServiciosMoviles.idRecibo = $scope.selectRecibo.idRecibo;
                }
                requestServiciosMoviles.tipoLinea = WPSTipoLinea.postpago;
            } else {
                requestServiciosMoviles.tipoCliente = '1';
                requestServiciosMoviles.idCuenta = null;
                requestServiciosMoviles.idRecibo = null;
                requestServiciosMoviles.tipoLinea = tipoLineaTodos;
            }
            return requestServiciosMoviles;
        }

        this.verMas = function() {
            obtenerLlamadasMovil(true);
        }
        this.verMasMensajes = function() {
            obtenerMensajesMovil(true);
        }
        this.verMasInternet = function() {
            obtenerTraficoMovil(true);
        }

        function cargarComboPeriodosPostpago() {

            var request = crearRequestPeriodos();
            return DetalleConsumosService.obtenerPeriodosFacturacion(request).then(function(response) {


                var idRespuestaConsulta = parseInt(response.data.obtenerPeriodosFacturacionResponse.defaultServiceResponse.idRespuesta);
                var dataResponse = response.data.obtenerPeriodosFacturacionResponse;
                var mensaje = response.data.obtenerPeriodosFacturacionResponse.defaultServiceResponse.mensaje;
                if (idRespuestaConsulta == 0) {
                    if (Array.isArray(response.data.obtenerPeriodosFacturacionResponse.listado)) {
                        $scope.listadoPeriodos = response.data.obtenerPeriodosFacturacionResponse.listado
                    } else {
                        $scope.listadoPeriodos.push(response.data.obtenerPeriodosFacturacionResponse.listado);
                    }
                    $scope.selectPeriodo = $scope.listadoPeriodos[0];

                    $scope.showPantalla = true;
                    $scope.showCombos = true;
                } else {
                    $scope.showPantalla = false;
                    $scope.showCombos = false;
                    manejarErrores();

                    enviarAuditoria(request, dataResponse, AUDIT_ERROR, false, false, 'obtenerPeriodosFacturacion - ' + mensaje);
                }


            });
        }

        function cargarComboPeriodosPrepago() {

            var request = {
                "cantMeses": "3",
                "mesMaximo": "0"
            };
            return DetalleConsumosService.obtenerPeriodos(request).then(function(response) {


                if (Array.isArray(response.data.comunResponseType.elemento)) {
                    $scope.listadoPeriodos = response.data.comunResponseType.elemento
                } else {
                    $scope.listadoPeriodos.push(response.data.comunResponseType.elemento);
                }
                $scope.selectPeriodo = $scope.listadoPeriodos[0];

                $scope.showPantalla = true;
                $scope.showCombos = true;
            });
        }

        function crearRequestPeriodos() {
            return {
                categoria: $scope.selectLinea.ProductoServicioResponse.categoria,
                idProductoServicio: $scope.selectLinea.ProductoServicioResponse.idProductoServicio,
                idDireccion: null,
                idLinea: null,
                idCuenta: $scope.selectLinea.ProductoServicioResponse.idCuenta,
                idRecibo: $scope.selectLinea.ProductoServicioResponse.idRecibo,
                cantPeriodos: 3,
            };

        }
        this.recargarDatosAdicioServMovil = function() {
            $scope.show_datosadicionales = null;
            obtenerDatosAdicionalesServicioMovilWS();
        };

        function obtenerDatosAdicionalesServicioMovilWS() {

            var request = {
                "idCuenta": $scope.selectLinea.ProductoServicioResponse.idCuenta,
                "idRecibo": $scope.selectLinea.ProductoServicioResponse.idRecibo,
                "tipoCliente": $scope.usuarioSession.tipoClienteRequest,
                "idProductoServicio": $scope.selectLinea.ProductoServicioResponse.idProductoServicio,
            };
            DetalleConsumosService.obtenerDatosAdicionalesServicioMovil(request).then(function(response) {

                var id_respuesta = response.data.obtenerDatosAdicionalesServicioMovilResponse.defaultServiceResponse.idRespuesta;
                var mensaje = response.data.obtenerDatosAdicionalesServicioMovilResponse.defaultServiceResponse.mensaje;
                var dataResponse = response.data.obtenerDatosAdicionalesServicioMovilResponse;
                if (id_respuesta == 0) {

                    $scope.wps_fechaActivacion = response.data.obtenerDatosAdicionalesServicioMovilResponse.fechaActivacion;
                    $scope.wps_finContratoEquipo = response.data.obtenerDatosAdicionalesServicioMovilResponse.finContratoEquipo;
                    if (parseInt($scope.wps_finContratoEquipo) <= 0 || $scope.wps_finContratoEquipo == null || $scope.wps_finContratoEquipo == "") {
                        $("#contradoEquipo").hide();
                    } else {
                        $("#contradoEquipo").show();
                    }
                    $scope.wps_fechaExpiracion = response.data.obtenerDatosAdicionalesServicioMovilResponse.fechaExpiracion;
                    $scope.wps_estado = response.data.obtenerDatosAdicionalesServicioMovilResponse.estado;
                    $scope.wps_simboloMonedaCargo = response.data.obtenerDatosAdicionalesServicioMovilResponse.simboloMonedaCargo;
                    $scope.wps_cargoFijo = response.data.obtenerDatosAdicionalesServicioMovilResponse.cargoFijo;
                    $scope.wps_planActual = response.data.obtenerDatosAdicionalesServicioMovilResponse.planActual;

                    $scope.show_datosadicionales = true;
                } else {
                    $scope.show_datosadicionales = false;
                    $("#contradoEquipo").hide();
                    manejarErrores();

                    enviarAuditoria(request, dataResponse, AUDIT_ERROR, false, false, 'obtenerDatosAdicionalesServicioMovil - ' + mensaje);

                }

            }, function(error) {


            });

        };

        this.selectDetLlamadas = function() {
            $scope.tipoDetalle = "L";
            _controller.obtenerLlamadasMovil();
        };
        this.selectDetMensajes = function() {
            $scope.tipoDetalle = "M";
            _controller.obtenerMensajes();
        };
        this.selectDetTrafico = function() {
            $scope.tipoDetalle = "T";
            $scope.paginaActual = 1;
            obtenerTraficoMovil(false);
        };

        this.obtenerLlamadasMovil = function() {

            $scope.showLlamadasMovil = true;
            $scope.listaLlamadasVacio = true;
            $scope.showListaInternet = true;
            $scope.listaTraficoVacio = true;
            $scope.paginaActual = 1;
            obtenerLlamadasMovil(false);
        };
        this.obtenerMensajes = function() {
            $scope.paginaActual = 1;
            obtenerMensajesMovil(false);
        };

        function obtenerLlamadasMovil(esVerMas) {

            if (esVerMas) {
                $scope.paginaActual++;
            } else {
                $scope.listarLlamadasMovil = null;
            }

            var request = crearRequestMovil();
            var listaTemp = $scope.listarLlamadasMovil;



            $scope.listaLlamadasVacio = false;
            $scope.showLlamadasMovil2 = false;
            DetalleConsumosService.obtenerLlamadasMovil(request).then(function(response) {

                var dataResponse = response.data.obtenerLlamadasMovilResponse;
                var rpta = parseInt(dataResponse.defaultServiceResponse.idRespuesta);
                var mensaje = dataResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    if (dataResponse.listaLlamadas != undefined) {

                        if (esVerMas) {
                            $scope.listarLlamadasMovil = concatenarLista(listaTemp, dataResponse.listaLlamadas);
                            if ($scope.paginaActual == 3) {
                                $scope.showLlamadasMovil2 = true;
                            }
                        } else {
                            $scope.listarLlamadasMovil = null;
                            $scope.listarLlamadasMovil = dataResponse.listaLlamadas;
                            if (!Array.isArray($scope.listarLlamadasMovil)) {
                                $scope.listarLlamadasMovil = [];
                                $scope.listarLlamadasMovil.push(dataResponse.listaLlamadas);
                            }

                            if (parseInt(dataResponse.totalPaginas) < $scope.paginaMaximaDefault) {
                                $scope.paginaMaxima = parseInt(dataResponse.totalPaginas);
                            } else {
                                $scope.paginaMaxima = 3;
                            }

                        }
                        $scope.showLlamadasMovil = true;
                        $scope.listaLlamadasVacio = false;
                        enviarAuditoria(request, dataResponse, AUDIT_EXITO, false, false, '-');
                    } else {
                        $scope.showLlamadasMovil = false;
                        $scope.listaLlamadasVacio = true;
                    }
                } else if (rpta == 9) {
                    $scope.listarLlamadasMovil = null;
                    $scope.showLlamadasMovil = false;
                    $scope.listaLlamadasVacio = true;
                    enviarAuditoria(request, dataResponse, AUDIT_EXITO, false, false, 'obtenerLlamadasMovil - ' + mensaje);
                } else {
                    $scope.listarLlamadasMovil = null;
                    $scope.showLlamadasMovil = false;
                    $scope.listaLlamadasVacio = false;
                    enviarAuditoria(request, dataResponse, AUDIT_ERROR, false, false, 'obtenerLlamadasMovil - ' + mensaje);
                }
            }, function(error) {

            });
        }

        function crearRequestMovil() {
            var requestObtenerLlamadasMovil = {
                idProductoServicio: $scope.selectLinea.ProductoServicioResponse.idProductoServicio,
                idCuenta: $scope.selectLinea.ProductoServicioResponse.idCuenta,
                idRecibo: $scope.selectLinea.ProductoServicioResponse.idRecibo,
                idPeriodo: $scope.selectPeriodo.idPeriodo,
                flagCorreo: 'false',
                pagina: $scope.paginaActual,
                cantResultadosPagina: $scope.cantidadPorPagina
            };
            if ($scope.tipoDetalle == "L") {
                requestObtenerLlamadasMovil.tipoLlamadas = $scope.tipoLlamadaRadio;
            } else if ($scope.tipoDetalle == "M") {
                requestObtenerLlamadasMovil.tipoMensajes = $scope.tipoMensajeRadio;
            }
            if ($scope.selectLinea.ProductoServicioResponse.tipoLinea == WPSTipoLinea.postpago) {
                requestObtenerLlamadasMovil.idPeriodo = $scope.selectPeriodo.idPeriodo;
            } else {
                requestObtenerLlamadasMovil.idPeriodo = $scope.selectPeriodo.codigo;
            }
            return requestObtenerLlamadasMovil;
        };

        function obtenerMensajesMovil(esVerMas) {

            if (esVerMas) {
                $scope.paginaActual++;
            } else {
                $scope.listaMensajesMovil = null;
            }
            var request = crearRequestMovil();

            $scope.showListaMensajes = true;
            $scope.showListaMensajes2 = false;
            $scope.listaMensajesVacio = false;
            DetalleConsumosService.obtenerMensajesMovil(request).then(function(response) {

                var dataResponse = response.data.obtenerMensajesMovilResponse;
                var rpta = parseInt(dataResponse.defaultServiceResponse.idRespuesta);
                var mensaje = dataResponse.defaultServiceResponse.mensaje;

                if (rpta == 0) {
                    if (dataResponse.listaMensajes != undefined) {

                        if (esVerMas) {
                            $scope.listaMensajesMovil = concatenarLista($scope.listaMensajesMovil, dataResponse.listaMensajes);
                            if ($scope.paginaActual == 3) {
                                $scope.showListaMensajes2 = true;
                            }
                        } else {
                            if (parseInt(dataResponse.totalPaginas) < $scope.paginaMaximaDefault) {
                                $scope.paginaMaximaMensaje = parseInt(dataResponse.totalPaginas);
                            } else {
                                $scope.paginaMaximaMensaje = 3;
                            }
                            $scope.listaMensajesMovil = dataResponse.listaMensajes;
                            if (!Array.isArray($scope.listaMensajesMovil)) {
                                $scope.listaMensajesMovil = [];
                                $scope.listaMensajesMovil.push(dataResponse.listaMensajes);
                            }
                        }
                        $scope.showListaMensajes = true;
                        $scope.listaMensajesVacio = false;
                        enviarAuditoria(request, dataResponse, AUDIT_EXITO, false, false, '-');
                    } else {
                        $scope.showListaMensajes = false;
                        $scope.listaMensajesVacio = true;
                    }
                } else if (rpta == 7) {
                    $scope.listaMensajesMovil = null;
                    $scope.showListaMensajes = false;
                    $scope.listaMensajesVacio = true;
                    enviarAuditoria(request, dataResponse, AUDIT_EXITO, false, false, 'obtenerMensajesMovil - ' + mensaje);
                } else {
                    $scope.listaMensajesMovil = null;
                    $scope.showListaMensajes = false;
                    $scope.listaMensajesVacio = false;
                    enviarAuditoria(request, dataResponse, AUDIT_ERROR, false, false, 'obtenerMensajesMovil - ' + mensaje);
                }
            }, function(error) {


            });
        }

        function obtenerTraficoMovil(esVerMas) {

            if (esVerMas) {
                $scope.paginaActual++;
            } else {
                $scope.listaInternetMovil = null;
            }
            var request = crearRequestMovil();
            $scope.showListaInternet = true
            $scope.listaTraficoVacio = false;

            $scope.showListaInternet2 = false;
            DetalleConsumosService.obtenerTraficoMovil(request).then(function(response) {

                var dataResponse = response.data.obtenerTraficoMovilResponse;
                var rpta = parseInt(dataResponse.defaultServiceResponse.idRespuesta);
                var mensaje = dataResponse.defaultServiceResponse.mensaje;

                if (rpta == 0) {
                    if (dataResponse.listaTrafico != undefined) {
                        if (esVerMas) {
                            $scope.listaInternetMovil = concatenarLista($scope.listaInternetMovil, dataResponse.listaTrafico);
                            if ($scope.paginaActual == 3) {
                                $scope.showListaInternet2 = true;
                            }

                        } else {
                            if (parseInt(dataResponse.totalPaginas) < $scope.paginaMaximaDefault) {
                                $scope.paginaMaximaInternet = parseInt(dataResponse.totalPaginas);
                            }
                            $scope.listaInternetMovil = dataResponse.listaTrafico;
                            if (!Array.isArray($scope.listaInternetMovil)) {
                                $scope.listaInternetMovil = [];
                                $scope.listaInternetMovil.push(dataResponse.listaTrafico);
                            }
                        }

                        $scope.showListaInternet = true;
                        $scope.listaTraficoVacio = false;
                        enviarAuditoria(request, dataResponse, AUDIT_EXITO, false, false, '-');
                    } else {
                        $scope.showListaInternet = false;
                        $scope.listaTraficoVacio = true;
                    }
                } else if (rpta == 7) {
                    $scope.showListaInternet = false;
                    $scope.listaTraficoVacio = true;
                    enviarAuditoria(request, dataResponse, AUDIT_EXITO, false, false, 'obtenerTraficoMovil - ' + mensaje);
                } else {
                    $scope.showListaInternet = false;
                    $scope.listaTraficoVacio = false;
                    enviarAuditoria(request, dataResponse, AUDIT_ERROR, false, false, 'obtenerTraficoMovil - ' + mensaje);
                }
            }, function(error) {


            });
        }

        function cargarDatosUsuario() {
            return ComunUsuarioSesionService.obtenerDatosUsuario().then(function(response) {

                var idRespuestaConsulta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                if (idRespuestaConsulta == 0) {
                    definirTipoClienteRequest(response.data.comunResponseType.tipoCliente);
                    $scope.usuarioSession.tipoCliente = response.data.comunResponseType.tipoCliente;
                    $scope.usuarioSession.email = response.data.comunResponseType.usuarioVinculado;
                    $scope.usuarioSession.razonSocial = response.data.comunResponseType.razonSocial;
                    $scope.usuarioSession.flagProductoMovilSesion = parseInt(response.data.comunResponseType.flagProductoMovilSesion);
                    $scope.idCuentaPrincipal = response.data.comunResponseType.idCuenta;
                    $scope.idDireccion = response.data.comunResponseType.idDireccion;
                    $scope.idLinea = response.data.comunResponseType.idLinea;
                    $scope.idReciboPrincipal = response.data.comunResponseType.idRecibo;
                    $scope.nombreAliasaMostrar = response.data.comunResponseType.nombreProductoPrincipal;
                    $scope.idServicio = response.data.comunResponseType.productoPrincipal;
                    $scope.tipoCliente = response.data.comunResponseType.tipoClienteProductoPrincipal;
                    $scope.categoria = response.data.comunResponseType.categoria;
                    $scope.tipoLinea = response.data.comunResponseType.tipoLinea;


                } else if (idRespuestaConsulta > 0) {
                    $scope.errorFuncional = true;
                }
            }, function(error) {


            });
        }

        this.obtenerReporte = function() {

            var requestObtenerLlamadasFijo = crearRequestReporte();
            var tipoReporte = obtenerTipoReporte();
            DetalleConsumosService.obtenerReporteLlamadas(requestObtenerLlamadasFijo, tipoReporte).then(function(response) {

                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                var mensaje = response.data.comunResponseType.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    var archivoBase64 = response.data.comunResponseType.archivo;
                    var wps_apple = false;
                    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
                    if (/iPad|Mac|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                        wps_apple = true;
                    } else {
                        wps_apple = false;
                    }

                    if (wps_apple) {
                        var urlbase64 = "data:application/vnd.ms-excel;base64," + archivoBase64;
                        window.open(urlbase64, '_blank');
                    } else {
                        var reciboBlob = b64toBlob(archivoBase64, 'application/excel');
                        FileSaver.saveAs(reciboBlob, 'DetalleConsumo.xls');
                    }
                    enviarAuditoria(request, response.data.comunResponseType, AUDIT_EXITO, false, true, '-');

                } else {
                    enviarAuditoria(request, response.data.comunResponseType, AUDIT_ERROR, false, true, 'obtenerReporteLlamadas - ' + mensaje);
                }

            }, function(error) {


            });
        };

        function crearRequestReporte() {

            var request = {
                idProductoServicio: $scope.selectLinea.ProductoServicioResponse.idProductoServicio,
                idCuenta: $scope.selectLinea.ProductoServicioResponse.idCuenta,
                idRecibo: $scope.selectLinea.ProductoServicioResponse.idRecibo,
                idPeriodo: $scope.selectPeriodo.idPeriodo,

                flagCorreo: 'false',
                pagina: 0,
                cantResultadosPagina: 0
            };

            if ($scope.tipoDetalle === "L") {
                request.tipoLlamadas = $scope.tipoLlamadaRadio;
            } else if ($scope.tipoDetalle === "M") {
                request.tipoMensajes = $scope.tipoMensajeRadio;
            }
            if ($scope.selectLinea.ProductoServicioResponse.tipoLinea == WPSTipoLinea.postpago) {
                request.idPeriodo = $scope.selectPeriodo.idPeriodo;
            } else {
                request.idPeriodo = $scope.selectPeriodo.codigo;
            }
            request.numeroReporte = $scope.selectLinea.ProductoServicioResponse.nombre;
            return request;
        }

        function obtenerTipoReporte() {
            var tipo = 0;
            if ($scope.tipoDetalle == "L") {
                if (WPSTipoLlamadas.entrantes === $scope.tipoLlamadaRadio) {
                    tipo = 3;
                } else if (WPSTipoLlamadas.salientes === $scope.tipoLlamadaRadio) {
                    tipo = 4;
                } else if (WPSTipoLlamadas.porcobrar === $scope.tipoLlamadaRadio) {
                    tipo = 5;
                }
            } else if ($scope.tipoDetalle == "M") {
                if (WPSTipoMensajes.sms === $scope.tipoMensajeRadio) {
                    tipo = 6;
                }
                if (WPSTipoMensajes.mms === $scope.tipoMensajeRadio) {
                    tipo = 7;
                }
            } else if ($scope.tipoDetalle == "T") {
                tipo = 8;
            }
            return tipo;
        }


        this.verPopupEnviar = function() {
            $scope.mailEnvioReporte = "";
            abrirPopup();
        }

        this.enviarACorreoAjeno = function() {
            if (validarEnvioMail()) {
                enviarACorreo().then(function() {
                    _controller.limpiarEnvioReporte();

                });
            }
        }
        this.enviarACorreoPropio = function() {
            $scope.mailEnvioReporte = $scope.usuarioSession.email;
            enviarACorreo().then(function() {
                _controller.limpiarEnvioReporte();

            });
        }

        function enviarACorreo() {

            if ($scope.tipoDetalle == "L") {
                return enviarReporteLlamadasMovil();
            } else if ($scope.tipoDetalle == "M") {
                return enviarReporteMensajesMovil();
            } else if ($scope.tipoDetalle == "T") {
                return enviarReporteTrafico();
            };
        }

        this.limpiarEnvioReporte = function() {
            $scope.mailEnvioReporte = "";
        }

        function enviarReporteLlamadasMovil() {

            var request = crearRequestEnviarMovil();



            return DetalleConsumosService.obtenerLlamadasMovil(request).then(function(response) {

                var dataResponse = response.data.obtenerLlamadasMovilResponse;
                var rpta = parseInt(dataResponse.defaultServiceResponse.idRespuesta);
                var mensaje = dataResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {

                    enviarAuditoria(request, dataResponse, AUDIT_EXITO, true, false, '-');
                } else if (rpta == 9999) {

                    enviarAuditoria(request, dataResponse, AUDIT_EXITO, true, false, 'obtenerLlamadasMovil - ' + mensaje);
                } else {
                    enviarAuditoria(request, dataResponse, AUDIT_ERROR, true, false, 'obtenerLlamadasMovil - ' + mensaje);
                }
            }, function(error) {


            });
        }

        function enviarReporteMensajesMovil() {


            var request = crearRequestEnviarMovil();

            return DetalleConsumosService.obtenerMensajesMovil(request).then(function(response) {

                var dataResponse = response.data.obtenerMensajesMovilResponse;
                var rpta = parseInt(dataResponse.defaultServiceResponse.idRespuesta);
                var mensaje = dataResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {

                    enviarAuditoria(request, dataResponse, AUDIT_EXITO, true, false, '-');
                } else if (rpta == 9999) {

                    enviarAuditoria(request, dataResponse, AUDIT_EXITO, true, false, 'obtenerMensajesMovil - ' + mensaje);
                } else {
                    enviarAuditoria(request, dataResponse, AUDIT_ERROR, true, false, 'obtenerMensajesMovil - ' + mensaje);
                }
            }, function(error) {


            });
        }

        function enviarReporteTrafico() {


            var request = crearRequestEnviarMovil();

            return DetalleConsumosService.obtenerTraficoMovil(request).then(function(response) {

                var dataResponse = response.data.obtenerTraficoMovilResponse;
                var rpta = parseInt(dataResponse.defaultServiceResponse.idRespuesta);
                var mensaje = dataResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {

                    enviarAuditoria(request, dataResponse, AUDIT_EXITO, true, false, '-');
                } else if (rpta == 9999) {

                    enviarAuditoria(request, dataResponse, AUDIT_EXITO, true, false, 'obtenerTraficoMovil - ' + mensaje);
                } else {
                    enviarAuditoria(request, dataResponse, AUDIT_ERROR, true, false, 'obtenerTraficoMovil - ' + mensaje);
                }
            }, function(error) {


            });
        }

        function crearRequestEnviarMovil() {
            var requestObtenerLlamadasMovil = {
                idProductoServicio: $scope.selectLinea.ProductoServicioResponse.idProductoServicio,
                idCuenta: $scope.selectLinea.ProductoServicioResponse.idCuenta,
                idRecibo: $scope.selectLinea.ProductoServicioResponse.idRecibo,
                idPeriodo: $scope.selectPeriodo.idPeriodo,
                mail: $scope.mailEnvioReporte,
                flagCorreo: 'true',
                pagina: $scope.paginaActual,
                cantResultadosPagina: $scope.cantidadPorPagina
            };
            if ($scope.tipoDetalle == "L") {
                requestObtenerLlamadasMovil.tipoLlamadas = $scope.tipoLlamadaRadio;
            } else if ($scope.tipoDetalle == "M") {
                requestObtenerLlamadasMovil.tipoMensajes = $scope.tipoMensajeRadio;
            }
            if ($scope.selectLinea.ProductoServicioResponse.tipoLinea == WPSTipoLinea.postpago) {
                requestObtenerLlamadasMovil.idPeriodo = $scope.selectPeriodo.idPeriodo;
            } else {
                requestObtenerLlamadasMovil.idPeriodo = $scope.selectPeriodo.codigo;
            }
            return requestObtenerLlamadasMovil;
        };

        function cargarBanner() {
            if ($scope.usuarioSession.tipoClienteRequest === WPSTipoCliente.consumer) {
                $(".big-ad").load("/wps/wcm/myconnect/Mi%20Claro%20Content%20Library/Mi%20Claro/Banners/Envio%20SMS%20Consumer");
            } else {
                $(".big-ad").load("/wps/wcm/myconnect/Mi%20Claro%20Content%20Library/Mi%20Claro/Banners/Envio%20SMS%20Corporativo");
            }
        }

        function seleccionarSwitch() {
            if ($scope.usuarioSession.tipoClienteRequest == WPSTipoCliente.corporativo) {
                $("#lblConsumer").attr("for", "itype1");
                $("#lblCorporativo").removeAttr("for");
                $scope.switchSelect = true;
                urlSwitch = "/wps/myportal/miclaro/consumer/consultas/detalleconsumos/movil/";
            } else if ($scope.usuarioSession.tipoClienteRequest == WPSTipoCliente.consumer) {
                $("#lblCorporativo").attr("for", "itype1");
                $("#lblConsumer").removeAttr("for");
                $scope.switchSelect = false;
                urlSwitch = "/wps/myportal/miclaro/corporativo/consultas/detalleconsumos/movil/";
            }
        }

        function verificarUsuarioMixto() {
            if ($scope.usuarioSession.tipoCliente == WPSTipoCliente.mixto) {
                $scope.showSelectorMixto = true;
                return true;
            } else {
                return false;
            }
        }

        function manejarErrores(idRespuestaConsulta) {
            if (idRespuestaConsulta > 0) {
                $scope.errorTecnico = false;
            } else {
                $scope.errorTecnico = true;
            }
            if ($scope.usuarioSession.tipoClienteRequest == 1) {
                $scope.msgErrorConsumer = WPSMensajeError.mensaje3;
            } else {
                $scope.msgErrorConsumer = WPSMensajeError.mensaje4;
            }
        }

        function definirTipoClienteRequest(codTipoCliente) {
            var path = document.location.href;
            if (path.indexOf("/consumer/") != -1) {
                $scope.usuarioSession.tipoClienteRequest = WPSTipoCliente.consumer;
            } else {
                $scope.usuarioSession.tipoClienteRequest = WPSTipoCliente.corporativo;
            }
        }


        this.cambiarCuenta = function() {

            cargarComboRecibos(false).then(function() {
                _controller.cambiarRecibo();
            });
        };

        this.cambiarRecibo = function() {
            consultarProductoServicios(null, false);



        };

        this.cambiarLinea = function() {
            actualizarProductoPrincipalSesion($scope.selectLinea);

            $scope.showLlamadasMovil = null;
            $scope.show_datosadicionales = null;
            $scope.showCombos = null;


            $("#contradoEquipo").hide();
            if ($scope.selectLinea.ProductoServicioResponse.tipoLinea == WPSTipoLinea.postpago) {

                $scope.esPostpago = true;

                cargarComboPeriodosPostpago().then(function() {
                    if ($scope.showPantalla == true &&
                        ($scope.showCombos == true || $scope.showComboLinea == true)) {
                        obtenerDatosAdicionalesServicioMovilWS();
                        cargarConsulta();


                    }
                });
            } else {
                $("#contradoEquipo").hide();
                $scope.esPostpago = false;

                cargarComboPeriodosPrepago().then(function() {
                    obtenerDatosAdicionalesServicioMovilWS();
                    cargarConsulta();

                });
            }

        };

        this.cambiarPeriodo = function() {
            $scope.paginaActual = 1;
            $scope.showListaMensajes = true;
            $scope.listaMensajesVacio = false;
            $scope.showLlamadasMovil = true;
            $scope.listaLlamadasVacio = false;
            $scope.showListaInternet = true;
            $scope.listaTraficoVacio = false;

            cargarConsulta();
        };

        function cargarConsulta() {
            if ($scope.tipoDetalle == "L") {
                obtenerLlamadasMovil(false);
            } else if ($scope.tipoDetalle == "M") {
                obtenerMensajesMovil(false);
            } else if ($scope.tipoDetalle == "T") {
                obtenerTraficoMovil(false);
            };
        }


        $scope.refreshPortlet = function(indicadorError) {
            if (indicadorError == '1') {
                cargarComboCuentas();
                cargarComboLinea();
            } else if (indicadorError == '2') {
                cargarObtenerCreditoSaldoProducto($scope.selectLinea.ProductoServicioResponse);
                obtenerCategoriasDeCompra();
            } else if (indicadorError == '3') {
                obtenerCategoriasDeCompra();
            } else if (indicadorError == '4') {
                obtenerProductosDeCompra($scope.categoriaSeleccionada.idCategoriaDeCompra, function() {});
            } else if (indicadorError == '5') {
                obtenerMediosDePago($scope.categoriaSeleccionada.idCategoriaDeCompra, $scope.productoSeleccionado);
            }
        };

        function asignarEventoAutoComplete() {
            $('#autocomplete-filtro').autocomplete({
                lookup: function(query, done) {
                    consultarProductoServiciosA(done);
                },
                minChars: 4,
                onSelect: function(suggestion) {
                    var texto = suggestion.data;
                    var prodAutoComplet = buscarEnListaAuto($scope.listaAutocomplete, texto);
                    obtenerProductoServicio(prodAutoComplet);
                }
            });
        }

        function consultarProductoServiciosA(done) {


            var valorinput = $('#autocomplete-filtro').val();

            var requestJson = {
                tipoLinea: tipoLineaTodos,
                tipoCliente: $scope.usuarioSession.tipoClienteRequest,
                tipoPermiso: tipoPermisoReq,
                idCuenta: null,
                idRecibo: null,
                criterioBusqueda: valorinput,
                pagina: 0,
                cantResultadosPagina: 0,
                titularidadServicio: titularesAfiliadosEmp,
            };
            DetalleConsumosService.obtenerListadoMoviles(requestJson).then(function(response) {

                var idRespuestaConsulta = parseInt(response.data.obtenerListadoMovilesResponse.defaultServiceResponse.idRespuesta);
                if (idRespuestaConsulta == 0 &&
                    response.data.obtenerListadoMovilesResponse.listadoProductosServicios != undefined) {
                    if (Array.isArray(response.data.obtenerListadoMovilesResponse.listadoProductosServicios)) {
                        $scope.listaAutocomplete = response.data.obtenerListadoMovilesResponse.listadoProductosServicios;
                    } else {
                        $scope.listaAutocomplete = [];
                        $scope.listaAutocomplete.push(response.data.obtenerListadoMovilesResponse.listadoProductosServicios);
                    }
                    var lista = $scope.listaAutocomplete;
                    var result = obtenerArrayAutoComplete(lista);
                    done(result);
                } else {
                    $scope.listaAutocomplete = [];
                    $('.autocomplete-suggestion').remove();
                    $('.autocomplete-suggestion').empty();
                }
            });
        }

        function obtenerProductoServicio(prodAutoComplet) {


            var requestJson = crearRequestServiciosA(null, null, prodAutoComplet);
            DetalleConsumosService.obtenerServicios(requestJson).then(function(response) {
                var dataResponse = response.data.obtenerServiciosResponse;
                var idRespuestaConsulta = parseInt(dataResponse.defaultServiceResponse.idRespuesta);
                if (idRespuestaConsulta == 0 && dataResponse.listadoProductosServicios != undefined) {
                    if (Array.isArray(dataResponse.listadoProductosServicios)) {
                        $scope.listProductoPostpago1 = dataResponse.listadoProductosServicios;
                    } else {
                        $scope.listProductoPostpago1 = [];
                        $scope.listProductoPostpago1.push(dataResponse.listadoProductosServicios);
                    }
                    $scope.selectLinea = $scope.listProductoPostpago1[0];
                    
                    cargarComboRecibos(true);

                    actualizarProductoPrincipalSesion($scope.selectLinea);
                } else {
                    $scope.showCombos = false;
                    $scope.showComboLinea = false;
                    $scope.showPantalla = false;
                    manejarErrores();

                }
            });
        }

        function crearRequestServiciosA(cuenta, recibo, productoServicio) {

            var requestServiciosMoviles = {
                categoria: categoriaMovil,
                tipoLinea: tipoLineaTodos,
                tipoCliente: $scope.usuarioSession.tipoClienteRequest,
                idProductoServicio: null,
                tipoPermiso: tipoPermisoReq,
                idCuenta: null,
                idRecibo: null,
                idDireccion: null,
                nombreProducto: null,
                pagina: 0,
                cantResultadosPagina: 0,
                productoPrincipalXidRecibo: false,
                titularidadServicio: titularesAfiliadosEmp
            }
            if (cuenta != null &&
                cuenta.idCuenta != null) {
                requestServiciosMoviles.idCuenta = cuenta.idCuenta;
            }
            if (recibo != null &&
                recibo.idRecibo != null) {
                requestServiciosMoviles.idRecibo = recibo.idRecibo;
            }
            if (productoServicio != null) {
                requestServiciosMoviles.idProductoServicio = productoServicio.idProductoServicio
            }

            return requestServiciosMoviles;
        }


        function actualizarProductoPrincipalSesion(servicioActual) {



            var actualizarServicioSesion = {
                productoPrincipal: servicioActual.ProductoServicioResponse.idProductoServicio,
                nombreProductoPrincipal: servicioActual.ProductoServicioResponse.nombre,
                idCuenta: servicioActual.ProductoServicioResponse.idCuenta,
                idRecibo: servicioActual.ProductoServicioResponse.idRecibo,
                idDireccion: servicioActual.ProductoServicioResponse.idDireccion,
                idLinea: servicioActual.ProductoServicioResponse.idLinea,
                tipoLinea: servicioActual.ProductoServicioResponse.tipoLinea,
                numeroTelFijo: servicioActual.ProductoServicioResponse.numeroTelFijo,
                categoria: servicioActual.ProductoServicioResponse.categoria,
                tipoClienteProductoPrincipal: servicioActual.ProductoServicioResponse.tipoCliente
            };
            ComunUsuarioSesionService.actualizarProductoPrincipalSesion(actualizarServicioSesion).then(function(response) {



            });
        }

        function enviarAuditoria(request, response, estadoAudit, isEnvioCorreo, isObtenerReporte, descripcion) {
            requestAuditoria = crearRequestAudit($scope.usuarioSession, request, response, $scope.selectLinea,
                $scope.tipoDetalle, $scope.tipoLlamadaRadio, $scope.tipoMensajeRadio,
                $scope.esCorporativo, isEnvioCorreo, isObtenerReporte, estadoAudit, descripcion);

            ComunUsuarioSesionService.enviarAuditoria(requestAuditoria).then(function(response) {

            }, function(error) {

            });
        }

        function manejarErrores() {
            if ($scope.usuarioSession.tipoClienteRequest == 1) {
                $scope.msgErrorConsumer = WPSMensajeError.mensaje3;
            } else {
                $scope.msgErrorConsumer = WPSMensajeError.mensaje4;
            }
        }

    });
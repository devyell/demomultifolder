var appController = angular.module('miClaroController', []);

appController.controller("ControllerComprasyRecargas",
    function($scope, $http, $timeout, $location, ComprasyRecargasService, ComunUsuarioSesionService, servicioCompartido) {

        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $scope.switchSelect = true;
        $scope.servicioCompartido = servicioCompartido;
        $scope.listadoProductoServicios = [];
        $scope.listaMetodoPago = [];
        $scope.errorFuncional = false;
        $scope.errorTecnico = false;
        $scope.tipoClienteSession = "";
        $scope.usuarioSession = { tipoCliente: "", tipoClienteRequest: "", telefono: "", claroPuntos: 0, razonSocial: "" };
        $scope.usuarioSession.tipoClienteRequest = WPSTipoCliente.consumer;
        $scope.mensaje_upps_titulo = WPSMensajeError.upps;
        $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
        $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;
        _controllerCompras = this;
        $scope.urlInicio = WPSURLMiClaroRoot;
        $scope.urlLocal = "/wps/myportal/miclaro/consumer/comprasyrecargas/";
        var categoriaMovil = WPSCategoria.movil;
        var tipoLineaTodos = WPSTipoLinea.todos;
        var tipoPermisoReq = WPSTipoPermiso.todos;
        var titularesAfiliadosEmp = WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado;
        var idProductoPrincipal = "";
        var AUDIT_EXITO = "SUCCESS";
        var AUDIT_ERROR = "ERROR";
        $scope.creditoSaldo = { lblLineaCredito: 0, lineaCredito: 0, lblSimboloLineaCredito: "", lblSaldoPrepago: "", lblSimboloMonedaSaldoPrep: "" };
        $scope.showCreditoSaldo = true;
        $scope.showSelectorMixto = false;
        $scope.cmbModLineaSelec = null;
        $scope.showCmbModLineaSelec = true;
        $scope.categoriaSeleccionada = { idCategoriaDeCompra: "", nombre: "" };
        $scope.productoSeleccionado = { idProductoDeCompra: "", nombre: "", idMetodoPago: "", precioMoneda: "", simboloMoneda: "", precioPuntos: "", fechaVigencia: "", lblCosto: "", lblNombre: "", codigo: "" };
        $scope.productoSeleccionarCompra = { fechaVigencia: "", precioMoneda: "", simboloMoneda: "", cantidad: "", unidadCantidad: "" };
        $scope.medioSeleccionado;
        $scope.pagarProductoDeCompraResponse;
        $scope.numeroOrden;
        $scope.indCompraExito = null;
        $scope.msgErrorConsumer = "";
        $scope.medioClaroPuntos = { nombre: "", verMedioClaroPuntos: false };
        $scope.medioPagarRecibo = { nombre: "", verMedioPagarRecibo: false, verTerminos: false };
        $scope.medioTarjetaCredito = { nombre: "", verMedioTarjetaCredito: false };
        $scope.medioSaldoPrepago = { nombre: "", verMedioSaldoPrepago: false };
        $scope.verTerminosCondEnRecibos = false;
        $scope.showListaCategoriasDeCompra = true;
        $scope.showListaProductosDeCompra = true;
        $scope.showListaProductosDePago = true;
        $scope.showPantalla = null;
        $scope.showPantallaSupendida = false;
        $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
        $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
        $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;

        init();


        function init() {

            cargarDatosUsuario().then(function() {
                if ($scope.usuarioSession.tipoClienteRequest == WPSTipoCliente.mixto) {
                    $scope.showSelectorMixto = true;
                }


                if ($scope.usuarioSession.flagProductoMovilSesion == 1 || $scope.usuarioSession.flagProductoMovilSesion == 3) {
                    asignarEventoChecks();
                    asignarEventoTerminos();
                    cargarTextoTerminos();
                    cargarComboLinea();
                } else {
                    $scope.showPantalla = false;
                    $scope.showFlagServiciosMovil = true;
                }
            });

        }

        $scope.switchChange = function() {
            window.location.replace("/wps/myportal/miclaro/corporativo/comprasyrecargas");
        };

        this.cambiarLinea = function() {
            $scope.showCreditoSaldo = false;
            $scope.showCreditoSaldo_error = false;
            $("#contentcompras").hide();

            var requestJson = crearRequestObtenerEstadoServicio();

            ComprasyRecargasService.obtenerEstadoServicio(requestJson).then(function(response) {

                var estado = response.data.obtenerEstadoServicioResponse.estadoServicio;
                var idRespuestaConsulta = parseInt(response.data.obtenerEstadoServicioResponse.defaultServiceResponse.idRespuesta);
                if (idRespuestaConsulta == 0) {
                    if (estado != 'Suspendido') {
                        $scope.showPantallaSupendida = false;
                        $scope.creditoSaldo.lineaCredito = 0;
                        $scope.creditoSaldo.lblSaldoPrepago = 0;
                        cargarObtenerCreditoSaldoProducto($scope.cmbModLineaSelec.ProductoServicioResponse);

                        actualizarProductoPrincipalSesion($scope.cmbModLineaSelec);
                    } else {
                        $scope.showPantalla = true;
                        $scope.showPantallaSupendida = true;

                        actualizarProductoPrincipalSesion($scope.cmbModLineaSelec);
                    }
                } else {
                    $scope.showPantalla = false;
                }

            }, function(error) {

            });

        };

        function cargarDatosUsuario() {
            return ComunUsuarioSesionService.obtenerDatosUsuario().then(function(response) {

                var idRespuestaConsulta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                if (idRespuestaConsulta == 0) {
                    $scope.usuarioSession.tipoCliente = response.data.comunResponseType.tipoCliente;
                    $scope.usuarioSession.telefono = response.data.comunResponseType.telefono;
                    $scope.usuarioSession.claroPuntos = response.data.comunResponseType.claroPuntos;
                    $scope.usuarioSession.razonSocial = response.data.comunResponseType.razonSocial;
                    $scope.usuarioSession.flagProductoMovilSesion = parseInt(response.data.comunResponseType.flagProductoMovilSesion);
                    $scope.idProductoPrincipal = response.data.comunResponseType.productoPrincipal;
                } else if (idRespuestaConsulta > 0) {
                    $scope.errorFuncional = true;
                } else {
                    $scope.showPantalla = false;
                }
            }, function(error) {
                $scope.showPantalla = false;
                $scope.errorTecnico = true;
            });

        };

        function cargarComboLinea() {
            ComunUsuarioSesionService.obtenerDatosSesion().then(function(response) {
                idProductoPrincipal = response.data.comunResponseType.productoPrincipal;
            }).then(function() {
                consultarProductoServicios(idProductoPrincipal).then(function() {
                    $scope.showPantalla = true;
                    if ($scope.cmbModLineaSelec != null) {
                        obtenerCategoriasDeCompra();
                    }
                });
            }, function(error) {

                $scope.showPantalla = false;
            });
        };

        function consultarProductoServicios(idProdPrincipal) {

            var requestJson = crearRequestServicios();

            return ComprasyRecargasService.obtenerServicios(requestJson).then(function(response) {

                var idRespuestaConsulta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
                if (idRespuestaConsulta == 0) {
                    $scope.listProductoPostpago = response.data.obtenerServiciosResponse.listadoProductosServicios;
                    if (Array.isArray(response.data.obtenerServiciosResponse.listadoProductosServicios)) {
                        var flag_next = true;
                        angular.forEach($scope.listProductoPostpago, function(val, key) {
                            if (flag_next) {
                                if (val.ProductoServicioResponse.idProductoServicio == idProdPrincipal) {
                                    $scope.cmbModLineaSelec = $scope.listProductoPostpago[key];
                                    flag_next = false;
                                }
                            }
                        });
                        if (flag_next) {
                            $scope.cmbModLineaSelec = $scope.listProductoPostpago[0];
                        }

                    } else {
                        $scope.listProductoPostpago = [];
                        $scope.listProductoPostpago.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                        $scope.cmbModLineaSelec = $scope.listProductoPostpago[0];
                        $(".pullservicio").addClass("disabled");
                    }
                    var requestJson = crearRequestObtenerEstadoServicio();
                    ComprasyRecargasService.obtenerEstadoServicio(requestJson).then(function(response) {
                        var estado = response.data.obtenerEstadoServicioResponse.estadoServicio;
                        var idRespuestaConsulta = parseInt(response.data.obtenerEstadoServicioResponse.defaultServiceResponse.idRespuesta);
                        if (idRespuestaConsulta == 0) {
                            if (estado != 'Suspendido') {
                                cargarObtenerCreditoSaldoProducto($scope.cmbModLineaSelec.ProductoServicioResponse);
                                $scope.showCmbModLineaSelec = true;
                                $scope.showPantalla = true;
                                $scope.errorTecnico = false;
                            } else {
                                $scope.showPantalla = true;
                                $scope.showPantallaSupendida = true;
                                actualizarProductoPrincipalSesion($scope.cmbModLineaSelec);
                            }
                        } else {
                            $scope.showPantalla = false;
                        }
                    }, function(error) {

                    });
                } else {
                    $scope.showPantalla = false;
                    $scope.showCmbModLineaSelec = false;
                    manejarErrores(idRespuestaConsulta);
                }
            }, function(error) {
                $scope.showPantalla = false;
                $scope.showCmbModLineaSelec = false;
                $scope.errorTecnico = true;
            });
        }

        function cargarObtenerCreditoSaldoProducto(productoServicio) {

            var requestJson = crearRequestSaldo(productoServicio);
            ComprasyRecargasService.obtenerCreditoSaldoProducto(requestJson).then(function(response) {

                var idRespuestaConsulta = response.data.obtenerCreditoSaldoProductoResponse.defaultServiceResponse.idRespuesta;
                if (idRespuestaConsulta == 0) {
                    $scope.creditoSaldo.lblSimboloLineaCredito = response.data.obtenerCreditoSaldoProductoResponse.simboloMonedaLineaDisp;
                    $scope.creditoSaldo.lblSimboloMonedaSaldoPrep = response.data.obtenerCreditoSaldoProductoResponse.simboloMonedaSaldoPrep;
                    $scope.creditoSaldo.lineaCredito = response.data.obtenerCreditoSaldoProductoResponse.lineaDisponible;
                    $scope.creditoSaldo.lblSaldoPrepago = response.data.obtenerCreditoSaldoProductoResponse.saldoPrepago;
                    $scope.showCreditoSaldo = true;
                    if ($scope.cmbModLineaSelec.ProductoServicioResponse.tipoLinea == 1) {
                        $scope.textoCreditoSaldo = "Saldo Prepagado";
                        $scope.simboloCreditoSaldo = response.data.obtenerCreditoSaldoProductoResponse.simboloMonedaSaldoPrep;
                        $scope.montoCreditoSaldo = response.data.obtenerCreditoSaldoProductoResponse.saldoPrepago;
                    } else {
                        if ($scope.cmbModLineaSelec.ProductoServicioResponse.tipoLinea == 2) {
                            if ($scope.cmbModLineaSelec.ProductoServicioResponse.tipoPermiso == 4) {
                                $scope.textoCreditoSaldo = "Línea de Crédito";
                                $scope.simboloCreditoSaldo = response.data.obtenerCreditoSaldoProductoResponse.simboloMonedaLineaDisp;
                                $scope.montoCreditoSaldo = response.data.obtenerCreditoSaldoProductoResponse.lineaDisponible;
                            } else {
                                if ($scope.cmbModLineaSelec.ProductoServicioResponse.tipoPermiso == 1 || $scope.cmbModLineaSelec.ProductoServicioResponse.tipoPermiso == 2) {
                                    $scope.textoCreditoSaldo = "Saldo Prepagado";
                                    $scope.simboloCreditoSaldo = response.data.obtenerCreditoSaldoProductoResponse.simboloMonedaSaldoPrep;
                                    $scope.montoCreditoSaldo = response.data.obtenerCreditoSaldoProductoResponse.saldoPrepago;
                                }
                            }
                        }
                    }

                    mostrarCredito($scope.montoCreditoSaldo);

                    obtenerCategoriasDeCompra();
                    $scope.showCreditoSaldo = true;
                    $scope.showCreditoSaldo_error = false;

                } else {
                    $scope.showCreditoSaldo = false;
                    $scope.showCreditoSaldo_error = true;
                }

            });

        };

        function mostrarCredito(fin) {
            var numFin = parseFloat(fin);
            var numIni = parseFloat("0");
            contador(numIni, numFin, 2);
        }

        function contador(numIni, numFin, paso) {

            numIni = numIni + paso;
            if (numIni < numFin) {
                document.getElementById("spanCounter").innerHTML = numIni.toFixed(2);
                setTimeout(function() { contador(numIni, numFin, paso) }, 7);
            } else {
                document.getElementById("spanCounter").innerHTML = numFin.toFixed(2);
            }
        }

        function crearRequestServicios() {

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
            return requestServiciosMoviles;
        }

        function crearRequestSaldo(productoServicio) {

            var requestData = {
                idProductoServicio: productoServicio.idProductoServicio,
                idCuenta: productoServicio.idCuenta,
                idRecibo: productoServicio.idRecibo
            };
            return requestData;
        }

        function obtenerCategoriasDeCompra() {

            var request = crearRequestCategorias();
            ComprasyRecargasService.obtenerCategoriasDeCompra(request).then(function(response) {

                var idRespuestaConsulta = parseInt(response.data.obtenerCategoriasDeCompraResponse.defaultServiceResponse.idRespuesta);
                if (idRespuestaConsulta == 0) {
                    if (Array.isArray(response.data.obtenerCategoriasDeCompraResponse.listaCategoriasDeCompra)) {
                        $scope.listaCategoriasDeCompra = response.data.obtenerCategoriasDeCompraResponse.listaCategoriasDeCompra
                    } else {
                        $scope.listaCategoriasDeCompra = [];
                        $scope.listaCategoriasDeCompra.push(response.data.obtenerCategoriasDeCompraResponse.listaCategoriasDeCompra);
                    }
                    $scope.showListaCategoriasDeCompra = true;
                } else {
                    $scope.showListaCategoriasDeCompra = false;
                    manejarErrores(idRespuestaConsulta);
                }
            }, function(error) {
                $scope.showPantalla = false;
                $scope.showListaCategoriasDeCompra = false;
                $scope.errorTecnico = true;
            });

        };

        function obtenerProductosDeCompra(idCategoriaDeCompra, funcionAnimacion) {

            var request = crearRequestProductosCompra(idCategoriaDeCompra);

            ComprasyRecargasService.obtenerProductosDeCompra(request).then(function(response) {


                var idRespuestaConsulta = parseInt(response.data.obtenerProductosDeCompraResponse.defaultServiceResponse.idRespuesta);
                if (idRespuestaConsulta == 0) {
                    if (Array.isArray(response.data.obtenerProductosDeCompraResponse.listaProductosDeCompra)) {
                        $scope.listaProductosDeCompra = response.data.obtenerProductosDeCompraResponse.listaProductosDeCompra;
                    } else {
                        $scope.listaProductosDeCompra = [];
                        $scope.listaProductosDeCompra.push(response.data.obtenerProductosDeCompraResponse.listaProductosDeCompra);
                    }
                    $scope.showListaProductosDeCompra = true;
                    enviarPaqueteAnalytics();
                } else {
                    $scope.showListaProductosDeCompra = false;
                    manejarErrores(idRespuestaConsulta);
                }
            }, function(error) {
                $scope.showPantalla = false;
                $scope.showListaProductosDeCompra = false;
                $scope.errorTecnico = true;
            }).then(function() {
                funcionAnimacion();
            });
        }

        function crearRequestCategorias() {
            return {
                idCuenta: $scope.cmbModLineaSelec.ProductoServicioResponse.idCuenta,
                idRecibo: $scope.cmbModLineaSelec.ProductoServicioResponse.idRecibo,
                idProductoServicio: $scope.cmbModLineaSelec.ProductoServicioResponse.idProductoServicio,
                tipoLinea: $scope.cmbModLineaSelec.ProductoServicioResponse.tipoLinea,
                tipoCliente: $scope.usuarioSession.tipoClienteRequest,
                tipoPermiso: $scope.cmbModLineaSelec.ProductoServicioResponse.tipoPermiso

            }
        }

        function crearRequestProductosCompra(idCategoriaDeCompra) {

            return {
                "idCategoriaDeCompra": idCategoriaDeCompra,
                claroPuntosCliente: $scope.usuarioSession.claroPuntos,
                tipoLinea: $scope.cmbModLineaSelec.ProductoServicioResponse.tipoLinea,
                tipoCliente: $scope.usuarioSession.tipoClienteRequest,
                tipoPermiso: $scope.cmbModLineaSelec.ProductoServicioResponse.tipoPermiso,
                idCuenta: $scope.cmbModLineaSelec.ProductoServicioResponse.idCuenta,
                idRecibo: $scope.cmbModLineaSelec.ProductoServicioResponse.idRecibo,
                idProductoServicio: $scope.cmbModLineaSelec.ProductoServicioResponse.idProductoServicio,
            }
        }

        function crearRequestMediosPago(idCategoriaDeCompra, prodSeleccionado) {

            var requestProductosCompra = {
                idCuenta: $scope.cmbModLineaSelec.ProductoServicioResponse.idCuenta,
                idRecibo: $scope.cmbModLineaSelec.ProductoServicioResponse.idRecibo,
                idProductoServicio: $scope.cmbModLineaSelec.ProductoServicioResponse.idProductoServicio,
                tipoCliente: $scope.usuarioSession.tipoClienteRequest,
                "idCategoriaDeCompra": idCategoriaDeCompra,
                idProductoDeCompra: prodSeleccionado.idProductoDeCompra,
                tipoLinea: $scope.cmbModLineaSelec.ProductoServicioResponse.tipoLinea,
                tipoPermiso: $scope.cmbModLineaSelec.ProductoServicioResponse.tipoPermiso
            }
            return requestProductosCompra;
        }

        this.obtenerClassDeCategoria = function(catComp, estilos) {
            var clazz = "";
            if (catComp.idCategoriaDeCompra === WPSCategoriasDeCompra.internet) {
                clazz = estilos + 'internet';
            } else if (catComp.idCategoriaDeCompra === WPSCategoriasDeCompra.voz) {
                clazz = estilos + 'voz';
            } else if (catComp.idCategoriaDeCompra === WPSCategoriasDeCompra.smsmms) {
                clazz = estilos + 'smsmms';
            } else if (catComp.idCategoriaDeCompra === WPSCategoriasDeCompra.soles) {
                clazz = estilos + 'soles';
            }
            return clazz;
        }

        function obtenerMediosDePago(idCategoriaDeCompra, prodSeleccionado) {
            var request = crearRequestMediosPago(idCategoriaDeCompra, prodSeleccionado);
            marcarCheckTerminos(false);

            ComprasyRecargasService.obtenerMetodosPago(request).then(function(response) {

                var idRespuestaConsulta = parseInt(response.data.obtenerMetodosPagoResponse.defaultServiceResponse.idRespuesta);
                var mensaje = response.data.obtenerMetodosPagoResponse.defaultServiceResponse.mensaje;
                $scope.inicioTransaccionTCResponse = response.data.obtenerMetodosPagoResponse;
                if (idRespuestaConsulta == 0) {
                    if ($scope.listaMetodoPago.length > 0) {
                        $scope.listaMetodoPago = [];
                    }

                    if (Array.isArray(response.data.obtenerMetodosPagoResponse.listaMetodoPago)) {
                        $scope.listaMetodoPago = response.data.obtenerMetodosPagoResponse.listaMetodoPago;
                    } else {
                        $scope.listaMetodoPago = [];
                        $scope.listaMetodoPago.push(response.data.obtenerMetodosPagoResponse.listaMetodoPago);

                    }

                    enviarMetodosAnalytics();
                    $scope.showListaProductosDePago = true;
                    configurarIndicadores();
                } else {
                    $scope.indCompraExito = false;
                    $scope.medioSeleccionado = '';
                    $scope.medioSeleccionado.codigo = '';
                    enviarAuditoria(request, $scope.inicioTransaccionTCResponse, AUDIT_ERROR, 'obtenerMetodosPago - ' + mensaje);
                    manejarErrores(idRespuestaConsulta);
                    $scope.showListaProductosDePago = false;
                }
            }, function(error) {
                $scope.showPantalla = false;
                $scope.errorTecnico = true;
                $scope.showListaProductosDePago = false;
            }).then(function() {

            });
        }

        function configurarIndicadores() {
            $scope.verMedioClaroPuntos = false;
            $scope.verMedioPagarRecibo = false;
            $scope.verMedioTarjetaCredito = false;
            $scope.verMedioSaldoPrepago = false;
            $scope.medioClaroPuntos.verMedioClaroPuntos = false;
            $scope.medioPagarRecibo.verMedioPagarRecibo = false;
            $scope.medioTarjetaCredito.verMedioTarjetaCredito = false;
            $scope.medioSaldoPrepago.verMedioSaldoPrepago = false;

            if ($scope.listaMetodoPago != null) {

                angular.forEach($scope.listaMetodoPago, function(value, key, obj) {
                    if (value.tipoMetodoPago == WPSMediosDePago.puntosClaro.codigo) {

                        $scope.medioClaroPuntos.idMetodoPago = value.idMetodoPago;
                        $scope.medioClaroPuntos.nombre = value.nombre;
                        $scope.medioClaroPuntos.precioPuntos = value.precioMoneda;
                        $scope.medioClaroPuntos.cantidad = value.cantidad;
                        $scope.medioClaroPuntos.verMedioClaroPuntos = true;
                        $scope.medioClaroPuntos.claroPuntos = value.totalClaroPuntos;
                        var request = {
                            nombre: value.nombre,
                            idMetodoPago: value.idMetodoPago,
                            fechaVigencia: value.fechaVigencia,
                            precioMoneda: value.precioMoneda,
                            simboloMoneda: value.simboloMoneda,
                            cantidad: value.cantidad,
                            unidadCantidad: value.unidadCantidad
                        };
                        $scope.medioClaroPuntos.response = request;


                        if (parseInt($scope.medioClaroPuntos.claroPuntos) <= parseInt($scope.medioClaroPuntos.cantidad)) {
                            $('#btMetodoPuntos').prop('disabled', true);
                            $('#btMetodoPuntos').removeClass('bt-red');
                            $('#btMetodoPuntos').addClass('bt-red bt-gris');
                        } else {
                            $('#btMetodoPuntos').prop('disabled', false);
                            $('#btMetodoPuntos').addClass('bt-red');
                            $('#btMetodoPuntos').removeClass('bt-gris');
                        }


                    } else if (value.tipoMetodoPago == WPSMediosDePago.cargarEnRecibo.codigo) {
                        $scope.medioPagarRecibo.idMetodoPago = value.idMetodoPago;
                        $scope.medioPagarRecibo.nombre = value.nombre;
                        $scope.medioPagarRecibo.verTerminos = value.flagMuestraTerminosCondiciones;
                        $scope.medioPagarRecibo.verMedioPagarRecibo = true;
                        var request = {
                            nombre: value.nombre,
                            idMetodoPago: value.idMetodoPago,
                            fechaVigencia: value.fechaVigencia,
                            precioMoneda: value.precioMoneda,
                            simboloMoneda: value.simboloMoneda,
                            cantidad: value.cantidad,
                            unidadCantidad: value.unidadCantidad
                        };
                        $scope.medioPagarRecibo.response = request;
                        if (parseFloat($scope.montoCreditoSaldo) >= parseFloat(value.precioMoneda)) {

                            $('#btMetodoRecibo').addClass('bt-red');
                            $('#btMetodoRecibo').removeClass('bt-gris');
                            $('#btMetodoRecibo').prop('disabled', false);
                            enablePagar(true);
                         
                        } else {
                           enablePagar(false);
                            $('#btMetodoPrepago').prop('disabled', true);
                            $('#btMetodoRecibo').removeClass('bt-red');
                            $('#btMetodoRecibo').addClass('bt-red bt-gris');
                        }

                    } else if (value.tipoMetodoPago == WPSMediosDePago.tarjetaCredito.codigo) {
                        $scope.medioTarjetaCredito.idMetodoPago = value.idMetodoPago;
                        $scope.medioTarjetaCredito.nombre = value.nombre;
                        $scope.medioTarjetaCredito.verMedioTarjetaCredito = true;

                        var request = {
                            nombre: value.nombre,
                            idMetodoPago: value.idMetodoPago,
                            fechaVigencia: value.fechaVigencia,
                            precioMoneda: value.precioMoneda,
                            simboloMoneda: value.simboloMoneda,
                            cantidad: value.cantidad,
                            unidadCantidad: value.unidadCantidad
                        };
                        $scope.medioTarjetaCredito.response = request;
                    } else if (value.tipoMetodoPago == WPSMediosDePago.saldoPrepago.codigo) {
                        $scope.medioSaldoPrepago.idMetodoPago = value.idMetodoPago;
                        $scope.medioSaldoPrepago.nombre = value.nombre;
                        $scope.medioSaldoPrepago.verMedioSaldoPrepago = true;
                        var request = {
                            nombre: value.nombre,
                            idMetodoPago: value.idMetodoPago,
                            fechaVigencia: value.fechaVigencia,
                            precioMoneda: value.precioMoneda,
                            simboloMoneda: value.simboloMoneda,
                            cantidad: value.cantidad,
                            unidadCantidad: value.unidadCantidad
                        };
                        $scope.medioSaldoPrepago.response = request;
                        if (parseFloat($scope.creditoSaldo.lblSaldoPrepago) >= parseFloat(value.precioMoneda)) {
                            $('#btMetodoPrepago').addClass('bt-red');
                            $('#btMetodoPrepago').removeClass('bt-gris');
                            $('#btMetodoPrepago').prop('disabled', false);
                        } else {
                            $('#btMetodoPrepago').prop('disabled', true);
                            $('#btMetodoPrepago').removeClass('bt-red');
                            $('#btMetodoPrepago').addClass('bt-red bt-gris');
                        }

                    }

                });

            }
        }

        var optcurrent = undefined;

        this.seleccionarCategoria = function(myControl, catSeleccionado) {
            $scope.categoriaSeleccionada = catSeleccionado;
            enviarCategoriaAnalytics(catSeleccionado);
            var elThis = $(myControl);
            var elTarget = $('#contentcompras');
            elThis.addClass("this");
            if (optcurrent != undefined) {
                optcurrent.removeClass("this");
            }

            optcurrent = elThis;
            elTarget.slideUp(350);
            setTimeout(function() {
                obtenerProductosDeCompra($scope.categoriaSeleccionada.idCategoriaDeCompra, function() {
                    elTarget.slideDown(350);
                    setTimeout(function() {
                        scrollTo(elTarget);
                    }, 350);
                    renderItemsLoaded();
                });

            }, 550);


            $(".categoriacompra").removeClass("this");
            var idcategoria = catSeleccionado.idCategoriaDeCompra;
            $("#categoriaCompra" + idcategoria).addClass("this");

        };

        var optthis = undefined;
        this.seleccionarPaquete = function(myControl, seleccionado) {

            $scope.productoSeleccionado = seleccionado;
            enviarPaqueteSelecAnalytics(seleccionado);
            var elThis = $(myControl);
            elThis.addClass("this");
            if (optthis != undefined) {
                optthis.removeClass("this");
            }
            optthis = elThis;
            obtenerMediosDePago($scope.categoriaSeleccionada.idCategoriaDeCompra, $scope.productoSeleccionado);

            $('.step-payment').slideDown(250).addClass("open");
            setTimeout(function() {
                scrollTo($('.step-payment'));
            }, 350);


            $(".productocompra").removeClass("this");
            var idproductocompra = seleccionado.idProductoDeCompra;
            $("#productocompra" + idproductocompra).addClass("this");

        }

        function asignarValoresSeleccionados() {

            $scope.productoSeleccionado.lblNombre = $scope.productoSeleccionado.nombre;
            $scope.prodSeleccionadoFechaSeleccionada = ($scope.productoSeleccionado.fechaVigencia).substr(0, 10);
            var costo = "";
            if (WPSMediosDePago.puntosClaro.codigo === $scope.medioSeleccionado.codigo) {
                $scope.productoSeleccionado.lblCosto = $scope.medioClaroPuntos.cantidad + " puntos";
                $scope.productoSeleccionado.codigo = $scope.medioSeleccionado.codigo;
            } else {
                $scope.productoSeleccionado.codigo = $scope.medioSeleccionado.codigo;
            }

        }

        this.seleccionarMedioPuntos = function(myControl, nombre) {
            seleccionarMedio(myControl, WPSMediosDePago.puntosClaro, nombre);
        }
        this.seleccionarMedioRecibos = function(myControl, nombre) {
            seleccionarMedio(myControl, WPSMediosDePago.cargarEnRecibo, nombre);
        }
        this.seleccionarMedioCredito = function(myControl, nombre) {
            seleccionarMedio(myControl, WPSMediosDePago.tarjetaCredito, nombre);
        }
        this.seleccionarMedioPrepago = function(myControl, nombre) {
            seleccionarMedio(myControl, WPSMediosDePago.saldoPrepago, nombre);
        }

        function seleccionarMedio(control, medio, nombre) {
            $scope.medioSeleccionado = medio;
            slideDownMedio(control);
            enviarMetodoSelecAnalytics(nombre);
        }

        this.elegirMetodo = function(boton, response) {

            $scope.productoSeleccionado.idMetodoPago = response.idMetodoPago;
            $scope.productoSeleccionado.fechaVigencia = response.fechaVigencia;
            $scope.productoSeleccionado.precioMoneda = response.precioMoneda;
            $scope.productoSeleccionado.simboloMoneda = response.simboloMoneda;
            $scope.productoSeleccionado.cantidad = response.cantidad;
            $scope.productoSeleccionado.unidadCantidad = response.unidadCantidad;

            asignarValoresSeleccionados();
            abrirConfirmacion(boton);
            enviarConfirmacionAnalytics();
        }

        this.hacerCompra = function() {
            ocultarPopUp();
            abrirEnProceso();

            if (WPSMediosDePago.tarjetaCredito.codigo === $scope.medioSeleccionado.codigo) {
                hacerCompraTC();
            } else if (WPSMediosDePago.puntosClaro.codigo === $scope.medioSeleccionado.codigo) {
                otrasCompras(true);
            } else {

                otrasCompras(false);
            }
        }

        function obtenerReqCompra() {

            var requestData = {
                idCuenta: $scope.cmbModLineaSelec.ProductoServicioResponse.idCuenta,
                idRecibo: $scope.cmbModLineaSelec.ProductoServicioResponse.idRecibo,
                idProductoServicio: $scope.cmbModLineaSelec.ProductoServicioResponse.idProductoServicio,
                idCategoriaDeCompra: $scope.categoriaSeleccionada.idCategoriaDeCompra,
                idProductoDeCompra: $scope.productoSeleccionado.idProductoDeCompra,
                idMetodoPago: $scope.medioSeleccionado.codigo,
                tipoLinea: $scope.cmbModLineaSelec.ProductoServicioResponse.tipoLinea,
                tipoCliente: WPSTipoCliente.consumer,
                tipoPermiso: $scope.cmbModLineaSelec.ProductoServicioResponse.tipoPermiso
            }

            if (WPSMediosDePago.puntosClaro.codigo === $scope.medioSeleccionado.codigo) {
                requestData.precioPuntos = $scope.medioClaroPuntos.cantidad;
            } else {
                requestData.precioMoneda = $scope.productoSeleccionado.precioMoneda;
            }
            return requestData;
        }

        function otrasCompras(isCompraPuntos) {

            var request = obtenerReqCompra();

            ComprasyRecargasService.pagarProductoDeCompra(request).then(function(response) {

                var idRespuestaConsulta = parseInt(response.data.pagarProductoDeCompraResponse.defaultServiceResponse.idRespuesta);
                var mensaje = response.data.pagarProductoDeCompraResponse.defaultServiceResponse.mensaje;
                $scope.pagarProductoDeCompraResponse = response.data.pagarProductoDeCompraResponse;

                if (idRespuestaConsulta == 0) {
                    $scope.pagarProductoDeCompraResponse.descripcion = 'La transacción fue realizada con éxito';
                    $scope.indCompraExito = true;
                    enviarAuditoria(request, $scope.pagarProductoDeCompraResponse, AUDIT_EXITO, '-');
                    enviarCompraAnalytics();
                    if (isCompraPuntos) {
                        ComprasyRecargasService.actualizarClaroPuntosSesion();
                    }
                } else {
                    $scope.pagarProductoDeCompraResponse.descripcion = 'La transacción no pudo ser realizada';
                    $scope.indCompraExito = false;
                    enviarAuditoria(request, $scope.pagarProductoDeCompraResponse, AUDIT_ERROR, 'pagarProductoDeCompra - ' + mensaje);
                }
                $scope.servicioCompartido.actualizarDatos($scope.pagarProductoDeCompraResponse,
                    $scope.productoSeleccionado,
                    $scope.categoriaSeleccionada,
                    $scope.medioSeleccionado,
                    $scope.indCompraExito);

                $location.path("/confirmacionCompra");
            }, function(error) {
                $scope.errorTecnico = true;
                $scope.indCompraExito = false;

            });
        }

        function obtenerReqCompraTC() {

            var requestData = {
                tipoTransaccion: "2",
                categoria: null,
                tipoCliente: $scope.usuarioSession.tipoClienteRequest,
                idCuenta: $scope.cmbModLineaSelec.ProductoServicioResponse.idCuenta,
                idRecibo: $scope.cmbModLineaSelec.ProductoServicioResponse.idRecibo,
                idDireccion: null,
                idProductoServicio: $scope.cmbModLineaSelec.ProductoServicioResponse.idProductoServicio,
                idServicioPrincipalFijo: null,
                importePago: $scope.productoSeleccionado.precioMoneda,
                codigoMoneda: "1",
                idCategoriaDeCompra: $scope.categoriaSeleccionada.idCategoriaDeCompra,
                idProductoDeCompra: $scope.productoSeleccionado.idProductoDeCompra + "-" + $scope.productoSeleccionado.idMetodoPago

            };

            return requestData;
        }

        function crearRequestObtenerEstadoServicio() {
            var requestObtenerEstadoServicio = {
                categoria: categoriaMovil,
                idProductoServicio: $scope.cmbModLineaSelec.ProductoServicioResponse.idProductoServicio,
                idDireccion: null,
                idCuenta: $scope.cmbModLineaSelec.ProductoServicioResponse.idCuenta,
                idRecibo: $scope.cmbModLineaSelec.ProductoServicioResponse.idRecibo,
                idLinea: $scope.cmbModLineaSelec.ProductoServicioResponse.idLinea
            }
            return requestObtenerEstadoServicio;

        }

        function hacerCompraTC() {

            var request = obtenerReqCompraTC();

            ComprasyRecargasService.registrarInicioTransaccionPagoTC(request).then(function(response) {

                var idRespuestaConsulta = parseInt(response.data.registrarInicioTransaccionPagoTCResponse.defaultServiceResponse.idRespuesta);
                var mensaje = response.data.registrarInicioTransaccionPagoTCResponse.defaultServiceResponse.mensaje;
                var inicioTransaccionTCResponse = response.data.registrarInicioTransaccionPagoTCResponse;

                if (idRespuestaConsulta == 0) {

                    abrirCulqui(inicioTransaccionTCResponse);
                    enviarAuditoria(request, $scope.inicioTransaccionTCResponse, AUDIT_EXITO, '-');
                } else {
                    $('.compra-confirm-popup-progress').hide();
                    $('#ErrorProgreso').show();
                    enviarAuditoria(request, $scope.inicioTransaccionTCResponse, AUDIT_ERROR, 'registrarInicioTransaccionPagoTC - ' + mensaje);

                }

            }, function(error) {
                $scope.errorTecnico = true;
                $scope.indCompraExito = false;

            });
        }

        function abrirCulqui(inicioResponse) {

            var montoFac = parseFloat(inicioResponse.montoFacturar);
            montoFac = montoFac * 100;
            var guardarTok = getBool(inicioResponse.guardarToken);
            $scope.numeroOrden = inicioResponse.numeroOrden;
            Culqi.codigoComercio = inicioResponse.idComercio;

            Culqi.configurar({
                nombre: inicioResponse.nombreComercio,
                orden: inicioResponse.numeroOrden,
                moneda: inicioResponse.codigoMoneda,
                descripcion: inicioResponse.descripcionPago,
                monto: montoFac,
                guardar: guardarTok
            });


            Culqi.abrir();

            setTimeout(function() {
                ocultarPopUp();
            }, 650);
        }
        this.cerrarCulqi = function() {
            if (Culqi.token) {
                abrirEnProceso();
                registrarFinTC($scope.numeroOrden, Culqi.token.id);
            } else {

                alert(Culqi.error.mensaje);
            }

        };

        function registrarFinTC(orden, tokenId) {

            var request = { numeroOrden: orden, objeto: tokenId };

            ComprasyRecargasService.registrarFinTransaccionPagoTC(request).then(function(response) {
                var idRespuestaConsulta = parseInt(response.data.registrarFinTransaccionPagoTCResponse.defaultServiceResponse.idRespuesta);
                var mensaje = response.data.registrarFinTransaccionPagoTCResponse.defaultServiceResponse.mensaje;
                var inicioTransaccionTCResponse = response.data.registrarFinTransaccionPagoTCResponse;
                $scope.pagarProductoDeCompraResponse = response.data.registrarFinTransaccionPagoTCResponse;
                if (idRespuestaConsulta == 0) {
                    $scope.pagarProductoDeCompraResponse.descripcionResultadoOperacion = 'La transacción fue realizada con éxito';
                    $scope.indCompraExito = true;
                    enviarAuditoria(request, $scope.inicioTransaccionTCResponse, AUDIT_EXITO, '-');
                    enviarCompraAnalytics();
                } else {
                    $scope.pagarProductoDeCompraResponse.descripcionResultadoOperacion = 'La transacción no pudo ser realizada';
                    $scope.indCompraExito = false;
                    enviarAuditoria(request, $scope.inicioTransaccionTCResponse, AUDIT_ERROR, 'registrarFinTransaccionPagoTC - ' + mensaje);
                }
                $scope.servicioCompartido.actualizarDatos($scope.pagarProductoDeCompraResponse,
                    $scope.productoSeleccionado,
                    $scope.categoriaSeleccionada,
                    $scope.medioSeleccionado,
                    $scope.indCompraExito);
                ocultarPopUp();
                $location.path("/confirmacionCompra");

            }, function(error) {
                $scope.errorTecnico = true;
                $scope.indCompraExito = false;


            });

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


        $scope.refreshPortlet = function(indicadorError) {
            if (indicadorError == '1') {
                cargarComboLinea();
            } else if (indicadorError == '2') {
                cargarObtenerCreditoSaldoProducto($scope.cmbModLineaSelec.ProductoServicioResponse);
                obtenerCategoriasDeCompra();
            } else if (indicadorError == '3') {
                obtenerCategoriasDeCompra();
            } else if (indicadorError == '4') {
                obtenerProductosDeCompra($scope.categoriaSeleccionada.idCategoriaDeCompra, function() {});
            } else if (indicadorError == '5') {
                obtenerMediosDePago($scope.categoriaSeleccionada.idCategoriaDeCompra, $scope.productoSeleccionado);
            }

        };

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

        function enviarAuditoria(request, response, estadoAudit, descripcion) {
            resquestAuditoria = crearRequestAudit($scope.usuarioSession, $scope.categoriaSeleccionada,
                $scope.medioSeleccionado.codigo, request, response, $scope.cmbModLineaSelec, estadoAudit, descripcion);
            ComunUsuarioSesionService.enviarAuditoria(resquestAuditoria).then(function(response) {

            }, function(error) {

            });
        }

        function enviarCategoriaAnalytics(categoria) {
            dataLayer.push({
                'event': 'virtualEvent',
                'category': 'Compras y Recargas',
                'action': 'P1: ¿Que necesitas hoy?',
                'label': categoria.nombre
            });
        }

        function enviarPaqueteAnalytics() {
            dataLayer.push({
                'event': 'virtualPage',
                'pageTitle': 'Elige tu paquete - MiClaro',
                'pageUrl': '/comprasyrecargas/elige-tu-paquete'
            });
        }

        function enviarPaqueteSelecAnalytics(paquete) {
            dataLayer.push({
                'event': 'virtualEvent',
                'category': 'Compras y Recargas',
                'action': 'P2: Elige tu paquete',
                'label': paquete.nombre
            });
        }

        function enviarMetodosAnalytics() {
            dataLayer.push({
                'event': 'virtualPage',
                'pageTitle': 'Elige tu método de pago - MiClaro',
                'pageUrl': '/comprasyrecargas/elige-tu-metodo-de-pago'
            });
        }

        function enviarMetodoSelecAnalytics(nombre) {
            dataLayer.push({
                'event': 'virtualEvent',
                'category': 'Compras y Recargas',
                'action': 'P2: Elige tu método de pago',
                'label': nombre
            });
        }

        function enviarConfirmacionAnalytics() {
            dataLayer.push({
                'event': 'virtualPage',
                'pageTitle': 'Confirmación de compra - MiClaro',
                'pageUrl': '/comprasyrecargas/confirma-tu-compra'
            });
        }

        function enviarCompraAnalytics() {
            dataLayer.push({
                'event': 'virtualPage',
                'pageTitle': 'Compra exitosa- MiClaro',
                'pageUrl': '/comprasyrecargas/compra-exitosa'
            });
        }

    });
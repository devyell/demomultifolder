var appController = angular.module('miClaroController', []);

appController.controller("ControllerComprasyRecargas",
        function($scope, $http, $timeout, $location, ComprasyRecargasService, ComunUsuarioSesionService, servicioCompartido) {

            $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
            $scope.switchSelect = true;

            $scope.servicioCompartido = servicioCompartido;
            $scope.listadoCuentas = [];
            $scope.listadoRecibos = [];
            $scope.listadoProductoServicios = [];
            $scope.listaMetodoPago = [];
            var tipoCliente = 2;
            $scope.errorFuncional = false;
            $scope.errorTecnico = false;
            $scope.tipoClienteSession = "";
            $scope.usuarioSession = { tipoCliente: "", tipoClienteRequest: "", telefono: "", claroPuntos: 0, razonSocial: "" };
            tipoCliente = WPSTipoCliente.corporativo;
            _controllerCompras = this;
            $scope.urlInicio = WPSURLMiClaroRoot;
            $scope.urlLocal = "/wps/myportal/miclaro/corporativo/comprasyrecargas/";
            var categoriaMovil = WPSCategoria.movil;
            var tipoPermisoReq = WPSTipoPermiso.todos;
            var tipoLineaTodos = WPSTipoLinea.todos;
            var tipoPermiso = WPSTipoPermiso.todos;
            var titularesAfiliadosEmp = WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado;
            var idProductoPrincipal = "";
            var AUDIT_EXITO = "SUCCESS";
            var AUDIT_ERROR = "ERROR";
            $scope.creditoSaldo = { lblLineaCredito: 0, lineaCredito: 0, lblSimboloLineaCredito: "", lblSaldoPrepago: "", lblSimboloMonedaSaldoPrep: "" };
            $scope.showCreditoSaldo = true;
            $scope.showSelectorMixto = false;
            $scope.selectCuenta = null;
            $scope.selectRecibo = null;
            $scope.cmbModLineaSelec = null;
            $scope.showCmbModLineaSelec = true;
            $scope.categoriaSeleccionada = { idCategoriaDeCompra: "", nombre: "" };
            $scope.productoSeleccionado = { idProductoDeCompra: "", nombre: "", idMetodoPago: "", precioMoneda: "", simboloMoneda: "", precioPuntos: "", fechaVigencia: "", lblCosto: "", lblNombre: "", codigo: "" };
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
            $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
            $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
            $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;

            $scope.mensaje_upps_titulo = WPSMensajeError.upps;
            $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
            $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;


            angular.element(document).ready(function() {
                init();
            });

            function init() {
                cargarDatosUsuario().then(function() {
                    if (tipoCliente == WPSTipoCliente.mixto) {
                        $scope.showSelectorMixto = true;
                    }
                    $scope.flagServiciosMovil = $scope.usuarioSession.flagProductoMovilSesion;
                    if ($scope.usuarioSession.flagProductoMovilSesion > 0) {
                        asignarEventoChecks();
                        asignarEventoTerminos();
                        asignarEventoAutoComplete();
                        agregarEventoBuscarLinea();
                        cargarTextoTerminos();
                        cargarComboCuentas();
                    } else {
                        $scope.showPantalla = false;
                        $("#show_error").show();
                    }
                });
            }

            $scope.switchChange = function() {
                window.location.replace("/wps/myportal/miclaro/consumer/comprasyrecargas");
            };

            this.cambiarLinea = function() {
                $scope.showCreditoSaldo = false;
                $scope.showCreditoSaldo_error = false;
                if ($scope.cmbModLineaSelec != null) {
                    cargarObtenerCreditoSaldoProducto($scope.cmbModLineaSelec.ProductoServicioResponse);
                    obtenerCategoriasDeCompra();
                    actualizarProductoPrincipalSesion($scope.cmbModLineaSelec);
                }
            }


            function cargarDatosUsuario() {
                return ComunUsuarioSesionService.obtenerDatosUsuario().then(function(response) {
                    var idRespuestaConsulta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                    if (idRespuestaConsulta == 0) {
                        $scope.usuarioSession.tipoCliente = response.data.comunResponseType.tipoCliente;
                        $scope.usuarioSession.telefono = response.data.comunResponseType.telefono;
                        $scope.usuarioSession.claroPuntos = response.data.comunResponseType.claroPuntos;
                        $scope.usuarioSession.razonSocial = response.data.comunResponseType.razonSocial;
                        $scope.usuarioSession.flagProductoMovilSesion = parseInt(response.data.comunResponseType.flagProductoMovilSesion);

                    } else if (idRespuestaConsulta > 0) {
                        $scope.errorFuncional = true;
                    } else {
                        $scope.showPantalla = false;
                        $("#show_error").show();
                    }
                }, function(error) {
                    $scope.showPantalla = false;
                    $("#show_error").show();
                    $scope.errorTecnico = true;
                });
            }

            function cargarComboCuentas() {


                ComprasyRecargasService.obtenerListadoMovCorpCuenta().then(function(response) {

                    var idRespuestaConsulta = parseInt(response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idRespuesta);
                    if (idRespuestaConsulta == 0) {
                        if (Array.isArray(response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta)) {
                            $scope.listadoCuentas = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta
                        } else {
                            $scope.listadoCuentas = [];
                            $scope.listadoCuentas.push(response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta);
                        }

                        $scope.selectCuenta = $scope.listadoCuentas[0];
                        $scope.showCmbModLineaSelec = true;
                        cargarComboRecibos(true);

                    } else {
                        $scope.showCmbModLineaSelec = false;
                        manejarErrores(idRespuestaConsulta);

                    }
                });
            }

            function cargarComboRecibos(isCargarLineas) {
                var request = crearRequestRecibos($scope.selectCuenta.idCuenta);
                return ComprasyRecargasService.obtenerListadoMovCorpRecibo(request).then(function(response) {
                    var idRespuestaConsulta = parseInt(response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idRespuesta);
                    if (idRespuestaConsulta == 0) {

                        $scope.listadoRecibos = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo
                        if (!Array.isArray(response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo)) {
                            $scope.listadoRecibos = [];
                            $scope.listadoRecibos.push(response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo);
                        }
                        $scope.selectRecibo = $scope.listadoRecibos[0];

                        $scope.showCmbModLineaSelec = true;
                        if (isCargarLineas) {
                            cargarComboLinea();
                        }
                    } else {
                        $scope.showCmbModLineaSelec = false;
                        manejarErrores(idRespuestaConsulta);
                    }
                });
            }

            function cargarComboLinea() {
                return ComunUsuarioSesionService.obtenerDatosSesion().then(function(response) {

                    if (response.data.comunResponseType.tipoLinea == 1) {
                        $scope.prodPrincipalResponse = response.data.comunResponseType;
                        idProductoPrincipal = null;
                    } else {
                        $scope.prodPrincipalResponse = response.data.comunResponseType;
                        idProductoPrincipal = response.data.comunResponseType.productoPrincipal;

                    }



                }).then(function() {

                    var primeraVez = true;

                    consultarProductoServicios(idProductoPrincipal, primeraVez).then(function() {
                        var encontroPrincipal = false;
                        if (WPSCategoria.movil == $scope.prodPrincipalResponse.categoria &&
                            $scope.prodPrincipalResponse.productoPrincipal != null) {
                            angular.forEach($scope.listProductoPostpago, function(val, key) {
                                if (val.ProductoServicioResponse.idProductoServicio == idProductoPrincipal) {
                                    $scope.cmbModLineaSelec = $scope.listProductoPostpago[key];
                                    encontroPrincipal = true;
                                }
                            });

                        }

                        cargarObtenerCreditoSaldoProducto($scope.cmbModLineaSelec.ProductoServicioResponse);

                        if (!encontroPrincipal) {
                            $scope.cmbModLineaSelec = $scope.listProductoPostpago[0];
                        }


                        $scope.selectCuenta = buscarEnListaCuentas($scope.listadoCuentas, $scope.cmbModLineaSelec.ProductoServicioResponse.idCuenta);

                        cargarComboRecibos(false).then(function() {
                            if (WPSCategoria.movil == $scope.prodPrincipalResponse.categoria &&
                                $scope.prodPrincipalResponse.productoPrincipal != null) {
                                $scope.selectRecibo = buscarEnListaRecibos($scope.listadoRecibos, $scope.cmbModLineaSelec.ProductoServicioResponse.idRecibo);
                            }
                        });


                        obtenerCategoriasDeCompra();

                    });
                }, function(error) {
                    $scope.showPantalla = false;
                    $("#show_error").show();
                });
            }

            function consultarProductoServicios(idProdPrincipal, primeraVez) {
                var requestJson = crearRequestServicios(primeraVez);
                return ComprasyRecargasService.obtenerServicios(requestJson).then(function(response) {

                    var dataResponse = response.data.obtenerServiciosResponse;
                    var idRespuestaConsulta = parseInt(dataResponse.defaultServiceResponse.idRespuesta);
                    if (idRespuestaConsulta == 0 &&
                        dataResponse.listadoProductosServicios != undefined) {

                        if (Array.isArray(dataResponse.listadoProductosServicios)) {
                            $scope.listProductoPostpago = dataResponse.listadoProductosServicios;
                            $scope.cmbModLineaSelec = $scope.listProductoPostpago[0];

                        } else {
                            $scope.listProductoPostpago = [];
                            $scope.listProductoPostpago.push(dataResponse.listadoProductosServicios);
                            $scope.cmbModLineaSelec = $scope.listProductoPostpago[0];
                        }

                        $scope.showCmbModLineaSelec = true;
                        $scope.showPantalla = true;
                        $scope.errorTecnico = false;
                    } else {
                        $scope.showPantalla = false;
                        $("#show_error").show();
                        $scope.showCmbModLineaSelec = false;
                        manejarErrores(idRespuestaConsulta);
                    }
                }, function(error) {
                    $scope.showPantalla = false;
                    $("#show_error").show();
                    $scope.showCmbModLineaSelec = false;
                    $scope.errorTecnico = true;
                });
            }

            function cargarObtenerCreditoSaldoProducto(productoServicio) {
                var requestJson = crearRequestSaldo(productoServicio);
                ComprasyRecargasService.obtenerCreditoSaldoProducto(requestJson).then(function(response) {



                    var idRespuestaConsulta = parseInt(response.data.obtenerCreditoSaldoProductoResponse.defaultServiceResponse.idRespuesta);
                    if (idRespuestaConsulta == 0) {

                        $scope.creditoSaldo.lineaCredito = response.data.obtenerCreditoSaldoProductoResponse.lineaDisponible;
                        $scope.creditoSaldo.lblSimboloLineaCredito = response.data.obtenerCreditoSaldoProductoResponse.simboloMonedaLineaDisp;
                        $scope.creditoSaldo.lblSaldoPrepago = response.data.obtenerCreditoSaldoProductoResponse.saldoPrepago;
                        $scope.creditoSaldo.lblSimboloMonedaSaldoPrep = response.data.obtenerCreditoSaldoProductoResponse.simboloMonedaSaldoPrep;
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

                        mostrarCredito($scope.creditoSaldo.lineaCredito);

                        $scope.showCreditoSaldo = true;
                        $scope.showCreditoSaldo_error = false;

                    } else {

                        $scope.showCreditoSaldo = false;
                        $scope.showCreditoSaldo_error = true;

                    }
                }, function(error) {
                    $scope.showPantalla = false;
                    $("#show_error").show();
                    $scope.showCreditoSaldo = false;
                    $scope.errorTecnico = true;
                });
            }




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

            function crearRequestServicios(primeraVez) {

                var requestServiciosMoviles = {
                    categoria: categoriaMovil,
                    tipoLinea: null,
                    tipoCliente: tipoCliente,
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



                if (!primeraVez) {
                    requestServiciosMoviles.idCuenta = $scope.selectCuenta.idCuenta;
                    requestServiciosMoviles.idRecibo = $scope.selectRecibo.idRecibo;
                }
                requestServiciosMoviles.tipoLinea = WPSTipoLinea.postpago;

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

            function crearRequestRecibos(idCuenta) {
                var requestData = {
                    'idCuenta': idCuenta
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
                    $("#show_error").show();
                    $scope.showListaCategoriasDeCompra = false;
                    $scope.errorTecnico = true;
                });
            }

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
                    $("#show_error").show();
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
                    tipoCliente: tipoCliente,
                    tipoLinea: $scope.cmbModLineaSelec.ProductoServicioResponse.tipoLinea,
                    tipoPermiso: $scope.cmbModLineaSelec.ProductoServicioResponse.tipoPermiso
                }
            }

            function crearRequestProductosCompra(idCategoriaDeCompra) {

                return {
                    "idCategoriaDeCompra": idCategoriaDeCompra,
                    claroPuntosCliente: $scope.usuarioSession.claroPuntos,
                    tipoLinea: $scope.cmbModLineaSelec.ProductoServicioResponse.tipoLinea,
                    tipoCliente: tipoCliente,
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
                    tipoCliente: tipoCliente,
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
                marcarCheckTerminos(false);
                var request = crearRequestMediosPago(idCategoriaDeCompra, prodSeleccionado);
                ComprasyRecargasService.obtenerMetodosPago(request).then(function(response) {
                    var idRespuestaConsulta = parseInt(response.data.obtenerMetodosPagoResponse.defaultServiceResponse.idRespuesta);
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
                        manejarErrores(idRespuestaConsulta);
                        $scope.showListaProductosDePago = false;
                    }
                }, function(error) {
                    $scope.showPantalla = false;
                    $("#show_error").show();
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

                            if (value.tipoMetodoPago === WPSMediosDePago.puntosClaro.codigo) {
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
                                    $('#btMetodoPuntos').addClass('bt-red');
                                    $('#btMetodoPuntos').removeClass('bt-gris');
                                    $('#btMetodoPuntos').prop('disabled', false);

                                }
                            } else if (value.tipoMetodoPago === WPSMediosDePago.cargarEnRecibo.codigo) {
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
                                    $('#btMetodoRecibo').prop('disabled', true);
                                    $('#btMetodoRecibo').removeClass('bt-red');
                                    $('#btMetodoRecibo').addClass('bt-red bt-gris');
                                    enablePagar(false);
                                }

                                } else if (value.tipoMetodoPago === WPSMediosDePago.tarjetaCredito.codigo) {
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


                                } else if (value.tipoMetodoPago === WPSMediosDePago.saldoPrepago.codigo) {
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
                }

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

                    if (WPSMediosDePago.puntosClaro.codigo === $scope.medioSeleccionado.codigo) {
                        $scope.productoSeleccionado.lblCosto = $scope.medioClaroPuntos.cantidad + " puntos";;
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
                        idCuenta: $scope.selectCuenta.idCuenta,
                        idRecibo: $scope.selectRecibo.idRecibo,
                        idProductoServicio: $scope.cmbModLineaSelec.ProductoServicioResponse.idProductoServicio,
                        idCategoriaDeCompra: $scope.categoriaSeleccionada.idCategoriaDeCompra,
                        idProductoDeCompra: $scope.productoSeleccionado.idProductoDeCompra,
                        idMetodoPago: $scope.medioSeleccionado.codigo,
                        tipoLinea: $scope.cmbModLineaSelec.ProductoServicioResponse.tipoLinea,
                        tipoCliente: WPSTipoCliente.corporativo,
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
                            $scope.indCompraExito = true;
                            $scope.pagarProductoDeCompraResponse.descripcion = 'La transacción fue realizada con éxito';
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
                        tipoCliente: tipoCliente,
                        idCuenta: $scope.selectCuenta.idCuenta,
                        idRecibo: $scope.selectRecibo.idRecibo,
                        idDireccion: null,
                        idProductoServicio: $scope.cmbModLineaSelec.ProductoServicioResponse.idProductoServicio,
                        idServicioPrincipalFijo: null,
                        importePago: $scope.productoSeleccionado.precioMoneda,
                        codigoMoneda: "1",
                        idCategoriaDeCompra: $scope.categoriaSeleccionada.idCategoriaDeCompra,
                        idProductoDeCompra: $scope.productoSeleccionado.idProductoDeCompra + "-" + $scope.productoSeleccionado.idMetodoPago
                    }
                    return requestData;
                }

                function hacerCompraTC() {
                    var request = obtenerReqCompraTC();
                    ComprasyRecargasService.registrarInicioTransaccionPagoTC(request).then(function(response) {

                        var idRespuestaConsulta = parseInt(response.data.registrarInicioTransaccionPagoTCResponse.defaultServiceResponse.idRespuesta);
                        var inicioTransaccionTCResponse = response.data.registrarInicioTransaccionPagoTCResponse;

                        if (idRespuestaConsulta == 0) {
                            abrirCulqui(inicioTransaccionTCResponse);
                            enviarAuditoria(request, $scope.inicioTransaccionTCResponse, AUDIT_EXITO);
                        } else {
                            enviarAuditoria(request, $scope.inicioTransaccionTCResponse, AUDIT_ERROR);
                        }

                    }, function(error) {
                        $scope.errorTecnico = true;
                        $scope.indCompraExito = false;
                        enviarAuditoria(request, null, AUDIT_ERROR);
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
                            $scope.indCompraExito = true;
                            $scope.pagarProductoDeCompraResponse.descripcionResultadoOperacion = 'La transacción fue realizada con éxito';
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
                    if (tipoCliente == 1) {
                        $scope.msgErrorConsumer = WPSMensajeError.mensaje3;
                    } else {
                        $scope.msgErrorConsumer = WPSMensajeError.mensaje4;
                    }
                }
                this.cambiarCuenta = function() {
                    cargarComboRecibos().then(function() {
                        consultarProductoServicios(null);
                        obtenerCategoriasDeCompra();
                    });
                }

                this.cambiarRecibo = function() {
                    consultarProductoServicios(null);
                    obtenerCategoriasDeCompra();
                    $("#autocomplete-filtro").val("");
                }

                $scope.refreshPortlet = function(indicadorError) {
                    if (indicadorError == '1') {
                        cargarComboCuentas();
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
                        tipoLinea: WPSTipoLinea.postpago,
                        tipoCliente: WPSTipoCliente.corporativo,
                        tipoPermiso: 1,
                        idCuenta: null,
                        idRecibo: null,
                        criterioBusqueda: valorinput,
                        pagina: WPSpaginacion.pagina,
                        cantResultadosPagina: WPSpaginacion.cantResultadosPagina,
                        titularidadServicio: 1
                    };

                    ComprasyRecargasService.obtenerListadoMoviles(requestJson).then(function(response) {
                        var idRespuestaConsulta = parseInt(response.data.obtenerListadoMovilesResponse.defaultServiceResponse.idRespuesta);
                        if (idRespuestaConsulta == 0) {
                            if (Array.isArray(response.data.obtenerListadoMovilesResponse.listadoProductosServicios)) {
                                $scope.listaAutocomplete = response.data.obtenerListadoMovilesResponse.listadoProductosServicios;
                            } else {
                                $scope.listaAutocomplete = [];
                                $scope.listaAutocomplete.push(response.data.obtenerListadoMovilesResponse.listadoProductosServicios);
                            }
                            var lista = $scope.listaAutocomplete;
                            var result = obtenerArrayAutoComplete(lista);
                            done(result);
                        }

                    });
                }

                function obtenerProductoServicio(prodAutoComplet) {
                    var requestJson = crearRequestServiciosA(prodAutoComplet);
                    return ComprasyRecargasService.obtenerServicios(requestJson).then(function(response) {
                        var idRespuestaConsulta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);

                        if (idRespuestaConsulta == 0) {
                            $("#classBuscar").removeClass('search-column');
                            $('#autocomplete-filtro').val('');


                            if (Array.isArray(response.data.obtenerServiciosResponse.listadoProductosServicios)) {
                                $scope.listProductoPostpago1 = response.data.obtenerServiciosResponse.listadoProductosServicios;
                            } else {
                                $scope.listProductoPostpago1 = [];
                                $scope.listProductoPostpago1.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                            }
                            $scope.cmbModLineaSelec = $scope.listProductoPostpago1[0];
                            actualizarProductoPrincipalSesion($scope.cmbModLineaSelec);

                            $scope.selectCuenta = buscarEnListaCuentas($scope.listadoCuentas, $scope.cmbModLineaSelec.ProductoServicioResponse.idCuenta);
                            cargarComboRecibos(true);

                        }
                    });
                }

                function crearRequestServiciosA(productoServicio) {
                    var requestServiciosMoviles = {
                        categoria: categoriaMovil,
                        tipoLinea: tipoLineaTodos,
                        tipoCliente: tipoCliente,
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

                function enviarAuditoria(request, response, estadoAudit, descripcion) {
                    resquestAuditoria = crearRequestAudit($scope.usuarioSession, $scope.categoriaSeleccionada,
                        $scope.medioSeleccionado.codigo, request, response, $scope.cmbModLineaSelec, estadoAudit, descripcion);
                    ComunUsuarioSesionService.enviarAuditoria(resquestAuditoria).then(function(response) {}, function(error) {});
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
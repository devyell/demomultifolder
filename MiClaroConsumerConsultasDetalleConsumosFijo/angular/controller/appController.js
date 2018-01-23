miClaroApp.controller("MiClaroHomeController", function($scope, $http, $httpParamSerializer, $timeout, ServiciosFijaService, FileSaver, Blob) {

    angular.element(document).ready(function() {

        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        var $wslide = $(window).width() - 20;
        var $slide = 1;
        var $timer = 0;
        var valorFlagConfirmacion = null;
        var valorFlagConfirmacionMobile = null;
        var allSuccess = true;
        var categoriaFijo = 2;
        var tipoPermiso = 5;
        var titularidadServicio = 7;
        var pagina = 0;
        var cantResultadosPagina = 0;
        var productoPrincipalXidRecibo = false;
        var tipoLinea = 3;
        var tipoCliente = 1;
        var cantPeriodos = 3;
        $scope.tipoLlamadas = '1';
        $scope.totalPagina = 0;
        $scope.hidePagina = true;
        $scope.mostrarConsumosFija = true;
        $scope.mostrarConsumosFijaSaliente = false;
        $scope.errorTotal = false;
        $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
        $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
        $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;
        $scope.hideCorreo = false;
        $('#mostrarConsumosFija').hide();
        var paginaS = 1;
        $scope.switchSelect = true;
        $scope.servicioAuditoria;
        $scope.tipoLineaAuditoria;
        $scope.perfilAuditoria;
        $scope.hideCorreoLimite = false;
        asignarEventoRadios();

        ServiciosFijaService.getObtenerFlagProductoFijo().then(function(response) {
            $scope.flagErrorProductosFijo = response.data.comunResponseType.defaultServiceResponse;
            $scope.flagServiciosFijo = response.data.comunResponseType.flagProductoFijoSesion;
            $("#loaderTuConfiguracion").show();
            if ($scope.flagErrorProductosFijo.idRespuesta == 0) {
                $("#Tabfijo").show();
                if ($scope.flagServiciosFijo == 1 || $scope.flagServiciosFijo == 3) {
                    $scope.init();
                }
            } else {
                $("#Tabfijo").hide();
                $scope.errorTotal = true;
                allSuccess = false;
            }
            $("#loaderTuConfiguracion").hide();
        });


        $scope.init = function(objServicio) {
            ServiciosFijaService.getObtenerDatosSesion().then(function(response) {
                $scope.datosSesionFlag = response.data.comunResponseType.defaultServiceResponse;
                $scope.tipoCliente = response.data.comunResponseType.tipoCliente;
                if (verificarUsuarioMixto()) {
                    seleccionarSwitch();
                }

                if ($scope.datosSesionFlag.idRespuesta == 0) {
                    getObtenerServiciosFijaWS(response.data);
                } else {
                    allSuccess = false;
                }
            });
        }


        getObtenerServiciosFijaWS = function(objServicio) {
            $scope.tipoClienteSession = objServicio.comunResponseType.tipoCliente;
            $scope.tipoLineaSession = objServicio.comunResponseType.tipoLinea;
            $scope.numeroTelFijo = objServicio.comunResponseType.telefono;
            $scope.emailUsuario = objServicio.comunResponseType.usuarioVinculado;
            $scope.categoria = objServicio.comunResponseType.categoria;

            var obtenerServiciosRequest = {
                categoria: null,
                tipoLinea: null,
                tipoCliente: null,
                idProductoServicio: null,
                tipoPermiso: null,
                idCuenta: null,
                idRecibo: null,
                idDireccion: null,
                direccionCompleta: null,
                pagina: null,
                cantResultadosPagina: null,
                productoPrincipalXidRecibo: null,
                titularidadServicio: null
            }

            obtenerServiciosRequest.categoria = categoriaFijo;
            obtenerServiciosRequest.tipoLinea = tipoLinea;
            obtenerServiciosRequest.tipoCliente = tipoCliente;
            obtenerServiciosRequest.tipoPermiso = tipoPermiso;
            obtenerServiciosRequest.pagina = pagina;
            obtenerServiciosRequest.cantResultadosPagina = cantResultadosPagina;
            obtenerServiciosRequest.productoPrincipalXidRecibo = productoPrincipalXidRecibo;
            obtenerServiciosRequest.titularidadServicio = titularidadServicio;

            serviciosRequest = $httpParamSerializer({ requestJson: angular.toJson(obtenerServiciosRequest), tipoConsulta: '' });
            ServiciosFijaService.getObtenerServiciosWS(serviciosRequest).then(function(response) {
                $scope.serviciosList = response.data.obtenerServiciosResponse.listadoProductosServicios;
                $scope.errorFuncional = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
                $scope.idTransaccionalerrorFuncional = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;

                var breakEach = true;

                if ($scope.errorFuncional == 0) {
                    if (Array.isArray($scope.serviciosList)) {
                        angular.forEach($scope.serviciosList, function(val, key) {
                            if (breakEach) {
                                if (val.ProductoServicioResponse.idProductoServicio == objServicio.comunResponseType.productoPrincipal) {
                                    $scope.servicio = $scope.serviciosList[key];
                                    breakEach = false;
                                    $scope.servicioAuditoria = $scope.servicio.ProductoServicioResponse.nombre;
                                    $scope.tipoLineaAuditoria = $scope.servicio.ProductoServicioResponse.tipoLinea;
                                    $scope.perfilAuditoria = $scope.servicio.ProductoServicioResponse.tipoPermiso;

                                }
                            }
                        });

                        if (breakEach) {
                            $scope.servicio = $scope.serviciosList[0];
                            $scope.servicioAuditoria = $scope.servicio.ProductoServicioResponse.nombre;
                            $scope.tipoLineaAuditoria = $scope.servicio.ProductoServicioResponse.tipoLinea;
                            $scope.perfilAuditoria = $scope.servicio.ProductoServicioResponse.tipoPermiso;
                        }

                    } else {
                        $scope.serviciosList = [];
                        $scope.serviciosList.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                        $scope.servicio = $scope.serviciosList[0];
                        $('#idServicio').css({ display: 'none' });
                        $('#textox').css({ background: 'none' });
                    }

                    getObtenerDatosAdicionalesFijoWS();
                    obtenerLinesFijas('1', $scope.servicio.ProductoServicioResponse.idDireccion, $scope.servicio.ProductoServicioResponse.idProductoServicio, '');
                    $("#textox").html($scope.servicio.ProductoServicioResponse.nombreAlias);

                } else {
                    allSuccess = false;
                }
            });

            $("#loaderTuConfiguracion").hide();
            $("#Tabfijo").show();
        };


        function seleccionarSwitch() {
            if ($scope.tipoCliente == WPSTipoCliente.corporativo) {
                $("#lblConsumer").attr("for", "itype1");
                $("#lblCorporativo").removeAttr("for");
                $scope.switchSelect = true;

            } else if ($scope.tipoCliente == WPSTipoCliente.consumer) {
                $("#lblCorporativo").attr("for", "itype1");
                $("#lblConsumer").removeAttr("for");
                $scope.switchSelect = false;

            }

        }


        $scope.switchChange = function() {
            switchChangeEvent();

        };

        function getObtenerDatosAdicionalesFijoWS() {
            var objServicio = $scope.servicio;
            $scope.servicioAuditoria = $scope.servicio.ProductoServicioResponse.nombre;
            $scope.tipoLineaAuditoria = $scope.servicio.ProductoServicioResponse.tipoLinea;
            $scope.perfilAuditoria = $scope.servicio.ProductoServicioResponse.tipoPermiso;
            var idProdServ = objServicio.ProductoServicioResponse.idProductoServicio;
            var idCat = objServicio.ProductoServicioResponse.categoria;
            var idDir = objServicio.ProductoServicioResponse.idDireccion;
            var idLin = objServicio.ProductoServicioResponse.idLinea;
            var obtenerDatosAdicionalesFijoRequest = {
                "idProductoServicio": null,
                "categoria": null,
                "idDireccion": null,
                "idLinea": null
            }
            obtenerDatosAdicionalesFijoRequest.idProductoServicio = idProdServ;
            obtenerDatosAdicionalesFijoRequest.categoria = idCat;
            obtenerDatosAdicionalesFijoRequest.idDireccion = idDir;
            obtenerDatosAdicionalesFijoRequest.idLinea = idLin;
            serviciosRequest = $httpParamSerializer({ requestJson: angular.toJson(obtenerDatosAdicionalesFijoRequest) });
            ServiciosFijaService.getObtenerDatosAdicionalesFijoWS(serviciosRequest).then(function(response) {
                $scope.datosAdicionales = response.data.obtenerDatosAdicionalesServicioFijoResponse;
                if ($scope.datosAdicionales.defaultServiceResponse.idRespuesta == 0) {
                    $scope.datosAdicionalServicio = response.data.obtenerDatosAdicionalesServicioFijoResponse;
                    $scope.fechaActivacion = response.data.obtenerDatosAdicionalesServicioFijoResponse.fechaActivacion;
                    $scope.estado = response.data.obtenerDatosAdicionalesServicioFijoResponse.estado;
                }
            });

        }

        function obtenerLinesFijas(tipoCliente, idDireccion, idProductoServicio, nombreProducto) {
            var datosAdicional = dataObtenerLinesFijas(tipoCliente, idDireccion, idProductoServicio, nombreProducto);
            ServiciosFijaService.obtenerLinesFijas(datosAdicional).then(function(response) {
                var rpta = parseInt(response.data.obtenerLineasFijasResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerLineasFijasResponse.defaultServiceResponse.idTransaccional;
                if (rpta == 0) {
                    var flag = response.data.obtenerLineasFijasResponse.listadoProductosServicios.flagPlataforma;
                    if (flag == 'true') {
                        $scope.flagPlataforma = 0;
                    } else {
                        $scope.flagPlataforma = 1;
                        $('#idLlamadaE').removeClass('checked');
                        $('#idLlamadaS').addClass('checked');
                        $scope.tipoLlamadas = '2';
                    }
                    $timeout(function() {
                        $scope.getObtenerPeriodosFacturacionWS();
                    }, 200);

                } else {


                }
            }, function(error) {

            });
        };

        $scope.getObtenerPeriodosFacturacionWS = function() {
            var objServicio = $scope.servicio;
            var idCat = objServicio.ProductoServicioResponse.categoria;
            var idProdServ = objServicio.ProductoServicioResponse.idProductoServicio;
            var idDir = objServicio.ProductoServicioResponse.idDireccion;
            var idLin = objServicio.ProductoServicioResponse.idLinea;
            var idCuen = objServicio.ProductoServicioResponse.idCuenta;
            var idRec = objServicio.ProductoServicioResponse.idRecibo;

            var obtenerPeriodosFacturacionRequest = {
                "categoria": null,
                "idProductoServicio": null,
                "idDireccion": null,
                "idLinea": null,
                "idCuenta": null,
                "idRecibo": null,
                "cantPeriodos": null,
            }
            obtenerPeriodosFacturacionRequest.categoria = idCat;
            obtenerPeriodosFacturacionRequest.idProductoServicio = idProdServ;
            obtenerPeriodosFacturacionRequest.idDireccion = idDir;
            obtenerPeriodosFacturacionRequest.idLinea = idLin;
            obtenerPeriodosFacturacionRequest.cantPeriodos = cantPeriodos;

            serviciosRequest = $httpParamSerializer({ requestJson: angular.toJson(obtenerPeriodosFacturacionRequest) });
            ServiciosFijaService.getObtenerPeriodosFacturacionWS(serviciosRequest).then(function(response) {
                var dataPeriodosFacturacion = response.data.obtenerPeriodosFacturacionResponse.listado;
                $scope.periodoFlag = response.data.obtenerPeriodosFacturacionResponse.defaultServiceResponse.idRespuesta;
                $scope.idTransaccionalPeriodo = response.data.obtenerPeriodosFacturacionResponse.defaultServiceResponse.idTransaccional;
                if ($scope.periodoFlag == 0) {

                    $scope.listaPeriodosFacturacion = [];
                    if (dataPeriodosFacturacion != undefined && dataPeriodosFacturacion != '') {
                        if (angular.isArray(dataPeriodosFacturacion)) {
                            $scope.listaPeriodosFacturacion = dataPeriodosFacturacion;
                        } else {
                            $scope.listaPeriodosFacturacion.push(dataPeriodosFacturacion);
                        }

                        $scope.selectedPeriodo = $scope.listaPeriodosFacturacion[0];
                    }
                    var idDireccionFija = $scope.servicio.ProductoServicioResponse.idDireccion;
                    var idProducto_Principal = $scope.servicio.ProductoServicioResponse.idProductoServicio;
                    var idLinea = $scope.servicio.ProductoServicioResponse.idLinea;
                    var idPeriodoFijo = $scope.selectedPeriodo.idPeriodo;
                    obtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea, idPeriodoFijo, $scope.tipoLlamadas, 'false', '', 1, 10);
                } else {
                    $scope.errorFuncional = -1;
                    $('#errorTotal').show();
                }
            });
        }

        function obtenerDatosAdicionalesServicioFijo(idDireccionFija, idProducto_Principal, categoria, idLinea, idPeriodoFijo) {
            var datosAdicional = dataObtenerDatosAdicionalesServicioFijo(idProducto_Principal, categoria, idDireccionFija, idLinea);
            ServiciosFijaService.obtenerDatosAdicionalesServicioFijo(datosAdicional).then(function(response) {
                var rpta = parseInt(response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.idTransaccional;
                if (rpta == 0) {
                    $scope.fechaActivacion = response.data.obtenerDatosAdicionalesServicioFijoResponse.fechaActivacion;
                    $scope.estado = response.data.obtenerDatosAdicionalesServicioFijoResponse.estado;
                    obtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea, idPeriodoFijo, $scope.tipoLlamadas, 'false', '', 1, 10);
                } else {
                    $scope.errorFuncional = -1;
                    $('#errorTotal').show();
                }
            }, function(error) {

            });
        };

        function obtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea, idPeriodoFijo, tipoLlamadas, flag, email, pagina, can) {

            if (pagina == '1') {
                $scope.hidePagina = false;

            }

            var dataLlamadasFijo = dataObtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea, idPeriodoFijo, tipoLlamadas, flag, email, pagina, can);
            ServiciosFijaService.obtenerLlamadasFijo(dataLlamadasFijo).then(function(response) {
                actualizarProductoPrincipalSesion(idProducto_Principal, idDireccionFija, idLinea);
                var rpta = parseInt(response.data.obtenerLlamadasFijoResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerLlamadasFijoResponse.defaultServiceResponse.idTransaccional;
                var mensaje = response.data.obtenerLlamadasFijoResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    $('.no-mobile').show();
                    $("#mostrarConsumosFija").hide();
                    $("#mostrarConsumosFija2").show();
                    $scope.mostrarConsumosFijaData = true;
                    if (tipoLlamadas == 1) {
                        $scope.mostrarConsumosFija = true;
                        $scope.mostrarConsumosFijaSaliente = false;
                        auditoria(WPSTablaOperaciones.consultaDetalleConsumosLlamadasEntrante, idTransaccion, 'SUCCESS', '-');

                    } else {
                        $scope.mostrarConsumosFija = false;
                        $scope.mostrarConsumosFijaSaliente = true;
                        auditoria(WPSTablaOperaciones.consultaDetalleConsumosLlamadasSaliente, idTransaccion, 'SUCCESS', '-');
                    }
                    if (pagina == '1') {
                        $scope.listarLlamadasFijo = response.data.obtenerLlamadasFijoResponse.listaLlamadas;
                        $scope.totalPagina = response.data.obtenerLlamadasFijoResponse.totalPaginas;

                        paginaS = 1;

                        $scope.hideCorreoLimite = false;
                        if (!Array.isArray(response.data.obtenerLlamadasFijoResponse.listaLlamadas)) {
                            $scope.listarLlamadasFijo = [];
                            $scope.listarLlamadasFijo.push(response.data.obtenerLlamadasFijoResponse.listaLlamadas);
                        }
                        if ($scope.totalPagina == 1) {
                            $scope.hidePagina = false;
                            $scope.hideCorreo = false;
                        } else {
                            $scope.hidePagina = true;
                            $scope.hideCorreo = false;
                        }
                    } else {
                        var roleList = response.data.obtenerLlamadasFijoResponse.listaLlamadas;
                        if (!Array.isArray(roleList)) {
                            roleList = [];
                            roleList.push(response.data.obtenerLlamadasFijoResponse.listaLlamadas);
                        }
                        listarLlamadasFijaAll(roleList);
                    }

                } else if (rpta == 8) {
                    $('.no-mobile').show();
                    $scope.mostrarConsumosFijaData = false;
                    $scope.mensajeConsumoFijo = WPSConsultarDetalleConsumosFijoConsumer.EXCEPCION3;
                    $scope.mostrarDataServFija = true;
                    $scope.mostrarConsumosFija = false;
                    $scope.mostrarConsumosFijaSaliente = false;
                    $('#mostrarConsumosFija').hide();
                    if (tipoLlamadas == 1) {
                        auditoria(WPSTablaOperaciones.consultaDetalleConsumosLlamadasEntrante, idTransaccion, 'ERROR', 'obtenerLlamadasFijo - ' + mensaje);

                    } else {
                        auditoria(WPSTablaOperaciones.consultaDetalleConsumosLlamadasSaliente, idTransaccion, 'ERROR', 'obtenerLlamadasFijo - ' + mensaje);
                    }
                } else {

                    $('.no-mobile').show();
                    $('#mostrarConsumosFija2').hide();
                    $scope.mostrarDataServFija = true;
                    $scope.mostrarConsumosFija = false;
                    $scope.mostrarConsumosFijaSaliente = false;
                    $('#mostrarConsumosFija').show();
                    if (tipoLlamadas == 1) {
                        auditoria(WPSTablaOperaciones.consultaDetalleConsumosLlamadasEntrante, idTransaccion, 'ERROR', 'obtenerLlamadasFijo - ' + mensaje);
                    } else {
                        auditoria(WPSTablaOperaciones.consultaDetalleConsumosLlamadasSaliente, idTransaccion, 'ERROR', 'obtenerLlamadasFijo - ' + mensaje);
                    }
                }
            }, function(error) {

            });
        };

        function actualizarProductoPrincipalSesion(idProductoServicio, idDireccion, idLinea) {
            var actualizarServicioSesion = {
                productoPrincipal: idProductoServicio,
                nombreProductoPrincipal: null,
                idCuenta: null,
                idRecibo: null,
                idDireccion: idDireccion,
                idLinea: idLinea,
                tipoLinea: $scope.tipoLineaSession,
                numeroTelFijo: $scope.servicio.ProductoServicioResponse.numeroTelFijo,
                categoria: $scope.categoria,
                tipoClienteProductoPrincipal: '1'
            }
            data = $httpParamSerializer({ requestJson: angular.toJson(actualizarServicioSesion) });
            ServiciosFijaService.actualizarProductoPrincipalSesion(data).then(function(response) {

            });

        };

        function EnviarCorreoObtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea, idPeriodoFijo, tipoLlamadas, flag, email, pagina, can) {
            var dataLlamadasFijo = dataObtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea, idPeriodoFijo, tipoLlamadas, flag, email, pagina, can);
            ServiciosFijaService.obtenerLlamadasFijo(dataLlamadasFijo).then(function(response) {
                var rpta = parseInt(response.data.obtenerLlamadasFijoResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerLlamadasFijoResponse.defaultServiceResponse.idTransaccional;
                var mensaje = response.data.obtenerLlamadasFijoResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    if (tipoLlamadas == 1) {
                        auditoria(WPSTablaOperaciones.envioCorreoDetalleConsumosLlamadasEntrante, idTransaccion, 'ERROR', 'obtenerLlamadasFijo - ' + mensaje);
                    } else {
                        auditoria(WPSTablaOperaciones.envioCorreoDetalleConsumosLlamadasSaliente, idTransaccion, 'SUCCESS', '-');
                    }

                } else {
                    auditoria(WPSTablaOperaciones.envioCorreoDetalleConsumosLlamadasEntrante, idTransaccion, 'ERROR', 'obtenerLlamadasFijo - ' + mensaje);
                }
            }, function(error) {

            });
        };

        function listarLlamadasFijaAll(listaDetalle) {
            for (var i = 0; i < listaDetalle.length; i++) {
                $scope.listarLlamadasFijo.push(listaDetalle[i]);
            }

            if (paginaS == 3) {
                $scope.hideCorreoLimite = true;
                $scope.hidePagina = false;
            }


        }

        function verificarUsuarioMixto() {
            if ($scope.tipoCliente == WPSTipoCliente.mixto) {
                $scope.showSelectorMixto = true;
                return true;
            } else {
                return false;
            }
        }

        function dataObtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea, idPeriodo, tipoLlamadas, flag, mail, pagina, can) {
            var requestObtenerLlamadasFijo = {
                "idProductoServicio": null,
                "idDireccion": null,
                "idLinea": null,
                "idPeriodo": null,
                "tipoLlamadas": null,
                "flagCorreo": null,
                "mail": null,
                "pagina": null,
                "cantResultadosPagina": null
            }
            requestObtenerLlamadasFijo.idProductoServicio = idProducto_Principal;
            requestObtenerLlamadasFijo.idDireccion = idDireccionFija;
            requestObtenerLlamadasFijo.idLinea = idLinea;
            requestObtenerLlamadasFijo.idPeriodo = idPeriodo;
            requestObtenerLlamadasFijo.tipoLlamadas = tipoLlamadas;
            requestObtenerLlamadasFijo.flagCorreo = flag;
            requestObtenerLlamadasFijo.mail = mail;
            requestObtenerLlamadasFijo.pagina = pagina;
            requestObtenerLlamadasFijo.cantResultadosPagina = can;
            requestObtenerLlamadasFijo = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerLlamadasFijo) });
            return requestObtenerLlamadasFijo;
        };


        function dataObtenerDatosAdicionalesServicioFijo(idProductoServicio, categoria, idDireccion, idLinea) {
            var requestObtenerDatosAdicionalesServicioFijo = {
                "idProductoServicio": null,
                "categoria": null,
                "idDireccion": null,
                "idLinea": null
            }
            requestObtenerDatosAdicionalesServicioFijo.idProductoServicio = idProductoServicio;
            requestObtenerDatosAdicionalesServicioFijo.categoria = categoria;
            requestObtenerDatosAdicionalesServicioFijo.idDireccion = idDireccion;
            requestObtenerDatosAdicionalesServicioFijo.idLinea = idLinea;
            requestObtenerDatosAdicionalesServicioFijo = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerDatosAdicionalesServicioFijo) });
            return requestObtenerDatosAdicionalesServicioFijo;
        };

        function dataObtenerLinesFijas(tipoCliente, idDireccion, idProductoServicio, nombreProducto) {
            var requestObtenerLinesFijas = {
                "tipoCliente": tipoCliente,
                "idDireccion": idDireccion,
                "idProductoServicio": idProductoServicio,
                "nombreProducto": nombreProducto,
                "pagina": 1,
                "cantResultadosPagina": 1
            }

            requestObtenerLinesFijas = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerLinesFijas) });
            return requestObtenerLinesFijas;
        };


        var $popup = $('.popup');
        $scope.Correo = function() {
            var $pop = $(".popup .pop");
            var $cnt = $popup.find('.content');
            $pop.css({ 'margin-top': Math.round(($h - 300) / 2) });
            $popup.fadeIn(350);
            $('#IdPopup').show();

        };

        $scope.OtroCorreo = function() {
            $('#idEmail').focus();
            $('#idCorreo').hide();
            $('#idCorreo2').show();
        };

        $scope.Enviar = function(tipo) {
            var idDireccionFija = $scope.servicio.ProductoServicioResponse.idDireccion;
            var idProducto_Principal = $scope.servicio.ProductoServicioResponse.idProductoServicio;
            var idLinea = $scope.servicio.ProductoServicioResponse.idLinea;
            var idPeriodoFijo = $scope.selectedPeriodo.idPeriodo;
            if (tipo == 'E') {
                EnviarCorreoObtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea, idPeriodoFijo, $scope.tipoLlamadas, 'true', $scope.emailUsuario, 0, 0);
                $('#IdPopup').hide();
            } else {
                $form = $('#idformpop');
                var valid = $form.validate();
                if (valid) {
                    $form.find('.msg-error').hide();
                    setTimeout(function() { hidePopUp(); }, 1500);
                    $('#IdPopup').hide();
                    EnviarCorreoObtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea, idPeriodoFijo, $scope.tipoLlamadas, 'true', $scope.email, 0, 0);
                } else {
                    $form.find('.msg-error').html("Por favor, ingresa un correo electrónico válido.").show();
                    $('#IdPopup').show();
                }
            }
        };

        $scope.Cancelar = function() {
            $('#idCorreo2').hide();
            $('#idCorreo').show();
        };


        $('.popup .btclose, .popup .bg').click(function() {
            hidePopUp();
        });


        function hidePopUp() {
            $popup.fadeOut(250);
        }


        $scope.cambioPeriodo = function() {
            $scope.mostrarConsumosFijaData = true;
            if ($scope.periodoFlag == 0) {
                var idDireccionFija = $scope.servicio.ProductoServicioResponse.idDireccion;
                var idProducto_Principal = $scope.servicio.ProductoServicioResponse.idProductoServicio;
                var idLinea = $scope.servicio.ProductoServicioResponse.idLinea;
                var idPeriodoFijo = $scope.selectedPeriodo.idPeriodo;
                obtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea, idPeriodoFijo, $scope.tipoLlamadas, 'false', '', 1, 10);
            }

            var $time = 0;
            var $tpos = 0;
            $('.consumosBox').each(function(ix, el) {
                var $tmp = $(this);
                var $pos = $(this).offset().top;

                if ($tpos != $pos) {
                    $tpos = $pos;
                    $time = $time + 150;
                }
                $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 250);
            });

        }

        $scope.paginacion = function() {
            paginaS = paginaS + 1;
            if (paginaS <= $scope.totalPagina) {

                var idDireccionFija = $scope.servicio.ProductoServicioResponse.idDireccion;
                var idProducto_Principal = $scope.servicio.ProductoServicioResponse.idProductoServicio;
                var idLinea = $scope.servicio.ProductoServicioResponse.idLinea;
                var idPeriodoFijo = $scope.selectedPeriodo.idPeriodo;
                obtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea, idPeriodoFijo, $scope.tipoLlamadas, 'false', '', paginaS, 10);
            } else {
                $scope.hidePagina = false;
            }
        }

        $scope.llamada = function(tipo) {
            var idDireccionFija = $scope.servicio.ProductoServicioResponse.idDireccion;
            var idProducto_Principal = $scope.servicio.ProductoServicioResponse.idProductoServicio;
            var idLinea = $scope.servicio.ProductoServicioResponse.idLinea;
            var idPeriodoFijo = $scope.selectedPeriodo.idPeriodo;
            $scope.hideCorreoLimite = false;
            $scope.hideCorreo = false;
            $scope.mostrarConsumosFijaData = true;
            $("#mostrarConsumosFija").hide();
            $scope.hidePagina = true;
            if ($scope.listarLlamadasFijo != undefined) {
                if ($scope.listarLlamadasFijo.length > 0) {
                    $scope.listarLlamadasFijo = [];
                }
            }

            if (tipo == 'E') {

                $scope.tipoLlamadas = '1';
                $('#idLlamadaS').removeClass('checked');
                $('#idLlamadaE').addClass('checked');
                obtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea, idPeriodoFijo, $scope.tipoLlamadas, 'false', '', 1, 10);
                $scope.mostrarConsumosFija = true;
                $scope.mostrarConsumosFijaSaliente = false;

            } else {
                $scope.mostrarConsumosFija = false;
                $scope.mostrarConsumosFijaSaliente = true;
                $scope.tipoLlamadas = '2';
                $('#idLlamadaE').removeClass('checked');
                $('#idLlamadaS').addClass('checked');
                obtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea, idPeriodoFijo, $scope.tipoLlamadas, 'false', '', 1, 10);

            }
        };

        $scope.cambioServicio = function() {

            $("#textox").html($scope.servicio.ProductoServicioResponse.nombreAlias);
            var $time = 0;
            var $tpos = 0;
            $('.box').each(function(ix, el) {
                var $tmp = $(this);
                var $pos = $(this).offset().top;

                if ($tpos != $pos) {
                    $tpos = $pos;
                    $time = $time + 150;
                }
                $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 250);
            });

            getObtenerDatosAdicionalesFijoWS();
            $scope.getObtenerPeriodosFacturacionWS();

        }

        $scope.Reporte = function() {
            var requestObtenerLlamadasFijo = {
                "idProductoServicio": $scope.servicio.ProductoServicioResponse.idProductoServicio,
                "idDireccion": $scope.servicio.ProductoServicioResponse.idDireccion,
                "idLinea": $scope.servicio.ProductoServicioResponse.idLinea,
                "idPeriodo": $scope.selectedPeriodo.idPeriodo,
                "tipoLlamadas": $scope.tipoLlamadas,
                "flagCorreo": 'false',
                "mail": null,
                "pagina": '0',
                "cantResultadosPagina": '0',
                "numeroReporte": $scope.tipoLlamadas
            }

            requestObtenerLlamadasFijo = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerLlamadasFijo), tipoReporte: $scope.tipoLlamadas });
            ServiciosFijaService.obtenerReporteLlamadas(requestObtenerLlamadasFijo).then(function(response) {
                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                var mensaje = 'obtenerReporteLlamadas -' + response.data.comunResponseType.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    if ($scope.tipoLlamadas == 1) {
                        auditoria(WPSTablaOperaciones.descargaArchivoDetalleConsumosLlamadasEntrante, idTransaccion, 'SUCCESS', '-');
                    } else {
                        auditoria(WPSTablaOperaciones.descargaArchivoDetalleConsumosLlamadasSaliente, idTransaccion, 'SUCCESS', '-');
                    }
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
                } else {
                    if ($scope.tipoLlamadas == 1) {
                        auditoria(WPSTablaOperaciones.descargaArchivoDetalleConsumosLlamadasEntrante, idTransaccion, 'ERROR', mensaje);
                    } else {
                        auditoria(WPSTablaOperaciones.descargaArchivoDetalleConsumosLlamadasSaliente, idTransaccion, 'ERROR', mensaje);
                    }
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
        }

        function obtenerConsumosFijosxPeriodo() {
            var idDireccionFija = $scope.servicio.ProductoServicioResponse.idDireccion;
            var idProducto_Principal = $scope.servicio.ProductoServicioResponse.idProductoServicio;
            var idLinea = $scope.servicio.ProductoServicioResponse.idLinea;
            var idPeriodoFijo = $scope.selectedPeriodo.idPeriodo;
            obtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea, idPeriodoFijo, $scope.tipoLlamadas, 'false', '', 1, 10);
        }

        $scope.refreshPortlet = function(indicadorError) {
            if (indicadorError == '1') {
                main();
            } else if (indicadorError == '2') {

                obtenerConsumosFijosxPeriodo();
            }
        };

        function auditoria(operationCode, transactionId, estado, descripcionoperacion) {
            var ResquestAuditoria = {
                operationCode: operationCode,
                pagina: WPSPageID.miclaro_consumer_consultas_detalleconsumos_fijo,
                transactionId: $scope.idTransaccionalPeriodo,
                estado: estado,
                servicio: $scope.servicioAuditoria,
                tipoProducto: 'FIJO',
                tipoLinea: $scope.tipoLineaAuditoria,
                tipoUsuario: $scope.tipoCliente,
                perfil: $scope.perfilAuditoria,
                monto: '',
                descripcionoperacion: descripcionoperacion,
                responseType: '/'
            };
            ResquestAuditoria = $httpParamSerializer({ requestJson: angular.toJson(ResquestAuditoria) });
            ServiciosFijaService.enviarAuditoria(ResquestAuditoria).then(function(response) {

            }, function(error) {

            });
        }

    });

});



miClaroApp.directive('erCustomerror', function() {
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
});
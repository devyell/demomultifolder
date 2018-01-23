var ctrlsaldosyconsumos = angular.module('controllerSaldosyConsumosFijo', []);
ctrlsaldosyconsumos.controller('ctrlSaldosyConsumosFijo', ['$scope', '$http', '$filter', 'servSaldosyConsumosFijo', '$httpParamSerializer',
    function($scope, $http, $filter, servSaldosyConsumosFijo, $httpParamSerializer) {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

        $scope.mostrarInfoFijo = false;
        $scope.errorTotalRedirect = false;
        $scope.mostrarDataServFija = false;
        $scope.mostrarConsumosFija = false;
        $scope.errorDetalleConsumo = false;
        $scope.sinServiciosFijos = false;
        $scope.mostrarDatosAdicionales = false;
        var tipoClienteCorporativo = WPSTipoCliente.corporativo;
        var titularidadServicioThree = WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado;
        var tipoPermisoAll = WPSTipoPermiso.todos;
        var pagina = 0;
        var cantResultadosPagina = 0;
        var tipoClienteFiltros = WPSTipoClienteDir.corporativoFijo;
        var categoriaFijo = WPSCategoria.fijo;
        var tipoLineaTodos = WPSTipoLinea.todos;
        var tipoPermisoCorporativo = '';
        var tipoLineaCorporativaFija = '';
        $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
        $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
        $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;
        $scope.urlInicio = '/wps/portal/miclaro/corporativo/consultas/saldosyconsumos/fijo';
        var urlConsumer = '/wps/portal/miclaro/consumer/consultas/saldosyconsumos/fijo';
        $scope.sinConsumosFijos = false;
        $scope.switchSelect = true;
        $scope.mostrarSwitch = false;
        var tresperiodos = 3;
        var objExito = {};
        var imgDestinoPhone = '/wpstheme/miclaro/img/icon-complemento-phone.png';
        var imgHorarioNoche = '/wpstheme/miclaro/img/icon-complemento-noche.png';
        var imgHorarioDia = '/wpstheme/miclaro/img/icon-complemento-dia.png';
        var imgTipoFijo = '/wpstheme/miclaro/img/icon-complemento-llamada.png';
        var imgTipoMovil = '/wpstheme/miclaro/img/icon-complemento-movil.png';
        var imgTipoOtros = '/wpstheme/miclaro/img/icon-complemento-otro.png';

        var pageIdMiclaroCorporativoSaldosyconsumosFijo = WPSPageID.miclaro_corporativo_consultas_saldosyconsumos_fijo;
        var operationCodeCorporativoSaldosyConsumosFijo = WPSTablaOperaciones.consultaSaldosConsumos;
        var estadoExito = 'SUCCESS';
        var estadoError = 'ERROR';
        var tipoProductoFijo = 'FIJO';
        var tipoConsultaDescripcion = 'consultaSaldosConsumos';
        var operacionObtenerServicio = 'obtenerServicios';
        var operacionObtenerDireccion = 'obtenerListadoFijoDireccion';
        var operacionObtenerPeriodo = 'obtenerPeriodosFacturacion';
        var operacionDatosAdicionales = 'obtenerDatosAdicionalesServicioFijo';
        var operacionConsumoFija = 'obtenerConsumoGeneralFija';
        var operacioObtenerLinea = 'obtenerLinesFijas';
        var tipoClienteSession = '';
        var nombreLinea = '';
        var servicioAuditoria = '';
        $scope.mostrarSwitchSinServicios = false;

        angular.element(document).ready(function() {
            init();
            initSlides();
            iniciarAutocomplete();
            onResizeScreen();
        });

        $scope.switchChange = function() {
            window.location.href = urlConsumer;
        };

        function init() {
            servSaldosyConsumosFijo.obtenerDatosUsuarioSesion().then(function(response) {
                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                if (rpta == 0) {
                    tipoClienteSession = response.data.comunResponseType.tipoCliente;
                    servicioAuditoria = response.data.comunResponseType.idDireccion;
                    var flagServicioFijoSession = response.data.comunResponseType.flagProductoFijoSesion;
                    if (flagServicioFijoSession == 2 || flagServicioFijoSession == 3) {
                        $scope.mostrarInfoFijo = true;
                        obtenerServicioPrincipal();
                        if (tipoClienteSession == 4) {
                            $scope.mostrarSwitch = true;
                        }
                    } else if (flagServicioFijoSession == -1) {
                        $scope.mostrarInfoFijo = true;
                        $scope.errorTotalRedirect = true;
                        var mensajeAuditoriaFlags = operacionObtenerServicio + "- flagFijo";
                        registrarAuditoria(rpta, idTransaccion, mensajeAuditoriaFlags, null);
                    } else {
                        $scope.sinServiciosFijos = true;
                        var mensajeAuditoriaFlags = "-";
                        registrarAuditoria(rpta, idTransaccion, mensajeAuditoriaFlags, "Flag");
                        if (tipoClienteSession == 4) {
                            $scope.mostrarSwitchSinServicios = false;
                        }
                    }

                } else {
                    $scope.errorTotalRedirect = true;
                }
            }, function(error) {

            });
        };

        function obtenerServicioPrincipal() {
            servSaldosyConsumosFijo.obtenerServicioPrincipal().then(function(response) {
                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                if (rpta == 0) {
                    var categoriaPrincipal = response.data.comunResponseType.categoria;
                    var tipoClientePrincipal = response.data.comunResponseType.tipoClienteProductoPrincipal;
                    if (categoriaPrincipal == "2" && tipoClientePrincipal == "2") {
                        var idDireccionPrincipal = response.data.comunResponseType.idDireccion;
                        var idServicioPrincipal = response.data.comunResponseType.productoPrincipal;
                        obtenerListadoFijoDireccion(idDireccionPrincipal, idServicioPrincipal, "1", null)
                    } else {
                        obtenerListadoFijoDireccion(null, null, "2", null)
                    }
                } else {
                    $scope.errorTotalRedirect = true;
                }
            }, function(error) {

            });
        };

        function obtenerListadoFijoDireccion(idDireccionPrincipal, idServicioPrincipal, indicador, idLinea) {
            var id_direccion = '';
            var listDireccion = '';
            var datarDirecciones = dataDireccionEnviar();
            servSaldosyConsumosFijo.obtenerListadoFijoDireccion(datarDirecciones).then(function(response) {
                var rpta = parseInt(response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    listDireccion = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;
                    if (listDireccion != '' && listDireccion != undefined) {
                        if (angular.isArray(listDireccion)) {
                            $scope.listadoDirecciones = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;
                            if (indicador == "1" || indicador == "4") {
                                angular.forEach($scope.listadoDirecciones, function(val, key) {
                                    if (val.idDireccion == idDireccionPrincipal) {
                                        $scope.selectIdDireccion = $scope.listadoDirecciones[key];
                                    }
                                });
                            } else {
                                angular.forEach($scope.listadoDirecciones, function(val, key) {
                                    $scope.selectIdDireccion = $scope.listadoDirecciones[0];
                                    id_direccion = $scope.listadoDirecciones[0].idDireccion;
                                });
                            }
                        } else {
                            $scope.listadoDirecciones = [];
                            $scope.listadoDirecciones.push(listDireccion);
                            if (indicador == "1" || indicador == "4") {
                                angular.forEach($scope.listadoDirecciones, function(val, key) {
                                    if (val.idDireccion == idDireccionPrincipal) {
                                        $scope.selectIdDireccion = $scope.listadoDirecciones[key];
                                    }
                                });
                            } else {
                                angular.forEach($scope.listadoDirecciones, function(val, key) {
                                    $scope.selectIdDireccion = $scope.listadoDirecciones[0];
                                    id_direccion = $scope.listadoDirecciones[0].idDireccion;
                                });
                            }
                        }
                        if (indicador == "1" || indicador == "4") {
                            obtenerServiciosFijos(idDireccionPrincipal, idServicioPrincipal, indicador, idLinea);
                        } else {
                            obtenerServiciosFijos(id_direccion, null, indicador, idLinea);
                        }
                        registrarEstadoConsulta(rpta, idTransaccion, "DIRECCION");
                    } else {
                        $scope.errorTotalRedirect = true;
                    }
                } else {
                    $scope.errorTotalRedirect = true;
                    var mensajeAuditoria = operacionObtenerDireccion + "-" + mensajeServicio;
                    registrarAuditoria(rpta, idTransaccion, mensajeAuditoria, null);
                }
            }, function(error) {

            });
        };

        function obtenerServiciosFijos(idDireccionFija, idServicioPrincipal, indicador, idLinea) {
            var idProducto_Principal = '';
            var listadoServicosFijos = '';
            var dataServiciosFijo = dataParaEnviar(idDireccionFija);
            servSaldosyConsumosFijo.obtenerServiciosFijos(dataServiciosFijo).then(function(response) {
                var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    listadoServicosFijos = response.data.obtenerServiciosResponse.listadoProductosServicios;
                    if (listadoServicosFijos != '' && listadoServicosFijos != undefined) {
                        if (angular.isArray(listadoServicosFijos)) {
                            $scope.listadoServicios = response.data.obtenerServiciosResponse.listadoProductosServicios;
                            if (indicador == "1" || indicador == "4") {
                                angular.forEach($scope.listadoServicios, function(val, key) {
                                    if (val.ProductoServicioResponse.idProductoServicio == idServicioPrincipal) {
                                        $scope.lineaPrincipal = $scope.listadoServicios[key].ProductoServicioResponse.nombreAlias;
                                        $scope.selectLinea = $scope.listadoServicios[key];
                                        tipoPermisoCorporativo = $scope.listadoServicios[key].ProductoServicioResponse.tipoPermiso;
                                        tipoLineaCorporativaFija = $scope.listadoServicios[key].ProductoServicioResponse.tipoLinea;
                                    }
                                });
                            } else {
                                angular.forEach($scope.listadoServicios, function(val, key) {
                                    $scope.selectLinea = $scope.listadoServicios[0];
                                    $scope.lineaPrincipal = $scope.listadoServicios[0].ProductoServicioResponse.nombreAlias;
                                    idProducto_Principal = $scope.listadoServicios[0].ProductoServicioResponse.idProductoServicio;
                                    tipoPermisoCorporativo = $scope.listadoServicios[0].ProductoServicioResponse.tipoPermiso;
                                    tipoLineaCorporativaFija = $scope.listadoServicios[0].ProductoServicioResponse.tipoLinea;
                                });

                            }
                        } else {
                            $scope.listadoServicios = [];
                            $scope.listadoServicios.push(listadoServicosFijos);
                            if (indicador == "1" || indicador == "4") {
                                angular.forEach($scope.listadoServicios, function(val, key) {
                                    if (val.ProductoServicioResponse.idProductoServicio == idServicioPrincipal) {
                                        $scope.selectLinea = $scope.listadoServicios[key];
                                        $scope.lineaPrincipal = $scope.listadoServicios[key].ProductoServicioResponse.nombreAlias;
                                        tipoPermisoCorporativo = $scope.listadoServicios[key].ProductoServicioResponse.tipoPermiso;
                                        tipoLineaCorporativaFija = $scope.listadoServicios[key].ProductoServicioResponse.tipoLinea;
                                    }
                                });
                            } else {
                                angular.forEach($scope.listadoServicios, function(val, key) {
                                    $scope.selectLinea = $scope.listadoServicios[0];
                                    $scope.lineaPrincipal = $scope.listadoServicios[0].ProductoServicioResponse.nombreAlias;
                                    idProducto_Principal = $scope.listadoServicios[0].ProductoServicioResponse.idProductoServicio;
                                    tipoPermisoCorporativo = $scope.listadoServicios[0].ProductoServicioResponse.tipoPermiso;
                                    tipoLineaCorporativaFija = $scope.listadoServicios[0].ProductoServicioResponse.tipoLinea;
                                });
                            }
                        }
                        if (indicador == "1" || indicador == "4") {
                            obtenerLinesFijas(idDireccionFija, idServicioPrincipal, indicador, idLinea);
                        } else {
                            obtenerLinesFijas(idDireccionFija, idProducto_Principal, indicador, idLinea);
                        }
                        registrarEstadoConsulta(rpta, idTransaccion, "SERVFIJO");
                    } else {
                        $scope.errorTotalRedirect = true;
                    }
                } else {
                    $scope.errorTotalRedirect = true;
                    var mensajeAuditoria = operacionObtenerServicio + "-" + mensajeServicio;
                    registrarAuditoria(rpta, idTransaccion, operacionObtenerServicio, null);
                }
            }, function(error) {

            });
        };


        function obtenerLinesFijas(idDireccionFija, idProducto_Principal, indicador, idLinea) {
            var listLineasFijas = '';
            var idLineaFija = '';
            var dataLineasFijas = enviarDataLineasFijas(idDireccionFija, idProducto_Principal);
            servSaldosyConsumosFijo.obtenerLinesFijas(dataLineasFijas).then(function(response) {
                var rpta = parseInt(response.data.obtenerLineasFijasResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerLineasFijasResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.obtenerLineasFijasResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    listLineasFijas = response.data.obtenerLineasFijasResponse.listadoProductosServicios;
                    if (listLineasFijas != '' && listLineasFijas != undefined) {
                        if (angular.isArray(listLineasFijas)) {
                            $scope.listadoLineasFijas = response.data.obtenerLineasFijasResponse.listadoProductosServicios;
                            angular.forEach($scope.listadoLineasFijas, function(val, key) {
                                $scope.lineaFijaSelect = $scope.listadoLineasFijas[0];
                                idLineaFija = $scope.listadoLineasFijas[0].idLinea;
                                nombreLinea = $scope.listadoLineasFijas[0].nombreProducto;
                            });
                        } else {
                            $scope.listadoLineasFijas = [];
                            $scope.listadoLineasFijas.push(listLineasFijas);
                            angular.forEach($scope.listadoLineasFijas, function(val, key) {
                                $scope.lineaFijaSelect = $scope.listadoLineasFijas[0];
                                idLineaFija = $scope.listadoLineasFijas[0].idLinea;
                                nombreLinea = $scope.listadoLineasFijas[0].nombreProducto;
                            });
                        }
                        if (indicador == "4") {
                            obtenerPeriodosFacturacion(idDireccionFija, idProducto_Principal, idLinea);
                        } else {
                            obtenerPeriodosFacturacion(idDireccionFija, idProducto_Principal, idLineaFija);
                        }
                        actualizarProductoPrincipal(idProducto_Principal, nombreLinea, idDireccionFija, idLineaFija);
                        registrarEstadoConsulta(rpta, idTransaccion, "LINEAFIJA");
                    } else {
                        $scope.errorTotalRedirect = true;
                        registrarAuditoria(rpta, idTransaccion);
                    }
                } else {
                    $scope.errorTotalRedirect = true;
                    var mensajeAuditoria = operacioObtenerLinea + "-" + mensajeServicio;
                    registrarAuditoria(rpta, idTransaccion, mensajeAuditoria, null);
                }
            }, function(error) {

            });
        };

        function obtenerPeriodosFacturacion(idDireccionFija, idProducto_Principal, idLineaFija) {
            var idPeriodoFijo = '';
            var listaPeriodos = '';
            var dataPeriodo = dataPeriodoEnviar(idDireccionFija, idProducto_Principal);
            servSaldosyConsumosFijo.obtenerPeriodosFacturacion(dataPeriodo).then(function(response) {
                var rpta = parseInt(response.data.obtenerPeriodosFacturacionResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerPeriodosFacturacionResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.obtenerPeriodosFacturacionResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    $scope.mostrarDataServFija = true;
                    $scope.mostrarDatosAdicionales = true;
                    listaPeriodos = response.data.obtenerPeriodosFacturacionResponse.listado;
                    if (listaPeriodos != '' && listaPeriodos != undefined) {
                        if (angular.isArray(listaPeriodos)) {
                            $scope.listadoPeriodos = response.data.obtenerPeriodosFacturacionResponse.listado;
                            angular.forEach($scope.listadoPeriodos, function(val, key) {
                                $scope.selectPeriodo = $scope.listadoPeriodos[0];
                                idPeriodoFijo = $scope.listadoPeriodos[0].idPeriodo;
                            });
                        } else {
                            $scope.listadoPeriodos = [];
                            $scope.listadoPeriodos.push(listaPeriodos);
                            angular.forEach($scope.listadoPeriodos, function(val, key) {
                                $scope.selectPeriodo = $scope.listadoPeriodos[0];
                                idPeriodoFijo = $scope.listadoPeriodos[0].idPeriodo;
                            });
                        }
                        registrarEstadoConsulta(rpta, idTransaccion, "PERIODO");
                        obtenerDatosAdicionalesServicioFijo(idDireccionFija, idProducto_Principal);
                        obtenerConsumoGeneralFija(idDireccionFija, idProducto_Principal, idPeriodoFijo, idLineaFija);
                    } else {
                        $scope.errorTotalRedirect = true;
                        registrarAuditoria(rpta, idTransaccion);
                    }
                } else {
                    $scope.errorTotalRedirect = true;
                    var mensajeAuditoria = operacionObtenerPeriodo + "-" + mensajeServicio;
                    registrarAuditoria(rpta, idTransaccion, mensajeAuditoria, null);
                }
            }, function(error) {

            });
        };

        function obtenerDatosAdicionalesServicioFijo(idDireccionFija, idProducto_Principal) {
            var dataDatosAdicionales = enviarDataAdiconal(idDireccionFija, idProducto_Principal);
            servSaldosyConsumosFijo.obtenerDatosAdicionalesServicioFijo(dataDatosAdicionales).then(function(response) {
                var rpta = parseInt(response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    $scope.mostrarDireccion = response.data.obtenerDatosAdicionalesServicioFijoResponse.direccionCompleta;
                } else {
                    var mensajeAuditoria = operacionDatosAdicionales + "-" + mensajeServicio;
                    registrarAuditoria(rpta, idTransaccion, mensajeAuditoria, null);
                }
            }, function(error) {

            });
        };

        function obtenerConsumoGeneralFija(id_direccion, idProducto_Principal, idPeriodoFijo, idLineaFija) {
            var dataConsumoFijo = dataConsumoFijaEnviar(id_direccion, idProducto_Principal, idPeriodoFijo, idLineaFija);
            servSaldosyConsumosFijo.obtenerConsumoGeneralFija(dataConsumoFijo).then(function(response) {
                var rpta = parseInt(response.data.obtenerConsumoGeneralFijaResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerConsumoGeneralFijaResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.obtenerConsumoGeneralFijaResponse.defaultServiceResponse.mensaje;
                var arrayHorario = [];
                var arrayTipo = [];
                var arrayDestino = [];

                if (rpta == 0) {
                    var totalConsumido = parseInt(response.data.obtenerConsumoGeneralFijaResponse.informacionComplementaria.totalMinutosConsumidos);
                    var informacionComplementaria = '';
                    if (totalConsumido != 0) {
                        $scope.mostrarConsumosFija = true;
                        $scope.errorDetalleConsumo = false;
                        informacionComplementaria = response.data.obtenerConsumoGeneralFijaResponse.informacionComplementaria;
                        obtenerInformacionAdicional(informacionComplementaria);
                        var objHorario = response.data.obtenerConsumoGeneralFijaResponse.porHorario;
                        if (objHorario != '' && objHorario != undefined) {
                            var totalConsumidoNormal = '';
                            var totalConsumidoNocturno = '';
                            $scope.etiquetaNormal = objHorario.minutosHorarioNormal.etiqueta;
                            totalConsumidoNormal = parseInt(objHorario.minutosHorarioNormal.cantidadConsumida);
                            arrayHorario.push(totalConsumidoNormal);
                            $scope.etiquetaNocturno = objHorario.minutosHorarioNocturno.etiqueta;
                            totalConsumidoNocturno = parseInt(objHorario.minutosHorarioNocturno.cantidadConsumida);
                            arrayHorario.push(totalConsumidoNocturno);
                            $scope.totalConsumidosHorario = totalConsumidoNormal + totalConsumidoNocturno;
                            if ($scope.totalConsumidosHorario == 0) {
                                arrayHorarioCero = [];
                                var dataCero = 1;
                                arrayHorarioCero.push(dataCero);
                                renderizar(arrayHorarioCero, "horarioNoMobile", 0);
                                renderizar(arrayHorarioCero, "horarioMobile", 0);
                            } else {
                                renderizar(arrayHorario, "horarioNoMobile", 1);
                                renderizar(arrayHorario, "horarioMobile", 1);
                            }
                        }
                        var objTipo = response.data.obtenerConsumoGeneralFijaResponse.porTipo;
                        if (objTipo != '' && objTipo != undefined) {
                            var porTipoMinutosFijo = '';
                            var porTipoMinutosCelular = '';
                            var porTipoMinutosOtros = '';
                            $scope.etiquetaFijo = objTipo.minutosFijo.etiqueta;
                            porTipoMinutosFijo = parseInt(objTipo.minutosFijo.cantidadConsumida);
                            arrayTipo.push(porTipoMinutosFijo);
                            $scope.etiquetaCelular = objTipo.minutosCelular.etiqueta;
                            porTipoMinutosCelular = parseInt(objTipo.minutosCelular.cantidadConsumida);
                            arrayTipo.push(porTipoMinutosCelular);
                            $scope.etiquetaOtros = objTipo.minutosOtros.etiqueta;
                            porTipoMinutosOtros = parseInt(objTipo.minutosOtros.cantidadConsumida);
                            arrayTipo.push(porTipoMinutosOtros);
                            $scope.totalConsumoTipo = porTipoMinutosFijo + porTipoMinutosCelular + porTipoMinutosOtros;
                            if ($scope.totalConsumoTipo == 0) {
                                var arrayTipoCero = [];
                                var dataCeroTipo = 1;
                                arrayTipoCero.push(dataCeroTipo);
                                renderizar(arrayTipoCero, "tipoNoMobile", 0);
                                renderizar(arrayTipoCero, "tipoMobile", 0);
                            } else {
                                renderizar(arrayTipo, "tipoNoMobile", 1);
                                renderizar(arrayTipo, "tipoMobile", 1);
                            }

                        }
                        var objDestino = response.data.obtenerConsumoGeneralFijaResponse.porDestino;
                        if (objDestino != '' && objDestino != undefined) {
                            var cantidadConsumoLocal = '';
                            var cantidadConsumoNacional = '';
                            var cantidadConsumoInternacional = '';
                            $scope.etiquetaConsumoLocal = objDestino.consumoLocal.etiqueta;
                            cantidadConsumoLocal = parseInt(objDestino.consumoLocal.cantidadConsumida);
                            arrayDestino.push(cantidadConsumoLocal);
                            $scope.etiquetaConsumoNacional = objDestino.consumoNacional.etiqueta;
                            cantidadConsumoNacional = parseInt(objDestino.consumoNacional.cantidadConsumida);
                            arrayDestino.push(cantidadConsumoNacional);
                            $scope.etiquetaConsumoInternacional = objDestino.consumoInternacional.etiqueta;
                            cantidadConsumoInternacional = parseInt(objDestino.consumoInternacional.cantidadConsumida);
                            arrayDestino.push(cantidadConsumoInternacional);
                            $scope.totalCantidadDestino = cantidadConsumoLocal + cantidadConsumoNacional + cantidadConsumoInternacional;
                            if ($scope.totalCantidadDestino == 0) {
                                var arrayDestinoCero = [];
                                var dataCeroDestino = 1;
                                arrayDestinoCero.push(dataCeroDestino);
                                renderizar(arrayDestinoCero, "destinoNoMobile", 0);
                                renderizar(arrayDestinoCero, "destinoMobile", 0);
                            } else {
                                renderizar(arrayDestino, "destinoNoMobile", 1);
                                renderizar(arrayDestino, "destinoMobile", 1);
                            }

                        }
                        registrarEstadoConsulta(rpta, idTransaccion, "CONSUMOS");
                    } else {
                        $scope.sinConsumosFijos = true;
                        registrarEstadoConsulta(rpta, idTransaccion, "CONSUMOS");
                    }
                } else {
                    $scope.errorDetalleConsumo = true;
                    var mensajeAuditoria = operacionConsumoFija + "-" + mensajeServicio;
                    registrarAuditoria(rpta, idTransaccion, mensajeAuditoria, null);
                }

            }, function(error) {

            });
        };

        function obtenerInformacionAdicional(informacionComplementaria) {
            var arrayDestinoInfo = [];
            var arrayTipoInfo = [];
            var arrayHorarioInfo = [];
            $scope.totalMinutosConsumido = informacionComplementaria.totalMinutosConsumidos;
            $scope.totalLlamadasClaro = informacionComplementaria.cantLlamadasNumClaro;

            var totalInternacional = parseInt(informacionComplementaria.cantLlamadasInternacionales);
            arrayDestinoInfo.push({ id: totalInternacional, value: "internacional" });
            var totalNacional = parseInt(informacionComplementaria.cantLlamadasNacionales);
            arrayDestinoInfo.push({ id: totalNacional, value: "nacional" });
            var totalLocal = parseInt(informacionComplementaria.cantLlamadasLocales);
            arrayDestinoInfo.push({ id: totalLocal, value: "local" });
            ordenarInformacionAdicional(arrayDestinoInfo, "1");

            var totalFijos = parseInt(informacionComplementaria.cantLlamadasfijos);
            arrayTipoInfo.push({ id: totalFijos, value: "fijos" });
            var totalMoviles = parseInt(informacionComplementaria.cantLlamadasMoviles);
            arrayTipoInfo.push({ id: totalMoviles, value: "móviles" });
            var totalOtros = parseInt(informacionComplementaria.cantLlamadasOtros);
            arrayTipoInfo.push({ id: totalOtros, value: "otros" });
            ordenarInformacionAdicional(arrayTipoInfo, "2");

            var totalDiurno = parseInt(informacionComplementaria.cantLlamadasHorarioDiurno);
            arrayHorarioInfo.push({ id: totalDiurno, value: "diurno" });
            var totalNocturno = parseInt(informacionComplementaria.cantLlamadasHorarioNocturno);
            arrayHorarioInfo.push({ id: totalNocturno, value: "nocturno" });
            ordenarInformacionAdicional(arrayHorarioInfo, "3");
        };

        function ordenarInformacionAdicional(arraryInformacionAdicional, indicador) {
            arraryInformacionAdicional = $filter('orderBy')(arraryInformacionAdicional, '+id');
            if (indicador == "1") {
                angular.forEach(arraryInformacionAdicional, function(val, key) {
                    $scope.desPrimero = arraryInformacionAdicional[2].value;
                    if ($scope.desPrimero == "internacional") {
                        $scope.imgDestinoMostrar = imgDestinoPhone;
                    } else if ($scope.desPrimero == "nacional") {
                        $scope.imgDestinoMostrar = imgDestinoPhone;
                    } else {
                        $scope.imgDestinoMostrar = imgDestinoPhone;
                    }
                });
            } else if (indicador == "2") {
                angular.forEach(arraryInformacionAdicional, function(val, key) {
                    $scope.tipoPrimero = arraryInformacionAdicional[2].value;
                    if ($scope.tipoPrimero == "fijos") {
                        $scope.imgTipoMostrar = imgTipoFijo;
                    } else if ($scope.tipoPrimero == "móviles") {
                        $scope.imgTipoMostrar = imgTipoMovil;
                    } else {
                        $scope.imgTipoMostrar = imgTipoOtros;
                    }
                });
            } else {
                angular.forEach(arraryInformacionAdicional, function(val, key) {
                    $scope.horPrimero = arraryInformacionAdicional[1].value;
                    if ($scope.horPrimero == "diurno") {
                        $scope.imgHorarioMostrar = imgHorarioDia;
                    } else {
                        $scope.imgHorarioMostrar = imgHorarioNoche;
                    }
                    $scope.horSegundo = arraryInformacionAdicional[0].value;
                });
            }
        };

        function limpiarcombos() {
            $scope.listadoDirecciones = [];
            $scope.listadoServicios = [];
            $scope.listadoLineasFijas = [];
            $scope.listadoPeriodos = [];
        };

        $scope.cambiarClassForm = function() {
            if ($scope.classBuscar == 'search-column') {
                $scope.classBuscar = '';
                $scope.desabledCombos = '';
            } else {
                $scope.classBuscar = 'search-column';
                $scope.desabledCombos = 'disabled';
            }
        };

        function dataDireccionEnviar() {
            var requestDireccion = {
                "tipoCliente": null
            };
            requestDireccion.tipoCliente = tipoClienteFiltros;
            dataDireccion = $httpParamSerializer({ requestJson: angular.toJson(requestDireccion) });
            return dataDireccion;
        };

        function dataParaEnviar(id_direccionRequest) {
            var requestServiciosFijo = {
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
            requestServiciosFijo.categoria = categoriaFijo;
            requestServiciosFijo.tipoLinea = tipoLineaTodos;
            requestServiciosFijo.tipoCliente = tipoClienteCorporativo;
            requestServiciosFijo.tipoPermiso = tipoPermisoAll;
            requestServiciosFijo.idDireccion = id_direccionRequest;
            requestServiciosFijo.pagina = pagina;
            requestServiciosFijo.cantResultadosPagina = cantResultadosPagina;
            requestServiciosFijo.titularidadServicio = titularidadServicioThree;

            dataServiciosFijo = $httpParamSerializer({ requestJson: angular.toJson(requestServiciosFijo) });
            return dataServiciosFijo;
        };

        function enviarDataAdiconal(idDireccionFija, idProducto_Principal) {
            var requestDataAdicional = {
                "idProductoServicio": null,
                "categoria": null,
                "idDireccion": null,
                "idLinea": null
            }
            requestDataAdicional.idProductoServicio = idProducto_Principal;
            requestDataAdicional.categoria = categoriaFijo;
            requestDataAdicional.idDireccion = idDireccionFija;

            dataDatosAdicionalesFijo = $httpParamSerializer({ requestJson: angular.toJson(requestDataAdicional) });
            return dataDatosAdicionalesFijo;
        };

        function enviarDataLineasFijas(idDireccionFija, idProducto_Principal) {
            var requestLineasFijas = {
                "tipoCliente": null,
                "idDireccion": null,
                "idProductoServicio": null,
                "nombreProducto": null,
                "pagina": null,
                "cantResultadosPagina": null
            }
            requestLineasFijas.tipoCliente = tipoClienteCorporativo;
            requestLineasFijas.idProductoServicio = idProducto_Principal;
            requestLineasFijas.idDireccion = idDireccionFija;
            requestLineasFijas.pagina = pagina;
            requestLineasFijas.cantResultadosPagina = cantResultadosPagina;

            responseLineasFijas = $httpParamSerializer({ requestJson: angular.toJson(requestLineasFijas) });
            return responseLineasFijas;
        };

        function dataPeriodoEnviar(idDireccionFija, idProducto_Principal, idLinea) {
            var requestPeriodoFact = {
                "categoria": null,
                "idProductoServicio": null,
                "idCuenta": null,
                "idRecibo": null,
                "idDireccion": null,
                "idLinea": null,
                "cantPeriodos": null
            }
            requestPeriodoFact.categoria = categoriaFijo;
            requestPeriodoFact.idDireccion = idDireccionFija;
            requestPeriodoFact.idProductoServicio = idProducto_Principal;
            requestPeriodoFact.cantPeriodos = tresperiodos;
            requestPeriodoFact.idLinea = idLinea;
            dataPeridoFact = $httpParamSerializer({ requestJson: angular.toJson(requestPeriodoFact) });
            return dataPeridoFact;
        };

        function dataConsumoFijaEnviar(id_direccion, idProducto_Principal, idPeriodoFijo, idLineaFija) {
            var requestConsumoFijo = {
                "idPeriodo": null,
                "idProductoServicio": null,
                "idDireccion": null,
                "idLinea": null,
                "criterio": null
            }
            requestConsumoFijo.criterio = 0;
            requestConsumoFijo.idProductoServicio = idProducto_Principal;
            requestConsumoFijo.idDireccion = id_direccion;
            requestConsumoFijo.idPeriodo = idPeriodoFijo;
            requestConsumoFijo.idLinea = idLineaFija;
            dataConsumoFijo = $httpParamSerializer({ requestJson: angular.toJson(requestConsumoFijo) });
            return dataConsumoFijo;
        };

        function dataAutocomplete(valorinput, indicador) {
            var requestAutocompleteFijo = {
                "tipoCliente": null,
                "idDireccion": null,
                "idProductoServicio": null,
                "criterioBusqueda": null,
                "pagina": null,
                "cantResultadosPagina": null
            }
            requestAutocompleteFijo.tipoCliente = tipoClienteCorporativo;
            requestAutocompleteFijo.criterioBusqueda = valorinput;
            if (indicador == "10") {
                requestAutocompleteFijo.cantResultadosPagina = 1;
            } else {
                requestAutocompleteFijo.cantResultadosPagina = 10;
            }
            requestAutocompleteFijo.pagina = 1;
            dataAutocompleteFijo = $httpParamSerializer({ requestJson: angular.toJson(requestAutocompleteFijo) });
            return dataAutocompleteFijo;
        };

        this.obtenerConsumosFijosxDireccion = function() {
            $scope.errorDetalleConsumo = false;
            $scope.mostrarConsumosFija = false;
            $scope.mostrarDatosAdicionales = false;
            $scope.sinConsumosFijos = false;
            objExito.flagServiciosFijo = null;
            objExito.flagLineaFija = null;
            objExito.flagPeriodo = null;
            objExito.flagConsumos = null;
            obtenerConsumosFijosxDireccion();
        };

        function obtenerConsumosFijosxDireccion() {
            var id_DireccionSeleccionada = $scope.selectIdDireccion.idDireccion;
            obtenerServiciosFijos(id_DireccionSeleccionada, null, "3", null);
        };

        this.obtenerConsumosFijosxServicio = function() {
            $scope.errorDetalleConsumo = false;
            $scope.mostrarConsumosFija = false;
            $scope.mostrarDatosAdicionales = false;
            $scope.sinConsumosFijos = false;

            objExito.flagLineaFija = null;
            objExito.flagPeriodo = null;
            objExito.flagConsumos = null;
            obtenerConsumosFijosxServicio();
        };

        function obtenerConsumosFijosxServicio() {
            $scope.lineaPrincipal = $scope.selectLinea.ProductoServicioResponse.nombreAlias;
            var id_DireccionSeleccionada = $scope.selectIdDireccion.idDireccion;
            var id_ServicioSeleccionado = $scope.selectLinea.ProductoServicioResponse.idProductoServicio;
            obtenerLinesFijas(id_DireccionSeleccionada, id_ServicioSeleccionado);
        };

        this.obtenerConsumosxLineaFija = function() {
            $scope.errorDetalleConsumo = false;
            $scope.mostrarConsumosFija = false;
            $scope.mostrarDatosAdicionales = false;
            $scope.sinConsumosFijos = false;

            objExito.flagPeriodo = null;
            objExito.flagConsumos = null;
            obtenerConsumosxLineaFija();
        };

        function obtenerConsumosxLineaFija() {
            var id_DireccionSeleccionada = $scope.selectIdDireccion.idDireccion;
            var id_ServicioSeleccionado = $scope.selectLinea.ProductoServicioResponse.idProductoServicio;
            obtenerPeriodosFacturacion(id_DireccionSeleccionada, id_ServicioSeleccionado);
        };

        this.obtenerConsumosFijosxPeriodo = function() {
            $scope.errorDetalleConsumo = false;
            $scope.mostrarConsumosFija = false;
            $scope.sinConsumosFijos = false;
            objExito.flagConsumos = null;
            obtenerConsumosFijosxPeriodo();
        };

        function obtenerConsumosFijosxPeriodo() {
            var id_DireccionSeleccionada = $scope.selectIdDireccion.idDireccion;
            var id_ServicioSeleccionado = $scope.selectLinea.ProductoServicioResponse.idProductoServicio;
            var id_PeriodoSeleccionado = $scope.selectPeriodo.idPeriodo;
            var id_lineaSeleccionada = $scope.lineaFijaSelect.idLinea;
            obtenerConsumoGeneralFija(id_DireccionSeleccionada, id_ServicioSeleccionado, id_PeriodoSeleccionado, id_lineaSeleccionada);
            obtenerDatosAdicionalesServicioFijo(id_DireccionSeleccionada, id_ServicioSeleccionado);
        };

        $scope.buscarServicioxXriterio = function() {
            var valor_input = $('#autocomplete-filtro-fijo').val();
            obtenerLineasClick(valor_input, "10")
        };

        function obtenerLineasClick(valorEntrada, indicador) {
            var dataAutoCriterio = dataAutocomplete(valorEntrada, indicador);
            var idProducServicioAutoClick = '';
            var idDireccionAutoClick = '';
            var idLineaAutoClick = '';
            var outputLineaFija = '';
            servSaldosyConsumosFijo.obtenerListadoLineasFijas(dataAutoCriterio).then(function(response) {
                var rptaExito = response.data.obtenerListadoLineasFijasResponse.defaultServiceResponse.idRespuesta;
                listadoServiciosFijos = response.data.obtenerListadoLineasFijasResponse.listadoProductosServicios;
                if (rptaExito == 0) {
                    if (listadoServiciosFijos != '' && listadoServiciosFijos != undefined) {
                        if (angular.isArray(listadoServiciosFijos)) {
                            $scope.listaAutocompleteClick = response.data.obtenerListadoLineasFijasResponse.listadoProductosServicios;
                            angular.forEach($scope.listaAutocompleteClick, function(val, key) {
                                idProducServicioAutoClick = $scope.listaAutocompleteClick[0].idProductoServicio;
                                idDireccionAutoClick = $scope.listaAutocompleteClick[0].idDireccion;
                                idLineaAutoClick = $scope.listaAutocompleteClick[0].idLinea;
                                outputLineaFija = $scope.listaAutocompleteClick[0].nombre;

                            });
                        } else {
                            $scope.listaAutocompleteClick = [];
                            $scope.listaAutocompleteClick.push(listadoServiciosFijos);
                            angular.forEach($scope.listaAutocompleteClick, function(val, key) {
                                idProducServicioAutoClick = $scope.listaAutocompleteClick[0].idProductoServicio;
                                idDireccionAutoClick = $scope.listaAutocompleteClick[0].idDireccion;
                                idLineaAutoClick = $scope.listaAutocompleteClick[0].idLinea;
                                outputLineaFija = $scope.listaAutocompleteClick[0].nombre;
                            });
                        }
                        $scope.cambiarClassForm();
                        $scope.inputAutocomplete = null;
                        if (outputLineaFija == valorEntrada) {
                            obtenerListadoFijoDireccion(idDireccionAutoClick, idProducServicioAutoClick, "4", idLineaAutoClick);
                        }

                    } else {

                    }
                } else {

                }
            }, function(error) {

            });
        };

        $scope.refreshPortlet = function(indicadorError) {
            if (indicadorError == '1') {
                main();
            } else if (indicadorError == '2') {
                obtenerDatosAdicionalesServicioFijo();
                obtenerConsumosFijosxPeriodo();
            }
        };

        function obtenerServiciosAutocomplete(input_idServicios) {
            $scope.errorDetalleConsumo = false;
            $scope.mostrarConsumosFija = false;
            var idProducServicioAuto = '';
            var idDireccionAuto = '';
            angular.forEach($scope.listaAutocomplete, function(val, key) {
                if (val.idLinea == input_idServicios) {
                    idProducServicioAuto = $scope.listaAutocomplete[key].idProductoServicio;
                    idDireccionAuto = $scope.listaAutocomplete[key].idDireccion;
                }
            });
            obtenerListadoFijoDireccion(idDireccionAuto, idProducServicioAuto, "4", input_idServicios);
        };

        function iniciarAutocomplete() {
            $('#autocomplete-filtro-fijo').autocomplete({
                lookup: function(query, done) {
                    obtenerListadoLineasFijas(done);
                },
                minChars: 4,
                onSelect: function(suggestion) {
                    var input_idServicios = suggestion.data;
                    obtenerServiciosAutocomplete(input_idServicios);
                    $scope.cambiarClassForm();
                    $scope.inputAutocomplete = null;
                    limpiarcombos();
                }
            });
        };

        function obtenerListadoLineasFijas(done) {
            var valorinput = $('#autocomplete-filtro-fijo').val();
            var dataServAutocomplete = dataAutocomplete(valorinput, null);
            var arrayAutocomplete = [];
            var listadoServiciosFijos = '';
            servSaldosyConsumosFijo.obtenerListadoLineasFijas(dataServAutocomplete).then(function(response) {
                var rptaExito = response.data.obtenerListadoLineasFijasResponse.defaultServiceResponse.idRespuesta;
                if (rptaExito == 0) {
                    listadoServiciosFijos = response.data.obtenerListadoLineasFijasResponse.listadoProductosServicios;
                    if (listadoServiciosFijos != '' && listadoServiciosFijos != undefined) {
                        if (angular.isArray(listadoServiciosFijos)) {
                            $scope.listaAutocomplete = response.data.obtenerListadoLineasFijasResponse.listadoProductosServicios;
                            angular.forEach($scope.listaAutocomplete, function(val, key) {
                                arrayAutocomplete.push({
                                    value: val.nombreAlias,
                                    data: val.idLinea
                                });
                            });
                        } else {
                            $scope.listaAutocomplete = [];
                            $scope.listaAutocomplete.push(listadoServiciosFijos);
                            angular.forEach($scope.listaAutocomplete, function(val, key) {
                                arrayAutocomplete.push({
                                    value: val.nombreAlias,
                                    data: val.idLinea
                                });
                            });
                        }
                        var result = {
                            suggestions: arrayAutocomplete
                        };
                        done(result);
                    } else {

                    }
                } else {

                }
            }, function(error) {

            });
        };

        function registrarAuditoria(rptaConsulta, idTransaccion, mensajeAuditoria, flag) {
            if (rptaConsulta != 0) {
                guardarAuditoria(idTransaccion, estadoError, mensajeAuditoria);
            } else if (flag == "Flag" && rptaConsulta == 0) {
                guardarAuditoria(idTransaccion, estadoExito, mensajeAuditoria);
            } else {
                guardarAuditoria(idTransaccion, estadoError, mensajeAuditoria);
            }
        };

        function registrarEstadoConsulta(rpta, idTransaccion, proceso) {
            if (proceso == "DIRECCION") {
                objExito.flagDireccion = rpta;
            } else if (proceso == "SERVFIJO") {
                objExito.flagServiciosFijo = rpta;
            } else if (proceso == "LINEAFIJA") {
                objExito.flagLineaFija = rpta;
            } else if (proceso == "PERIODO") {
                objExito.flagPeriodo = rpta;
            } else if (proceso == "CONSUMOS") {
                objExito.flagConsumos = rpta;
            }
            if (objExito.flagDireccion == 0 && objExito.flagServiciosFijo == 0 && objExito.flagLineaFija == 0 && objExito.flagPeriodo == 0 && objExito.flagConsumos == 0) {
                guardarAuditoria(idTransaccion, estadoExito, "-");
            }
        };

        function guardarAuditoria(idTransaccion, estadoAuditoria, mensajeAuditoria) {
            var dataAuditoria = dataAuditoriaRequest(idTransaccion, estadoAuditoria, mensajeAuditoria);
            servSaldosyConsumosFijo.registrarAuditoria(dataAuditoria).then(function(response) {}, function(error) {

            });
        };

        function dataAuditoriaRequest(transactionId, estadoAuditoria, mensajeAuditoria) {
            var servicioAudi = '';
            var permisoAudi = '';
            if (nombreLinea != '') {
                servicioAudi = nombreLinea;
            } else {
                servicioAudi = servicioAuditoria;
            }
            if (tipoPermisoCorporativo != '') {
                permisoAudi = tipoPermisoCorporativo;
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
            requestAuditoria.operationCode = operationCodeCorporativoSaldosyConsumosFijo;
            requestAuditoria.pagina = pageIdMiclaroCorporativoSaldosyconsumosFijo;
            requestAuditoria.transactionId = transactionId;
            requestAuditoria.estado = estadoAuditoria;
            requestAuditoria.servicio = servicioAudi;
            requestAuditoria.tipoProducto = tipoProductoFijo;
            requestAuditoria.tipoLinea = tipoLineaCorporativaFija;
            requestAuditoria.tipoUsuario = tipoClienteSession;
            requestAuditoria.perfil = permisoAudi;
            requestAuditoria.monto = '';
            requestAuditoria.descripcionoperacion = mensajeAuditoria;
            requestAuditoria.responseType = '-';

            dataAuditoria = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });
            return dataAuditoria;
        }

        function actualizarProductoPrincipal(productoPrinciapl, nombreProducto, idDireccion, idLinea) {
            var actualizar = enviarDataActualizar(productoPrinciapl, nombreProducto, idDireccion, idLinea);
            servSaldosyConsumosFijo.actualizarProductoPrincipal(actualizar).then(function(response) {}, function(error) {

            });
        };

        function enviarDataActualizar(productoPrinciapl, nombreProducto, idDireccion, idLinea) {

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

            requestActualizar.productoPrincipal = productoPrinciapl;
            requestActualizar.nombreProductoPrincipal = nombreProducto;
            requestActualizar.idDireccion = idDireccion;
            requestActualizar.idLinea = idLinea;
            requestActualizar.tipoLinea = tipoLineaCorporativaFija;
            requestActualizar.numeroTelFijo = nombreProducto;
            requestActualizar.categoria = categoriaFijo;
            requestActualizar.tipoClienteProductoPrincipal = tipoClienteCorporativo;

            dataActualizar = $httpParamSerializer({ requestJson: angular.toJson(requestActualizar) });
            return dataActualizar;
        };
    }
]);


ctrlsaldosyconsumos.directive('erTotal', function() {
    return {
        restrict: 'E',
        scope: {},
        template: '<p class="error-server"><strong>' +
            WPSConsultarSaldosConsumosFijoCorporativo.EXCEPCION5 +
            '</strong><br>' +
            '</p>'
    }
})


ctrlsaldosyconsumos.directive('erCustomerror', function() {
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

 ctrlsaldosyconsumos = angular.module('controllerSaldosyConsumos', []);
 ctrlsaldosyconsumos.controller('ctrlSaldosyConsumos', ['$scope', '$window', '$http', 'servSaldosyConsumos', '$httpParamSerializer',
     function($scope, $window, $http, servSaldosyConsumos, $httpParamSerializer) {
         $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

         $scope.divShowLineas = false;
         $scope.checkRadioLineas = false;
         $scope.mostrarInfoMovil = false;
         $scope.checkRadioBolsas = true;
         $scope.flagDatosAdicionalesLinea = false;
         $scope.errorFlagDatosAdicionalesLinea = false;
         $scope.errorFlagServicioCorporativo = false;
         $scope.flagDatosAdicionalesBolsa = false;
         $scope.errorFlagDatosAdicionalesBolsa = false;
         $scope.mostrarDataBolsas = false;
         $scope.mostrarDatosAdicionales = false;
         $scope.mostrarDatosAdicionalesLineas = false;
         $scope.errorMostrarDataBolsas = false;
         $scope.mostrarDataLineas = false;
         $scope.errorMostrarDataLineas = false;
         $scope.showSinServicios = false;
         $scope.formCombos = false;
         $scope.switchSelect = true;
         $scope.flagDatosConsumos = false;
         $scope.errorTotalRedirect = false;
         $scope.mostrarRadioButtons = false;
         $scope.sinBolsas = false;
         $scope.imagenInternet = '/wpstheme/miclaro/img/icon-min-internet.png';
         $scope.imagenMinutos = '/wpstheme/miclaro/img/icon-min-celular.png';
         $scope.imagenSMS = '/wpstheme/miclaro/img/icon-min-mensajes.png';
         $scope.imagenMMS = '/wpstheme/miclaro/img/icon-min-mensajes.png';
         var urlInicio = WPSURLMiClaroRoot;
         $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
         $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
         $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;
         $scope.urlInicio = '/wps/myportal/miclaro/corporativo/consultas/saldosyconsumos/movil';
         var categoriaMovil = WPSCategoria.movil;
         var tipoLineaPostpago = 2;
         var tipoLineatodos = WPSTipoLinea.todos;
         var tipoClienteCorporativo = WPSTipoCliente.corporativo;
         var permisoUsuario = '-';
         var titularidadServicioTodos = WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado;
         var tipoPermisoAll = WPSTipoPermiso.todos;
         var pagina = 0;
         var cantResultadosPagina = 0;
         var objExito = {};
         var pageIdMiclaroCorporativoSaldosyconsumosMovil = WPSPageID.miclaro_corporativo_consultas_saldosyconsumos_movil;
         var operationCodeCorporativoSaldosyConsumosMovilLinea = WPSTablaOperaciones.consultaSaldosConsumos;
         var operationCodeCorporativoSaldosyConsumosMovilBolsa = WPSTablaOperaciones.consultaSaldosConsumosBolsa;
         var estadoExito = 'SUCCESS';
         var estadoError = 'ERROR';
         var tipoProductoMovil = 'MOVIL';
         var operacionObtenerServicio = 'obtenerServicios';
         var operacionObtenerCuenta = 'obtenerListadoMovilCorporativoCuenta';
         var operacionObtenerRecibo = 'obtenerListadoMovilCorporativoRecibo';
         var operacionDatosAdicionales = 'obtenerDatosAdicionalesServicioMovil';
         var operacionConsumoBolsas = 'obtenerConsumoGeneralMovilBolsa';
         var operacionConsumoLinea = 'obtenerConsumoGeneralMovilLineas';
         var count = 0;
         var tipoClienteSession = '';
         var urlConsumer = "/wps/myportal/miclaro/consumer/consultas/saldosyconsumos/movil"
         $scope.mostrarSwitchMovil = false;
         $scope.switchSelect = true;
         $scope.mostrarSwitchSinServicios = false;
         var servicioAuditoria = '';

         angular.element(document).ready(function() {
             init();
             initAutocomplete();
         });

         function init() {
             servSaldosyConsumos.obtenerDatosUsuarioSesion().then(function(response) {
                 var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                 $("#idSaldosyConsumos").show();
                 if (rpta == 0) {
                     tipoClienteSession = response.data.comunResponseType.tipoCliente;
                     var flagServicioMovilSession = response.data.comunResponseType.flagProductoMovilSesion;
                     servicioAuditoria = response.data.comunResponseType.idRecibo;
                     if (flagServicioMovilSession == 2 || flagServicioMovilSession == 3) {
                         $scope.mostrarInfoMovil = true;
                         obtenerServicioPrincipal();
                         if (tipoClienteSession == 4) {
                             $scope.mostrarSwitchMovil = true;
                         }
                     } else if (flagServicioMovilSession == -1) {
                         $scope.errorTotalRedirect = true;
                         var mensajeAuditoriaFlags = operacionObtenerServicio + "- flagMovil";
                         registrarAuditoria(rpta, idTransaccion, mensajeAuditoriaFlags, null);
                     } else {
                         $scope.showSinServicios = true;
                         var mensajeAuditoriaFlags = "-";
                         registrarAuditoria(rpta, idTransaccion, mensajeAuditoriaFlags, "Flag");
                         if (tipoClienteSession == 4) {
                             $scope.mostrarSwitchSinServicios = true;
                         }
                     }
                 }
             }, function(error) {

             });

         };

         var idProductoServicioPrincipal = '';

         function obtenerServicioPrincipal() {
             servSaldosyConsumos.obtenerServicioPrincipal().then(function(response) {
                 var rpta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
                 var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                 if (rpta == 0) {
                     var categoriaPrincipal = parseInt(response.data.comunResponseType.categoria);
                     var tipoClientePrincipal = response.data.comunResponseType.tipoClienteProductoPrincipal;
                     if (categoriaPrincipal == 1 && tipoClientePrincipal == "2") {
                         var idCuentaPrincipal = response.data.comunResponseType.idCuenta;
                         var idReciboPrincipal = response.data.comunResponseType.idRecibo;
                         idProductoServicioPrincipal = response.data.comunResponseType.productoPrincipal;
                         obtenerCuenta(idCuentaPrincipal, idReciboPrincipal, idProductoServicioPrincipal, "1");
                     } else {
                         obtenerCuenta(null, null, null, "2");
                     }
                 } else {
                     $scope.errorTotalRedirect = true;
                 }
             }, function(error) {

             });
         };

         function obtenerCuenta(idCuentaPrincipal, idReciboPrincipal, idProductoServicioLinea, indicador) {
             var idCuentaDefault = '';
             var arrayListadoCuenta = '';
             servSaldosyConsumos.obtenerListadoMovilCorporativoCuenta().then(function(response) {
                 var rpta = parseInt(response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.mensaje;
                 
                 if (rpta == 0) {
                     arrayListadoCuenta = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta;
                     if (arrayListadoCuenta != '' && arrayListadoCuenta != undefined) {
                         if (angular.isArray(arrayListadoCuenta)) {
                             $scope.listadoCuentas = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta;
                             if (indicador == "1" || indicador == "4" || indicador == "9") {
                                 angular.forEach($scope.listadoCuentas, function(val, key) {
                                     if (val.idCuenta == idCuentaPrincipal) {
                                         $scope.selectIdCuenta = $scope.listadoCuentas[key];
                                     }
                                 });
                             } else {
                                 angular.forEach($scope.listadoCuentas, function(val, key) {
                                     $scope.selectIdCuenta = $scope.listadoCuentas[0];
                                     idCuentaDefault = $scope.listadoCuentas[0].idCuenta;
                                 });
                             }
                         } else {
                             $scope.listadoCuentas = [];
                             $scope.listadoCuentas.push(arrayListadoCuenta);
                             if (indicador == "1" || indicador == "4" || indicador == "9") {
                                 angular.forEach($scope.listadoCuentas, function(val, key) {
                                     if (val.idCuenta == idCuentaPrincipal) {
                                         $scope.selectIdCuenta = $scope.listadoCuentas[key];
                                     }
                                 });
                             } else {
                                 angular.forEach($scope.listadoCuentas, function(val, key) {
                                     $scope.selectIdCuenta = $scope.listadoCuentas[0];
                                     idCuentaDefault = $scope.listadoCuentas[0].idCuenta;
                                 });
                             }
                         }
                         if (indicador == "1" || indicador == "4" || indicador == "9") {
                             obtenerRecibos(idCuentaPrincipal, idReciboPrincipal, idProductoServicioLinea, indicador);
                         } else {
                             obtenerRecibos(idCuentaDefault, null, idProductoServicioLinea, indicador);
                         }
                         registrarEstadoConsulta(rpta, idTransaccion, "CUENTA");
                     }
                 } else {
                     $scope.errorTotalRedirect = true;
                     var mensajeAuditoria = operacionObtenerCuenta + "-" + mensajeServicio;
                     registrarAuditoria(rpta, idTransaccion, mensajeAuditoria, null);
                 }
             }, function(error) {

             });
         };

         function obtenerRecibos(idCuenta, idRecibo, idProductoServicioLinea, indicador) {

             var idReciboDefault = '';
             var arrayListadoRecibo = '';
             var dataRecibo = dataReciboEnviar(idCuenta);
             servSaldosyConsumos.obtenerObtenerListadoMovilCorporativoRecibo(dataRecibo).then(function(response) {
                 var rpta = parseInt(response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     $scope.formCombos = true;
                     $scope.flagDatosConsumos = true;
                     $scope.mostrarRadioButtons = true;
                     arrayListadoRecibo = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo;
                     if (arrayListadoRecibo != '' && arrayListadoRecibo != undefined) {
                         if (angular.isArray(arrayListadoRecibo)) {
                             $scope.listadoRecibos = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo;
                             if (indicador == "1" || indicador == "4" || indicador == "9") {
                                 angular.forEach($scope.listadoRecibos, function(val, key) {
                                     if (val.idRecibo == idRecibo) {
                                         $scope.selectIdRecibo = $scope.listadoRecibos[key];
                                     }
                                 });
                             } else {
                                 angular.forEach($scope.listadoRecibos, function(val, key) {
                                     $scope.selectIdRecibo = $scope.listadoRecibos[0];
                                     idReciboDefault = $scope.listadoRecibos[0].idRecibo;
                                 });
                             }
                         } else {
                             $scope.listadoRecibos = [];
                             $scope.listadoRecibos.push(arrayListadoRecibo);
                             if (indicador == "1" || indicador == "4" || indicador == "9") {
                                 angular.forEach($scope.listadoRecibos, function(val, key) {
                                     if (val.idRecibo == idRecibo) {
                                         $scope.selectIdRecibo = $scope.listadoRecibos[key];
                                     }
                                 });
                             } else {
                                 angular.forEach($scope.listadoRecibos, function(val, key) {
                                     $scope.selectIdRecibo = $scope.listadoRecibos[key];
                                     idReciboDefault = $scope.listadoRecibos[0].idRecibo;
                                 });
                             }
                         }
                         if (indicador == "1") {
                             obtenerProductoServicio(idCuenta, idRecibo, idProductoServicioLinea, indicador, null);
                             obtenerConsumosGeneralesBolsa(idCuenta, idRecibo);
                         } else if (indicador == "4") {
                             obtenerProductoServicio(idCuenta, idRecibo, idProductoServicioLinea, indicador, null);
                         } else if (indicador == "2") {
                             obtenerProductoServicio(idCuenta, idReciboDefault, idProductoServicioLinea, indicador, null);
                             obtenerConsumosGeneralesBolsa(idCuenta, idReciboDefault);
                         }
                         registrarEstadoConsulta(rpta, idTransaccion, "RECIBO");
                     }
                 } else {
                     $scope.errorTotalRedirect = true;
                     var mensajeAuditoria = operacionObtenerRecibo + "-" + mensajeServicio;
                     registrarAuditoria(rpta, idTransaccion, mensajeAuditoria, null);
                 }
             }, function(error) {

             });
         };

         function obtenerProductoServicio(idCuenta, idRecibo, idProductoServicioLinea, indicadorBusqueda, criterio) {
             var idProductoServicioDefault = '';
             var listadoLineasPostpago = '';
             var idCuentaAuto = '';
             var idReciboauto = '';
             var dataServicios = dataParaEnviar(idCuenta, idRecibo, criterio, indicadorBusqueda);
             servSaldosyConsumos.obtenerServiciosCorporativos(dataServicios).then(function(response) {
                 var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     listadoLineasPostpago = response.data.obtenerServiciosResponse.listadoProductosServicios;
                     if (listadoLineasPostpago != '' && listadoLineasPostpago != undefined) {
                         if (angular.isArray(listadoLineasPostpago)) {
                             $scope.listadoServicios = response.data.obtenerServiciosResponse.listadoProductosServicios;
                             if (indicadorBusqueda == "1" || indicadorBusqueda == "4") {
                                 angular.forEach($scope.listadoServicios, function(val, key) {
                                     if (val.ProductoServicioResponse.idProductoServicio == idProductoServicioLinea) {
                                         $scope.lineaPrincipal = $scope.listadoServicios[key].ProductoServicioResponse.nombreAlias;
                                         $scope.selectLinea = $scope.listadoServicios[key];
                                         tipoLineaPostpago = $scope.listadoServicios[key].ProductoServicioResponse.tipoLinea;
                                         permisoUsuario = $scope.listadoServicios[key].ProductoServicioResponse.tipoPermiso;
                                     }
                                 });
                             } else {
                                 angular.forEach($scope.listadoServicios, function(val, key) {
                                     $scope.lineaPrincipal = $scope.listadoServicios[0].ProductoServicioResponse.nombreAlias;
                                     $scope.selectLinea = $scope.listadoServicios[0];
                                     idProductoServicioDefault = $scope.listadoServicios[0].ProductoServicioResponse.idProductoServicio;
                                     tipoLineaPostpago = $scope.listadoServicios[0].ProductoServicioResponse.tipoLinea;
                                     permisoUsuario = $scope.listadoServicios[0].ProductoServicioResponse.tipoPermiso;
                                 });
                             }
                         } else {
                             $scope.listadoServicios = [];
                             $scope.listadoServicios.push(listadoLineasPostpago);
                             if (indicadorBusqueda == "1" || indicadorBusqueda == "4") {
                                 angular.forEach($scope.listadoServicios, function(val, key) {
                                     if (val.ProductoServicioResponse.idProductoServicio == idProductoServicioLinea) {
                                         $scope.lineaPrincipal = $scope.listadoServicios[key].ProductoServicioResponse.nombreAlias;
                                         $scope.selectLinea = $scope.listadoServicios[key];
                                         tipoLineaPostpago = $scope.listadoServicios[key].ProductoServicioResponse.tipoLinea;
                                         permisoUsuario = $scope.listadoServicios[key].ProductoServicioResponse.tipoPermiso;
                                     }
                                 });

                             } else if (indicadorBusqueda == "9") {
                                 var totalLineas = $scope.listadoServicios.length;
                                 if (totalLineas > 0) {
                                     angular.forEach($scope.listadoServicios, function(val, key) {
                                         $scope.lineaPrincipal = $scope.listadoServicios[0].ProductoServicioResponse.nombreAlias;
                                         $scope.selectLinea = $scope.listadoServicios[0];
                                         idProductoServicioDefault = $scope.listadoServicios[0].ProductoServicioResponse.idProductoServicio;
                                         idCuentaAuto = $scope.listadoServicios[0].ProductoServicioResponse.idCuenta;
                                         idReciboauto = $scope.listadoServicios[0].ProductoServicioResponse.idRecibo;
                                     });
                                     $scope.flagDatosAdicionalesLinea = false;
                                     $scope.errorflagDatosAdicionalesLinea = false;
                                     $scope.mostrarDatosAdicionalesLineas = false;
                                     $scope.errorMostrarDataLineas = false;
                                     $scope.mostrarDataLineas = false;
                                     obtenerCuenta(idCuentaAuto, idReciboauto, null, indicadorBusqueda);
                                     obtenerDatosAdicionales(idCuenta, idRecibo, idProductoServicioDefault, indicadorBusqueda);
                                     obtenerConsumoGeneralesLinea(idCuenta, idRecibo, idProductoServicioDefault);
                                     actualizarProductoPrincipal(idCuenta, idRecibo, idProductoServicioDefault, $scope.lineaPrincipal);
                                 } else {
                                     $scope.inputLineaMovil = null;
                                     $scope.cambiarClassForm();
                                 }
                             } else {
                                 angular.forEach($scope.listadoServicios, function(val, key) {
                                     $scope.lineaPrincipal = $scope.listadoServicios[0].ProductoServicioResponse.nombreAlias;
                                     $scope.selectLinea = $scope.listadoServicios[0];
                                     idProductoServicioDefault = $scope.listadoServicios[0].ProductoServicioResponse.idProductoServicio;
                                     tipoLineaPostpago = $scope.listadoServicios[0].ProductoServicioResponse.tipoLinea;
                                     permisoUsuario = $scope.listadoServicios[0].ProductoServicioResponse.tipoPermiso;
                                 });
                             }
                         }
                         if (indicadorBusqueda == "1") {
                             obtenerDatosAdicionales(idCuenta, idRecibo, idProductoServicioLinea, indicadorBusqueda);
                         } else if (indicadorBusqueda == "2") {
                             obtenerDatosAdicionales(idCuenta, idRecibo, idProductoServicioDefault, indicadorBusqueda);
                             actualizarProductoPrincipal(idCuenta, idRecibo, idProductoServicioDefault, $scope.lineaPrincipal);
                         } else if (indicadorBusqueda == "3") {
                             obtenerDatosAdicionales(idCuenta, idRecibo, idProductoServicioDefault, indicadorBusqueda);
                             obtenerConsumoGeneralesLinea(idCuenta, idRecibo, idProductoServicioDefault);
                             actualizarProductoPrincipal(idCuenta, idRecibo, idProductoServicioDefault, $scope.lineaPrincipal);
                         } else if (indicadorBusqueda == "4") {
                             obtenerDatosAdicionales(idCuenta, idRecibo, idProductoServicioLinea, indicadorBusqueda);
                             obtenerConsumoGeneralesLinea(idCuenta, idRecibo, idProductoServicioLinea);
                             actualizarProductoPrincipal(idCuenta, idRecibo, idProductoServicioLinea, $scope.lineaPrincipal);
                         }
                         if (indicadorBusqueda == "1" || indicadorBusqueda == "2") {
                             $scope.mostrarDatosAdicionales = true;
                         } else if (indicadorBusqueda == "3" || indicadorBusqueda == "4") {
                             $scope.mostrarDatosAdicionalesLineas = true;
                         }
                         registrarEstadoConsulta(rpta, idTransaccion, "SERCOR");
                     } else {
                         if (indicadorBusqueda != 9) {
                             $scope.errorTotalRedirect = true;
                             var mensajeAuditoria = operacionObtenerServicio + "-" + mensajeServicio;
                             registrarAuditoria(rpta, idTransaccion, mensajeAuditoria, null);
                         }
                         if (indicadorBusqueda == 9) {
                             $scope.inputLineaMovil = null;
                             $scope.cambiarClassForm();
                         }
                     }
                 } else {
                     if ($scope.checkRadioBolsas != true) {
                         if (indicadorBusqueda != 9) {
                             $scope.formCombos = false;
                             $scope.flagDatosConsumos = false;
                             $scope.mostrarRadioButtons = false;
                             $scope.errorTotalRedirect = true;
                             var mensajeAuditoria = operacionObtenerServicio + "-" + mensajeServicio;
                             registrarAuditoria(rpta, idTransaccion, mensajeAuditoria, null);
                         }
                     } else {
                         $scope.errorFlagServicioCorporativo = true;
                     }
                 }
             }, function(error) {

             });
         };

         function obtenerDatosAdicionales(idCuentaDatosAdicional, idReciboDatosAdicionales, idProductoServicio, indicador) {
             var dataDatosAdicionales = dataEnviarDatosAdicionales(idCuentaDatosAdicional, idReciboDatosAdicionales, idProductoServicio);
             servSaldosyConsumos.obtenerDatosAdicionalesServicioMovil(dataDatosAdicionales).then(function(response) {
                 var rpta = response.data.obtenerDatosAdicionalesServicioMovilResponse.defaultServiceResponse.idRespuesta;
                 var idTransaccion = response.data.obtenerDatosAdicionalesServicioMovilResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.obtenerDatosAdicionalesServicioMovilResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     if (indicador == "1" || indicador == "2") {
                         $scope.flagDatosAdicionalesBolsa = true;
                     } else if (indicador == "3" || indicador == "4") {
                         $scope.flagDatosAdicionalesLinea = true;
                     }
                     $scope.lineaCredito = response.data.obtenerDatosAdicionalesServicioMovilResponse.saldoPrepago;
                     $scope.simboloMoneda = response.data.obtenerDatosAdicionalesServicioMovilResponse.simboloMoneda;
                 } else {
                     if (indicador == "1" || indicador == "2") {
                         $scope.errorFlagDatosAdicionalesBolsa = true;
                     } else if (indicador == "3" || indicador == "4") {
                         $scope.errorflagDatosAdicionalesLinea = true;
                     }
                     var mensajeAuditoria = operacionDatosAdicionales + "-" + mensajeServicio;
                     registrarAuditoria(rpta, idTransaccion, mensajeAuditoria, null);
                 }
             }, function(error) {

             });
         };

         function obtenerConsumoGeneralesLinea(idCuentaLineas, idReciboLineas, idServicioPrincipal) {
             var dataConsumosxLinea = dataConsumosGeneralesLineas(idCuentaLineas, idReciboLineas, idServicioPrincipal);
             servSaldosyConsumos.obtenerConsumoGeneralMovilLineas(dataConsumosxLinea).then(function(response) {
                 var rpta = parseInt(response.data.obtenerConsumoGeneralMovilResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.obtenerConsumoGeneralMovilResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.obtenerConsumoGeneralMovilResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     $scope.mostrarDataLineas = true;
                     $scope.fechaPeriodoLinea = response.data.obtenerConsumoGeneralMovilResponse.periodo;
                     ordenarConsumosLineas(response);
                     registrarEstadoConsulta(rpta, idTransaccion, "LINEA");
                 } else {
                     $scope.errorMostrarDataLineas = true;
                     var mensajeAuditoria = operacionConsumoLinea + "-" + mensajeServicio;
                     registrarAuditoria(rpta, idTransaccion, mensajeAuditoria, null);
                 }
             }, function(error) {

             });
         };

         function ordenarConsumosLineas(response) {
             $scope.mostrarDataMmsSms = true;
             $scope.mostrarDataInternet = true;
             $scope.mostrarDataLlamadas = true;
             $scope.mostrarListaAdicionales = true;
             $scope.mostrarListaPrincipal = true;
             $scope.mostrarListaActivos = true;
             $scope.mostrarListaPendientes = true;
             $scope.mostrarLlaamadasAdicionales = true;
             $scope.mostrarLlaamadasPrincipal = true;
             $scope.mostrarLlaamadasRegalados = true;
             $scope.mostrarLlaamadasPendientes = true;
             $scope.mostrarSmsAdicional = true;
             $scope.mostrarMmsPrincipal = true;
             $scope.mostrarSmsPrincipal = true;
             $scope.mostrarSmsRegalado = true;
             $scope.mostrarMmsPendiente = true;
             $scope.mostrarSmsPendiente = true;

             var objInternet = response.data.obtenerConsumoGeneralMovilResponse.internet;
             var objLlamadas = response.data.obtenerConsumoGeneralMovilResponse.llamadas;
             var objMmsSms = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms;


             if (objInternet != '' && objInternet != undefined) {
                 var listaAdicionales = response.data.obtenerConsumoGeneralMovilResponse.internet.listaAdicionalesPlan;
                 var listaPrincipal = response.data.obtenerConsumoGeneralMovilResponse.internet.listaBolsaPrincipalInternet;
                 var listaActivos = response.data.obtenerConsumoGeneralMovilResponse.internet.listaPaquetesActivos;
                 var listaPendientes = response.data.obtenerConsumoGeneralMovilResponse.internet.listaPaquetesPendientes;
                 if (listaAdicionales != '' && listaAdicionales != undefined) {
                     if (angular.isArray(listaAdicionales)) {
                         $scope.internetListaAdicionalesPlan = response.data.obtenerConsumoGeneralMovilResponse.internet.listaAdicionalesPlan;
                         angular.forEach($scope.internetListaAdicionalesPlan, function(val, key) {
                             $scope.fechaVencimientoAdicional = $scope.internetListaAdicionalesPlan[0].fechaVencimiento;
                         });
                     } else {
                         $scope.internetListaAdicionalesPlan = [];
                         $scope.internetListaAdicionalesPlan.push(listaAdicionales);
                         angular.forEach($scope.internetListaAdicionalesPlan, function(val, key) {
                             $scope.fechaVencimientoAdicional = $scope.internetListaAdicionalesPlan[0].fechaVencimiento;
                         });
                     }
                 } else {
                     $scope.mostrarListaAdicionales = false;
                 }
                 if (listaPrincipal != '' && listaPrincipal != undefined) {
                     if (angular.isArray(listaPrincipal)) {
                         $scope.internetListaBolsaPrincipalInternet = response.data.obtenerConsumoGeneralMovilResponse.internet.listaBolsaPrincipalInternet;
                     } else {
                         $scope.internetListaBolsaPrincipalInternet = [];
                         $scope.internetListaBolsaPrincipalInternet.push(listaPrincipal);
                     }
                 } else {
                     $scope.mostrarListaPrincipal = false;
                 }
                 if (listaActivos != '' && listaActivos != undefined) {
                     if (angular.isArray(listaActivos)) {
                         $scope.internetListaPaquetesActivos = response.data.obtenerConsumoGeneralMovilResponse.internet.listaPaquetesActivos;
                     } else {
                         $scope.internetListaPaquetesActivos = [];
                         $scope.internetListaPaquetesActivos.push(listaActivos);
                     }
                 } else {
                     $scope.mostrarListaActivos = false;
                 }
                 if (listaPendientes != '' && listaPendientes != undefined) {
                     if (angular.isArray(listaPendientes)) {
                         $scope.internetListaPaquetesPendientes = response.data.obtenerConsumoGeneralMovilResponse.internet.listaPaquetesPendientes;
                     } else {
                         $scope.internetListaPaquetesPendientes = [];
                         $scope.internetListaPaquetesPendientes.push(listaPendientes);
                     }
                 } else {
                     $scope.mostrarListaPendientes = false;
                 }

             } else {
                 $scope.mostrarDataInternet = false;
             }

             if (objLlamadas != '' && objLlamadas != undefined) {
                 var listaLlamadasAdicionales = response.data.obtenerConsumoGeneralMovilResponse.llamadas.listaAdicionalesPlan;
                 var listaLlamadasPrincipal = response.data.obtenerConsumoGeneralMovilResponse.llamadas.listaBolsaPrincipalLlamadas;
                 var listaLlamadasRegalado = response.data.obtenerConsumoGeneralMovilResponse.llamadas.listaBonosRegalados;
                 var listaLlamadasPendientes = response.data.obtenerConsumoGeneralMovilResponse.llamadas.listaPaquetesPendientesLlamadas;

                 if (listaLlamadasAdicionales != '' && listaLlamadasAdicionales != undefined) {
                     if (angular.isArray(listaLlamadasAdicionales)) {
                         $scope.llamadasListaAdicionalesPlan = response.data.obtenerConsumoGeneralMovilResponse.llamadas.listaAdicionalesPlan;
                         angular.forEach($scope.llamadasListaAdicionalesPlan, function(val, key) {
                             $scope.fechaVencimientoAdicionalLlamadas = $scope.llamadasListaAdicionalesPlan[0].fechaVencimiento;
                         });
                     } else {
                         $scope.llamadasListaAdicionalesPlan = [];
                         $scope.llamadasListaAdicionalesPlan.push(listaLlamadasAdicionales);
                         angular.forEach($scope.llamadasListaAdicionalesPlan, function(val, key) {
                             $scope.fechaVencimientoAdicionalLlamadas = $scope.llamadasListaAdicionalesPlan[0].fechaVencimiento;
                         });
                     }
                 } else {
                     $scope.mostrarLlaamadasAdicionales = false;
                 }
                 if (listaLlamadasPrincipal != '' && listaLlamadasPrincipal != undefined) {
                     if (angular.isArray(listaLlamadasPrincipal)) {
                         $scope.llamadasListaBolsaPrincipalLlamadas = response.data.obtenerConsumoGeneralMovilResponse.llamadas.listaBolsaPrincipalLlamadas;
                     } else {
                         $scope.llamadasListaBolsaPrincipalLlamadas = [];
                         $scope.llamadasListaBolsaPrincipalLlamadas.push(listaLlamadasPrincipal);
                     }
                 } else {
                     $scope.mostrarLlaamadasPrincipal = false;
                 }
                 if (listaLlamadasRegalado != '' && listaLlamadasRegalado != undefined) {
                     if (angular.isArray(listaLlamadasRegalado)) {
                         $scope.llamadasListaBonosRegalados = response.data.obtenerConsumoGeneralMovilResponse.llamadas.listaBonosRegalados;
                     } else {
                         $scope.llamadasListaBonosRegalados = [];
                         $scope.llamadasListaBonosRegalados.push(listaLlamadasRegalado);
                     }
                 } else {
                     $scope.mostrarLlaamadasRegalados = false;
                 }
                 if (listaLlamadasPendientes != '' && listaLlamadasPendientes != undefined) {
                     if (angular.isArray(listaLlamadasPendientes)) {
                         $scope.llamadasListaPaquetesPendientesLlamadas = response.data.obtenerConsumoGeneralMovilResponse.llamadas.listaPaquetesPendientesLlamadas;
                     } else {
                         $scope.llamadasListaPaquetesPendientesLlamadas = [];
                         $scope.llamadasListaPaquetesPendientesLlamadas.push(listaLlamadasPendientes);
                     }
                 } else {
                     $scope.mostrarLlaamadasPendientes = false;
                 }
             } else {
                 $scope.mostrarDataLlamadas = false;
             }

             if (objMmsSms != '' && objMmsSms != undefined) {
                 var listaSmsAdicional = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaAdicionalesPlan;
                 var listaMmsPrincipal = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaBolsaPrincipalMMS;
                 var listaSmsPrincipal = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaBolsaPrincipalSms;
                 var listaSmsRegalados = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaBonosRegalados;
                 var listaMmsPendientes = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaPaquetesPendientesMMS;
                 var listaSmsPendientes = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaPaquetesPendientesSMS;

                 if (listaSmsAdicional != '' && listaSmsAdicional != undefined) {
                     if (angular.isArray(listaSmsAdicional)) {
                         $scope.smsyMmmsListaAdicionalesPlan = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaAdicionalesPlan;
                     } else {
                         $scope.smsyMmmsListaAdicionalesPlan = [];
                         $scope.smsyMmmsListaAdicionalesPlan.push(listaSmsAdicional);
                     }
                 } else {
                     $scope.mostrarSmsAdicional = false;
                 }

                 if (listaMmsPrincipal != '' && listaMmsPrincipal != undefined) {
                     if (angular.isArray(listaMmsPrincipal)) {
                         $scope.smsyMmmsListaBolsaPrincipalMMS = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaBolsaPrincipalMMS;
                     } else {
                         $scope.smsyMmmsListaBolsaPrincipalMMS = [];
                         $scope.smsyMmmsListaBolsaPrincipalMMS.push(listaMmsPrincipal);
                     }
                 } else {
                     $scope.mostrarMmsPrincipal = false;
                 }

                 if (listaSmsPrincipal != '' && listaSmsPrincipal != undefined) {
                     if (angular.isArray(listaSmsPrincipal)) {
                         $scope.smsyMmmsListaBolsaPrincipalSms = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaBolsaPrincipalSms;
                     } else {
                         $scope.smsyMmmsListaBolsaPrincipalSms = [];
                         $scope.smsyMmmsListaBolsaPrincipalSms.push(listaSmsPrincipal);
                     }
                 } else {
                     $scope.mostrarSmsPrincipal = false;
                 }

                 if (listaSmsRegalados != '' && listaSmsRegalados != undefined) {
                     if (angular.isArray(listaSmsRegalados)) {
                         $scope.smsyMmmsListaBonosRegalados = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaBonosRegalados;
                     } else {
                         $scope.smsyMmmsListaBonosRegalados = [];
                         $scope.smsyMmmsListaBonosRegalados.push(listaSmsRegalados);
                     }
                 } else {
                     $scope.mostrarSmsRegalado = false;
                 }

                 if (listaMmsPendientes != '' && listaMmsPendientes != undefined) {
                     if (angular.isArray(listaMmsPendientes)) {
                         $scope.smsyMmmsListaPaquetesPendientesMMS = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaPaquetesPendientesMMS;
                     } else {
                         $scope.smsyMmmsListaPaquetesPendientesMMS = [];
                         $scope.smsyMmmsListaPaquetesPendientesMMS.push(listaMmsPendientes);
                     }
                 } else {
                     $scope.mostrarMmsPendiente = false;
                 }

                 if (listaSmsPendientes != '' && listaSmsPendientes != undefined) {
                     if (angular.isArray(listaSmsPendientes)) {
                         $scope.smsyMmmsListaPaquetesPendientesSMS = response.data.obtenerConsumoGeneralMovilResponse.smsyMmms.listaPaquetesPendientesSMS;
                     } else {
                         $scope.smsyMmmsListaPaquetesPendientesSMS = [];
                         $scope.smsyMmmsListaPaquetesPendientesSMS.push(listaSmsPendientes);
                     }
                 } else {
                     $scope.mostrarSmsPendiente = false;
                 }

             } else {
                 $scope.mostrarDataMmsSms = false;
             }
         };

         function obtenerConsumosGeneralesBolsa(idCuentaConsumos, idReciboConsumos) {
             $scope.sinBolsas = false;
             var dataConsumos = dataConsumosGenerales(idCuentaConsumos, idReciboConsumos);
             servSaldosyConsumos.obtenerConsumoGeneralMovilBolsa(dataConsumos).then(function(response) {
                 var rpta = parseInt(response.data.obtenerConsumoGeneralMovilBolsaResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.obtenerConsumoGeneralMovilBolsaResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.obtenerConsumoGeneralMovilBolsaResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     $scope.listadoConsumos = [];
                     $scope.fechaPeriodo = response.data.obtenerConsumoGeneralMovilBolsaResponse.periodo;
                     var listaConsumoBolsas = response.data.obtenerConsumoGeneralMovilBolsaResponse.listadoConsumoMovilBolsa;
                     $scope.listadoConsumos = response.data.obtenerConsumoGeneralMovilBolsaResponse.listadoConsumoMovilBolsa;

                     if (listaConsumoBolsas != undefined && listaConsumoBolsas != '') {
                         $scope.mostrarDataBolsas = true;
                         if (angular.isArray(response.data.obtenerConsumoGeneralMovilBolsaResponse.listadoConsumoMovilBolsa)) {
                             $scope.listadoConsumos = response.data.obtenerConsumoGeneralMovilBolsaResponse.listadoConsumoMovilBolsa;
                         } else {
                             $scope.listadoConsumos = [];
                             $scope.listadoConsumos.push(listaConsumoBolsas);
                         }

                     } else {

                         $scope.sinBolsas = true;
                     }
                     registrarEstadoConsulta(rpta, idTransaccion, "BOLSA");
                 } else {
                     $scope.errorMostrarDataBolsas = true;
                     var mensajeAuditoria = operacionConsumoBolsas + "-" + mensajeServicio;
                     registrarAuditoria(rpta, idTransaccion, mensajeAuditoria, null);
                 }
             }, function(error) {

             });
         };

         $scope.funcionImagen = function(valor) {
             if (valor == "1") {
                 return $scope.imagenInternet;
             } else if (valor == "2") {
                 return $scope.imagenMinutos;
             } else if (valor == "3") {
                 return $scope.imagenSMS;
             } else if (valor == "4") {
                 return $scope.imagenMMS;
             }
         };


         $scope.cambiarClaseRadioButton = function(valorCheck) {
             if (valorCheck == '202') {
                 $scope.checkRadioBolsas = false;
                 $scope.checkRadioLineas = true;
                 $scope.divShowLineas = true;
                 objExito.flagBolsa = null;
                 mostrarLineasInternet();
                 getServiciosLineaEspecifica();
             } else if (valorCheck == '101') {
                 $scope.checkRadioBolsas = true;
                 $scope.checkRadioLineas = false;
                 $scope.divShowLineas = false;
                 mostrarBolsasInternet();
                 getServicioxBolsas();
             }
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

         function getServiciosLineaEspecifica() {
             var idCuentaxLinea = $scope.selectIdCuenta.idCuenta;
             var idReciboxLinea = $scope.selectIdRecibo.idRecibo;
             obtenerProductoServicio(idCuentaxLinea, idReciboxLinea, null, "3", null);
         };

         function getServicioxBolsas() {
             var idCuentaxBolsa = $scope.selectIdCuenta.idCuenta;
             var idReciboxBolsa = $scope.selectIdRecibo.idRecibo;
             obtenerConsumosGeneralesBolsa(idCuentaxBolsa, idReciboxBolsa);
             obtenerProductoServicio(idCuentaxBolsa, idReciboxBolsa, null, "2", null);
         };

         this.buscarServiciosxRecibo = function() {
             buscarServiciosxRecibo();
         };

         function buscarServiciosxRecibo() {
             objExito.flagRecibo = null;
             objExito.flagServiciosCorporativos = null;
             objExito.flagLinea = null;
             objExito.flagBolsa = null;
             var idCuentaSeleccionada = $scope.selectIdCuenta.idCuenta;

             if ($scope.checkRadioBolsas == false && $scope.checkRadioLineas == true) {
                 $scope.errorMostrarDataLineas = false;
                 $scope.errorflagDatosAdicionalesLinea = false;
                 $scope.flagDatosAdicionalesLinea = false;
                 $scope.mostrarDatosAdicionalesLineas = false;
                 $scope.mostrarDataLineas = false;
                 obtenerRecibos(idCuentaSeleccionada, null, "3");
             } else if ($scope.checkRadioBolsas == true && $scope.checkRadioLineas == false) {
                 $scope.errorMostrarDataBolsas = false;
                 $scope.errorFlagDatosAdicionalesBolsa = false;
                 $scope.flagDatosAdicionalesBolsa = false;
                 $scope.mostrarDatosAdicionales = false;
                 $scope.mostrarDataBolsas = false;
                 obtenerRecibos(idCuentaSeleccionada, null,null, "2");
             }
         };


         this.buscarServiciosxReciboyCuenta = function() {
             buscarServiciosxReciboyCuenta();
         };

         function buscarServiciosxReciboyCuenta() {
             $scope.errorMostrarDataLineas = false;
             var idCuentaSeleccionada = $scope.selectIdCuenta.idCuenta;
             var idReciboSeleccionado = $scope.selectIdRecibo.idRecibo;
             objExito.flagServiciosCorporativos = null;
             objExito.flagLinea = null;
             objExito.flagBolsa = null;
             if ($scope.checkRadioBolsas == false && $scope.checkRadioLineas == true) {
                 $scope.errorMostrarDataLineas = false;
                 $scope.errorflagDatosAdicionalesLinea = false;
                 $scope.flagDatosAdicionalesLinea = false;
                 $scope.mostrarDatosAdicionalesLineas = false;
                 $scope.mostrarDataLineas = false;
                 obtenerProductoServicio(idCuentaSeleccionada, idReciboSeleccionado, null, "3", null);
             } else if ($scope.checkRadioBolsas == true && $scope.checkRadioLineas == false) {
                 $scope.errorMostrarDataBolsas = false;
                 $scope.errorFlagDatosAdicionalesBolsa = false;
                 $scope.flagDatosAdicionalesBolsa = false;
                 $scope.mostrarDatosAdicionales = false;
                 $scope.mostrarDataBolsas = false;
                 obtenerConsumosGeneralesBolsa(idCuentaSeleccionada, idReciboSeleccionado);
                 obtenerProductoServicio(idCuentaSeleccionada, idReciboSeleccionado, null, "2", null);
             }
         };

         this.buscarDetalleConsumoxLinea = function() {
             buscarDetalleConsumoxLinea();
         };

         function buscarDetalleConsumoxLinea() {
             objExito.flagLinea = null;
             objExito.flagBolsa = null;

             $scope.errorMostrarDataLineas = false;
             $scope.errorflagDatosAdicionalesLinea = false;
             $scope.flagDatosAdicionalesLinea = false;
             $scope.mostrarDataLineas = false;
             var idCuentaSeleccionada = $scope.selectIdCuenta.idCuenta;
             var idReciboSeleccionado = $scope.selectIdRecibo.idRecibo;
             var idProductoServicioSeleccionada = $scope.selectLinea.ProductoServicioResponse.idProductoServicio;
             var nombreProductoSelect = $scope.selectLinea.ProductoServicioResponse.nombreAlias;
             $scope.lineaPrincipal = $scope.selectLinea.ProductoServicioResponse.nombreAlias;
             obtenerConsumoGeneralesLinea(idCuentaSeleccionada, idReciboSeleccionado, idProductoServicioSeleccionada);
             obtenerDatosAdicionales(idCuentaSeleccionada, idReciboSeleccionado, idProductoServicioSeleccionada, "3");
             actualizarProductoPrincipal(idCuentaSeleccionada, idReciboSeleccionado, idProductoServicioSeleccionada, nombreProductoSelect);
         };

         function dataParaEnviar(idCuentaParaRequest, idReciboParaRequest, criterio, indicadorBusqueda) {
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
             requestServiciosMoviles.tipoLinea = tipoLineatodos;
             requestServiciosMoviles.tipoCliente = tipoClienteCorporativo;
             requestServiciosMoviles.tipoPermiso = tipoPermisoAll;
             requestServiciosMoviles.idCuenta = idCuentaParaRequest;
             requestServiciosMoviles.idRecibo = idReciboParaRequest;
             requestServiciosMoviles.pagina = pagina;
             requestServiciosMoviles.cantResultadosPagina = cantResultadosPagina;
             requestServiciosMoviles.titularidadServicio = titularidadServicioTodos;
             if (indicadorBusqueda == "9") {
                 requestServiciosMoviles.nombreProducto = criterio;
             }

             dataServiciosMoviles = $httpParamSerializer({ requestJson: angular.toJson(requestServiciosMoviles) });
             return dataServiciosMoviles;
         };

         function dataConsumosGenerales(idCuentaConsumo, idReciboConsumos) {
             var requestConsumoGeneralesBolsa = {
                 "idCuenta": null,
                 "idRecibo": null
             }
             requestConsumoGeneralesBolsa.idCuenta = idCuentaConsumo;
             requestConsumoGeneralesBolsa.idRecibo = idReciboConsumos;
             dataConsumosGeneralesBolsa = $httpParamSerializer({ requestJson: angular.toJson(requestConsumoGeneralesBolsa) });
             return dataConsumosGeneralesBolsa;
         };

         function dataConsumosGeneralesLineas(idCuentaLineas, idReciboLineas, idServicioPrinLineas) {
             var requestConsumoGeneralesLinea = {
                 "idProductoServicio": null,
                 "idCuenta": null,
                 "idRecibo": null,
                 "tipoCliente": null
             }
             requestConsumoGeneralesLinea.idProductoServicio = idServicioPrinLineas;
             requestConsumoGeneralesLinea.idCuenta = idCuentaLineas;
             requestConsumoGeneralesLinea.idRecibo = idReciboLineas;
             requestConsumoGeneralesLinea.tipoCliente = tipoClienteCorporativo;
             dataConsumosGeneralesLinea = $httpParamSerializer({ requestJson: angular.toJson(requestConsumoGeneralesLinea) });
             return dataConsumosGeneralesLinea;
         };

         function dataEnviarDatosAdicionales(idCuentaDatosAdicional, idReciboDatosAdicionales, idProductoServicio) {
             var requestDatosAdicionales = {
                 "idProductoServicio": null,
                 "idCuenta": null,
                 "idRecibo": null,
                 "tipoCliente": null
             }
             requestDatosAdicionales.idProductoServicio = idProductoServicio;
             requestDatosAdicionales.idCuenta = idCuentaDatosAdicional;
             requestDatosAdicionales.idRecibo = idReciboDatosAdicionales;
             requestDatosAdicionales.tipoCliente = tipoClienteCorporativo;
             dataDatosAdicionales = $httpParamSerializer({ requestJson: angular.toJson(requestDatosAdicionales) });
             return dataDatosAdicionales;
         };

         function dataReciboEnviar(idCuentaRequest) {
             var requestReciboCoor = {
                 "idCuenta": null
             };
             requestReciboCoor.idCuenta = idCuentaRequest;
             dataReciboCoor = $httpParamSerializer({ requestJson: angular.toJson(requestReciboCoor) });
             return dataReciboCoor;
         };

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
         };

         function dataAuditoriaRequest(operacion, transactionId, descripcion, estadoAuditoria) {
             var servicioAudi = '';
             var permisoAudi = '';

             if ($scope.lineaPrincipal != '') {
                 servicioAudi = $scope.lineaPrincipal;
             } else {
                 servicioAudi = servicioAuditoria;
             }
             if (permisoUsuario != '') {
                 permisoAudi = permisoUsuario;
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
             requestAuditoria.operationCode = operacion;
             requestAuditoria.pagina = pageIdMiclaroCorporativoSaldosyconsumosMovil;
             requestAuditoria.transactionId = transactionId;
             requestAuditoria.estado = estadoAuditoria;
             requestAuditoria.servicio = servicioAudi;
             requestAuditoria.tipoProducto = tipoProductoMovil;
             requestAuditoria.tipoLinea = tipoLineaPostpago;
             requestAuditoria.tipoUsuario = tipoClienteSession;
             requestAuditoria.perfil = permisoUsuario;
             requestAuditoria.monto = '';
             requestAuditoria.descripcionoperacion = descripcion;
             requestAuditoria.responseType = '-';

             dataAuditoria = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });
             return dataAuditoria;
         };

         this.buscarServicioxXriterio = function() {
             buscarServicioxXriterio();
         };

         function buscarServicioxXriterio() {
             objExito.flagLinea = null;
             objExito.flagBolsa = null;
             objExito.flagServiciosCorporativos = null;
             var valor_input = $('#autocomplete-filtro-movil').val();
             obtenerProductoServicio(null, null, null, "9", valor_input);
         };

         $scope.refreshPortlet = function(indicadorError) {
             if (indicadorError == "1") {
                 $scope.errorFlagDatosAdicionalesBolsa = false;
                 buscarServiciosxReciboyCuenta();
             } else if (indicadorError == "2") {
                 $scope.errorMostrarDataBolsas = false;
                 buscarServiciosxReciboyCuenta();
             } else if (indicadorError == "3") {
                 $scope.errorflagDatosAdicionalesLinea = false;
                 buscarDetalleConsumoxLinea();
             } else if (indicadorError == "4") {
                 $scope.errorMostrarDataLineas = false;
                 buscarDetalleConsumoxLinea();
             }
         };

         function obtenerDatosAutocomplete(input_idServicios) {
             $scope.flagDatosAdicionalesLinea = false;
             $scope.errorflagDatosAdicionalesLinea = false;
             $scope.mostrarDatosAdicionalesLineas = false;
             $scope.errorMostrarDataLineas = false;
             $scope.mostrarDataLineas = false;

             var idCuentaAuto = '';
             var idReciboAuto = '';
             angular.forEach($scope.listaAutocomplete, function(val, key) {
                 if (val.idProductoServicio == input_idServicios) {
                     idCuentaAuto = $scope.listaAutocomplete[key].idCuenta;
                     idReciboAuto = $scope.listaAutocomplete[key].idRecibo;
                 }
             });
             obtenerCuenta(idCuentaAuto, idReciboAuto, input_idServicios, "4")
         };

         function obtenerServiciosAutocomplete(done) {
             var valorinput = $('#autocomplete-filtro-movil').val();
             var dataServAutocomplete = dataAutocomplete(valorinput);
             var arrayAutocomplete = [];
             var listadoAutocomplete = '';
             servSaldosyConsumos.obtenerServiciosAutocomplete(dataServAutocomplete).then(function(response) {
                 var rpta = parseInt(response.data.obtenerListadoMovilesResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.obtenerListadoMovilesResponse.defaultServiceResponse.idTransaccional;
                 if (rpta == 0) {
                     listadoAutocomplete = response.data.obtenerListadoMovilesResponse.listadoProductosServicios;
                     if (listadoAutocomplete != '' && listadoAutocomplete != undefined) {
                         if (angular.isArray(listadoAutocomplete)) {
                             $scope.listaAutocomplete = response.data.obtenerListadoMovilesResponse.listadoProductosServicios;
                             angular.forEach($scope.listaAutocomplete, function(val, key) {
                                 arrayAutocomplete.push({
                                     value: val.nombreAlias,
                                     data: val.idProductoServicio
                                 });
                             });
                         } else {
                             $scope.listaAutocomplete = [];
                             $scope.listaAutocomplete.push(listadoAutocomplete);
                             angular.forEach($scope.listaAutocomplete, function(val, key) {
                                 arrayAutocomplete.push({
                                     value: val.nombreAlias,
                                     data: val.idProductoServicio
                                 });
                             });
                         }
                         var result = {
                             suggestions: arrayAutocomplete
                         };
                         done(result);
                     }

                 } else {

                 }
             }, function(error) {

             });
         };

         function initAutocomplete() {
             $('#autocomplete-filtro-movil').autocomplete({
                 lookup: function(query, done) {
                     obtenerServiciosAutocomplete(done);
                 },
                 minChars: 4,
                 onSelect: function(suggestion) {
                     var input_idServicios = suggestion.data;
                     objExito.flagLinea = null;
                     objExito.flagBolsa = null;
                     objExito.flagServiciosCorporativos = null;
                     $scope.mostrarDataLineas = false;
                     obtenerDatosAutocomplete(input_idServicios);
                     $scope.inputLineaMovil = null;
                     $scope.cambiarClassForm();
                 }
             });
         }

         function registrarAuditoria(rptaConsulta, idTransaccion, mensajeAuditoria, flag) {
             if (rptaConsulta != 0) {
                 guardarAuditoria(idTransaccion, estadoError, mensajeAuditoria);
             } else if (flag == "Flag" && rptaConsulta == 0) {
                 guardarAuditoria(idTransaccion, estadoExito, mensajeAuditoria);
             } else {
                 guardarAuditoria(idTransaccion, estadoError, mensajeAuditoria);
             }
         };

         function guardarAuditoria(idTransaccion, estadoAuditoria, mensajeAuditoria) {
             if ($scope.checkRadioBolsas == true) {
                 var operacion = operationCodeCorporativoSaldosyConsumosMovilBolsa;
                 var dataAuditoriaMovil = dataAuditoriaRequest(operacion, idTransaccion, mensajeAuditoria, estadoAuditoria);
                 servSaldosyConsumos.guardarAuditoria(dataAuditoriaMovil).then(function(response) {}, function(error) {

                 });
             } else {
                 var operacion = operationCodeCorporativoSaldosyConsumosMovilLinea;
                 var dataAuditoriaMovil = dataAuditoriaRequest(operacion, idTransaccion, mensajeAuditoria, estadoAuditoria);
                 servSaldosyConsumos.guardarAuditoria(dataAuditoriaMovil).then(function(response) {}, function(error) {

                 });
             }
         };

         function registrarEstadoConsulta(rpta, idTransaccion, codigo) {
             if (codigo == "CUENTA") {
                 objExito.flagCuenta = rpta;
             } else if (codigo == "RECIBO") {
                 objExito.flagRecibo = rpta;
             } else if (codigo == "SERCOR") {
                 objExito.flagServiciosCorporativos = rpta;
             } else if (codigo == "BOLSA") {
                 objExito.flagBolsa = rpta;
             } else if (codigo == "LINEA") {
                 objExito.flagLinea = rpta;
             }

             if (objExito.flagCuenta == 0 && objExito.flagRecibo == 0 && objExito.flagServiciosCorporativos == 0 && objExito.flagBolsa == 0) {
                 guardarAuditoria(idTransaccion, estadoExito, "-");
             } else if (objExito.flagCuenta == 0 && objExito.flagRecibo == 0 && objExito.flagServiciosCorporativos == 0 && objExito.flagLinea == 0) {
                 guardarAuditoria(idTransaccion, estadoExito, "-");
             } else if (objExito.flagCuenta == 0 && objExito.flagRecibo == 0 && objExito.flagBolsa == 0) {
                 guardarAuditoria(idTransaccion, estadoExito, "-");
             }
         };

         function actualizarProductoPrincipal(idCuenta, idRecibo, productoPrinciapl, nombreProducto) {
             var actualizar = enviarDataActualizar(idCuenta, idRecibo, productoPrinciapl, nombreProducto);
             servSaldosyConsumos.actualizarProductoPrincipal(actualizar).then(function(response) {}, function(error) {

             });
         };

         function enviarDataActualizar(idCuenta, idRecibo, productoPrinciapl, nombreProducto) {
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
             requestActualizar.idCuenta = idCuenta;
             requestActualizar.idRecibo = idRecibo;
             requestActualizar.tipoLinea = tipoLineaPostpago;
             requestActualizar.categoria = categoriaMovil;
             requestActualizar.tipoClienteProductoPrincipal = tipoClienteCorporativo;

             dataActualizar = $httpParamSerializer({ requestJson: angular.toJson(requestActualizar) });
             return dataActualizar;
         };


         $scope.switchChange = function() {
             $window.location.href = urlConsumer;
         };
     }
 ]);

 ctrlsaldosyconsumos.directive('valCustom', function() {
     return function(scope, element, attrs) {
         attrs.$observe('valCustom', function() {
             var percent = '<div class=\"percent\"></div>';
             element.append(percent);
             element.find('.percent').css({ background: element.attr("data-color") });
             element.find('.percent').animate({ width: element.attr("data-percent") + '%' }, 350);
             if (element.attr("data-value") !== undefined && element.attr("data-value") !== '') {
                 var divvalue = $('<span class=\"txt\">' + element.attr("data-value") + element.attr("data-unidad") + '</span>');
                 element.append(divvalue);
                 element.find('.txt').animate({ left: element.attr("data-percent") + '%', opacity: 1 });
             }
         });
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
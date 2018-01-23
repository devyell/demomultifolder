 ctrlDirectorioTelefonico = angular.module('ctrlDirectorioTelefonicoCorpoMovil', []);
 ctrlDirectorioTelefonico.controller('ctrlDirectorioCorpoMovil', ['$scope', '$http', 'servDirectorioCorpoMovil', '$httpParamSerializer',
     function($scope, $http, servDirectorioCorpoMovil, $httpParamSerializer) {
         $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

         var pageIdDirectorioMovil = WPSPageID.miclaro_corporativo_solicitudes_registrodirectoriotelefonico_movil;
         var trasactionIdAfiliarDirectorioMovil = WPSTablaOperaciones.afiliarDirectorioTelefonico;
         var trasactionIdDesafiliarDirectorioMovil = WPSTablaOperaciones.desafiliarDirectorioTelefonico;
         var estadoExito = 'SUCCESS';
         var estadoError = 'ERROR';
         var tipoProductoMovil = 'MOVIL';

         $scope.mostrarFiltros = false;
         $scope.mostrarDirectorio = false;
         $scope.errorTotalRedirect = false;
         $scope.showSinServicios = false;
         $scope.errorDirectorio = false;

         $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
         $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
         $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;
         $scope.mensaje_ups = WPSMensajeError.upps;
         $scope.ups_descripcion1 = WPSMensajeError.upps_descripcion01;
         $scope.ups_descripcion2 = WPSMensajeError.upps_descripcion03;
         $scope.urlInicio = '/wps/myportal/miclaro/corporativo/solicitudes/registrodirectoriotelefonico/movil';
         var urlConsumer = '/wps/myportal/miclaro/consumer/solicitudes/registrodirectoriotelefonico/movil';

         var categoriaMovil = WPSCategoria.movil;
         var tipoLineaPostpago = WPSTipoLinea.postpago;
         var tipoClienteCorporativo = WPSTipoCliente.corporativo;
         var titularidadServicioTodos = WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado;
         var tipoPermisoAll = WPSTipoPermiso.todos;
         var pagina = 0;
         var cantResultadosPagina = 0;
         $scope.index = '';
         var idProductoServicioAceptado = '';
         $scope.switchSelect = true;
         $scope.mostrarSwitchCorporativo = false;

         var operacionObtenerCuenta = 'obtenerListadoMovilCorporativoCuenta';
         var operacionObtenerRecibo = 'obtenerListadoMovilCorporativoRecibo';
         var operacionObtenerServicio = 'obtenerServicios';
         var operacionObtenerDirectorio = 'obtenerDirectorioTelefonico';
         var operacionActualizarDirectorio = 'modificarAfiliacionDirectorioTelefonico';
         var codConsultaDirectorio = '-';
         var lineaEnConsultaSession = '-';
         var tipoLineaSession = '-';
         var tipoClienteSession = '-';



         angular.element(document).ready(function() {
             init();
             initAutocomplete();
         });

         function init() {
             servDirectorioCorpoMovil.obtenerDatosUsuario().then(function(response) {
                 var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                 if (rpta == 0) {
                     tipoClienteSession = response.data.comunResponseType.tipoCliente;
                     var flagServicioMovilSession = response.data.comunResponseType.flagProductoMovilSesion;

                     if (flagServicioMovilSession == 2 || flagServicioMovilSession == 3) {
                         obtenerServicioPrincipal();
                     } else if (flagServicioMovilSession == -1) {
                         $scope.errorTotalRedirect = true;
                         var mensajeAuditoria = operacionObtenerServicio + "- flagMovil";
                         registrarEstadoError(flagServicioMovilSession, idTransaccion, mensajeAuditoria);
                     } else {
                         $scope.showSinServicios = true;
                         registrarEstadoExito(rpta, idTransaccion, "-");
                     }
                     if (tipoClienteSession == 4) {
                         $scope.mostrarSwitchCorporativo = true;
                     }
                 }
             }, function(error) {

             });
         };

         $scope.switchChange = function() {
             window.location.href = urlConsumer;
         };

         function obtenerServicioPrincipal() {
             servDirectorioCorpoMovil.obtenerProductoPrincipal().then(function(response) {
                 var rpta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
                 var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                 if (rpta == 0) {
                     var categoriaPrincipal = parseInt(response.data.comunResponseType.categoria);
                     var tipoClientePrincipal = response.data.comunResponseType.tipoClienteProductoPrincipal;
                     if (categoriaPrincipal == 1 && tipoClientePrincipal == "2") {
                         var idCuentaPrincipal = response.data.comunResponseType.idCuenta;
                         var idReciboPrincipal = response.data.comunResponseType.idRecibo;
                         var idServicioPrincipal = response.data.comunResponseType.productoPrincipal;
                         obtenerCuenta(idCuentaPrincipal, idReciboPrincipal, idServicioPrincipal, "1");
                     } else {
                         obtenerCuenta(null, null, null, "2");
                     }

                 } else {

                 }
             }, function(error) {

             });
         };

         function obtenerCuenta(idCuentaPrincipal, idReciboPrincipal, idServicioPrincipal, indicador) {
             var idCuentaDefault = '';
             var listCuentasCorpo = '';
             servDirectorioCorpoMovil.obtenerListadoMovilCorporativoCuenta().then(function(response) {
                 var rpta = parseInt(response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     listCuentasCorpo = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta;
                     if (listCuentasCorpo != undefined && listCuentasCorpo != '') {
                         if (angular.isArray(listCuentasCorpo)) {
                             $scope.listadoCuentas = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta;
                             if (indicador == "1" || indicador == "3" || indicador == "9") {
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
                             $scope.listadoCuentas.push(listCuentasCorpo);
                             if (indicador == "1" || indicador == "3" || indicador == "9") {
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
                         if (indicador == "1" || indicador == "3" || indicador == "9") {
                             obtenerRecibos(idCuentaPrincipal, idReciboPrincipal, idServicioPrincipal, indicador);
                         } else {
                             obtenerRecibos(idCuentaDefault, null, null, indicador);
                         }

                         registrarEstadoExito(rpta, idTransaccion, "CUENTA");
                     } else {
                         $scope.errorTotalRedirect = true;
                     }
                 } else {
                     $scope.errorTotalRedirect = true;
                     var mensajeAuditoria = operacionObtenerCuenta + "-" + mensajeServicio;
                     registrarEstadoError(rpta, idTransaccion, mensajeAuditoria);
                 }
             }, function(error) {

             });
         };

         function obtenerRecibos(idCuenta, idRecibo, idServicioPrincipal, indicador) {
             var idReciboDefault = '';
             var listRecibosCorpo = '';
             var dataRecibo = dataReciboEnviar(idCuenta);
             servDirectorioCorpoMovil.obtenerListadoMovilCorporativoRecibo(dataRecibo).then(function(response) {
                 var rpta = parseInt(response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     listRecibosCorpo = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo;
                     if (listRecibosCorpo != undefined && listRecibosCorpo != '') {
                         if (angular.isArray(listRecibosCorpo)) {
                             $scope.listadoRecibos = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo;
                             if (indicador == "1" || indicador == "3" || indicador == "9") {
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
                             $scope.listadoRecibos.push(listRecibosCorpo);
                             if (indicador == "1" || indicador == "3" || indicador == "9") {
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
                         if (indicador == "1" || indicador == "3") {
                             obtenerProductoServicio(idCuenta, idRecibo, idServicioPrincipal, indicador, null);
                         } else if (indicador == "9") {
                             obtenerDirectorioTelefonico(idCuenta, idRecibo, idServicioPrincipal);
                         } else if (indicador == "2") {
                             obtenerProductoServicio(idCuenta, idReciboDefault, null, indicador, null);
                         }
                         registrarEstadoExito(rpta, idTransaccion, "RECIBO");
                     } else {
                         $scope.errorTotalRedirect = true;
                     }
                 } else {
                     $scope.errorTotalRedirect = true;
                     var mensajeAuditoria = operacionObtenerRecibo + "-" + mensajeServicio;
                     registrarEstadoError(rpta, idTransaccion, mensajeAuditoria);
                 }
             }, function(error) {

             });
         };

         function obtenerProductoServicio(idCuenta, idRecibo, idServicioPrincipal, indicadorBusqueda, criterio) {
             var idCuentaAuto = '';
             var idReciboAuto = '';
             var idServicioAutocomplete = '';
             var idProductoServicioDefault = '';
             var listaServiciosMoviles = '';
             var lengthAutocomplete = 0;
             var nonmbreLinea = '';
             var dataServicios = dataParaEnviar(idCuenta, idRecibo, indicadorBusqueda, criterio);
             servDirectorioCorpoMovil.obtenerServiciosCorporativos(dataServicios).then(function(response) {
                 var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     $scope.mostrarFiltros = true;
                     listaServiciosMoviles = response.data.obtenerServiciosResponse.listadoProductosServicios;
                     if (listaServiciosMoviles != undefined && listaServiciosMoviles != '') {
                         if (angular.isArray(listaServiciosMoviles)) {
                             $scope.listadoServicios = response.data.obtenerServiciosResponse.listadoProductosServicios;
                             lengthAutocomplete = $scope.listadoServicios.length;
                             if (indicadorBusqueda == "1" || indicadorBusqueda == "3") {
                                 angular.forEach($scope.listadoServicios, function(val, key) {
                                     if (val.ProductoServicioResponse.idProductoServicio == idServicioPrincipal) {
                                         $scope.selectLinea = $scope.listadoServicios[key];
                                         nonmbreLinea = $scope.listadoServicios[key].ProductoServicioResponse.nombreAlias;
                                         tipoLineaSession = $scope.listadoServicios[key].ProductoServicioResponse.tipoLinea;
                                         permisoAuditoria = $scope.listadoServicios[key].ProductoServicioResponse.tipoPermiso;
                                     }
                                 });
                             } else {
                                 angular.forEach($scope.listadoServicios, function(val, key) {
                                     $scope.selectLinea = $scope.listadoServicios[0];
                                     idProductoServicioDefault = $scope.listadoServicios[0].ProductoServicioResponse.idProductoServicio;
                                     nonmbreLinea = $scope.listadoServicios[0].ProductoServicioResponse.nombreAlias;
                                     tipoLineaSession = $scope.listadoServicios[0].ProductoServicioResponse.tipoLinea;
                                     permisoAuditoria = $scope.listadoServicios[0].ProductoServicioResponse.tipoPermiso;
                                 });
                             }

                         } else {
                             $scope.listadoServicios = [];
                             $scope.listadoServicios.push(listaServiciosMoviles);
                             lengthAutocomplete = $scope.listadoServicios.length;
                             if (indicadorBusqueda == "1" || indicadorBusqueda == "3") {
                                 angular.forEach($scope.listadoServicios, function(val, key) {
                                     if (val.ProductoServicioResponse.idProductoServicio == idServicioPrincipal) {
                                         $scope.selectLinea = $scope.listadoServicios[key];
                                         nonmbreLinea = $scope.listadoServicios[key].ProductoServicioResponse.nombreAlias;
                                         tipoLineaSession = $scope.listadoServicios[key].ProductoServicioResponse.tipoLinea;
                                         permisoAuditoria = $scope.listadoServicios[key].ProductoServicioResponse.tipoPermiso;
                                     }
                                 });
                             } else if (indicadorBusqueda == "9") {
                                 angular.forEach($scope.listadoServicios, function(val, key) {
                                     $scope.selectLinea = $scope.listadoServicios[0];
                                     idServicioAutocomplete = $scope.listadoServicios[0].ProductoServicioResponse.idProductoServicio;
                                     idCuentaAuto = $scope.listadoServicios[0].ProductoServicioResponse.idCuentaAuto;
                                     idReciboAuto = $scope.listadoServicios[0].ProductoServicioResponse.idReciboAuto;
                                     nonmbreLinea = $scope.listadoServicios[0].ProductoServicioResponse.nombreAlias;
                                 });
                             } else {
                                 angular.forEach($scope.listadoServicios, function(val, key) {
                                     $scope.selectLinea = $scope.listadoServicios[0];
                                     idProductoServicioDefault = $scope.listadoServicios[0].ProductoServicioResponse.idProductoServicio;
                                     nonmbreLinea = $scope.listadoServicios[0].ProductoServicioResponse.nombreAlias;
                                     tipoLineaSession = $scope.listadoServicios[0].ProductoServicioResponse.tipoLinea;
                                     permisoAuditoria = $scope.listadoServicios[0].ProductoServicioResponse.tipoPermiso;
                                 });
                             }
                         }

                         if (indicadorBusqueda == "1" || indicadorBusqueda == "3") {
                             obtenerDirectorioTelefonico(idCuenta, idRecibo, idServicioPrincipal);
                             actualizarProductoPrincipal(idCuenta, idRecibo, idServicioPrincipal, nonmbreLinea);
                         } else if (indicadorBusqueda == "9" && lengthAutocomplete == 1) {
                             $scope.cambiarClassForm();
                             $scope.inputLineaMovil = null;
                             $scope.errorDirectorio = false;
                             $scope.mostrarDirectorio = false;
                             obtenerCuenta(idCuentaAuto, idReciboAuto, idServicioAutocomplete, indicadorBusqueda);
                             actualizarProductoPrincipal(idCuentaAuto, idReciboAuto, idServicioAutocomplete, nonmbreLinea);
                         } else if (indicadorBusqueda == "2") {
                             obtenerDirectorioTelefonico(idCuenta, idRecibo, idProductoServicioDefault);
                             actualizarProductoPrincipal(idCuenta, idRecibo, idProductoServicioDefault, nonmbreLinea);
                         }
                         lineaEnConsultaSession = nonmbreLinea;
                         registrarEstadoExito(rpta, idTransaccion, "LINEA");
                     } else {
                         if (indicadorBusqueda != 9) {
                             $scope.errorTotalRedirect = true;
                         } else {
                             $scope.cambiarClassForm();
                             $scope.inputLineaMovil = null;
                         }
                     }
                 } else {
                     if (indicadorBusqueda != 9) {
                         $scope.errorTotalRedirect = true;
                     }
                     var mensajeAuditoria = operacionObtenerServicio + "-" + mensajeServicio;
                     registrarEstadoError(rpta, idTransaccion, mensajeAuditoria);
                 }
             }, function(error) {

             });
         };

         function obtenerDirectorioTelefonico(idCuenta, idRecibo, idProductoServicio) {
             var listaDirectorio = '';
             var dataDirectorio = obtenerDataDirectorio(idCuenta, idRecibo, idProductoServicio);
             servDirectorioCorpoMovil.obtenerDirectorioTelefonico(dataDirectorio).then(function(response) {
                 var rpta = parseInt(response.data.obtenerDirectorioTelefonicoResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.obtenerDirectorioTelefonicoResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.obtenerDirectorioTelefonicoResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     $scope.mostrarDirectorio = true;
                     listaDirectorio = response.data.obtenerDirectorioTelefonicoResponse.listaNumerorDirecTel;
                     if (listaDirectorio != undefined && listaDirectorio != '') {
                         if (angular.isArray(listaDirectorio)) {
                             $scope.listaDirectorioTelefonico = response.data.obtenerDirectorioTelefonicoResponse.listaNumerorDirecTel;
                         } else {
                             $scope.listaDirectorioTelefonico = [];
                             $scope.listaDirectorioTelefonico.push(listaDirectorio);
                         }
                         
                     } else {
                         $scope.errorDirectorio = true;
                     }
                 } else {
                     $scope.errorDirectorio = true;
                     var mensajeAuditoria = operacionObtenerDirectorio + "-" + mensajeServicio;
                     
                 }

             }, function(error) {

             });
         };
         var estadoAfiDefi = '';

         function actualizarEstadoAfiliacion(estadoAfiliacion) {
             estadoAfiDefi = estadoAfiliacion;
             var idCuentaActualizar = $scope.selectIdCuenta.idCuenta;
             var idReciboActualizar = $scope.selectIdRecibo.idRecibo;
             var dataActualizar = actualizarDataDirectorio(estadoAfiliacion, idCuentaActualizar, idReciboActualizar);
             servDirectorioCorpoMovil.modificarAfiliacionDirectorioTelefonico(dataActualizar).then(function(response) {
                 var rpta = parseInt(response.data.modificarAfiliacionDirectorioTelefonicoResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.modificarAfiliacionDirectorioTelefonicoResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.modificarAfiliacionDirectorioTelefonicoResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     var flagActualizar = response.data.modificarAfiliacionDirectorioTelefonicoResponse.resultado;
                     if (flagActualizar == "true") {
                         esconderPopUp();
                         buscarDetalleConsumoxLinea();
                         registrarEstadoExito(rpta, idTransaccion, 'AFIDEFI');
                     } else {
                         esconderPopUp();
                         abrirPopUp("3");
                     }
                 } else {
                     esconderPopUp();
                     abrirPopUp("3");
                     var mensajeAuditoria = operacionActualizarDirectorio + "-" + mensajeServicio;
                     registrarEstadoError(rpta, idTransaccion, mensajeAuditoria);
                 }
             }, function(error) {

             });
         };


         function obtenerServiciosAutocomplete(done) {
             var valorinput = $('#autocomplete-movil').val();
             var dataServAutocomplete = dataAutocomplete(valorinput);
             var arrayAutocomplete = [];
             var listaServiciosAutocomplete = '';
             servDirectorioCorpoMovil.obtenerListadoMovilesAutocomplete(dataServAutocomplete).then(function(response) {
                 var rpta = parseInt(response.data.obtenerListadoMovilesResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.obtenerListadoMovilesResponse.defaultServiceResponse.idTransaccional;
                 if (rpta == 0) {
                     listaServiciosAutocomplete = response.data.obtenerListadoMovilesResponse.listadoProductosServicios;
                     if (listaServiciosAutocomplete != undefined && listaServiciosAutocomplete != '') {
                         if (angular.isArray(listaServiciosAutocomplete)) {
                             $scope.listaAutocomplete = response.data.obtenerListadoMovilesResponse.listadoProductosServicios;
                             angular.forEach($scope.listaAutocomplete, function(val, key) {
                                 arrayAutocomplete.push({
                                     value: val.nombreAlias,
                                     data: val.idProductoServicio
                                 });
                             });
                         } else {
                             $scope.listaAutocomplete = [];
                             $scope.listaAutocomplete.push(listaServiciosAutocomplete);
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
                 }
             }, function(error) {

             });
         };

         function initAutocomplete() {
             $('#autocomplete-movil').autocomplete({
                 lookup: function(query, done) {
                     obtenerServiciosAutocomplete(done);
                 },
                 minChars: 4,
                 onSelect: function(suggestion) {
                     var input_idServicios = suggestion.data;
                     obtenerDatosAutocomplete(input_idServicios);
                     $scope.cambiarClassForm();
                     $scope.inputLineaMovil = null;
                 }
             });
         };

         function obtenerDatosAutocomplete(inputIdServicios) {
             $scope.errorDirectorio = false;
             $scope.mostrarDirectorio = false;

             var idCuentaAuto = '';
             var idReciboAuto = '';
             angular.forEach($scope.listaAutocomplete, function(val, key) {
                 if (val.idProductoServicio == inputIdServicios) {
                     idCuentaAuto = $scope.listaAutocomplete[key].idCuenta;
                     idReciboAuto = $scope.listaAutocomplete[key].idRecibo;
                 }
             });
             obtenerCuenta(idCuentaAuto, idReciboAuto, inputIdServicios, "3")
         };

         function actualizarProductoPrincipal(idCuenta, idRecibo, productoPrinciapl, nombreProducto) {
             var actualizar = enviarDataActualizar(idCuenta, idRecibo, productoPrinciapl, nombreProducto);
             servDirectorioCorpoMovil.actualizarProductoPrincipal(actualizar).then(function(response) {}, function(error) {

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

         function limpiarCombos() {
             $scope.listadoCuentas = [];
             $scope.listadoRecibos = [];
             $scope.listadoServicios = [];
         };

         this.buscarServicioxXriterio = function() {
             buscarServicioxXriterio();
         };

         function buscarServicioxXriterio() {
             var valorInput = $('#autocomplete-movil').val();
             obtenerProductoServicio(null, null, null, "9", valorInput);
         };

         this.buscarServiciosxRecibo = function() {
             var idCuentaSeleccionada = $scope.selectIdCuenta.idCuenta;
             $scope.errorDirectorio = false;
             $scope.mostrarDirectorio = false;
             buscarServiciosxRecibo(idCuentaSeleccionada);
         };

         function buscarServiciosxRecibo(idCuentaSeleccionada) {
             obtenerRecibos(idCuentaSeleccionada, null, null, "2");
         };

         this.buscarServiciosxReciboyCuenta = function() {
             $scope.errorDirectorio = false;
             $scope.mostrarDirectorio = false;
             buscarServiciosxReciboyCuenta();
         };

         function buscarServiciosxReciboyCuenta() {
             var idCuentaSeleccionada = $scope.selectIdCuenta.idCuenta;
             var idReciboSeleccionado = $scope.selectIdRecibo.idRecibo;
             obtenerProductoServicio(idCuentaSeleccionada, idReciboSeleccionado, null, "2", null);
         };

         this.buscarDetalleConsumoxLinea = function() {
             buscarDetalleConsumoxLinea();
         };

         function buscarDetalleConsumoxLinea() {
             $scope.errorDirectorio = false;
             $scope.mostrarDirectorio = false;
             objAudi.rec = null;
             var idCuentaSeleccionada = $scope.selectIdCuenta.idCuenta;
             var idReciboSeleccionado = $scope.selectIdRecibo.idRecibo;
             var idProductoServicioSelect = $scope.selectLinea.ProductoServicioResponse.idProductoServicio;
             var nombreProducto = $scope.selectLinea.ProductoServicioResponse.nombreAlias;
             obtenerDirectorioTelefonico(idCuentaSeleccionada, idReciboSeleccionado, idProductoServicioSelect);
             actualizarProductoPrincipal(idCuentaSeleccionada, idReciboSeleccionado, idProductoServicioSelect, nombreProducto);
         };

         function dataReciboEnviar(idCuentaRequest) {
             var requestReciboCoor = {
                 "idCuenta": null
             };
             requestReciboCoor.idCuenta = idCuentaRequest;
             dataReciboCoor = $httpParamSerializer({ requestJson: angular.toJson(requestReciboCoor) });
             return dataReciboCoor;
         };

         function dataParaEnviar(idCuentaParaRequest, idReciboParaRequest, indicadorBusqueda, criterio) {
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
             requestServiciosMoviles.tipoLinea = tipoLineaPostpago;
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

         function obtenerDataDirectorio(idCuenta, idRecibo, idProductoServicio) {
             var requestDirectorio = {
                 "tipoCliente": null,
                 "categoria": null,
                 "idCuenta": null,
                 "idRecibo": null,
                 "idProductoServicio": null,
                 "idDireccion": null,
                 "idLinea": null
             }
             requestDirectorio.tipoCliente = tipoClienteCorporativo;
             requestDirectorio.categoria = categoriaMovil;
             requestDirectorio.idCuenta = idCuenta;
             requestDirectorio.idRecibo = idRecibo;
             requestDirectorio.idProductoServicio = idProductoServicio;

             dataDirectorio = $httpParamSerializer({ requestJson: angular.toJson(requestDirectorio) });
             return dataDirectorio;
         };

         function actualizarDataDirectorio(estadoAfiliacion, idCuenta, idRecibo) {
             var requestActualizarDirectorio = {
                 "directorioTelefonico": null,
                 "idProductoServicio": null,
                 "tipoCliente": null,
                 "categoria": null,
                 "idCuenta": null,
                 "idRecibo": null,
                 "idDireccion": null,
                 "idLinea": null
             }
             requestActualizarDirectorio.directorioTelefonico = estadoAfiliacion;
             requestActualizarDirectorio.idProductoServicio = idProductoServicioAceptado;
             requestActualizarDirectorio.tipoCliente = tipoClienteCorporativo;
             requestActualizarDirectorio.categoria = categoriaMovil;
             requestActualizarDirectorio.idCuenta = idCuenta;
             requestActualizarDirectorio.idRecibo = idRecibo;

             dataActualizarDirectorio = $httpParamSerializer({ requestJson: angular.toJson(requestActualizarDirectorio) });
             return dataActualizarDirectorio;

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
             requestAutocompletar.tipoLinea = tipoLineaPostpago;
             requestAutocompletar.tipoCliente = tipoClienteCorporativo;
             requestAutocompletar.criterioBusqueda = valorinput;
             requestAutocompletar.pagina = pagina;
             requestAutocompletar.cantResultadosPagina = cantResultadosPagina;
             dataAuto = $httpParamSerializer({ requestJson: angular.toJson(requestAutocompletar) });
             return dataAuto;
         };


         function dataAuditoriaRequest(operacion, transactionId, descripcion, estadoAuditoria) {
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
             requestAuditoria.pagina = pageIdDirectorioMovil;
             requestAuditoria.transactionId = transactionId;
             requestAuditoria.estado = estadoAuditoria;
             requestAuditoria.servicio = lineaEnConsultaSession;
             requestAuditoria.tipoProducto = tipoProductoMovil;
             requestAuditoria.tipoLinea = tipoLineaSession;
             requestAuditoria.tipoUsuario = tipoClienteSession;
             requestAuditoria.perfil = permisoAuditoria;
             requestAuditoria.monto = '';
             requestAuditoria.descripcionoperacion = descripcion;
             requestAuditoria.responseType = '-';

             dataAuditoria = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });
             return dataAuditoria;
         };


         var objAudi = {};

         function registrarEstadoExito(rpta, idTransaccion, operacion) {
             var codAuditoria = '';
             if (operacion == 'CUENTA') {
                 objAudi.cue = rpta;
             } else if (operacion == 'RECIBO') {
                 objAudi.rec = rpta;
             } else if (operacion == 'LINEA') {
                 objAudi.linea = rpta;
             } else if (operacion == 'DIRECTORIO') {
                 objAudi.direc = rpta;
             } else if (operacion == 'AFIDEFI') {
                 if (estadoAfiDefi == true) {
                     codAuditoria = trasactionIdAfiliarDirectorioMovil;
                 } else {
                     codAuditoria = trasactionIdDesafiliarDirectorioMovil;
                 }
             }
             if (operacion != 'AFIDEFI') {
                 if (objAudi.cue == 0 && objAudi.linea == 0 && objAudi.rec == 0 && objAudi.direc == 0) {
                     guardarAuditoria(codConsultaDirectorio, idTransaccion, "-", estadoExito);
                 }
             } else {
                 guardarAuditoria(codAuditoria, idTransaccion, "-", estadoExito);
             }

         };

         function registrarEstadoError(rpta, idTransaccion, mensajeAuditoria) {
             var codAuditoria = '';
             if (estadoAfiDefi != '') {
                 if (estadoAfiDefi == true) {
                     codAuditoria = trasactionIdAfiliarDirectorioMovil;
                 } else {
                     codAuditoria = trasactionIdDesafiliarDirectorioMovil;
                 }
                 guardarAuditoria(codAuditoria, idTransaccion, mensajeAuditoria, estadoError);
             } else {
                 guardarAuditoria(codConsultaDirectorio, idTransaccion, mensajeAuditoria, estadoError);
             }

         };


         function guardarAuditoria(operacion, transactionId, descripcion, estadoAuditoria) {
             var dataAuditoriaMovil = dataAuditoriaRequest(operacion, transactionId, descripcion, estadoAuditoria);
             servDirectorioCorpoMovil.guardarAuditoria(dataAuditoriaMovil).then(function(response) {}, function(error) {

             });
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

         $scope.cambiarEstadoAfiliacion = function(directorio, index) {
             $scope.index = index;
             idProductoServicioAceptado = directorio.idProductoServicio;
             var flagSeleccionado = directorio.estadoAfiliado;
             if (flagSeleccionado == "true") {
                 desafiliarLinea();
             } else {
                 afiliarLinea();
             }
         };

         $scope.cancelarAfiliacion = function() {
             $('#iregistro' + $scope.index).prop('checked', !$('#iregistro' + $scope.index).prop('checked'));
             esconderPopUp();
         };

         $scope.cancelarDesafiliacion = function() {
             $('#iregistro' + $scope.index).prop('checked', !$('#iregistro' + $scope.index).prop('checked'));
             esconderPopUp();
         };

         $scope.aceptarAfiliacion = function() {
             var estadoAceptar = true;
             actualizarEstadoAfiliacion(estadoAceptar);
         };

         $scope.aceptarDesafiliacion = function() {
             var estadoAceptar = false;
             actualizarEstadoAfiliacion(estadoAceptar);
         };

         $scope.refreshPortlet = function(valorInput) {
             var idCuentaSeleccionada = $scope.selectLinea.ProductoServicioResponse.idCuenta;
             var idReciboSeleccionado = $scope.selectLinea.ProductoServicioResponse.idRecibo;
             var idProductoSeleccionado = $scope.selectLinea.ProductoServicioResponse.idProductoServicio;
             if (valorInput == "1") {
                 buscarDetalleConsumoxLinea();
             } else if (valorInput == "2") {

             }
         }

     }
 ]);

 ctrlDirectorioTelefonico.directive('erCustomerror', function() {
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

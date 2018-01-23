 ctrlsaldosyconsumos = angular.module('controllerRegistrarDirectorioFijo', []);
 ctrlsaldosyconsumos.controller('ctrlRegistrarDirectorioFijo', ['$scope', '$http', 'servRegistrarDirectorioFijo', '$httpParamSerializer',
     function($scope, $http, servRegistrarDirectorioFijo, $httpParamSerializer) {
         $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

         var pageIdDirectorioFijo = WPSPageID.miclaro_consumer_solicitudes_registrodirectoriotelefonico_fijo;
         var trasactionIdAfiliarDirectorioFijo = WPSTablaOperaciones.afiliarDirectorioTelefonico;
         var trasactionIdDesafiliarDirectorioFijo = WPSTablaOperaciones.desafiliarDirectorioTelefonico;
         var tipoLineaAuditoria = 5;
         var categoriaLinea = WPSCategoria.fijo;
         var tipoclienteConusmer = WPSTipoCliente.consumer;

         $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
         $scope.mensaje_error_ups = WPSMensajeError.upps;
         $scope.ups_descripcion01 = WPSMensajeError.upps_descripcion01;
         $scope.ups_descripcion02 = WPSMensajeError.upps_descripcion02;
         $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
         $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;
         $scope.urlInicio = '/wps/myportal/miclaro/consumer/solicitudes/registrodirectoriotelefonico/fijo';
         var urlCorporativo = '/wps/myportal/miclaro/corporativo/solicitudes/registrodirectoriotelefonico/fijo';

         var estadoExito = 'SUCCESS';
         var estadoError = 'ERROR';
         var tipoProductoMovil = 'TELEFONIA';
         $scope.index = '';
         var idProductoServicioAceptado = '';
         $scope.mostrarServicios = false;
         $scope.mostrarSinServicios = false;
         $scope.errorTotalRedirect = false;
         $scope.mostrarSwitchConsumer = false;
         var operacionObtenerServicio = 'obtenerDirectorioTelefonico';
         var operacionActualizarAfiliacion = 'modificarAfiliacionDirectorioTelefonico';
         var operacionObtenerServicio = 'obtenerServicios';
         var idLineaDirectorio = '';
         var lineaEnConsultaSession = '';
         var tipoClienteSessionConsumer = '';
         angular.element(document).ready(function() {
             init();
         });

         function init() {
             servRegistrarDirectorioFijo.obtenerDatosUsuario().then(function(response) {
                 var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                 if (rpta == 0) {
                     tipoClienteSessionConsumer = response.data.comunResponseType.tipoCliente;
                     var flagFijoSession = parseInt(response.data.comunResponseType.flagProductoFijoSesion);

                     if (flagFijoSession == 1 || flagFijoSession == 3) {
                         obtenerDirectorioTelefonico();
                     } else if (flagFijoSession == -1) {
                         $scope.errorTotalRedirect = true;
                         var mensajeAuditoria = operacionObtenerServicio + "- flagFijo";
                         configurarAuditoria(rpta, idTransaccion, null, mensajeAuditoria);
                     } else if (flagFijoSession == 2){
                         $scope.mostrarSinServicios = true;
                         configurarAuditoria(rpta, idTransaccion, null, "-");
                     }
                     if (tipoClienteSessionConsumer == 4) {
                         $scope.mostrarSwitchConsumer = true;
                     }
                 } else {

                 }
             }, function(error) {

             });
         };

         $scope.switchChange = function() {
             window.location.href = urlCorporativo;
         };

         function obtenerDirectorioTelefonico() {
             var objListaDirectorio = '';
             var dataDirectorio = obtenerDataDirectorio();
             servRegistrarDirectorioFijo.obtenerDirectorioTelefonico(dataDirectorio).then(function(response) {
                 var rpta = parseInt(response.data.obtenerDirectorioTelefonicoResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.obtenerDirectorioTelefonicoResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.obtenerDirectorioTelefonicoResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     $scope.mostrarServicios = true;
                     objListaDirectorio = response.data.obtenerDirectorioTelefonicoResponse.listaNumerorDirecTel;
                     if (objListaDirectorio != undefined && objListaDirectorio != '') {
                         if (angular.isArray(objListaDirectorio)) {
                             $scope.listaDirectorioTelefonico = response.data.obtenerDirectorioTelefonicoResponse.listaNumerorDirecTel;
                         } else {
                             $scope.listaDirectorioTelefonico = [];
                             $scope.listaDirectorioTelefonico.push(objListaDirectorio);
                         }
                     } else {
                         $scope.errorTotalRedirect = true;
                     }
                 } else {
                     $scope.errorTotalRedirect = true;
                     var mensajeAuditoria = operacionObtenerDirectorio + "-" + mensajeServicio;
                     configurarAuditoria(rpta, idTransaccion, null, mensajeAuditoria);
                 }
             }, function(error) {

             });
         };


         function actualizarEstadoAfiliacion(estadoAceptar) {            
             var dataActualizar = actualizarDataDirectorio(estadoAceptar);
             servRegistrarDirectorioFijo.modificarAfiliacionDirectorioTelefonico(dataActualizar).then(function(response) {
                 var rpta = parseInt(response.data.modificarAfiliacionDirectorioTelefonicoResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.modificarAfiliacionDirectorioTelefonicoResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.modificarAfiliacionDirectorioTelefonicoResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     var flagActualizar = response.data.modificarAfiliacionDirectorioTelefonicoResponse.resultado;
                     if (flagActualizar == 'true') {
                         esconderPopUp();
                         obtenerDirectorioTelefonico();
                         configurarAuditoria(rpta, idTransaccion, estadoAceptar, "-");
                     } else {
                         esconderPopUp();
                         abrirPopUp("3");
                     }
                 } else {
                     esconderPopUp();
                     abrirPopUp("3");
                     var mensajeAuditoria = operacionActualizarAfiliacion + "-" + mensajeServicio;
                     configurarAuditoria(rpta, idTransaccion, estadoAceptar, mensajeAuditoria);
                 }
             }, function(error) {

             });
         };

         function obtenerDataDirectorio() {
             var requestDirectorio = {
                 "tipoCliente": null,
                 "categoria": null,
                 "idCuenta": null,
                 "idRecibo": null,
                 "idProductoServicio": null,
                 "idDireccion": null,
                 "idLinea": null
             }
             requestDirectorio.tipoCliente = tipoclienteConusmer;
             requestDirectorio.categoria = categoriaLinea;

             dataDirectorio = $httpParamSerializer({ requestJson: angular.toJson(requestDirectorio) });
             return dataDirectorio;

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
             requestServiciosMoviles.categoria = categoriaFijo;
             requestServiciosMoviles.tipoLinea = tipoLineaConsumer;
             requestServiciosMoviles.tipoCliente = tipoClienteConsumer;
             requestServiciosMoviles.tipoPermiso = tipoPermisoAll;
             requestServiciosMoviles.pagina = pagina;
             requestServiciosMoviles.cantResultadosPagina = cantResultadosPagina;
             requestServiciosMoviles.titularidadServicio = titularidadServicio;

             dataServiciosMoviles = $httpParamSerializer({ requestJson: angular.toJson(requestServiciosMoviles) });
             return dataServiciosMoviles;
         };

         function actualizarDataDirectorio(estadoAceptar) {
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
             requestActualizarDirectorio.directorioTelefonico = estadoAceptar;
             requestActualizarDirectorio.idProductoServicio = idProductoServicioAceptado;
             requestActualizarDirectorio.tipoCliente = tipoclienteConusmer;
             requestActualizarDirectorio.categoria = categoriaLinea;
             requestActualizarDirectorio.idLinea = idLineaDirectorio;

             dataActualizarDirectorio = $httpParamSerializer({ requestJson: angular.toJson(requestActualizarDirectorio) });
             return dataActualizarDirectorio;

         };

         function dataAuditoriaRequest(operacion, transactionId, descripcion, estadoAuditoria) {
             var requestAuditoria = {
                 operationCode: null,
                 pagina: null,
                 transactionId: null,
                 estado: '-',
                 servicio: '-',
                 tipoProducto: '-',
                 tipoLinea: '-',
                 tipoUsuario: '-',
                 perfil: '-',
                 monto: null,
                 descripcionoperacion: null,
                 responseType: null
             }
             requestAuditoria.operationCode = operacion;
             requestAuditoria.pagina = pageIdDirectorioFijo;
             requestAuditoria.transactionId = transactionId;
             requestAuditoria.estado = estadoAuditoria;
             requestAuditoria.servicio = lineaEnConsultaSession;
             requestAuditoria.tipoProducto = tipoProductoMovil;
             requestAuditoria.tipoLinea = tipoLineaAuditoria;
             requestAuditoria.tipoUsuario = tipoClienteSessionConsumer;
             requestAuditoria.perfil = '-';
             requestAuditoria.monto = '';
             requestAuditoria.descripcionoperacion = descripcion;
             requestAuditoria.responseType = '-';

             dataAuditoria = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });
             return dataAuditoria;
         };


         function configurarAuditoria(rpta, idTransaccion, estadoAfiliacion, mensajeAuditoria) {
             if (rpta != 0) {
                 if (estadoAfiliacion == true) {
                     guardarAuditoria(trasactionIdAfiliarDirectorioFijo, idTransaccion, mensajeAuditoria, estadoError);
                 } else {
                     guardarAuditoria(trasactionIdDesafiliarDirectorioFijo, idTransaccion, mensajeAuditoria, estadoError);
                 }
             } else {
                 if (estadoAfiliacion == true) {
                     guardarAuditoria(trasactionIdAfiliarDirectorioFijo, idTransaccion, mensajeAuditoria, estadoExito);
                 } else if(estadoAfiliacion == false){
                     guardarAuditoria(trasactionIdDesafiliarDirectorioFijo, idTransaccion, mensajeAuditoria, estadoExito);
                 }else {
                    guardarAuditoria('-', idTransaccion, mensajeAuditoria, estadoExito);
                 }
             }
         };


         function guardarAuditoria(transaccion, idTransaccion, descripcionTransaccion, estadoAuditoria) {
             var dataAuditoriaMovil = dataAuditoriaRequest(transaccion, idTransaccion, descripcionTransaccion, estadoAuditoria);
             servRegistrarDirectorioFijo.guardarAuditoria(dataAuditoriaMovil).then(function(response) {}, function(error) {

             });
         };

         $scope.cambiarEstadoAfiliacion = function(directorio, index) {
             $scope.index = index;
             idProductoServicioAceptado = directorio.idProductoServicio;
             idLineaDirectorio = directorio.idLinea;
             lineaEnConsultaSession = directorio.numeroTelefono;
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


     }
 ]);

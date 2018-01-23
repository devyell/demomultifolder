 ctrlDirectorioTelefonico = angular.module('controllerRegistrarDirectorioMovil', []);
 ctrlDirectorioTelefonico.controller('ctrlRegistrarDirectorioMovil', ['$scope', '$http', 'servRegistrarDirectorioMovil', '$httpParamSerializer',
     function($scope, $http, servRegistrarDirectorioMovil, $httpParamSerializer) {
         $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

         var pageIdDirectorioMovil = WPSPageID.miclaro_consumer_solicitudes_registrodirectoriotelefonico_movil;
         var trasactionIdAfiliarDirectorioMovil = WPSTablaOperaciones.afiliarDirectorioTelefonico;
         var trasactionIdDesafiliarDirectorioMovil = WPSTablaOperaciones.desafiliarDirectorioTelefonico;
         var tipoclienteConusmer = WPSTipoCliente.consumer;
         $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
         $scope.mensaje_error_ups = WPSMensajeError.upps;
         $scope.ups_descripcion01 = WPSMensajeError.upps_descripcion01;
         $scope.ups_descripcion02 = WPSMensajeError.upps_descripcion02;
         $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
         $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;
         $scope.urlInicio = '/wps/myportal/miclaro/consumer/solicitudes/registrodirectoriotelefonico/movil';
         var urlCorporativo = '/wps/myportal/miclaro/corporativo/solicitudes/registrodirectoriotelefonico/movil';
         var estadoExito = 'SUCCESS';
         var estadoError = 'ERROR';
         var tipoProductoMovil = 'MOVIL';
         var tipoLineaAuditoria = 5;
         $scope.index = '';
         var idProductoServicioAceptado = '';
         var categoriaLinea = WPSCategoria.movil;
         var operacionActualizarAfiliacion = 'modificarAfiliacionDirectorioTelefonico';
         var operacionObtenerDirectorio = 'obtenerDirectorioTelefonico';
         var operacionObtenerServicio = 'obtenerServicios';

         $scope.mostrarServicios = false;
         $scope.errorTotalRedirect = false;
         $scope.mostrarSinServicios = false;
         $scope.mostrarSwitchConsumer = false;
         var lineaEnConsultaSession = '';
         var tipoClienteSession = '';

         angular.element(document).ready(function() {
             init();
         });

         function init() {
             servRegistrarDirectorioMovil.obtenerDatosUsuario().then(function(response) {
                 var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                 if (rpta == 0) {
                     var flagServiciosMovilSession = response.data.comunResponseType.flagProductoMovilSesion;
                     tipoClienteSession = response.data.comunResponseType.tipoCliente;

                     if (flagServiciosMovilSession == 1 || flagServiciosMovilSession == 3) {
                         obtenerDirectorioTelefonico();
                     } else if (flagServiciosMovilSession == -1) {
                         $scope.errorTotalRedirect = true;
                         var mensajeAuditoria = operacionObtenerServicio + "- flagMovil";
                         configurarAuditoria(rpta, idTransaccion, null, mensajeAuditoria);
                     } else {
                         $scope.mostrarSinServicios = true;
                         configurarAuditoria(rpta, idTransaccion, null, "-");
                     }
                     if (tipoClienteSession == 4) {
                         $scope.mostrarSwitchConsumer = true;
                     }
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
             servRegistrarDirectorioMovil.obtenerDirectorioTelefonico(dataDirectorio).then(function(response) {
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


         function actualizarEstadoAfiliacion(estadoAfiliacion) {
             var dataActualizar = actualizarDataDirectorio(estadoAfiliacion);
             servRegistrarDirectorioMovil.modificarAfiliacionDirectorioTelefonico(dataActualizar).then(function(response) {
                 var rpta = parseInt(response.data.modificarAfiliacionDirectorioTelefonicoResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.modificarAfiliacionDirectorioTelefonicoResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.modificarAfiliacionDirectorioTelefonicoResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     var flagActualizar = response.data.modificarAfiliacionDirectorioTelefonicoResponse.resultado;
                     if (flagActualizar == "true") {
                         esconderPopUp();
                         obtenerDirectorioTelefonico();
                         configurarAuditoria(rpta, idTransaccion, estadoAfiliacion, "-");
                     } else {
                         esconderPopUp();
                         abrirPopUp("3");
                     }
                 } else {
                     esconderPopUp();
                     abrirPopUp("3");
                     var mensajeAuditoria = operacionActualizarAfiliacion + "-" + mensajeServicio;
                     configurarAuditoria(rpta, idTransaccion, estadoAfiliacion, mensajeAuditoria);
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

         function actualizarDataDirectorio(estadoAfiliacion) {
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
             requestActualizarDirectorio.tipoCliente = tipoclienteConusmer;
             requestActualizarDirectorio.categoria = categoriaLinea;

             dataActualizarDirectorio = $httpParamSerializer({ requestJson: angular.toJson(requestActualizarDirectorio) });
             return dataActualizarDirectorio;

         };

         $scope.cambiarEstadoAfiliacion = function(directorio, index) {
             $scope.index = index;
             idProductoServicioAceptado = directorio.idProductoServicio;
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
             hidePopUp();
         };

         $scope.cancelarDesafiliacion = function() {
             $('#iregistro' + $scope.index).prop('checked', !$('#iregistro' + $scope.index).prop('checked'));
             hidePopUp();
         };

         $scope.aceptarAfiliacion = function() {
             var estadoAceptar = true;
             actualizarEstadoAfiliacion(estadoAceptar);
         };

         $scope.aceptarDesafiliacion = function() {
             var estadoAceptar = false;
             actualizarEstadoAfiliacion(estadoAceptar);
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
                 descripcionoperacion: '-',
                 responseType: null
             }
             requestAuditoria.operationCode = operacion;
             requestAuditoria.pagina = pageIdDirectorioMovil;
             requestAuditoria.transactionId = transactionId;
             requestAuditoria.estado = estadoAuditoria;
             requestAuditoria.servicio = lineaEnConsultaSession;
             requestAuditoria.tipoProducto = tipoProductoMovil;
             requestAuditoria.tipoLinea = tipoLineaAuditoria;
             requestAuditoria.tipoUsuario = tipoClienteSession;
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
                     guardarAuditoria(trasactionIdAfiliarDirectorioMovil, idTransaccion, mensajeAuditoria, estadoError);
                 } else {
                     guardarAuditoria(trasactionIdDesafiliarDirectorioMovil, idTransaccion, mensajeAuditoria, estadoError);
                 }
             } else {
                 if (estadoAfiliacion == true) {
                     guardarAuditoria(trasactionIdAfiliarDirectorioMovil, idTransaccion, mensajeAuditoria, estadoExito);
                 } else {
                     guardarAuditoria(trasactionIdDesafiliarDirectorioMovil, idTransaccion, mensajeAuditoria, estadoExito);
                 }
             }
         };


         function guardarAuditoria(transaccion, idTransaccion, descripcionTransaccion, estadoAuditoria) {
             var dataAuditoriaMovil = dataAuditoriaRequest(transaccion, idTransaccion, descripcionTransaccion, estadoAuditoria);
             servRegistrarDirectorioMovil.guardarAuditoria(dataAuditoriaMovil).then(function(response) {}, function(error) {

             });
         };
     }
 ]);

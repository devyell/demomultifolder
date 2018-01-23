 ctrlDirectorioTelefonico = angular.module('ctrlDirectorioTelefonicoCorpoFijo', []);
 ctrlDirectorioTelefonico.controller('ctrlDirectorioCorpoFijo', ['$scope', '$http', 'servDirectorioCorpoFijo', '$httpParamSerializer',
     function($scope, $http, servDirectorioCorpoFijo, $httpParamSerializer) {
         $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

         var pageIdDirectorioFijo = WPSPageID.miclaro_corporativo_solicitudes_registrodirectoriotelefonico_fijo;
         var trasactionIdAfiliarDirectorioFijo = WPSTablaOperaciones.afiliarDirectorioTelefonico;
         var trasactionIdDesafiliarDirectorioFijo = WPSTablaOperaciones.desafiliarDirectorioTelefonico;
         var codConsultaDirectorio = '-';
         var operacionActualizarDirectorio = 'modificarAfiliacionDirectorioTelefonico';
         $scope.showSinServicios = false;
         $scope.errorTotalRedirect = false;
         $scope.mostrarFiltros = false;
         $scope.mostrarDirectorio = false;
         $scope.errorDirectorio = false;

         $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
         $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
         $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;
         $scope.mensaje_ups = WPSMensajeError.upps;
         $scope.ups_descripcion1 = WPSMensajeError.upps_descripcion01;
         $scope.ups_descripcion2 = WPSMensajeError.upps_descripcion03;
         $scope.urlInicio = '/wps/myportal/miclaro/corporativo/solicitudes/registrodirectoriotelefonico/fijo';
         var urlConsumer = '/wps/myportal/miclaro/consumer/solicitudes/registrodirectoriotelefonico/fijo';
         var tipoLineaTodos = WPSTipoLinea.todos;
         var idLineasCambiada = '';
         var estadoExito = 'SUCCESS';
         var estadoError = 'ERROR';
         var tipoProductoMovil = 'TELEFONIA';
         var tipoClienteFiltros = WPSTipoClienteDir.corporativoFijo;
         var tipoClienteCorporativo = WPSTipoCliente.corporativo;
         var categoriaLinea = WPSCategoria.fijo;
         var tipoLineaCorpo = WPSTipoLinea.postpago;
         var titularidadServicioTodos = WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado;
         var tipoPermisoAll = WPSTipoPermiso.todos;
         var pagina = 0;
         var cantResultadosPagina = 0;
         $scope.switchSelect = true;
         $scope.mostrarSwitchCorporativos = false;
         var tipoClienteSession = '-';
         var idServicioAfiliar = '';
         var lineaEnConsultaSession = '-';
         var tipoLineaAuditoria = '-';
         var tipoPermisoAuditoria = '-';

         var operacionObtenerDirectorio = 'obtenerDirectorioTelefonico';
         var operacionActualizarAfiliacion = 'modificarAfiliacionDirectorioTelefonico';
         var operacionObtenerServicio = 'obtenerServicios';
         var operacionObtenerDireccion = 'obtenerListadoFijoDireccion';
         var operacionObtenerLineas = 'obtenerLineasFijas';

         angular.element(document).ready(function() {
             init();
             initAutocomplete();
         });

         function init() {
             servDirectorioCorpoFijo.obtenerDatosUsuario().then(function(response) {
                 var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                 if (rpta == 0) {
                     tipoClienteSession = response.data.comunResponseType.tipoCliente;
                     var flagServicioFijoSession = response.data.comunResponseType.flagProductoFijoSesion;

                     if (flagServicioFijoSession == 2 || flagServicioFijoSession == 3) {
                         obtenerServicioPrincipal();
                     } else if (flagServicioFijoSession == -1) {
                         $scope.errorTotalRedirect = true;
                         var mensajeAuditoria = operacionObtenerServicio + "- flagFijo";
                         registrarEstadoError(flagServicioFijoSession, idTransaccion, mensajeAuditoria);
                     } else {
                         $scope.showSinServicios = true;
                         registrarEstadoExito(rpta, idTransaccion, "-");
                     }
                     if (tipoClienteSession == 4) {
                         $scope.mostrarSwitchCorporativos = true;
                     }
                 }
             }, function(error) {

             });
         };

         function obtenerServicioPrincipal() {
             servDirectorioCorpoFijo.obtenerProductoPrincipal().then(function(response) {
                 var rpta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
                 var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                 if (rpta == 0) {
                     var categoriaPrincipal = parseInt(response.data.comunResponseType.categoria);
                     var tipoClientePrincipal = response.data.comunResponseType.tipoClienteProductoPrincipal;
                     if (categoriaPrincipal == 2 && tipoClientePrincipal == 2) {
                         var idDireccionPrin = response.data.comunResponseType.idDireccion;
                         var idServicioPrincipal = response.data.comunResponseType.productoPrincipal;
                         obtenerDirecciones(idDireccionPrin, idServicioPrincipal, "1");
                     } else {
                         obtenerDirecciones(null, null, "2");
                     }

                 } else {
                     $scope.errorTotalRedirect = true;
                 }
             }, function(error) {

             });
         };

         $scope.switchChange = function() {
             window.location.href = urlConsumer;
         };

         function obtenerDirecciones(idDireccionPrin, idProductoPrincipal, indicador) {
             var id_direccion = '';
             var listaDirecciones = '';
             var datarDirecciones = dataDireccionEnviar();
             servDirectorioCorpoFijo.obtenerListadoFijoDireccion(datarDirecciones).then(function(response) {
                 var rpta = parseInt(response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     listaDirecciones = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;
                     if (listaDirecciones != undefined && listaDirecciones != '') {
                         if (angular.isArray(listaDirecciones)) {
                             $scope.listadoDirecciones = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;
                             if (indicador == "1" || indicador == "Auto01" || indicador == "Auto02") {
                                 angular.forEach($scope.listadoDirecciones, function(val, key) {
                                     if (val.idDireccion == idDireccionPrin) {
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
                             $scope.listadoDirecciones.push(listaDirecciones);
                             if (indicador == "1" || indicador == "Auto01" || indicador == "Auto02") {
                                 angular.forEach($scope.listadoDirecciones, function(val, key) {
                                     if (val.idDireccion == idDireccionPrin) {
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

                         if (indicador == "1" || indicador == "Auto01" || indicador == "Auto02") {
                             obtenerServiciosFijos(idDireccionPrin, idProductoPrincipal, indicador);
                         } else if (indicador == "2") {
                             obtenerServiciosFijos(id_direccion, null, indicador);
                         }
                         registrarEstadoExito(rpta, idTransaccion, "DIRECCION");
                     } else {
                         $scope.errorTotalRedirect = true;
                     }
                 } else {
                     var mensajeAuditoria = operacionObtenerDireccion + "-" + mensajeServicio;
                     registrarEstadoError(rpta, idTransaccion, mensajeAuditoria);
                     $scope.errorTotalRedirect = true;
                 }
             }, function(error) {

             });
         };


         function obtenerServiciosFijos(idDireccionFija, idProductoServicio, indicador) {
             var idProductoServicioDefault = '';
             var idDireccionAuto = '';
             var listaServiciosFijos = '';
             var nombreProducto = '';
             var dataServiciosFijo = dataParaEnviar(idDireccionFija, idProductoServicio, indicador);
             servDirectorioCorpoFijo.obtenerServiciosFijos(dataServiciosFijo).then(function(response) {
                 var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     listaServiciosFijos = response.data.obtenerServiciosResponse.listadoProductosServicios;
                     if (listaServiciosFijos != undefined && listaServiciosFijos != '') {
                         if (angular.isArray(listaServiciosFijos)) {
                             $scope.listadoServicios = response.data.obtenerServiciosResponse.listadoProductosServicios;
                             if (indicador == "1" || indicador == "Auto01" || indicador == "Auto02") {
                                 angular.forEach($scope.listadoServicios, function(val, key) {
                                     if (val.ProductoServicioResponse.idProductoServicio == idProductoServicio) {
                                         $scope.selectLinea = $scope.listadoServicios[key];
                                         idDireccionAuto = $scope.listadoServicios[key].ProductoServicioResponse.idDireccion;
                                         nombreProducto = $scope.listadoServicios[key].ProductoServicioResponse.nombreAlias;
                                         tipoPermisoAuditoria = $scope.listadoServicios[key].ProductoServicioResponse.tipoPermiso;
                                         tipoLineaAuditoria = $scope.listadoServicios[key].ProductoServicioResponse.tipoLinea;
                                     }

                                 });
                             } else {
                                 angular.forEach($scope.listadoServicios, function(val, key) {
                                     $scope.selectLinea = $scope.listadoServicios[0];
                                     idProductoServicioDefault = $scope.listadoServicios[0].ProductoServicioResponse.idProductoServicio;
                                     nombreProducto = $scope.listadoServicios[0].ProductoServicioResponse.nombreAlias;
                                     tipoPermisoAuditoria = $scope.listadoServicios[0].ProductoServicioResponse.tipoPermiso;
                                     tipoLineaAuditoria = $scope.listadoServicios[0].ProductoServicioResponse.tipoLinea;
                                 });
                             }
                         } else {
                             $scope.listadoServicios = [];
                             $scope.listadoServicios.push(listaServiciosFijos);
                             if (indicador == "1" || indicador == "Auto01" || indicador == "Auto02") {
                                 angular.forEach($scope.listadoServicios, function(val, key) {
                                     if (val.ProductoServicioResponse.idProductoServicio == idProductoServicio) {
                                         $scope.selectLinea = $scope.listadoServicios[key];
                                         idDireccionAuto = $scope.listadoServicios[key].ProductoServicioResponse.idDireccion;
                                         nombreProducto = $scope.listadoServicios[key].ProductoServicioResponse.nombreAlias;
                                         tipoPermisoAuditoria = $scope.listadoServicios[key].ProductoServicioResponse.tipoPermiso;
                                         tipoLineaAuditoria = $scope.listadoServicios[key].ProductoServicioResponse.tipoLinea;
                                     }

                                 });
                             } else {
                                 angular.forEach($scope.listadoServicios, function(val, key) {
                                     $scope.selectLinea = $scope.listadoServicios[0];
                                     idProductoServicioDefault = $scope.listadoServicios[0].ProductoServicioResponse.idProductoServicio;
                                     nombreProducto = $scope.listadoServicios[0].ProductoServicioResponse.nombreAlias;
                                     tipoPermisoAuditoria = $scope.listadoServicios[0].ProductoServicioResponse.tipoPermiso;
                                     tipoLineaAuditoria = $scope.listadoServicios[0].ProductoServicioResponse.tipoLinea;
                                 });
                             }
                         }
                         lineaEnConsultaSession = nombreProducto;

                         if (indicador == "1" || indicador == "Auto01" || indicador == "Auto02") {
                             obtenerLineasFijas(idDireccionFija, idProductoServicio, nombreProducto, indicador);
                         } else {
                             obtenerLineasFijas(idDireccionFija, idProductoServicioDefault, nombreProducto, indicador);
                         }
                         registrarEstadoExito(rpta, idTransaccion, "LINEA");
                     } else {
                         $scope.errorTotalRedirect = true;
                     }
                 } else {
                     $scope.errorTotalRedirect = true;
                     var mensajeAuditoria = operacionObtenerServicio + "-" + mensajeServicio;
                     registrarEstadoError(rpta, idTransaccion, mensajeAuditoria);
                 }
             }, function(error) {

             });
         };

         function obtenerLineasFijas(idDireccionFija, idProductoPrincipa, nombreProducto, indicador) {
             var idLineaConsultada = '';
             var listaLineasFijas = '';
             var dataLineasFijas = enviarDataLineasFijas(idDireccionFija, idProductoPrincipa);
             servDirectorioCorpoFijo.obtenerLineasFijas(dataLineasFijas).then(function(response) {
                 var rpta = parseInt(response.data.obtenerLineasFijasResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.obtenerLineasFijasResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.obtenerLineasFijasResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     $scope.mostrarFiltros = true;
                     listaLineasFijas = response.data.obtenerLineasFijasResponse.listadoProductosServicios;
                     if (angular.isArray(listaLineasFijas)) {
                         $scope.listadoLineasFijas = response.data.obtenerLineasFijasResponse.listadoProductosServicios;
                         angular.forEach($scope.listadoLineasFijas, function(val, key) {
                             $scope.lineaFijaSelect = $scope.listadoLineasFijas[0];
                             idLineaConsultada = $scope.listadoLineasFijas[0].idLinea;
                         });
                     } else {
                         $scope.listadoLineasFijas = [];
                         $scope.listadoLineasFijas.push(listaLineasFijas);
                         angular.forEach($scope.listadoLineasFijas, function(val, key) {
                             $scope.lineaFijaSelect = $scope.listadoLineasFijas[0];
                             idLineaConsultada = $scope.listadoLineasFijas[0].idLinea;
                         });
                     }
                     obtenerDirectorioTelefonico(idDireccionFija, idProductoPrincipa, idLineaConsultada, indicador);
                     actualizarProductoPrincipal(idDireccionFija, idProductoPrincipa, nombreProducto, idLineaConsultada)
                     registrarEstadoExito(rpta, idTransaccion, "FIJA");
                 } else {
                     var mensajeAuditoria = operacionObtenerLineas + "-" + mensajeServicio;
                     registrarEstadoError(rpta, idTransaccion, mensajeAuditorianull);
                 }
             }, function(error) {

             });
         };

         function obtenerDirectorioTelefonico(idDireccionFija, idProductoPrincipal, idLinea, indicador) {
             var idProductoServicioDirec = '';
             var objListaDirectorio = '';
             var dataDirectorio = obtenerDataDirectorio(idDireccionFija, idProductoPrincipal, idLinea);
             servDirectorioCorpoFijo.obtenerDirectorioTelefonico(dataDirectorio).then(function(response) {
                 var rpta = parseInt(response.data.obtenerDirectorioTelefonicoResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.obtenerDirectorioTelefonicoResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.obtenerDirectorioTelefonicoResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     $scope.mostrarDirectorio = true;
                     objListaDirectorio = response.data.obtenerDirectorioTelefonicoResponse.listaNumerorDirecTel;
                     if (objListaDirectorio != undefined && objListaDirectorio != '') {
                         if (angular.isArray(objListaDirectorio)) {
                             $scope.listaDirectorioTelefonico = response.data.obtenerDirectorioTelefonicoResponse.listaNumerorDirecTel;

                         } else {
                             $scope.listaDirectorioTelefonico = [];
                             $scope.listaDirectorioTelefonico.push(objListaDirectorio);
                         }
                         registrarEstadoExito(rpta, idTransaccion, "DIRECTORIO");
                     }
                 } else {
                     $scope.errorDirectorio = true;
                     var mensajeAuditoria = operacionObtenerDirectorio + "-" + mensajeServicio;
                     registrarEstadoError(rpta, idTransaccion, mensajeAuditoria);
                 }

             }, function(error) {

             });
         };

         var estadoAfiDefi = '';

         function actualizarEstadoAfiliacion(estadoAfiliacion) {
             estadoAfiDefi = estadoAfiliacion;
             var dataActualizar = actualizarDataDirectorio(estadoAfiliacion);
             servDirectorioCorpoFijo.modificarAfiliacionDirectorioTelefonico(dataActualizar).then(function(response) {
                 var rpta = parseInt(response.data.modificarAfiliacionDirectorioTelefonicoResponse.defaultServiceResponse.idRespuesta);
                 var idTransaccion = response.data.modificarAfiliacionDirectorioTelefonicoResponse.defaultServiceResponse.idTransaccional;
                 var mensajeServicio = response.data.modificarAfiliacionDirectorioTelefonicoResponse.defaultServiceResponse.mensaje;
                 if (rpta == 0) {
                     var flagActualizar = response.data.modificarAfiliacionDirectorioTelefonicoResponse.resultado;
                     if (flagActualizar == "true") {
                         esconderPopUp();
                         obtenerConsumosxLineaFija();
                         registrarEstadoExito(rpta, idTransaccion, 'AFIDEFI');
                     } else {
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

         function actualizarProductoPrincipal(idDireccion, idProductoServicio, nombreProducto, idLineaFijo) {
             var actualizar = enviarDataActualizar(idDireccion, idProductoServicio, nombreProducto, idLineaFijo);
             servDirectorioCorpoFijo.actualizarProductoPrincipal(actualizar).then(function(response) {}, function(error) {

             });
         };

         function enviarDataActualizar(idDireccion, idProductoServicio, nombreProducto, tipoLinea, idLineaFijo) {
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

             requestActualizar.productoPrincipal = idProductoServicio;
             requestActualizar.nombreProductoPrincipal = nombreProducto;
             requestActualizar.idDireccion = idDireccion;
             requestActualizar.idLinea = idLineaFijo;
             requestActualizar.tipoLinea = tipoLineaCorpo;
             requestActualizar.idLinea = idLineaFijo;
             requestActualizar.categoria = categoriaLinea;
             requestActualizar.tipoClienteProductoPrincipal = tipoClienteCorporativo;

             dataActualizar = $httpParamSerializer({ requestJson: angular.toJson(requestActualizar) });
             return dataActualizar;
         };

         this.obtenerConsumosFijosxDireccion = function() {
             obtenerConsumosFijosxDireccion();
         };

         function obtenerConsumosFijosxDireccion() {
             $scope.errorDirectorio = false;
             $scope.mostrarDirectorio = false;
             var idDireccionSeleccionada = $scope.selectIdDireccion.idDireccion;
             obtenerServiciosFijos(idDireccionSeleccionada, null, null);
         };

         this.obtenerConsumosFijosxServicio = function() {
             obtenerConsumosFijosxServicio();
         };

         function obtenerConsumosFijosxServicio() {
             $scope.errorDirectorio = false;
             $scope.mostrarDirectorio = false;
             var idDireccionSeleccionada = $scope.selectIdDireccion.idDireccion;
             var idServicioSeleccionado = $scope.selectLinea.ProductoServicioResponse.idProductoServicio;
             var nombreProducto = $scope.selectLinea.ProductoServicioResponse.nombreAlias;
             obtenerLineasFijas(idDireccionSeleccionada, idServicioSeleccionado, nombreProducto, "2");
         };

         this.obtenerConsumosxLineaFija = function() {
             obtenerConsumosxLineaFija();
         };

         function obtenerConsumosxLineaFija() {
             $scope.errorDirectorio = false;
             $scope.mostrarDirectorio = false;
             objAudi.direc = null;
             var idDireccionSeleccionada = $scope.selectIdDireccion.idDireccion;
             var idServicioSeleccionado = $scope.selectLinea.ProductoServicioResponse.idProductoServicio;
             var idLineaSeleccionada = $scope.lineaFijaSelect.idLinea;
             obtenerDirectorioTelefonico(idDireccionSeleccionada, idServicioSeleccionado, idLineaSeleccionada, null);
         };

         this.buscarServicioxXriterio = function() {
             buscarServicioxXriterio();
         };

         function buscarServicioxXriterio() {
             var valorInput = $('#autocomplete-fijo').val();
             obtenerListadoLineasFijasClick(valorInput)
         };

         function obtenerListadoLineasFijasClick(valorInput) {
             var valorinput = $('#autocomplete-fijo').val();
             listaFijosAutocompleteClick = '';
             var idDireccionAutoClick = '';
             var idServicioAutoClick = '';
             var dataServAutocomplete = dataAutocomplete(valorInput, "Auto02");
             servDirectorioCorpoFijo.obtenerListadoLineasFijasAutocomplete(dataServAutocomplete).then(function(response) {
                 var rptaExito = response.data.obtenerListadoLineasFijasResponse.defaultServiceResponse.idRespuesta;
                 if (rptaExito == 0) {
                     listaFijosAutocompleteClick = response.data.obtenerListadoLineasFijasResponse.listadoProductosServicios;
                     if (listaFijosAutocompleteClick != undefined && listaFijosAutocompleteClick != '') {
                         if (angular.isArray(listaFijosAutocompleteClick)) {
                             $scope.listaAutocompleteClick = response.data.obtenerListadoLineasFijasResponse.listadoProductosServicios;
                             angular.forEach($scope.listaAutocompleteClick, function(val, key) {
                                 idDireccionAutoClick = $scope.listaAutocompleteClick[key].idDireccion;
                                 idServicioAutoClick = $scope.listaAutocompleteClick[key].idProductoServicio;
                             });
                         } else {
                             $scope.listaAutocompleteClick = [];
                             $scope.listaAutocompleteClick.push(listaFijosAutocompleteClick);
                             angular.forEach($scope.listaAutocompleteClick, function(val, key) {
                                 idDireccionAutoClick = $scope.listaAutocompleteClick[key].idDireccion;
                                 idServicioAutoClick = $scope.listaAutocompleteClick[key].idProductoServicio;
                             });
                         }
                         obtenerDirecciones(idDireccionAutoClick, idServicioAutoClick, "Auto02");
                         $scope.inputAutocomplete = null;
                         $scope.cambiarClassForm();

                     } else {
                         $scope.inputAutocomplete = null;
                         $scope.cambiarClassForm();
                     }
                 } else {
                     $scope.inputAutocomplete = null;
                     $scope.cambiarClassForm();
                 }
             }, function(error) {

             });
         };

         function obtenerListadoLineasFijas(done) {
             var valorinput = $('#autocomplete-fijo').val();
             var arrayAutocomplete = [];
             listaFijosAutocomplete = '';
             var dataServAutocomplete = dataAutocomplete(valorinput, null);
             servDirectorioCorpoFijo.obtenerListadoLineasFijasAutocomplete(dataServAutocomplete).then(function(response) {
                 var rptaExito = response.data.obtenerListadoLineasFijasResponse.defaultServiceResponse.idRespuesta;
                 if (rptaExito == 0) {
                     listaFijosAutocomplete = response.data.obtenerListadoLineasFijasResponse.listadoProductosServicios;
                     if (listaFijosAutocomplete != undefined && listaFijosAutocomplete != '') {
                         if (angular.isArray(listaFijosAutocomplete)) {
                             $scope.listaAutocomplete = response.data.obtenerListadoLineasFijasResponse.listadoProductosServicios;
                             angular.forEach($scope.listaAutocomplete, function(val, key) {
                                 arrayAutocomplete.push({
                                     value: val.nombreAlias,
                                     data: val.idLinea
                                 });
                             });

                         } else {
                             $scope.listaAutocomplete = [];
                             $scope.listaAutocomplete.push(listaFijosAutocomplete);
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
                     }
                 } else {

                 }
             }, function(error) {

             });
         };

         function initAutocomplete() {
             $('#autocomplete-fijo').autocomplete({
                 lookup: function(query, done) {
                     obtenerListadoLineasFijas(done);
                 },
                 minChars: 4,
                 onSelect: function(suggestion) {
                     var input_IdLinea = suggestion.data;
                     obtenerDatosAutocomplete(input_IdLinea);
                     $scope.inputAutocomplete = null;
                     $scope.cambiarClassForm();

                 }
             });
         };

         function obtenerDatosAutocomplete(inputIdLinea) {
             $scope.mostrarDirectorio = false;
             $scope.errorDirectorio = false;
             var idDireccionAuto = '';
             var idProducServicioAuto = '';
             angular.forEach($scope.listaAutocomplete, function(va, ke) {
                 if (va.idLinea == inputIdLinea) {
                     idDireccionAuto = $scope.listaAutocomplete[ke].idDireccion;
                     idProducServicioAuto = $scope.listaAutocomplete[ke].idProductoServicio;
                 }
             });
             obtenerDirecciones(idDireccionAuto, idProducServicioAuto, "Auto01");
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
             idLineasCambiada = directorio.idLinea;
             var flagSeleccionado = directorio.estadoAfiliado;
             idServicioAfiliar = directorio.idProductoServicio;
             if (flagSeleccionado == "true") {
                 desafiliarLinea();
             } else {
                 afiliarLinea();
             }
         };

         $scope.aceptarAfiliacion = function() {
             var estadoAceptar = true;
             actualizarEstadoAfiliacion(estadoAceptar);
         };

         $scope.aceptarDesafiliacion = function() {
             var estadoAceptar = false;
             actualizarEstadoAfiliacion(estadoAceptar);
         };

         $scope.cancelarAfiliacion = function() {
             $('#iregistro' + $scope.index).prop('checked', !$('#iregistro' + $scope.index).prop('checked'));
             esconderPopUp();
         };

         $scope.cancelarDesafiliacion = function() {
             $('#iregistro' + $scope.index).prop('checked', !$('#iregistro' + $scope.index).prop('checked'));
             esconderPopUp();
         };

         var objAudi = {};

         function registrarEstadoExito(rpta, idTransaccion, operacion) {
             var codAuditoria = '';
             if (operacion == 'DIRECCION') {
                 objAudi.dir = rpta;
             } else if (operacion == 'LINEA') {
                 objAudi.linea = rpta;
             } else if (operacion == 'FIJA') {
                 objAudi.fija = rpta;
             } else if (operacion == 'DIRECTORIO') {
                 objAudi.direc = rpta;
             } else if (operacion == 'AFIDEFI') {
                 if (estadoAfiDefi == true) {
                     codAuditoria = trasactionIdAfiliarDirectorioFijo;
                 } else {
                     codAuditoria = trasactionIdDesafiliarDirectorioFijo;
                 }
             }
             if (operacion != 'AFIDEFI') {
                 if (objAudi.dir == 0 && objAudi.linea == 0 && objAudi.fija == 0 && objAudi.direc == 0) {
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
                     codAuditoria = trasactionIdAfiliarDirectorioFijo;
                 } else {
                     codAuditoria = trasactionIdDesafiliarDirectorioFijo;
                 }
                 guardarAuditoria(codAuditoria, idTransaccion, mensajeAuditoria, estadoError);
             } else {
                 guardarAuditoria(codConsultaDirectorio, idTransaccion, mensajeAuditoria, estadoError);
             }

         };

         function guardarAuditoria(transaccion, idTransaccion, descripcionTransaccion, estadoAuditoria) {
             var dataAuditoriaMovil = dataAuditoriaRequest(transaccion, idTransaccion, descripcionTransaccion, estadoAuditoria);
             servDirectorioCorpoFijo.guardarAuditoria(dataAuditoriaMovil).then(function(response) {}, function(error) {

             });
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
             requestAuditoria.pagina = pageIdDirectorioFijo;
             requestAuditoria.transactionId = transactionId;
             requestAuditoria.estado = estadoAuditoria;
             requestAuditoria.servicio = lineaEnConsultaSession;
             requestAuditoria.tipoProducto = tipoProductoMovil;
             requestAuditoria.tipoLinea = tipoLineaAuditoria;
             requestAuditoria.tipoUsuario = tipoClienteSession;
             requestAuditoria.perfil = tipoPermisoAuditoria;
             requestAuditoria.monto = '';
             requestAuditoria.descripcionoperacion = descripcion;
             requestAuditoria.responseType = '-';

             dataAuditoria = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });
             return dataAuditoria;
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
             requestActualizarDirectorio.idProductoServicio = idServicioAfiliar;
             requestActualizarDirectorio.tipoCliente = tipoClienteCorporativo;
             requestActualizarDirectorio.categoria = categoriaLinea;
             requestActualizarDirectorio.idLinea = idLineasCambiada;

             dataActualizarDirectorio = $httpParamSerializer({ requestJson: angular.toJson(requestActualizarDirectorio) });
             return dataActualizarDirectorio;

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
             requestAutocompleteFijo.pagina = 1;
             if (indicador == "Auto02") {
                 requestAutocompleteFijo.cantResultadosPagina = 1;
             } else {
                 requestAutocompleteFijo.cantResultadosPagina = 10;
             }

             dataAutocompleteFijo = $httpParamSerializer({ requestJson: angular.toJson(requestAutocompleteFijo) });
             return dataAutocompleteFijo;
         };


         function obtenerDataDirectorio(idDireccionFija, idProductoPrincipalDefault, idLinea) {
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
             requestDirectorio.categoria = categoriaLinea;
             requestDirectorio.idProductoServicio = idProductoPrincipalDefault;
             requestDirectorio.idDireccion = idDireccionFija;
             requestDirectorio.idLinea = idLinea;

             dataDirectorio = $httpParamSerializer({ requestJson: angular.toJson(requestDirectorio) });
             return dataDirectorio;

         };

         function enviarDataLineasFijas(idDireccionFija, idProductoPrincipal) {
             var requestLineasFijas = {
                 "tipoCliente": null,
                 "idDireccion": null,
                 "idProductoServicio": null,
                 "nombreProducto": null,
                 "pagina": null,
                 "cantResultadosPagina": null
             }
             requestLineasFijas.tipoCliente = tipoClienteCorporativo;
             requestLineasFijas.idProductoServicio = idProductoPrincipal;
             requestLineasFijas.idDireccion = idDireccionFija;
             requestLineasFijas.pagina = pagina;
             requestLineasFijas.cantResultadosPagina = cantResultadosPagina;

             responseLineasFijas = $httpParamSerializer({ requestJson: angular.toJson(requestLineasFijas) });
             return responseLineasFijas;
         };

         function dataParaEnviar(idDireccionRequest, idProductoServicioRequest, indicador) {
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
             requestServiciosFijo.categoria = categoriaLinea;
             requestServiciosFijo.tipoLinea = tipoLineaTodos;
             requestServiciosFijo.tipoCliente = tipoClienteCorporativo;
             requestServiciosFijo.tipoPermiso = tipoPermisoAll;
             requestServiciosFijo.idDireccion = idDireccionRequest;
             if (indicador == "Auto01") {
                 requestServiciosFijo.idProductoServicio = idProductoServicioRequest;
             }
             requestServiciosFijo.pagina = pagina;
             requestServiciosFijo.cantResultadosPagina = cantResultadosPagina;
             requestServiciosFijo.titularidadServicio = titularidadServicioTodos;

             dataServiciosFijo = $httpParamSerializer({ requestJson: angular.toJson(requestServiciosFijo) });
             return dataServiciosFijo;
         };

         function dataDireccionEnviar() {
             var requestDireccion = {
                 "tipoCliente": null
             };
             requestDireccion.tipoCliente = tipoClienteFiltros;
             dataDireccion = $httpParamSerializer({ requestJson: angular.toJson(requestDireccion) });
             return dataDireccion;
         };

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

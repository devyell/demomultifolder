	var appController = angular.module('miClaroController', []);

	appController.directive('erCustomerrortotal', function() {
	    return {
	        restrict: 'E',
	        template: '<div class="contenido-claro container-md ph-0 text-center absolute-center centerError">' +
	            '<span class="icon-sh icon-sh_logoClaro"></span><div class="mensaje-error pv-42-mt-7 text-success">' +
	            '<h1 class="fz-26 dinMed">' + WPSMensajeErrorTotal.upps + '</h1><p class="container-xs fz-14 pt-14">' +
	            WPSMensajeErrorTotal.mensaje + '<br>' +
	            WPSMensajeErrorTotal.mensaje2 + '</p><br/>' +
	            '<a href="/wps/myportal/cuentasclaro/root" ><img src="/wpstheme/miclaro/img/icon-actualizar.png" width=""></a></div></div>'
	    }
	});
	appController.directive('focusMe', function($timeout) {
	    return {
	        link: function(scope, element, attrs) {
	            scope.$watch(attrs.focusMe, function(value) {

	                if (value === true) {
	                    $timeout(function() {
	                        element[0].focus();
	                        scope[attrs.focusMe] = true;
	                    });
	                }
	            });
	        }
	    };
	});

	appController.directive('erCustomerror', function() {
	    return {
	        restrict: 'E',
	        scope: {
	            textoVariable: '=texto',
	            clickOn: '&onRefresh'
	        },
	        template: '<p class="error-server"><strong>' +
	            WPSMensajeError.upps +
	            '</strong><br>' +
	            WPSMensajeError.mensaje1 + '<br>' + WPSMensajeError.mensaje2 + '{{textoVariable}}' + WPSMensajeError.mensaje5 +
	            '<a href="" ><img src="/wpstheme/miclaro/img/icon-actualizar.png" width="24" ng-click="clickOn()"></a>' +
	            '</p>'
	    }
	});

	appController.controller('ConfiguracionController', ['$scope', '$http', '$timeout', 'TuConfiguracionService', '$httpParamSerializer', function($scope, $http, $timeout, TuConfiguracionService, $httpParamSerializer) {

	    angular.element(document).ready(function() {
	        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	        $('link[rel=stylesheet][href~="/wpstheme/cuentasclaro/css/intranet.css"]').prop('disabled', true);
	        $('link[rel=stylesheet][href~="/wpstheme/cuentasclaro/css/intranet.css"]').remove();
	        $('link[rel=stylesheet][href~="/wpstheme/cuentasclaro/css/ebm.css"]').prop('disabled', true);
	        $('link[rel=stylesheet][href~="/wpstheme/cuentasclaro/css/ebm.css"]').remove();

	        var mensajeError = " <p ><div style='float: left' class='error-server'><strong>" + WPSMensajeError.upps + "!</strong> " + WPSMensajeError.mensaje + " " + WPSMensajeError.mensaje2 + " </div> <a href='/wps/portal/cuentasclaro/tuconfiguracion' class='loadingwps'>##</a></p>";
	        var mensajeErrorConsumer = " <p ><div style='float: left' class='error-server'><strong>" + WPSMensajeError.upps + "</strong> " + WPSMensajeError.mensaje1 + " " + WPSMensajeError.mensaje2 + WPSMensajeError.mensaje3 + WPSMensajeError.mensaje5 + " </div> <a href='/wps/portal/cuentasclaro/tuconfiguracion' class='loadingwps'>##</a></p>";
	        var mensajeErrorCorporativo = " <p ><div style='float: left' class='error-server'><strong>" + WPSMensajeError.upps + "</strong> " + WPSMensajeError.mensaje1 + " " + WPSMensajeError.mensaje2 + WPSMensajeError.mensaje4 + WPSMensajeError.mensaje5 + " </div> <a href='/wps/portal/cuentasclaro/tuconfiguracion' class='loadingwps'>##</a></p>";

	        $scope.ayCaramba_alias = WPSPersonalizarNombresCuentas.FLUJOALTERNO11;
	        $scope.activoMovil = 'tab-movil active';
	        $scope.activoFijo = 'tab-fijo';
	        $scope.tabMovil = 'tab active';
	        $scope.tabFijo = 'tab';
	        $scope.listaCuenta = [];
	        $scope.selectCuenta = '';
	        $scope.selectCuentaPerfil = '';
	        $scope.listaRecibo = [];
	        $scope.listaReciboPerfil = [];
	        $scope.selectReciboPerfil = '';
	        $scope.listadoProductosServicios = [];
	        $scope.listadoProductosServiciosPerfil = [];
	        $scope.listaLineaColumna01 = [];
	        $scope.classColumna01 = [];
	        $scope.listaLineaColumna02 = [];
	        $scope.classColumna02 = [];
	        $scope.txtEditar = {};
	        $scope.classEditar = [];
	        $scope.radioUsuario = [];
	        $scope.radioUsuarioPlus = [];
	        $scope.radioSubAdministrador = [];
	        $scope.listadoProductosPerfil = [];
	        $scope.editaCuenta = '';
	        $scope.editaCuentaNumero = 'input';
	        $scope.styleCuenta = '';
	        $scope.txtCuenta = '';
	        $scope.classCuenta = '';
	        $scope.estadoAlias = [];
	        $scope.selectRecibo = '';
	        $scope.ocultarRecibo = false;
	        $scope.editaRecibo = '';
	        $scope.editaReciboNumero = 'input';
	        $scope.stylerecibo = '';
	        $scope.txtRecibo = '';
	        $scope.classRecibo = '';
	        $scope.txtBuscarLinea = '';
	        $scope.estadoBuscarLiena = false;
	        $scope.estadoBuscarLienaPersonalizado = false;
	        $scope.txtBuscarLineaPerfil = '';
	        $scope.SeleccionarCuenta = 'Seleccionar';
	        $scope.SeleccionarCuentaPerfil = 'Selecciona una cuenta';
	        $scope.SeleccionarReciboPerfil = 'Selecciona un recibo';
	        $scope.estadoOc = false;
	        $scope.hideRecibo = false;
	        $scope.SeleccionarDireccion = 'Seleccionar';
	        $scope.hideDireccion = false;
	        $scope.editaDireccion = '';
	        $scope.listaDireccion = [];
	        $scope.editaDireccionNumero = 'input';
	        $scope.txtDireccion = '';
	        $scope.focusDirecion = false;
	        $("#ocultarDireccion").hide();
	        $scope.classDireccion = '';
	        $scope.selectDirecion = '';
	        $scope.servicioDirecccion = [];
	        $scope.ocultarTipoLinea = true;
	        $scope.ocultarTipoLineaConsumer = true;
	        $scope.ocultarTipoLineaMovil = false;
	        $scope.ocultarTipoNoEmpleado = false;
	        $scope.listadoLineasPostpago = [];
	        $scope.listadoLineasPrepago = [];
	        $scope.focusColumna01 = [];
	        $scope.keyColumna01 = -1;
	        $scope.keyColumna02 = -1;
	        $scope.keyPrepago = -1;
	        $scope.keyPostpago = -1;
	        $scope.keyServicioDireccion = -1;
	        $scope.listaLineaPrepago = [];
	        $scope.listaLineaPostpago = [];
	        $scope.listaServicioDirecccion = [];
	        $scope.listaUsuariosVinculados = [];
	        $scope.vinculenCuentaClass = 'check';
	        $scope.promocionesClass = 'check';
	        $scope.ocultarServicio = false;
	        $scope.ocultarFijo = false;
	        $scope.ocultarTipoPerfil = false;
	        $scope.ocultarPerfilAdministrado = false;
	        $scope.keyNoEmpleado = -1;
	        $scope.errorAlias = false;
	        $scope.idReciboCoor = '';
	        $scope.idfijaCoor = '';
	        $scope.hideTabFijo = false;
	        $scope.showLinea = false;
	        $scope.sohowSearch = true;
	        $scope.listaNoEmpleado = [];
	        $scope.pageSize = 10;
	        $scope.listaConsumerObtenerMovilesAfiliados = [];
	        $scope.SeleccionarLineasCorporativo = "Línea";
	        $scope.selectLineasCorporativo = '';
	        $scope.listaLinasAfiliadosCorporativo = [];
	        $scope.listaCorporativoObtenerMovilesAfiliados = [];
	        $scope.focusLineaCorporativo = false;
	        $scope.focousAutoCompleteLinea = true;
	        $scope.SeleccionarRecibo = 'Selecionar';
	        $scope.indexSeleccionarCuenta = -1;
	        $scope.indexSeleccionarRecibo = -1;
	        $scope.ocultarCorporativo = false;
	        $scope.ocultarComsumer = false;
	        $scope.estadoAutocompletePerfil = -1;
	        $scope.listaNoEmpleadoPrepago = [];
	        $scope.mensajeError = '';
	        $("#hideErrorTuConfiguracion").hide();
	        $("#textHideCuenta").hide();
	        $("#textHideRecibo").hide();
	        $scope.WPSTipoCliente = '';
	        $scope.errorTotal = false;
	        $scope.errorTotalLineas = false;
	        $scope.selectDireccion = '';
	        $("#hideVincularText").show();
	        $scope.textGeneral = '';
	        $("#regresaClaro .icon-sh").removeClass('icon-sh icon-sh_backArrow');
	        $("#regresaClaro").html("");
	        $scope.urlRetorno = [];
	        $scope.listaAutocomplete = [];
	        $scope.listaAutocompleteAfiliados = [];
	        $scope.estadoMovilContent = 0;
	        $scope.estadoMovilPostpagoContent = 0;
	        $scope.tuConfiguracion;
	        $scope.textsutu = '';
	        $scope.textsutu2 = '';

	        inicio();

	        function inicio() {
	            $('.help').tooltip({ placement: "right" });
	            $("#loaderTuConfiguracion").show();
	            if ($.cookie("CuentasClaroWPSRetornar")) {
	                var wps_cookie = $.cookie('CuentasClaroWPSRetornar');
	                TuConfiguracionService.urlsRetorno().then(function(response) {
	                    var urlRetorno = response.data;
	                    if (Array.isArray(urlRetorno)) {
	                        $scope.urlRetorno = urlRetorno;
	                    } else {
	                        $scope.urlRetorno.push(urlRetorno);
	                    }
	                    var id = parseInt(obtenerIdUrl($scope.urlRetorno, wps_cookie));
	                    $("#regresaClaro .icon-sh").addClass('icon-sh icon-sh_backArrow');
	                    $("#regresaClaro").attr('href', $scope.urlRetorno[id].url);
	                    $("#regresaClaro").html("<span class='icon-sh icon-sh_backArrow'></span>" + $scope.urlRetorno[id].textoInicialLink + " <strong>" + $scope.urlRetorno[id].nombreAplicacion + "</strong>");
	                }, function(error) {

	                });

	            } else {
	                $("#retornarClaro").css("height", "10px");
	                $("#regresaClaro .icon-sh").removeClass('icon-sh icon-sh_backArrow');
	                $("#regresaClaro").html("");
	            }

	            TuConfiguracionService.obtenerDatosUsuario().then(function(response) {
	                $scope.datos = response.data;
	                $scope.tipoLinea = $scope.datos.comunResponseType.tipoCliente;
	                $scope.telefono = $scope.datos.comunResponseType.telefono;
	                if ($scope.datos.comunResponseType.flagProductoMovilSesion < 0 && ($scope.datos.comunResponseType.flagProductoFijoSesion < 0 || $scope.datos.comunResponseType.flagProductoTVSesion < 0 || $scope.datos.comunResponseType.flagProductoInternetSesion <= 0)) {
	                    $('#ocultarMovil').hide();
	                    $('#ocultarFijo').hide();
	                    $('#idTabsMobile').hide();
	                    $scope.errorTotalLineas = true;

	                }else if($scope.tipoLinea == 3){
	               		 $('#ocultarMovil').hide();
	                    $('#ocultarFijo').hide();
	                    $('#idTabsMobile').hide();
	                    $('#nocliente').show();

	                } else if ($scope.datos.comunResponseType.flagProductoMovilSesion >= 1 && ($scope.datos.comunResponseType.flagProductoFijoSesion >= 1 || $scope.datos.comunResponseType.flagProductoTVSesion >= 1 || $scope.datos.comunResponseType.flagProductoInternetSesion >= 1)) {
	                    $('#ocultarMovil').show();
	                    $('#ocultarFijo').show();
	                    $scope.estadoMovil();
	                } else if ($scope.datos.comunResponseType.flagProductoMovilSesion >= 1 && ($scope.datos.comunResponseType.flagProductoFijoSesion == 0 || $scope.datos.comunResponseType.flagProductoTVSesion == 0 || $scope.datos.comunResponseType.flagProductoInternetSesion == 0)) {
	                    $('#ocultarMovil').show();
	                    $('#ocultarFijo').hide();
	                    $scope.estadoMovil();
	                } else if ($scope.datos.comunResponseType.flagProductoMovilSesion == 0 && ($scope.datos.comunResponseType.flagProductoFijoSesion >= 1 || $scope.datos.comunResponseType.flagProductoTVSesion >= 1 || $scope.datos.comunResponseType.flagProductoInternetSesion >= 1)) {
	                    $scope.estadoFijo();
	                    $('#ocultarMovil').hide();
	                    $('#ocultarFijo').show();
	                }
	                if (parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta) == 0) {
	                    if ($scope.tipoLinea == WPSTipoCliente.nocliente) {
	                        $scope.mensajeError = mensajeErrorConsumer;
	                        $scope.textGeneral = WPSMensajeError.mensaje3;
	                        $scope.WPSTipoCliente = WPSTipoCliente.nocliente;
	                        $("#mobileNoClienteCuenta").hide();
	                        $("#mobileNoCliente").hide();
	                        $("#hideNoClienteServicio").hide();
	                        $("#hideVincularText").hide();
	                        $("#hideVincularProceso").hide();
	                        $scope.textCorporativo = false;
	                        $scope.textConsumer = true;
	                        $scope.ocultarTipoLinea = true;
	                        $scope.ocultarTipoLineaConsumer = true;
	                        $scope.ocultarTipoLineaMovil = true;
	                        $scope.ocultarTipoNoEmpleado = false;
	                        $scope.ocultarFijo = true;
	                        $scope.ocultarTipoPerfil = true;
	                        inicioLineasNoEmpleadoPostpago();
	                        inicioLineasNoEmpleadoPrepago();
	                        promocion();
	                        $scope.tuConfiguracion = 'Tu Configuración';

	                    } else if (parseInt($scope.tipoLinea) == WPSTipoCliente.mixto) {
	                        $scope.mensajeError = mensajeErrorCorporativo;
	                        $scope.textGeneral = WPSMensajeError.mensaje4;
	                        $scope.WPSTipoCliente = WPSTipoCliente.mixto;
	                        $scope.tuConfiguracion = 'Su Configuración';
	                        $scope.textCorporativo = true;
	                        $scope.textConsumer = false;
	                        if ($scope.datos.comunResponseType.flagProductoMovilSesion == 1 && ($scope.datos.comunResponseType.flagProductoFijoSesion == 0 && $scope.datos.comunResponseType.flagProductoTVSesion == 0 && $scope.datos.comunResponseType.flagProductoInternetSesion == 0)) {

	                            $('.subtitleAsignaPerfil').hide();
	                            $scope.ocultarTipoLineaConsumer = false;
	                            $scope.ocultarTipoLineaMovil = true;
	                            $scope.ocultarTipoLinea = true;
	                            $scope.ocultarTipoNoEmpleado = true;
	                            $scope.ocultarPerfilAdministrado = true;
	                            $scope.ocultarCorporativo = true;
	                            $scope.ocultarComsumer = false;
	                            inicioLineasPostpago();
	                            inicioLineasPrepago();
	                            $('#errorCuenta').remove();
	                            $('#errorRecibo').remove();
	                            $('#textHideRecibo').show();
	                        } else if ($scope.datos.comunResponseType.flagProductoMovilSesion == 2 && ($scope.datos.comunResponseType.flagProductoFijoSesion == 0 && $scope.datos.comunResponseType.flagProductoTVSesion == 0 && $scope.datos.comunResponseType.flagProductoInternetSesion == 0)) {

	                            $scope.ocultarTipoLinea = false;
	                            $scope.ocultarTipoLineaConsumer = false;
	                            $scope.ocultarTipoLineaMovil = false;
	                            $scope.ocultarTipoNoEmpleado = true;
	                            $scope.ocultarCorporativo = false;
	                            $scope.ocultarComsumer = true;
	                            iniciarCuenta();
	                            iniciarFija();
	                            $("#textHideCuenta").show();
	                            $("#textHideRecibo").show();
	                        } else {
	                            $("#textHideCuenta").show();
	                            $("#textHideRecibo").show();
	                            $scope.ocultarComsumer = false;
	                            $scope.ocultarCorporativo = false;
	                            $scope.ocultarTipoLineaConsumer = false;
	                            $scope.ocultarTipoNoEmpleado = true;
	                            $scope.ocultarTipoLineaMovil = false;
	                            if ($scope.datos.comunResponseType.flagProductoMovilSesion == 1) {
	                                inicioLineasPostpago();
	                                inicioLineasPrepago();
	                                $scope.ocultarTipoLinea = true;
	                                $scope.ocultarTipoLineaMovil = true
	                                $('#textHideCuenta').hide();
	                                $('#textHideRecibo').hide();
	                                $scope.ocultarTipoLineaConsumer = false;
	                                $scope.ocultarComsumer = false;
	                                $scope.ocultarCorporativo = true;
	                            } else if ($scope.datos.comunResponseType.flagProductoMovilSesion == 2) {
	                                $scope.ocultarTipoLinea = false;
	                                $('#ocultartituloConsumer').hide();
	                                $scope.ocultarTipoLineaMovil = false;
	                                $scope.ocultarTipoLineaConsumer = true;
	                                $scope.ocultarComsumer = true;
	                                $scope.ocultarCorporativo = false;
	                                iniciarCuenta();
	                            } else {
	                                $scope.ocultarTipoLinea = false;
	                                $scope.ocultarComsumer = false;
	                                $scope.ocultarCorporativo = false;
	                                inicioLineasPostpago();
	                                inicioLineasPrepago();
	                                iniciarCuenta();
	                            }
	                            iniciarFija();
	                            ocultarTipoLineaMovil = false;
	                        }
	                        consumerObtenerMovilesAfiliados();
	                        listarAfiliadaCorporativo();
	                        obtenerCheckPermitirVincular();
	                        obtenerUsuariosVinculados();
	                        obtenerUsuariosQueMeVincularon();
	                        promocion();
	                    } else if ($scope.tipoLinea == WPSTipoCliente.consumer) {
	                        $scope.textCorporativo = false;
	                        $scope.textConsumer = true;
	                        $scope.tuConfiguracion = 'Tu Configuración';
	                        $scope.textGeneral = WPSMensajeError.mensaje3;
	                        $scope.mensajeError = mensajeErrorConsumer;
	                        $scope.WPSTipoCliente = WPSTipoCliente.consumer;
	                        $scope.ocultarTipoLineaConsumer = false;
	                        $scope.ocultarTipoLineaMovil = true;
	                        $scope.ocultarTipoLinea = true;
	                        $scope.ocultarTipoNoEmpleado = true;
	                        $scope.ocultarPerfilAdministrado = true;
	                        $scope.ocultarCorporativo = true;
	                        $scope.ocultarComsumer = false;
	                        inicioLineasPostpago();
	                        inicioLineasPrepago();
	                        iniciarFija();
	                        consumerObtenerMovilesAfiliados();
	                        obtenerCheckPermitirVincular();
	                        obtenerUsuariosVinculados();
	                        obtenerUsuariosQueMeVincularon();
	                        promocion();

	                    } else if ($scope.tipoLinea == WPSTipoCliente.corporativo) {
	                        $scope.tuConfiguracion = 'Su Configuración';
	                        $scope.textCorporativo = true;
	                        $scope.textConsumer = false;
	                        $('#subtitleAsignaPerfilConsumer').hide();
	                        $scope.textGeneral = WPSMensajeError.mensaje4;
	                        $scope.WPSTipoCliente = WPSTipoCliente.corporativo;
	                        $scope.mensajeError = mensajeErrorCorporativo;
	                        $("#textHideCuenta").show();
	                        $("#textHideRecibo").show();
	                        $scope.ocultarTipoLinea = true;
	                        $scope.ocultarTipoLineaConsumer = true;
	                        $scope.ocultarTipoLineaMovil = false;
	                        $scope.ocultarTipoNoEmpleado = true;
	                        $scope.ocultarCorporativo = false;
	                        $scope.ocultarComsumer = true;
	                        inicioLineasPostpago();
	                        inicioLineasPrepago();
	                        iniciarCuenta();
	                        iniciarFija();
	                        consumerObtenerMovilesAfiliados();
	                        listarAfiliadaCorporativo();
	                        obtenerCheckPermitirVincular();
	                        obtenerUsuariosVinculados();
	                        obtenerUsuariosQueMeVincularon();
	                        promocion();

	                    }
	                    $("#hideErrorTuConfiguracion").show();

	                } else {
	                    $scope.errorTotal = true;
	                    $("#retornarClaro").hide();
	                    $("#hideErrorTuConfiguracion").hide();

	                }
	                $("#loaderTuConfiguracion").hide();
	            }, function(response) {

	            });

	        }


	        function inicioLineasPostpago() {
	            var requestPostpago = {
	                categoria: WPSCategoria.movil,
	                tipoLinea: WPSTipoLinea.postpago,
	                tipoCliente: WPSTipoCliente.consumer,
	                idProductoServicio: "",
	                tipoPermiso: WPSTipoPermiso.todos,
	                idCuenta: "",
	                idRecibo: "",
	                idDireccion: "",
	                nombreProducto: "",
	                direccionCompleta: "",
	                pagina: '1',
	                cantResultadosPagina: '10',
	                productoPrincipalXidRecibo: "false",
	                titularidadServicio: WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado
	            };

	            requestPostpago = $httpParamSerializer({ requestJson: angular.toJson(requestPostpago), tipoConsulta: '' });
	            lineasPostpago(requestPostpago);
	        }

	        function inicioLineasPrepago() {
	            var requestPrepago = {
	                categoria: WPSCategoria.movil,
	                tipoLinea: WPSTipoLinea.prepago,
	                tipoCliente: WPSTipoCliente.consumer,
	                idProductoServicio: "",
	                tipoPermiso: WPSTipoPermiso.todos,
	                idCuenta: "",
	                idRecibo: "",
	                idDireccion: "",
	                direccionCompleta: "",
	                nombreProducto: "",
	                pagina: WPSpaginacion.pagina,
	                cantResultadosPagina: WPSpaginacion.cantResultadosPagina,
	                productoPrincipalXidRecibo: "false",
	                titularidadServicio: WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado
	            };
	            requestPrepago = $httpParamSerializer({ requestJson: angular.toJson(requestPrepago), tipoConsulta: '' });
	            lineasPrepago(requestPrepago);
	        }

	        function inicioLineasNoEmpleadoPostpago() {
	            var requestNoEmpleado = {
	                categoria: WPSCategoria.movil,
	                tipoLinea: WPSTipoLinea.postpago,
	                tipoCliente: WPSTipoCliente.consumer,
	                idProductoServicio: "",
	                tipoPermiso: WPSTipoPermiso.todos,
	                idCuenta: "",
	                idRecibo: "",
	                idDireccion: "",
	                direccionCompleta: "",
	                pagina: '0',
	                cantResultadosPagina: '0',
	                productoPrincipalXidRecibo: "false",
	                titularidadServicio: WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado
	            };
	            requestNoEmpleado = $httpParamSerializer({ requestJson: angular.toJson(requestNoEmpleado), tipoConsulta: '' });
	            $("#loaderNoEmpleadoPospago").show();
	            TuConfiguracionService.obtenerServicios(requestNoEmpleado).then(function(response) {
	                if (parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta) == 0) {
	                    $("#errorNoEmpleado").hide();
	                    if (response.data.obtenerServiciosResponse.listadoProductosServicios == undefined) {
	                        $("#loaderNoEmpleadoPospago").hide();
	                        $(".hideNoEmpleadoPostpago").hide();
	                    } else {
	                        $scope.listaNoEmpleado = response.data.obtenerServiciosResponse;
	                        var cantidad = Object.keys($scope.listaNoEmpleado.listadoProductosServicios).length;
	                        if (!Array.isArray($scope.listaNoEmpleado.listadoProductosServicios)) {
	                            $scope.listaNoEmpleado = [];
	                            $scope.listaNoEmpleado.push($scope.listadoProductosServicios.listadoProductosServicios);
	                            var listadoTemple = [];
	                            listadoTemple.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
	                            $scope.listaNoEmpleado = response.data.obtenerServiciosResponse;
	                            $scope.listaNoEmpleado.listadoProductosServicios = listadoTemple;
	                            $scope.estadoMovilContent += 1;
	                        }
	                        if (parseInt(cantidad) == 0) {
	                            $(".hideNoEmpleadoPostpago").hide();

	                        }
	                    }
	                    auditoriaResquest(WPSTablaOperaciones.consultarAliasMovil, response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', $scope.telefono, 'MOVIL', '2', $scope.tipoLinea, '-', '-');
	                } else {
	                    auditoriaResquest(WPSTablaOperaciones.consultarAliasMovil, response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional, 'ERROR', $scope.telefono, 'MOVIL', '2', $scope.tipoLinea, '-', response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje);
	                }
	                $("#loaderNoEmpleadoPospago").hide();
	            }, function(error) {
	                $("#errorNoEmpleado").show();
	                $("#loaderNoEmpleadoPospago").hide();
	            });

	        }

	        function inicioLineasNoEmpleadoPrepago() {
	            var requestNoEmpleadoPrepago = {
	                categoria: WPSCategoria.movil,
	                tipoLinea: WPSTipoLinea.prepago,
	                tipoCliente: WPSTipoCliente.consumer,
	                idProductoServicio: "",
	                tipoPermiso: WPSTipoPermiso.todos,
	                idCuenta: "",
	                idRecibo: "",
	                idDireccion: "",
	                direccionCompleta: "",
	                pagina: '0',
	                cantResultadosPagina: '0',
	                productoPrincipalXidRecibo: "false",
	                titularidadServicio: WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado
	            };
	            $("#loaderEmpleadoPrepago").show();
	            requestNoEmpleadoPrepago = $httpParamSerializer({ requestJson: angular.toJson(requestNoEmpleadoPrepago), tipoConsulta: '' });
	            TuConfiguracionService.obtenerServicios(requestNoEmpleadoPrepago).then(function(response) {
	                if (parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta) == 0) {
	                    $("#errorNoEmpleadoPrepago").hide();
	                    if (response.data.obtenerServiciosResponse.listadoProductosServicios == undefined) {
	                        $("#loaderEmpleadoPrepago").hide();
	                        $(".hideNoEmpleadoPrepago").hide();
	                    } else {
	                        $scope.listaNoEmpleadoPrepago = response.data.obtenerServiciosResponse;
	                        var cantidad = Object.keys($scope.listaNoEmpleadoPrepago.listadoProductosServicios).length;
	                        if (!Array.isArray($scope.listaNoEmpleadoPrepago.listadoProductosServicios)) {
	                            $scope.listaNoEmpleadoPrepago = [];
	                            $scope.listaNoEmpleadoPrepago.push($scope.listadoProductosServicios.listadoProductosServicios);
	                            var listadoTemple = [];
	                            listadoTemple.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
	                            $scope.listaNoEmpleadoPrepago = response.data.obtenerServiciosResponse;
	                            $scope.listaNoEmpleadoPrepago.listadoProductosServicios = listadoTemple;
	                        }
	                        if (parseInt(cantidad) == 0) {
	                            $(".hideNoEmpleadoPrepago").hide();
	                        }
	                    }

	                    auditoriaResquest(WPSTablaOperaciones.consultarAliasMovil, response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', $scope.telefono, 'MOVIL', '1', $scope.tipoLinea, '-', '-');
	                } else {
	                    $("#errorNoEmpleadoPrepago").show();
	                    auditoriaResquest(WPSTablaOperaciones.consultarAliasMovil, response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional, 'ERROR', $scope.telefono, 'MOVIL', '1', $scope.tipoLinea, '-', 'obtenerServicios - ' + response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje);
	                }
	                $("#loaderEmpleadoPrepago").hide();
	            }, function(error) {
	                $("#errorNoEmpleadoPrepago").show();
	                $("#loaderEmpleadoPrepago").hide();
	            });
	        }

	        function iniciarCuenta() {
	            TuConfiguracionService.obtenerListadoMovilCorporativoCuenta().then(function(response) {
	                if (parseInt(response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                    $("#errorCuenta").hide();
	                    $("#errorRecibo").hide();
	                    $("#frEditCuenta").show();
	                    $("#frEditRecibo").show();
	                    if (response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta == undefined) {
	                        $("#errorCuenta").show();
	                        $("#frEditCuenta").hide();
	                        $("#errorRecibo").show();
	                        $("#frEditRecibo").hide();
	                    } else {
	                        $scope.listaCuenta = response.data.obtenerListadoMovilCorporativoCuentaResponse;
	                        var cantidad = Object.keys($scope.listaCuenta.listadoCuenta).length;
	                        if (cantidad > 0) {
	                            if (!Array.isArray($scope.listaCuenta.listadoCuenta)) {
	                                $scope.listaCuenta = [];
	                                $scope.listaCuenta.push($scope.listaCuenta.listadoCuenta);
	                                var listadoTemple = [];
	                                listadoTemple.push(response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta);
	                                $scope.listaCuenta = response.data.obtenerListadoMovilCorporativoCuentaResponse;
	                                $scope.listaCuenta.listadoCuenta = listadoTemple;
	                                
	                            }
	                        } else {

	                        }
	                    }
	                } else {
	                    $("#errorCuenta").show();
	                    $("#frEditCuenta").hide();
	                    $("#errorRecibo").show();
	                    $("#frEditRecibo").hide();
	                }
	            }, function(error) {
	                $("#errorCuenta").show()
	                $("#frEditCuenta").hide();
	                $("#errorRecibo").show()
	                $("#frEditRecibo").hide();
	            });
	        }

	        function obtenerUsuariosQueMeVincularon() {
	            $("#loaderMeVincularon").show();

	            TuConfiguracionService.obtenerUsuariosQueMeVincularon().then(function(response) {
	                var idTransaccional = response.data.obtenerUsuariosQueMeVincularonResponse.defaultServiceResponse.idTransaccional;
	                if (parseInt(response.data.obtenerUsuariosQueMeVincularonResponse.defaultServiceResponse.idRespuesta) == 0 || parseInt(response.data.obtenerUsuariosQueMeVincularonResponse.defaultServiceResponse.idRespuesta) == 1) {
	                    $("#errorMeVincularon").hide();
	                    if (response.data.obtenerUsuariosQueMeVincularonResponse.listaUsuariosQueMeVincularon == undefined) {
	                        $("#loaderMeVincularon").hide();
	                    } else {
	                        $scope.listaVincularon = response.data.obtenerUsuariosQueMeVincularonResponse;
	                        if (!Array.isArray($scope.listaVincularon.listaUsuariosQueMeVincularon)) {
	                            $scope.listaVincularon = [];
	                            $scope.listaVincularon.push($scope.listaVincularon.listaUsuariosQueMeVincularon);
	                            var listadoTemple = [];
	                            listadoTemple.push(response.data.obtenerUsuariosQueMeVincularonResponse.listaUsuariosQueMeVincularon);
	                            $scope.listaVincularon = response.data.obtenerUsuariosQueMeVincularonResponse;
	                            $scope.listaVincularon.listaUsuariosQueMeVincularon = listadoTemple;
	                        }
	                    }
	                    auditoriaResquest(WPSTablaOperaciones.consultaUsuarioQueMeVincularon, idTransaccional, 'SUCCESS', $scope.telefono, 'MOVIL', '5', $scope.tipoLinea, '-', '-');

	                } else {
	                    $("#errorMeVincularon").show();
	                    auditoriaResquest(WPSTablaOperaciones.consultaUsuarioQueMeVincularon, idTransaccional, 'ERROR', $scope.telefono, 'MOVIL', '5', $scope.tipoLinea, '-', 'obtenerUsuariosQueMeVincularon - ' + response.data.obtenerUsuariosQueMeVincularonResponse.defaultServiceResponse.mensaje);
	                }
	                $("#loaderMeVincularon").hide();
	            }, function(error) {
	                $("#errorMeVincularon").show();
	                $("#loaderMeVincularon").hide();
	            });



	        }

	        function obtenerUsuariosVinculados() {
	            $("#loaderMeVincule").show();
	            TuConfiguracionService.obtenerUsuariosVinculados().then(function(response) {
	                if (parseInt(response.data.obtenerUsuariosVinculadosResponse.defaultServiceResponse.idRespuesta) == 0 || parseInt(response.data.obtenerUsuariosVinculadosResponse.defaultServiceResponse.idRespuesta) == 1) {
	                    $("#errorMeVincule").hide();
	                    if (response.data.obtenerUsuariosVinculadosResponse.listaUsuariosVinculados == undefined) {
	                        $("#loaderMeVincule").hide();
	                    } else {
	                        $scope.listaUsuariosVinculados = response.data.obtenerUsuariosVinculadosResponse;
	                        if (!Array.isArray($scope.listaUsuariosVinculados.listaUsuariosVinculados)) {
	                            $scope.listaUsuariosVinculados = [];
	                            $scope.listaUsuariosVinculados.push($scope.listaUsuariosVinculados.listaUsuariosVinculados);
	                            var listadoTemple = [];
	                            listadoTemple.push(response.data.obtenerUsuariosVinculadosResponse.listaUsuariosVinculados);
	                            $scope.listaUsuariosVinculados = response.data.obtenerUsuariosVinculadosResponse;
	                            $scope.listaUsuariosVinculados.listaUsuariosVinculados = listadoTemple;
	                        }
	                    }

	                    auditoriaResquest(WPSTablaOperaciones.consultaUsuarioQueVincule, response.data.obtenerUsuariosVinculadosResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', '-', 'MOVIL', '5', $scope.tipoLinea, '-', '-');

	                } else {
	                    $("#errorMeVincule").show();
	                    auditoriaResquest(WPSTablaOperaciones.consultaUsuarioQueVincule, response.data.obtenerUsuariosVinculadosResponse.defaultServiceResponse.idTransaccional, 'ERROR', '-', 'MOVIL', '5', $scope.tipoLinea, '-', 'obtenerUsuariosVinculados - ' + response.data.obtenerUsuariosVinculadosResponse.defaultServiceResponse.mensaje);
	                }
	                $("#loaderMeVincule").hide();
	            }, function(error) {
	                $("#errorMeVincule").show();
	                $("#loaderMeVincule").hide();

	            });
	        }

	        function obtenerCheckPermitirVincular() {
	            $("#loaderVincularcuenta").show();
	            TuConfiguracionService.obtenerCheckPermitirVincular().then(function(response) {
	                if (parseInt(response.data.obtenerCheckPermitirVincularResponse.defaultServiceResponse.idRespuesta) == 0) {
	                    $("#errorFrCuentas").hide();
	                    $("#frCuentas").show();
	                    if (response.data.obtenerCheckPermitirVincularResponse.vincular == 'false') {
	                        $scope.vinculenCuentaClass = 'check checked';
	                    } else {
	                        $scope.vinculenCuentaClass = 'check';
	                    }
	                    auditoriaResquest(WPSTablaOperaciones.consultaConfiguracionPermitirVincular, response.data.obtenerCheckPermitirVincularResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', '-', 'MOVIL', '5', $scope.tipoLinea, '-', '-');
	                } else {
	                    $("#frCuentas").hide();
	                    $("#errorFrCuentas").show();
	                    auditoriaResquest(WPSTablaOperaciones.consultaConfiguracionPermitirVincular, response.data.obtenerCheckPermitirVincularResponse.defaultServiceResponse.idTransaccional, 'ERROR', '-', 'MOVIL', '5', $scope.tipoLinea, '-', 'obtenerCheckPermitirVincular' + response.data.obtenerCheckPermitirVincularResponse.defaultServiceResponse.mensaje);
	                }
	                $("#loaderVincularcuenta").hide();
	            }, function(error) {
	                $("#errorFrCuentas").show();
	                $("#frCuentas").hide();
	                $("#loaderVincularcuenta").hide();
	            });
	        }

	        function promocion() {
	            $("#loaderPromociones").show();
	            TuConfiguracionService.obtenerCheckPromociones().then(function(response) {
	                if (parseInt(response.data.obtenerCheckPromocionesResponse.defaultServiceResponse.idRespuesta) == 0) {
	                    $("#errorPromociones").hide();
	                    $("#frPromos").show();
	                    if (response.data.obtenerCheckPromocionesResponse.promociones === 'true') {
	                        $scope.promocionesClass = 'check checked';
	                    } else {
	                        $scope.promocionesClass = 'check';
	                    }
	                    auditoriaResquest(WPSTablaOperaciones.consultaEstadoRecibirPromociones, response.data.obtenerCheckPromocionesResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', '-', 'MOVIL', '5', $scope.tipoLinea, '-', '-');
	                } else {
	                    $("#frPromos").hide();
	                    $("#errorPromociones").show();
	                    auditoriaResquest(WPSTablaOperaciones.consultaEstadoRecibirPromociones, response.data.obtenerCheckPromocionesResponse.defaultServiceResponse.idTransaccional, 'ERROR', '-', 'MOVIL', '5', $scope.tipoLinea, '2', 'obtenerCheckPromociones - ' + response.data.obtenerCheckPromocionesResponse.defaultServiceResponse.mensaje);
	                }
	                $("#loaderPromociones").hide();
	            }, function(error) {
	                $("#frPromos").hide();
	                $("#errorPromociones").show();
	                $("#loaderPromociones").hide();
	            });
	        }


	        function consumerObtenerMovilesAfiliados() {
	            var request = {
	                idProductoServicio: "",
	                nombreProducto: "",
	                tipoCliente: WPSTipoCliente.consumer,
	                idCuenta: "",
	                idRecibo: "",
	                pagina: WPSpaginacion.pagina,
	                cantResultadosPagina: WPSpaginacion.cantResultadosPagina
	            };
	            $("#loaderConsumerObtenerMovilesAfiliados").show();
	            request = $httpParamSerializer({ requestJson: angular.toJson(request) });
	            TuConfiguracionService.ObtenerMovilesAfiliados(request).then(function(response) {
	                if (parseInt(response.data.obtenerMovilesAfiliadosResponse.defaultServiceResponse.idRespuesta) == 0) {
	                    $("#errorListaConsumer").hide();
	                    if (response.data.obtenerMovilesAfiliadosResponse.listadoProductosServicios == undefined) {
	                        $("#loaderConsumerObtenerMovilesAfiliados").hide();
	                    } else {
	                        $scope.listaConsumerObtenerMovilesAfiliados = response.data.obtenerMovilesAfiliadosResponse.listadoProductosServicios;
	                        if (!Array.isArray($scope.listaConsumerObtenerMovilesAfiliados)) {
	                            $scope.listaConsumerObtenerMovilesAfiliados = [];
	                            $scope.listaConsumerObtenerMovilesAfiliados.push($scope.listaConsumerObtenerMovilesAfiliados);
	                            var listadoTemple = [];
	                            listadoTemple.push(response.data.obtenerMovilesAfiliadosResponse.listadoProductosServicios);
	                            $scope.listaConsumerObtenerMovilesAfiliados = response.data.obtenerMovilesAfiliadosResponse.listadoProductosServicios;
	                            $scope.listaConsumerObtenerMovilesAfiliados = listadoTemple;
	                        }
	                    }


	                    auditoriaResquest(WPSTablaOperaciones.consultaUsuariosAfiliados, response.data.obtenerMovilesAfiliadosResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', '-', 'MOVIL', '5', $scope.tipoLinea, '-', '-');
	                } else {
	                    $("#errorListaConsumer").show();
	                    auditoriaResquest(WPSTablaOperaciones.consultaUsuariosAfiliados, response.data.obtenerMovilesAfiliadosResponse.defaultServiceResponse.idTransaccional, 'ERROR', '-', 'MOVIL', '5', $scope.tipoLinea, '-', 'obtenerMovilesAfiliados - ' + response.data.obtenerMovilesAfiliadosResponse.defaultServiceResponse.mensaje);
	                }
	                $("#loaderConsumerObtenerMovilesAfiliados").hide();
	            }, function(error) {
	                $("#errorListaConsumer").show();
	                $("#loaderConsumerObtenerMovilesAfiliados").hide();
	            });

	        }

	        function iniciarFija() {
	            $("#loaderImagenSelectDireccion").show();

	            var requestFija = {
	                tipoCliente: WPSTipoClienteDir.todos
	            };

	            requestFija = $httpParamSerializer({ requestJson: angular.toJson(requestFija) });

	            TuConfiguracionService.obtenerListadoFijoDireccion(requestFija).then(function(response) {
	                if (parseInt(response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idRespuesta) == 0) {
	                    $("#frEditDireccion").show();
	                    $("#errorDireccion").hide();
	                    if (response.data.obtenerListadoFijoDireccionResponse.listadoDireccion == undefined || response.data.obtenerListadoFijoDireccionResponse.listadoDireccion == '') {

	                    } else {
	                        $scope.listaDireccion = response.data.obtenerListadoFijoDireccionResponse;
	                        if (!Array.isArray($scope.listaDireccion.listadoDireccion)) {
	                            $scope.listaDireccion = [];
	                            $scope.listaDireccion.push($scope.listaDireccion.listadoDireccion);
	                            var listadoTemple = [];
	                            listadoTemple.push(response.data.obtenerListadoFijoDireccionResponse.listadoDireccion);
	                            $scope.listaDireccion = response.data.obtenerListadoFijoDireccionResponse;
	                            $scope.listaDireccion.listadoDireccion = listadoTemple;
	                        }
	                    }
	                    auditoriaResquest(WPSTablaOperaciones.consutlarAliasFijo, response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', '-', 'MOVIL', '5', $scope.tipoLinea, '-', '-');
	                } else {
	                    $("#frEditDireccion").hide();
	                    $("#errorDireccion").show();
	                    auditoriaResquest(WPSTablaOperaciones.consutlarAliasFijo, response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idTransaccional, 'ERROR', '-', 'MOVIL', '5', $scope.tipoLinea, '-', 'obtenerListadoFijoDireccion - ' + response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.mensaje);
	                }
	                $("#loaderImagenSelectDireccion").hide();
	            }, function(error) {
	                $("#frEditDireccion").hide();
	                $("#errorDireccion").show();
	                $("#loaderImagenSelectDireccion").hide();
	            });
	        }

	        $scope.changeCuenta = function(idCuenta, tipo) {
	            if (idCuenta == null || idCuenta === 'undefined') {
	                $timeout(function() {
	                    $scope.SeleccionarCuenta = 'Selecionar';
	                    $scope.SeleccionarRecibo = 'Selecionar';
	                    $scope.selectRecibo = '';
	                    $scope.listaRecibo = [];
	                    limpiarlistaRecibo();
	                    limpiar();
	                }, 200);
	            } else {
	                $scope.indexSeleccionarCuenta = -1;
	                $scope.SeleccionarCuenta = '';
	                $scope.SeleccionarRecibo = 'Selecionar';
	                $('#wpsCuenta').show();
	                $scope.ocultarRecibo = false;
	                limpiarlistaRecibo();
	                limpiar();
	                obtenerRecibo(idCuenta, tipo);
	                $scope.SeleccionarRecibo = 'Selecionar';
	            }

	        };

	        $scope.changeDireccion = function(idreccion) {
	            $scope.indexSeleccionarDireccion = -1;
	            if (idreccion == null || idreccion === 'undefined') {
	                $("#ocultarDireccion").hide();
	                $scope.SeleccionarDireccion = 'Seleccionar';
	                $scope.ocultarServicio = false;
	            } else {
	                $scope.SeleccionarDireccion = '';
	                $("#ocultarDireccion").show();
	                $scope.ocultarServicio = true;
	                document.getElementById('direccion').innerHTML = $scope.selectDireccion.txtAccion;
	                $(".info").css({ 'opacity': '' });
	                $("#loaderImagenServicioDirecccion").show();

	                var datos = {
	                    categoria: WPSCategoria.todos,
	                    tipoLinea: WPSTipoLinea.todos,
	                    tipoCliente: $scope.WPSTipoCliente,
	                    idProductoServicio: "",
	                    tipoPermiso: WPSTipoPermiso.todos,
	                    idCuenta: "",
	                    idRecibo: "",
	                    idDireccion: idreccion,
	                    direccionCompleta: "",
	                    pagina: "0",
	                    cantResultadosPagina: "0",
	                    productoPrincipalXidRecibo: "false",
	                    titularidadServicio: WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado

	                };
	                datos = $httpParamSerializer({ requestJson: angular.toJson(datos), tipoConsulta: '' });
	                TuConfiguracionService.obtenerServicios(datos).then(function(response) {
	                    if (parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta) == 0) {
	                        $("#errorListarDireccion").hide();
	                        $scope.servicioDirecccion = response.data.obtenerServiciosResponse;
	                        if (!Array.isArray($scope.servicioDirecccion.listadoProductosServicios)) {
	                            $scope.servicioDirecccion = [];
	                            $scope.servicioDirecccion.push($scope.listadoProductosServicios.listadoProductosServicios);
	                            var listadoTemple = [];
	                            listadoTemple.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
	                            $scope.servicioDirecccion = response.data.obtenerServiciosResponse;
	                            $scope.servicioDirecccion.listadoProductosServicios = listadoTemple;

	                        }
	                        

	                        auditoriaResquest(WPSTablaOperaciones.consutlarAliasFijo, response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', '-', 'MOVIL', '5', $scope.tipoLinea, '-', '-');
	                    } else {
	                        $scope.servicioDirecccion = [];
	                        $("#errorListarDireccion").show();
	                        auditoriaResquest(WPSTablaOperaciones.consutlarAliasFijo, response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional, 'ERROR', '-', 'MOVIL', '5', $scope.tipoLinea, '-', 'obtenerServicios - ' + response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje);
	                    }
	                    $("#loaderImagenServicioDirecccion").hide();
	                }, function(response) {
	                    $("#errorListarDireccion").show();
	                    $("#loaderImagenServicioDirecccion").hide();

	                });
	            }
	        };

	        function obtenerRecibo(idCuentaObtener, tipo) {

	            var requestObtenerRecibo = {
	                idCuenta: idCuentaObtener
	            };
	            requestObtenerRecibo = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerRecibo) });
	            TuConfiguracionService.obtenerListadoMovilCorporativoRecibo(requestObtenerRecibo).then(function(response) {
	                if (parseInt(response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idRespuesta) == 0) {
	                    $("#errorRecibo").hide();
	                    $("#frEditRecibo").show();
	                    if (response.data.obtenerListadoMovilCorporativoReciboResponse == undefined) {

	                    } else {
	                        $scope.listaRecibo = response.data.obtenerListadoMovilCorporativoReciboResponse;
	                        var cantidad = Object.keys($scope.listaRecibo.listadoRecibo).length;
	                        if (cantidad > 0) {
	                            if (!Array.isArray($scope.listaRecibo.listadoRecibo)) {
	                                $scope.listaRecibo = [];
	                                $scope.listaRecibo.push($scope.listaRecibo.listadoRecibo);
	                                var listadoTemple = [];
	                                listadoTemple.push(response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo);
	                                $scope.listaRecibo = response.data.obtenerListadoMovilCorporativoReciboResponse;
	                                $scope.listaRecibo.listadoRecibo = listadoTemple;
	                            }
	                        } else {
	                            $("#frEditRecibo").hide();
	                        }
	                    }

	                } else {
	                    $("#errorCuenta").show();
	                    $("#frEditCuenta").hide();
	                    $("#errorRecibo").show();
	                    $("#frEditRecibo").hide();
	                }

	            }, function(response) {
	                $("#errorCuenta").show();
	                $("#frEditCuenta").hide();
	                $("#errorRecibo").show();
	                $("#frEditRecibo").hide();

	            });

	        }

	        function obtenerReciboPerfil(idCuenta) {
	            limpiarlistaReciboPerfil();

	            var requestObtenerRecibo = {
	                idCuenta: idCuenta
	            };
	            requestObtenerRecibo = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerRecibo) });

	            TuConfiguracionService.obtenerListadoMovilCorporativoRecibo(requestObtenerRecibo).then(function(response) {
	                $scope.listaReciboPerfil = response.data.obtenerListadoMovilCorporativoReciboResponse;
	            }, function(error) {

	            });
	        }

	        $scope.changeRecibo = function(tipo) {
	            if ($scope.selectRecibo == null || $scope.selectRecibo == '') {
	                $scope.SeleccionarRecibo = 'Seleccionar';
	                limpiar();
	                $("#ocultarRecibo").hide();
	            } else {
	                $scope.indexSeleccionarRecibo = -1;
	                $scope.SeleccionarCuenta = '';
	                $scope.SeleccionarRecibo = '';

	                try {
	                    idRecibo = $scope.selectRecibo.idRecibo;
	                } catch (e) {
	                    idRecibo = '';
	                }
	                if (idRecibo != '') {
	                    $("#ocultarRecibo").show();
	                    var datos = {
	                        categoria: WPSCategoria.movil,
	                        tipoLinea: WPSTipoLinea.todos,
	                        tipoCliente: WPSTipoCliente.corporativo,
	                        idProductoServicio: "",
	                        tipoPermiso: WPSTipoPermiso.todos,
	                        idCuenta: $scope.selectCuenta.idCuenta,
	                        idRecibo: idRecibo,
	                        idDireccion: "",
	                        direccionCompleta: $scope.txtBuscarLinea,
	                        pagina: WPSpaginacion.pagina,
	                        cantResultadosPagina: WPSpaginacion.cantResultadosPagina,
	                        productoPrincipalXidRecibo: "false",
	                        titularidadServicio: WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado
	                    };
	                    obtenerServicios(datos);
	                }
	            }
	        };

	        function lineasCorporativo() {
	            var request = {
	                tipoCliente: WPSTipoCliente.corporativo,
	                idCuenta: $scope.selectCuentaPerfil.idCuenta,
	                idRecibo: $scope.selectCuentaPerfil.idRecibo,
	                criterioBusqueda: "",
	                pagina: WPSpaginacion.pagina,
	                cantResultadosPagina: WPSpaginacion.cantResultadosPagina
	            };
	            request = $httpParamSerializer({ requestJson: angular.toJson(request) });
	            TuConfiguracionService.obtenerListadoMovilesAfiliados(request).then(function(response) {
	                $scope.listaLinasAfiliadosCorporativo = response.data.obtenerListadoMovilesAfiliadosResponse.listadoProductosServicios;
	            }, function(error) {

	            });
	        }

	        function listarAfiliadaCorporativo() {
	            var datos = {
	                idProductoServicio: '',
	                nombreProducto: '',
	                tipoCliente: WPSTipoCliente.corporativo,
	                idCuenta: '',
	                idRecibo: '',
	                pagina: WPSpaginacion.pagina,
	                cantResultadosPagina: WPSpaginacion.cantResultadosPagina
	            };
	            $timeout(function() { obtenerServiciosPerfil(datos); }, 200);
	        }


	        $scope.desvincular = function(index) {
	            var datos = {
	                listaUsuarios: [{
	                    emailUsuario: $scope.listaUsuariosVinculados.listaUsuariosVinculados[index].emailUsuario,
	                    tipo: '1'
	                }]
	            };
	            datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	            $("#loaderDesvincular" + index).show();
	            TuConfiguracionService.desvincularUsuarios(datos).then(function(response) {
	                if (parseInt(response.data.desvincularUsuariosResponse.defaultServiceResponse.idRespuesta) == 0) {
	                    $scope.listaUsuariosVinculados.listaUsuariosVinculados.splice(index, 1);
	                    auditoriaResquest(WPSTablaOperaciones.desvincularUsuario, response.data.desvincularUsuariosResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', '-', 'MOVIL', '5', $scope.tipoLinea, '-', '-');
	                } else {
	                    auditoriaResquest(WPSTablaOperaciones.desvincularUsuario, response.data.desvincularUsuariosResponse.defaultServiceResponse.idTransaccional, 'ERROR', '-', 'MOVIL', '5', $scope.tipoLinea, '-', 'desvincularUsuarios - ' + response.data.desvincularUsuariosResponse.defaultServiceResponse.mensaje);
	                }
	                $("#loaderDesvincular" + index).hide();
	            }, function(response) {
	                $("#loaderDesvincular" + index).hide();

	            });

	        };

	        $scope.meDesvincular = function(index) {
	            var datos = {
	                listaUsuarios: [{
	                    emailUsuario: $scope.listaVincularon.listaUsuariosQueMeVincularon[index].emailUsuario,
	                    tipo: '2'
	                }]
	            };
	            datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	            $("#loaderMeDesvincular" + index).show();
	            TuConfiguracionService.desvincularUsuarios(datos).then(function(response) {
	                if (parseInt(response.data.desvincularUsuariosResponse.defaultServiceResponse.idRespuesta) == 0) {
	                    $scope.listaVincularon.listaUsuariosQueMeVincularon.splice(index, 1);
	                    auditoriaResquest(WPSTablaOperaciones.desvincularUsuario, response.data.desvincularUsuariosResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', '-', 'MOVIL', '5', $scope.tipoLinea, '-', '-');
	                } else {
	                    auditoriaResquest(WPSTablaOperaciones.desvincularUsuario, response.data.desvincularUsuariosResponse.defaultServiceResponse.idTransaccional, 'ERROR', '-', 'MOVIL', '5', $scope.tipoLinea, '-', 'desvincularUsuarios - ' + response.data.desvincularUsuariosResponse.defaultServiceResponse.mensaje);
	                }
	                $("#loaderMeDesvincular" + index).hide();

	            }, function(response) {
	                $("#loaderMeDesvincular" + index).hide();


	            });

	        };

	        function obtenerServicios(datos) {
	            $(".loaderimagenListaLineaColumna01").show();
	            requestObtenerServicios = $httpParamSerializer({ requestJson: angular.toJson(datos), tipoConsulta: '' });
	            TuConfiguracionService.obtenerServicios(requestObtenerServicios).then(function(response) {
	                $("#errorListaLinea").hide();
	                if (parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta) == 0) {
	                    limpiar();
	                    if (response.data.obtenerServiciosResponse.listadoProductosServicios == undefined || response.data.obtenerServiciosResponse.listadoProductosServicios == '') {
	                        $(".loaderimagenListaLineaColumna01").hide();
	                    } else {
	                        $scope.listadoProductosServicios = response.data.obtenerServiciosResponse;
	                        var cantidad = Object.keys($scope.listadoProductosServicios.listadoProductosServicios).length;
	                        if (!Array.isArray($scope.listadoProductosServicios.listadoProductosServicios)) {
	                            $scope.listadoProductosServicios = [];
	                            $scope.listadoProductosServicios.push($scope.listadoProductosServicios.listadoProductosServicios);
	                            var listadoTemple = [];
	                            listadoTemple.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
	                            $scope.listadoProductosServicios = response.data.obtenerServiciosResponse;
	                            $scope.listadoProductosServicios.listadoProductosServicios = listadoTemple;
	                        }
	                        distribucion();
	                    }
	                    auditoriaResquest(WPSTablaOperaciones.consultarAliasMovil, response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', '-', 'MOVIL', '5', $scope.tipoLinea, '-', '-');
	                } else {
	                    limpiar();
	                    $("#errorListaLinea").show();
	                    auditoriaResquest(WPSTablaOperaciones.consultarAliasMovil, response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional, 'ERROR', '-', 'MOVIL', '5', $scope.tipoLinea, '-', 'obtenerServicios - ' + response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje);
	                }
	                $(".loaderimagenListaLineaColumna01").hide();
	            }, function(response) {
	                $("#errorListaLinea").show();
	                $(".loaderimagenListaLineaColumna01").hide();



	            });

	        }

	        function lineasPostpago(datos) {
	            $("#loaderimagenPostpago").show();
	            TuConfiguracionService.obtenerServicios(datos).then(function(response) {
	                if (parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta) == 0) {
	                    $("#errorPospago").hide();

	                    if (response.data.obtenerServiciosResponse.listadoProductosServicios == undefined || response.data.obtenerServiciosResponse.listadoProductosServicios == '') {
	                        $("#loaderimagenPostpago").hide();
	                        $(".ocultarListaPostapago").hide();

	                    } else {
	                        $scope.listadoLineasPostpago = response.data.obtenerServiciosResponse;
	                        var cantidad = Object.keys($scope.listadoLineasPostpago.listadoProductosServicios).length;
	                        if (cantidad > 0) {
	                            if (!Array.isArray($scope.listadoLineasPostpago.listadoProductosServicios)) {
	                                $scope.listadoLineasPostpago = [];
	                                $scope.listadoLineasPostpago.push($scope.listadoLineasPostpago.listadoProductosServicios);
	                                $scope.listadoTemple = [];
	                                $scope.listadoTemple.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
	                                $scope.listadoLineasPostpago = response.data.obtenerServiciosResponse;
	                                $scope.listadoLineasPostpago.listadoProductosServicios = $scope.listadoTemple;
	                            }
	                        } else {
	                            $(".ocultarListaPostapago").hide();
	                        }
	                    }
	                    $("#loaderimagenPostpago").hide();
	                    auditoriaResquest(WPSTablaOperaciones.consultarAliasMovil, response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', '-', 'MOVIL', '2', $scope.tipoLinea, '-', '-');
	                } else {
	                    $("#errorPospago").show();
	                    auditoriaResquest(WPSTablaOperaciones.consultarAliasMovil, response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional, 'ERROR', '-', 'MOVIL', '2', $scope.tipoLinea, '-', 'obtenerServicios - ' + response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje);
	                }
	                $("#loaderimagenPostpago").hide();
	            }, function(response) {
	                $("#errorPospago").show();
	                $("#loaderimagenPostpago").hide();


	            });
	        }

	        function lineasPrepago(datos) {
	            $("#loaderimagenPrepago").show();
	            TuConfiguracionService.obtenerServicios(datos).then(function(response) {
	                if (parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta) == 0) {
	                    $("#errorPrepago").hide();
	                    if (response.data.obtenerServiciosResponse.listadoProductosServicios == undefined || response.data.obtenerServiciosResponse.listadoProductosServicios == '') {
	                        $("#loaderimagenPrepago").hide();
	                        $(".ocultarListaPrepago").hide();

	                    } else {
	                        $scope.listaLineaPrepago = response.data.obtenerServiciosResponse;


	                        if (!Array.isArray($scope.listaLineaPrepago.listadoProductosServicios)) {
	                            $scope.listaLineaPrepago = [];
	                            $scope.listaLineaPrepago.push($scope.listaLineaPrepago.listadoProductosServicios);
	                            var listadoTemple = [];
	                            listadoTemple.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
	                            $scope.listaLineaPrepago = response.data.obtenerServiciosResponse;
	                            $scope.listaLineaPrepago.listadoProductosServicios = listadoTemple;
	                        }

	                        var cantidad = Object.keys($scope.listaLineaPrepago.listadoProductosServicios).length;
	                        if (cantidad > 0) {} else {
	                            $(".ocultarListaPrepago").hide();
	                        }
	                    }
	                    auditoriaResquest(WPSTablaOperaciones.consultarAliasMovil, response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', '-', 'MOVIL', '1', $scope.tipoLinea, '-', '-');
	                } else {
	                    $("#errorPrepago").show();
	                    auditoriaResquest(WPSTablaOperaciones.consultarAliasMovil, response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional, 'ERROR', '-', 'MOVIL', '1', $scope.tipoLinea, '-', 'obtenerServicios - ' + response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje);
	                }
	                $("#loaderimagenPrepago").hide();
	            }, function(response) {
	                $("#errorPrepago").show();
	                $("#loaderimagenPrepago").hide();


	            });

	        }

	        function obtenerServiciosPerfil(datos) {
	            $("#loaderCorporativoObtenerMovilesAfiliados").show();
	            datos = $httpParamSerializer({ requestJson: angular.toJson(datos), tipoConsulta: '' });
	            TuConfiguracionService.ObtenerMovilesAfiliados(datos).then(function(response) {
	                if (parseInt(response.data.obtenerMovilesAfiliadosResponse.defaultServiceResponse.idRespuesta) == 0) {
	                    $("#errorListaCorporativo").hide();
	                    if (response.data.obtenerMovilesAfiliadosResponse.listadoProductosServicios == undefined) {
	                        $("#loaderCorporativoObtenerMovilesAfiliados").hide();
	                    } else {
	                        $scope.listaCorporativoObtenerMovilesAfiliados = response.data.obtenerMovilesAfiliadosResponse.listadoProductosServicios;
	                        if (!Array.isArray($scope.listaCorporativoObtenerMovilesAfiliados)) {
	                            $scope.listaCorporativoObtenerMovilesAfiliados = [];
	                            $scope.listaCorporativoObtenerMovilesAfiliados.push($scope.listaConsumerObtenerMovilesAfiliados);
	                            var listadoTemple = [];
	                            listadoTemple.push(response.data.obtenerMovilesAfiliadosResponse.listadoProductosServicios);
	                            $scope.listaCorporativoObtenerMovilesAfiliados = response.data.obtenerMovilesAfiliadosResponse.listadoProductosServicios;
	                            $scope.listaCorporativoObtenerMovilesAfiliados = listadoTemple;
	                        }
	                    }
	                    auditoriaResquest(WPSTablaOperaciones.consultaUsuariosAfiliados, response.data.obtenerMovilesAfiliadosResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', '-', 'MOVIL', '5', $scope.tipoLinea, '-', '-');
	                } else {
	                    $("#errorListaCorporativo").show();
	                    auditoriaResquest(WPSTablaOperaciones.consultaUsuariosAfiliados, response.data.obtenerMovilesAfiliadosResponse.defaultServiceResponse.idTransaccional, 'ERROR', '-', 'MOVIL', '5', $scope.tipoLinea, '-', 'obtenerMovilesAfiliados - ' + response.data.obtenerMovilesAfiliadosResponse.defaultServiceResponse.mensaje);
	                }
	                $("#loaderCorporativoObtenerMovilesAfiliados").hide();
	            }, function(response) {
	                $("#errorListaCorporativo").show();
	                $("#loaderCorporativoObtenerMovilesAfiliados").hide();


	            });
	        }


	        function distribucion() {
	            var cantidad = Object.keys($scope.listadoProductosServicios.listadoProductosServicios).length;
	            limpiar();

	            if (cantidad < 5) {
	                for (i = 0; i < cantidad; i++) {
	                    $scope.listaLineaColumna01.push($scope.listadoProductosServicios.listadoProductosServicios[parseInt(i)]);
	                }

	            } else {
	                for (i = 0; i < 5; i++) {
	                    $scope.listaLineaColumna01.push($scope.listadoProductosServicios.listadoProductosServicios[parseInt(i)]);
	                }
	                for (j = 5; j < 10; j++) {
	                    $scope.listaLineaColumna02.push($scope.listadoProductosServicios.listadoProductosServicios[parseInt(j)]);
	                }
	            }

	        }

	        $scope.modificarPermisoUsuario = function(index, estado) {
	            if (estado == 'C') {
	                
	                $timeout(function() {
	                    var loader = "loaderMovile" + index;
	                    $("#" + loader).show();
	                    var datos = {
	                        idCuenta: $scope.listaConsumerObtenerMovilesAfiliados[index].idCuenta,
	                        idRecibo: $scope.listaConsumerObtenerMovilesAfiliados[index].idRecibo,
	                        idProductoServicio: $scope.listaConsumerObtenerMovilesAfiliados[index].idProductoServicio,
	                        tipoPermiso: 1
	                    };
	                    modificarPermiso(datos, 'C', 'U', index);
	                }, 200);
	            } else {

	                $timeout(function() {
	                    $("#loaderMovileCor" + index).show();
	                    var datos = {
	                        idCuenta: $scope.listaCorporativoObtenerMovilesAfiliados[index].idCuenta,
	                        idRecibo: $scope.listaCorporativoObtenerMovilesAfiliados[index].idRecibo,
	                        idProductoServicio: $scope.listaCorporativoObtenerMovilesAfiliados[index].idProductoServicio,
	                        tipoPermiso: 1
	                    };
	                    modificarPermiso(datos, 'CO', 'U', index);
	                }, 200);
	            }
	        }

	        $scope.modificarPermisoUsuarioPlus = function(index, estado) {
	            if (estado == 'C') {
	                var loader = "loaderMovile" + index;
	                $("#" + loader).show();
	                var datos = {
	                    idCuenta: $scope.listaConsumerObtenerMovilesAfiliados[index].idCuenta,
	                    idRecibo: $scope.listaConsumerObtenerMovilesAfiliados[index].idRecibo,
	                    idProductoServicio: $scope.listaConsumerObtenerMovilesAfiliados[index].idProductoServicio,
	                    tipoPermiso: 2
	                };
	                modificarPermiso(datos, 'C', 'P', index);
	            } else {
	                $("#loaderMovileCor" + index).show();
	                var datos = {
	                    idCuenta: $scope.listaCorporativoObtenerMovilesAfiliados[index].idCuenta,
	                    idRecibo: $scope.listaCorporativoObtenerMovilesAfiliados[index].idRecibo,
	                    idProductoServicio: $scope.listaCorporativoObtenerMovilesAfiliados[index].idProductoServicio,
	                    tipoPermiso: 2
	                };
	                modificarPermiso(datos, 'CO', 'P', index);
	            }
	        }

	        function modificarPermiso(datos, estado, tipoUsuario, index) {

	            datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });

	            var servicio = "";

	            TuConfiguracionService.modificarPermiso(datos).then(function(response) {
	                var mensaje = response.data.modificarPermisoResponse.defaultServiceResponse.mensaje;
	                if (response.data.modificarPermisoResponse.defaultServiceResponse.idRespuesta == '0' && response.data.modificarPermisoResponse.resultado == 'true') {
	                    $timeout(function() {
	                        if (estado == 'C') {
	                            servicio = $scope.listaConsumerObtenerMovilesAfiliados[index].nombreProducto;

	                            if (tipoUsuario == 'U') {
	                                $scope.listaConsumerObtenerMovilesAfiliados[index].radioUsuario = 'radio checked';
	                                $scope.listaConsumerObtenerMovilesAfiliados[index].radioUsuarioPlus = 'radio';
	                            } else {
	                                $scope.listaConsumerObtenerMovilesAfiliados[index].radioUsuario = 'radio';
	                                $scope.listaConsumerObtenerMovilesAfiliados[index].radioUsuarioPlus = 'radio checked';
	                            }
	                        } else {
	                            servicio = $scope.listaCorporativoObtenerMovilesAfiliados[index].nombreProducto;

	                            if (tipoUsuario == 'U') {
	                                $scope.listaCorporativoObtenerMovilesAfiliados[index].radioUsuario = 'radio checked';
	                                $scope.listaCorporativoObtenerMovilesAfiliados[index].radioUsuarioPlus = 'radio';
	                            } else {
	                                $scope.listaCorporativoObtenerMovilesAfiliados[index].radioUsuario = 'radio';
	                                $scope.listaCorporativoObtenerMovilesAfiliados[index].radioUsuarioPlus = 'radio checked';
	                            }
	                        }
	                        if (estado == 'C') {
	                            $("#loaderMovile" + index).hide();
	                        } else {
	                            $("#loaderMovileCor" + index).hide();
	                        }
	                    }, 200);
	                    auditoriaResquest(WPSTablaOperaciones.cambiarPermisoAfiliacion, response.data.modificarPermisoResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicio, 'MOVIL', '5', $scope.tipoLinea, '-', '-');
	                } else {
	                    if (estado == 'C') {
	                        $("#loaderMovile" + index).hide();
	                    } else {
	                        $("#loaderMovileCor" + index).hide();
	                    }
	                    auditoriaResquest(WPSTablaOperaciones.cambiarPermisoAfiliacion, response.data.modificarPermisoResponse.defaultServiceResponse.idTransaccional, 'Error', servicio, 'MOVIL', '5', $scope.tipoLinea, '-', 'servicio modificarPermiso - ' + mensaje);
	                }
	            }, function(response) {
	                if (estado == 'C') {
	                    $("#loaderMovile" + index).hide();
	                } else {
	                    $("#loaderMovileCor" + index).hide();
	                }

	            });
	        }
	        var estadoDireccion = true;
	        $scope.editarDireccion = function() {
	            if (estadoDireccion) {
	                estadoDireccion = false;
	                $("#ocultarDireccion").removeAttr("style");
	                $("#direccion").removeClass('red');
	                $('#msgErrorDireccion').hide();
	                var estado = document.getElementById('direccion').text;
	                if (estado == 'guardar') {
	                    $('#direccion').addClass('disabled');
	                    $('#loaderDireccion').show();
	                    var cantidad = Object.keys($scope.listaDireccion.listadoDireccion).length;
	                    var index = arrayObjectIndexOf($scope.listaDireccion.listadoDireccion, $scope.selectDireccion.nombreAlias);
	                    if (validarDireccion($scope.txtDireccion)) {
	                        var datos = {
	                            tipoOperacion: '1',
	                            idAfectado: $scope.listaDireccion.listadoDireccion[index].idDireccion,
	                            tipoAlias: '4',
	                            idCuenta: '',
	                            idDireccion: $scope.listaDireccion.listadoDireccion[index].idDireccion,
	                            descripcionAlias: $scope.txtDireccion
	                        };
	                        datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                        TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                            $scope.estadoAlias = response.data;
	                            if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                $scope.selectDireccion.nombreAlias = $scope.txtDireccion;
	                                $scope.listaDireccion.listadoDireccion[index].nombreAlias = $scope.txtDireccion;
	                                $scope.listaDireccion.listadoDireccion[index].txtAccion = 'reestablecer';
	                                $("#direccion").html("reestablecer");
	                                $scope.listaDireccion.listadoDireccion[index].nombreDireccionAlterno = $scope.listaDireccion.listadoDireccion[index].nombreDireccion;
	                                $scope.selectDireccion.nombreDireccionAlterno = $scope.listaDireccion.listadoDireccion[index].nombreDireccion;
	                                $('#hideDireccion').show();
	                                $('#focusEditaDireccion').hide();
	                                $('#editaDireccion').addClass('open');
	                                $scope.indexSeleccionarDireccion = -1;
	                                auditoriaResquest(WPSTablaOperaciones.cambioAliasFijo, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', '-', 'MOVIL', '5', $scope.tipoLinea, '-', '-');
	                                $('#msgErrorDireccion').hide();
	                                estadoDireccion = true;
	                            } else if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 6) {
	                                $timeout(function() {
	                                    $('#editaDireccion').addClass('open');
	                                    $scope.selectDireccion.nombreAlias = $scope.selectDireccion.nombreDireccion;
	                                    $scope.listaDireccion.listadoDireccion[index].nombreAlias = $scope.selectDireccion.nombreDireccion;
	                                    $scope.listaDireccion.listadoDireccion[index].txtEditar = 'editar';
	                                    $("#direccion").html("editar");
	                                    $scope.listaDireccion.listadoDireccion[index].nombreDireccionAlterno = '';
	                                    $scope.selectDireccion.nombreDireccionAlterno = '';
	                                    $scope.indexSeleccionarDireccion = -1;
	                                    $('#hideDireccion').show();
	                                    $('#focusEditaDireccion').hide();
	                                    estadoDireccion = true;
	                                }, 200);
	                                auditoriaResquest(WPSTablaOperaciones.cambioAliasFijo, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', '-', 'MOVIL', '5', $scope.tipoLinea, '-', 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                $('#msgErrorDireccion').show();
	                            }
	                            $('#direccion').removeClass('disabled');
	                            estadoDireccion = true;
	                        }, function(response) {
	                            $('#editaDireccion').addClass('open');
	                            $scope.editaDireccionNumero = 'input';
	                            $scope.classDireccion = 'editfull';
	                            $scope.selectDireccion.nombreAlias = $scope.selectDireccion.nombreDireccion;
	                            $scope.listaDireccion.listadoDireccion[index].nombreAlias = $scope.selectDireccion.nombreDireccion;
	                            $scope.listaDireccion.listadoDireccion[index].txtEditar = 'editar';
	                            $scope.listaDireccion.listadoDireccion[index].nombreDireccionAlterno = '';
	                            $scope.selectDireccion.nombreDireccionAlterno = '';
	                            $scope.indexSeleccionarDireccion = -1;
	                            $("#direccion").html("editar");
	                            $('#hideDireccion').hide();
	                            $('#focusEditaDireccion').show();
	                            estadoDireccion = true;


	                        });
	                    } else {

	                        $("#direccion").addClass('red');
	                        $("#ocultarDireccion").css("float", "left");
	                        $("#focusEditaDireccion").css("float", "left");
	                        $("#focusEditaDireccion").show();
	                        $('#hideDireccion').hide();
	                        $("#focusEditaDireccion input").focus();
	                        $('#focusEditaDireccion input').select();
	                        setTimeout(function() { $('#focusEditaDireccion input').select(); }, 0);
	                        estadoDireccion = true;
	                    }
	                    $('#loaderDireccion').hide();
	                } else if (estado == 'reestablecer') {
	                    $('#loaderDireccion').show();
	                    var index = arrayObjectIndexOf($scope.listaDireccion.listadoDireccion, $scope.selectDireccion.nombreAlias);
	                    var datos = {
	                        tipoOperacion: '2',
	                        idAfectado: $scope.listaDireccion.listadoDireccion[index].idDireccion,
	                        tipoAlias: '4',
	                        idCuenta: '',
	                        idDireccion: '',
	                        descripcionAlias: ''
	                    };

	                    datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                    TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {

	                        if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                            $scope.selectDireccion.nombreAlias = $scope.selectDireccion.nombreDireccion;
	                            $scope.listaDireccion.listadoDireccion[index].nombreAlias = $scope.selectDireccion.nombreDireccion;
	                            $scope.listaDireccion.listadoDireccion[index].txtEditar = 'editar';
	                            document.getElementById('direccion').innerHTML = "editar";
	                            $scope.listaDireccion.listadoDireccion[index].nombreDireccionAlterno = '';
	                            $scope.selectDireccion.nombreDireccionAlterno = '';
	                            $scope.indexSeleccionarDireccion = -1;
	                            auditoriaResquest(WPSTablaOperaciones.cambioAliasFijo, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', '-', 'MOVIL', '5', $scope.tipoLinea, '-', '-');
	                        } else {
	                            auditoriaResquest(WPSTablaOperaciones.cambioAliasFijo, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', '-', 'MOVIL', '5', $scope.tipoLinea, '-', 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                        }
	                        estadoDireccion = true;
	                    }, function(error) {

	                    });
	                    $('#loaderDireccion').hide();
	                } else {
	                    $scope.indexSeleccionarDireccion = arrayObjectIndexOf($scope.listaDireccion.listadoDireccion, $scope.selectDireccion.nombreAlias);
	                    $scope.txtDireccion = '';
	                    $("#focusEditaDireccion input").val('');
	                    $("#ocultarDireccion").css("float", "left");
	                    $("#focusEditaDireccion").css("float", "left");
	                    $("#focusEditaDireccion").show();
	                    $("#direccion").addClass('editpull red');
	                    $("#direccion").html("guardar");
	                    $('#hideDireccion').hide();
	                    $("#focusEditaDireccion input").focus();
	                    $('#focusEditaDireccion input').select();
	                    setTimeout(function() { $('#focusEditaDireccion input').select(); }, 0);
	                    estadoDireccion = true;
	                }
	            }
	        };



	        $scope.editarCuenta = function() {
	            if ($scope.focousAutoCompleteLinea) {
	                var estado = document.getElementById('Cuenta').text;
	                $('#Cuenta').removeClass('red');
	                $("#wpsCuenta").removeAttr("style");

	                var servicio = $scope.selectCuenta.nombreCuenta;
	                if (estado == 'guardar') {
	                    $("#loaderCuenta").show();
	                    var index = arrayObjectIndexOf($scope.listaCuenta.listadoCuenta, $scope.selectCuenta.nombreAlias);
	                    if (validarCuenta($scope.txtCuenta)) {
	                        $timeout(function() {
	                            var datos = {
	                                tipoOperacion: '1',
	                                idAfectado: $scope.selectCuenta.idCuenta,
	                                tipoAlias: '2',
	                                idCuenta: $scope.selectCuenta.idCuenta,
	                                idDireccion: '',
	                                descripcionAlias: $scope.txtCuenta
	                            };
	                            datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                            TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                                $scope.estadoAlias = response.data;
	                                if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                    $("#editaCuenta").addClass('');
	                                    $("#editaCuentaNumero").addClass('input');
	                                    $('#editaCuentaNumero').hide();
	                                    $("#hideCuenta").show();
	                                    $scope.selectCuenta.nombreAlias = $scope.txtCuenta;
	                                    $scope.listaCuenta.listadoCuenta[index].nombreAlias = $scope.txtCuenta;
	                                    $scope.listaCuenta.listadoCuenta[index].txtAccion = 'reestablecer';
	                                    $scope.selectCuenta.txtAccion = 'reestablecer';
	                                    $("#Cuenta").html("reestablecer");
	                                    $scope.listaCuenta.listadoCuenta[index].nombreCuentaAlterno = $scope.listaCuenta.listadoCuenta[index].nombreCuenta;
	                                    $scope.selectCuenta.nombreCuentaAlterno = $scope.listaCuenta.listadoCuenta[index].nombreCuenta;
	                                    $("#frEditCuenta").removeClass('edit');
	                                    $scope.indexSeleccionarCuenta = -1;
	                                    $("#msgErrorPhone").hide();
	                                    $("#loaderCuenta").hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasCuenta, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicio, 'MOVIL', $scope.tipoLinea, '2', '-');
	                                } else if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 6) {
	                                    $("#frEditCuenta").removeClass('edit');
	                                    $scope.selectCuenta.nombreAlias = $scope.selectCuenta.nombreCuenta;
	                                    $scope.lista
	                                    Cuenta.listadoCuenta[index].nombreAlias = $scope.selectCuenta.nombreCuenta;
	                                    $scope.listaCuenta.listadoCuenta[index].nombreCuentaAlterno = '';
	                                    $scope.selectCuenta.nombreCuentaAlterno = '';
	                                    $scope.selectCuenta.txtAccion = 'editar';
	                                    $scope.listaCuenta.listadoCuenta[index].txtAccion = 'editar';
	                                    $("#Cuenta").html("editar");
	                                    $scope.indexSeleccionarCuenta = -1;
	                                    $("#hideCuenta").show();
	                                    $('#editaCuentaNumero').hide();
	                                    $("#msgErrorPhone").show();
	                                    $("#loaderCuenta").hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasCuenta, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicio, 'MOVIL', '5', $scope.tipoLinea, '-', 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                } else {
	                                    $("#editaCuenta").addClass('');
	                                    $("#editaCuentaNumero").addClass('input');
	                                    $scope.selectCuenta.nombreAlias = $scope.selectCuenta.nombreCuenta;
	                                    $scope.listaCuenta.listadoCuenta[index].nombreAlias = $scope.selectCuenta.nombreCuenta;
	                                    $scope.listaCuenta.listadoCuenta[index].nombreCuentaAlterno = '';
	                                    $scope.selectCuenta.nombreCuentaAlterno = '';
	                                    $scope.selectCuenta.txtAccion = 'editar';
	                                    $scope.listaCuenta.listadoCuenta[index].txtAccion = 'editar';
	                                    $("#Cuenta").html("editar");
	                                    $scope.indexSeleccionarCuenta = -1;
	                                    $("#hideCuenta").show();
	                                    $('#editaCuentaNumero').hide();
	                                    $("#loaderCuenta").hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasCuenta, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicio, 'MOVIL', '5', $scope.tipoLinea, '-', 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                }
	                            }, function(response) {
	                                $("#editaCuenta").addClass('');
	                                $("#editaCuentaNumero").addClass('input');
	                                $scope.classCuenta = 'editfull';
	                                $scope.selectCuenta.nombreAlias = $scope.selectCuenta.nombreCuenta;
	                                $scope.listaCuenta.listadoCuenta[index].nombreAlias = $scope.selectCuenta.nombreCuenta;
	                                $scope.listaCuenta.listadoCuenta[index].nombreCuentaAlterno = '';
	                                $scope.selectCuenta.nombreCuentaAlterno = '';
	                                $scope.selectCuenta.txtAccion = 'editar';
	                                $scope.listaCuenta.listadoCuenta[index].txtAccion = 'editar';
	                                $("#Cuenta").html("editar");
	                                $scope.indexSeleccionarCuenta = -1;
	                                $("#hideCuenta").show();
	                                $('#editaCuentaNumero').hide();
	                                $("#loaderCuenta").hide();

	                            });

	                        }, 200);

	                    } else {
	                        $("#hideCuenta").hide();
	                        $('#editaCuentaNumero').show();
	                        $('#frEditCuenta').addClass('open edit');
	                        $('#Cuenta').addClass('editfull red');
	                        $("#loaderCuenta").hide();
	                        $("#idEditaCuentaNumero").addClass("editfull red").focus();
	                        $("#idEditaCuentaNumero").addClass("input text focus error").focus();
	                        $("#editaCuentaNumero input").focus();
	                        $('#editaCuentaNumero input').select();
	                        setTimeout(function() { $('#editaCuentaNumero input').select(); }, 0);
	                    }

	                } else if (estado == 'reestablecer') {
	                    $("#loaderCuenta").show();
	                    $timeout(function() {
	                        var index = arrayObjectIndexOf($scope.listaCuenta.listadoCuenta, $scope.selectCuenta.nombreAlias);

	                        var datos = {
	                            tipoOperacion: '2',
	                            idAfectado: $scope.selectCuenta.idCuenta,
	                            tipoAlias: '2',
	                            idCuenta: $scope.selectCuenta.idCuenta,
	                            idDireccion: '',
	                            descripcionAlias: ''
	                        };
	                        datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                        TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                            $scope.estadoAlias = response.data;
	                            if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                $scope.selectCuenta.nombreAlias = $scope.selectCuenta.nombreCuenta;
	                                $scope.listaCuenta.listadoCuenta[index].nombreAlias = $scope.selectCuenta.nombreCuenta;
	                                $scope.listaCuenta.listadoCuenta[index].nombreCuentaAlterno = '';
	                                $scope.selectCuenta.nombreCuentaAlterno = '';
	                                $scope.selectCuenta.txtAccion = 'editar';
	                                $scope.listaCuenta.listadoCuenta[index].txtAccion = 'editar';
	                                $("#Cuenta").html("editar");
	                                $scope.indexSeleccionarCuenta = -1;
	                                $("#loaderCuenta").hide();
	                                auditoriaResquest(WPSTablaOperaciones.cambioAliasCuenta, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicio, 'MOVIL', '5', $scope.tipoLinea, '-', '-');
	                            } else {
	                                $("#loaderCuenta").hide();
	                                auditoriaResquest(WPSTablaOperaciones.cambioAliasCuenta, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicio, 'MOVIL', '5', $scope.tipoLinea, '-', 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                            }
	                        }, function(response) {
	                            $("#loaderCuenta").hide();


	                        });

	                    }, 200);
	                } else {
	                    $scope.indexSeleccionarCuenta = arrayObjectIndexOf($scope.listaCuenta.listadoCuenta, $scope.selectCuenta.nombreAlias);
	                    $("#editaCuentaNumero").css("float", "left");
	                    $("#wpsCuenta").css("float", "left");
	                    $('#hideCuenta').hide();
	                    $("#editaCuentaNumero").show();
	                    $("#frEditCuenta").addClass('open edit');
	                    $scope.txtCuenta = '';
	                    $("#Cuenta").addClass('editpull red');
	                    $("#Cuenta").html("guardar");

	                    $("#editaCuentaNumero input").focus();
	                    $('#editaCuentaNumero input').select();
	                    setTimeout(function() { $('#editaCuentaNumero input').select(); }, 0);

	                }

	            } else {
	                document.getElementById("AutocompleteLinea").focus();
	                $scope.estadoBusquedaAutoCompleteLinea = 1;
	            }
	        };

	        $scope.editarRecibo = function() {
	            if ($scope.focousAutoCompleteLinea) {
	                var estado = document.getElementById('Recibo').text;
	                $("#ocultarRecibo").removeAttr("style");
	                $("#Recibo").removeClass("red");
	                var servicio = $scope.selectRecibo.nombreRecibo;
	                if (estado == 'guardar') {
	                    $("#loaderRecibo").show();
	                    var index = arrayObjectIndexOf($scope.listaRecibo.listadoRecibo, $scope.selectRecibo.nombreAlias);
	                    if (validaRecibo($scope.txtRecibo)) {
	                        $timeout(function() {
	                            var datos = {
	                                tipoOperacion: '1',
	                                idAfectado: $scope.selectRecibo.idRecibo,
	                                tipoAlias: '3',
	                                idCuenta: '',
	                                idDireccion: '',
	                                descripcionAlias: $scope.txtRecibo
	                            };
	                            datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                            TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                                $scope.estadoAlias = response.data;
	                                if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                    $('#editaRecibo').removeClass('edit');
	                                    $('#hideRecibo').show();
	                                    $('#editaReciboNumero').hide();
	                                    $scope.selectRecibo.nombreAlias = $scope.txtRecibo;
	                                    $scope.listaRecibo.listadoRecibo[index].nombreAlias = $scope.txtRecibo;
	                                    $scope.listaRecibo.listadoRecibo[index].txtAccion = 'reestablecer';
	                                    $scope.selectRecibo.txtAccion = 'reestablecer';
	                                    $("#Recibo").html("reestablecer");
	                                    $scope.listaRecibo.listadoRecibo[index].nombreCuentaAlterno = $scope.listaRecibo.listadoRecibo[index].nombreRecibo;
	                                    $scope.selectRecibo.nombreReciboAlterno = $scope.listaRecibo.listadoRecibo[index].nombreRecibo;
	                                    $scope.indexSeleccionarRecibo = -1;
	                                    $("#msgErrorPhone").hide();
	                                    $("#loaderRecibo").hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasRecibo, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicio, 'MOVIL', '5', $scope.tipoLinea, '-', '-');
	                                } else if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 6) {
	                                    $('#editaRecibo').removeClass('edit');
	                                    $scope.selectRecibo.nombreAlias = $scope.selectRecibo.nombreRecibo;
	                                    $scope.listaRecibo.listadoRecibo[index].nombreCuentaAlterno = '';
	                                    $scope.selectRecibo.nombreReciboAlterno = '';
	                                    $scope.listaRecibo.listadoRecibo[index].nombreAlias = $scope.selectRecibo.nombreRecibo;
	                                    $scope.listaRecibo.listadoRecibo[index].txtAccion = 'editar';
	                                    $scope.selectRecibo.txtAccion = 'editar';
	                                    $("#Recibo").html("editar");
	                                    $('#hideRecibo').show();
	                                    $('#editaReciboNumero').hide();
	                                    $scope.indexSeleccionarRecibo = -1;
	                                    $("#msgErrorPhone").show();
	                                    $("#loaderRecibo").hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasRecibo, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicio, 'MOVIL', '5', $scope.tipoLinea, '-', 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                } else {
	                                    $('#editaRecibo').removeClass('edit');
	                                    $scope.selectRecibo.nombreAlias = $scope.selectRecibo.nombreRecibo;
	                                    $scope.listaRecibo.listadoRecibo[index].nombreCuentaAlterno = '';
	                                    $scope.selectRecibo.nombreReciboAlterno = '';
	                                    $scope.listaRecibo.listadoRecibo[index].nombreAlias = $scope.selectRecibo.nombreRecibo;
	                                    $scope.listaRecibo.listadoRecibo[index].txtAccion = 'editar';
	                                    $scope.selectRecibo.txtAccion = 'editar';
	                                    $("#Recibo").html("editar");
	                                    $('#hideRecibo').show();
	                                    $('#editaReciboNumero').hide();
	                                    $scope.indexSeleccionarRecibo = -1;
	                                    $("#loaderRecibo").hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasRecibo, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicio, 'MOVIL', '5', $scope.tipoLinea, '-', 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                }
	                            }, function(response) {
	                                $('#editaRecibo').removeClass('edit');
	                                $scope.selectRecibo.nombreAlias = $scope.selectRecibo.nombreRecibo;
	                                $scope.listaRecibo.listadoRecibo[index].nombreCuentaAlterno = '';
	                                $scope.selectRecibo.nombreReciboAlterno = '';
	                                $scope.listaRecibo.listadoRecibo[index].nombreAlias = $scope.selectRecibo.nombreRecibo;
	                                $scope.listaRecibo.listadoRecibo[index].txtAccion = 'editar';
	                                $scope.selectRecibo.txtAccion = 'editar';
	                                $("#Recibo").html("editar");
	                                $('#hideRecibo').show();
	                                $('#editaReciboNumero').hide();
	                                $scope.indexSeleccionarRecibo = -1;
	                                $("#loaderRecibo").hide();

	                            });
	                        }, 200);
	                    } else {
	                        $('#Recibo').addClass('editfull red');
	                        $('#editaReciboNumero').addClass('input focus');
	                        $('#hideRecibo').hide();
	                        $("#editaReciboNumero").show();
	                        $("#Recibo").html("guardar");
	                        $("#loaderRecibo").hide();
	                        $("#editaReciboNumero input").focus();
	                        $('#editaReciboNumero input').select();
	                        setTimeout(function() { $('#editaReciboNumero input').select(); }, 0);
	                        $scope.hideRecibo = true;


	                    }
	                } else if (estado == 'reestablecer') {
	                    $("#loaderRecibo").show();
	                    $timeout(function() {
	                        var index = arrayObjectIndexOf($scope.listaRecibo.listadoRecibo, $scope.selectRecibo.nombreAlias);
	                        var datos = {
	                            tipoOperacion: '2',
	                            idAfectado: $scope.selectRecibo.idRecibo,
	                            tipoAlias: '3',
	                            idCuenta: '',
	                            idDireccion: '',
	                            descripcionAlias: ''
	                        };
	                        datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                        TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                            $scope.estadoAlias = response.data;
	                            if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                $scope.selectRecibo.nombreAlias = $scope.selectRecibo.nombreRecibo;
	                                $scope.listaRecibo.listadoRecibo[index].nombreCuentaAlterno = '';
	                                $scope.selectRecibo.nombreReciboAlterno = '';
	                                $scope.listaRecibo.listadoRecibo[index].nombreAlias = $scope.selectRecibo.nombreRecibo;
	                                $scope.listaRecibo.listadoRecibo[index].txtAccion = 'editar';
	                                $scope.selectRecibo.txtAccion = 'editar';
	                                $scope.indexSeleccionarRecibo = -1;
	                                $("#Recibo").html("editar");
	                                $("#loaderRecibo").hide();
	                                auditoriaResquest(WPSTablaOperaciones.cambioAliasRecibo, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicio, 'MOVIL', '5', $scope.tipoLinea, '-', '-');
	                            } else {
	                                $("#loaderRecibo").hide();
	                                auditoriaResquest(WPSTablaOperaciones.cambioAliasRecibo, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicio, 'MOVIL', '5', $scope.tipoLinea, '-', 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                            }
	                        }, function(error) {

	                        });
	                    }, 200);

	                } else {

	                    $scope.indexSeleccionarRecibo = arrayObjectIndexOf($scope.listaRecibo.listadoRecibo, $scope.selectRecibo.nombreAlias);
	                    $('#hideRecibo').hide();
	                    $("#editaReciboNumero").show();
	                    $scope.txtRecibo = '';
	                    $("#ocultarRecibo").css("float", "left");
	                    $("#editaReciboNumero").css("float", "left");
	                    $('#frEditRecibo').addClass('open edit');
	                    $('#Recibo').addClass('editfull red');
	                    $('#editaReciboNumero').addClass('input focus');
	                    $("#Recibo").html("guardar");
	                    $("#editaReciboNumero input").focus();
	                    $('#editaReciboNumero input').select();
	                    setTimeout(function() { $('#editaReciboNumero input').select(); }, 0);
	                }

	            } else {
	                document.getElementById("AutocompleteLinea").focus();
	                $scope.estadoBusquedaAutoCompleteLinea = 1;
	            }
	        }

	        $scope.estadoMovil = function() {
	            $scope.activoMovil = 'tab-movil active';
	            $scope.activoFijo = 'tab-fijo';
	            $scope.tabMovil = 'tab active';
	            $scope.tabFijo = 'tab';
	        }

	        $scope.estadoFijo = function() {
	            $scope.activoMovil = 'tab-movil';
	            $scope.activoFijo = 'tab-fijo active';
	            $scope.tabMovil = 'tab';
	            $scope.tabFijo = 'tab active';
	        }
	        $scope.estadoBuscarLinea = -1;

	        $scope.buscarLinea = function() {
	            if ($('#AutocompleteLinea').val().length > 0) {
	                $scope.estadoBuscarLinea = 1;
	                $("#frBuscarLinea .search").removeClass("error");
	                var idCuenta = $scope.selectCuenta.idCuenta;
	                try {
	                    var idRecibo = $scope.selectRecibo.idRecibo;
	                } catch (e) {
	                    idRecibo = '';
	                }
	                if (idRecibo != '') {
	                    var datos = {
	                        idCuenta: idCuenta,
	                        idRecibo: idRecibo,
	                        nombre: $scope.txtBuscarLinea
	                    };
	                    var datos = {
	                        categoria: WPSCategoria.movil,
	                        tipoLinea: WPSTipoLinea.todos,
	                        tipoCliente: WPSTipoCliente.corporativo,
	                        idProductoServicio: '',
	                        tipoPermiso: "5",
	                        idCuenta: '',
	                        idRecibo: '',
	                        idDireccion: "",
	                        nombreProducto: $scope.txtBuscarLinea,
	                        pagina: WPSpaginacion.pagina,
	                        cantResultadosPagina: WPSpaginacion.cantResultadosPagina,
	                        productoPrincipalXidRecibo: "false",
	                        titularidadServicio: WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado
	                    };

	                    obtenerServicios(datos);
	                }
	            } else {
	                $("#frBuscarLinea .search").addClass("error");
	            }
	        }


	        $scope.buscarLineaPerfil = function() {
	            if ($('#AutocompletePerfil').val().length == 0) {
	                $("#frFilterLinea .search").addClass("error");
	            } else {
	                $("#frFilterLinea .search").removeClass("error");
	                $timeout(function() {
	                    $scope.SeleccionarLineasCorporativo = '';
	                    var datos = {
	                        idProductoServicio: '',
	                        nombreProducto: $scope.txtBuscarLineaPerfil,
	                        tipoCliente: WPSTipoCliente.corporativo,
	                        idCuenta: '',
	                        idRecibo: '',
	                        pagina: WPSpaginacion.pagina,
	                        cantResultadosPagina: WPSpaginacion.cantResultadosPagina,
	                    };

	                    obtenerServiciosPerfil(datos);
	                }, 200);
	            }
	        }

	        $scope.refreshPortlet = function(indicadorError) {
	            if (indicadorError == '1') {
	                inicioLineasPostpago();
	            } else if (indicadorError == '2') {
	                inicioLineasPrepago();
	            } else if (indicadorError == '3') {
	                iniciarCuenta();
	            } else if (indicadorError == '5') {
	                var datos = {
	                    categoria: WPSCategoria.movil,
	                    tipoLinea: WPSTipoLinea.todos,
	                    tipoCliente: WPSTipoCliente.corporativo,
	                    idProductoServicio: "",
	                    tipoPermiso: WPSTipoPermiso.todos,
	                    idCuenta: $scope.selectCuenta.idCuenta,
	                    idRecibo: $scope.selectRecibo.idRecibo,
	                    idDireccion: "",
	                    direccionCompleta: '',
	                    pagina: WPSpaginacion.pagina,
	                    cantResultadosPagina: WPSpaginacion.cantResultadosPagina,
	                    productoPrincipalXidRecibo: "false",
	                    titularidadServicio: WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado
	                };
	                obtenerServicios(datos);
	            } else if (indicadorError == '6') {
	                inicioLineasNoEmpleadoPostpago();
	            } else if (indicadorError == '7') {
	                inicioLineasNoEmpleadoPrepago();
	            } else if (indicadorError == '8') {
	                iniciarFija();
	            } else if (indicadorError == '9') {
	                $scope.changeDireccion($scope.selectDireccion.idDireccion);
	            } else if (indicadorError == '10') {
	                consumerObtenerMovilesAfiliados();
	            } else if (indicadorError == '11') {
	                listarAfiliadaCorporativo();
	            } else if (indicadorError == '12') {
	                obtenerCheckPermitirVincular();
	            } else if (indicadorError == '13') {
	                obtenerUsuariosVinculados();
	            } else if (indicadorError == '14') {
	                obtenerUsuariosQueMeVincularon();
	            } else if (indicadorError == '15') {
	                promocion();
	            } else if (indicadorError == '16') {

	                var href = '/wps/portal/cuentasclaro/tucuenta/root';
	                $(location).attr('href', href);
	            }


	        }

	        $scope.datosRestablecerPrepago = '';
	        $scope.txtRestablecerPrepago = '';
	        var idPrepago = -1;
	        $scope.keyPrepago = -1;
	        var accionPendiente = false;
	        $scope.editarPrepagoMovil = function(index, focus) {
	            restablecerPostpago();
	            var idEditar = "idEditarPrepago" + index;
	            var idText = "idClassPrepago" + index;
	            var acccion = $.trim($("#" + idText).text());
	            $scope.txtRestablecerPrepago = acccion;
	            $("#msgErrorPhoneNum").hide();
	            var estado = true;
	            if (acccion == 'reestablecer' && focus == '') {
	                if (!accionPendiente && idPrepago == -1) {
	                    accionPendiente = true;
	                    idPrepago = index;
	                    estado = false
	                } else if (!accionPendiente && idPrepago == index) {
	                    accionPendiente = true;
	                    idPrepago = index;
	                    estado = false;
	                } else if (accionPendiente && idPrepago == index) {
	                    accionPendiente = true;
	                    idPrepago = index;
	                } else if (accionPendiente && idPrepago != index) {
	                    accionPendiente = false;
	                    idPrepago = index;
	                    estado = false;
	                } else if (idPrepago != index) {
	                    restablecerPrepago($scope.keyPrepago);
	                    accionPendiente = false;
	                    idPrepago = index;
	                    estado = false;
	                }
	            } else if (acccion == 'guardar' && focus == '') {
	                accionPendiente = true;
	                estado = false
	            } else {
	                if (acccion == 'guardar') {
	                    accionPendiente = false;
	                    estado = false;
	                }
	            }
	            var servicioAuditoria = $scope.listaLineaPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombre;
	            var tipoLineaAuditoria = $scope.listaLineaPrepago.listadoProductosServicios[index].ProductoServicioResponse.tipoLinea;
	            var perfilAuditoria = $scope.listaLineaPrepago.listadoProductosServicios[index].ProductoServicioResponse.tipoPermiso;
	            if (estado) {
	                if (focus == 'f') {
	                    $scope.datosRestablecerPrepago = $scope.listaLineaPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias;
	                    $timeout(function() {
	                        if (parseInt(idPrepago) >= 0) {
	                            var idEditarAnt = "idEditarPrepago" + idPrepago;
	                            var idTextAnt = "idClassPrepago" + idPrepago;
	                            $("#" + idEditarAnt).addClass("input text").removeClass("focus error");
	                            $("#" + idTextAnt).addClass("editfield").removeClass("red");
	                            var datosRestablecerPrepago = '';
	                            var txtRestablecerPrepago = '';
	                            if ($scope.listaLineaPrepago.listadoProductosServicios[parseInt(idPrepago)].ProductoServicioResponse.alias == '') {
	                                datosRestablecerPrepago = $scope.listaLineaPrepago.listadoProductosServicios[parseInt(idPrepago)].ProductoServicioResponse.nombre;
	                                txtRestablecerPrepago = 'editar';
	                            } else {
	                                datosRestablecerPrepago = $scope.listaLineaPrepago.listadoProductosServicios[parseInt(idPrepago)].ProductoServicioResponse.alias;
	                                txtRestablecerPrepago = 'reestablecer';
	                            }
	                            $scope.listaLineaPrepago.listadoProductosServicios[parseInt(idPrepago)].ProductoServicioResponse.nombreAlias = datosRestablecerPrepago;
	                            $scope.listaLineaPrepago.listadoProductosServicios[parseInt(idPrepago)].ProductoServicioResponse.txtAccion = txtRestablecerPrepago;
	                            $("#" + idTextAnt).html(txtRestablecerPrepago);
	                        }
	                        $("#" + idText).html("guardar");
	                        $("#" + idEditar).addClass("input text focus").focus();
	                        $("#" + idEditar + " input").val("").focus();
	                        $("#" + idText).addClass("editfield red");
	                        $scope.keyPrepago = index;
	                        idPrepago = index;
	                        accionPendiente = false;
	                        $scope.listaLineaPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias = '';
	                        $scope.listaLineaPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                    }, 200);
	                } else {
	                    $scope.datosRestablecerPrepago = $scope.listaLineaPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias;
	                    if (parseInt(idPrepago) >= 0) {
	                        var idEditarAnt = "idEditarPrepago" + idPrepago;
	                        var idTextAnt = "idClassPrepago" + idPrepago;
	                        $("#" + idEditarAnt).addClass("input text").removeClass("focus error");
	                        $("#" + idTextAnt).addClass("editfield").removeClass("red");
	                        var datosRestablecerPrepago = '';
	                        var txtRestablecerPrepago = '';
	                        if ($scope.listaLineaPrepago.listadoProductosServicios[parseInt(idPrepago)].ProductoServicioResponse.alias == '') {
	                            datosRestablecerPrepago = $scope.listaLineaPrepago.listadoProductosServicios[parseInt(idPrepago)].ProductoServicioResponse.nombre;
	                            txtRestablecerPrepago = 'editar';
	                        } else {
	                            datosRestablecerPrepago = $scope.listaLineaPrepago.listadoProductosServicios[parseInt(idPrepago)].ProductoServicioResponse.alias;
	                            txtRestablecerPrepago = 'reestablecer';
	                        }
	                        $scope.listaLineaPrepago.listadoProductosServicios[parseInt(idPrepago)].ProductoServicioResponse.nombreAlias = datosRestablecerPrepago;
	                        $scope.listaLineaPrepago.listadoProductosServicios[parseInt(idPrepago)].ProductoServicioResponse.txtAccion = txtRestablecerPrepago;
	                        $("#" + idTextAnt).html(txtRestablecerPrepago);
	                    }
	                    $("#" + idText).html("guardar");
	                    $("#" + idEditar).addClass("input text focus").focus();
	                    $("#" + idEditar + " input").val("").focus();
	                    $("#" + idText).addClass("editfield red");
	                    $scope.keyPrepago = index;
	                    idPrepago = index;
	                    accionPendiente = false;
	                    $scope.listaLineaPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias = '';
	                    $scope.listaLineaPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                }
	            }
	            if (accionPendiente) {
	                if (idPrepago == index) {
	                    if (acccion == 'guardar') {
	                        $timeout(function() {
	                            if ($scope.listaLineaPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias == '') {
	                                $timeout(function() {
	                                    $("#" + idText).html("guardar");
	                                    $("#" + idEditar).addClass("input text focus error").focus();
	                                    $("#" + idEditar + " input").val("").focus();
	                                    $("#" + idText).addClass("editfield red");
	                                    $scope.keyPrepago = index;
	                                    idPrepago = index;
	                                    accionPendiente = true;
	                                    $scope.listaLineaPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias = '';
	                                    $scope.listaLineaPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                                }, 200);
	                            } else if (validarAlias($scope.listaLineaPrepago.listadoProductosServicios, $scope.listaLineaPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.nombreAlias, index)) {
	                                var datos = {
	                                    tipoOperacion: '1',
	                                    idAfectado: $scope.listaLineaPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.idProductoServicio,
	                                    tipoAlias: '1',
	                                    idCuenta: '',
	                                    idDireccion: '',
	                                    descripcionAlias: $scope.listaLineaPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.nombreAlias
	                                };

	                                $("#idEditarPrepagoLoader" + index).show();
	                                datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                                TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                                    $scope.estadoAlias = response.data;
	                                    if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                        $("#" + idText).html("reestablecer");
	                                        $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                        $("#" + idText).addClass("editfield").removeClass("red");
	                                        $scope.listaLineaPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.txtAccion = 'reestablecer';
	                                        $scope.listaLineaPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.alias = $scope.listaLineaPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias;
	                                        $scope.keyPrepago = -1;
	                                        idPrepago = -1;
	                                        $scope.listaLineaPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '1';
	                                        accionPendiente = false;
	                                        $("#idEditarPrepagoLoader" + index).hide();
	                                        auditoriaResquest(WPSTablaOperaciones.consultarAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, '-');
	                                    } else if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 6) {
	                                        restablecerPrepago($scope.keyPrepago);
	                                        $("#msgErrorPhoneNum").show();
	                                        $("#idEditarPrepagoLoader" + index).hide();
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                    } else {
	                                        restablecerPrepago($scope.keyPrepago);
	                                        $("#idEditarPrepagoLoader" + index).hide();
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                    }
	                                }, function(response) {
	                                    restablecerPrepago($scope.keyPrepago);
	                                    $("#idEditarPrepagoLoader" + index).hide();

	                                });
	                            } else {
	                                $timeout(function() {

	                                    restablecerPrepago($scope.keyPrepago);
	                                    $("#msgErrorPhoneNum").show();
	                                    $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                    $("#" + idText).addClass("editfield").removeClass("red");
	                                    $scope.keyPrepago = -1;
	                                    idPrepago = -1;
	                                    accionPendiente = false;
	                                }, 200);

	                            }

	                        }, 200);
	                    } else if (acccion == 'reestablecer') {

	                        $timeout(function() {


	                            var datos = {
	                                tipoOperacion: '2',
	                                idAfectado: $scope.listaLineaPrepago.listadoProductosServicios[index].ProductoServicioResponse.idProductoServicio,
	                                tipoAlias: '1',
	                                idCuenta: '',
	                                idDireccion: '',
	                                descripcionAlias: ''
	                            };
	                            datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                            TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                                $scope.estadoAlias = response.data;
	                                if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                    $scope.keyPrepago = -1;
	                                    idPrepago = -1;
	                                    $scope.listaLineaPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias = $scope.listaLineaPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombre;
	                                    $scope.listaLineaPrepago.listadoProductosServicios[index].ProductoServicioResponse.alias = '';
	                                    $scope.listaLineaPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.txtAccion = 'editar';
	                                    $("#" + idText).html("editar");
	                                    $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                    $("#" + idText).addClass("editfield").removeClass("red");
	                                    $scope.listaLineaPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '1';
	                                    accionPendiente = false;
	                                    $("#idEditarPrepagoLoader" + index).hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, '-');
	                                } else {
	                                    restablecerPrepago($scope.keyPrepago);
	                                    $("#idEditarPrepagoLoader" + index).hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                    $("#idEditarPrepagoLoader" + index).hide();
	                                    accionPendiente = false;
	                                }
	                            }, function(response) {
	                                restablecerPrepago($scope.keyPrepago);
	                                $("#idEditarPrepagoLoader" + index).hide();


	                            });
	                        }, 200);
	                    }
	                }
	            }
	        }

	        function restablecerPrepago(keyPrepago) {
	            $scope.keyPrepago = keyPrepago;
	            if (parseInt($scope.keyPrepago) >= 0) {
	                var idEditarPrepago = "idEditarPrepago" + $scope.keyPrepago;
	                var idTextPrepago = "idClassPrepago" + $scope.keyPrepago;
	                if ($scope.txtRestablecerPrepago == 'guardar') {
	                    $scope.txtRestablecerPrepago = 'editar';
	                }
	                if ($scope.listaLineaPrepago.listadoProductosServicios[parseInt($scope.keyPrepago)].ProductoServicioResponse.alias == '') {
	                    $scope.txtRestablecerPrepago = 'editar';
	                } else {
	                    $scope.txtRestablecerPrepago = 'reestablecer';
	                }
	                if ($scope.datosRestablecerPrepago == '' || typeof $scope.datosRestablecerPrepago == 'undefined') {
	                    if ($scope.listaLineaPrepago.listadoProductosServicios[parseInt($scope.keyPrepago)].ProductoServicioResponse.alias == '') {
	                        $scope.datosRestablecerPrepago = $scope.listaLineaPrepago.listadoProductosServicios[parseInt($scope.keyPrepago)].ProductoServicioResponse.nombre;
	                        $scope.txtRestablecerPrepago = 'editar';
	                    } else {
	                        $scope.datosRestablecerPrepago = $scope.listaLineaPrepago.listadoProductosServicios[parseInt($scope.keyPrepago)].ProductoServicioResponse.alias;
	                        $scope.txtRestablecerPrepago = 'reestablecer';
	                    }
	                }
	                $("#" + idEditarPrepago).addClass("input text").removeClass("focus error");
	                $("#" + idTextPrepago).addClass("editfield").removeClass("red");
	                $("#" + idEditarPrepago + " input").val($scope.datosRestablecerPrepago);
	                $("#" + idTextPrepago).html($scope.txtRestablecerPrepago);
	                $scope.listaLineaPrepago.listadoProductosServicios[parseInt($scope.keyPrepago)].ProductoServicioResponse.nombreAlias = $scope.datosRestablecerPrepago;
	                $scope.listaLineaPrepago.listadoProductosServicios[parseInt($scope.keyPrepago)].ProductoServicioResponse.txtAccion = $scope.txtRestablecerPrepago;
	                $scope.keyPrepago = -1;
	                accionPendiente = false;
	            }
	        }


	        $scope.datosRestablecerPostpago = '';
	        $scope.txtRestablecerPostpago = '';
	        var idPostpago = -1;
	        var cantidadFocus = 0;

	        $scope.editarPostpagoMovil = function(index, focus) {
	            restablecerPrepago($scope.keyPrepago);
	            var idEditar = "idEditarPostpago" + index;
	            var idText = "idClassPostpago" + index;
	            var acccion = $.trim($("#" + idText).text());

	            $scope.txtRestablecerPostpago = acccion;
	            $("#msgErrorPhoneNum").hide();
	            var estado = true;
	            if (acccion == 'reestablecer' && focus == '') {
	                if (!accionPendiente && idPostpago == -1) {
	                    accionPendiente = true;
	                    idPostpago = index;
	                    estado = false;
	                } else if (!accionPendiente && idPostpago == index) {
	                    accionPendiente = true;
	                    idPostpago = index;
	                    estado = false;
	                } else if (accionPendiente && idPostpago == index) {
	                    accionPendiente = true;
	                    idPostpago = index;
	                } else if (accionPendiente && idPostpago != index) {
	                    accionPendiente = false;
	                    idPostpago = index;
	                    estado = false;
	                } else if (idPostpago != index) {
	                    restablecerPostpago();
	                    accionPendiente = false;
	                    idPostpago = index;
	                    estado = false;
	                }
	            } else if (acccion == 'guardar' && focus == '') {
	                accionPendiente = true;
	                estado = false;
	            } else {
	                if (acccion == 'guardar') {
	                    accionPendiente = false;
	                    estado = false;
	                }
	            }

	            var servicioAuditoria = $scope.listadoLineasPostpago.listadoProductosServicios[index].ProductoServicioResponse.nombre;
	            var tipoLineaAuditoria = $scope.listadoLineasPostpago.listadoProductosServicios[index].ProductoServicioResponse.tipoLinea;
	            var perfilAuditoria = $scope.listadoLineasPostpago.listadoProductosServicios[index].ProductoServicioResponse.tipoPermiso;
	            if (estado) {
	                if (focus == 'f') {
	                    $scope.datosRestablecerPostpago = $scope.listadoLineasPostpago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias;
	                    $timeout(function() {
	                        if (parseInt(idPostpago) >= 0) {
	                            var idEditarAnt = "idEditarPostpago" + idPostpago;
	                            var idTextAnt = "idClassPostpago" + idPostpago;
	                            $("#" + idEditarAnt).addClass("input text").removeClass("focus error");
	                            $("#" + idTextAnt).addClass("editfield").removeClass("red");
	                            var datosRestablecerPostpago = '';
	                            var txtRestablecerPostpago = '';
	                            if ($scope.listadoLineasPostpago.listadoProductosServicios[parseInt(idPostpago)].ProductoServicioResponse.alias == '') {
	                                datosRestablecerPostpago = $scope.listadoLineasPostpago.listadoProductosServicios[parseInt(idPostpago)].ProductoServicioResponse.nombre;
	                                txtRestablecerPostpago = 'editar';
	                            } else {
	                                datosRestablecerPostpago = $scope.listadoLineasPostpago.listadoProductosServicios[parseInt(idPostpago)].ProductoServicioResponse.alias;
	                                txtRestablecerPostpago = 'reestablecer';
	                            }
	                            $scope.listadoLineasPostpago.listadoProductosServicios[parseInt(idPostpago)].ProductoServicioResponse.nombreAlias = datosRestablecerPostpago;
	                            $scope.listadoLineasPostpago.listadoProductosServicios[parseInt(idPostpago)].ProductoServicioResponse.txtAccion = txtRestablecerPostpago;
	                            $("#" + idTextAnt).html(txtRestablecerPostpago);
	                        }
	                        $("#" + idText).html("guardar");
	                        $("#" + idEditar).addClass("input text focus").focus();
	                        $("#" + idEditar + " input").val("").focus();
	                        $("#" + idText).addClass("editfield red");
	                        $scope.keyPostpago = index;
	                        idPostpago = index;
	                        accionPendiente = false;
	                        $scope.listadoLineasPostpago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias = '';
	                    }, 200);
	                } else {
	                    $scope.datosRestablecerPostpago = $scope.listadoLineasPostpago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias;

	                    if (parseInt(idPostpago) >= 0) {
	                        var idEditarAnt = "idEditarPostpago" + idPostpago;
	                        var idTextAnt = "idClassPostpago" + idPostpago;
	                        $("#" + idEditarAnt).addClass("input text").removeClass("focus");
	                        $("#" + idTextAnt).addClass("editfield").removeClass("red");
	                        var datosRestablecerPostpago = '';
	                        var txtRestablecerPostpago = '';
	                        if ($scope.listadoLineasPostpago.listadoProductosServicios[parseInt(idPostpago)].ProductoServicioResponse.alias == '') {
	                            datosRestablecerPostpago = $scope.listadoLineasPostpago.listadoProductosServicios[parseInt(idPostpago)].ProductoServicioResponse.nombre;
	                            txtRestablecerPostpago = 'editar';
	                        } else {
	                            datosRestablecerPostpago = $scope.listadoLineasPostpago.listadoProductosServicios[parseInt(idPostpago)].ProductoServicioResponse.alias;
	                            txtRestablecerPostpago = 'reestablecer';
	                        }
	                        $scope.listadoLineasPostpago.listadoProductosServicios[parseInt(idPostpago)].ProductoServicioResponse.nombreAlias = datosRestablecerPostpago;
	                        $scope.listadoLineasPostpago.listadoProductosServicios[parseInt(idPostpago)].ProductoServicioResponse.txtAccion = txtRestablecerPostpago;
	                        $("#" + idTextAnt).html(txtRestablecerPostpago);

	                    }
	                    $("#" + idText).html("guardar");
	                    $("#" + idEditar).addClass("input text focus").focus();
	                    $("#" + idEditar + " input").val("").focus();
	                    $("#" + idText).addClass("editfield red");
	                    $scope.keyPostpago = index;
	                    idPostpago = index;
	                    accionPendiente = false;
	                    $scope.listadoLineasPostpago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias = '';
	                }
	            }
	            if (accionPendiente) {
	                if (idPostpago == index) {
	                    if (acccion == 'guardar') {
	                        $timeout(function() {
	                            if ($scope.listadoLineasPostpago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias == '') {
	                                $timeout(function() {
	                                    $("#" + idText).html("guardar");
	                                    $("#" + idEditar).addClass("input text focus error").focus();
	                                    $("#" + idEditar + " input").val("").focus();
	                                    $("#" + idText).addClass("editfield red");
	                                    $scope.keyPostpago = index;
	                                    idPostpago = index;
	                                    accionPendiente = true;
	                                    estado = false;
	                                    $scope.listadoLineasPostpago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias = '';
	                                }, 200);
	                            } else if (validarAlias($scope.listadoLineasPostpago.listadoProductosServicios, $scope.listadoLineasPostpago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.nombreAlias, index)) {
	                                var datos = {
	                                    tipoOperacion: '1',
	                                    idAfectado: $scope.listadoLineasPostpago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.idProductoServicio,
	                                    tipoAlias: '1',
	                                    idCuenta: '',
	                                    idDireccion: '',
	                                    descripcionAlias: $scope.listadoLineasPostpago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.nombreAlias
	                                };
	                                $("#idEditarPostpagoLoader" + index).show();
	                                var tipoPermiso = $scope.listadoLineasPostpago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.tipoPermiso;
	                                datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                                TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                                    $scope.estadoAlias = response.data;
	                                    if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                        $("#" + idText).html("reestablecer");
	                                        $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                        $("#" + idText).addClass("editfield").removeClass("red");
	                                        $scope.listadoLineasPostpago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.txtAccion = 'reestablecer';
	                                        $scope.listadoLineasPostpago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.alias = $scope.listadoLineasPostpago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias;
	                                        $scope.keyPostpago = -1;
	                                        idPostpago = -1;
	                                        $("#idEditarPostpagoLoader" + index).hide();
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, '-');
	                                    } else if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 6) {
	                                        restablecerPostpago();
	                                        $("#msgErrorPhoneNum").show();
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                        $("#idEditarPostpagoLoader" + index).hide();
	                                    } else {
	                                        restablecerPostpago();
	                                        $("#idEditarPostpagoLoader" + index).hide();
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                        estado = false;
	                                    }
	                                }, function(response) {
	                                    restablecerPostpago();
	                                    $("#idEditarPostpagoLoader" + index).hide();

	                                });
	                            } else {
	                                restablecerPostpago();
	                                $("#msgErrorPhoneNum").show();
	                                $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                $("#" + idText).addClass("editfield").removeClass("red");
	                                $scope.keyPostpago = -1;
	                                idPostpago = -1;
	                                accionPendiente = true;
	                            }
	                        }, 200);
	                    } else if (acccion == 'reestablecer') {
	                        $timeout(function() {
	                            $scope.datosRestablecerPostpago = $scope.listadoLineasPostpago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias;
	                            var datos = {
	                                tipoOperacion: '2',
	                                idAfectado: $scope.listadoLineasPostpago.listadoProductosServicios[index].ProductoServicioResponse.idProductoServicio,
	                                tipoAlias: '1',
	                                idCuenta: '',
	                                idDireccion: '',
	                                descripcionAlias: ''
	                            };
	                            $("#idEditarPostpagoLoader" + index).show();
	                            var tipoPermiso = $scope.listadoLineasPostpago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.tipoPermiso;
	                            datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                            TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                                if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                    $scope.keyPostpago = -1;
	                                    idPostpago = -1;
	                                    $scope.listadoLineasPostpago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias = $scope.listadoLineasPostpago.listadoProductosServicios[index].ProductoServicioResponse.nombre;
	                                    $scope.listadoLineasPostpago.listadoProductosServicios[index].ProductoServicioResponse.alias = '';
	                                    $scope.listadoLineasPostpago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.txtAccion = 'editar';
	                                    $("#" + idText).html("editar");
	                                    $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                    $("#" + idText).addClass("editfield").removeClass("red");
	                                    accionPendiente = false;
	                                    $("#idEditarPostpagoLoader" + index).hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, '-');
	                                } else {
	                                    restablecerPostpago();
	                                    accionPendiente = false;
	                                    $("#idEditarPostpagoLoader" + index).hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                }
	                            }, function(response) {
	                                restablecerPostpago();
	                                $("#idEditarPostpagoLoader" + index).hide();


	                            });
	                        }, 200);
	                    }
	                }
	            }
	        }

	        function restablecerPostpago() {

	            if (parseInt($scope.keyPostpago) >= 0) {
	                var idEditarPostpago = "idEditarPostpago" + $scope.keyPostpago;
	                var idTextPostpago = "idClassPostpago" + $scope.keyPostpago;
	                if ($scope.txtRestablecerPostpago == 'guardar') {
	                    $scope.txtRestablecerPostpago = 'editar';
	                }
	                if ($scope.listadoLineasPostpago.listadoProductosServicios[parseInt($scope.keyPostpago)].ProductoServicioResponse.alias == '') {
	                    $scope.txtRestablecerPostpago = 'editar';
	                } else {
	                    $scope.txtRestablecerPostpago = 'reestablecer';
	                }

	                if ($scope.datosRestablecerPostpago == '' || typeof $scope.datosRestablecerPostpago == 'undefined') {
	                    if ($scope.listadoLineasPostpago.listadoProductosServicios[parseInt($scope.keyPostpago)].ProductoServicioResponse.alias == '') {
	                        $scope.datosRestablecerPostpago = $scope.listadoLineasPostpago.listadoProductosServicios[parseInt($scope.keyPostpago)].ProductoServicioResponse.nombre;
	                        $scope.txtRestablecerPostpago = 'editar';
	                    } else {
	                        $scope.datosRestablecerPostpago = $scope.listadoLineasPostpago.listadoProductosServicios[parseInt($scope.keyPostpago)].ProductoServicioResponse.alias;
	                        $scope.txtRestablecerPostpago = 'reestablecer';
	                    }
	                }
	                $("#" + idEditarPostpago).addClass("input text").removeClass("focus error");
	                $("#" + idTextPostpago).addClass("editfield").removeClass("red");
	                $("#" + idEditarPostpago + " input").val($scope.datosRestablecerPostpago);
	                $("#" + idTextPostpago).html($scope.txtRestablecerPostpago);
	                $scope.listadoLineasPostpago.listadoProductosServicios[parseInt($scope.keyPostpago)].ProductoServicioResponse.nombreAlias = $scope.datosRestablecerPostpago;
	                $scope.listadoLineasPostpago.listadoProductosServicios[parseInt($scope.keyPostpago)].ProductoServicioResponse.txtAccion = $scope.txtRestablecerPostpago;
	                $scope.keyPostpago = -1;
	                accionPendiente = false;
	            }
	        }


	        $scope.datosRestablecerColumna01 = '';
	        $scope.txtRestablecerColumna01 = '';
	        $scope.keyColumna01 = -1;
	        var accionPendienteColumna = false;
	        var idColumna01 = -1;
	        $scope.editarMovilCol1 = function(index, focus) {
	            restablecerColumna02($scope.keyColumna02);
	            var idEditar = "idEditarColumna01" + index;
	            var idText = "idClassColumna01" + index;
	            var accion = $.trim($("#" + idText).text());
	            $scope.txtRestablecerColumna01 = accion;
	            $("#msgErrorPhoneMovil").hide();
	            var estado = true;
	            if (accion == 'reestablecer' && focus == '') {
	                if (!accionPendienteColumna && idColumna01 == -1) {
	                    accionPendienteColumna = true;
	                    idColumna01 = index;
	                    estado = false;
	                } else if (!accionPendienteColumna && idColumna01 == index) {
	                    accionPendienteColumna = true;
	                    idColumna01 = index;
	                    estado = false;
	                } else if (accionPendienteColumna && idColumna01 == index) {
	                    accionPendienteColumna = true;
	                    idColumna01 = index;
	                } else if (accionPendienteColumna && idColumna01 != index) {
	                    accionPendienteColumna = false;
	                    idColumna01 = index;
	                    estado = false;
	                } else if (idColumna01 != index) {
	                    restablecerColumna01();
	                    accionPendienteColumna = false;
	                    idColumna01 = index;
	                    estado = false;
	                }
	            } else if (accion == 'guardar' && focus == '') {
	                accionPendienteColumna = true;
	                estado = false;
	            } else if (accion == 'guardar') {
	                accionPendienteColumna = false;
	                estado = false;
	            }
	            var servicioAuditoria = $scope.listaLineaColumna01[index].ProductoServicioResponse.nombre;
	            var tipoLineaAuditoria = $scope.listaLineaColumna01[index].ProductoServicioResponse.tipoLinea;
	            var perfilAuditoria = $scope.listaLineaColumna01[index].ProductoServicioResponse.tipoPermiso;

	            if (estado) {
	                if (focus == 'f') {
	                    $scope.datosRestablecerColumna01 = $scope.listaLineaColumna01[index].ProductoServicioResponse.nombreAlias;
	                    $timeout(function() {
	                        if (parseInt(idColumna01) >= 0) {
	                            var idEditarAnt = "idEditarColumna01" + idColumna01;
	                            var idTextAnt = "idClassColumna01" + idColumna01;
	                            $("#" + idEditarAnt).addClass("input text").removeClass("focus error");
	                            $("#" + idTextAnt).addClass("editfield").removeClass("red");
	                            var datosRestablecerColumna01 = '';
	                            var txtRestablecerColumna01 = '';
	                            if ($scope.listaLineaColumna01[parseInt(idColumna01)].ProductoServicioResponse.alias == '') {
	                                datosRestablecerColumna01 = $scope.listaLineaColumna01[parseInt(idColumna01)].ProductoServicioResponse.nombre;
	                                txtRestablecerColumna01 = 'editar';
	                            } else {
	                                datosRestablecerColumna01 = $scope.listaLineaColumna01[parseInt(idColumna01)].ProductoServicioResponse.alias;
	                                txtRestablecerColumna01 = 'reestablecer';
	                            }
	                            $scope.listaLineaColumna01[parseInt(idColumna01)].ProductoServicioResponse.nombreAlias = datosRestablecerColumna01;
	                            $scope.listaLineaColumna01[parseInt(idColumna01)].ProductoServicioResponse.txtAccion = txtRestablecerColumna01;
	                            $("#" + idTextAnt).html(txtRestablecerColumna01);
	                        }
	                        $("#" + idText).html("guardar");
	                        $("#" + idEditar).addClass("input text focus").focus();
	                        $("#" + idEditar + " input").val("").focus();
	                        $("#" + idText).addClass("editfield red");
	                        $scope.keyColumna01 = index;
	                        idColumna01 = index;
	                        accionPendienteColumna = false;
	                        $scope.listaLineaColumna01[index].ProductoServicioResponse.nombreAlias = '';
	                        $scope.listaLineaColumna01[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                    }, 200);
	                } else {
	                    $scope.datosRestablecerColumna01 = $scope.listaLineaColumna01[index].ProductoServicioResponse.nombreAlias;
	                    if (parseInt(idColumna01) >= 0) {
	                        var idEditarAnt = "idEditarColumna01" + idColumna01;
	                        var idTextAnt = "idClassColumna01" + idColumna01;
	                        $("#" + idEditarAnt).addClass("input text").removeClass("focus error");
	                        $("#" + idTextAnt).addClass("editfield").removeClass("red");
	                        var datosRestablecerColumna01 = '';
	                        var txtRestablecerColumna01 = '';
	                        if ($scope.listaLineaColumna01[parseInt(idColumna01)].ProductoServicioResponse.alias == '') {
	                            datosRestablecerColumna01 = $scope.listaLineaColumna01[parseInt(idColumna01)].ProductoServicioResponse.nombre;
	                            txtRestablecerColumna01 = 'editar';
	                        } else {
	                            datosRestablecerColumna01 = $scope.listaLineaColumna01[parseInt(idColumna01)].ProductoServicioResponse.alias;
	                            txtRestablecerColumna01 = 'reestablecer';
	                        }
	                        $scope.listaLineaColumna01[parseInt(idColumna01)].ProductoServicioResponse.nombreAlias = datosRestablecerColumna01;
	                        $scope.listaLineaColumna01[parseInt(idColumna01)].ProductoServicioResponse.txtAccion = txtRestablecerColumna01;
	                        $("#" + idTextAnt).html(txtRestablecerColumna01);
	                    }
	                    $("#" + idText).html("guardar");
	                    $("#" + idEditar).addClass("input text focus").focus();
	                    $("#" + idEditar + " input").val("").focus();
	                    $("#" + idText).addClass("editfield red");
	                    $scope.keyColumna01 = index;
	                    idColumna01 = index;
	                    accionPendienteColumna = false;
	                    $scope.listaLineaColumna01[index].ProductoServicioResponse.nombreAlias = '';
	                    $scope.listaLineaColumna01[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                }
	            }

	            if (accionPendienteColumna) {
	                if (idColumna01 == index) {
	                    var tipoLinea = $scope.listaLineaColumna01[index].ProductoServicioResponse.tipoLinea;
	                    var tipoPermiso = $scope.listaLineaColumna01[index].ProductoServicioResponse.tipoPermiso;
	                    if (accion == 'guardar') {
	                        $timeout(function() {
	                            if ($scope.listaLineaColumna01[index].ProductoServicioResponse.nombreAlias == '') {
	                                $timeout(function() {
	                                    $("#" + idText).html("guardar");
	                                    $("#" + idEditar).addClass("input text focus error").focus();
	                                    $("#" + idEditar + " input").val("").focus();
	                                    $("#" + idText).addClass("editfield red");
	                                    $scope.keyColumna01 = index;
	                                    idColumna01 = index;
	                                    accionPendienteColumna = true;
	                                    $scope.listaLineaColumna01[index].ProductoServicioResponse.nombreAlias = '';
	                                    $scope.listaLineaColumna01[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                                }, 200);
	                            } else if (validarAlias($scope.listaLineaColumna01, $scope.listaLineaColumna01[parseInt(index)].ProductoServicioResponse.nombreAlias, index)) {
	                                var datos = {
	                                    tipoOperacion: '1',
	                                    idAfectado: $scope.listaLineaColumna01[parseInt(index)].ProductoServicioResponse.idProductoServicio,
	                                    tipoAlias: '1',
	                                    idCuenta: '',
	                                    idDireccion: '',
	                                    descripcionAlias: $scope.listaLineaColumna01[parseInt(index)].ProductoServicioResponse.nombreAlias
	                                };
	                                $("#idEditarColumna01Loader" + index).show();
	                                datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                                TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                                    $scope.estadoAlias = response.data;
	                                    if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                        $("#" + idText).html("reestablecer");
	                                        $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                        $("#" + idText).addClass("editfield").removeClass("red");
	                                        $scope.listaLineaColumna01[parseInt(index)].ProductoServicioResponse.txtAccion = 'reestablecer';
	                                        $scope.listaLineaColumna01[parseInt(index)].ProductoServicioResponse.alias = $scope.listaLineaColumna01[index].ProductoServicioResponse.nombreAlias;
	                                        $scope.keyColumna01 = -1;
	                                        idColumna01 = -1;
	                                        $scope.listaLineaColumna01[parseInt(index)].ProductoServicioResponse.classEditar = '1';
	                                        accionPendienteColumna = false;
	                                        $("#idEditarColumna01Loader" + index).hide();
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, '-');
	                                    } else if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 6) {
	                                        $("#msgErrorPhoneMovil").show();
	                                        restablecerColumna01();
	                                        $scope.listaLineaColumna01[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                                        $("#idEditarColumna01Loader" + index).hide();
	                                        idColumna01 = -1;
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                        $("#idEditarColumna01Loader" + index).hide();
	                                    } else {
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                        restablecerColumna01();
	                                        $("#idEditarColumna01Loader" + index).hide();
	                                    }
	                                }, function(response) {
	                                    restablecerColumna01();
	                                    $("#idEditarColumna01Loader" + index).hide();
	                                });
	                            } else {
	                                restablecerColumna01();
	                                $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                $("#" + idText).addClass("editfield").removeClass("red");
	                                $scope.keyColumna01 = -1;
	                                idColumna01 = -1;
	                                accionPendienteColumna = false;
	                                $("#msgErrorPhoneMovil").show();
	                                $("#idEditarColumna01Loader" + index).hide();
	                            }
	                        }, 200);
	                    } else if (accion == 'reestablecer') {
	                        $timeout(function() {
	                            var datos = {
	                                tipoOperacion: '2',
	                                idAfectado: $scope.listaLineaColumna01[index].ProductoServicioResponse.idProductoServicio,
	                                tipoAlias: '1',
	                                idCuenta: '',
	                                idDireccion: '',
	                                descripcionAlias: ''
	                            };
	                            $("#idEditarColumna01Loader" + index).show();
	                            datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                            TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                                $scope.estadoAlias = response.data;
	                                if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                    $scope.keyColumna01 = -1;
	                                    idColumna01 = -1;
	                                    $scope.listaLineaColumna01[index].ProductoServicioResponse.nombreAlias = $scope.listaLineaColumna01[index].ProductoServicioResponse.nombre;
	                                    $scope.listaLineaColumna01[index].ProductoServicioResponse.alias = '';
	                                    $scope.listaLineaColumna01[parseInt(index)].ProductoServicioResponse.txtAccion = 'editar';
	                                    $("#" + idText).html("editar");
	                                    $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                    $("#" + idText).addClass("editfield").removeClass("red");
	                                    $scope.listaLineaColumna01[parseInt(index)].ProductoServicioResponse.classEditar = '1';
	                                    accionPendienteColumna = false;
	                                    $("#idEditarColumna01Loader" + index).hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, '-');
	                                } else {
	                                    restablecerColumna01();
	                                    $("#idEditarColumna01Loader" + index).hide();
	                                    accionPendienteColumna = false;
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                }
	                            }, function(response) {
	                                restablecerColumna01();
	                                $("#idEditarColumna01Loader" + index).hide();
	                            });
	                        }, 200);
	                    }
	                }
	            }
	        }

	        function restablecerColumna01() {
	            if (parseInt($scope.keyColumna01) >= 0) {
	                var idEditarColumna01 = "idEditarColumna01" + $scope.keyColumna01;
	                var idTextColumna01 = "idClassColumna01" + $scope.keyColumna01;
	                if ($scope.txtRestablecerColumna01 == 'guardar') {
	                    $scope.txtRestablecerColumna01 = 'editar';
	                }
	                if ($scope.listaLineaColumna01[parseInt($scope.keyColumna01)].ProductoServicioResponse.alias == '') {
	                    $scope.txtRestablecerColumna01 = 'editar';
	                } else {
	                    $scope.txtRestablecerColumna01 = 'reestablecer';
	                }
	                if ($scope.datosRestablecerColumna01 == '' || typeof $scope.datosRestablecerColumna01 == 'undefined') {
	                    if ($scope.listaLineaColumna01[parseInt($scope.keyColumna01)].ProductoServicioResponse.alias == '') {
	                        $scope.datosRestablecerColumna01 = $scope.listaLineaColumna01[parseInt($scope.keyColumna01)].ProductoServicioResponse.nombre;
	                        $scope.txtRestablecerColumna01 = 'editar';
	                    } else {
	                        $scope.datosRestablecerColumna01 = $scope.listaLineaColumna01[parseInt($scope.keyColumna01)].ProductoServicioResponse.alias;
	                        $scope.txtRestablecerColumna01 = 'reestablecer';
	                    }
	                }
	                $("#" + idEditarColumna01).addClass("input text").removeClass("focus error");
	                $("#" + idTextColumna01).addClass("editfield").removeClass("red");
	                $("#" + idEditarColumna01 + " input").val($scope.datosRestablecerColumna01);
	                $("#" + idTextColumna01).html($scope.txtRestablecerColumna01);
	                $scope.listaLineaColumna01[parseInt($scope.keyColumna01)].ProductoServicioResponse.nombreAlias = $scope.datosRestablecerColumna01;
	                $scope.listaLineaColumna01[parseInt($scope.keyColumna01)].ProductoServicioResponse.txtAccion = $scope.txtRestablecerColumna01;
	                $scope.keyColumna01 = -1;
	                accionPendienteColumna = false;
	                accionPendienteColumna = false;
	            }
	        }

	        $scope.datosRestablecerColumna02 = '';
	        $scope.txtRestablecerColumna02 = '';
	        var idColumna02 = -1;
	        $scope.keyColumna02 = -1;
	        $scope.editarMovilCol2 = function(index, focus) {
	            restablecerColumna01();
	            var idEditar = "idEditarColumna02" + index;
	            var idText = "idClassColumna02" + index;
	            var acccion = $.trim($("#" + idText).text());
	            $scope.txtRestablecerColumna02 = acccion;
	            $("#msgErrorPhoneMovil").hide();
	            var estado = true;
	            if (acccion == 'reestablecer' && focus == '') {
	                if (!accionPendienteColumna && idColumna02 == -1) {
	                    accionPendienteColumna = true;
	                    idColumna02 = index;
	                    estado = false;
	                } else if (!accionPendienteColumna && idColumna02 == index) {
	                    accionPendienteColumna = true;
	                    idColumna02 = index;
	                    estado = false;
	                } else if (accionPendienteColumna && idColumna02 == index) {
	                    accionPendienteColumna = true;
	                    idColumna02 = index;
	                } else if (accionPendienteColumna && idColumna02 != index) {
	                    accionPendienteColumna = false;
	                    idColumna02 = index;
	                    estado = false;

	                } else if (idColumna02 != index) {
	                    restablecerColumna02($scope.keyColumna02);
	                    accionPendienteColumna = false;
	                    idColumna02 = index;
	                    estado = false;
	                }
	            } else if (acccion == 'guardar' && focus == '') {
	                accionPendienteColumna = true;
	                estado = false;

	            } else if (acccion == 'guardar') {
	                accionPendienteColumna = false;
	                estado = false;
	            }
	            var servicioAuditoria = $scope.listaLineaColumna02[index].ProductoServicioResponse.nombre;
	            var tipoLineaAuditoria = $scope.listaLineaColumna02[index].ProductoServicioResponse.tipoLinea;
	            var perfilAuditoria = $scope.listaLineaColumna02[index].ProductoServicioResponse.tipoPermiso;
	            if (estado) {
	                if (focus == 'f') {
	                    $scope.datosRestablecerColumna02 = $scope.listaLineaColumna02[index].ProductoServicioResponse.nombreAlias;
	                    $timeout(function() {
	                        if (parseInt(idColumna02) >= 0) {
	                            var idEditarAnt = "idEditarColumna02" + idColumna02;
	                            var idTextAnt = "idClassColumna02" + idColumna02;
	                            $("#" + idEditarAnt).addClass("input text").removeClass("focus error");
	                            $("#" + idTextAnt).addClass("editfield").removeClass("red");
	                            var datosRestablecerColumna02 = '';
	                            var txtRestablecerColumna02 = '';
	                            if ($scope.listaLineaColumna02[parseInt(idColumna02)].ProductoServicioResponse.alias == '') {
	                                datosRestablecerColumna02 = $scope.listaLineaColumna02[parseInt(idColumna02)].ProductoServicioResponse.nombre;
	                                txtRestablecerColumna02 = 'editar';
	                            } else {
	                                datosRestablecerColumna02 = $scope.listaLineaColumna02[parseInt(idColumna02)].ProductoServicioResponse.alias;
	                                txtRestablecerColumna02 = 'reestablecer';
	                            }
	                            $scope.listaLineaColumna02[parseInt(idColumna02)].ProductoServicioResponse.nombreAlias = datosRestablecerColumna02;
	                            $scope.listaLineaColumna02[parseInt(idColumna02)].ProductoServicioResponse.txtAccion = txtRestablecerColumna02;
	                            $("#" + idTextAnt).html(txtRestablecerColumna02);
	                        }
	                        $("#" + idText).html("guardar");
	                        $("#" + idEditar).addClass("input text focus").focus();
	                        $("#" + idEditar + " input").val("").focus();
	                        $("#" + idText).addClass("editfield red");
	                        $scope.keyColumna02 = index;
	                        idColumna02 = index;
	                        accionPendienteColumna = false;
	                        $scope.listaLineaColumna02[index].ProductoServicioResponse.nombreAlias = '';
	                        $scope.listaLineaColumna02[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                    }, 200);
	                } else {
	                    $scope.datosRestablecerColumna02 = $scope.listaLineaColumna02[index].ProductoServicioResponse.nombreAlias;
	                    if (parseInt(idColumna02) >= 0) {
	                        var idEditarAnt = "idEditarColumna02" + idColumna02;
	                        var idTextAnt = "idClassColumna02" + idColumna02;
	                        $("#" + idEditarAnt).addClass("input text").removeClass("focus error");
	                        $("#" + idTextAnt).addClass("editfield").removeClass("red");
	                        var datosRestablecerColumna02 = '';
	                        var txtRestablecerColumna02 = '';
	                        if ($scope.listaLineaColumna02[parseInt(idColumna02)].ProductoServicioResponse.alias == '') {
	                            datosRestablecerColumna02 = $scope.listaLineaColumna02[parseInt(idColumna02)].ProductoServicioResponse.nombre;
	                            txtRestablecerColumna02 = 'editar';
	                        } else {
	                            datosRestablecerColumna02 = $scope.listaLineaColumna02[parseInt(idColumna02)].ProductoServicioResponse.alias;
	                            txtRestablecerColumna02 = 'reestablecer';
	                        }
	                        $scope.listaLineaColumna02[parseInt(idColumna02)].ProductoServicioResponse.nombreAlias = datosRestablecerColumna02;
	                        $scope.listaLineaColumna02[parseInt(idColumna02)].ProductoServicioResponse.txtAccion = txtRestablecerColumna02;
	                        $("#" + idTextAnt).html(txtRestablecerColumna02);
	                    }
	                    $("#" + idText).html("guardar");
	                    $("#" + idEditar).addClass("input text focus").focus();
	                    $("#" + idEditar + " input").val("").focus();
	                    $("#" + idText).addClass("editfield red");
	                    $scope.keyColumna02 = index;
	                    idColumna02 = index;
	                    accionPendienteColumna = false;
	                    $scope.listaLineaColumna02[index].ProductoServicioResponse.nombreAlias = '';
	                    $scope.listaLineaColumna02[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                }
	            }
	            if (accionPendienteColumna) {
	                if (idColumna02 == index) {
	                    var tipoLinea = $scope.listaLineaColumna02[index].ProductoServicioResponse.tipoLinea;
	                    var tipoPermiso = $scope.listaLineaColumna02[index].ProductoServicioResponse.tipoPermiso;
	                    if (acccion == 'guardar') {
	                        $timeout(function() {
	                            if ($scope.listaLineaColumna02[index].ProductoServicioResponse.nombreAlias == '') {
	                                $timeout(function() {
	                                    $("#" + idText).html("guardar");
	                                    $("#" + idEditar).addClass("input text focus error").focus();
	                                    $("#" + idEditar + " input").val("").focus();
	                                    $("#" + idText).addClass("editfield red");
	                                    $scope.keyColumna02 = index;
	                                    idColumna02 = index;
	                                    accionPendienteColumna = true;
	                                    $scope.listaLineaColumna02[index].ProductoServicioResponse.nombreAlias = '';
	                                    $scope.listaLineaColumna02[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                                }, 200);
	                            } else if (validarAlias($scope.listaLineaColumna02, $scope.listaLineaColumna02[parseInt(index)].ProductoServicioResponse.nombreAlias, index)) {
	                                var datos = {
	                                    tipoOperacion: '1',
	                                    idAfectado: $scope.listaLineaColumna02[parseInt(index)].ProductoServicioResponse.idProductoServicio,
	                                    tipoAlias: '1',
	                                    idCuenta: '',
	                                    idDireccion: '',
	                                    descripcionAlias: $scope.listaLineaColumna02[parseInt(index)].ProductoServicioResponse.nombreAlias
	                                };
	                                $("#idEditarColumna02Loader" + index).show();
	                                datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                                TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                                    $scope.estadoAlias = response.data;
	                                    if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                        $("#" + idText).html("reestablecer");
	                                        $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                        $("#" + idText).addClass("editfield").removeClass("red");
	                                        $scope.listaLineaColumna02[parseInt(index)].ProductoServicioResponse.txtAccion = 'reestablecer';
	                                        $scope.listaLineaColumna02[parseInt(index)].ProductoServicioResponse.alias = $scope.listaLineaColumna02[index].ProductoServicioResponse.nombreAlias;
	                                        $scope.keyColumna02 = -1;
	                                        idColumna02 = -1;
	                                        $scope.listaLineaColumna02[parseInt(index)].ProductoServicioResponse.classEditar = '1';
	                                        accionPendienteColumna = false;
	                                        $("#idEditarColumna02Loader" + index).hide();
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, '-');
	                                    } else if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 6) {
	                                        $timeout(function() {
	                                            restablecerColumna02($scope.keyColumna02);
	                                            $("#msgErrorPhoneMovil").show();
	                                            $("#idEditarColumna02Loader" + index).hide();
	                                        }, 200);
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                    } else {
	                                        restablecerColumna02($scope.keyColumna02);
	                                        $("#idEditarColumna02Loader" + index).hide();
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                    }
	                                }, function(response) {
	                                    restablecerColumna02($scope.keyColumna02);
	                                    $("#idEditarColumna02Loader" + index).hide();
	                                });
	                            } else {
	                                $timeout(function() {
	                                    restablecerColumna02($scope.keyColumna02);
	                                    $("#msgErrorPhoneMovil").show();
	                                    $scope.listaLineaColumna02[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                                    $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                    $("#" + idText).addClass("editfield").removeClass("red");
	                                    $scope.keyColumna02 = -1;
	                                    idColumna02 = -1;
	                                    accionPendienteColumna = false;
	                                }, 200);
	                            }
	                        }, 200);
	                    } else if (acccion == 'reestablecer') {

	                        $timeout(function() {
	                            var datos = {
	                                tipoOperacion: '2',
	                                idAfectado: $scope.listaLineaColumna02[index].ProductoServicioResponse.idProductoServicio,
	                                tipoAlias: '1',
	                                idCuenta: '',
	                                idDireccion: '',
	                                descripcionAlias: ''
	                            };
	                            $("#idEditarColumna02Loader" + index).hide();
	                            datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                            TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                                $scope.estadoAlias = response.data;
	                                if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                    $scope.keyColumna02 = -1;
	                                    idColumna02 = -1;
	                                    $scope.listaLineaColumna02[index].ProductoServicioResponse.nombreAlias = $scope.listaLineaColumna02[index].ProductoServicioResponse.nombre;
	                                    $scope.listaLineaColumna02[index].ProductoServicioResponse.alias = '';
	                                    $scope.listaLineaColumna02[parseInt(index)].ProductoServicioResponse.txtAccion = 'editar';
	                                    $("#" + idText).html("editar");
	                                    $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                    $("#" + idText).addClass("editfield").removeClass("red");
	                                    $scope.listaLineaColumna02[parseInt(index)].ProductoServicioResponse.classEditar = '1';
	                                    accionPendienteColumna = false;
	                                    $("#idEditarColumna02Loader" + index).hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, '-');
	                                } else {
	                                    restablecerColumna02($scope.keyColumna02);
	                                    $("#idEditarColumna02Loader" + index).hide();
	                                    accionPendienteColumna = false;
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                }
	                            }, function(response) {
	                                restablecerColumna02($scope.keyColumna02);
	                                $("#idEditarColumna02Loader" + index).hide();

	                            });
	                        }, 200);
	                    }
	                }
	            }
	        }

	        function restablecerColumna02(keyColumna02) {
	            $scope.keyColumna02 = keyColumna02;
	            if (parseInt($scope.keyColumna02) >= 0) {
	                var idEditarColumna02 = "idEditarColumna02" + $scope.keyColumna02;
	                var idTextColumna02 = "idClassColumna02" + $scope.keyColumna02;

	                if ($scope.txtRestablecerColumna02 == 'guardar') {
	                    $scope.txtRestablecerColumna02 = 'editar';
	                }
	                if ($scope.listaLineaColumna02[parseInt($scope.keyColumna02)].ProductoServicioResponse.alias == '') {
	                    $scope.txtRestablecerColumna02 = 'editar';
	                } else {
	                    $scope.txtRestablecerColumna02 = 'reestablecer';
	                }
	                if ($scope.datosRestablecerColumna02 == '' || typeof $scope.datosRestablecerColumna02 == 'undefined') {
	                    if ($scope.listaLineaColumna02[parseInt($scope.keyColumna02)].ProductoServicioResponse.alias == '') {
	                        $scope.datosRestablecerColumna02 = $scope.listaLineaColumna02[parseInt($scope.keyColumna02)].ProductoServicioResponse.nombre;
	                        $scope.txtRestablecerColumna02 = 'editar';
	                    } else {
	                        $scope.datosRestablecerColumna02 = $scope.listaLineaColumna02[parseInt($scope.keyColumna02)].ProductoServicioResponse.alias;
	                        $scope.txtRestablecerColumna02 = 'reestablecer';
	                    }
	                }
	                $("#" + idEditarColumna02).addClass("input text").removeClass("focus error");
	                $("#" + idTextColumna02).addClass("editfield").removeClass("red");
	                $("#" + idEditarColumna02 + " input").val($scope.datosRestablecerColumna02);
	                $("#" + idTextColumna02).html($scope.txtRestablecerColumna02);
	                $scope.listaLineaColumna02[parseInt($scope.keyColumna02)].ProductoServicioResponse.nombreAlias = $scope.datosRestablecerColumna02;
	                $scope.listaLineaColumna02[parseInt($scope.keyColumna02)].ProductoServicioResponse.txtAccion = $scope.txtRestablecerColumna02;
	                $scope.keyColumna02 = -1;
	                accionPendienteColumna = false;
	            }
	        }

	        $scope.datosRestablecerServicio = '';
	        $scope.txtRestablecerServicio = '';
	        var idServicio = -1;
	        $scope.keyServicio = -1;
	        var accionPendienteServicio = false;
	        var accion = '';
	        $scope.editarServicio = function(index, focus) {
	            var idEditar = "idEditarServicioDireccion" + index;
	            var idText = "idClassServicioDireccion" + index;
	            acccion = $.trim($("#" + idText).text());
	            $scope.txtRestablecerServicio = acccion;
	            $("#msgErrorPhoneMovil").hide();
	            $("#msgErrorDireccion").hide();
	            var estado = true;

	            if (acccion == 'reestablecer' && focus == '') {
	                if (!accionPendienteServicio && idServicio == -1) {

	                    accionPendienteServicio = true;
	                    idServicio = index;
	                    estado = false
	                } else if (!accionPendienteServicio && idServicio == index) {

	                    accionPendienteServicio = true;
	                    idServicio = index;
	                    estado = false;
	                } else if (accionPendienteServicio && idServicio == index) {

	                    accionPendienteServicio = true;
	                    idServicio = index;
	                } else if (accionPendienteServicio && idServicio != index) {

	                    accionPendienteServicio = false;
	                    idServicio = index;
	                    estado = false;
	                } else if (idServicio != index) {

	                    restablecerServicio($scope.keyServicio);
	                    accionPendienteServicio = false;
	                    idServicio = index;
	                    estado = false;
	                }
	            } else if (acccion == 'guardar' && focus == '') {

	                accionPendienteServicio = true;
	                estado = false

	            } else if (acccion == 'guardar') {

	                accionPendienteServicio = false;
	                estado = false
	            }

	            var servicioAuditoria = $scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.nombre;
	            var tipoLineaAuditoria = $scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.tipoLinea;
	            var perfilAuditoria = $scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.tipoPermiso;
	            if (estado) {
	                if (focus == 'f') {

	                    $scope.datosRestablecerServicio = $scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias;
	                    if ($scope.datosRestablecerServicio == '' || typeof $scope.datosRestablecerServicio == 'undefined') {
	                    	$scope.datosRestablecerServicio = $scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.nombre;
	                    }	

	                    $timeout(function() {
	                        if (parseInt(idServicio) >= 0) {
	                            var idEditarAnt = "idEditarServicioDireccion" + idServicio;
	                            var idTextAnt = "idClassServicioDireccion" + idServicio;
	                            $("#" + idEditarAnt).addClass("input textbig").removeClass("focus error");
	                            $("#" + idTextAnt).addClass("editfield").removeClass("red");
	                            var datosRestablecerServicio = '';
	                            var txtRestablecerServicio = '';
	                            if ($scope.servicioDirecccion.listadoProductosServicios[parseInt(idServicio)].ProductoServicioResponse.alias == '') {
	                                datosRestablecerServicio = $scope.servicioDirecccion.listadoProductosServicios[parseInt(idServicio)].ProductoServicioResponse.nombre;
	                                txtRestablecerServicio = 'editar';
	                            } else {
	                                datosRestablecerServicio = $scope.servicioDirecccion.listadoProductosServicios[parseInt(idServicio)].ProductoServicioResponse.alias;
	                                txtRestablecerServicio = 'reestablecer';
	                            }
	                            $scope.servicioDirecccion.listadoProductosServicios[parseInt(idServicio)].ProductoServicioResponse.nombreAlias = datosRestablecerServicio;
	                            $scope.servicioDirecccion.listadoProductosServicios[parseInt(idServicio)].ProductoServicioResponse.txtAccion = txtRestablecerServicio;
	                            $("#" + idTextAnt).html(txtRestablecerServicio);
	                        }
	                        $("#" + idText).html("guardar");
	                        $("#" + idEditar).addClass("input textbig focus").focus();
	                        $("#" + idEditar + " input").val("").focus();
	                        $("#" + idText).addClass("editfield red");
	                        $scope.keyServicio = index;
	                        idServicio = index;
	                        accionPendienteServicio = false;
	                        $scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias = '';
	                        $scope.servicioDirecccion.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                    }, 200);
	                } else {

	                    $scope.datosRestablecerServicio = $scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias;

	                    if (parseInt(idServicio) >= 0) {
	                        var idEditarAnt = "idEditarServicioDireccion" + idServicio;
	                        var idTextAnt = "idClassServicioDireccion" + idServicio;
	                        $("#" + idEditarAnt).addClass("input textbig").removeClass("focus");
	                        $("#" + idTextAnt).addClass("editfield").removeClass("red");
	                        var datosRestablecerServicio = '';
	                        var txtRestablecerServicio = '';
	                        if ($scope.servicioDirecccion.listadoProductosServicios[parseInt(idServicio)].ProductoServicioResponse.alias == '') {
	                            datosRestablecerServicio = $scope.servicioDirecccion.listadoProductosServicios[parseInt(idServicio)].ProductoServicioResponse.nombre;
	                            txtRestablecerServicio = 'editar';
	                        } else {
	                            datosRestablecerServicio = $scope.servicioDirecccion.listadoProductosServicios[parseInt(idServicio)].ProductoServicioResponse.alias;
	                            txtRestablecerServicio = 'reestablecer';
	                        }
	                        $scope.servicioDirecccion.listadoProductosServicios[parseInt(idServicio)].ProductoServicioResponse.nombreAlias = datosRestablecerServicio;
	                        $scope.servicioDirecccion.listadoProductosServicios[parseInt(idServicio)].ProductoServicioResponse.txtAccion = txtRestablecerServicio;
	                        $("#" + idTextAnt).html(txtRestablecerServicio);
	                    }
	                    $("#" + idText).html("guardar");
	                    $("#" + idEditar).addClass("input text focus").focus();
	                    $("#" + idEditar + " input").val("").focus();
	                    $("#" + idText).addClass("editfield red");
	                    $scope.keyServicio = index;
	                    idServicio = index;
	                    accionPendienteServicio = false;
	                    $scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias = '';
	                    $scope.servicioDirecccion.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                }
	            }
	            if (accionPendienteServicio) {
	                if (idServicio == index) {
	                    var tipoLinea = $scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.tipoLinea;
	                    var tipoPermiso = $scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.tipoPermiso;
	                    if (acccion == 'guardar') {
	                        $("#" + idText).addClass("disabled");
	                        $timeout(function() {
	                            if ($scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias == '') {
	                                $timeout(function() {
	                                    $("#" + idText).html("guardar");
	                                    $("#" + idEditar).addClass("input text focus error").focus();
	                                    $("#" + idEditar + " input").val("").focus();
	                                    $("#" + idText).addClass("editfield red");
	                                    $scope.keyServicio = index;
	                                    idServicio = index;
	                                    accionPendienteServicio = true;
	                                    $scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias = '';
	                                    $scope.servicioDirecccion.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                                }, 200);
	                            } else if (validarAlias($scope.servicioDirecccion.listadoProductosServicios, $scope.servicioDirecccion.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.nombreAlias, index)) {
	                                var datos = {
	                                    tipoOperacion: '1',
	                                    idAfectado: $scope.servicioDirecccion.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.idProductoServicio,
	                                    tipoAlias: '1',
	                                    idCuenta: '',
	                                    idDireccion: $scope.selectDireccion.idDireccion,
	                                    descripcionAlias: $scope.servicioDirecccion.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.nombreAlias
	                                };
	                                $("#idEditarServicioDireccionLoader" + index).hide();
	                                datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                                TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                                    $scope.estadoAlias = response.data;
	                                    if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                        $("#" + idText).html("reestablecer");
	                                        $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                        $("#" + idText).addClass("editfield").removeClass("red");
	                                        $scope.servicioDirecccion.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.txtAccion = 'reestablecer';
	                                        $scope.servicioDirecccion.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.alias = $scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias;
	                                        $scope.keyServicio = -1;
	                                        idServicio = -1;
	                                        accionPendienteServicio = false;
	                                        $("#idEditarServicioDireccionLoader" + index).hide();
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasDireccion, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, '-');
	                                    } else if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 6) {
	                                        $timeout(function() {
	                                            $("#msgErrorDireccion").show();
	                                            restablecerServicio($scope.keyServicio);
	                                            $("#idEditarServicioDireccionLoader" + index).hide();
	                                        }, 200);
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasDireccion, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                    } else {
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasDireccion, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                        restablecerServicio($scope.keyServicio);
	                                        $("#idEditarServicioDireccionLoader" + index).hide();
	                                    }
	                                }, function(response) {
	                                    restablecerServicio($scope.keyServicio);
	                                    $("#idEditarPostpagoLoader" + index).hide();

	                                });
	                            } else {
	                                $timeout(function() {
	                                    $("#msgErrorDireccion").show();
	                                    restablecerServicio($scope.keyServicio);
	                                    $scope.servicioDirecccion.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                                    $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                    $("#" + idText).addClass("editfield").removeClass("red");
	                                    $scope.keyServicio = -1;
	                                    idServicio = -1;
	                                    accionPendienteServicio = false;
	                                }, 200);
	                            }
	                        }, 200);
	                        $("#" + idText).removeClass("disabled");
	                    } else if (acccion == 'reestablecer') {
	                        $timeout(function() {
	                            var datos = {
	                                tipoOperacion: '2',
	                                idAfectado: $scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.idProductoServicio,
	                                tipoAlias: '1',
	                                idCuenta: '',
	                                idDireccion: '',
	                                descripcionAlias: ''
	                            };
	                            $("#idEditarServicioDireccionLoader" + index).show();
	                            datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                            TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                                $scope.estadoAlias = response.data;
	                                if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                    $scope.keyServicio = -1;
	                                    idServicio = -1;
	                                    $scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias = $scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.nombre;
	                                    $scope.servicioDirecccion.listadoProductosServicios[index].ProductoServicioResponse.alias = '';
	                                    $scope.servicioDirecccion.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.txtAccion = 'editar';
	                                    $("#" + idText).html("editar");
	                                    $("#" + idEditar).addClass("input text").removeClass("focus");
	                                    $("#" + idText).addClass("editfield").removeClass("red");
	                                    $scope.servicioDirecccion.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '1';
	                                    accionPendienteServicio = false;
	                                    $("#idEditarServicioDireccionLoader" + index).hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasDireccion, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, '-');
	                                } else {
	                                    restablecerServicio($scope.keyServicio);
	                                    $("#idEditarServicioDireccionLoader" + index).hide();
	                                    accionPendienteServicio = false;
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasDireccion, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                }
	                            }, function(response) {
	                                restablecerServicio($scope.keyServicio);
	                                $("#idEditarServicioDireccionLoader" + index).hide();

	                            });
	                        }, 200);
	                    }
	                }
	            }
	        }

	        function restablecerServicio(keyServicio) {
	            if (parseInt($scope.keyServicio) >= 0) {
	                var idEditarServicioDireccion = "idEditarServicioDireccion" + $scope.keyServicio;
	                var idTextServicio = "idClassServicioDireccion" + $scope.keyServicio;
	                if ($scope.txtRestablecerServicio == 'guardar') {
	                    $scope.txtRestablecerServicio = 'editar';
	                }
	                if ($scope.servicioDirecccion.listadoProductosServicios[parseInt($scope.keyServicio)].ProductoServicioResponse.alias == '') {
	                    $scope.txtRestablecerServicio = 'editar';
	                } else {
	                    $scope.txtRestablecerServicio = 'reestablecer';
	                }
	                if ($scope.datosRestablecerServicio == '' || typeof $scope.datosRestablecerServicio == 'undefined') {
	                    if ($scope.servicioDirecccion.listadoProductosServicios[parseInt($scope.keyServicio)].ProductoServicioResponse.alias == '') {
	                        $scope.datosRestablecerServicio = $scope.servicioDirecccion.listadoProductosServicios[parseInt($scope.keyServicio)].ProductoServicioResponse.nombre;
	                        $scope.txtRestablecerServicio = 'editar';
	                    } else {
	                        $scope.datosRestablecerServicio = $scope.servicioDirecccion.listadoProductosServicios[parseInt($scope.keyServicio)].ProductoServicioResponse.alias;
	                        $scope.txtRestablecerServicio = 'reestablecer';
	                    }
	                }
	                $("#" + idEditarServicioDireccion).addClass("input text").removeClass("focus error");
	                $("#" + idTextServicio).addClass("editfield").removeClass("red");
	                $("#" + idEditarServicioDireccion + " input").val($scope.datosRestablecerServicio);
	                $("#" + idTextServicio).html($scope.txtRestablecerServicio);
	                $scope.servicioDirecccion.listadoProductosServicios[parseInt($scope.keyServicio)].ProductoServicioResponse.nombreAlias = $scope.datosRestablecerServicio;
	                $scope.servicioDirecccion.listadoProductosServicios[parseInt($scope.keyServicio)].ProductoServicioResponse.txtAccion = $scope.txtRestablecerServicio;
	                $scope.keyServicio = -1;
	                accionPendienteServicio = false;
	            }
	        }


	        $scope.datosRestablecerNoCliente = '';
	        $scope.txtRestablecerNoCliente = '';
	        var idNoCliente = -1;
	        $scope.KeyNoCliente = -1;
	        $scope.KeyNoClientePrepago = -1;
	        var accionPendienteNoCliente = false;
	        $scope.editarNoEmpleado = function(index, focus) {
	            empleadoReestablecerPrepago($scope.KeyNoClientePrepago);
	            var idEditar = "idEditarNoEmpleado" + index;
	            var idText = "idClassNoEmpleado" + index;
	            var acccion = $.trim($("#" + idText).text());
	            $scope.txtRestablecerNoCliente = acccion;
	            $("#msgErrorPhoneNum").hide();
	            var estado = true;
	            if (acccion == 'reestablecer' && focus == '') {
	                if (!accionPendienteNoCliente && idNoCliente == -1) {
	                    accionPendienteNoCliente = true;
	                    idNoCliente = index;
	                    estado = false;
	                } else if (!accionPendienteNoCliente && idNoCliente == index) {
	                    accionPendienteNoCliente = true;
	                    idNoCliente = index;
	                    estado = false;
	                } else if (accionPendienteNoCliente && idNoCliente == index) {
	                    accionPendienteNoCliente = true;
	                    idNoCliente = index;
	                } else if (accionPendienteNoCliente && idNoCliente != index) {
	                    accionPendienteNoCliente = false;
	                    idNoCliente = index;
	                    estado = false;
	                } else if (idNoCliente != index) {
	                    empleadoReestablecer();
	                    accionPendienteNoCliente = false;
	                    idNoCliente = index;
	                    estado = false;
	                }
	            } else if (acccion == 'guardar' && focus == '') {
	                accionPendienteNoCliente = true;
	                estado = false;

	            } else if (acccion == 'guardar') {
	                accionPendienteNoCliente = false;
	                estado = false;
	            }

	            var servicioAuditoria = $scope.listaNoEmpleado.listadoProductosServicios[index].ProductoServicioResponse.nombre;
	            var tipoLineaAuditoria = $scope.listaNoEmpleado.listadoProductosServicios[index].ProductoServicioResponse.tipoLinea;
	            var perfilAuditoria = $scope.listaNoEmpleado.listadoProductosServicios[index].ProductoServicioResponse.tipoPermiso;
	            if (estado) {
	                if (focus == 'f') {
	                    $scope.datosRestablecerNoCliente = $scope.listaNoEmpleado.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias;
	                    $timeout(function() {
	                        if (parseInt(idNoCliente) >= 0) {
	                            var idEditarAnt = "idEditarNoEmpleado" + idNoCliente;
	                            var idTextAnt = "idClassNoEmpleado" + idNoCliente;
	                            $("#" + idEditarAnt).addClass("input text").removeClass("focus error");
	                            $("#" + idTextAnt).addClass("editfield").removeClass("red");
	                            var datosRestablecerNoCliente = '';
	                            var txtRestablecerNoCliente = '';
	                            if ($scope.listaNoEmpleado.listadoProductosServicios[parseInt(idNoCliente)].ProductoServicioResponse.alias == '') {
	                                datosRestablecerNoCliente = $scope.listaNoEmpleado.listadoProductosServicios[parseInt(idNoCliente)].ProductoServicioResponse.nombre;
	                                txtRestablecerNoCliente = 'editar';
	                            } else {
	                                datosRestablecerNoCliente = $scope.listaNoEmpleado.listadoProductosServicios[parseInt(idNoCliente)].ProductoServicioResponse.alias;
	                                txtRestablecerNoCliente = 'reestablecer';
	                            }
	                            $scope.listaNoEmpleado.listadoProductosServicios[parseInt(idNoCliente)].ProductoServicioResponse.nombreAlias = datosRestablecerNoCliente;
	                            $scope.listaNoEmpleado.listadoProductosServicios[parseInt(idNoCliente)].ProductoServicioResponse.txtAccion = txtRestablecerNoCliente;
	                            $("#" + idTextAnt).html(txtRestablecerNoCliente);
	                        }
	                        $("#" + idText).html("guardar");
	                        $("#" + idEditar).addClass("input text focus").focus();
	                        $("#" + idEditar + " input").val("").focus();
	                        $("#" + idText).addClass("editfield red");
	                        $scope.KeyNoCliente = index;
	                        idNoCliente = index;
	                        accionPendienteNoCliente = false;
	                        $scope.listaNoEmpleado.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.nombreAlias = '';
	                        $scope.listaNoEmpleado.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                    }, 200);
	                } else {
	                    $scope.datosRestablecerNoCliente = $scope.listaNoEmpleado.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias;
	                    if (parseInt(idNoCliente) >= 0) {
	                        var idEditarAnt = "idEditarNoEmpleado" + idNoCliente;
	                        var idTextAnt = "idClassNoEmpleado" + idNoCliente;
	                        $("#" + idEditarAnt).addClass("input text").removeClass("focus");
	                        $("#" + idTextAnt).addClass("editfield").removeClass("red");
	                        var datosRestablecerNoCliente = '';
	                        var txtRestablecerNoCliente = '';
	                        if ($scope.listaNoEmpleado.listadoProductosServicios[parseInt(idNoCliente)].ProductoServicioResponse.alias == '') {
	                            datosRestablecerNoCliente = $scope.listaNoEmpleado.listadoProductosServicios[parseInt(idNoCliente)].ProductoServicioResponse.nombre;
	                            txtRestablecerNoCliente = 'editar';
	                        } else {
	                            datosRestablecerNoCliente = $scope.listaNoEmpleado.listadoProductosServicios[parseInt(idNoCliente)].ProductoServicioResponse.alias;
	                            txtRestablecerNoCliente = 'reestablecer';
	                        }
	                        $scope.listaNoEmpleado.listadoProductosServicios[parseInt(idNoCliente)].ProductoServicioResponse.nombreAlias = datosRestablecerNoCliente;
	                        $scope.listaNoEmpleado.listadoProductosServicios[parseInt(idNoCliente)].ProductoServicioResponse.txtAccion = txtRestablecerNoCliente;
	                        $("#" + idTextAnt).html(txtRestablecerNoCliente);
	                    }
	                    $("#" + idText).html("guardar");
	                    $("#" + idEditar).addClass("input text focus").focus();
	                    $("#" + idEditar + " input").val("").focus();
	                    $("#" + idText).addClass("editfield red");
	                    $scope.KeyNoCliente = index;
	                    idNoCliente = index;
	                    accionPendienteNoCliente = false;
	                    $scope.listaNoEmpleado.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.nombreAlias = '';
	                    $scope.listaNoEmpleado.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                }
	            }
	            if (accionPendienteNoCliente) {
	                if (idNoCliente == index) {
	                    if (acccion == 'guardar') {
	                        var tipoLinea = $scope.listaNoEmpleado.listadoProductosServicios[index].ProductoServicioResponse.tipoLinea;
	                        var tipoPermiso = $scope.listaNoEmpleado.listadoProductosServicios[index].ProductoServicioResponse.tipoPermiso;
	                        $timeout(function() {
	                            if ($scope.listaNoEmpleado.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias == '') {
	                                $timeout(function() {
	                                    $("#" + idText).html("guardar");
	                                    $("#" + idEditar).addClass("input text focus error").focus();
	                                    $("#" + idEditar + " input").val("").focus();
	                                    $("#" + idText).addClass("editfield red");
	                                    $scope.KeyNoCliente = index;
	                                    idNoCliente = index;
	                                    accionPendienteNoCliente = true;
	                                    $scope.listaNoEmpleado.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias = '';
	                                    $scope.listaNoEmpleado.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                                }, 200);
	                            } else if (validarAlias($scope.listaNoEmpleado.listadoProductosServicios, $scope.listaNoEmpleado.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.nombreAlias, index)) {
	                                var datos = {
	                                    tipoOperacion: '1',
	                                    idAfectado: $scope.listaNoEmpleado.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.idProductoServicio,
	                                    tipoAlias: '1',
	                                    idCuenta: '',
	                                    idDireccion: '',
	                                    descripcionAlias: $scope.listaNoEmpleado.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.nombreAlias
	                                };
	                                $("#editarNoEmpleadoLoader" + index).hide();
	                                datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                                TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                                    $scope.estadoAlias = response.data;
	                                    if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                        $("#" + idText).html("reestablecer");
	                                        $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                        $("#" + idText).addClass("editfield").removeClass("red");
	                                        $scope.listaNoEmpleado.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.txtAccion = 'reestablecer';
	                                        $scope.listaNoEmpleado.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.alias = $scope.listaNoEmpleado.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias;
	                                        $scope.KeyNoCliente = -1;
	                                        idNoCliente = -1;
	                                        accionPendienteNoCliente = false;
	                                        $("#editarNoEmpleadoLoader" + index).hide();
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCCES', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, '-');
	                                    } else if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 6) {

	                                        $timeout(function() {
	                                            empleadoReestablecer();
	                                            $("#msgErrorPhoneNum").show();
	                                            $("#editarNoEmpleadoLoader" + index).hide();
	                                        }, 200);
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                    } else {
	                                        empleadoReestablecer();
	                                        $("#editarNoEmpleadoLoader" + index).hide();
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta -' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                    }
	                                }, function(response) {
	                                    empleadoReestablecer();
	                                    $("#editarNoEmpleadoLoader" + index).hide();

	                                });
	                            } else {
	                                $timeout(function() {
	                                    empleadoReestablecer();
	                                    $("#msgErrorPhoneNum").show();
	                                    $scope.listaNoEmpleado.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                                    $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                    $("#" + idText).addClass("editfield").removeClass("red");
	                                    $scope.KeyNoCliente = -1;
	                                    idNoCliente = -1;
	                                    accionPendienteNoCliente = false;
	                                }, 200);
	                            }
	                        }, 200);
	                    } else if (acccion == 'reestablecer') {
	                        $timeout(function() {
	                            var datos = {
	                                tipoOperacion: '2',
	                                idAfectado: $scope.listaNoEmpleado.listadoProductosServicios[index].ProductoServicioResponse.idProductoServicio,
	                                tipoAlias: '1',
	                                idCuenta: '',
	                                idDireccion: '',
	                                descripcionAlias: ''
	                            };
	                            $("#editarNoEmpleadoLoader" + index).show();
	                            datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                            TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                                $scope.estadoAlias = response.data;
	                                if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                    $scope.KeyNoCliente = -1;
	                                    idNoCliente = -1;
	                                    $scope.listaNoEmpleado.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.nombreAlias = $scope.listaNoEmpleado.listadoProductosServicios[index].ProductoServicioResponse.nombre;
	                                    $scope.listaNoEmpleado.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.alias = '';
	                                    $scope.listaNoEmpleado.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.txtAccion = 'editar';
	                                    $("#" + idText).html("editar");
	                                    $("#" + idEditar).addClass("input text").removeClass("focus");
	                                    $("#" + idText).addClass("editfield").removeClass("red");
	                                    $scope.listaNoEmpleado.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '1';
	                                    accionPendienteNoCliente = false;
	                                    $("#editarNoEmpleadoLoader" + index).hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, '-');
	                                } else {
	                                    empleadoReestablecer();
	                                    accionPendienteNoCliente = false;
	                                    $("#idEditarNoEmpleadoLoader" + index).hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                }
	                            }, function(response) {
	                                empleadoReestablecer();
	                                $("#idEditarNoEmpleadoLoader" + index).hide();
	                            });
	                        }, 200);
	                    }
	                }
	            }
	        }

	        function empleadoReestablecer() {
	            if (parseInt($scope.KeyNoCliente) >= 0) {
	                var idEditarNoEmpleado = "idEditarNoEmpleado" + $scope.KeyNoCliente;
	                var idTextServicio = "idClassNoEmpleado" + $scope.KeyNoCliente;
	                if ($scope.txtRestablecerNoCliente == 'guardar') {
	                    $scope.txtRestablecerNoCliente = 'editar';
	                }
	                if ($scope.listaNoEmpleado.listadoProductosServicios[parseInt($scope.KeyNoCliente)].ProductoServicioResponse.alias == '') {
	                    $scope.txtRestablecerNoCliente = 'editar';
	                } else {
	                    $scope.txtRestablecerNoCliente = 'reestablecer';
	                }
	                if ($scope.datosRestablecerNoCliente == '') {
	                    if ($scope.listaNoEmpleado.listadoProductosServicios[parseInt($scope.KeyNoCliente)].ProductoServicioResponse.alias == '') {
	                        $scope.datosRestablecerNoCliente = $scope.listaNoEmpleado.listadoProductosServicios[parseInt($scope.KeyNoCliente)].ProductoServicioResponse.nombre;
	                        $scope.txtRestablecerNoCliente = 'editar';
	                    } else {
	                        $scope.datosRestablecerNoCliente = $scope.listaNoEmpleado.listadoProductosServicios[parseInt($scope.KeyNoCliente)].ProductoServicioResponse.alias;
	                        $scope.txtRestablecerNoCliente = 'reestablecer';
	                    }
	                }
	                $("#" + idEditarNoEmpleado).addClass("input text").removeClass("focus error");
	                $("#" + idTextServicio).addClass("editfield").removeClass("red");
	                $("#" + idEditarNoEmpleado + " input").val($scope.datosRestablecerNoCliente);
	                $("#" + idTextServicio).html($scope.txtRestablecerNoCliente);
	                $scope.listaNoEmpleado.listadoProductosServicios[parseInt($scope.KeyNoCliente)].ProductoServicioResponse.nombreAlias = $scope.datosRestablecerNoCliente;
	                $scope.listaNoEmpleado.listadoProductosServicios[parseInt($scope.KeyNoCliente)].ProductoServicioResponse.txtAccion = $scope.txtRestablecerNoCliente;
	                $scope.keyNoCliente = -1;
	                accionPendienteNoCliente = false;
	            }
	        }


	        $scope.datosRestablecerNoClientePrepago = '';
	        $scope.txtdatosRestablecerNoClientePrepago = '';
	        var idNoClientePrepago = -1;
	        $scope.KeyNoClientePrepago = -1;
	        $scope.editarNoEmpleadoPrepago = function(index, focus) {
	            empleadoReestablecer($scope.KeyNoCliente);
	            var idEditar = "idEditarNoEmpleadoPrepago" + index;
	            var idText = "idClassNoEmpleadoPrepago" + index;
	            var acccion = $.trim($("#" + idText).text());
	            $scope.txtdatosRestablecerNoClientePrepago = acccion;
	            $("#msgErrorPhoneNum").hide();
	            var estado = true;
	            if (acccion == 'reestablecer' && focus == '') {
	                if (!accionPendienteNoCliente && idNoClientePrepago == -1) {
	                    accionPendienteNoCliente = true;
	                    idNoClientePrepago = index;
	                    estado = false;
	                } else if (!accionPendienteNoCliente && idNoClientePrepago == index) {
	                    accionPendienteNoCliente = true;
	                    idNoClientePrepago = index;
	                    estado = false;
	                } else if (accionPendienteNoCliente && idNoClientePrepago == index) {
	                    accionPendienteNoCliente = true;
	                    idNoClientePrepago = index;
	                } else if (accionPendienteNoCliente && idNoClientePrepago != index) {
	                    accionPendienteNoCliente = false;
	                    idNoClientePrepago = index;
	                    estado = false;
	                } else if (idNoClientePrepago != index) {
	                    empleadoReestablecerPrepago($scope.KeyNoClientePrepago);
	                    accionPendienteNoCliente = false;
	                    idNoClientePrepago = index;
	                    estado = false;
	                }
	            } else if (acccion == 'guardar' && focus == '') {
	                accionPendienteNoCliente = true;
	                estado = false;

	            } else if (acccion == 'guardar') {
	                accionPendienteNoCliente = false;
	                estado = false;
	            }

	            var servicioAuditoria = $scope.listaNoEmpleadoPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombre;
	            var tipoLineaAuditoria = $scope.listaNoEmpleadoPrepago.listadoProductosServicios[index].ProductoServicioResponse.tipoLinea;
	            var perfilAuditoria = $scope.listaNoEmpleadoPrepago.listadoProductosServicios[index].ProductoServicioResponse.tipoPermiso;

	            if (estado) {
	                if (focus == 'f') {
	                    $scope.datosRestablecerNoClientePrepago = $scope.listaNoEmpleadoPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias;
	                    $timeout(function() {
	                        if (parseInt(idNoClientePrepago) >= 0) {
	                            var idEditarAnt = "idEditarNoEmpleadoPrepago" + idNoClientePrepago;
	                            var idTextAnt = "idClassNoEmpleadoPrepago" + idNoClientePrepago;
	                            $("#" + idEditarAnt).addClass("input text").removeClass("focus error");
	                            $("#" + idTextAnt).addClass("editfield").removeClass("red");
	                            var datosRestablecerNoClientePrepago = '';
	                            var txtdatosRestablecerNoClientePrepago = '';
	                            if ($scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(idNoClientePrepago)].ProductoServicioResponse.alias == '') {
	                                datosRestablecerNoClientePrepago = $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(idNoClientePrepago)].ProductoServicioResponse.nombre;
	                                txtdatosRestablecerNoClientePrepago = 'editar';
	                            } else {
	                                datosRestablecerNoClientePrepago = $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(idNoClientePrepago)].ProductoServicioResponse.alias;
	                                txtdatosRestablecerNoClientePrepago = 'reestablecer';
	                            }
	                            $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(idNoClientePrepago)].ProductoServicioResponse.nombreAlias = datosRestablecerNoClientePrepago;
	                            $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(idNoClientePrepago)].ProductoServicioResponse.txtAccion = txtdatosRestablecerNoClientePrepago;
	                            $("#" + idTextAnt).html(txtdatosRestablecerNoClientePrepago);
	                        }
	                        $("#" + idText).html("guardar");
	                        $("#" + idEditar).addClass("input text focus").focus();
	                        $("#" + idEditar + " input").val("").focus();
	                        $("#" + idText).addClass("editfield red");
	                        $scope.KeyNoClientePrepago = index;
	                        idNoClientePrepago = index;
	                        accionPendienteNoCliente = false;
	                        $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.nombreAlias = '';
	                        $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                    }, 200);
	                } else {
	                    $scope.datosRestablecerNoClientePrepago = $scope.listaNoEmpleadoPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias;
	                    if (parseInt(idNoClientePrepago) >= 0) {
	                        var idEditarAnt = "idEditarNoEmpleadoPrepago" + idNoClientePrepago;
	                        var idTextAnt = "idClassNoEmpleadoPrepago" + idNoClientePrepago;
	                        $("#" + idEditarAnt).addClass("input text").removeClass("focus");
	                        $("#" + idTextAnt).addClass("editfield").removeClass("red");
	                        var datosRestablecerNoClientePrepago = '';
	                        var txtdatosRestablecerNoClientePrepago = '';
	                        if ($scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(idNoClientePrepago)].ProductoServicioResponse.alias == '') {
	                            datosRestablecerNoClientePrepago = $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(idNoClientePrepago)].ProductoServicioResponse.nombre;
	                            txtdatosRestablecerNoClientePrepago = 'editar';
	                        } else {
	                            datosRestablecerNoClientePrepago = $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(idNoClientePrepago)].ProductoServicioResponse.alias;
	                            txtdatosRestablecerNoClientePrepago = 'reestablecer';
	                        }
	                        $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(idNoClientePrepago)].ProductoServicioResponse.nombreAlias = datosRestablecerNoClientePrepago;
	                        $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(idNoClientePrepago)].ProductoServicioResponse.txtAccion = txtdatosRestablecerNoClientePrepago;
	                        $("#" + idTextAnt).html(txtdatosRestablecerNoClientePrepago);
	                    }
	                    $("#" + idText).html("guardar");
	                    $("#" + idEditar).addClass("input text focus").focus();
	                    $("#" + idEditar + " input").val("").focus();
	                    $("#" + idText).addClass("editfield red");
	                    $scope.KeyNoClientePrepago = index;
	                    idNoClientePrepago = index;
	                    accionPendienteNoCliente = false;
	                    $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.nombreAlias = '';
	                    $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                }
	            }
	            if (accionPendienteNoCliente) {
	                if (idNoClientePrepago == index) {
	                    var tipoLinea = $scope.listaNoEmpleadoPrepago.listadoProductosServicios[index].ProductoServicioResponse.tipoLinea;
	                    var tipoPermiso = $scope.listaNoEmpleadoPrepago.listadoProductosServicios[index].ProductoServicioResponse.tipoPermiso;
	                    if (acccion == 'guardar') {
	                        $timeout(function() {
	                            if ($scope.listaNoEmpleadoPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias == '') {
	                                $timeout(function() {
	                                    $("#" + idText).html("guardar");
	                                    $("#" + idEditar).addClass("input text focus error").focus();
	                                    $("#" + idEditar + " input").val("").focus();
	                                    $("#" + idText).addClass("editfield red");
	                                    $scope.KeyNoClientePrepago = index;
	                                    idNoClientePrepago = index;
	                                    accionPendienteNoCliente = true;
	                                    $scope.listaNoEmpleadoPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias = '';
	                                    $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                                }, 200);
	                            } else if (validarAlias($scope.listaNoEmpleadoPrepago.listadoProductosServicios, $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.nombreAlias, index)) {
	                                var datos = {
	                                    tipoOperacion: '1',
	                                    idAfectado: $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.idProductoServicio,
	                                    tipoAlias: '1',
	                                    idCuenta: '',
	                                    idDireccion: '',
	                                    descripcionAlias: $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.nombreAlias
	                                };
	                                $("#editarNoEmpleadoLoaderPrepago" + index).hide();
	                                datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                                TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                                    $scope.estadoAlias = response.data;
	                                    if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                        $("#" + idText).html("reestablecer");
	                                        $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                        $("#" + idText).addClass("editfield").removeClass("red");
	                                        $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.txtAccion = 'reestablecer';
	                                        $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.alias = $scope.listaNoEmpleadoPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias;
	                                        $scope.KeyNoClientePrepago = -1;
	                                        idNoClientePrepago = -1;
	                                        accionPendienteNoCliente = false;
	                                        $("#editarNoEmpleadoLoaderPrepago" + index).hide();
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, '-');
	                                    } else if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 6) {
	                                        $timeout(function() {
	                                            empleadoReestablecerPrepago($scope.KeyNoClientePrepago);
	                                            $("#msgErrorPhoneNum").show();
	                                            $("#editarNoEmpleadoLoaderPrepago" + index).hide();
	                                        }, 200);
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                    } else {
	                                        empleadoReestablecerPrepago($scope.KeyNoClientePrepago);
	                                        $("#editarNoEmpleadoLoaderPrepago" + index).hide();
	                                        auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                    }
	                                }, function(response) {
	                                    empleadoReestablecerPrepago($scope.KeyNoClientePrepago);
	                                    $("#editarNoEmpleadoLoaderPrepago" + index).hide();
	                                });
	                            } else {
	                                $timeout(function() {
	                                    empleadoReestablecerPrepago($scope.KeyNoClientePrepago);
	                                    $("#msgErrorPhoneNum").show();
	                                    $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '2';
	                                    $("#" + idEditar).addClass("input text").removeClass("focus error");
	                                    $("#" + idText).addClass("editfield").removeClass("red");
	                                    $scope.KeyNoClientePrepago = -1;
	                                    idNoClientePrepago = -1;
	                                    accionPendienteNoCliente = false;
	                                }, 200);
	                            }
	                        }, 200);
	                    } else if (acccion == 'reestablecer') {
	                        $timeout(function() {
	                            var datos = {
	                                tipoOperacion: '2',
	                                idAfectado: $scope.listaNoEmpleadoPrepago.listadoProductosServicios[index].ProductoServicioResponse.idProductoServicio,
	                                tipoAlias: '1',
	                                idCuenta: '',
	                                idDireccion: '',
	                                descripcionAlias: ''
	                            };
	                            $("#editarNoEmpleadoLoaderPrepago" + index).show();
	                            datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	                            TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                                $scope.estadoAlias = response.data;
	                                if (parseInt(response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idRespuesta) == 0) {
	                                    $scope.KeyNoClientePrepago = -1;
	                                    idNoClientePrepago = -1;
	                                    $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.nombreAlias = $scope.listaNoEmpleadoPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombre;
	                                    $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.alias = '';
	                                    $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.txtAccion = 'editar';
	                                    $("#" + idText).html("editar");
	                                    $("#" + idEditar).addClass("input text").removeClass("focus");
	                                    $("#" + idText).addClass("editfield").removeClass("red");
	                                    $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt(index)].ProductoServicioResponse.classEditar = '1';
	                                    accionPendienteNoCliente = false;
	                                    $("#editarNoEmpleadoLoaderPrepago" + index).hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, '-');
	                                } else {
	                                    empleadoReestablecerPrepago($scope.KeyNoClientePrepago);
	                                    accionPendienteNoCliente = false;
	                                    $("#editarNoEmpleadoLoaderPrepago" + index).hide();
	                                    auditoriaResquest(WPSTablaOperaciones.cambioAliasMovil, response.data.personalizarAliasCuentaResponse.defaultServiceResponse.idTransaccional, 'ERROR', servicioAuditoria, 'MOVIL', tipoLineaAuditoria, $scope.tipoLinea, perfilAuditoria, 'personalizarAliasCuenta - ' + response.data.personalizarAliasCuentaResponse.defaultServiceResponse.mensaje);
	                                }
	                            }, function(response) {
	                                empleadoReestablecerPrepago($scope.KeyNoClientePrepago);
	                                $("#editarNoEmpleadoLoaderPrepago" + index).hide();

	                            });
	                        }, 200);
	                    }
	                }
	            }
	        }

	        function empleadoReestablecerPrepago(KeyNoClientePrepago) {
	            if (parseInt($scope.KeyNoClientePrepago) >= 0) {
	                var idEditarNoEmpleadoPrepago = "idEditarNoEmpleadoPrepago" + $scope.KeyNoClientePrepago;
	                var idTextServicio = "idClassNoEmpleadoPrepago" + $scope.KeyNoClientePrepago;
	                if ($scope.txtdatosRestablecerNoClientePrepago == 'guardar') {
	                    $scope.txtdatosRestablecerNoClientePrepago = 'editar';
	                }
	                if ($scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt($scope.KeyNoClientePrepago)].ProductoServicioResponse.alias == '') {
	                    $scope.txtdatosRestablecerNoClientePrepago = 'editar';
	                } else {
	                    $scope.txtdatosRestablecerNoClientePrepago = 'reestablecer';
	                }
	                if ($scope.datosRestablecerNoClientePrepago == '' || typeof $scope.datosRestablecerNoClientePrepago == 'undefined') {
	                    if ($scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt($scope.KeyNoClientePrepago)].ProductoServicioResponse.alias == '') {
	                        $scope.datosRestablecerNoClientePrepago = $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt($scope.KeyNoClientePrepago)].ProductoServicioResponse.nombre;
	                        $scope.txtdatosRestablecerNoClientePrepago = 'editar';
	                    } else {
	                        $scope.datosRestablecerNoClientePrepago = $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt($scope.KeyNoClientePrepago)].ProductoServicioResponse.alias;
	                        $scope.txtdatosRestablecerNoClientePrepago = 'reestablecer';
	                    }
	                }
	                $("#" + idEditarNoEmpleadoPrepago).addClass("input text").removeClass("focus error");
	                $("#" + idTextServicio).addClass("editfield").removeClass("red");
	                $("#" + idEditarNoEmpleadoPrepago + " input").val($scope.datosRestablecerNoClientePrepago);
	                $("#" + idTextServicio).html($scope.txtdatosRestablecerNoClientePrepago);
	                $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt($scope.KeyNoClientePrepago)].ProductoServicioResponse.nombreAlias = $scope.datosRestablecerNoClientePrepago;
	                $scope.listaNoEmpleadoPrepago.listadoProductosServicios[parseInt($scope.KeyNoClientePrepago)].ProductoServicioResponse.txtAccion = $scope.txtdatosRestablecerNoClientePrepago;
	                $scope.KeyNoClientePrepago = -1;
	                accionPendienteNoCliente = false;
	            }
	        }

	        $scope.vinculenCuenta = function() {
	            var vincular = false;
	            if ($scope.vinculenCuentaClass == 'check') {
	                vincular = false;
	                $scope.vinculenCuentaClass = 'check checked';
	            } else {
	                vincular = true;
	                $scope.vinculenCuentaClass = 'check';
	            }
	            var datos = { vincular: vincular };
	            datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	            $("#loaderVinculenCuenta").addClass("show").removeAttr('style');
	            TuConfiguracionService.guardarCheckPermitirVincular(datos).then(function(response) {
	                if (parseInt(response.data.guardarCheckPermitirVincularResponse.defaultServiceResponse.idRespuesta) != 0) {
	                    if (!vincular) {
	                        $scope.vinculenCuentaClass = 'check';
	                    } else {
	                        $scope.vinculenCuentaClass = 'check checked';
	                    }
	                    auditoriaResquest(WPSTablaOperaciones.desvincularme, response.data.guardarCheckPermitirVincularResponse.defaultServiceResponse.idTransaccional, 'ERROR', '-', 'MOVIL', '5', $scope.tipoLinea, '-', response.data.guardarCheckPermitirVincularResponse.defaultServiceResponse.mensaje);
	                } else {
	                    auditoriaResquest(WPSTablaOperaciones.desvincularme, response.data.guardarCheckPermitirVincularResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', '-', 'MOVIL', '5', $scope.tipoLinea, '-', '-');
	                }
	                $("#loaderVinculenCuenta").removeClass("show");
	            }, function(response) {
	                $("#loaderVinculenCuenta").removeClass("show");
	            });
	        };

	        $scope.promociones = function() {
	            var booleanPromocion = true;
	            var code = '';
	            var textDescripcionoperacion = '';
	            if ($scope.promocionesClass == 'check') {
	                booleanPromocion = true;
	                textDescripcionoperacion = '-'
	                $scope.promocionesClass = 'check checked';
	                code = WPSTablaOperaciones.afiliarRecibirPromociones;
	            } else {
	                booleanPromocion = false;
	                $scope.promocionesClass = 'check';
	                textDescripcionoperacion = '-';
	                code = WPSTablaOperaciones.desafiliarRecibirPromociones;
	            }
	            $("#loaderPromocionesCheck").addClass("show").removeAttr('style');
	            var datos = { promociones: booleanPromocion };
	            datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	            TuConfiguracionService.guardarCheckPromociones(datos).then(function(response) {
	                if (parseInt(response.data.guardarCheckPromocionesResponse.defaultServiceResponse.idRespuesta) != 0) {
	                    if (booleanPromocion) {
	                        $scope.promocionesClass = 'check';
	                    } else {
	                        $scope.promocionesClass = 'check checked';
	                    }
	                    auditoriaResquest(code, response.data.guardarCheckPromocionesResponse.defaultServiceResponse.idTransaccional, 'ERROR', '-', 'MOVIL', '5', $scope.tipoLinea, '-', 'guardarCheckPromociones - ' + response.data.guardarCheckPromocionesResponse.defaultServiceResponse.mensaje);
	                } else {
	                    auditoriaResquest(code, response.data.guardarCheckPromocionesResponse.defaultServiceResponse.idTransaccional, 'SUCCESS', '-', 'MOVIL', '5', $scope.tipoLinea, '-', textDescripcionoperacion);
	                }
	                $("#loaderPromocionesCheck").removeClass("show");
	            }, function(response) {
	                $("#loaderPromociones").removeClass("show");
	            });
	        };

	        $scope.estadoBusquedaAutoCompleteLinea = -1;
	        $('#AutocompleteLinea').keyup(function(event) {
	            $scope.estadoBusquedaAutoCompleteLinea = 1;
	            event.stopPropagation();
	            $('.disabledLinea').prop('disabled', true).removeClass('mouse').css({ cursor: "default" });
	            $scope.focousAutoCompleteLinea = false;
	            $("#frBuscarLinea .search").removeClass("error");
	            $("#wpsCuenta select").prop('disabled', true);
	            $("#wpsRecibos select").prop('disabled', true);
	            if ($('#AutocompleteLinea').val().length == 0) {
	                $("#frBuscarLinea .search").removeClass("error");
	            }
	        });

	        $('#AutocompleteLinea').autocomplete({
	            lookup: function(query, done) {
	                buscarListadoLineas(done);
	            },
	            minChars: 4,
	            onSelect: function(suggestion) {
	                var txt = suggestion.data;
	                var id = arrayObjectIndexOfId($scope.listaAutocomplete, txt);
	                $timeout(function() {
	                    var datos = {
	                        categoria: WPSCategoria.movil,
	                        tipoLinea: WPSTipoLinea.todos,
	                        tipoCliente: WPSTipoCliente.corporativo,
	                        idProductoServicio: $scope.listaAutocomplete[id].idProductoServicio,
	                        tipoPermiso: WPSTipoPermiso.todos,
	                        idCuenta: $scope.listaAutocomplete[id].idCuenta,
	                        idRecibo: $scope.listaAutocomplete[id].idRecibo,
	                        idDireccion: "",
	                        nombreProducto: '',
	                        pagina: WPSpaginacion.pagina,
	                        cantResultadosPagina: WPSpaginacion.cantResultadosPagina,
	                        productoPrincipalXidRecibo: "false",
	                        titularidadServicio: WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado
	                    };

	                    obtenerServicios(datos);
	                }, 200);
	            }
	        });


	        $scope.blurAutocompleteLinea = function() {
	            $('.disabledLinea').prop('disabled', true).removeClass('mouse').css({ cursor: "default" });
	            $("#wpsCuenta select").prop('disabled', true);
	            $("#wpsRecibos select").prop('disabled', true);
	            $scope.focousAutoCompleteLinea = false;
	        }

	        function buscarListadoLineas(done) {
	            var valorinput = $('#AutocompleteLinea').val();
	            var requestBusqueda = {
	                tipoLinea: WPSTipoLinea.todos,
	                tipoCliente: WPSTipoCliente.corporativo,
	                tipoPermiso: WPSTipoPermiso.todos,
	                idCuenta: '',
	                idRecibo: '',
	                criterioBusqueda: valorinput,
	                pagina: WPSpaginacion.pagina,
	                cantResultadosPagina: WPSpaginacion.cantResultadosPagina,
	                titularidadServicio: WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado
	            };
	            requestBusqueda = $httpParamSerializer({ requestJson: angular.toJson(requestBusqueda) });
	            var arrayAutocomplete = [];
	            TuConfiguracionService.obtenerListadoMoviles(requestBusqueda).then(function(response) {
	                var rptaExito = response.data.obtenerListadoMovilesResponse.defaultServiceResponse.idRespuesta;
	                if (rptaExito == 0) {
	                    if (response.data.obtenerListadoMovilesResponse.listadoProductosServicios == undefined || response.data.obtenerListadoMovilesResponse.listadoProductosServicios == '') {
	                        arrayAutocomplete = [];
	                        $('.autocomplete-suggestion').remove();
	                        $('.autocomplete-suggestion').empty();

	                    } else {
	                        $scope.listaAutocomplete = response.data.obtenerListadoMovilesResponse.listadoProductosServicios;
	                        if (!Array.isArray($scope.listaAutocomplete)) {
	                            $scope.listaAutocomplete = [];
	                            $scope.listaAutocomplete.push(response.data.obtenerListadoMovilesResponse.listadoProductosServicios);
	                        }

	                        angular.forEach($scope.listaAutocomplete, function(val, key) {
	                            arrayAutocomplete.push({
	                                value: val.nombreAlias,
	                                data: val.idProductoServicio
	                            });
	                        });

	                        var result = {
	                            suggestions: arrayAutocomplete
	                        };
	                        done(result);
	                    }
	                } else if (rptaExito > 0) {

	                } else {

	                }
	            }, function(error) {

	            });
	        };

	        $('#AutocompletePerfil').keyup(function(event) {
	            $scope.estadoAutocompletePerfil = 1;
	            event.stopPropagation();
	            $("#frFilterLinea .search").removeClass("error");


	        });

	        $('#AutocompletePerfil').autocomplete({
	            lookup: function(query, done) {
	                buscarListadoMovilesAfiliados(done);
	            },
	            minChars: 4,
	            onSelect: function(suggestion) {
	                var idDataServicio = suggestion.data;
	                var id = parseInt(arrayObjectIndexOfId($scope.listaAutocompleteAfiliados, idDataServicio));
	                $timeout(function() {
	                    if ($scope.listaCorporativoObtenerMovilesAfiliados.length > 0) {
	                        $scope.listaCorporativoObtenerMovilesAfiliados = [];
	                    }
	                    var datos = {
	                        idProductoServicio: $scope.listaAutocompleteAfiliados[id].idProductoServicio,
	                        nombreProducto: $scope.listaAutocompleteAfiliados[id].nombreAlias,
	                        tipoCliente: '2',
	                        idCuenta: $scope.listaAutocompleteAfiliados[id].idCuenta,
	                        idRecibo: $scope.listaAutocompleteAfiliados[id].idRecibo,
	                        pagina: "1",
	                        cantResultadosPagina: "10",
	                    };
	                    obtenerServiciosPerfil(datos);
	                }, 200);
	            }
	        });



	        function buscarListadoMovilesAfiliados(done) {
	            var valorinput = $('#AutocompletePerfil').val();
	            var arrayAutocomplete = [];
	            var requestBusqueda = {
	                tipoCliente: '',
	                idCuenta: '',
	                idRecibo: '',
	                criterioBusqueda: valorinput,
	                pagina: '1',
	                cantResultadosPagina: '10'
	            };

	            requestBusqueda = $httpParamSerializer({ requestJson: angular.toJson(requestBusqueda) });
	            TuConfiguracionService.obtenerListadoMovilesAfiliados(requestBusqueda).then(function(response) {
	                var rptaExito = response.data.obtenerListadoMovilesAfiliadosResponse.defaultServiceResponse.idRespuesta;
	                if (rptaExito == 0) {
	                    $scope.listaAutocompleteAfiliados = response.data.obtenerListadoMovilesAfiliadosResponse.listadoProductosServicios;
	                    angular.forEach($scope.listaAutocompleteAfiliados, function(val, key) {
	                        arrayAutocomplete.push({
	                            value: val.nombreAlias,
	                            data: val.idProductoServicio
	                        });
	                    });
	                    var result = {
	                        suggestions: arrayAutocomplete
	                    };
	                    done(result);
	                } else if (rptaExito > 0) {

	                } else {

	                }
	            }, function(error) {

	            });
	        };


	        $(window).click(function(e) {
	            if (parseInt($scope.keyPostpago) >= 0) {
	                var idEditar = "idEditarPostpago" + $scope.keyPostpago;
	                var idText = "idClassPostpago" + $scope.keyPostpago;
	                if ($scope.txtRestablecerPostpago == 'guardar') {
	                    $scope.txtRestablecerPostpago = 'editar';
	                }
	                $("#" + idEditar).removeClass("focus error");
	                $("#" + idText).removeClass("red");
	                $("#" + idEditar + " input").val($scope.datosRestablecerPostpago);
	                $("#" + idText).html($scope.txtRestablecerPostpago);
	                $scope.listadoLineasPostpago.listadoProductosServicios[parseInt($scope.keyPostpago)].ProductoServicioResponse.nombreAlias = $scope.datosRestablecerPostpago;
	                $scope.keyPostpago = -1;
	                idPostpago = -1;
	                accionPendiente = false;

	            }


	            if (parseInt($scope.keyPrepago) >= 0) {
	                var idEditar = "idEditarPrepago" + $scope.keyPrepago;
	                var idText = "idClassPrepago" + $scope.keyPrepago;
	                if ($scope.txtRestablecerPrepago == 'guardar') {
	                    $scope.txtRestablecerPrepago = 'editar';
	                }
	                $("#" + idEditar).addClass("input text").removeClass("focus error");
	                $("#" + idText).addClass("editfield").removeClass("red");
	                $("#" + idEditar + " input").val($scope.datosRestablecerPrepago);
	                $("#" + idText).html($scope.txtRestablecerPrepago);
	                $scope.listaLineaPrepago.listadoProductosServicios[parseInt($scope.keyPrepago)].ProductoServicioResponse.nombreAlias = $scope.datosRestablecerPrepago;
	                $scope.listaLineaPrepago.listadoProductosServicios[parseInt($scope.keyPrepago)].ProductoServicioResponse.txtAccion = $scope.txtRestablecerPrepago;
	                $scope.keyPrepago = -1;
	                idPrepago = -1;
	                accionPendiente = false;
	            }

	            if (parseInt($scope.keyColumna01) >= 0) {
	                var idEditar = "idEditarColumna01" + $scope.keyColumna01;
	                var idText = "idClassColumna01" + $scope.keyColumna01;
	                if ($scope.txtRestablecerColumna01 == 'guardar') {
	                    $scope.txtRestablecerColumna01 = 'editar';
	                }
	                $("#" + idEditar).addClass("input text").removeClass("focus error");
	                $("#" + idText).addClass("editfield").removeClass("red");
	                $("#" + idEditar + " input").val($scope.datosRestablecerColumna01);
	                $("#" + idText).html($scope.txtRestablecerColumna01);
	                $scope.listaLineaColumna01[parseInt($scope.keyColumna01)].ProductoServicioResponse.nombreAlias = $scope.datosRestablecerColumna01;
	                $scope.listaLineaColumna01[parseInt($scope.keyColumna01)].ProductoServicioResponse.txtAccion = $scope.txtRestablecerColumna01;
	                $scope.keyColumna01 = -1;
	                idColumn01 = -1;
	                accionPendienteColumna = false
	            }
	            if (parseInt($scope.keyColumna02) >= 0) {
	                var idEditar = "idEditarColumna02" + $scope.keyColumna02;
	                var idText = "idClassColumna02" + $scope.keyColumna02;
	                if ($scope.txtRestablecerColumna02 == 'guardar') {
	                    $scope.txtRestablecerColumna02 = 'editar';
	                }
	                $("#" + idEditar).addClass("input text").removeClass("focus error");
	                $("#" + idText).addClass("editfield").removeClass("red");
	                $("#" + idEditar + " input").val($scope.datosRestablecerColumna02);
	                $("#" + idText).html($scope.txtRestablecerColumna02);
	                $scope.listaLineaColumna02[parseInt($scope.keyColumna02)].ProductoServicioResponse.nombreAlias = $scope.datosRestablecerColumna02;
	                $scope.listaLineaColumna01[parseInt($scope.keyColumna02)].ProductoServicioResponse.txtAccion = $scope.txtRestablecerColumna02;
	                $scope.keyColumna02 = -1;
	                idColumn02 = -1;
	                accionPendienteColumna = false
	            }

	            if (parseInt($scope.keyServicioDireccion) >= 0) {
	                var idEditar = "idEditarServicioDireccion" + $scope.keyServicioDireccion;
	                var idText = "idClassServicioDireccion" + $scope.keyServicioDireccion;
	                if ($scope.keyServicioDireccion == 'guardar') {
	                    $scope.keyServicioDireccion = 'editar';
	                }
	                $("#" + idEditar).addClass("input textbig").removeClass("focus error");
	                $("#" + idText).addClass("editfield").removeClass("red");
	                $("#" + idEditar + " input").val($scope.datosRestablecerServicioDireccion);
	                $("#" + idText).html($scope.txtRestablecerServicioDireccion);
	                $scope.servicioDirecccion.listadoProductosServicios[parseInt($scope.keyServicioDireccion)].ProductoServicioResponse.nombreAlias = $scope.datosRestablecerServicioDireccion;
	                $scope.keyServicioDireccion = -1;
	            }


	            if (parseInt($scope.keyServicio) >= 0) {
	                var idEditar = "idEditarServicioDireccion" + $scope.keyServicio;
	                var idText = "idClassServicioDireccion" + $scope.keyServicio;
	                if ($scope.txtRestablecerServicio == 'guardar') {
	                    $scope.txtRestablecerServicio = 'editar';
	                }
	                if ($scope.servicioDirecccion.listadoProductosServicios[parseInt($scope.keyServicio)].ProductoServicioResponse.alias == '') {
	                    $scope.txtRestablecerServicio = 'editar';
	                } else {
	                    $scope.txtRestablecerServicio = 'reestablecer';
	                }
	                $("#" + idEditar).addClass("input textbig").removeClass("focus error");
	                $("#" + idText).addClass("editfield").removeClass("red");
	                $("#" + idEditar + " input").val($scope.datosRestablecerServicio);
	                $("#" + idText).html($scope.txtRestablecerServicio);
	                $scope.servicioDirecccion.listadoProductosServicios[parseInt($scope.keyServicio)].ProductoServicioResponse.nombreAlias = $scope.datosRestablecerServicio;
	                $scope.keyServicio = -1;
	                idPostpago = -1;
	                accionPendienteServicio = false;
	            }

	            if (parseInt($scope.KeyNoCliente) >= 0) {
	                $timeout(function() {
	                    var index = parseInt($scope.KeyNoCliente);
	                    var idEditar = "idEditarNoEmpleado" + index
	                    var idText = "idClassNoEmpleado" + index;
	                    if ($scope.txtRestablecerNoCliente == 'guardar') {
	                        $scope.txtRestablecerNoCliente = 'editar';
	                    }
	                    $("#" + idEditar).removeClass('focus error');
	                    $("#" + idText).removeClass('red');
	                    $("#" + idEditar + " input").val($scope.datosRestablecerNoCliente);
	                    $("#" + idText).html($scope.txtRestablecerNoCliente);
	                    $scope.listaNoEmpleado.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias = $scope.datosRestablecerNoCliente;
	                    $scope.listaNoEmpleado.listadoProductosServicios[index].ProductoServicioResponse.txtAccion = $scope.txtRestablecerNoCliente;
	                    $scope.keyNoCliente = -1;
	                    idNoCliente = -1;
	                    accionPendienteNoCliente = false;
	                }, 200);
	            }

	            if (parseInt($scope.KeyNoClientePrepago) >= 0) {
	                $timeout(function() {
	                    var index = parseInt($scope.KeyNoClientePrepago);
	                    var idEditar = "idEditarNoEmpleadoPrepago" + index
	                    var idText = "idClassNoEmpleadoPrepago" + index;
	                    if ($scope.txtdatosRestablecerNoClientePrepago == 'guardar') {
	                        $scope.txtdatosRestablecerNoClientePrepago = 'editar';
	                    }
	                    $("#" + idEditar).removeClass('focus error');
	                    $("#" + idText).removeClass('red');
	                    $("#" + idEditar + " input").val($scope.datosRestablecerNoClientePrepago);
	                    $("#" + idText).html($scope.txtdatosRestablecerNoClientePrepago);
	                    $scope.listaNoEmpleadoPrepago.listadoProductosServicios[index].ProductoServicioResponse.nombreAlias = $scope.datosRestablecerNoClientePrepago;
	                    $scope.listaNoEmpleadoPrepago.listadoProductosServicios[index].ProductoServicioResponse.txtAccion = $scope.txtdatosRestablecerNoClientePrepago;
	                    $scope.keyNoCliente = -1;
	                    idNoCliente = -1;
	                    accionPendienteNoCliente = false;
	                }, 200);
	            }


	            if (parseInt($scope.estadoBusquedaAutoCompleteLinea) >= 0) {
	                $('.disabledLinea').prop('disabled', false).addClass('mouse').css({ 'cursor': "pointer" });
	                $("#wpsCuenta select").prop('disabled', false);
	                $("#wpsRecibos select").prop('disabled', false);
	                $scope.estadoBusquedaAutoCompleteLinea = -1;
	                $scope.focousAutoCompleteLinea = true;
	                $("#frBuscarLinea .search").removeClass("error");
	            }
	            if (parseInt($scope.indexSeleccionarCuenta) >= 0) {
	                $timeout(function() {
	                    $("#editaCuenta").addClass('');
	                    $('#hideCuenta').show();
	                    $('#editaCuentaNumero').hide();
	                    $scope.selectCuenta.txtAccion = 'editar';
	                    $("#Cuenta").removeClass('red');
	                    $("#Cuenta").html("editar");
	                    $("#wpsCuenta").removeAttr("style");
	                    $scope.listaCuenta.listadoCuenta[parseInt($scope.indexSeleccionarCuenta)].txtAccion = 'editar';
	                    $scope.selectCuenta.nombreAlias = $scope.listaCuenta.listadoCuenta[parseInt($scope.indexSeleccionarCuenta)].nombreCuenta;
	                    $scope.selectCuenta.nombreCuentaAlterno = '';
	                    $scope.estadoOc = false;

	                }, 200);
	            }

	            if (parseInt($scope.indexSeleccionarRecibo) >= 0) {
	                $timeout(function() {
	                    $scope.editaRecibo = '';
	                    $('#hideRecibo').show();
	                    $("#editaReciboNumero").hide();
	                    $("#Recibo").removeClass('red');
	                    $("#ocultarRecibo").removeAttr("style");
	                    $scope.selectRecibo.txtAccion = 'editar';
	                    $("#Recibo").html("editar");
	                    $scope.listaRecibo.listadoRecibo[parseInt($scope.indexSeleccionarRecibo)].txtAccion = 'editar';
	                    $scope.selectRecibo.nombreAlias = $scope.listaRecibo.listadoRecibo[parseInt($scope.indexSeleccionarRecibo)].nombreRecibo;
	                    $scope.selectRecibo.nombreReciboAlterno = '';

	                }, 200);
	            }
	            if (parseInt($scope.indexSeleccionarDireccion) >= 0) {
	                $timeout(function() {
	                    $scope.selectDireccion.txtAccion = 'editar';
	                    $("#direccion").removeClass('red');
	                    $("#direccion").html("editar");
	                    $scope.listaDireccion.listadoDireccion[parseInt($scope.indexSeleccionarDireccion)].txtAccion = 'editar';
	                    $scope.editaDireccion = '';
	                    $("#ocultarDireccion").removeAttr("style");
	                    $scope.selectDireccion.nombreAlias = $scope.listaDireccion.listadoDireccion[parseInt($scope.indexSeleccionarDireccion)].nombreDireccion;
	                    $scope.selectDireccion.nombreDireccionAlterno = '';
	                    $('#hideDireccion').show();
	                    $("#focusEditaDireccion").hide();
	                }, 200);
	            }

	            if (parseInt($scope.estadoAutocompletePerfil) >= 0) {
	                $scope.txtBuscarLineaPerfil = '';
	                $scope.estadoAutocompletePerfil = -1;
	                $("#frFilterLinea .search").removeClass('error');
	                $("#AutocompletePerfil").val('');
	            }

	        });

	        $("#regresaClaro").click(function() {
	            $.removeCookie('CuentasClaroWPSRetornar', { path: '/' });
	            var href = '/wps/myportal/cuentasclaro/root/consumer';
	            $(location).attr('href', href);

	        });


	        function validarCuenta(cuenta) {
	            var estado = true
	            if ($.trim(cuenta) == '') {
	                return false;
	            }
	            var cantidad = Object.keys($scope.listaCuenta.listadoCuenta).length;
	            for (var i = 0; i < cantidad; i++) {

	                if ($scope.listaCuenta.listadoCuenta[i].nombreCuenta == cuenta) {
	                    estado = false;
	                }
	            }
	            return estado;
	        }

	        function validarDireccion(direccion) {
	            var estado = true
	            if (direccion == '') {
	                return false;
	            }

	            var cantidad = Object.keys($scope.listaServicioDirecccion).length;
	            for (var i = 0; i < cantidad; i++) {
	                if ($scope.listaServicioDirecccion[i].nombreAlias == direccion) {
	                    estado = false;
	                }
	            }
	            return estado;
	        }

	        function validaRecibo(recibo) {
	            var estado = true
	            if ($.trim(recibo) == '') {
	                return false;
	            }
	            var cantidad = Object.keys($scope.listaRecibo.listadoRecibo).length;
	            for (var i = 0; i < cantidad; i++) {
	                if ($scope.listaRecibo.listadoRecibo[i].nombreAlias == recibo.trim()) {
	                    estado = false;
	                }
	            }
	            return estado;
	        }

	        function personalizarAliasCuenta(datos) {
	            datos = $httpParamSerializer({ requestJson: angular.toJson(datos) });
	            TuConfiguracionService.personalizarAliasCuenta(datos).then(function(response) {
	                $scope.estadoAlias = response.data;
	            }, function(error) {

	            });

	        }

	        function auditoriaResquest(code, id, estado, servicio, tipoProducto, tipoLinea, tipoUsuario, perfil, descrip) {
	            var ResquestAuditoria = {
	                operationCode: code,
	                pagina: WPSPageID.cuentasclaro_tuconfiguracion,
	                transactionId: id,
	                estado: estado,
	                servicio: servicio,
	                tipoProducto: tipoProducto,
	                tipoLinea: tipoLinea,
	                tipoUsuario: tipoUsuario,
	                perfil: perfil,
	                monto: '',
	                descripcionoperacion: descrip,
	                responseType: '/'
	            };
	            auditoria(ResquestAuditoria);

	        }

	        function auditoria(ResquestAuditoria) {
	            ResquestAuditoria = $httpParamSerializer({ requestJson: angular.toJson(ResquestAuditoria) });
	            TuConfiguracionService.enviarAuditoria(ResquestAuditoria).then(function(response) {

	            }, function(error) {

	            });

	        }

	        function ocultar() {
	            if (parseInt($scope.estadoMovilContent) == 0) {
	                $('#ocultarMovil').hide();
	                $scope.estadoFijo();
	            } else {
	                $('#ocultarMovil').show();
	                $scope.estadoMovil();
	            }
	        }

	        function limpiar() {
	            if ($scope.listaLineaColumna01.length > 0) {
	                $scope.listaLineaColumna01 = [];
	            }
	            if ($scope.listaLineaColumna02.length > 0) {
	                $scope.listaLineaColumna02 = [];
	            }

	        }

	        function limpiarlistaRecibo() {
	            if ($scope.listaRecibo.length > 0) {

	                $scope.listaRecibo = [];
	            }
	        }

	        function limpiarPerfil() {
	            if ($scope.listadoProductosPerfil.length > 0) {
	                $scope.listadoProductosPerfil = [];
	            }
	        }


	        function limpiarlistaReciboPerfil() {
	            if (Object.keys($scope.listaReciboPerfil).length > 0) {
	                $scope.listaReciboPerfil = [];
	            }
	        }


	        function arrayObjectIndexOf(arr, obj) {
	            for (var i = 0, k = arr.length; i < k; i++) {
	                if (arr[i].nombreAlias == obj) {
	                    return i;
	                }
	            };
	            return -1;
	        };

	        function arrayObjectIndexOfId(arr, obj) {
	            for (var i = 0, k = arr.length; i < k; i++) {
	                if (arr[i].idProductoServicio == obj) {
	                    return i;
	                }
	            };
	            return -1;
	        };

	        function obtenerIdUrl(arr, obj) {
	            for (var i = 0; i < arr.length; i++) {
	                if (arr[i].idLink == obj) {

	                    return i;
	                }
	            }
	        }

	        function validarAlias(arr, obj, index) {
	            var bool = true;
	            if ($.trim(obj) == '') {
	                return false;
	            }
	            for (var i = 0, k = arr.length; i < k; i++) {
	                if (i == index) {
	                    bool = true;
	                } else {
	                    if (arr[i].ProductoServicioResponse.nombreAlias == obj) {
	                        return false;
	                    }
	                }
	            }

	            return bool;
	        };


	    })

	}]);
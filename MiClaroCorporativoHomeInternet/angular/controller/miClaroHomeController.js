miClaroApp.controller("MiClaroHomeController", function($scope, $http, $httpParamSerializer, serviceHomeMoviles) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion03;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion03;

    var tipoLinea = 3;
    var pagina = 0;
    var cantResultadosPagina = 0;
    $scope.tipoClienteSession = '';
    $scope.nombreAliasaMostrar = '';
    var tipoClienteCorporativoInternet = 5;
    var categoria = 3;
    var tipoCliente = 2;
    var tipoPermiso = 5;
    var titularidadServicio = 7;
    var productoPrincipalXidRecibo = false;
    var allSuccess = true;
    var firstRender = true;
    $scope.estadoServicioFlag = null;
    $scope.planInternetFlag = null;
    $scope.errorFuncional = null;
    $scope.listaDireccionesFlag = null;
    $scope.listaServiciosFlag = null;
    $scope.switchSelect = true;
	var ResquestAuditoria = {
                        operationCode: 'T0001',
                        pagina: 'P048',
                        transactionId: '',
                        estado: '',
                        servicio: '-',
                        tipoProducto: 'INTERNET',
                        tipoLinea: '-',
                        tipoUsuario: '2',
                        perfil: '-',
                        monto: '',
                        descripcionoperacion: '-',
                        responseType: '/'
                    };

    serviceHomeMoviles.getObtenerFlagProductoInternet().then(function(response) {

        $scope.flagServiciosInternet = response.data.comunResponseType.flagProductoInternetSesion;
        $scope.ErrorFlagInternet = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        $scope.FlagInternetIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
        $scope.tipoClienteUsuario = response.data.comunResponseType.tipoCliente;
        $scope.tipoLineaUsuario = response.data.comunResponseType.tipoLinea;

        if ($scope.tipoClienteUsuario == 4) {
            $scope.showSwitch = true;
        }

        if ($scope.ErrorFlagInternet == 0) {
            if ($scope.flagServiciosInternet != "-1") {
                if ($scope.flagServiciosInternet == 2 || $scope.flagServiciosInternet == 3) {
                    $scope.init();
                } else {
                    $("#internet").show();
             
                }
            } else {
                $("#internet").show();
                
                allSuccess = false;
            }
        } else {
            $("#internet").show();
            
            allSuccess = false;
        }

    });

    $scope.init = function() {
        serviceHomeMoviles.getObtenerServicioPrincipal().then(function(response) {
            $scope.idCuentaPrincipal = response.data.comunResponseType.idCuenta;
            $scope.idDireccion = response.data.comunResponseType.idDireccion;
            $scope.idLinea = response.data.comunResponseType.idLinea;
            $scope.idReciboPrincipal = response.data.comunResponseType.idRecibo;
            $scope.nombreAliasaMostrar = response.data.comunResponseType.nombreProductoPrincipal;
            $scope.idServicio = response.data.comunResponseType.productoPrincipal;
            $scope.errorFuncional = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            $scope.tipoCliente = response.data.comunResponseType.tipoClienteProductoPrincipal;
            $scope.categoria = response.data.comunResponseType.categoria;
            $scope.servPrincipalIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            $scope.servPrincipalMensaje = response.data.comunResponseType.defaultServiceResponse.mensaje;

            if ($scope.errorFuncional == 0) {
                if ($scope.tipoCliente == 2) {
                    if ($scope.categoria == 3) {
                        obtenerServicioxIdDireccion();
                        getObtenerDetallePlanInternetWS($scope.idDireccion, $scope.idServicio);
                        aniamteBox(".box");
                    } else {
                        obtenerServicioxIdDireccionDefault();
                        aniamteBox(".box");
                    }
                } else {
                    obtenerServicioxIdDireccionDefault();
                    aniamteBox(".box");
                }
            } else {
                $("#internet").show();
                
                allSuccess = false;
            }

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


        }, function(error) {

        });
    }

    function obtenerServicioxIdDireccion() {
        var requestObtenerDirecciones = {
            "tipoCliente": null
        };
        requestObtenerDirecciones.tipoCliente = tipoClienteCorporativoInternet;

        dataDir = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerDirecciones) });
        serviceHomeMoviles.getObtenerListadoFijoDireccionWS(dataDir).then(function(response) {
            $scope.listaDirecciones = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;
            $scope.listaDireccionesFlag = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.mensaje;

            if ($scope.listaDireccionesFlag == 0) {
                if (Array.isArray($scope.listaDirecciones)) {
                    angular.forEach($scope.listaDirecciones, function(val, key) {
                        if (val.idDireccion == $scope.idDireccion) {
                            $scope.selectedIdDireccion = $scope.listaDirecciones[key];
                        }
                    });
                } else {
                    $scope.listaDirecciones = [];
                    $scope.listaDirecciones.push(response.data.obtenerListadoFijoDireccionResponse.listadoDireccion);
                    $scope.selectedIdDireccion = $scope.listaDirecciones[0];
                }
            } else {
                $("#internet").show();
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerListadoFijoDireccion - "+mensaje;
				auditoria();
                allSuccess = false;
            }


            var requestDatosServicios = {
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
            requestDatosServicios.categoria = categoria;
            requestDatosServicios.tipoLinea = tipoLinea;
            requestDatosServicios.tipoCliente = tipoCliente;
            requestDatosServicios.tipoPermiso = tipoPermiso;
            requestDatosServicios.idDireccion = $scope.selectedIdDireccion.idDireccion;
            requestDatosServicios.pagina = pagina;
            requestDatosServicios.cantResultadosPagina = cantResultadosPagina;
            requestDatosServicios.titularidadServicio = titularidadServicio;
            requestDatosServicios.productoPrincipalXidRecibo = productoPrincipalXidRecibo;

            dataMoviles = $httpParamSerializer({ requestJson: angular.toJson(requestDatosServicios) });
            serviceHomeMoviles.getobtenerServiciosMoviles(dataMoviles).then(function(response) {
                $scope.listServiciosMoviles = response.data.obtenerServiciosResponse.listadoProductosServicios;
                $scope.listaServiciosFlag = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
                ResquestAuditoria.transactionId = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                var mensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;

                if ($scope.listaServiciosFlag == 0) {
                    if (Array.isArray($scope.listServiciosMoviles)) {
                        angular.forEach($scope.listServiciosMoviles, function(val, key) {
                            if (val.ProductoServicioResponse.idProductoServicio == $scope.idServicio) {
                                $scope.selectedIdProductoServicio = $scope.listServiciosMoviles[key];
								ResquestAuditoria.servicio=$scope.selectedIdProductoServicio.ProductoServicioResponse.nombre;
								ResquestAuditoria.tipoLinea=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoLinea;
								ResquestAuditoria.perfil=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoPermiso;
                            }
                        });
                        obtenerEstadoServicio();
                    } else {
                        $scope.listServiciosMoviles = [];
                        $scope.listServiciosMoviles.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                        $scope.selectedIdProductoServicio = $scope.listServiciosMoviles[0];
						ResquestAuditoria.servicio=$scope.selectedIdProductoServicio.ProductoServicioResponse.nombre;
						ResquestAuditoria.tipoLinea=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoLinea;
						ResquestAuditoria.perfil=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoPermiso;
                        obtenerEstadoServicio();
                    }
                } else {
                    $("#internet").show();
					ResquestAuditoria.estado = "ERROR";
					ResquestAuditoria.descripcionoperacion = "obtenerServicios - "+mensaje;
					auditoria();
                    allSuccess = false;
                }


            }, function(error) {

            });
        }, function(error) {

        });
    };

    function obtenerServicioxIdDireccionDefault() {
        var requestObtenerDirecciones = {
            "tipoCliente": null
        };
        requestObtenerDirecciones.tipoCliente = tipoClienteCorporativoInternet;

        dataDir = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerDirecciones) });
        serviceHomeMoviles.getObtenerListadoFijoDireccionWS(dataDir).then(function(response) {
            $scope.listaDirecciones = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;
            $scope.listaDireccionesFlag = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.mensaje;

            if ($scope.listaDireccionesFlag == 0) {
                if (Array.isArray($scope.listaDirecciones)) {
                    $scope.selectedIdDireccion = $scope.listaDirecciones[0];
                } else {
                    $scope.listaDirecciones = [];
                    $scope.listaDirecciones.push(response.data.obtenerListadoFijoDireccionResponse.listadoDireccion);
                    $scope.selectedIdDireccion = $scope.listaDirecciones[0];
                }
            } else {
                $("#internet").show();
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerListadoFijoDireccion - "+mensaje;
				auditoria();
                allSuccess = false;
            }


            var requestDatosServicios = {
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
            requestDatosServicios.categoria = categoria;
            requestDatosServicios.tipoLinea = tipoLinea;
            requestDatosServicios.tipoCliente = tipoCliente;
            requestDatosServicios.tipoPermiso = tipoPermiso;
            requestDatosServicios.idDireccion = $scope.selectedIdDireccion.idDireccion;
            requestDatosServicios.pagina = pagina;
            requestDatosServicios.cantResultadosPagina = cantResultadosPagina;
            requestDatosServicios.titularidadServicio = titularidadServicio;
            requestDatosServicios.productoPrincipalXidRecibo = productoPrincipalXidRecibo;

            dataMoviles = $httpParamSerializer({ requestJson: angular.toJson(requestDatosServicios) });
            serviceHomeMoviles.getobtenerServiciosMoviles(dataMoviles).then(function(response) {
                $scope.listServiciosMoviles = response.data.obtenerServiciosResponse.listadoProductosServicios;
                $scope.listaServiciosFlag = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
                ResquestAuditoria.transactionId = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                var mensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;

                if ($scope.listaServiciosFlag == 0) {
                    if (Array.isArray($scope.listServiciosMoviles)) {
                        $scope.selectedIdProductoServicio = $scope.listServiciosMoviles[0];
                        $scope.idDireccion = $scope.selectedIdProductoServicio.ProductoServicioResponse.idDireccion;
                        $scope.idServicio = $scope.selectedIdProductoServicio.ProductoServicioResponse.idProductoServicio;
						ResquestAuditoria.servicio=$scope.selectedIdProductoServicio.ProductoServicioResponse.nombre;
						ResquestAuditoria.tipoLinea=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoLinea;
						ResquestAuditoria.perfil=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoPermiso;

                        obtenerEstadoServicio();
                        getObtenerDetallePlanInternetWS($scope.idDireccion, $scope.idServicio);
                        actualizarProductoPrincipalSesion($scope.selectedIdProductoServicio);
                    } else {
                        $scope.listServiciosMoviles = [];
                        $scope.listServiciosMoviles.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                        $scope.selectedIdProductoServicio = $scope.listServiciosMoviles[0];
                        $scope.idDireccion = $scope.selectedIdProductoServicio.ProductoServicioResponse.idDireccion;
                        $scope.idServicio = $scope.selectedIdProductoServicio.ProductoServicioResponse.idProductoServicio;
						ResquestAuditoria.servicio=$scope.selectedIdProductoServicio.ProductoServicioResponse.nombre;
						ResquestAuditoria.tipoLinea=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoLinea;
						ResquestAuditoria.perfil=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoPermiso;

                        obtenerEstadoServicio();
                        getObtenerDetallePlanInternetWS($scope.idDireccion, $scope.idServicio);
                        actualizarProductoPrincipalSesion($scope.selectedIdProductoServicio);
                    }
                } else {
                    $("#internet").show();
					ResquestAuditoria.estado = "ERROR";
					ResquestAuditoria.descripcionoperacion = "obtenerServicios - "+mensaje;
					auditoria();
                    allSuccess = false;
                }

            }, function(error) {

            });
        }, function(error) {

        });
    };

    $scope.cambioDireccion = function() {

        $scope.estadoServicioFlag = null;
        $scope.planInternetFlag = null;

        aniamteBox(".box");

        var idDir = $scope.selectedIdDireccion.idDireccion;

        var requestDatosServicios = {
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
        requestDatosServicios.categoria = categoria;
        requestDatosServicios.tipoLinea = tipoLinea;
        requestDatosServicios.tipoCliente = tipoCliente;
        requestDatosServicios.tipoPermiso = tipoPermiso;
        requestDatosServicios.idDireccion = idDir;
        requestDatosServicios.pagina = pagina;
        requestDatosServicios.cantResultadosPagina = cantResultadosPagina;
        requestDatosServicios.titularidadServicio = titularidadServicio;
        requestDatosServicios.productoPrincipalXidRecibo = productoPrincipalXidRecibo;

        dataMoviles = $httpParamSerializer({ requestJson: angular.toJson(requestDatosServicios) });
        serviceHomeMoviles.getobtenerServiciosMoviles(dataMoviles).then(function(response) {
            $scope.listServiciosMoviles = response.data.obtenerServiciosResponse.listadoProductosServicios;
            $scope.listaServiciosFlag = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;

            if ($scope.listaServiciosFlag == 0) {
                if (Array.isArray($scope.listServiciosMoviles)) {
                    angular.forEach($scope.listServiciosMoviles, function(val, key) {
                        $scope.selectedIdProductoServicio = $scope.listServiciosMoviles[0];
                        $scope.idDireccion = $scope.selectedIdProductoServicio.ProductoServicioResponse.idDireccion;
                        $scope.idServicio = $scope.selectedIdProductoServicio.ProductoServicioResponse.idProductoServicio;
						ResquestAuditoria.servicio=$scope.selectedIdProductoServicio.ProductoServicioResponse.nombre;
						ResquestAuditoria.tipoLinea=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoLinea;
						ResquestAuditoria.perfil=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoPermiso;
                    });
                    obtenerEstadoServicio();
                    getObtenerDetallePlanInternetWS($scope.idDireccion, $scope.idServicio);
                    actualizarProductoPrincipalSesion($scope.selectedIdProductoServicio);
                } else {
                    $scope.listServiciosMoviles = [];
                    $scope.listServiciosMoviles.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                    $scope.selectedIdProductoServicio = $scope.listServiciosMoviles[0];
                    $scope.idDireccion = $scope.selectedIdProductoServicio.ProductoServicioResponse.idDireccion;
                    $scope.idServicio = $scope.selectedIdProductoServicio.ProductoServicioResponse.idProductoServicio;
					ResquestAuditoria.servicio=$scope.selectedIdProductoServicio.ProductoServicioResponse.nombre;
					ResquestAuditoria.tipoLinea=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoLinea;
					ResquestAuditoria.perfil=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoPermiso;

                    obtenerEstadoServicio();
                    getObtenerDetallePlanInternetWS($scope.idDireccion, $scope.idServicio);
                    actualizarProductoPrincipalSesion($scope.selectedIdProductoServicio);
                }
            } else {
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerServicios - "+mensaje;
				auditoria();
                allSuccess = false;
            }


        }, function(error) {

        });
    }

    $scope.cambioServicio = function() {

        $scope.estadoServicioFlag = null;
        $scope.planInternetFlag = null;

        aniamteBox(".box");

        $scope.idDireccion = $scope.selectedIdProductoServicio.ProductoServicioResponse.idDireccion;
        $scope.idServicio = $scope.selectedIdProductoServicio.ProductoServicioResponse.idProductoServicio;
		ResquestAuditoria.servicio=$scope.selectedIdProductoServicio.ProductoServicioResponse.nombre;
		ResquestAuditoria.tipoLinea=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoLinea;
		ResquestAuditoria.perfil=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoPermiso;
		
        obtenerEstadoServicio();
        getObtenerDetallePlanInternetWS($scope.idDireccion, $scope.idServicio);
        actualizarProductoPrincipalSesion($scope.selectedIdProductoServicio);
    }

    function obtenerEstadoServicio() {

        var idProductoServicioCoor = $scope.idServicio;

        var requestEstadoServicio = {
            "categoria": null,
            "idProductoServicio": null,
            "idDireccion": null,
            "idCuenta": null,
            "idRecibo": null,
            "idLinea": null
        }
        requestEstadoServicio.categoria = categoria;
        requestEstadoServicio.idProductoServicio = idProductoServicioCoor;
        requestEstadoServicio.idDireccion = $scope.selectedIdProductoServicio.ProductoServicioResponse.idDireccion;
        dataEstado = $httpParamSerializer({ requestJson: angular.toJson(requestEstadoServicio) });
        serviceHomeMoviles.getobtenerEstadoServicio(dataEstado).then(function(response) {

            $scope.mostrar = response.data;
            $scope.estadoServicio = response.data.obtenerEstadoServicioResponse;
            $scope.estadoServicioFlag = $scope.estadoServicio.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId  = $scope.estadoServicio.defaultServiceResponse.idTransaccional;
            var mensaje = $scope.estadoServicio.defaultServiceResponse.mensaje;

            if ($scope.estadoServicioFlag != 0) {
					ResquestAuditoria.estado = "ERROR";
					ResquestAuditoria.descripcionoperacion = "obtenerEstadoServicioResponse - "+mensaje;
					auditoria();
					allSuccess = false;
            }

            if (allSuccess == true) {
					ResquestAuditoria.estado = "SUCCESS";
					ResquestAuditoria.descripcionoperacion = "-";
					auditoria();
            }


        }, function(error) {

        });
    }

    getObtenerDetallePlanInternetWS = function(idDireccion, idProducto) {

        var idDir = idDireccion
        var idProdServ = idProducto

        var obtenerDetallePlanInternetRequest = {
            "idDireccion": null,
            "idProductoServicio": null,
        }

        obtenerDetallePlanInternetRequest.idDireccion = idDir;
        obtenerDetallePlanInternetRequest.idProductoServicio = idProdServ;

        data = $httpParamSerializer({ requestJson: angular.toJson(obtenerDetallePlanInternetRequest) });

        serviceHomeMoviles.getObtenerDetallePlanInternetWS(data).then(function(response) {

            $scope.planInternet = response.data.obtenerDetallePlanInternetResponse;
            $scope.planInternetFlag = $scope.planInternet.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId  = $scope.planInternet.defaultServiceResponse.idTransaccional;
            var mensaje = $scope.planInternet.defaultServiceResponse.mensaje;

            $scope.velocidadMax = $scope.planInternet.velocidadMaxima;
            $scope.velocidadMin = $scope.planInternet.velocidadMinima;

            if ($scope.velocidadMax == "0" || $scope.velocidadMax == "") {
                $scope.velocidadMax = $scope.planInternet.porcentajeVelocidadMaxima + "% de la velocidad contratada";
            }

            if ($scope.velocidadMin == "0" || $scope.velocidadMin == "") {
                $scope.velocidadMin = $scope.planInternet.porcentajeVelocidadMinima + "% de la velocidad contratada";
            }

            if ($scope.planInternetFlag != 0) {
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerDetallePlanInternet - "+mensaje;
				auditoria();
                allSuccess = false;
            }

            if (allSuccess == true) {
				ResquestAuditoria.estado = "SUCCESS";
				ResquestAuditoria.descripcionoperacion = "-";
				auditoria();
            }

            if (firstRender) {
                $("#internet").show();
                aniamteBox(".box");
                firstRender = false;
            }

        });
    };

    function actualizarProductoPrincipalSesion(objServico) {

        var appProductoPrincipal = objServico.ProductoServicioResponse.idProductoServicio;
        var appNombreProductoPrincipal = objServico.ProductoServicioResponse.nombreAlias;
        var appIdDireccion = objServico.ProductoServicioResponse.idDireccion;
        var appTipoLinea = objServico.ProductoServicioResponse.tipoLinea;
        var appCategoria = objServico.ProductoServicioResponse.categoria;
        var appTipoClientePrincipal = objServico.ProductoServicioResponse.tipoCliente;

        var actualizarServicioSesion = {
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

        actualizarServicioSesion.productoPrincipal = appProductoPrincipal;
        actualizarServicioSesion.nombreProductoPrincipal = appNombreProductoPrincipal;
        actualizarServicioSesion.idDireccion = appIdDireccion;
        actualizarServicioSesion.tipoLinea = appTipoLinea;
        actualizarServicioSesion.categoria = appCategoria;
        actualizarServicioSesion.tipoClienteProductoPrincipal = appTipoClientePrincipal;

        data = $httpParamSerializer({ requestJson: angular.toJson(actualizarServicioSesion) });

        serviceHomeMoviles.actualizarProductoPrincipalSesion(data).then(function(response) {

        });


    };

    function auditoria() {

        var Resquest = $httpParamSerializer({ requestJson: angular.toJson(ResquestAuditoria) });
        serviceHomeMoviles.enviarAuditoria(Resquest).then(function(response) {

        }, function(error) {

        });

    }

    $scope.libroReclamaciones = function(objServico) {

         window.open(WPSRutaLibroReclamaciones);

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Home Servicios',
            'action': 'Internet',
            'label': 'Botón: Libro de reclamaciones'
        });
    };

    $scope.pagarRecibo = function(objServico) {

        window.location.replace("/wps/myportal/miclaro/corporativo/recibos/internet");

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Home Servicios',
            'action': 'Internet',
            'label': 'Botón: Pagar mi recibo'
        });
    };

    $scope.recargarConsumos = function() {

        var $time = 0;
        var $tpos = 0;
        var $tmp = $('.boxConsumos');
        var $pos = $('.boxConsumos').offset().top;

        if ($tpos != $pos) {
            $tpos = $pos;
            $time = $time + 150;
        }
        $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 250);

        getObtenerDetallePlanInternetWS($scope.idDireccion, $scope.idServicio);

    };

    $scope.recargarEstadoServicio = function() {

        $('.serviciosBox').hide();
        $('.serviciosBox').fadeIn(1100);

        obtenerEstadoServicio();

    };

    aniamteBox = function(boxClass) {

        var $time = 0;
        var $tpos = 0;
        $(boxClass).each(function(ix, el) {
            var $tmp = $(this);
            var $pos = $(this).offset().top;

            if ($tpos != $pos) {
                $tpos = $pos;
                $time = $time + 150;
            }
            $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 200);
        });

    }

    $scope.switchChange = function() {

        window.location.replace("/wps/myportal/miclaro/consumer/home/internet");

    }

    $scope.mideTuVelocidad = function() {
        window.open("http://midetuvelocidad.claro.com.pe/", '_blank');
    }

    $(".publicidad").load("/wps/wcm/myconnect/mi%20claro%20content%20library/mi%20claro/banners/home%20internet");

});

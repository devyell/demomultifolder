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
    var tipoClienteCorporativoFijo = 2;
    var categoria = 2;
    var tipoCliente = 2;
    var tipoPermiso = 5;
    var titularidadServicio = 7;
    var productoPrincipalXidRecibo = false;
    var allSuccess = true;
    var firstRender = true;
    var criterio = 3;
    $scope.estadoServicioFlag = null;
    $scope.consumosFijoFlag = null;
    $scope.errorFuncional = null;
    $scope.listaDireccionesFlag = null;
    $scope.listaServiciosFlag = null;
    $scope.switchSelect = true;
	var ResquestAuditoria = {
			operationCode: 'T0001',
			pagina: 'P047',
			transactionId: '',
			estado: '',
			servicio: '-',
			tipoProducto: 'TELEFONIA',
			tipoLinea:'-',
			tipoUsuario:'2',
			perfil: '-',
			monto: '',
			descripcionoperacion: '-',
			responseType: '/'
		};

    serviceHomeMoviles.getObtenerFlagProductoFijo().then(function(response) {

        $scope.flagServiciosFijo = response.data.comunResponseType.flagProductoFijoSesion;
        $scope.ErrorFlagFijo = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        $scope.FlagFijoIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
        $scope.tipoClienteUsuario = response.data.comunResponseType.tipoCliente;
        $scope.tipoLineaUsuario = response.data.comunResponseType.tipoLinea;

        if ($scope.tipoClienteUsuario == 4) {
            $scope.showSwitch = true;
        }

        if ($scope.ErrorFlagFijo == 0) {
            if ($scope.flagServiciosFijo != "-1") {
                if ($scope.flagServiciosFijo == 2 || $scope.flagServiciosFijo == 3) {
                    $scope.init();
                } else {
                    $("#fijo").show();
                }
            } else {
                $("#fijo").show();
                allSuccess = false;
            }
        } else {
            $("#fijo").show();
            allSuccess = false;
        }
    });

    $scope.init = function() {
        serviceHomeMoviles.getObtenerServicioPrincipal().then(function(response) {

            $scope.idCuentaPrincipal = response.data.comunResponseType.idCuenta;
            $scope.categoria = response.data.comunResponseType.categoria;
            $scope.idDireccion = response.data.comunResponseType.idDireccion;
            $scope.idLinea = response.data.comunResponseType.idLinea;
            $scope.idReciboPrincipal = response.data.comunResponseType.idRecibo;
            $scope.nombreAliasaMostrar = response.data.comunResponseType.nombreProductoPrincipal;
            $scope.numeroTelefono = response.data.comunResponseType.numeroTelFijo;
            $scope.idServicio = response.data.comunResponseType.productoPrincipal;
            $scope.errorFuncional = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            $scope.servPrincipalIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            $scope.tipoCliente = response.data.comunResponseType.tipoClienteProductoPrincipal;
            $scope.servPrincipalMensaje = response.data.comunResponseType.defaultServiceResponse.mensaje;

            if ($scope.errorFuncional == 0) {
                if ($scope.tipoCliente == 2) {
                    if ($scope.categoria == 2) {
                        obtenerServicioxIdDireccion();
                        getObtenerConsumoGeneralFijaWS($scope.idDireccion, $scope.idLinea, $scope.idServicio);
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
                $("#fijo").show();
                allSuccess = false;
            }

        }, function(error) {

        });
    }

    function obtenerServicioxIdDireccion() {
        var requestObtenerDirecciones = {
            "tipoCliente": null
        };
        requestObtenerDirecciones.tipoCliente = tipoClienteCorporativoFijo;
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
                $("#fijo").show();
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
                    } else {
                        $scope.listServiciosMoviles = [],
                        $scope.listServiciosMoviles.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                        $scope.selectedIdProductoServicio = $scope.listServiciosMoviles[0];
						ResquestAuditoria.servicio=$scope.selectedIdProductoServicio.ProductoServicioResponse.nombre;
						ResquestAuditoria.tipoLinea=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoLinea;
						ResquestAuditoria.perfil=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoPermiso;
                    }
                } else {
                    $("#fijo").show();
					ResquestAuditoria.estado = "ERROR";
					ResquestAuditoria.descripcionoperacion = "obtenerServicios - "+mensaje;
					auditoria();
                    allSuccess = false;
                }


                obtenerEstadoServicio();
            }, function(error) {

            });
        }, function(error) {

        });
    };

    function obtenerServicioxIdDireccionDefault() {
        var requestObtenerDirecciones = {
            "tipoCliente": null
        };

        requestObtenerDirecciones.tipoCliente = tipoClienteCorporativoFijo;
        dataDir = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerDirecciones) });
        serviceHomeMoviles.getObtenerListadoFijoDireccionWS(dataDir).then(function(response) {

            $scope.listaDirecciones = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;
            $scope.listaDireccionesFlag = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId  = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.mensaje;

            if ($scope.listaDireccionesFlag == 0) {
                if (Array.isArray($scope.listaDirecciones)) {
                    $scope.selectedIdDireccion = $scope.listaDirecciones[0];
                } else {
                    $scope.listaDirecciones = [];
                    $scope.listaDirecciones.push(response.data.obtenerListadoFijoDireccionResponse.listadoDireccion);
                    $scope.selectedIdDireccion = $scope.listaDirecciones[0];
                }

                var idDireccionDefault = $scope.listaDirecciones[0].idDireccion;

            } else {
                $("#fijo").show();
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerListadoFijoDireccion - "+mensaje;
				auditoria();
                allSuccess = false;
            }

            var requestDatosServicios = {
                categoria: null,
                tipoLinea: null,
                tipoCliente: null,
                idProductoServicio: null,
                tipoPermiso: null,
                idCuenta: null,
                idRecibo: null,
                idDireccion: null,
                nombreProducto: null,
                pagina: null,
                cantResultadosPagina: null,
                productoPrincipalXidRecibo: null,
                titularidadServicio: null
            }
            requestDatosServicios.categoria = categoria;
            requestDatosServicios.tipoLinea = tipoLinea;
            requestDatosServicios.tipoCliente = tipoCliente;
            requestDatosServicios.tipoPermiso = tipoPermiso;
            requestDatosServicios.idDireccion = idDireccionDefault;
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
                        $scope.idLinea = $scope.selectedIdProductoServicio.ProductoServicioResponse.idLinea;
                        $scope.idServicio = $scope.selectedIdProductoServicio.ProductoServicioResponse.idProductoServicio;
						ResquestAuditoria.servicio=$scope.selectedIdProductoServicio.ProductoServicioResponse.nombre;
						ResquestAuditoria.tipoLinea=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoLinea;
						ResquestAuditoria.perfil=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoPermiso;
                    } else {
                        $scope.listServiciosMoviles = [];
                        $scope.listServiciosMoviles.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                        $scope.selectedIdProductoServicio = $scope.listServiciosMoviles[0];
                        $scope.idDireccion = $scope.selectedIdProductoServicio.ProductoServicioResponse.idDireccion;
                        $scope.idLinea = $scope.selectedIdProductoServicio.ProductoServicioResponse.idLinea;
                        $scope.idServicio = $scope.selectedIdProductoServicio.ProductoServicioResponse.idProductoServicio;
						ResquestAuditoria.servicio=$scope.selectedIdProductoServicio.ProductoServicioResponse.nombre;
						ResquestAuditoria.tipoLinea=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoLinea;
						ResquestAuditoria.perfil=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoPermiso;
                    }
                    obtenerEstadoServicio();
                    getObtenerConsumoGeneralFijaWS($scope.idDireccion, $scope.idLinea, $scope.idServicio);
                    actualizarProductoPrincipalSesion($scope.selectedIdProductoServicio);
                } else {
                    $("#fijo").show();
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
        $scope.consumosFijoFlag = null;

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
                        $scope.idLinea = $scope.selectedIdProductoServicio.ProductoServicioResponse.idLinea;
                        $scope.idServicio = $scope.selectedIdProductoServicio.ProductoServicioResponse.idProductoServicio;
						ResquestAuditoria.servicio=$scope.selectedIdProductoServicio.ProductoServicioResponse.nombre;
						ResquestAuditoria.tipoLinea=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoLinea;
						ResquestAuditoria.perfil=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoPermiso;
                    });
                } else {
                    $scope.listServiciosMoviles = [];
                    $scope.listServiciosMoviles.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                    $scope.selectedIdProductoServicio = $scope.listServiciosMoviles[0];
                    $scope.idDireccion = $scope.selectedIdProductoServicio.ProductoServicioResponse.idDireccion;
                    $scope.idLinea = $scope.selectedIdProductoServicio.ProductoServicioResponse.idLinea;
                    $scope.idServicio = $scope.selectedIdProductoServicio.ProductoServicioResponse.idProductoServicio;
					ResquestAuditoria.servicio=$scope.selectedIdProductoServicio.ProductoServicioResponse.nombre;
					ResquestAuditoria.tipoLinea=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoLinea;
					ResquestAuditoria.perfil=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoPermiso;
                }

                obtenerEstadoServicio();
                getObtenerConsumoGeneralFijaWS($scope.idDireccion, $scope.idLinea, $scope.idServicio);
                actualizarProductoPrincipalSesion($scope.selectedIdProductoServicio);
            } else {
                $("#fijo").show();
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
        $scope.consumosFijoFlag = null;
		ResquestAuditoria.servicio=$scope.selectedIdProductoServicio.ProductoServicioResponse.nombre;
		ResquestAuditoria.tipoLinea=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoLinea;
		ResquestAuditoria.perfil=$scope.selectedIdProductoServicio.ProductoServicioResponse.tipoPermiso;

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

        $scope.idDireccion = $scope.selectedIdProductoServicio.ProductoServicioResponse.idDireccion;
        $scope.idLinea = $scope.selectedIdProductoServicio.ProductoServicioResponse.idLinea;
        $scope.idServicio = $scope.selectedIdProductoServicio.ProductoServicioResponse.idProductoServicio;
        obtenerEstadoServicio();
        getObtenerConsumoGeneralFijaWS($scope.idDireccion, $scope.idLinea, $scope.idServicio);
        actualizarProductoPrincipalSesion($scope.selectedIdProductoServicio);
    }

    function obtenerEstadoServicio() {

        idProductoServicioCorporativo = $scope.selectedIdProductoServicio.ProductoServicioResponse.idProductoServicio;

        var requestEstadoServicio = {
            "categoria": null,
            "idProductoServicio": null,
            "idDireccion": null,
            "idCuenta": null,
            "idRecibo": null,
            "idLinea": null
        }
        requestEstadoServicio.categoria = categoria;
        requestEstadoServicio.idProductoServicio = idProductoServicioCorporativo;
        requestEstadoServicio.idDireccion = $scope.selectedIdProductoServicio.ProductoServicioResponse.idDireccion;
        dataEstado = $httpParamSerializer({ requestJson: angular.toJson(requestEstadoServicio) });
        serviceHomeMoviles.getobtenerEstadoServicio(dataEstado).then(function(response) {

            $scope.mostrar = response.data;
            $scope.estadoServicio = response.data.obtenerEstadoServicioResponse;
            $scope.estadoServicioFlag = $scope.estadoServicio.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId = $scope.estadoServicio.defaultServiceResponse.idTransaccional;
            var mensaje = $scope.estadoServicio.defaultServiceResponse.mensaje;

            if ($scope.estadoServicioFlag != 0) {
               ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerEstadoServicio - "+mensaje;
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

    var chartServicios = null;
    getObtenerConsumoGeneralFijaWS = function(idDireccion, idLinea, idProducto) {



        var idDir = idDireccion
        var idLin = idLinea
        var idProdServ = idProducto

        var obtenerConsumeGeneralFijaRequest = {
            "idPeriodo": null,
            "idDireccion": null,
            "idLinea": null,
            "idProductoServicio": null,
            "criterio": null
        }

        obtenerConsumeGeneralFijaRequest.idDireccion = idDir;
        obtenerConsumeGeneralFijaRequest.idProductoServicio = idProdServ;
        obtenerConsumeGeneralFijaRequest.idLinea = idLin;
        obtenerConsumeGeneralFijaRequest.criterio = criterio;

        data = $httpParamSerializer({ requestJson: angular.toJson(obtenerConsumeGeneralFijaRequest) });

        serviceHomeMoviles.getObtenerConsumoGeneralFijaWS(data).then(function(response) {
            $scope.consumoServicio = response.data.obtenerConsumoGeneralFijaResponse;
            $scope.consumosFijoFlag = $scope.consumoServicio.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId = $scope.consumoServicio.defaultServiceResponse.idTransaccional;
            var mensaje = $scope.consumoServicio.defaultServiceResponse.mensaje;

            if ($scope.consumosFijoFlag == 0) {

                $scope.flagInternacional = $scope.consumoServicio.porDestino.consumoInternacional.flagError;
                $scope.flagNacional = $scope.consumoServicio.porDestino.consumoNacional.flagError;
                $scope.flagLocal = $scope.consumoServicio.porDestino.consumoLocal.flagError;

                var internacional = parseInt($scope.consumoServicio.porDestino.consumoInternacional.cantidadConsumida);
                var nacional = parseInt($scope.consumoServicio.porDestino.consumoNacional.cantidadConsumida);
                var local = parseInt($scope.consumoServicio.porDestino.consumoLocal.cantidadConsumida);
                var libres = parseInt($scope.consumoServicio.porDestino.cantidadTotal) - (local + nacional + internacional);

                $scope.minutosUsado = local + nacional + internacional;

                $('.pie-chart').each(function(i, e) {
                    var $this = $(this);
                    var $chart = $this.find(".canvas");
                    var $opts = { responsive: true, title: { display: false }, legend: { display: false }, cutoutPercentage: 75 };
                    var $ttext = [];
                    var $tdata = [];
                    var $tcolor = [];
                    var $total = 0;
                    var vacio = 1;

                    $ttext.push("Internacional", "Nacional", "Local", "Libres");
                    $tdata.push(internacional, nacional, local, libres);

                    $this.find("li").each(function($j, el) {
                        var $item = $(this);
                        $item.find("span.square").css({ background: $item.attr("data-color") });
                        $tcolor.push($item.attr("data-color"));

                        $total = $total + parseInt($item.attr("data-value"));
                    });
                    var $data = { labels: $ttext, datasets: [{ data: $tdata, backgroundColor: $tcolor, hoverBorderColor: "transparent" }] };

                    if (chartServicios == null) {
                        chartServicios = new Chart($chart, { type: 'doughnut', data: $data, options: $opts });
                    } else {
                        chartServicios.destroy();
                        chartServicios = new Chart($chart, { type: 'doughnut', data: $data, options: $opts });
                    }

                });

            } else {
					ResquestAuditoria.estado = "ERROR";
					ResquestAuditoria.descripcionoperacion = "obtenerConsumoGeneralFija - "+mensaje;
					auditoria();
					allSuccess = false;
            }

            if (allSuccess == true) {
					ResquestAuditoria.estado = "SUCCESS";
					ResquestAuditoria.descripcionoperacion = "-";
					auditoria();
            }

            if (firstRender) {
                $("#fijo").show();
                aniamteBox(".box");
                firstRender = false;
            }

        });


    };

    function actualizarProductoPrincipalSesion(objServico) {



        var appProductoPrincipal = objServico.ProductoServicioResponse.idProductoServicio;
        var appNombreProductoPrincipal = objServico.ProductoServicioResponse.nombreAlias;
        var appIdDireccion = objServico.ProductoServicioResponse.idDireccion;
        var appIdLinea = objServico.ProductoServicioResponse.idLinea;
        var appTipoLinea = objServico.ProductoServicioResponse.tipoLinea;
        var appNumeroTelFijo = objServico.ProductoServicioResponse.numeroTelFijo;
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
        actualizarServicioSesion.idLinea = appIdLinea;
        actualizarServicioSesion.tipoLinea = appTipoLinea;
        actualizarServicioSesion.numeroTelFijo = appNumeroTelFijo;
        actualizarServicioSesion.categoria = appCategoria;
        actualizarServicioSesion.tipoClienteProductoPrincipal = appTipoClientePrincipal;

        data = $httpParamSerializer({ requestJson: angular.toJson(actualizarServicioSesion) });

        serviceHomeMoviles.actualizarProductoPrincipalSesion(data).then(function(response) {




        });


    };

    function auditoria () {
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
            'action': 'Fijo',
            'label': 'Botón: Libro de reclamaciones'
        });
    };

    $scope.saldosConsumos = function(objServico) {

        window.location.replace("/wps/myportal/miclaro/corporativo/consultas/saldosyconsumos/fijo");

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Home Servicios',
            'action': 'Fijo',
            'label': 'Botón: Consumos generales'
        });
    };

    $scope.pagarRecibo = function(objServico) {

        window.location.replace("/wps/myportal/miclaro/corporativo/recibos/fijo");

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Home Servicios',
            'action': 'Fijo',
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


        getObtenerConsumoGeneralFijaWS($scope.idDireccion, $scope.idLinea, $scope.idServicio);

    }

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



        window.location.replace("/wps/myportal/miclaro/consumer/home/fijo");

    }


});

miClaroApp.controller("MiClaroHomeController", function($scope, $http, $httpParamSerializer, serviceHomeMoviles) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    var categoriaTV = 4;
    var tipoPermiso = 5;
    var titularidadServicio = 7;
    var pagina = 0;
    var cantResultadosPagina = 0;
    var productoPrincipalXidRecibo = false;
    var tipoLinea = 3;
    var tipoCliente = 2;
    $scope.showUpps = false;
    $scope.switchSelect = true;
    $scope.solicitarDecosIdRespuesta = null;
	var ResquestAuditoria = {
                    operationCode: 'T0063',
                    pagina: WPSPageID.miclaro_corporativo_solicitudes_decosadicionales,
                    transactionId:'',
                    estado: '',
                    servicio: '-',
                    tipoProducto: 'CLAROTV',
                    tipoLinea: '-',
                    tipoUsuario: '-',
                    perfil: '-',
                    monto: '',
                    descripcionoperacion: '-',
                    responseType: '/'
                };
				
    $scope.lsCantidad = [
        { id: 0 },
        { id: 1 },
        { id: 2 },
        { id: 3 },
        { id: 4 }
    ];
    $scope.cantidadSelect = $scope.lsCantidad[0];

    this.mostrarPopUpTerminos = function() {
        $("#popupTerminos").fadeIn(350);
    }

    this.ocultarPopUpTerminos = function() {
        $('#popupTerminos').fadeOut(250);
    };

    this.aceptarTerminosCondiciones = function(modelAceptarTerminos) {
        if (modelAceptarTerminos == true) {
            $("#checkboxTerminos").addClass("checked");
            $("#btcontratar").removeClass("bt-disabled");
            $("#btcontratar").removeAttr("disabled");
        } else {
            $("#checkboxTerminos").removeClass("checked");
            $("#btcontratar").addClass("bt-disabled");
            $("#btcontratar").attr("disabled", "disabled");
        }
    };

    this.aceptarTerminos = function() {
        $("#checkboxTerminos").addClass("checked");
        $("#popupTerminos").hide();
        $("#btcontratar").removeClass("bt-disabled");
        $("#btcontratar").removeAttr("disabled");
    };


    this.mostrarConfirmacion = function() {

        $("#decosPage").hide();
        $("#confirmacionPage").show();
    }

    $scope.confirmar = function() {


        var objetoConfirmar = {
            idDireccion: null,
            idProductoServicio: null,
            nombreServicio: null,
            listaDecos: null,
        }

        var decosList = [];



        angular.forEach($scope.lsCanasta, function(val, key) {
            var deco = {
                idTipoDeco: null,
                nombreDeco: null,
                precio: null,
                simboloMoneda: null,
                cantidadDecos: null
            }
            var decoObject;
            decoObject = deco;
            decoObject.idTipoDeco = val.deco.idTipoDeco;
            decoObject.nombreDeco = val.deco.nombreDeco;
            decoObject.precio = val.deco.precio;
            decoObject.simboloMoneda = val.deco.simboloMoneda;
            decoObject.cantidadDecos = val.cantidad;
            decosList.push(decoObject);
        });

        objetoConfirmar.idDireccion = $scope.selectedIdDireccion.idDireccion
        objetoConfirmar.idProductoServicio = $scope.servicio.ProductoServicioResponse.idProductoServicio;
        objetoConfirmar.nombreServicio = $scope.servicio.ProductoServicioResponse.nombreAlias;
        objetoConfirmar.listaDecos = decosList;

        serviciosRequest = $httpParamSerializer({ requestJson: angular.toJson(objetoConfirmar) });

        serviceHomeMoviles.solicitarDecosAdicionales(serviciosRequest).then(function(response) {

            $scope.solicitarDecosIdRespuesta = response.data.solicitarDecosAdicionalesTVResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId  = response.data.solicitarDecosAdicionalesTVResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.solicitarDecosAdicionalesTVResponse.defaultServiceResponse.mensaje;

            if ($scope.solicitarDecosIdRespuesta == 0) {

            } else {
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "solicitarDecosAdicionalesTV - "+mensaje;
				auditoria();
                allSuccess = false;
            }

            if (allSuccess == true) {
                ResquestAuditoria.estado = "SUCCESS";
				ResquestAuditoria.descripcionoperacion = "-";
				auditoria();
            }

        });

        $("#confirmacionPage").hide();
        $("#confirmarPage").show();
    }

    $scope.setImg = function(DecoId) {

        var backgroundImg = "";

        for (i = 0; i < decos.length; i++) {
            if (decos[i].id == DecoId) {
                backgroundImg = decos[i].url_img_lista;
                i = 999;
            }
        }

        return { background: "url(" + backgroundImg + ")" }

    }

    $scope.mostrarDeco = function(DecoId, nombreDeco) {
        var srcImg = "";

        for (i = 0; i < decos.length; i++) {
            if (decos[i].id == DecoId) {
                srcImg = decos[i].url_img_completa;
            }
        }

        $scope.nombreDecoPopUp = nombreDeco;

        var $h = $(window).height();
        var $popup = $('.popup');
        var $pop = $(".popup .pop");
        var $cnt = $popup.find('.content');

        $(".content .img").attr("src", srcImg);
        $pop.css({ 'margin-top': Math.round(($h - 300) / 2) });
        $("#popupDecos").fadeIn(350);

    }

    this.ocultarPopUpDecos = function() {

        $('#popupDecos').fadeOut(250);
    };

    $scope.lsCanasta = [];
    var botonClassDisabled = true;

    $scope.agregarCanasta = function(idDeco, cantidad, servicio, direccion, deco, index) {

        var servicioCanasta = servicio.ProductoServicioResponse;

        var objetoCanasta = {
            id: null,
            cantidad: null,
            servicio: null,
            direccion: null,
            deco: null
        };

        if (($scope.lsCanasta).length == 0) {
            objetoCanasta.id = idDeco;
            objetoCanasta.cantidad = cantidad;
            objetoCanasta.servicio = servicioCanasta;
            objetoCanasta.direccion = direccion;
            objetoCanasta.deco = deco;
            $scope.lsCanasta.push(objetoCanasta);
        } else {
            var flagEncontroDeco = false;
            for (i = 0; i < $scope.lsCanasta.length; i++) {
                if (idDeco == $scope.lsCanasta[i].id) {
                    $scope.lsCanasta[i].cantidad = cantidad;
                    flagEncontroDeco = true;
                }
            }

            if (!flagEncontroDeco) {
                objetoCanasta.id = idDeco;
                objetoCanasta.cantidad = cantidad;
                objetoCanasta.servicio = servicioCanasta;
                objetoCanasta.direccion = direccion;
                objetoCanasta.deco = deco;
                $scope.lsCanasta.push(objetoCanasta);
            }

        }

        for (i = 0; i < $scope.lsCanasta.length; i++) {
            if ($scope.lsCanasta[i].cantidad == 0) {
                $scope.lsCanasta.splice(i, 1);
            }
        }

        var sumaDecos = 0;

        angular.forEach($scope.lsCanasta, function(val, key) {
            sumaDecos = sumaDecos + val.cantidad;
        });

        var decosPosibles = $scope.infoDecos.cantidadMaximaDecosPosibles - $scope.infoDecos.cantidadDecosTotales;

        if (sumaDecos == 0) {
            $(".buttonDecos").addClass("bt-disabled");
            $(".buttonDecos").attr("disabled", "disabled");

        } else if (sumaDecos > decosPosibles) {
            $(".buttonDecos").addClass("bt-disabled");
            $(".buttonDecos").attr("disabled", "disabled");

        } else {
            $(".buttonDecos").removeClass("bt-disabled");
            $(".buttonDecos").removeAttr("disabled");

        }

    };

    var allSuccess = true;
    var tipoLineaPostpago = 2;
    var cantpagina = 1;
    var cantResultadosPagina = 10;

    serviceHomeMoviles.getObtenerFlagProductoTV().then(function(response) {

        $scope.flagServiciosTV = response.data.comunResponseType.flagProductoTVSesion;
        $scope.ErrorFlagTV = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        $scope.FlagTVIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
        $scope.tipoClienteUsuario = response.data.comunResponseType.tipoCliente;
        $scope.tipoLineaUsuario = response.data.comunResponseType.tipoLinea;

        if ($scope.tipoClienteUsuario == 4) {
            $scope.showSwitch = true;
        }


        if ($scope.ErrorFlagTV == 0) {
            if ($scope.flagServiciosTV != "-1") {
                if ($scope.flagServiciosTV == 2 || $scope.flagServiciosTV == 3) {
                    $scope.init();
                } else {
                    $('#decosPage').show();
                    allSuccess = false;
                }
            } else {
                $('#decosPage').show();
                allSuccess = false;
            }
        } else {
            $scope.showUpps = true;
            $('#decosPage').show();
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
            $scope.tipoCliente = response.data.comunResponseType.tipoClienteProductoPrincipal;
            $scope.categoria = response.data.comunResponseType.categoria;
            $scope.servPrincipalError = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            $scope.servPrincipalIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            $scope.servPrincipalMensaje = response.data.comunResponseType.defaultServiceResponse.mensaje;

            if ($scope.servPrincipalError == 0) {
                if ($scope.categoria == 4) {

                    obtenerServicioxIdDireccion();
                } else {

                    obtenerServicioxIdDireccionDefault();
                }
            } else {
                $scope.showUpps = true;
                $('#decosPage').show();
                allSuccess = false;
            }

            var $time = 0;
            var $tpos = 0;
            $('.box, .detail').each(function(ix, el) {
                var $tmp = $(this);
                var $pos = $(this).offset().top;

                if ($tpos != $pos) {
                    $tpos = $pos;
                    $time = $time + 150;
                }
                $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 250);
            });

        });
    }

    function obtenerServicioxIdDireccion() {
        var requestObtenerDirecciones = {
            "tipoCliente": null
        };
        requestObtenerDirecciones.tipoCliente = $scope.tipoCliente;

        dataDir = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerDirecciones) });
        serviceHomeMoviles.getObtenerListadoFijoDireccionWS(dataDir).then(function(response) {
            $scope.listaDirecciones = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;
            $scope.listaDireccionesFlag = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.mensaje;

            if (Array.isArray($scope.listaDirecciones)) {
                if ($scope.listaDireccionesFlag == 0) {
                    angular.forEach($scope.listaDirecciones, function(val, key) {

                        if (val.idDireccion == $scope.idDireccion) {
                            $scope.selectedIdDireccion = $scope.listaDirecciones[key];
                        }
                    });
                } else {
                    $scope.showUpps = true;
					ResquestAuditoria.estado = "ERROR";
					ResquestAuditoria.descripcionoperacion = "obtenerListadoFijoDireccion - "+mensaje;
					auditoria();
                    allSuccess = false;
                }
            } else {
                $scope.listaDirecciones = [];
                $scope.listaDirecciones.push(response.data.obtenerListadoFijoDireccionResponse.listadoDireccion);
                $scope.selectedIdDireccion = $scope.listaDirecciones[0];
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
                "productoPrincipalXidRecibo": false,
                "titularidadServicio": null
            }
            requestDatosServicios.categoria = categoriaTV;
            requestDatosServicios.tipoCliente = tipoCliente;
            requestDatosServicios.tipoPermiso = tipoPermiso;
            requestDatosServicios.titularidadServicio = titularidadServicio;
            requestDatosServicios.tipoLinea = tipoLineaPostpago;
            requestDatosServicios.idDireccion = $scope.idDireccion;
            requestDatosServicios.pagina = cantpagina;
            requestDatosServicios.cantResultadosPagina = cantResultadosPagina;
            dataMoviles = $httpParamSerializer({ requestJson: angular.toJson(requestDatosServicios) });
            serviceHomeMoviles.getObtenerServiciosWS(dataMoviles).then(function(response) {
                $scope.listServiciosMoviles = response.data.obtenerServiciosResponse.listadoProductosServicios;


                $scope.listaServiciosFlag = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
                $scope.listaServiciosIdTransaccional = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                $scope.listaServiciosMensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;

                if (Array.isArray($scope.listServiciosMoviles)) {
                    if ($scope.listaServiciosFlag == 0) {
                        angular.forEach($scope.listServiciosMoviles, function(val, key) {
                            if (val.ProductoServicioResponse.idProductoServicio == $scope.idServicio) {
                                $scope.servicio = $scope.listServiciosMoviles[key];
								ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
								ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
                                ResquestAuditoria.tipoUsuario = $scope.servicio.ProductoServicioResponse.tipoCliente;
								ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;
                            }
                        });

                    } else {
                        $scope.showUpps = true;
						ResquestAuditoria.estado = "ERROR";
						ResquestAuditoria.descripcionoperacion = "obtenerServicios - "+mensaje;
						auditoria();
                        allSuccess = false;
                    }
                } else {
                    $scope.listServiciosMoviles = [];
                    $scope.listServiciosMoviles.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                    $scope.servicio = $scope.listServiciosMoviles[0];
                    $scope.idDireccion = $scope.servicio.ProductoServicioResponse.idDireccion;
                    $scope.idLinea = $scope.servicio.ProductoServicioResponse.idLinea;
                    $scope.idServicio = $scope.servicio.ProductoServicioResponse.idProductoServicio;
					ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
					ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
					ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;
                    ResquestAuditoria.tipoUsuario = $scope.servicio.ProductoServicioResponse.tipoCliente;
                }

                $scope.obtenerListaTvDecos();
                actualizarProductoPrincipalSesion($scope.servicio);


            }, function(error) {

            });
        }, function(error) {

        });
    };

    function obtenerServicioxIdDireccionDefault() {
        var requestObtenerDirecciones = {
            "tipoCliente": null
        };
        requestObtenerDirecciones.tipoCliente = $scope.tipoCliente;

        dataDir = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerDirecciones) });
        serviceHomeMoviles.getObtenerListadoFijoDireccionWS(dataDir).then(function(response) {

            $scope.listaDirecciones = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;
            $scope.listaDireccionesFlag = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.mensaje;

            if (Array.isArray($scope.listaDirecciones)) {
                if ($scope.listaDireccionesFlag == 0) {
                    $scope.selectedIdDireccion = $scope.listaDirecciones[0];
                } else {
                    $scope.showUpps = true;
					ResquestAuditoria.estado = "ERROR";
					ResquestAuditoria.descripcionoperacion = "obtenerListadoFijoDireccion - "+mensaje;
					auditoria();
                    allSuccess = false;
                }
            } else {
                $scope.listaDirecciones = [];
                $scope.listaDirecciones.push(response.data.obtenerListadoFijoDireccionResponse.listadoDireccion);
                $scope.selectedIdDireccion = $scope.listaDirecciones[0];
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
                "productoPrincipalXidRecibo": false,
                "titularidadServicio": null
            }
            requestDatosServicios.categoria = categoriaTV;
            requestDatosServicios.tipoCliente = tipoCliente;
            requestDatosServicios.tipoPermiso = tipoPermiso;
            requestDatosServicios.titularidadServicio = titularidadServicio;
            requestDatosServicios.tipoLinea = tipoLineaPostpago;
            requestDatosServicios.idDireccion = $scope.idDireccion;
            requestDatosServicios.pagina = cantpagina;
            requestDatosServicios.cantResultadosPagina = cantResultadosPagina;

            dataMoviles = $httpParamSerializer({ requestJson: angular.toJson(requestDatosServicios) });
            serviceHomeMoviles.getObtenerServiciosWS(dataMoviles).then(function(response) {

                $scope.listServiciosMoviles = response.data.obtenerServiciosResponse.listadoProductosServicios;
                $scope.listaServiciosFlag = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
                ResquestAuditoria.transactionId = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                var mensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;

                if (Array.isArray($scope.listServiciosMoviles)) {
                    if ($scope.listaServiciosFlag == 0) {
                        $scope.servicio = $scope.listServiciosMoviles[0];
                        $scope.idDireccion = $scope.servicio.ProductoServicioResponse.idDireccion;
                        $scope.idLinea = $scope.servicio.ProductoServicioResponse.idLinea;
                        $scope.idServicio = $scope.servicio.ProductoServicioResponse.idProductoServicio
						ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
						ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
						ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;
                        ResquestAuditoria.tipoUsuario = $scope.servicio.ProductoServicioResponse.tipoCliente;
                    } else {
                        $scope.showUpps = true;
						ResquestAuditoria.estado = "ERROR";
						ResquestAuditoria.descripcionoperacion = "obtenerServicios - "+mensaje;
						auditoria();
                        allSuccess = false;
                    }
                } else {
                    $scope.listServiciosMoviles = [];
                    $scope.listServiciosMoviles.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                    $scope.servicio = $scope.listServiciosMoviles[0];
                    $scope.idDireccion = $scope.servicio.ProductoServicioResponse.idDireccion;
                    $scope.idLinea = $scope.servicio.ProductoServicioResponse.idLinea;
                    $scope.idServicio = $scope.servicio.ProductoServicioResponse.idProductoServicio;
					ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
					ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
					ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;
                    ResquestAuditoria.tipoUsuario = $scope.servicio.ProductoServicioResponse.tipoCliente;
                }

                $scope.obtenerListaTvDecos();
                actualizarProductoPrincipalSesion($scope.servicio);

            }, function(error) {

            });
        }, function(error) {

        });
    };

    $scope.obtenerListaTvDecos = function() {

        var obtenerListaDecosRequest = {
            idDireccion: null,
            idProductoServicio: null
        }

        obtenerListaDecosRequest.idDireccion = $scope.servicio.ProductoServicioResponse.idDireccion;
        obtenerListaDecosRequest.idProductoServicio = $scope.servicio.ProductoServicioResponse.idProductoServicio;

        data = $httpParamSerializer({ requestJson: angular.toJson(obtenerListaDecosRequest) });

        serviceHomeMoviles.obtenerListaTvDecosAdicionales(data).then(function(response) {

            $scope.flagListaDecos = response.data.obtenerDecosAdicionalesTVResponse.defaultServiceResponse.idRespuesta;
            $scope.listaDecos = response.data.obtenerDecosAdicionalesTVResponse.listaDecos;
            $scope.infoDecos = response.data.obtenerDecosAdicionalesTVResponse;
            ResquestAuditoria.transactionId  = response.data.obtenerDecosAdicionalesTVResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerDecosAdicionalesTVResponse.defaultServiceResponse.mensaje;

            var valores = [0, 1, 2, 3, 4, 5, 6];

            angular.forEach($scope.listaDecos, function(val, key) {


            });

            if ($scope.flagListaDecos == 0) {

            } else {
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerDecosAdicionalesTV - "+mensaje;
				auditoria();
                allSuccess = false;
            }


            $("#decosPage").delay(400).show(0);

        });

    };

    obtenerDirecciones = function() {

        var obtenerDireccionesRequest = {
            tipoCliente: null
        }

        obtenerDireccionesRequest.tipoCliente = $scope.servicio.ProductoServicioResponse.tipoCliente;

        data = $httpParamSerializer({ requestJson: angular.toJson(obtenerDireccionesRequest) });

        serviceHomeMoviles.getObtenerListadoFijoDireccionWS(data).then(function(response) {

            $scope.listaDireccionesFlag = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId  = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.mensaje;

            if ($scope.listaDireccionesFlag == 0) {
                $scope.listadoDirecciones = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;

                angular.forEach($scope.listadoDirecciones, function(val, key) {
                    if (val.idDireccion == $scope.servicio.ProductoServicioResponse.idDireccion) {
                        $scope.direccionMostrar = $scope.listadoDirecciones[key].nombreAlias;
                    }
                });
            } else {
                $scope.showUpps = true;
                ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerListadoFijoDireccion - "+mensaje;
				auditoria();
                allSuccess = false;
            }
        });
    }

    obtenerServiciosPorDireccion = function() {

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
            "productoPrincipalXidRecibo": false,
            "titularidadServicio": null
        }
        requestDatosServicios.categoria = categoriaTV;
        requestDatosServicios.tipoCliente = tipoCliente;
        requestDatosServicios.tipoPermiso = tipoPermiso;
        requestDatosServicios.titularidadServicio = titularidadServicio;
        requestDatosServicios.tipoLinea = tipoLineaPostpago;
        requestDatosServicios.idDireccion = $scope.idDireccion;
        requestDatosServicios.pagina = cantpagina;
        requestDatosServicios.cantResultadosPagina = cantResultadosPagina;

        dataMoviles = $httpParamSerializer({ requestJson: angular.toJson(requestDatosServicios) });
        serviceHomeMoviles.getObtenerServiciosWS(dataMoviles).then(function(response) {

            $scope.listServiciosMoviles = response.data.obtenerServiciosResponse.listadoProductosServicios;
            $scope.listaServiciosFlag = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId  = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;

            if (Array.isArray($scope.listServiciosMoviles)) {
                if ($scope.listaServiciosFlag == 0) {
                    $scope.servicio = $scope.listServiciosMoviles[0];
                    $scope.idDireccion = $scope.servicio.ProductoServicioResponse.idDireccion;
                    $scope.idLinea = $scope.servicio.ProductoServicioResponse.idLinea;
                    $scope.idServicio = $scope.servicio.ProductoServicioResponse.idProductoServicio;
					ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
					ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
					ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;
                    ResquestAuditoria.tipoUsuario = $scope.servicio.ProductoServicioResponse.tipoCliente;

                } else {
                    $scope.showUpps = true;
					ResquestAuditoria.estado = "ERROR";
					ResquestAuditoria.descripcionoperacion = "obtenerServicios - "+mensaje;
					auditoria();
                    allSuccess = false;
                }
            } else {
                $scope.listServiciosMoviles = [];
                $scope.listServiciosMoviles.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                $scope.servicio = $scope.listServiciosMoviles[0];
                $scope.idDireccion = $scope.servicio.ProductoServicioResponse.idDireccion;
                $scope.idLinea = $scope.servicio.ProductoServicioResponse.idLinea;
				$scope.idServicio = $scope.servicio.ProductoServicioResponse.idProductoServicio;
				ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
				ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
				ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;
                ResquestAuditoria.tipoUsuario = $scope.servicio.ProductoServicioResponse.tipoCliente;

            }

            $scope.obtenerListaTvDecos();
            actualizarProductoPrincipalSesion($scope.servicio);

        }, function(error) {

        });

    }

    function actualizarProductoPrincipalSesion(objServicio) {

        var appProductoPrincipal = objServicio.ProductoServicioResponse.idProductoServicio;
        var appNombreProductoPrincipal = objServicio.ProductoServicioResponse.nombre;
        var appIdCuenta = objServicio.ProductoServicioResponse.idCuenta;
        var appIdRecibo = objServicio.ProductoServicioResponse.idRecibo;
        var appIdDireccion = objServicio.ProductoServicioResponse.idDireccion;
        var appIdLinea = objServicio.ProductoServicioResponse.idLinea;
        var appTipoLinea = objServicio.ProductoServicioResponse.tipoLinea;
        var appNumeroTelFijo = objServicio.ProductoServicioResponse.numeroTelFijo;
        var appCategoria = objServicio.ProductoServicioResponse.categoria;
        var appTipoClientePrincipal = objServicio.ProductoServicioResponse.tipoCliente;

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

    $scope.cambioDireccion = function() {

        if ($(".buttonDecos").hasClass("bt-disabled")) {

        } else {
            $(".buttonDecos").addClass("bt-disabled");
        }

        if ($(".buttonDecos").attr("disabled")) {

        } else {
            $(".buttonDecos").attr("disabled", "disabled");
        }

        obtenerServiciosPorDireccion();

        var $time = 0;
        var $tpos = 0;
        $('.box, .detail').each(function(ix, el) {
            var $tmp = $(this);
            var $pos = $(this).offset().top;

            if ($tpos != $pos) {
                $tpos = $pos;
                $time = $time + 150;
            }
            $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 250);
        });
    }

    $scope.cambioServicio = function() {


        $("#textox").html($scope.servicio.ProductoServicioResponse.nombreAlias);

        if ($(".buttonDecos").hasClass("bt-disabled")) {

        } else {
            $(".buttonDecos").addClass("bt-disabled");
        }

        if ($(".buttonDecos").attr("disabled")) {

        } else {
            $(".buttonDecos").attr("disabled", "disabled");
        }

        $scope.obtenerListaTvDecos();
        actualizarProductoPrincipalSesion($scope.servicio);

        var $time = 0;
        var $tpos = 0;
        $('.box, .detail').each(function(ix, el) {
            var $tmp = $(this);
            var $pos = $(this).offset().top;

            if ($tpos != $pos) {
                $tpos = $pos;
                $time = $time + 150;
            }
            $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 250);
        });

    }

    $scope.llamarObtenerListaTvDecos = function() {

        $scope.obtenerListaTvDecos();

        var $time = 0;
        var $tpos = 0;
        $('.table-decos').each(function(ix, el) {
            var $tmp = $(this);
            var $pos = $(this).offset().top;

            if ($tpos != $pos) {
                $tpos = $pos;
                $time = $time + 150;
            }
            $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 250);
        });

    }

    $scope.llamarConfirmar = function() {

        $scope.confirmar();

        var $time = 0;
        var $tpos = 0;
        $('.compra-confirm').each(function(ix, el) {
            var $tmp = $(this);
            var $pos = $(this).offset().top;

            if ($tpos != $pos) {
                $tpos = $pos;
                $time = $time + 150;
            }
            $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 250);
        });

    }

    function auditoria() {

        var Resquest = $httpParamSerializer({ requestJson: angular.toJson(ResquestAuditoria) });
        serviceHomeMoviles.enviarAuditoria(Resquest).then(function(response) {



        }, function(error) {

        });
    }

    $scope.switchChange = function() {

        window.location.replace("/wps/myportal/miclaro/consumer/solicitudes/decosadicionales/");

    }

});

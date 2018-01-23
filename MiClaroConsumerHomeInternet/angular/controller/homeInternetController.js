miClaroApp.controller("MiClaroHomeController", function($scope, $http, $httpParamSerializer, serviciosHome) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $(".publicidad").load("/wps/wcm/myconnect/mi%20claro%20content%20library/mi%20claro/banners/home%20internet");

    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    var data = {};
    var config = {};
    $scope.serviciosList = null;
    $scope.servicio = null;
    $scope.errorFuncional = null;
    var categoriaInternet = 3;
    var tipoPermiso = 5;
    var titularidadServicio = 7;
    var pagina = 0;
    var cantResultadosPagina = 0;
    var productoPrincipalXidRecibo = false;
    var tipoLinea = 3;
    var tipoCliente = 1;
    var allSuccess = true;
    var firstRender = true;
    $scope.estadoServicioFlag = null;
    $scope.consumosInternetFlag = null;
    $scope.showUpps = false;

	var ResquestAuditoria = {
					operationCode: 'T0001',
					pagina: 'P003',
					transactionId: '',
					estado: '',
					servicio: '',
					tipoProducto: 'INTERNET',
					tipoLinea: '',
					tipoUsuario:'1',
					perfil: '-',
					monto: '',
					descripcionoperacion: '-',
					responseType: '/'
	};


    serviciosHome.getObtenerFlagProductoInternet().then(function(response) {

        $scope.flagServiciosInternet = response.data.comunResponseType.flagProductoInternetSesion;
        $scope.ErrorFlagInternet = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        $scope.FlagInternetIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
        $scope.tipoClienteUsuario = response.data.comunResponseType.tipoCliente;
        $scope.tipoLineaUsuario = response.data.comunResponseType.tipoLinea;

        var emailModal = response.data.comunResponseType.usuarioLogueado;
        latamModal(emailModal);

        if ($scope.tipoClienteUsuario == 4) {
            $scope.showSwitch = true;
        }

        if ($scope.ErrorFlagInternet == 0) {
            if ($scope.flagServiciosInternet != "-1") {
                if ($scope.flagServiciosInternet == 1 || $scope.flagServiciosInternet == 3) {
                    $scope.init();
                } else {
                    $("#internet").show();
                    
                }
            } else {
                $scope.showUpps = true;
                $("#internet").show();
                allSuccess = false;
            }
        } else {
            $scope.showUpps = true;
            $("#internet").show();
            allSuccess = false;
        }

    });

    $scope.init = function(objServico) {

        serviciosHome.getObtenerDatosSesion().then(function(response) {

            $scope.servPrincipalError = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            $scope.servPrincipalIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            $scope.servPrincipalMensaje = response.data.comunResponseType.defaultServiceResponse.mensaje;

            if ($scope.servPrincipalError == 0) {
                getObtenerServiciosInternetWS(response.data);
            } else {
                $scope.showUpps = true;
                $("#internet").show();
                allSuccess = false;
            }

        });
    };

    getObtenerServiciosInternetWS = function(objServico) {

        var obtenerServiciosRequest = {
            categoria: null,
            tipoLinea: null,
            tipoCliente: null,
            idProductoServicio: null,
            tipoPermiso: null,
            idCuenta: null,
            idRecibo: null,
            idDireccion: null,
            direccionCompleta: null,
            pagina: null,
            cantResultadosPagina: null,
            productoPrincipalXidRecibo: null,
            titularidadServicio: null
        }

        obtenerServiciosRequest.categoria = categoriaInternet;
        obtenerServiciosRequest.tipoLinea = tipoLinea;
        obtenerServiciosRequest.tipoCliente = tipoCliente;
        obtenerServiciosRequest.tipoPermiso = tipoPermiso;
        obtenerServiciosRequest.pagina = pagina;
        obtenerServiciosRequest.cantResultadosPagina = cantResultadosPagina;
        obtenerServiciosRequest.productoPrincipalXidRecibo = productoPrincipalXidRecibo;
        obtenerServiciosRequest.titularidadServicio = titularidadServicio;


        serviciosRequest = $httpParamSerializer({ requestJson: angular.toJson(obtenerServiciosRequest), tipoConsulta: '' });

        serviciosHome.getObtenerServiciosWS(serviciosRequest).then(function(response) {

            $scope.serviciosList = response.data.obtenerServiciosResponse.listadoProductosServicios;
            $scope.errorFuncional = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;

            if ($scope.errorFuncional == 0) {
                var breakEach = true;

                if (Array.isArray($scope.serviciosList)) {

                    angular.forEach($scope.serviciosList, function(val, key) {
                        if (breakEach) {
                            if (val.ProductoServicioResponse.idProductoServicio == objServico.comunResponseType.productoPrincipal) {
                                $scope.servicio = $scope.serviciosList[key];
								ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
								ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
								ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;
                                breakEach = false;
                            } else {
                                $scope.servicio = $scope.serviciosList[0];
								ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
								ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
								ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;
                            }
                        }
                    });
                } else {
                    $scope.serviciosList = [];
                    $scope.serviciosList.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                    $scope.servicio = $scope.serviciosList[0];
					ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
					ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
					ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;
                    $('select').css({ display: 'none' });
                    $('#textox').css({ background: 'none' });
                }

                getObtenerEstadoServicio($scope.servicio);
                getObtenerDetallePlanInternetWS($scope.servicio);
                actualizarProductoPrincipalSesion($scope.servicio);

                $("#textox").html($scope.servicio.ProductoServicioResponse.nombreAlias);
            } else {
                $scope.showUpps = true;
                $("#internet").show();
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerServicios - "+mensaje;
				auditoria();
                allSuccess = false;
            }

        });

    };

    getObtenerEstadoServicio = function(objServicio) {

        var idProd = objServicio.ProductoServicioResponse.idProductoServicio;
        var idDir = objServicio.ProductoServicioResponse.idDireccion;

        var obtenerEstadoServicioRequest = {
            "categoria": null,
            "idDireccion": null,
            "idProductoServicio": null,
            "idCuenta": null,
            "idRecibo": null,
            "tipoCliente": null
        }
        obtenerEstadoServicioRequest.categoria = categoriaInternet;
        obtenerEstadoServicioRequest.idProductoServicio = idProd;
        obtenerEstadoServicioRequest.tipoCliente = tipoCliente;
        obtenerEstadoServicioRequest.idDireccion = idDir;

        data = $httpParamSerializer({ requestJson: angular.toJson(obtenerEstadoServicioRequest) });

        serviciosHome.getObtenerEstadoServicioWS(data).then(function(response) {
            $scope.estadoServicio = response.data.obtenerEstadoServicioResponse;

            $scope.estadoServicioFlag = $scope.estadoServicio.defaultServiceResponse.idRespuesta;
           ResquestAuditoria.transactionId = $scope.estadoServicio.defaultServiceResponse.idTransaccional;
            var mensaje = $scope.estadoServicio.defaultServiceResponse.mensaje;
            $scope.cicloFacturacion = $scope.estadoServicio.cicloFacturacion;

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

        });
    };

    getObtenerDetallePlanInternetWS = function(objServicio) {

        var idDir = objServicio.ProductoServicioResponse.idDireccion;
        var idProd = objServicio.ProductoServicioResponse.idProductoServicio;

        var obtenerDetallePlanInternetRequest = {
            "idDireccion": null,
            "idProductoServicio": null,
        }

        obtenerDetallePlanInternetRequest.idDireccion = idDir;
        obtenerDetallePlanInternetRequest.idProductoServicio = idProd;

        data = $httpParamSerializer({ requestJson: angular.toJson(obtenerDetallePlanInternetRequest) });

        serviciosHome.getObtenerDetallePlanInternetWS(data).then(function(response) {

            $scope.planInternet = response.data.obtenerDetallePlanInternetResponse;

            $scope.consumosInternetFlag = $scope.planInternet.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId = $scope.planInternet.defaultServiceResponse.idTransaccional;
            var mensaje = $scope.planInternet.defaultServiceResponse.mensaje;

            $scope.velocidadMax = $scope.planInternet.velocidadMaxima;
            $scope.velocidadMin = $scope.planInternet.velocidadMinima;

            if ($scope.velocidadMax == "0" || $scope.velocidadMax == "") {
                $scope.velocidadMax = $scope.planInternet.porcentajeVelocidadMaxima + "% de la velocidad contratada";
            }

            if ($scope.velocidadMin == "0" || $scope.velocidadMin == "") {
                $scope.velocidadMin = $scope.planInternet.porcentajeVelocidadMinima + "% de la velocidad contratada";
            }

            if ($scope.consumosInternetFlag != 0) {
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
                $("#internet").delay(400).show(0);
                setTimeout(function() { aniamteBox('.box'); }, 400);
                firstRender = false;
            }

        });
    };

    this.cambioServicio = function() {

        $scope.estadoServicioFlag = null;
        $scope.consumosInternetFlag = null;
		ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
		ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
		ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;

        $("#textox").html($scope.servicio.ProductoServicioResponse.nombreAlias);

        getObtenerEstadoServicio($scope.servicio);
        getObtenerDetallePlanInternetWS($scope.servicio);
        actualizarProductoPrincipalSesion($scope.servicio);

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

    };

    actualizarProductoPrincipalSesion = function(objServico) {

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
        actualizarServicioSesion.tipoLinea = appTipoLinea;
        actualizarServicioSesion.categoria = appCategoria;
        actualizarServicioSesion.tipoClienteProductoPrincipal = appTipoClientePrincipal;

        data = $httpParamSerializer({ requestJson: angular.toJson(actualizarServicioSesion) });

        serviciosHome.actualizarProductoPrincipalSesion(data).then(function(response) {

        }, function(response) {});

    };

    function auditoria() {

        var Resquest = $httpParamSerializer({ requestJson: angular.toJson(ResquestAuditoria) });
        serviciosHome.enviarAuditoria(Resquest).then(function(response) {

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

        window.location.replace("/wps/myportal/miclaro/consumer/recibos/internet");

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

        getObtenerDetallePlanInternetWS($scope.servicio);

    };

    $scope.recargarEstadoServicio = function() {

        $('.serviciosBox').hide();
        $('.serviciosBox').fadeIn(1100);

        getObtenerEstadoServicio($scope.servicio);

    }

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
            $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 400);
        });

    }

    $scope.switchChange = function() {

        window.location.replace("/wps/myportal/miclaro/corporativo/home/internet");

    }

    $scope.mideTuVelocidad = function() {
        window.open("http://midetuvelocidad.claro.com.pe/", '_blank');
    }

});

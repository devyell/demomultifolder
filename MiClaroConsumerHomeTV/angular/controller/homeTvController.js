miClaroApp.controller("MiClaroHomeController", function($scope, $http, $httpParamSerializer, serviciosHome) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $(".publicidad").load("/wps/wcm/myconnect/mi%20claro%20content%20library/mi%20claro/banners/home%20tv");

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
    var categoriaTV = 4;
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
    $scope.consumosTvFlag = null;
    $scope.showUpps = false;
	 var ResquestAuditoria = {
                        operationCode: 'T0001',
                        pagina: 'P004',
                        transactionId: '',
                        estado: '',
                        servicio: '-',
                        tipoProducto: 'CLAROTV',
                        tipoLinea: '-',
                        tipoUsuario:'1',
                        perfil: '-',
                        monto: '',
                        descripcionoperacion: '-',
                        responseType: '/'
          };
	
    serviciosHome.getObtenerFlagProductoTV().then(function(response) {

        $scope.flagServiciosTV = response.data.comunResponseType.flagProductoTVSesion;
        $scope.ErrorFlagTV = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        $scope.FlagTVIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
        $scope.tipoClienteUsuario = response.data.comunResponseType.tipoCliente;
        $scope.tipoLineaUsuario = response.data.comunResponseType.tipoLinea;

        var emailModal = response.data.comunResponseType.usuarioLogueado;
        latamModal(emailModal);

        if ($scope.tipoClienteUsuario == 4) {
            $scope.showSwitch = true;
        }

        if ($scope.ErrorFlagTV == 0) {
            if ($scope.flagServiciosTV != "-1") {
                if ($scope.flagServiciosTV == 1 || $scope.flagServiciosTV == 3) {
                    $scope.init();
                } else {
                    $("#tv").show();
                   
                }
            } else {
                $("#tv").show();
               
                allSuccess = false;
            }
        } else {
            $scope.showUpps = true;
            $("#tv").show();
           
            allSuccess = false;
        }

    });

    $scope.init = function(objServico) {

        serviciosHome.getObtenerDatosSesion().then(function(response) {

            $scope.servPrincipalError = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            $scope.servPrincipalIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            $scope.servPrincipalMensaje = response.data.comunResponseType.defaultServiceResponse.mensaje;

            if ($scope.servPrincipalError == 0) {
                getObtenerServiciosTVWS(response.data);
            } else {
                $scope.showUpps = true;
                $("#tv").show();
                allSuccess = false;
            }

        });
    };

    getObtenerServiciosTVWS = function(objServico) {

        var osCategoria = objServico.comunResponseType.categoria;
        var osTipoLinea = objServico.comunResponseType.tipoLinea;
        var osTipoCliente = objServico.comunResponseType.tipoClienteProductoPrincipal;
        var osIdProductoServicio = objServico.comunResponseType.productoPrincipal;
        var osIdCuenta = objServico.comunResponseType.idCuenta;
        var osIdRecibo = objServico.comunResponseType.idRecibo;
        var osIdDireccion = objServico.comunResponseType.idDireccion;

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

        obtenerServiciosRequest.categoria = categoriaTV;
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
            ResquestAuditoria.transactionId  = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
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
                getObtenerDetallePlanTVWS($scope.servicio);
                actualizarProductoPrincipalSesion($scope.servicio);

            } else {
                $scope.showUpps = true;
                $("#tv").show();
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
        obtenerEstadoServicioRequest.categoria = categoriaTV;
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
				ResquestAuditoria.descripcionoperacion = "obtenerEstadoServicio - "+mensaje;
				auditoria();
                allSuccess = false;
            }

            if (allSuccess == true) {
					ResquestAuditoria.estado = "SUCCESS";
					ResquestAuditoria.descripcionoperacion = "-";
					auditoria();
            }

        }, function() {

        });
    }

    getObtenerDetallePlanTVWS = function(objServicio) {

        var idDir = objServicio.ProductoServicioResponse.idDireccion;
        var idProd = objServicio.ProductoServicioResponse.idProductoServicio;


        var obtenerDetallePlanTVRequest = {
            "idDireccion": null,
            "idProductoServicio": null,
        }

        obtenerDetallePlanTVRequest.idDireccion = idDir;
        obtenerDetallePlanTVRequest.idProductoServicio = idProd;

        data = $httpParamSerializer({ requestJson: angular.toJson(obtenerDetallePlanTVRequest) });

        serviciosHome.getObtenerDetallePlanTVWS(data).then(function(response) {
            $scope.planTV = response.data.obtenerDetallePlanTVResponse;
            $scope.consumosTvFlag = $scope.planTV.defaultServiceResponse.idRespuesta;
			ResquestAuditoria.transactionId = $scope.planTV.defaultServiceResponse.idTransaccional;
            var mensaje = $scope.planTV.defaultServiceResponse.mensaje;

            if ($scope.consumosTvFlag != 0) {
                ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerDetallePlanTVResponse - "+mensaje;
				auditoria();
                allSuccess = false;
            }

            if (allSuccess == true) {
				 ResquestAuditoria.estado = "SUCCESS";
				ResquestAuditoria.descripcionoperacion = "-";
				auditoria();
            }

            if (firstRender) {
                $("#tv").delay(400).show(0);
                setTimeout(function() { aniamteBox('.box'); }, 400);
                firstRender = false;
            }

        });

    }

    this.cambioServicio = function() {

        $scope.estadoServicioFlag = null;
        $scope.consumosTvFlag = null;
		ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
		ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
		ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;	
        getObtenerEstadoServicio($scope.servicio);
        getObtenerDetallePlanTVWS($scope.servicio);
        actualizarProductoPrincipalSesion($scope.servicio);
        aniamteBox(".box")

    }

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
        actualizarServicioSesion.categoria = categoriaTV;
        actualizarServicioSesion.tipoClienteProductoPrincipal = appTipoClientePrincipal;

        data = $httpParamSerializer({ requestJson: angular.toJson(actualizarServicioSesion) });

        serviciosHome.actualizarProductoPrincipalSesion(data).then(function(response) {

        });

    }

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
            'action': 'TV',
            'label': 'Botón: Libro de reclamaciones'
        });
    }

    $scope.pagarRecibo = function(objServico) {

        window.location.replace("/wps/myportal/miclaro/consumer/recibos/tv");

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Home Servicios',
            'action': 'TV',
            'label': 'Botón: Pagar mi recibo'
        });
    }

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

        getObtenerDetallePlanTVWS($scope.servicio);

    }

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
        window.location.replace("/wps/myportal/miclaro/corporativo/home/tv");
    }

    $scope.guiaCanales = function() {
        window.open("http://catalogo.claro.com.pe/guia-canales/", "_blank");
    }

});

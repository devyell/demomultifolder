miClaroApp.controller("MiClaroHomeController", function($scope, $http, $httpParamSerializer, serviciosHome) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $(".publicidad").load("/wps/wcm/myconnect/mi%20claro%20content%20library/mi%20claro/banners/home%20fijo");

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
    var categoriaFijo = 2;
    var tipoPermiso = 5;
    var titularidadServicio = 7;
    var pagina = 0;
    var cantResultadosPagina = 0;
    var productoPrincipalXidRecibo = false;
    var tipoLinea = 3;
    var tipoCliente = 1;
    var criterio = 3;
    var allSuccess = true;
    var firstRender = true;
    $scope.estadoServicioFlag = null;
    $scope.consumosFijoFlag = null;
    $scope.showUpps = false;
    var ResquestAuditoria = {
        operationCode: 'T0001',
        pagina: 'P002',
        transactionId: '',
        estado: '-',
        servicio: '-',
        tipoProducto: 'TELEFONIA',
        tipoLinea: '',
        tipoUsuario: '1',
        perfil: '-',
        monto: '',
        descripcionoperacion: '-',
        responseType: '/'
    };


    serviciosHome.getObtenerFlagProductoFijo().then(function(response) {

        $scope.flagServiciosFijo = response.data.comunResponseType.flagProductoFijoSesion;
        $scope.ErrorFlagFijo = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        $scope.FlagFijoIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
        $scope.tipoClienteUsuario = response.data.comunResponseType.tipoCliente;
        $scope.tipoLineaUsuario = response.data.comunResponseType.tipoLinea;
        ResquestAuditoria.tipoUsuario = response.data.comunResponseType.tipoCliente;

        var emailModal = response.data.comunResponseType.usuarioLogueado;

        latamModal(emailModal);


        if ($scope.tipoClienteUsuario == 4) {
            $scope.showSwitch = true;
        }

        if ($scope.ErrorFlagFijo == 0) {
            if ($scope.flagServiciosFijo != "-1") {
                if ($scope.flagServiciosFijo == 1 || $scope.flagServiciosFijo == 3) {
                    $scope.init();
                } else {
                    $("#fijo").show();

                }
            } else {
                $("#fijo").show();

                allSuccess = false;
            }
        } else {
            $scope.showUpps = true;
            $("#fijo").show();

            allSuccess = false;
        }

    });

    $scope.init = function(objServico) {

        serviciosHome.getObtenerDatosSesion().then(function(response) {

            $scope.servPrincipalError = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            $scope.servPrincipalIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            $scope.servPrincipalMensaje = response.data.comunResponseType.defaultServiceResponse.mensaje;

            if ($scope.servPrincipalError == 0) {
                getObtenerServiciosFijaWS(response.data);
            } else {
                $scope.showUpps = true;
                $("#fijo").show();

                allSuccess = false;
            }
        });
    }

    getObtenerServiciosFijaWS = function(objServico) {

        var obtenerServiciosRequest = {
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
        };

        obtenerServiciosRequest.categoria = categoriaFijo;
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
                                ResquestAuditoria.servicio = $scope.servicio.ProductoServicioResponse.nombre;
                                ResquestAuditoria.tipoLinea = $scope.servicio.ProductoServicioResponse.tipoLinea;
                                ResquestAuditoria.perfil = $scope.servicio.ProductoServicioResponse.tipoPermiso;
                                breakEach = false;
                            } else {
                                $scope.servicio = $scope.serviciosList[0];
                                ResquestAuditoria.servicio = $scope.servicio.ProductoServicioResponse.nombre;
                                ResquestAuditoria.tipoLinea = $scope.servicio.ProductoServicioResponse.tipoLinea;
                                ResquestAuditoria.perfil = $scope.servicio.ProductoServicioResponse.tipoPermiso;
                            }
                        }
                    });

                } else {
                    $scope.serviciosList = [];
                    $scope.serviciosList.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                    $scope.servicio = $scope.serviciosList[0];
                    ResquestAuditoria.servicio = $scope.servicio.ProductoServicioResponse.nombre;
                    ResquestAuditoria.tipoLinea = $scope.servicio.ProductoServicioResponse.tipoLinea;
                    ResquestAuditoria.perfil = $scope.servicio.ProductoServicioResponse.tipoPermiso;

                    $('select').css({ display: 'none' });
                    $('#textox').css({ background: 'none' });
                }

                getObtenerEstadoServicio($scope.servicio);
                getObtenerConsumoGeneralFijaWS($scope.servicio);
                actualizarProductoPrincipalSesion($scope.servicio);

            } else {
                $scope.showUpps = true;
                $("#fijo").show();
                ResquestAuditoria.estado = "ERROR";
                ResquestAuditoria.descripcionoperacion = "obtenerServicios - " + mensaje;
                auditoria();
                allSuccess = false;
            }

        });
    }

    getObtenerEstadoServicio = function(objServicio) {

        var idProd = objServicio.ProductoServicioResponse.idProductoServicio;
        var idDir = objServicio.ProductoServicioResponse.idDireccion;

        var obtenerEstadoServicioRequest = {
            "categoria": null,
            "idDireccion": null,
            "idProductoServicio": null,
            "idCuenta": null,
            "idLinea": null,
            "idRecibo": null
        }
        obtenerEstadoServicioRequest.categoria = categoriaFijo;
        obtenerEstadoServicioRequest.idProductoServicio = idProd;
        obtenerEstadoServicioRequest.idDireccion = idDir

        data = $httpParamSerializer({ requestJson: angular.toJson(obtenerEstadoServicioRequest) });

        serviciosHome.getObtenerEstadoServicioWS(data).then(function(response) {
            $scope.estadoServicio = response.data.obtenerEstadoServicioResponse;
            $scope.estadoServicioFlag = $scope.estadoServicio.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId = $scope.estadoServicio.defaultServiceResponse.idTransaccional;
            $scope.cicloFacturacion = $scope.estadoServicio.cicloFacturacion;
            var mensaje = $scope.estadoServicio.defaultServiceResponse.mensaje;

            if ($scope.estadoServicioFlag != 0) {
                ResquestAuditoria.estado = "ERROR";
                ResquestAuditoria.descripcionoperacion = "obtenerEstadoServicio - " + mensaje;
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
    var chartServicios = null;

    getObtenerConsumoGeneralFijaWS = function(ojbServicio) {

        var idDir = ojbServicio.ProductoServicioResponse.idDireccion;
        var idProd = ojbServicio.ProductoServicioResponse.idProductoServicio;


        var obtenerConsumoGeneralFijaRequest = {
            "idPeriodo": null,
            "idDireccion": null,
            "idLinea": null,
            "idProductoServicio": null,
            "criterio": null
        }

        obtenerConsumoGeneralFijaRequest.idDireccion = idDir;
        obtenerConsumoGeneralFijaRequest.idProductoServicio = idProd;
        obtenerConsumoGeneralFijaRequest.criterio = criterio;

        data = $httpParamSerializer({ requestJson: angular.toJson(obtenerConsumoGeneralFijaRequest) });

        serviciosHome.getObtenerConsumoGeneralFijaWS(data).then(function(response) {
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
                var cantidadTotalIndicador = $scope.consumoServicio.porDestino.cantidadTotal;
                var libres = parseInt($scope.consumoServicio.porDestino.cantidadTotal) - (local + nacional + internacional);

                $scope.minutosUsado = local + nacional + internacional;


                $('.pie-chart').each(function(i, e) {
                    var $this = $(this);
                    var $chart = $this.find(".canvas");
                    var $opts = { responsive: true, title: { display: false }, legend: { display: false }, cutoutPercentage: 75 };
                    var $ttext = [];
                    var $tdata = [];
                    var vacio = 1;
                    var $tcolor = [];
                    var $total = 0;

                    $ttext.push("Internacional", "Nacional", "Local", "Libres");
                    $tdata.push(internacional, nacional, local, libres);

                    $this.find("li").each(function($j, el) {
                        var $item = $(this);
                        $item.find("span.square").css({ background: $item.attr("data-color") });
                        $tcolor.push($item.attr("data-color"));

                        $total = $total + parseInt($item.attr("data-value"));
                    });
                    if (cantidadTotalIndicador == 0) {
                        var $tdata = [];
                        $tdata.push(vacio);
                        Chart.defaults.global.legend.display = false;
                        Chart.defaults.global.tooltips.enabled = false;
                        var $data = { labels: $ttext, datasets: [{ data: $tdata, backgroundColor: ["#cccccc"], hoverBorderColor: "transparent" }] };
                    } else {
                        var $data = { labels: $ttext, datasets: [{ data: $tdata, backgroundColor: $tcolor, hoverBorderColor: "transparent" }] };
                    }

                    if (chartServicios == null) {
                        setTimeout(function() {
                            chartServicios = new Chart($chart, { type: 'doughnut', data: $data, options: $opts });
                        }, 500);
                    } else {
                        chartServicios.destroy();
                        chartServicios = new Chart($chart, { type: 'doughnut', data: $data, options: $opts });
                    }

                });
            } else {
                ResquestAuditoria.estado = "ERROR";
                ResquestAuditoria.descripcionoperacion = "obtenerConsumoGeneralFija - " + mensaje;
                auditoria();
                allSuccess = false;
            }

            if (allSuccess == true) {
                ResquestAuditoria.estado = "SUCCESS";
                ResquestAuditoria.descripcionoperacion = "-";
                auditoria();
            }
        });

        if (firstRender) {
            $("#fijo").delay(400).show(0);
            setTimeout(function() { aniamteBox('.box'); }, 400);
            firstRender = false;
        }


    }

    this.cambioServicio = function() {

        $scope.estadoServicioFlag = null;
        $scope.consumosFijoFlag = null;

        ResquestAuditoria.servicio = $scope.servicio.ProductoServicioResponse.nombre;
        ResquestAuditoria.tipoLinea = $scope.servicio.ProductoServicioResponse.tipoLinea;
        ResquestAuditoria.perfil = $scope.servicio.ProductoServicioResponse.tipoPermiso;
        getObtenerEstadoServicio($scope.servicio);
        getObtenerConsumoGeneralFijaWS($scope.servicio);
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
        actualizarServicioSesion.categoria = appCategoria;
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
            'action': 'Fijo',
            'label': 'Botón: Libro de reclamaciones'
        });
    }

    $scope.saldosConsumos = function(objServico) {

        window.location.replace("/wps/myportal/miclaro/consumer/consultas/saldosyconsumos/fijo");

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Home Servicios',
            'action': 'Fijo',
            'label': 'Botón: Saldos y consumos'
        });
    }

    $scope.pagarRecibo = function(objServico) {

        window.location.replace("/wps/myportal/miclaro/consumer/recibos/fijo");

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Home Servicios',
            'action': 'Fijo',
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

        getObtenerConsumoGeneralFijaWS($scope.servicio);

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

        window.location.replace("/wps/myportal/miclaro/corporativo/home/fijo");

    }

});
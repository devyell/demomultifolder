app.controller("mycontroller", function($scope, $http, $httpParamSerializer, CapaServicio) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $(document).ready(function() {
        $("#imgPublicidad").load("/wps/wcm/myconnect/mi%20claro%20content%20library/mi%20claro/banners/Servicios%20Contratados%20Movil%20Consumer");
        $('.help').tooltip({ placement: "top" });
    });

    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    $scope.mensaje_tooltip = "Indica la fecha de termino del contrato de tu equipo, el cual firmaste con Claro para recibir un descuento especial en la compra de tu equipo móvil";

    var fixed_categoria = WPSCategoria.movil;
    var fixed_tipoPermiso = WPSTipoPermiso.todos;
    var fixed_titularidadServicio = 7;
    var fixed_pagina = 0;
    var fixed_cantResultadosPagina = 0;
    var fixed_productoPrincipalXidRecibo = false;
    var fixed_tipoLinea = 3;
    var fixed_tipoCliente = 1;
    var fixed_pagina = 0;
    var fixed_cantResultadosPagina = 0;

    var tramaAuditoria = {
        operationCode: 'T0002',
        pagina: 'P005',
        transactionId: null,
        estado: '',
        servicio: '-',
        tipoProducto: 'MOVIL',
        tipoLinea: '-',
        tipoUsuario: '1',
        perfil: '-',
        monto: '',
        descripcionoperacion: '-',
        responseType: '/'
    };

    CapaServicio.getObtenerFlagProductoMovilSesion().then(function(response) {

        tramaAuditoria.transactionId = response.data.comunResponseType.defaultServiceResponse.idTransaccional;

        var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        if (id_respuesta == 0) {

            var flag = response.data.comunResponseType.flagProductoMovilSesion;
            if (flag != "-1") {
                if (flag == "0" || flag == "2") {
                    $("#show_notiene").show();

                } else {
                    if (flag == "1" || flag == "3") {
                        $scope.init();
                    } else {
                        if (flag == "") {
                            $("#show_error_root").show();

                        }
                    }
                }
            } else {
                $("#show_error_root").show();

            }
        } else {
            $("#show_error_root").show();

        }

    });

    $scope.init = function() {

        $("#show_panel").hide();
        $("#show_error").hide();

        CapaServicio.getObtenerServicioPrincipal().then(function(response) {

            var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {
                $scope.productoPrincipal = response.data.comunResponseType.productoPrincipal;
                $scope.idDireccion = response.data.comunResponseType.idDireccion;
                $("#show_panel").show();
                $scope.getObtenerServiciosTVWS();
            } else {
                $("#show_error").show();
            }



        }, function(error) {});

    };

    $scope.getObtenerServiciosTVWS = function() {

        $("#show_servicios").hide();
        $("#show_servicios_error").hide();

        var trama = {
            categoria: fixed_categoria,
            tipoLinea: fixed_tipoLinea,
            tipoCliente: fixed_tipoCliente,
            idProductoServicio: null,
            tipoPermiso: fixed_tipoPermiso,
            idCuenta: null,
            idRecibo: null,
            idDireccion: null,
            nombreProducto: null,
            pagina: fixed_pagina,
            cantResultadosPagina: fixed_cantResultadosPagina,
            productoPrincipalXidRecibo: fixed_productoPrincipalXidRecibo,
            titularidadServicio: fixed_titularidadServicio
        };

        request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
        CapaServicio.getObtenerServicios(request).then(function(response) {

            var id_respuesta = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
            var mensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
            tramaAuditoria.transactionId = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
            if (id_respuesta == 0) {

                $scope.lsServicio = response.data.obtenerServiciosResponse.listadoProductosServicios;

                if (Array.isArray($scope.lsServicio)) {

                    var flag_next = true;
                    angular.forEach($scope.lsServicio, function(val, key) {
                        if (flag_next) {
                            if (val.ProductoServicioResponse.idProductoServicio == $scope.productoPrincipal) {
                                $scope.servicioSelect = $scope.lsServicio[key];
                                tramaAuditoria.servicio = $scope.servicioSelect.ProductoServicioResponse.nombre;
                                tramaAuditoria.tipoLinea = $scope.servicioSelect.ProductoServicioResponse.tipoLinea;
                                tramaAuditoria.perfil = $scope.servicioSelect.ProductoServicioResponse.tipoPermiso;
                                flag_next = false;
                            } else {
                                $scope.servicioSelect = $scope.lsServicio[0];
                                tramaAuditoria.servicio = $scope.servicioSelect.ProductoServicioResponse.nombre;
                                tramaAuditoria.tipoLinea = $scope.servicioSelect.ProductoServicioResponse.tipoLinea;
                                tramaAuditoria.perfil = $scope.servicioSelect.ProductoServicioResponse.tipoPermiso;

                            }
                        }
                    });

                } else {
                    $scope.lsServicio = [];
                    $scope.lsServicio.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                    $scope.servicioSelect = $scope.lsServicio[0];
                    tramaAuditoria.servicio = $scope.servicioSelect.ProductoServicioResponse.nombre;
                    tramaAuditoria.tipoLinea = $scope.servicioSelect.ProductoServicioResponse.tipoLinea;
                    tramaAuditoria.perfil = $scope.servicioSelect.ProductoServicioResponse.tipoPermiso;
                    $(".pullservicio").addClass("disabled");
                }

                $scope.getObtenerDatosAdicionalesServicioMovilWS();
                $scope.getObtenerDetallePlanMovilWS();
                $scope.getObtenerServiciosAdicionalesWS();
                $scope.actualizarProductoPrincipalSesion();

                $("#show_servicios").show();


            } else {
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "obtenerServicios - " + mensaje;
                $scope.pushAuditoria();
                $("#show_servicios_error").show();
            }

        });

        $("#movil").delay(400).show(0);
        setTimeout(function() { animateBOX('.box'); }, 400);

    };

    $scope.getObtenerDatosAdicionalesServicioMovilWS = function(objServico) {

        $scope.show_datosadicionales_error = false;
        $scope.show_detalleplan_head_prepago = false;
        $scope.show_detalleplan_head_postpago = false;
        $scope.show_datosadicionales_tipoLinea_postpago = false;
        $scope.show_datosadicionales_tipoLinea_prepago = false;

        var trama = {
            "idProductoServicio": $scope.servicioSelect.ProductoServicioResponse.idProductoServicio,
            "idCuenta": $scope.servicioSelect.ProductoServicioResponse.idCuenta,
            "idRecibo": $scope.servicioSelect.ProductoServicioResponse.idRecibo,
            "tipoCliente": 1
        };

        $scope.wps_fechaActivacion = "";
        $scope.wps_finContratoEquipo = "";
        $scope.wps_fechaExpiracion = "";
        $scope.wps_estado = "";
        $scope.wps_simboloMonedaCargo = "";
        $scope.wps_cargoFijo = "";
        $scope.wps_planActual = "";


        request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
        CapaServicio.getObtenerDatosAdicionalesServicioMovil(request).then(function(response) {


            var id_respuesta = response.data.obtenerDatosAdicionalesServicioMovilResponse.defaultServiceResponse.idRespuesta;
            var mensaje = response.data.obtenerDatosAdicionalesServicioMovilResponse.defaultServiceResponse.mensaje
            tramaAuditoria.transactionId = response.data.obtenerDatosAdicionalesServicioMovilResponse.defaultServiceResponse.idTransaccional;;

            if (id_respuesta == 0) {

                $scope.wps_fechaActivacion = response.data.obtenerDatosAdicionalesServicioMovilResponse.fechaActivacion;
                if ($scope.wps_fechaActivacion != "") {
                    $scope.wps_show_fecha_activacion = true;
                } else {
                    $scope.wps_fechaActivacion = "";
                    $scope.wps_show_fecha_activacion = false;
                }

                $scope.wps_finContratoEquipo = response.data.obtenerDatosAdicionalesServicioMovilResponse.finContratoEquipo;
                if ($scope.wps_finContratoEquipo > 0) {
                    $scope.wps_show_fin_contrato = true;
                } else {
                    $scope.wps_finContratoEquipo = 0;
                    $scope.wps_show_fin_contrato = false;
                }

                $scope.wps_fechaExpiracion = response.data.obtenerDatosAdicionalesServicioMovilResponse.fechaExpiracion;
                if ($scope.wps_fechaExpiracion != "") {
                    $scope.wps_show_fecha_expiracion = true;
                } else {
                    $scope.wps_fechaExpiracion = "";
                    $scope.wps_show_fecha_expiracion = false;
                }


                $scope.wps_estado = response.data.obtenerDatosAdicionalesServicioMovilResponse.estado;
                if ($scope.wps_estado != "") {
                    $scope.wps_show_estado = true;
                } else {
                    $scope.wps_show_estado = false;
                }

                $scope.wps_simboloMonedaCargo = response.data.obtenerDatosAdicionalesServicioMovilResponse.simboloMonedaCargo;
                $scope.wps_cargoFijo = response.data.obtenerDatosAdicionalesServicioMovilResponse.cargoFijo;
                $scope.wps_planActual = response.data.obtenerDatosAdicionalesServicioMovilResponse.planActual;

                if ($scope.servicioSelect.ProductoServicioResponse.tipoLinea == WPSTipoLinea.prepago) {
                    $scope.show_datosadicionales_tipoLinea_prepago = true;
                    $scope.show_detalleplan_head_prepago = true;
                    $scope.show_detalleplan_head_postpago = false;

                } else {
                    $scope.show_datosadicionales_tipoLinea_postpago = true;
                    $scope.show_detalleplan_head_postpago = true;
                    $scope.show_detalleplan_head_prepago = false;

                }

            } else {
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "obtenerDatosAdicionalesServicioMovil - " + mensaje;
                $scope.pushAuditoria();
                $scope.show_datosadicionales_error = true;
                $scope.show_detalleplan_head_postpago = false;
            }

        }, function() {});

    };

    $scope.getObtenerDetallePlanMovilWS = function() {

        $scope.show_detalleplan_tabla_error = false;

        if ($scope.servicioSelect.ProductoServicioResponse.tipoPermiso != 4) {
            $("#btnCambiarPlan").hide();
        } else {
            $("#btnCambiarPlan").show();
        }

        var trama = {
            "idProductoServicio": $scope.servicioSelect.ProductoServicioResponse.idProductoServicio,
            "idCuenta": $scope.servicioSelect.ProductoServicioResponse.idCuenta,
            "idRecibo": $scope.servicioSelect.ProductoServicioResponse.idRecibo,
            "flagBolsa": false
        };



        $scope.wps_listadoDetalle = [];
        request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
        CapaServicio.getobtenerDetallePlanMovil(request).then(function(response) {
            var id_respuesta = response.data.obtenerDetallePlanMovilResponse.defaultServiceResponse.idRespuesta;
            var mensaje = response.data.obtenerDetallePlanMovilResponse.defaultServiceResponse.mensaje;
            tramaAuditoria.transactionId = response.data.obtenerDetallePlanMovilResponse.defaultServiceResponse.idTransaccional;
            if (id_respuesta == 0) {

                $scope.wps_listadoDetalle = response.data.obtenerDetallePlanMovilResponse.listadoDetalle;

                if (!Array.isArray($scope.wps_listadoDetalle)) {
                    $scope.wps_listadoDetalle = [];
                    $scope.wps_listadoDetalle.push(response.data.obtenerDetallePlanMovilResponse.listadoDetalle);
                }
                tramaAuditoria.estado = "SUCCESS";
                tramaAuditoria.descripcionoperacion = "-";
                $scope.pushAuditoria();

            } else {
                $scope.show_detalleplan_tabla_error = true;
                if (id_respuesta == 4) {
                
                } else {

                }
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "obtenerDetallePlanMovil - " + mensaje;
                $scope.pushAuditoria();
            }

        }, function() {});

    };


    $scope.getObtenerServiciosAdicionalesWS = function() {

        $("#show_serviciosadicionales").hide();
        $("#show_serviciosadicionales_error").hide();

        var trama = {
            "categoria": fixed_categoria,
            "idProductoServicio": $scope.servicioSelect.ProductoServicioResponse.idProductoServicio,
            "idCuenta": $scope.servicioSelect.ProductoServicioResponse.idCuenta,
            "idRecibo": $scope.servicioSelect.ProductoServicioResponse.idRecibo,
            "idDireccion": null,
            "idLinea": null
        };

        $scope.wps_lsServicioAdicional = [];
        request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
        CapaServicio.getObtenerServiciosAdicionales(request).then(function(response) {



            var id_respuesta = response.data.obtenerServiciosAdicionalesResponse.defaultServiceResponse.idRespuesta;
            var mensaje = response.data.obtenerServiciosAdicionalesResponse.defaultServiceResponse.mensaje;
            tramaAuditoria.transactionId = response.data.obtenerServiciosAdicionalesResponse.defaultServiceResponse.idTransaccional;
            if (id_respuesta == 0) {

                $scope.wps_lsServicioAdicional = response.data.obtenerServiciosAdicionalesResponse.listado;
                if (!angular.isArray($scope.wps_lsServicioAdicional)) {
                    $scope.wps_lsServicioAdicional = [];
                    $scope.wps_lsServicioAdicional.push(response.data.obtenerServiciosAdicionalesResponse.listado);
                }

                if (($scope.wps_lsServicioAdicional).length > 0) {
                    $("#show_serviciosadicionales").show();
                }

            } else {

                if (id_respuesta == 4) {

                } else {
                    $("#show_serviciosadicionales_error").show();
                }
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "obtenerServiciosAdicionales - " + mensaje;
                $scope.pushAuditoria();

            }

        }, function() {});

    };

    $scope.getSolicitarServicioAdicional = function(model) {

        var trama = {
            "categoria": fixed_categoria,
            "idProductoServicio": $scope.servicioSelect.ProductoServicioResponse.idProductoServicio,
            "codServicioAdicional": model.codServicioAdicional,
            "codTipoServicioAdicional": model.codTipoServicioAdicional,
            "idCuenta": null,
            "idRecibo": null,
            "idDireccion": null,
            "idLinea": null
        };

        request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
        CapaServicio.getSolicitarServicioAdicional(request).then(function(response) {

            var id_respuesta = response.data.solicitarServicioAdicionalResponse.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {
                var resultado = response.data.solicitarServicioAdicionalResponse.resultado;
                if (resultado == 'true') {
                    window.location.replace("/wps/myportal/miclaro/consumer/solicitudes/paquetestvadicionales");
                }
            }

            tramaAuditoria.transactionId = response.data.solicitarServicioAdicionalResponse.defaultServiceResponse.idRespuesta;
            var wpsclaro_mensaje = response.data.comunResponseType.defaultServiceResponse.mensaje;

            if (id_respuesta == 0) {
                var rs = response.data.solicitarServicioAdicionalResponse.resultado;
                if (rs == 'true') {
                    tramaAuditoria.estado = "SUCCESS";
                    tramaAuditoria.descripcionoperacion = "-";
                } else {
                    tramaAuditoria.estado = "ERROR";
                    tramaAuditoria.descripcionoperacion = "solicitarServicioAdicional - " + wpsclaro_mensaje;
                }
            } else {
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "solicitarServicioAdicional - " + wpsclaro_mensaje;
            }

            $scope.pushAuditoria();

        }, function() {});

    };

    $scope.pushAuditoria = function() {

        request = $httpParamSerializer({ requestJson: angular.toJson(tramaAuditoria) });
        CapaServicio.enviarAuditoria(request).then(function(response) {}, function(error) {});

    };

    $scope.changeServicio = function() {

        animacionBox();
        tramaAuditoria.servicio = $scope.servicioSelect.ProductoServicioResponse.nombre;
        tramaAuditoria.tipoLinea = $scope.servicioSelect.ProductoServicioResponse.tipoLinea;
        tramaAuditoria.perfil = $scope.servicioSelect.ProductoServicioResponse.tipoPermiso;

        $scope.show_detalleplan_head_prepago = false;
        $scope.show_detalleplan_head_postpago = false;

        $scope.getObtenerDatosAdicionalesServicioMovilWS();
        $scope.getObtenerDetallePlanMovilWS();
        $scope.getObtenerServiciosAdicionalesWS();
        $scope.actualizarProductoPrincipalSesion();
    };

    $scope.open_activarservicio = function(model) {

        imprimir(model);

        $scope.modal_titulo = model.etiqueta;
        $scope.modal_descripcion = model.tooltip;
        $scope.modal_codServicioAdicional = model.codServicioAdicional;
        $scope.modal_codTipoServicioAdicional = model.codTipoServicioAdicional;

        $("#view_activarservicio").show();

    };

    $scope.close_activarservicio = function() {
        $("#view_activarservicio").hide();
    };

    $scope.request_activarservicio = function() {

        var trama = {
            "categoria": fixed_categoria,
            "idProductoServicio": $scope.servicioSelect.ProductoServicioResponse.idProductoServicio,
            "idCuenta": null,
            "idRecibo": null,
            "idDireccion": null,
            "idLinea": null,
            "codServicioAdicional": $scope.modal_codServicioAdicional,
            "codTipoServicioAdicional": $scope.modal_codTipoServicioAdicional
        };


        request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
        CapaServicio.getSolicitarServicioAdicional(request).then(function(response) {

            var id_respuesta = response.data.solicitarServicioAdicionalResponse.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {
                var resultado = response.data.solicitarServicioAdicionalResponse.resultado;
                if (resultado == 'true') {
                    window.location.replace("/wps/myportal/miclaro/consumer/consultas/servicioscontratados/movil");
                } else {
                    $("#view_activarservicio").hide();
                }
            } else {
                $("#view_activarservicio").hide();
            }

        });

    };

    $scope.dataLayerVerSaldosConsumos = function() {

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Consultas',
            'action': 'Botón: Movil',
            'label': 'Ver saldos y consumos'
        });

        window.location.replace("/wps/myportal/miclaro/consumer/consultas/saldosyconsumos/movil");

    };

    $scope.dataLayerCambiarPlan = function() {

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Consultas',
            'action': 'Botón: Movil',
            'label': 'Cambiar de plan'
        });

        window.location.replace("/wps/myportal/miclaro/consumer/solicitudes/cambiodeplan/movil");

    };

    $scope.actualizarProductoPrincipalSesion = function() {

        var trama = {
            productoPrincipal: $scope.servicioSelect.ProductoServicioResponse.idProductoServicio,
            nombreProductoPrincipal: $scope.servicioSelect.ProductoServicioResponse.nombre,
            idDireccion: $scope.servicioSelect.ProductoServicioResponse.idDireccion,
            tipoLinea: $scope.servicioSelect.ProductoServicioResponse.tipoLinea,
            categoria: fixed_categoria,
            tipoClienteProductoPrincipal: $scope.servicioSelect.ProductoServicioResponse.tipoCliente,
            idCuenta: null,
            idRecibo: null,
            idLinea: null,
            numeroTelFijo: null
        };

        request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
        CapaServicio.actualizarProductoPrincipalSesion(request).then(function(response) {});

    };

    $scope.switchChange = function() {
        window.location.replace("/wps/myportal/miclaro/corporativo/consultas/servicioscontratados/movil");
    };

    animateBOX = function(boxClass) {

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

    };

});
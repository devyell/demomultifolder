app.controller("mycontroller", function($scope, $http, $httpParamSerializer, CapaServicio) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $(document).ready(function() {
        $("#imgPublicidad").load("/wps/wcm/myconnect/mi%20claro%20content%20library/mi%20claro/banners/Servicios%20Contratados%20Movil%20Corporativo");
        $("#imgPublicidad2").load("/wps/wcm/myconnect/mi%20claro%20content%20library/mi%20claro/banners/Servicios%20Contratados%20Movil%20Corporativo");
        $('.help').tooltip({ placement: "top" });
    });

    angular.element(document).ready(function() {
        initAutocomplete();
    });

    $scope.switchSelect = true;

    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion03;

    var fixed_categoria = WPSCategoria.movil;
    var fixed_tipoPermiso = WPSTipoPermiso.todos;
    var fixed_titularidadServicio = 7;
    var fixed_productoPrincipalXidRecibo = false;
    var fixed_tipoLinea = 3;
    var fixed_tipoCliente = 2;
    var fixed_pagina = 0;
    var fixed_cantResultadosPagina = 0;

    $scope.show_filterlineamovil = false;
    $scope.show_bolsas_contratadas = true;
    $scope.show_linea_especifica = false;

    $scope.show_directorio1 = true;
    $scope.show_directorio2 = false;
    $scope.wps_textAction = "Buscar línea";
    $scope.wps_tipo_load = "bolsa";

    $scope.wps_listadetalle = [];

    var tramaAuditoria = {
        operationCode: 'T0002',
        pagina: 'P051',
        transactionId: null,
        estado: '',
        servicio: '-',
        tipoProducto: 'MOVIL',
        tipoLinea: '-',
        tipoUsuario: '2',
        perfil: '1',
        monto: '',
        descripcionoperacion: '-',
        responseType: '/'
    };

    CapaServicio.getObtenerFlagProductoMovil().then(function(response) {
        tramaAuditoria.transactionId = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
        var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        if (id_respuesta == 0) {

            var flag = response.data.comunResponseType.flagProductoMovilSesion;

            if (flag != "-1") {
                if (flag == "0" || flag == "1") {
                    $("#show_notiene").show();

                } else {
                    if (flag == "2" || flag == "3") {
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
        $("#id_bolsas_contratadas").hide();
        $("#show_error").hide();

        CapaServicio.getObtenerServicioPrincipal().then(function(response) {

            var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {

                $scope.idCuentaPrincipal = response.data.comunResponseType.idCuenta;
                $scope.idDireccion = response.data.comunResponseType.idDireccion;
                $scope.idLinea = response.data.comunResponseType.idLinea;
                $scope.idReciboPrincipal = response.data.comunResponseType.idRecibo;
                $scope.nombreAliasaMostrar = response.data.comunResponseType.nombreProductoPrincipal;
                $scope.idServicio = response.data.comunResponseType.productoPrincipal;
                $scope.tipoCliente = response.data.comunResponseType.tipoClienteProductoPrincipal;
                $scope.categoria = response.data.comunResponseType.categoria;
                $scope.tipoLinea = response.data.comunResponseType.tipoLinea;

                if ($scope.wps_tipo_load == "bolsa") {
                    $scope.cargarDataBolsasContratadas();
                    $("#id_bolsas_contratadas").show();
                    $("#id_linea_especifica").hide();
                } else {
                    $scope.cargarDataLineaEspecifica();
                    $("#id_linea_especifica").show();
                    $("#id_bolsas_contratadas").hide();
                }

                $("#show_panel").show();


            } else {
                $("#show_error").show();
            }


        });
    };

    $scope.cargarDataBolsasContratadas = function() {
        $scope.wps_tipo_load = "bolsa";
        $scope.obtenerListadoMovilCorporativoCuenta();

    };

    $scope.cargarDataLineaEspecifica = function() {
        $scope.wps_tipo_load = "linea";
        $scope.obtenerListadoMovilCorporativoCuenta();
    };

    $scope.obtenerListadoMovilCorporativoCuenta = function() {

        CapaServicio.obtenerListadoMovilCorporativoCuentaService().then(function(response) {

            var id_respuesta = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {

                $scope.lsCuenta = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta;
                if (Array.isArray($scope.lsCuenta)) {
                    var flag_next = true;
                    angular.forEach($scope.lsCuenta, function(val, key) {
                        if (flag_next) {
                            if (val.idCuenta == $scope.idCuentaPrincipal) {
                                $scope.cuentaSelect = $scope.lsCuenta[key];
                                flag_next = false;
                            } else {
                                $scope.cuentaSelect = $scope.lsCuenta[0];
                            }
                        }
                    });
                } else {
                    $scope.lsCuenta = [];
                    $scope.lsCuenta.push(response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta);
                    $scope.cuentaSelect = $scope.lsCuenta[0];
                    $(".pulldate").addClass("disabled");
                }

                $scope.obtenerListadoMovilCorporativoRecibo();

            }

        });
    };

    $scope.obtenerListadoMovilCorporativoRecibo = function() {

        var trama = {
            "idCuenta": $scope.cuentaSelect.idCuenta
        };


        request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
        CapaServicio.obtenerListadoMovilCorporativoReciboService(request).then(function(response) {

            var id_respuesta = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {

                $scope.lsRecibo = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo;
                if (Array.isArray($scope.lsRecibo)) {
                    var flag_next = true;
                    angular.forEach($scope.lsRecibo, function(val, key) {
                        if (flag_next) {
                            if (val.idRecibo == $scope.idReciboPrincipal) {
                                $scope.reciboSelect = $scope.lsRecibo[key];
                                flag_next = false;
                            } else {
                                $scope.reciboSelect = $scope.lsRecibo[0];
                            }
                        }
                    });
                } else {
                    $scope.lsRecibo = [];
                    $scope.lsRecibo.push(response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo);
                    $scope.reciboSelect = $scope.lsRecibo[0];
                    $(".pulldate").addClass("disabled");
                }

                if ($scope.wps_tipo_load === "bolsa") {
                    $scope.setIDProductoPrincipal_BOLSA();
                } else {
                    if ($scope.wps_tipo_load === "linea") {
                        $scope.obtenerListaServicio_LINEA();
                    }
                }

            }

        });
    };

    $scope.setIDProductoPrincipal_BOLSA = function() {

        if ($scope.categoria == "1" && $scope.tipoCliente == "2") {

            $scope.WPS_IDProductoPrincipal = $scope.idServicio;
            $scope.obtenerDatosAdicionalesServicioMovil_BOLSA();
            $scope.obtenerDetallePlanMovil_BOLSA();

        } else {

            var trama = {
                categoria: fixed_categoria,
                tipoLinea: fixed_tipoLinea,
                tipoCliente: fixed_tipoCliente,
                idProductoServicio: null,
                tipoPermiso: fixed_tipoPermiso,
                idCuenta: $scope.cuentaSelect.idCuenta,
                idRecibo: $scope.reciboSelect.idRecibo,
                idDireccion: null,
                nombreProducto: null,
                pagina: fixed_pagina,
                cantResultadosPagina: fixed_cantResultadosPagina,
                productoPrincipalXidRecibo: true,
                titularidadServicio: fixed_titularidadServicio
            };


            $scope.show_datosadicionales_error = false;
            $scope.show_datosadicionales = false;
            $scope.show_detalleplan = false;
            $scope.show_detalleplan_error = false;
            request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
            CapaServicio.getProductoPrincipal(request).then(function(response) {
                var rpta = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
                if (rpta == 0) {

                    $scope.WPS_IDProductoPrincipal = response.data.obtenerServiciosResponse.listadoProductosServicios.ProductoServicioResponse.idProductoServicio;
                    $scope.obtenerDatosAdicionalesServicioMovil_BOLSA();
                    $scope.obtenerDetallePlanMovil_BOLSA();

                }

            }, function(error) {});

        }

    };

    $scope.obtenerDatosAdicionalesServicioMovil_BOLSA = function() {

        var trama = {
            "idProductoServicio": null,
            "idCuenta": $scope.cuentaSelect.idCuenta,
            "idRecibo": $scope.reciboSelect.idRecibo,
            "tipoCliente": 2
        };



        $scope.wps_planActual = "";
        $scope.wps_simboloMonedaCargo = "";
        $scope.wps_cargoFijo = "";
        $scope.show_datosadicionales_error = false;
        $scope.show_datosadicionales = false;

        request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
        CapaServicio.getObtenerDatosAdicionalesServicioMovil(request).then(function(response) {



            var id_respuesta = response.data.obtenerDatosAdicionalesServicioMovilResponse.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {

                $scope.wps_planActual = response.data.obtenerDatosAdicionalesServicioMovilResponse.planActual;
                $scope.wps_simboloMonedaCargo = response.data.obtenerDatosAdicionalesServicioMovilResponse.simboloMonedaCargo;
                $scope.wps_cargoFijo = response.data.obtenerDatosAdicionalesServicioMovilResponse.cargoFijo;

                $scope.show_datosadicionales = true;

            } else {
                $scope.show_datosadicionales_error = true;
            }

        });
    };

    $scope.obtenerDetallePlanMovil_BOLSA = function() {

        var trama = {
            "idProductoServicio": null,
            "idCuenta": $scope.cuentaSelect.idCuenta,
            "idRecibo": $scope.reciboSelect.idRecibo,
            "flagBolsa": true
        };

        $scope.show_detalleplan = false;
        $scope.show_detalleplan_error = false;
        tramaAuditoria.servicio = $scope.reciboSelect.nombreRecibo;
        tramaAuditoria.tipoLinea = '5';
        tramaAuditoria.perfil = '-';
        tramaAuditoria.operationCode = 'T0004';
        request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
        CapaServicio.getObtenerDetallePlanMovil(request).then(function(response) {

            var id_respuesta = parseInt(response.data.obtenerDetallePlanMovilResponse.defaultServiceResponse.idRespuesta);
            var mensaje = response.data.obtenerDetallePlanMovilResponse.defaultServiceResponse.mensaje;

            if (id_respuesta == 0) {
                $scope.wps_listadetalle = response.data.obtenerDetallePlanMovilResponse.listadoDetalle;
                if (!Array.isArray(response.data.obtenerDetallePlanMovilResponse.listadoDetalle)) {
                    $scope.wps_listadetalle = [];
                    $scope.wps_listadetalle.push(response.data.obtenerDetallePlanMovilResponse.listadoDetalle);
                }
                tramaAuditoria.estado = "SUCCESS";
                tramaAuditoria.descripcionoperacion = "-";
                $scope.pushAuditoria();
                $scope.show_detalleplan = true;
            } else {
                if (id_respuesta == 4) {} else {
                    $scope.show_detalleplan_error = true;
                }
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "obtenerDetallePlanMovil - " + mensaje;
                $scope.pushAuditoria();
            }

        });
    };

    $scope.obtenerListaServicio_LINEA = function() {

        var trama = {
            categoria: fixed_categoria,
            tipoLinea: fixed_tipoLinea,
            tipoCliente: fixed_tipoCliente,
            idProductoServicio: null,
            tipoPermiso: fixed_tipoPermiso,
            idCuenta: $scope.cuentaSelect.idCuenta,
            idRecibo: $scope.reciboSelect.idRecibo,
            idDireccion: null,
            nombreProducto: null,
            pagina: fixed_pagina,
            cantResultadosPagina: fixed_cantResultadosPagina,
            productoPrincipalXidRecibo: fixed_productoPrincipalXidRecibo,
            titularidadServicio: fixed_titularidadServicio
        };

        request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
        CapaServicio.obtenerListadoServicio(request).then(function(response) {

            var id_respuesta = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
            var mensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
            var dataResponse = response.data.obtenerServiciosResponse;
            if (id_respuesta == 0 && dataResponse.listadoProductosServicios != undefined) {

                $scope.lsServicio = response.data.obtenerServiciosResponse.listadoProductosServicios;
                if (Array.isArray($scope.lsServicio)) {
                    var flag_next = true;
                    angular.forEach($scope.lsServicio, function(val, key) {
                        if (flag_next) {
                            if (val.ProductoServicioResponse.idProductoServicio == $scope.idServicio) {
                                $scope.servicioSelected = $scope.lsServicio[key];
                                tramaAuditoria.servicio = $scope.servicioSelected.ProductoServicioResponse.nombre;
                                tramaAuditoria.tipoLinea = $scope.servicioSelected.ProductoServicioResponse.tipoLinea;
                                tramaAuditoria.perfil = $scope.servicioSelected.ProductoServicioResponse.tipoPermiso;
                                flag_next = false;
                            } else {
                                $scope.servicioSelected = $scope.lsServicio[0];
                                tramaAuditoria.servicio = $scope.servicioSelected.ProductoServicioResponse.nombre;
                                tramaAuditoria.tipoLinea = $scope.servicioSelected.ProductoServicioResponse.tipoLinea;
                                tramaAuditoria.perfil = $scope.servicioSelected.ProductoServicioResponse.tipoPermiso;
                            }
                        }
                    });
                } else {
                    $scope.lsServicio = [];
                    $scope.lsServicio.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                    $scope.servicioSelected = $scope.lsServicio[0];
                    tramaAuditoria.servicio = $scope.servicioSelected.ProductoServicioResponse.nombre;
                    tramaAuditoria.tipoLinea = $scope.servicioSelected.ProductoServicioResponse.tipoLinea;
                    tramaAuditoria.perfil = $scope.servicioSelected.ProductoServicioResponse.tipoPermiso;
                    $(".pulldate").addClass("disabled");
                }

                $scope.getObtenerDatosAdicionalesServicioMovil_LINEA();
                $scope.getObtenerDetallePlanMovil_LINEA();
                $scope.getObtenerServiciosAdicionales_LINEA();
                $("#show_error_root").hide();
                tramaAuditoria.operationCode = 'T0002';
                tramaAuditoria.estado = "SUCCESS";
                tramaAuditoria.descripcionoperacion = "-";
                $scope.pushAuditoria();

            } else {
                $("#show_panel").hide();
                tramaAuditoria.operationCode = 'T0002';
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "obtenerServicios - " + mensaje;
                $scope.pushAuditoria();
                $("#show_error_root").show();
            }

        }, function(error) {});
    };

    $scope.getObtenerDatosAdicionalesServicioMovil_LINEA = function() {

        $("#show_linea_datosadicionales_head").hide();
        $("#show_linea_datosadicionales_head_error").hide();
        $("#show_linea_datosadicionales").hide();
        $("#show_linea_datosadicionales_error").hide();
        $("#show_linea_datosadicionales_head_loader").show();
        $("#show_linea_datosadicionales_loader").show();

        var trama = {
            "idProductoServicio": $scope.servicioSelected.ProductoServicioResponse.idProductoServicio,
            "idCuenta": $scope.cuentaSelect.idCuenta,
            "idRecibo": $scope.reciboSelect.idRecibo,
            "tipoCliente": 2
        };


        request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
        CapaServicio.getObtenerDatosAdicionalesServicioMovil(request).then(function(response) {



            var id_respuesta = response.data.obtenerDatosAdicionalesServicioMovilResponse.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {

                $scope.wpsx_fechaActivacion = response.data.obtenerDatosAdicionalesServicioMovilResponse.fechaActivacion;
                $scope.wpsx_estado = response.data.obtenerDatosAdicionalesServicioMovilResponse.estado;

                $scope.wpsx_finContrato = response.data.obtenerDatosAdicionalesServicioMovilResponse.finContratoEquipo;
                if ($scope.wpsx_finContrato > 0) {
                    $scope.show_fin_contrato = true;
                } else {
                    $scope.show_fin_contrato = false;
                }

                $scope.wpsx_planActual = response.data.obtenerDatosAdicionalesServicioMovilResponse.planActual;
                $scope.wpsx_simboloMoneda = response.data.obtenerDatosAdicionalesServicioMovilResponse.simboloMoneda;
                $scope.wpsx_cargoFijo = response.data.obtenerDatosAdicionalesServicioMovilResponse.cargoFijo;

                $("#show_linea_datosadicionales_head").show();
                $("#show_linea_datosadicionales").show();

            } else {

                $("#show_linea_datosadicionales_head_error").show();
                $("#show_linea_datosadicionales_error").show();

            }

            $("#show_linea_datosadicionales_head_loader").hide();
            $("#show_linea_datosadicionales_loader").hide();

        });
    };

    $scope.getObtenerDetallePlanMovil_LINEA = function() {

        $("#show_linea_detalleplan").hide();
        $("#show_linea_detalleplan_error").hide();
        $("#show_linea_detalleplan_loader").show();

        var trama = {
            "idProductoServicio": $scope.servicioSelected.ProductoServicioResponse.idProductoServicio,
            "idCuenta": $scope.cuentaSelect.idCuenta,
            "idRecibo": $scope.reciboSelect.idRecibo,
            "flagBolsa": false
        };



        request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
        CapaServicio.getObtenerDetallePlanMovil(request).then(function(response) {


            var id_respuesta = parseInt(response.data.obtenerDetallePlanMovilResponse.defaultServiceResponse.idRespuesta);
            var mensaje = response.data.obtenerDetallePlanMovilResponse.defaultServiceResponse.mensaje;
            var idTransaccional = response.data.obtenerDetallePlanMovilResponse.defaultServiceResponse.idTransaccional;
            tramaAuditoria.transactionId = idTransaccional;
            if (id_respuesta == 0) {
                $("#show_linea_detalleplan").show();
                $scope.wpsx_listadetalle = response.data.obtenerDetallePlanMovilResponse.listadoDetalle;
                if (!Array.isArray(response.data.obtenerDetallePlanMovilResponse.listadoDetalle)) {
                    $scope.wpsx_listadetalle = [];
                    $scope.wpsx_listadetalle.push(response.data.obtenerDetallePlanMovilResponse.listadoDetalle);
                }
                tramaAuditoria.operationCode = 'T0002';
                tramaAuditoria.estado = "SUCCESS";
                tramaAuditoria.descripcionoperacion = "-";
                $scope.pushAuditoria();

            } else {
                tramaAuditoria.operationCode = 'T0002';
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "obtenerDetallePlanMovil - " + mensaje;
                $scope.pushAuditoria();
                if (id_respuesta == 4) {

                } else {
                    $("#show_linea_detalleplan_error").show();
                }

            }

            $("#show_linea_detalleplan_loader").hide();

        });
    };


    $scope.getObtenerServiciosAdicionales_LINEA = function() {

        $("#show_serviciosadicionales").hide();
        $("#show_serviciosadicionales_error").hide();

        var trama = {
            "categoria": fixed_categoria,
            "idCuenta": $scope.cuentaSelect.idCuenta,
            "idRecibo": $scope.reciboSelect.idRecibo,
            "idDireccion": null,
            "idProductoServicio": $scope.servicioSelected.ProductoServicioResponse.idProductoServicio,
            "idLinea": null
        };


        request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
        CapaServicio.getObtenerServiciosAdicionales(request).then(function(response) {

            var id_respuesta = response.data.obtenerServiciosAdicionalesResponse.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {

                $scope.wpsx_adicionales = response.data.obtenerServiciosAdicionalesResponse.listado;
                if (!Array.isArray($scope.wpsx_adicionales)) {
                    $scope.wpsx_adicionales = [];
                    $scope.wpsx_adicionales.push(response.data.obtenerServiciosAdicionalesResponse.listado);
                }

                $("#show_serviciosadicionales").show();

            } else {
                if (id_respuesta == 4) {

                } else {
                    $("#show_serviciosadicionales_error").show();
                }
            }

        }, function() {});
    };

    $scope.actionDirectorio = function(indi) {
        if (indi == '1') {
            if ($scope.show_directorio1 == true) {
                $scope.show_directorio1 = false;
                $scope.show_directorio2 = true;
                $scope.wps_textAction = "Cancelar";
                $scope.desabledCombos = true;
                $(".form-filter").addClass("search-column");
            } else {
                $scope.show_directorio1 = true;
                $scope.show_directorio2 = false;
                $scope.desabledCombos = false;
                $scope.wps_textAction = "Buscar línea";
                $(".form-filter").removeClass("search-column");
            }
        } else {
            $scope.show_directorio1 = true;
            $scope.show_directorio2 = false;
            $scope.desabledCombos = false;
            $scope.wps_textAction = "Buscar línea";
            $(".form-filter").removeClass("search-column");
        }
    };

    $scope.changeCuenta = function() {
        animacionBox();
        $scope.obtenerListadoMovilCorporativoRecibo();
    };

    $scope.changeRecibo = function() {

        if ($scope.wps_tipo_load == "bolsa") {
            $scope.setIDProductoPrincipal_BOLSA();
        } else {
            if ($scope.wps_tipo_load == "linea") {
                $scope.obtenerListaServicio_LINEA();
            }
        }

    };



    $scope.changeDirectorio = function() {
        tramaAuditoria.servicio = $scope.servicioSelected.ProductoServicioResponse.nombre;
        tramaAuditoria.tipoLinea = $scope.servicioSelected.ProductoServicioResponse.tipoLinea;
        tramaAuditoria.perfil = $scope.servicioSelected.ProductoServicioResponse.tipoPermiso;
        $scope.getObtenerDatosAdicionalesServicioMovil_LINEA();
        $scope.getObtenerDetallePlanMovil_LINEA();
        $scope.getObtenerServiciosAdicionales_LINEA();
        $scope.actualizarProductoPrincipalSesion();

    };

    $scope.verBolsasContratadas = function() {

        $scope.actionDirectorio();
        $scope.inputLineaMovil = null;
        $scope.show_filterlineamovil = false;
        activeVerBolsasContratadasUtil();
        $scope.wps_tipo_load = "bolsa";
        $scope.cargarDataBolsasContratadas();

    };

    $scope.verLineaEspecifica = function() {

        $scope.show_filterlineamovil = true;
        activeVerLineaEspecificaUtil();

        $scope.wps_tipo_load = "linea";
        $scope.cargarDataLineaEspecifica();

    };

    $scope.pushAuditoria = function() {

        request = $httpParamSerializer({ requestJson: angular.toJson(tramaAuditoria) });
        CapaServicio.enviarAuditoria(request).then(function(response) {}, function(error) {});
    };

    $scope.actualizarProductoPrincipalSesion = function() {

        var trama = {
            productoPrincipal: $scope.servicioSelected.ProductoServicioResponse.idProductoServicio,
            nombreProductoPrincipal: $scope.servicioSelected.ProductoServicioResponse.nombre,
            idDireccion: $scope.servicioSelected.ProductoServicioResponse.idDireccion,
            tipoLinea: $scope.servicioSelected.ProductoServicioResponse.tipoLinea,
            categoria: fixed_categoria,
            tipoClienteProductoPrincipal: $scope.servicioSelected.ProductoServicioResponse.tipoCliente,
            idCuenta: $scope.cuentaSelect.idCuenta,
            idRecibo: $scope.reciboSelect.idRecibo,
            idLinea: null,
            numeroTelFijo: null


        };

        $scope.idCuentaPrincipal = $scope.cuentaSelect.idCuenta;
        $scope.idDireccion = $scope.servicioSelected.ProductoServicioResponse.idDireccion;
        $scope.idLinea = $scope.servicioSelected.ProductoServicioResponse.idLinea;
        $scope.idReciboPrincipal = $scope.reciboSelect.idRecibo;
        $scope.nombreAliasaMostrar = $scope.servicioSelected.ProductoServicioResponse.nombre;
        $scope.idServicio = $scope.servicioSelected.ProductoServicioResponse.idProductoServicio;
        $scope.tipoCliente = $scope.servicioSelected.ProductoServicioResponse.tipoCliente;
        $scope.categoria = fixed_categoria;
        $scope.tipoLinea = $scope.servicioSelected.ProductoServicioResponse.tipoLinea;

        request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
        CapaServicio.actualizarProductoPrincipalSesion(request).then(function(response) {

        });
    };

    function initAutocomplete() {

        $('#autocomplete-movil').autocomplete({
            lookup: function(query, done) {
                obtenerServiciosAutocomplete(done);
            },
            minChars: 4,
            onSelect: function(suggestion) {
                $scope.servicioSelectedAuto = suggestion.objeto;

                $scope.idCuentaPrincipal = $scope.servicioSelectedAuto.idCuenta;
                $scope.idReciboPrincipal = $scope.servicioSelectedAuto.idRecibo;
                $scope.idServicio = $scope.servicioSelectedAuto.idProductoServicio;
                $scope.inputLineaMovil = null;
                $scope.actionDirectorio();
                $scope.obtenerListadoMovilCorporativoCuenta();
            }
        });
    };

    function obtenerServiciosAutocomplete(done) {

        var valorinput = $('#autocomplete-movil').val();

        var trama = {

            tipoLinea: fixed_tipoLinea,
            tipoCliente: fixed_tipoCliente,
            idProductoServicio: null,
            tipoPermiso: fixed_tipoPermiso,
            idCuenta: null,
            idRecibo: null,
            criterioBusqueda: valorinput,
            pagina: fixed_pagina,
            cantResultadosPagina: fixed_cantResultadosPagina,
            titularidadServicio: fixed_titularidadServicio
        };

        var arrayAutocomplete = [];
        request = $httpParamSerializer({ requestJson: angular.toJson(trama) });
        CapaServicio.getObtenerListadoMoviles(request).then(function(response) {

            var id_respuesta = response.data.obtenerListadoMovilesResponse.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {

                $scope.listaAutocomplete = response.data.obtenerListadoMovilesResponse.listadoProductosServicios;

                if (!Array.isArray($scope.listaAutocomplete)) {
                    $scope.listaAutocomplete = [];
                    $scope.listaAutocomplete.push(response.data.obtenerListadoMovilesResponse.listadoProductosServicios);
                }

                angular.forEach($scope.listaAutocomplete, function(val, key) {
                    arrayAutocomplete.push({
                        value: val.nombreAlias,
                        data: val.idProductoServicio,
                        objeto: val
                    });
                });


                var result = {
                    suggestions: arrayAutocomplete
                };

                done(result);

            } else {

            }

        }, function(error) {});
    };



    $scope.dataLayerVerRelacionPlanes = function() {

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Consultas',
            'action': 'Botón: Movil',
            'label': 'Ver Relación de Planes'
        });

        window.location.replace("/wps/myportal/miclaro/corporativo/consultas/reportes");
    };

    $scope.dataLayerVerMisRecibos = function() {

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Consultas',
            'action': 'Botón: Movil',
            'label': 'Ver Mis Recibos'
        });

        window.location.replace("/wps/myportal/miclaro/corporativo/recibos/movil");
    };

    $scope.dataLayerVerSaldosConsumos = function() {

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Consultas',
            'action': 'Botón: Movil',
            'label': 'Ver Saldos y Consumos'
        });

        window.location.replace("/wps/myportal/miclaro/corporativo/consultas/saldosyconsumos/movil");
    };

    $scope.dataLayerVerCambioPlan = function() {

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Consultas',
            'action': 'Botón: Movil',
            'label': 'Ver Cambio de Plan'
        });

        window.location.replace("/wps/myportal/miclaro/corporativo/solicitudes/cambiodeplan/movil");
    };


    $scope.switchChange = function() {
        window.location.replace("/wps/myportal/miclaro/consumer/consultas/servicioscontratados/movil");
    };

});

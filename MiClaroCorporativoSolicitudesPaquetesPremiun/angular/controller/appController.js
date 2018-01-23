app.controller("mycontroller", function($location, $anchorScroll, $scope, $http, $timeout, CapaService) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $scope.show_paso1 = true;
    $scope.show_paso2 = false;
    $scope.lsCanasta = [];

    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion03;

    var fixed_categoria = WPSCategoria.tv;
    var fixed_tipoPermiso = WPSTipoPermiso.todos;
    var fixed_titularidadServicio = 7;
    var fixed_productoPrincipalXidRecibo = false;
    var fixed_tipoLinea = 3;
    var fixed_tipoCliente = 2;
    var fixed_pagina = 0;
    var fixed_cantResultadosPagina = 0;
    $scope.servicioSelect;
    var tramaAuditoria = {
        operationCode: 'T0064',
        pagina: WPSPageID.miclaro_corporativo_solicitudes_paquetespremium,
        transactionId: null,
        estado: '',
        servicio: '',
        tipoProducto: 'CLAROTV',
        tipoLinea: '',
        tipoUsuario: '2',
        perfil: '1',
        monto: '',
        descripcionoperacion: '',
        responseType: '/'
    };

    CapaService.getObtenerFlagProductoTV().then(function(response) {


        tramaAuditoria.transactionId = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
        var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;

        if (id_respuesta == "0") {

            var flag = response.data.comunResponseType.flagProductoTVSesion;

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
        CapaService.getObtenerServicioPrincipal().then(function(response) {

            tramaAuditoria.transactionId = response.data.comunResponseType.defaultServiceResponse.idTransaccional;

            var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;

            if (id_respuesta == 0) {

                $scope.wps_nombreProductoPrincipal = response.data.comunResponseType.nombreProductoPrincipal;
                $scope.wps_idLinea = response.data.comunResponseType.idLinea;
                $scope.wps_categoria = '4';
                $scope.wps_tipoClienteProductoPrincipal = response.data.comunResponseType.tipoClienteProductoPrincipal;
                $scope.wps_productoPrincipal = response.data.comunResponseType.productoPrincipal;
                $scope.wps_numeroTelFijo = response.data.comunResponseType.numeroTelFijo;
                $scope.wps_idCuenta = response.data.comunResponseType.idCuenta;
                $scope.wps_tipoLinea = '3';
                $scope.wps_idRecibo = response.data.comunResponseType.idRecibo;
                $scope.wps_idDireccion = response.data.comunResponseType.idDireccion;

                $scope.obtenerListaDireccion();


                $("#show_panel").show();

            } else {
                $("#show_error_root").show();
            }

            if(id_respuesta == 0){
                tramaAuditoria.estado = "SUCCESS";
            }else{
                tramaAuditoria.estado = "ERROR";
            }
            tramaAuditoria.transactionId = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            $scope.pushAuditoria();


        });
    }

    $scope.obtenerListaDireccion = function() {

        var trama = {
            "tipoCliente": 8
        };

        CapaService.obtenerListadoDireccion(trama).then(function(response) {

            var id_respuesta = parseInt(response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idRespuesta);
            var mensaje = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.mensaje;
            tramaAuditoria.transactionId = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idTransaccional;

            if (id_respuesta == 0) {
                $scope.lsDireccion = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;
                if (Array.isArray($scope.lsDireccion)) {
                    var flag_next = true;
                    angular.forEach($scope.lsDireccion, function(val, key) {
                        if (flag_next) {
                            if (val.idDireccion == $scope.wps_idDireccion) {
                                $scope.direccionSelected = $scope.lsDireccion[key];
                                flag_next = false;
                            }
                        }
                    });

                    if (flag_next) {

                        $scope.direccionSelected = $scope.lsDireccion[0];

                    }
                } else {
                    $scope.lsDireccion = [];
                    $scope.lsDireccion.push(response.data.obtenerListadoFijoDireccionResponse.listadoDireccion);
                    $scope.direccionSelected = $scope.lsDireccion[0];
                    $(".pulldate").addClass("disabled");
                }
                $scope.getObtenerServicios();
                $("#show_direcciones").show();
                $scope.obtenerListaServicio();

            } else {
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "obtenerListadoFijoDireccion  - " + mensaje;
                $scope.pushAuditoria();
                $("#show_error_root").show();
                $("#show_panel").hide();

            }

        }, function(error) {});
    };

    $scope.getObtenerServicios = function() {

        var trama = {
            categoria: $scope.wps_categoria,
            tipoLinea: $scope.wps_tipoLinea,
            tipoCliente: $scope.wps_tipoClienteProductoPrincipal,
            idProductoServicio: '',
            idCuenta: '',
            idRecibo: '',
            idDireccion: $scope.direccionSelected.idDireccion,
            tipoPermiso: fixed_tipoPermiso,
            direccionCompleta: null,
            pagina: fixed_pagina,
            cantResultadosPagina: fixed_cantResultadosPagina,
            productoPrincipalXidRecibo: fixed_productoPrincipalXidRecibo,
            titularidadServicio: fixed_titularidadServicio
        };

        CapaService.getObtenerServicios(trama).then(function(response) {

            var id_respuesta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
            var mensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
            tramaAuditoria.transactionId = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
            var dataResponse = response.data.obtenerServiciosResponse;
            var breakEach = true;
            $scope.lsServicio = response.data.obtenerServiciosResponse.listadoProductosServicios;

            if (id_respuesta == 0) {

                if (Array.isArray($scope.lsServicio)) {
                    angular.forEach($scope.lsServicio, function(val, key) {
                        if (breakEach) {
                            if (val.ProductoServicioResponse.idProductoServicio == $scope.wps_productoPrincipal) {
                                $scope.servicioSelect = $scope.lsServicio[key];
                                tramaAuditoria.servicio = $scope.servicioSelect.ProductoServicioResponse.nombre;
                                tramaAuditoria.tipoLinea = $scope.servicioSelect.ProductoServicioResponse.tipoLinea;
                                tramaAuditoria.perfil = $scope.servicioSelect.ProductoServicioResponse.tipoPermiso;
                                breakEach = false;
                            }
                        }

                    });

                    if (breakEach) {
                        $scope.servicioSelect = $scope.lsServicio[0];
                        tramaAuditoria.servicio = $scope.servicioSelect.ProductoServicioResponse.nombre;
                        tramaAuditoria.tipoLinea = $scope.servicioSelect.ProductoServicioResponse.tipoLinea;
                        tramaAuditoria.perfil = $scope.servicioSelect.ProductoServicioResponse.tipoPermiso;
                    }

                } else {
                    $scope.lsServicio = [];
                    $scope.lsServicio.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                    $scope.servicioSelect = $scope.lsServicio[0];
                    tramaAuditoria.servicio = $scope.servicioSelect.ProductoServicioResponse.nombre;
                    tramaAuditoria.tipoLinea = $scope.servicioSelect.ProductoServicioResponse.tipoLinea;
                    tramaAuditoria.perfil = $scope.servicioSelect.ProductoServicioResponse.tipoPermiso;
                }

                $scope.getObtenerDatosAdicionalesServicioFijo();
                $scope.getObtenerPaquetesAdicionalesTV();
                $scope.show_servicios = true;


            } else {
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "obtenerServicios  - " + mensaje;
                $scope.pushAuditoria();
                $("#show_panel").hide();
                $scope.show_error = true;


            }

        });
    };

    $scope.getObtenerDatosAdicionalesServicioFijo = function() {

        var trama = {
            "idProductoServicio": $scope.servicioSelect.ProductoServicioResponse.idProductoServicio,
            "categoria": fixed_categoria,
            "idDireccion": $scope.servicioSelect.ProductoServicioResponse.idDireccion,
            "idLinea": null
        };

        CapaService.getObtenerDatosAdicionalesServicioFijo(trama).then(function(response) {
            var id_respuesta = response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.idRespuesta;

            if (id_respuesta == 0) {
                $scope.wps_direccionCompleta = response.data.obtenerDatosAdicionalesServicioFijoResponse.direccionCompleta;
            }

        }, function() {});
    };

    $scope.getObtenerPaquetesAdicionalesTV = function() {

        var trama = {
            "idDireccion": $scope.servicioSelect.ProductoServicioResponse.idDireccion,
            "idProductoServicio": $scope.servicioSelect.ProductoServicioResponse.idProductoServicio
        };

        CapaService.getObtenerPaquetesAdicionalesTV(trama).then(function(response) {

            var id_respuesta = response.data.obtenerPaquetesAdicionalesTVResponse.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {

                $scope.wps_lsPaquete = response.data.obtenerPaquetesAdicionalesTVResponse.listaPaquetesTV;
                if (!Array.isArray($scope.wps_lsPaquete)) {
                    $scope.wps_lsPaquete = [];
                    $scope.wps_lsPaquete.push(response.data.obtenerPaquetesAdicionalesTVResponse.listaPaquetesTV);
                }

                $scope.show_listapaquete = true;
                $scope.show_listapaquete_error = false;

            } else {
                $scope.show_listapaquete = false;
                $scope.show_listapaquete_error = true;
            }

            if ($.urlParam('idserviciotv') != null) {
                var idelement = $.urlParam('idserviciotv');
                $timeout(function() {
                    angular.element("#" + idelement + " input").trigger("click");
                }, 100);
            }

        }, function() {});
    };

    $scope.obtenerListaServicio = function() {

        var trama = {
            categoria: fixed_categoria,
            tipoLinea: WPSTipoLinea.todos,
            tipoCliente: fixed_tipoCliente,
            idProductoServicio: null,
            tipoPermiso: fixed_tipoPermiso,
            idCuenta: null,
            idRecibo: null,
            idDireccion: $scope.direccionSelected.idDireccion,
            nombreProducto: null,
            pagina: fixed_pagina,
            cantResultadosPagina: fixed_cantResultadosPagina,
            productoPrincipalXidRecibo: fixed_productoPrincipalXidRecibo,
            titularidadServicio: fixed_titularidadServicio
        };

        CapaService.obtenerListadoServicio(trama).then(function(response) {


            var id_respuesta = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
            var mensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
            tramaAuditoria.transactionId = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
            if (id_respuesta == 0) {

                $scope.lsServicio = response.data.obtenerServiciosResponse.listadoProductosServicios;

                if (Array.isArray($scope.lsServicio)) {

                    var flag_next = true;
                    angular.forEach($scope.lsServicio, function(val, key) {
                        if (flag_next) {
                            if (val.ProductoServicioResponse.idProductoServicio == $scope.wps_productoPrincipal) {
                                $scope.servicioSelected = $scope.lsServicio[key];
                                tramaAuditoria.servicio = $scope.servicioSelected.ProductoServicioResponse.nombre;
                                tramaAuditoria.tipoLinea = $scope.servicioSelected.ProductoServicioResponse.tipoLinea;
                                tramaAuditoria.perfil = $scope.servicioSelected.ProductoServicioResponse.tipoPermiso;
                                flag_next = false;
                            }
                        }
                    });

                    if (flag_next) {
                        $scope.servicioSelected = $scope.lsServicio[0];
                        tramaAuditoria.servicio = $scope.servicioSelected.ProductoServicioResponse.nombre;
                        tramaAuditoria.tipoLinea = $scope.servicioSelected.ProductoServicioResponse.tipoLinea;
                        tramaAuditoria.perfil = $scope.servicioSelected.ProductoServicioResponse.tipoPermiso;

                    }

                } else {
                    $scope.lsServicio = [];
                    $scope.lsServicio.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                    $scope.servicioSelected = $scope.lsServicio[0];
                    tramaAuditoria.servicio = $scope.servicioSelected.ProductoServicioResponse.nombre;
                    tramaAuditoria.tipoLinea = $scope.servicioSelected.ProductoServicioResponse.tipoLinea;
                    tramaAuditoria.perfil = $scope.servicioSelected.ProductoServicioResponse.tipoPermiso;
                    $(".pulldate").addClass("disabled");
                }

                $scope.getObtenerDatosAdicionalesServicioFijo();
                $scope.getObtenerPaquetesAdicionalesTV();

                $("#show_servicios").show();
                $("#show_servicios_name").show();

            } else {
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "obtenerServicios - " + mensaje;
                $scope.pushAuditoria();
                $("#show_error_root").show();
                $("#show_panel").hide();

            }

        }, function(error) {});
    };

    $scope.setThumbnailVideo = function(paquete) {

        wps_url = '';

        for (i = 0; i < WCMPaquetesTV.length; i++) {
            if (WCMPaquetesTV[i].id === paquete.idPaqueteTV) {
                wps_url = WCMPaquetesTV[i].urlThumbnail;
                i = 999;
            }
        }

        return { background: "url(" + wps_url + ")" }
    };

    $scope.agregarCanasta = function(actionPaquete, paquete) {

        var id_paquete = paquete.idPaqueteTV;
        if (actionPaquete == true) {
            $scope.lsCanasta.push(paquete);
            $("#" + id_paquete).addClass("checked");
        } else {
            $scope.lsCanasta.splice($scope.lsCanasta.indexOf(paquete), 1);
            $("#" + id_paquete).removeClass("checked");
        }

        if (($scope.lsCanasta).length > 0) {
            $("#btcontratar").removeClass("bt-disabled");
            $("#btcontratar").removeAttr("disabled");
        } else {
            $("#btcontratar").addClass("bt-disabled");
            $("#btcontratar").attr("disabled", "disabled");
        }
    };

    $scope.changeServicio = function() {

        $scope.wps_nombreProductoPrincipal = $scope.servicioSelect.ProductoServicioResponse.nombre;
        $scope.wps_idLinea = $scope.servicioSelect.ProductoServicioResponse.idLinea;
        $scope.wps_categoria = $scope.servicioSelect.ProductoServicioResponse.categoria;
        $scope.wps_tipoClienteProductoPrincipal = $scope.servicioSelect.ProductoServicioResponse.tipoCliente;
        $scope.wps_productoPrincipal = $scope.servicioSelect.ProductoServicioResponse.idProductoServicio;
        $scope.wps_numeroTelFijo = $scope.servicioSelect.ProductoServicioResponse.numeroTelFijo;
        $scope.wps_idCuenta = $scope.servicioSelect.ProductoServicioResponse.idCuenta;
        $scope.wps_tipoLinea = $scope.servicioSelect.ProductoServicioResponse.tipoLinea;
        $scope.wps_idRecibo = $scope.servicioSelect.ProductoServicioResponse.idRecibo;
        $scope.wps_idDireccion = $scope.servicioSelect.ProductoServicioResponse.idDireccion;

        efectoCargandoDireccion();
        efectoCargandoListaPaquete();

        $scope.getObtenerDatosAdicionalesServicioFijo();
        $scope.getObtenerPaquetesAdicionalesTV();
    };

    $scope.cambioDireccion = function() {
        efectoCargandoListaPaquete();
        $scope.obtenerListaServicio();
    };

    $scope.cambioServicio = function() {
        tramaAuditoria.servicio = $scope.servicioSelected.ProductoServicioResponse.nombre;
        tramaAuditoria.tipoLinea = $scope.servicioSelected.ProductoServicioResponse.tipoLinea;
        tramaAuditoria.perfil = $scope.servicioSelected.ProductoServicioResponse.tipoPermiso;
        efectoCargandoListaPaquete();
        $scope.getObtenerDatosAdicionalesServicioFijo();
        $scope.getObtenerPaquetesAdicionalesTV();
    };

    $scope.aceptarTerminosCondiciones = function(modelAceptarTerminos) {
        if (modelAceptarTerminos == true) {
            $(".text-terminos label.check").addClass("checked");
            $("#btncontratar").removeClass("bt-disabled");
            $("#btncontratar").removeAttr("disabled");
        } else {
            $(".text-terminos label.check").removeClass("checked");
            $("#btncontratar").addClass("bt-disabled");
            $("#btncontratar").attr("disabled", "disabled");
        }
    };

    $scope.abrirTerminosCondiciones = function() {
        $("#view_terminos").show();
    };

    $scope.cerrarTerminosCondiciones = function() {
        $("#view_terminos").hide();
    };

    $scope.cancelarTerminos = function() {
        $(".text-terminos label.check").removeClass("checked");
        $("#view_terminos").hide();
        $("#btncontratar").addClass("bt-disabled");
    };

    $scope.aceptarTerminos = function() {
        $(".text-terminos label.check").addClass("checked");
        $("#view_terminos").hide();
        $("#btncontratar").removeClass("bt-disabled");
        $("#btncontratar").removeAttr("disabled");
    };

    $scope.abrirVideo = function(paquete) {

        urlyoutube = '';
        idyoutube = '';

        for (i = 0; i < WCMPaquetesTV.length; i++) {
            if (WCMPaquetesTV[i].id === paquete.idPaqueteTV) {
                urlyoutube = WCMPaquetesTV[i].urlYoutube;
                idyoutube = urlyoutube.split("v=")[1];
                i = 999;
            }
        }

        $("#view_video").show();
        $('#ytvideo').attr("src", "https://www.youtube.com/embed/" + idyoutube);
    };

    $scope.cerrarVideo = function() {
        $("#view_video").hide();
        $('#ytvideo').attr("src", "");
    };

    $scope.irPaso2 = function() {

        $scope.show_paso1 = false;
        $scope.show_paso2 = true;

        var body = $("body");
        body.animate({ scrollTop: 0 }, '500');
    };

    $scope.irPaso1 = function() {
        $scope.show_paso1 = true;
        $scope.show_paso2 = false;
    };

    $scope.btnConfirmar = function() {

        var trama = {
            "idDireccion": $scope.servicioSelect.ProductoServicioResponse.idDireccion,
            "idProductoServicio": $scope.servicioSelect.ProductoServicioResponse.idProductoServicio,
            "nombreServicio": $scope.servicioSelect.ProductoServicioResponse.nombre,
            "listaPaquetesTV": $scope.lsCanasta
        };

        CapaService.solicitarPaquetesAdicionalesTV(trama).then(function(response) {

            var rpta = response.data.solicitarPaquetesAdicionalesTVResponse.defaultServiceResponse.idRespuesta;
            var mensaje = response.data.solicitarPaquetesAdicionalesTVResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                tramaAuditoria.estado = "SUCCESS";
                tramaAuditoria.descripcionoperacion = "-";
                $scope.pushAuditoria();
                $("#view_listo").show();
            } else {
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "solicitarPaquetesAdicionalesTV - " + mensaje;
                $scope.pushAuditoria();
                $("#view_error").show();
            }

        }, function() {});

    };

    $scope.cerrarListo = function() {
        $("#view_listo").hide();
    };

    $scope.cerrarError = function() {
        $("#view_error").hide();
    };

    $scope.pushAuditoria = function() {

        CapaService.enviarAuditoria(tramaAuditoria).then(function(response) {}, function(error) {});

    };

});

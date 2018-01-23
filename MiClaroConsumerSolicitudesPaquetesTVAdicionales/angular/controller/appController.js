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
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    var fixed_categoria = WPSCategoria.tv;
    var fixed_tipoPermiso = WPSTipoPermiso.todos;
    var fixed_titularidadServicio = 7;
    var fixed_productoPrincipalXidRecibo = false;
    var fixed_tipoLinea = 3;
    var fixed_tipoCliente = 1;
    var fixed_pagina = 0;
    var fixed_cantResultadosPagina = 0;

    var tramaAuditoria = {
        operationCode: 'T0064',
        pagina: WPSPageID.miclaro_consumer_solicitudes_paquetestvadicionales,
        transactionId: null,
        estado: '',
        servicio: '-',
        tipoProducto: 'CLAROTV',
        tipoLinea: '5',
        tipoUsuario: '-',
        perfil: '-',
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

        CapaService.getObtenerServicioPrincipal().then(function(response) {


            var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {

                $scope.wps_nombreProductoPrincipal = response.data.comunResponseType.nombreProductoPrincipal;
                $scope.wps_idLinea = response.data.comunResponseType.idLinea;
                $scope.wps_categoria = response.data.comunResponseType.categoria;
                $scope.wps_tipoClienteProductoPrincipal = response.data.comunResponseType.tipoClienteProductoPrincipal;
                $scope.wps_productoPrincipal = response.data.comunResponseType.productoPrincipal;
                $scope.wps_numeroTelFijo = response.data.comunResponseType.numeroTelFijo;
                $scope.wps_idCuenta = response.data.comunResponseType.idCuenta;
                $scope.wps_tipoLinea = response.data.comunResponseType.tipoLinea;
                $scope.wps_idRecibo = response.data.comunResponseType.idRecibo;
                $scope.wps_idDireccion = response.data.comunResponseType.idDireccion;

                $scope.getObtenerServicios();

            } else {
                $("#show_error_root").show();
            }

            if (id_respuesta == 0) {
                tramaAuditoria.estado = "SUCCESS";
                tramaAuditoria.descripcionoperacion = '-';
            } else {
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = 'servicios principal - ' + response.data.comunResponseType.defaultServiceResponse.mensaje;
            }
            tramaAuditoria.transactionId = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            $scope.pushAuditoria();

        });

    };

    $scope.getObtenerServicios = function() {

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


        CapaService.getObtenerServicios(trama).then(function(response) {

            var id_respuesta = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {
                $scope.lsServicio = response.data.obtenerServiciosResponse.listadoProductosServicios;
                if (Array.isArray($scope.lsServicio)) {
                    angular.forEach($scope.lsServicio, function(val, key) {
                        if (val.ProductoServicioResponse.idProductoServicio == $scope.wps_productoPrincipal) {
                            $scope.servicioSelect = $scope.lsServicio[key];
                            tramaAuditoria.servicio = $scope.servicioSelect.ProductoServicioResponse.nombre;
                            tramaAuditoria.tipoLinea = $scope.servicioSelect.ProductoServicioResponse.tipoLinea;
                            tramaAuditoria.tipoUsuario = $scope.servicioSelect.ProductoServicioResponse.tipoCliente;
                            tramaAuditoria.perfil = $scope.servicioSelect.ProductoServicioResponse.tipoPermiso;
                        } else {
                            $scope.servicioSelect = $scope.lsServicio[0];
                            tramaAuditoria.servicio = $scope.servicioSelect.ProductoServicioResponse.nombre;
                            tramaAuditoria.tipoLinea = $scope.servicioSelect.ProductoServicioResponse.tipoLinea;
                            tramaAuditoria.tipoUsuario = $scope.servicioSelect.ProductoServicioResponse.tipoCliente;
                            tramaAuditoria.perfil = $scope.servicioSelect.ProductoServicioResponse.tipoPermiso;
                        }
                    });
                } else {
                    $scope.lsServicio = [];
                    $scope.lsServicio.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                    $scope.servicioSelect = $scope.lsServicio[0];
                    tramaAuditoria.servicio = $scope.servicioSelect.ProductoServicioResponse.nombre;
                    tramaAuditoria.tipoLinea = $scope.servicioSelect.ProductoServicioResponse.tipoLinea;
                    tramaAuditoria.perfil = $scope.servicioSelect.ProductoServicioResponse.tipoPermiso;
                    tramaAuditoria.tipoUsuario = $scope.servicioSelect.ProductoServicioResponse.tipoCliente;
                }

                $scope.getObtenerDatosAdicionalesServicioFijo();
                $scope.getObtenerPaquetesAdicionalesTV();

                $("#show_panel").show();

            } else {
                $("#show_error").show();
                tramaAuditoria.transactionId = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "ObtenerServicios  - " + response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
                $scope.pushAuditoria();
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
            } else {
                tramaAuditoria.transactionId = response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.idTransaccional;
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "DatosAdicionalesServicioFijo  - " + response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.mensaje;
                $scope.pushAuditoria();
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

                if ($.urlParam('idserviciotv') != null) {
                    var idelement = $.urlParam('idserviciotv');
                    $timeout(function() {
                        angular.element("#" + idelement + " input").trigger("click");
                    }, 100);
                }

                $scope.show_listapaquetes = true;

            } else {
                if (id_respuesta == 2) {
                    $scope.show_listapaquetes_vacio = true;
                } else {
                    $scope.show_listapaquetes_error = true;
                    tramaAuditoria.transactionId = response.data.obtenerPaquetesAdicionalesTVResponse.defaultServiceResponse.idTransaccional;
                    tramaAuditoria.estado = "ERROR";
                    tramaAuditoria.descripcionoperacion = "PaquetesAdicionalesTV  - " + response.data.obtenerPaquetesAdicionalesTVResponse.defaultServiceResponse.mensaje;
                    $scope.pushAuditoria();
                }

            }

        }, function() {});
    };

    $scope.setThumbnailVideo = function(paquete) {
        wps_url = '';
        for (i = 0; i < WCMPaquetesTV.length; i++) {
            if (WCMPaquetesTV[i].id === paquete.idPaqueteTV) {
                wps_url = WCMPaquetesTV[i].urlThumbnail;
                i = 9999;
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
        tramaAuditoria.servicio = $scope.servicioSelect.ProductoServicioResponse.nombre;
        tramaAuditoria.tipoLinea = $scope.servicioSelect.ProductoServicioResponse.tipoLinea;
        tramaAuditoria.tipoUsuario = $scope.servicioSelect.ProductoServicioResponse.tipoCliente;
        tramaAuditoria.perfil = $scope.servicioSelect.ProductoServicioResponse.tipoPermiso;
        efectoCargandoDireccion();
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
                $("#view_listo").show();
                tramaAuditoria.estado = "SUCCESS";
                tramaAuditoria.descripcionoperacion = "-";
                
                $scope.pushAuditoria();
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

        CapaService.enviarAuditoria(tramaAuditoria).then(function(response) {

        }, function(error) {});

    };

});

app.controller("mycontroller", function($scope, $http,$timeout, $httpParamSerializer, CapaService) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';


    angular.element(document).ready(function() {
       initAutocomplete();
      initAutocompleteChip();
    });

   
    $("#btsavechip").attr("disabled", true);

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $scope.show_directorio1 = true;
    $scope.show_directorio2 = false;
    $scope.wps_textAction = "Buscar línea";
    $scope.wps_nuevo_chip = null;
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

    var tramaAuditoria = {
        operationCode: 'T0066',
        pagina: 'P079',
        transactionId: null,
        estado: '',
        servicio: '',
        tipoProducto: 'MOVIL',
        tipoLinea: '',
        tipoUsuario: '2',
        perfil: '-',
        monto: '',
        descripcionoperacion: '-',
        responseType: ''
    };

    $scope.lsMotivo = [
        { id: 0, nombre: "Seleccione" },
        { id: 1, nombre: "Robo" },
        { id: 2, nombre: "Daño Irreparable" },
        { id: 3, nombre: "Bloque de PIN y PUK" }
    ];
    $scope.motivoSelect = $scope.lsMotivo[0];

    $scope.lsCueta = null;
    $scope.lsRecibo = null;
    $scope.lsCelular = null;

    $scope.show_celular_combo = true;
    $scope.show_celular_autocomplete = false;
    $scope.texto_buscar = "Buscar Línea";

    CapaService.getObtenerDatosSesion().then(function(response) {

        var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        if (id_respuesta == 0) {

            $scope.idCuenta = response.data.comunResponseType.idCuenta;
            $scope.idDireccion = response.data.comunResponseType.idDireccion;
            $scope.idLinea = response.data.comunResponseType.idLinea;
            $scope.idRecibo = response.data.comunResponseType.idRecibo;
            $scope.categoria = response.data.comunResponseType.categoria;
            $scope.tipoLinea = response.data.comunResponseType.tipoLinea;
            $scope.numeroTelFijo = response.data.comunResponseType.numeroTelFijo;
            $scope.idProductoServicio = response.data.comunResponseType.productoPrincipal;
            $scope.tipoCliente = response.data.comunResponseType.tipoClienteProductoPrincipal;
            $scope.nombreProductoPrincipal = response.data.comunResponseType.nombreProductoPrincipal;

            $scope.obtenerListadoMovilCorporativoCuentaController();
            $("#show_panel_root").show();

        } else {
            $("#show_panel_root_error").show();
        }
    });

    $scope.obtenerListadoMovilCorporativoCuentaController = function() {

        $("#show_panel").hide();
        $("#show_panel_ups").hide();

        CapaService.obtenerListadoMovilCorporativoCuentaService().then(function(response) {

            var id_respuesta = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {

                $scope.lsCuenta = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta;

                if (Array.isArray($scope.lsCuenta)) {
                    var flag_next = true;
                    angular.forEach($scope.lsCuenta, function(obj, i) {
                        if (flag_next) {
                            if (obj.idCuenta == $scope.idCuenta) {
                                $scope.cuentaSelect = $scope.lsCuenta[i];
                                $scope.idCuenta = $scope.cuentaSelect.idCuenta;
                                flag_next = false;
                            } else {
                                $scope.cuentaSelect = $scope.lsCuenta[0];
                                $scope.idCuenta = $scope.cuentaSelect.idCuenta;
                            }
                        }
                    });
                } else {
                    $scope.lsCuenta = [];
                    $scope.lsCuenta.push(response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta);
                    $scope.cuentaSelect = $scope.lsCuenta[0];
                    $scope.idCuenta = $scope.cuentaSelect.idCuenta;
                    $(".pulldate").addClass("disabled");
                }

                $("#show_panel").show();

            } else {
                $("#show_panel_ups").show();
            }

            $scope.obtenerListadoMovilCorporativoReciboController();
            
            $scope.obtenerBuscarChipPackEmergencia();

        });
    };

    $scope.obtenerListadoMovilCorporativoReciboController = function() {

        var trama = {
            idCuenta: $scope.idCuenta
        };

        CapaService.obtenerListadoMovilCorporativoReciboService(trama).then(function(response) {

            var id_respuesta = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {

                $scope.lsRecibo = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo;

                if (Array.isArray($scope.lsRecibo)) {
                    var flag_next = true;
                    angular.forEach($scope.lsRecibo, function(obj, i) {
                        if (flag_next) {
                            if (obj.idRecibo == $scope.idRecibo) {
                                $scope.reciboSelect = $scope.lsRecibo[i];
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
                $scope.obtenerListaServicio();

            }

        });
    };

    $scope.obtenerListaServicio = function() {

        $("#show_servicios").hide();
        $("#show_servicios_error").hide();
        $("#show_servicios_name_error").hide();

        var trama = {
            categoria: fixed_categoria,
            tipoLinea: fixed_tipoLinea,
            tipoCliente: fixed_tipoCliente,
            idProductoServicio: null,
            tipoPermiso: fixed_tipoPermiso,
            idCuenta: null,
            idRecibo: null,
            idDireccion: $scope.idDireccion,
            nombreProducto: null,
            pagina: fixed_pagina,
            cantResultadosPagina: fixed_cantResultadosPagina,
            productoPrincipalXidRecibo: fixed_productoPrincipalXidRecibo,
            titularidadServicio: fixed_titularidadServicio
        };

        CapaService.obtenerListadoServicio(trama).then(function(response) {

            var id_respuesta = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {

                $scope.lsServicio = response.data.obtenerServiciosResponse.listadoProductosServicios;

                if (Array.isArray($scope.lsServicio)) {
                    var flag_next = true;
                    angular.forEach($scope.lsServicio, function(val, key) {
                        if (flag_next) {
                            if (val.ProductoServicioResponse.idProductoServicio == $scope.idProductoServicio) {
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

            } else {

            }

        }, function(error) {});

    };

    $scope.obtenerDirectorioTelefonicoController = function() {

        var trama = {
            tipoCliente: 99,
            categoria: 99,
            idCuenta: null,
            idRecibo: null,
            idProductoServicio: null,
            idDireccion: null,
            idLinea: null
        };

        CapaService.obtenerDirectorioTelefonicoService(trama).then(function(response) {

            var id_respuesta = response.data.obtenerDirectorioTelefonicoResponse.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {

                $scope.lsDirectorio = response.data.obtenerDirectorioTelefonicoResponse.listaNumerorDirecTel;

                if (Array.isArray($scope.lsDirectorio)) {
                    var flag_next = true;
                    angular.forEach($scope.lsDirectorio, function(obj, i) {
                        if (flag_next) {
                            if (obj.idProductoServicio == $scope.idProductoServicio) {
                                $scope.directorioSelect = $scope.lsDirectorio[i];
                                flag_next = false;
                            } else {
                                $scope.directorioSelect = $scope.lsDirectorio[0];
                            }
                        }
                    });
                } else {
                    $scope.lsDirectorio = [];
                    $scope.lsDirectorio.push(response.data.obtenerDirectorioTelefonicoResponse.listaNumerorDirecTel);
                    $scope.directorioSelect = $scope.lsDirectorio[0];
                    $(".pulldate").addClass("disabled");
                }


            }

        });
    };

   /* $scope.actionDirectorio = function(indi) {

        if ($scope.show_directorio1 == true) {
            $scope.show_directorio1 = false;
            $scope.show_directorio2 = true;
            $scope.disabledCombos = true;
            $scope.wps_textAction = "Cancelar";
            $(".form-filter").addClass("search-column");
        } else {
            $scope.show_directorio1 = true;
            $scope.show_directorio2 = false;
            $scope.disabledCombos = false;
            $scope.wps_textAction = "Buscar línea";
            $(".form-filter").removeClass("search-column");
        }
    };*/
$scope.actionDirectorio = function(indi) {

        if (indi == '1') {
            if ($scope.show_directorio1 == true) {
                $scope.show_directorio1 = false;
                $scope.show_directorio2 = true;
                $scope.wps_textAction = "Cancelar";
                $scope.disabledCombos = true;
                $(".form-filter").addClass("search-column");
            } else {
                $scope.show_directorio1 = true;
                $scope.show_directorio2 = false;
                $scope.disabledCombos = false;
                $scope.wps_textAction = "Buscar línea";
                $(".form-filter").removeClass("search-column");
            }
        } else {
            $scope.inputLineaMovil = "";

            $scope.show_directorio1 = true;
            $scope.show_directorio2 = false;
            $scope.disabledCombos = false;
            $scope.wps_textAction = "Buscar línea";
            $(".form-filter").removeClass("search-column");

            $("#autocomplete-movil").val("");

        }
    };

    $scope.changeCuenta = function() {

        $scope.obtenerListadoMovilCorporativoReciboController();
        $scope.obtenerListaServicio();
    };

    $scope.changeRecibo = function() {

        $scope.obtenerListaServicio();
    };

    $scope.changeBuscarLinea = function() {

        if ($scope.show_celular_combo == false) {
            $scope.texto_buscar = "Buscar línea";
            $scope.show_celular_combo = true;
            $scope.show_celular_autocomplete = false;
            $(".colsearch .input").hide();
        } else {
            $scope.texto_buscar = "Cancelar";
            $scope.show_celular_combo = false;
            $scope.show_celular_autocomplete = true;
            $(".colsearch .input").show();
        }
    };

    $scope.seleccionarChip = function(chip) {

        $scope.wps_nuevo_chip = chip.idChip;
        $(".table-plan label").removeClass("checked");
        $(".table-plan #" + chip.idChip).addClass("checked");
        $("#btsavechip").removeAttr("disabled");
        $("#btsavechip").removeClass("bt-disabled");
    };

    $scope.seleccionarChip2 = function(idChip) {
        $(".table-plan label").removeClass("checked");
        $(".table-plan #" + idChip).addClass("checked");
        $("#btsavechip").removeAttr("disabled");
        $("#btsavechip").removeClass("bt-disabled");
    };

    $scope.obtenerBuscarChipPackEmergencia = function() {

        $scope.chip_vacio =false;
        var trama = {
            numeroChip: $scope.wps_nuevo_chip,
            pagina: WPSpaginacion.pagina,
            cantResultadosPagina: WPSpaginacion.cantResultadosPagina,
        };

        CapaService.getBuscarChipPackEmergencia(trama).then(function(response) {

            var id_respuesta = response.data.buscarChipPackEmergenciaResponse.defaultServiceResponse.idRespuesta;
            var mensaje = response.data.buscarChipPackEmergenciaResponse.defaultServiceResponse.mensaje;
            tramaAuditoria.transactionId = response.data.buscarChipPackEmergenciaResponse.defaultServiceResponse.idTransaccional;
            if (id_respuesta == 0) {

                $scope.lsChip = response.data.buscarChipPackEmergenciaResponse.listaChips;
                if (!Array.isArray($scope.lsChip)) {

                    if (response.data.buscarChipPackEmergenciaResponse.listaChips.idChip != "") {

                        $scope.lsChip = [];
                        $scope.lsChip.push(response.data.buscarChipPackEmergenciaResponse.listaChips);
                    } else {

                        $(".div-bts").hide();
                        $scope.chip_vacio = true;
                    }


                }
               /* if (($scope.lsChip).length == 0) {
                    console.log("Lista vacia");
                    $scope.chip_vacio = true;
                    $(".div-bts").hide();
                } else {
                    $scope.chip_vacio = false;
                }*/

            } else {
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "buscarChipPackEmergencia - " + mensaje;
                $scope.pushAuditoria();
                $scope.chip_error = true;
            }

        });
    };

    $scope.asignarChipPackEmergencia = function() {


          var trama = {
            idCuenta: $scope.idCuenta,
            idRecibo: $scope.idRecibo,
            idProductoServicio: $scope.idProductoServicio,
            idChip: $scope.wps_nuevo_chip,
            idMotivoCambio: $scope.motivoSelect.id
        };

        CapaService.asignarChipPackEmergencia(trama).then(function(response) {

            var id_respuesta = response.data.asignarChipPackEmergenciaResponse.defaultServiceResponse.idRespuesta;
            var mensaje = response.data.asignarChipPackEmergenciaResponse.defaultServiceResponse.mensaje;
            tramaAuditoria.transactionId = response.data.asignarChipPackEmergenciaResponse.defaultServiceResponse.idTransaccional;
            if (id_respuesta == 0) {
                tramaAuditoria.estado = "SUCCESS";
                tramaAuditoria.descripcionoperacion = "-";
                $scope.pushAuditoria();
                $("#cambiochip_modal").show();
            } else {
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "asignarChipPackEmergencia  - " + mensaje;
                $scope.pushAuditoria();
                $("#show_panel_ups").show();

            }

        }, function(error) {});
    };

    $scope.close_popup = function() {
        $("#cambiochip_modal").hide();
    }

    $scope.pushAuditoria = function() {

        request = $httpParamSerializer({ requestJson: angular.toJson(tramaAuditoria) });
        CapaService.enviarAuditoria(request).then(function(response) {}, function(error) {});
    };

    function obtenerServiciosAutocomplete(done) {

        var valorinput = $('#autocomplete-movil').val();
        var arrayAutocomplete = [];
        var trama = {
            "tipoLinea": 3,
            "tipoCliente": $scope.tipoCliente,
            "tipoPermiso": WPSTipoPermiso.todos,
            "idCuenta": null,
            "idRecibo": null,
            "criterioBusqueda": valorinput,
            "pagina": WPSpaginacion.pagina,
            "cantResultadosPagina": WPSpaginacion.cantResultadosPagina,
            "titularidadServicio": fixed_titularidadServicio
        };
       

        CapaService.getObtenerListadoMovilesAutocomplete(trama).then(function(response) {
            var id_respuesta = response.data.obtenerListadoMovilesResponse.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {
                if (response.data.obtenerListadoMovilesResponse.listadoProductosServicios== undefined) {
                            arrayAutocomplete = [];
                            $('.autocomplete-suggestion').remove();
                            $('.autocomplete-suggestion').empty();
                } else {
                    $scope.listaAutocomplete = response.data.obtenerListadoMovilesResponse.listadoProductosServicios;
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
            }

            }else {
               $scope.listaAutocomplete = [];

            }
        }, function(error) {});
    };



    function initAutocomplete() {

        $('#autocomplete-movil').autocomplete({
            lookup: function(query, done) {
                obtenerServiciosAutocomplete(done);
            },
            minChars: 4,
            onSelect: function(suggestion) {
                    $timeout(function() {
                        animacionBox();
                        $scope.servicioSelectedAuto = suggestion.objeto;
                        $scope.idCuenta = $scope.servicioSelectedAuto.idCuenta;
                        $scope.idRecibo = $scope.servicioSelectedAuto.idRecibo;
                        $scope.idProductoServicio = $scope.servicioSelectedAuto.idProductoServicio;
                        $scope.inputLineaMovil = null;
                        $scope.actionDirectorio(2);
                        $scope.obtenerListadoMovilCorporativoCuentaController();

                    }, 200);

            }
        });
    };

    $scope.changeDirectorio = function() {
        tramaAuditoria.servicio = $scope.servicioSelected.ProductoServicioResponse.nombre;
        tramaAuditoria.tipoLinea = $scope.servicioSelected.ProductoServicioResponse.tipoLinea;
        tramaAuditoria.perfil = $scope.servicioSelected.ProductoServicioResponse.tipoPermiso;
        $scope.idProductoServicio = $scope.servicioSelected.ProductoServicioResponse.idProductoServicio;
        animacionBox();

    };

    function initAutocompleteChip() {

        $('#autocomplete-chip').autocomplete({
            lookup: function(query, done) {
                obtenerChipsAutocomplete(done);
            },
            minChars: 4,
            onSelect: function(suggestion) {

                $scope.wps_nuevo_chip = (suggestion.value).trim();

                var array_tmp = [];
                array_tmp = $scope.lsChip;

                var obj_ok = null;
                for (i = 0; i < array_tmp.length; i++) {
                    if (array_tmp[i].idChip == $scope.wps_nuevo_chip) {
                        obj_ok = array_tmp[i];
                    }
                }

                $scope.lsChip = [];
                $scope.lsChip.push(obj_ok);
                $("#" + $scope.wps_nuevo_chip + " input").click();

            }
        });
    };


    function obtenerChipsAutocomplete(done) {

        var valorinput = $("#autocomplete-chip").val();

        var trama = {
            numeroChip: valorinput,
            pagina: WPSpaginacion.pagina,
            cantResultadosPagina: WPSpaginacion.cantResultadosPagina,
        };

        var arrayAutocompleteChip = [];
        CapaService.getBuscarChipPackEmergencia(trama).then(function(response) {

            var id_respuesta = response.data.buscarChipPackEmergenciaResponse.defaultServiceResponse.idRespuesta;
            if (id_respuesta == 0) {

                $scope.lsChip = response.data.buscarChipPackEmergenciaResponse.listaChips;
                $scope.listaAutocompleteChip = response.data.buscarChipPackEmergenciaResponse.listaChips;

                angular.forEach($scope.listaAutocompleteChip, function(val, key) {
                    arrayAutocompleteChip.push({
                        value: val.idChip,
                        data: val.idChip
                    });
                });

                var result = {
                    suggestions: arrayAutocompleteChip
                };

                if (arrayAutocompleteChip.length == 1) {
                    $scope.wps_nuevo_chip = null;
                    $scope.obtenerBuscarChipPackEmergencia();
                    $("#autocomplete-chip").val("");
                    $("#btsavechip").attr("disabled", "disabled");
                    $("#btsavechip").addClass("bt-disabled");
                } else {
                    done(result);
                }

            }

        }, function(error) {});
    };

});
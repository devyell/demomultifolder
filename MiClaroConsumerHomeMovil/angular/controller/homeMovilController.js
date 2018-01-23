miClaroApp.controller("MiClaroHomeController", function($scope, $http, $httpParamSerializer, serviciosHome) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $(".publicidad").load("/wps/wcm/myconnect/mi%20claro%20content%20library/mi%20claro/banners/home%20movil");

    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    var data = {};
    var config = {};
    var consumoObjetoList = null;
    $scope.serviciosList = null;
    $scope.servicio = null;
    $scope.errorFuncional = null;
    var categoriaMovil = 1;
    var tipoPermiso = 5;
    var titularidadServicio = 7;
    var pagina = 0;
    var cantResultadosPagina = 0;
    var productoPrincipalXidRecibo = false;
    var tipoLinea = 3;
    var tipoCliente = 1;
    var allSuccess = true;
    var firstRender = true;
    var timer;
    $scope.estadoServicioFlag = null;
    $scope.consumosMovilFlag = null;
    $scope.showSwitch = false;
    $scope.showUpps = false;
    $scope.tipoClienteLineaAfiliadaFlag = 0;
    var ResquestAuditoria = {
        operationCode: 'T0001',
        pagina: 'P001',
        transactionId: '',
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


    serviciosHome.getObtenerFlagProductoMovil().then(function(response) {

        $scope.flagServiciosMovil = response.data.comunResponseType.flagProductoMovilSesion;
        $scope.ErrorFlagMovil = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        $scope.flagMovilIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
        $scope.tipoClienteUsuario = response.data.comunResponseType.tipoCliente;
        $scope.tipoLineaUsuario = response.data.comunResponseType.tipoLinea;

        var emailModal = response.data.comunResponseType.usuarioLogueado;

        latamModal(emailModal);

        if ($scope.tipoClienteUsuario == 4) {
            $scope.showSwitch = true;
        }

        if ($scope.ErrorFlagMovil == 0) {
            if ($scope.flagServiciosMovil != "-1") {
                if ($scope.flagServiciosMovil == 1 || $scope.flagServiciosMovil == 3) {
                    $scope.init();
                } else {
                    $("#movil").show();
                }
            } else {
                $("#movil").show();
                allSuccess = false;
            }
        } else {
            $scope.showUpps = true;
            $("#movil").show();
            allSuccess = false;
        }

    });

    $scope.init = function() {

        serviciosHome.getObtenerDatosSesion().then(function(response) {

            $scope.servPrincipalError = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            $scope.servPrincipalIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            $scope.servPrincipalMensaje = response.data.comunResponseType.defaultServiceResponse.mensaje;

            if ($scope.servPrincipalError == 0) {
                getObtenerServiciosMovilWS(response.data);
            } else {
                $scope.showUpps = true;
                $("#movil").show();
                allSuccess = false;
            }
        });
    }

    getObtenerServiciosMovilWS = function(objServico) {

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

        obtenerServiciosRequest.categoria = categoriaMovil;
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

                if (typeof $scope.servicio.ProductoServicioResponse.tipoClienteLineaAfiliada === "undefined") {
                    $scope.tipoClienteLineaAfiliadaFlag = 0;
                } else {
                    $scope.tipoClienteLineaAfiliadaFlag = $scope.servicio.ProductoServicioResponse.tipoClienteLineaAfiliada;
                }

                getObtenerEstadoServicio($scope.servicio);
                getObtenerConsumoGeneralMovilWS($scope.servicio);
                actualizarProductoPrincipalSesion($scope.servicio);

                $("#textox").html($scope.servicio.ProductoServicioResponse.nombreAlias);

            } else {
                $scope.showUpps = true;
                $("#movil").show();
                ResquestAuditoria.estado = "ERROR";
                ResquestAuditoria.descripcionoperacion = "obtenerServicios - " + mensaje;
                auditoria();
                allSuccess = false;
            }

        });
    }

    getObtenerEstadoServicio = function(objServico) {

        var idProd = objServico.ProductoServicioResponse.idProductoServicio;
        var idCta = objServico.ProductoServicioResponse.idCuenta;
        var idRec = objServico.ProductoServicioResponse.idRecibo;

        var obtenerEstadoServicioRequest = {
            "categoria": null,
            "idDireccion": null,
            "idProductoServicio": null,
            "idCuenta": null,
            "idRecibo": null,
            "tipoCliente": null
        }
        obtenerEstadoServicioRequest.categoria = categoriaMovil;
        obtenerEstadoServicioRequest.idProductoServicio = idProd;
        obtenerEstadoServicioRequest.idCuenta = idCta;
        obtenerEstadoServicioRequest.idRecibo = idRec;
        obtenerEstadoServicioRequest.tipoCliente = tipoCliente;

        data = $httpParamSerializer({ requestJson: angular.toJson(obtenerEstadoServicioRequest) });

        serviciosHome.getObtenerEstadoServicioWS(data).then(function(response) {

            $scope.estadoServicio = response.data.obtenerEstadoServicioResponse;
            $scope.estadoServicioFlag = $scope.estadoServicio.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId = $scope.estadoServicio.defaultServiceResponse.idTransaccional;
            var mensaje = $scope.estadoServicio.defaultServiceResponse.mensaje;
            $scope.cicloFacturacion = $scope.estadoServicio.cicloFacturacion;

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
        }, function() {});
    };

    getObtenerConsumoGeneralMovilWS = function(objServico) {

        var idProdServ = objServico.ProductoServicioResponse.idProductoServicio;
        var idC = objServico.ProductoServicioResponse.idCuenta;
        var idR = objServico.ProductoServicioResponse.idRecibo;
        var tCliente = objServico.ProductoServicioResponse.tipoCliente;

        var obtenerConsumoGeneralMovilRequest = {
            "idProductoServicio": null,
            "idCuenta": null,
            "idRecibo": null,
            "tipoCliente": null
        }

        obtenerConsumoGeneralMovilRequest.idProductoServicio = idProdServ;
        obtenerConsumoGeneralMovilRequest.idCuenta = idC;
        obtenerConsumoGeneralMovilRequest.idRecibo = idR;
        obtenerConsumoGeneralMovilRequest.tipoCliente = tCliente;

        data = $httpParamSerializer({ requestJson: angular.toJson(obtenerConsumoGeneralMovilRequest) });

        serviciosHome.getObtenerConsumoGeneralMovilWS(data).then(function(response) {
            $scope.consumosMovil = response.data.obtenerConsumoGeneralMovilResponse;
            $scope.consumosMovilFlag = $scope.consumosMovil.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId = $scope.consumosMovil.defaultServiceResponse.idTransaccional;
            var mensaje = $scope.consumosMovil.defaultServiceResponse.mensaje;
            $(".boxConsumos").show();
            if ($scope.consumosMovilFlag == 0) {

                var consumoObjetoList = [];

                var consumosMovilesResponse = response.data.obtenerConsumoGeneralMovilResponse;


                if (consumosMovilesResponse.internet == "" && consumosMovilesResponse.llamadas == "" && consumosMovilesResponse.smsyMmms == "") {
                    $(".boxConsumos").hide();
                } else {
                    $(".boxConsumos").show();
                }

                if ($scope.servicio.ProductoServicioResponse.tipoLinea == 2) {

                    var consumoObjeto = {
                        imagen: null,
                        color: null,
                        saldoRestante: null,
                        fechaVencimiento: null,
                        tipoPaquete: null,
                        unidad: null,
                        porcentaje: null,
                        ilimitado: null,
                        show: null,
                        consumoCero: null
                    };

                    if (consumosMovilesResponse.internet != null && consumosMovilesResponse.internet != "") {

                        if (consumosMovilesResponse.internet.listaBolsaPrincipalInternet != null && consumosMovilesResponse.internet.listaBolsaPrincipalInternet != "") {

                            if (!Array.isArray(consumosMovilesResponse.internet.listaBolsaPrincipalInternet)) {
                                var listaBolsaPrincipalInternet = [];
                                listaBolsaPrincipalInternet.push(consumosMovilesResponse.internet.listaBolsaPrincipalInternet);
                                consumosMovilesResponse.internet.listaBolsaPrincipalInternet = listaBolsaPrincipalInternet;
                            }

                            var tamBolsaPrincipalInternetList = consumosMovilesResponse.internet.listaBolsaPrincipalInternet.length > 5 ? 5 : consumosMovilesResponse.internet.listaBolsaPrincipalInternet.length;
                            for (i = 0; i < tamBolsaPrincipalInternetList; i++) {
                                var bolsaPrincipalInternet = consumosMovilesResponse.internet.listaBolsaPrincipalInternet[i];
                                var consumoInternet = new Object();
                                consumoInternet.imagen = "/wpstheme/miclaro/img/icon-min-internet.png";
                                consumoInternet.tipoPaquete = bolsaPrincipalInternet.nombreBolsa;
                                if (bolsaPrincipalInternet.bolsaTotal == bolsaPrincipalInternet.bolsaUtilizada) {
                                    consumoInternet.saldoRestante = "Agotado";
                                } else {
                                    var saldoResInt = bolsaPrincipalInternet.bolsaTotal - bolsaPrincipalInternet.bolsaUtilizada;
                                    consumoInternet.saldoRestante = saldoResInt.toFixed(2);
                                }
                                if (bolsaPrincipalInternet.bolsaTotal == bolsaPrincipalInternet.bolsaUtilizada) {
                                    consumoInternet.color = "#EBD3B8";
                                } else {
                                    consumoInternet.color = "#f6a244";
                                }
                                consumoInternet.fechaVencimiento = bolsaPrincipalInternet.fechaVencimiento;
                                if (bolsaPrincipalInternet.bolsaTotal == bolsaPrincipalInternet.bolsaUtilizada) {
                                    consumoInternet.unidad = "";
                                } else {
                                    consumoInternet.unidad = bolsaPrincipalInternet.unidadConsumo + " restantes";
                                }
                                if (bolsaPrincipalInternet.bolsaUtilizada == 0) {
                                    consumoInternet.consumoCero = true;
                                }
                                consumoInternet.porcentaje = (100 * bolsaPrincipalInternet.bolsaUtilizada) / bolsaPrincipalInternet.bolsaTotal;
                                consumoInternet.ilimitado = bolsaPrincipalInternet.flagIlimitado;
                                consumoInternet.show = true;
                                consumoObjetoList.push(consumoInternet);
                            }
                        }

                        if (consumoObjetoList.length < 5) {

                            if (consumosMovilesResponse.internet.listaAdicionalesPlan != null && consumosMovilesResponse.internet.listaAdicionalesPlan != "") {

                                if (!Array.isArray(consumosMovilesResponse.internet.listaAdicionalesPlan)) {
                                    var listaAdicionalesPlan = [];
                                    listaAdicionalesPlan.push(consumosMovilesResponse.internet.listaAdicionalesPlan);
                                    consumosMovilesResponse.internet.listaAdicionalesPlan = listaAdicionalesPlan;
                                }

                                var tamListaAdicionalesPlan = consumosMovilesResponse.internet.listaAdicionalesPlan.length;
                                for (i = 0; i < tamListaAdicionalesPlan; i++) {

                                    if (consumoObjetoList.length < 5) {

                                        var bolsaPrincipalInternet = consumosMovilesResponse.internet.listaAdicionalesPlan[i];
                                        var consumoInternet = new Object();
                                        consumoInternet.imagen = "/wpstheme/miclaro/img/icon-min-internet.png";
                                        consumoInternet.tipoPaquete = bolsaPrincipalInternet.nombre;
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternet.saldoRestante = "Agotado";
                                        } else {
                                            var saldoResInt = bolsaPrincipalInternet.total - bolsaPrincipalInternet.utilizado;
                                            consumoInternet.saldoRestante = saldoResInt.toFixed(2);
                                        }
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternet.color = "#EBD3B8";
                                        } else {
                                            consumoInternet.color = "#f6a244";
                                        }
                                        consumoInternet.fechaVencimiento = bolsaPrincipalInternet.fechaVencimiento;
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternet.unidad = "";
                                        } else {
                                            consumoInternet.unidad = bolsaPrincipalInternet.unidadConsumo + " restantes";
                                        }
                                        if (bolsaPrincipalInternet.utilizado == 0) {
                                            consumoInternet.consumoCero = true;
                                        }
                                        consumoInternet.porcentaje = (100 * bolsaPrincipalInternet.utilizado) / bolsaPrincipalInternet.total;
                                        consumoInternet.ilimitado = bolsaPrincipalInternet.flagIlimitado;
                                        consumoInternet.show = true;
                                        consumoObjetoList.push(consumoInternet);
                                    }
                                }

                            }
                        }

                        if (consumoObjetoList.length < 5) {
                            if (consumosMovilesResponse.internet.listaPaquetesActivos != null && consumosMovilesResponse.internet.listaPaquetesActivos != "") {
                                if (!Array.isArray(consumosMovilesResponse.internet.listaPaquetesActivos)) {
                                    var listaPaquetesActivos = [];
                                    listaPaquetesActivos.push(consumosMovilesResponse.internet.listaPaquetesActivos);
                                    consumosMovilesResponse.internet.listaPaquetesActivos = listaPaquetesActivos;
                                }

                                var tamListaPaquetesActivos = consumosMovilesResponse.internet.listaPaquetesActivos.length;
                                for (i = 0; i < tamListaPaquetesActivos; i++) {
                                    if (consumoObjetoList.length < 5) {
                                        var bolsaPrincipalInternet = consumosMovilesResponse.internet.listaPaquetesActivos[i];
                                        var consumoInternet = new Object();
                                        consumoInternet.imagen = "/wpstheme/miclaro/img/icon-min-internet.png";
                                        consumoInternet.tipoPaquete = bolsaPrincipalInternet.nombre;
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternet.saldoRestante = "Agotado";
                                        } else {
                                            var saldoResInt = bolsaPrincipalInternet.total - bolsaPrincipalInternet.utilizado;
                                            consumoInternet.saldoRestante = saldoResInt.toFixed(2);
                                        }
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternet.color = "#EBD3B8";
                                        } else {
                                            consumoInternet.color = "#f6a244";
                                        }
                                        consumoInternet.fechaVencimiento = bolsaPrincipalInternet.fechaVencimiento;
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternet.unidad = "";
                                        } else {
                                            consumoInternet.unidad = bolsaPrincipalInternet.unidadConsumo + " restantes";
                                        }
                                        if (bolsaPrincipalInternet.utilizado == 0) {
                                            consumoInternet.consumoCero = true;
                                        }
                                        consumoInternet.porcentaje = (100 * bolsaPrincipalInternet.utilizado) / bolsaPrincipalInternet.total;
                                        consumoInternet.ilimitado = bolsaPrincipalInternet.flagIlimitado;
                                        consumoInternet.show = true;
                                        consumoObjetoList.push(consumoInternet);
                                    }
                                }

                            }
                        }

                        if (consumoObjetoList.length < 5) {
                            if (consumosMovilesResponse.internet.listaPaquetesPendientesInternet != null && consumosMovilesResponse.internet.listaPaquetesPendientesInternet != "") {
                                if (!Array.isArray(consumosMovilesResponse.internet.listaPaquetesPendientesInternet)) {
                                    var listaPaquetesPendientesInternet = [];
                                    listaPaquetesPendientesInternet.push(consumosMovilesResponse.internet.listaPaquetesPendientesInternet);
                                    consumosMovilesResponse.internet.listaPaquetesPendientesInternet = listaPaquetesPendientesInternet;
                                }

                                var tamListaPaquetesPendientesInternet = consumosMovilesResponse.internet.listaPaquetesPendientesInternet.length;
                                for (i = 0; i < tamListaPaquetesPendientesInternet; i++) {
                                    if (consumoObjetoList.length < 5) {
                                        var bolsaPrincipalInternet = consumosMovilesResponse.internet.listaPaquetesPendientesInternet[i];
                                        var consumoInternet = new Object();
                                        consumoInternet.imagen = "/wpstheme/miclaro/img/icon-min-internet.png";
                                        consumoInternet.tipoPaquete = bolsaPrincipalInternet.nombre;
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternet.saldoRestante = "Agotado";
                                        } else {
                                            var saldoResInt = bolsaPrincipalInternet.total - bolsaPrincipalInternet.utilizado;
                                            consumoInternet.saldoRestante = saldoResInt.toFixed(2);
                                        }
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternet.color = "#EBD3B8";
                                        } else {
                                            consumoInternet.color = "#f6a244";
                                        }
                                        consumoInternet.fechaVencimiento = bolsaPrincipalInternet.fechaVencimiento;
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternet.unidad = "";
                                        } else {
                                            consumoInternet.unidad = bolsaPrincipalInternet.unidadConsumo + " restantes";
                                        }
                                        if (bolsaPrincipalInternet.utilizado == 0) {
                                            consumoInternet.consumoCero = true;
                                        }
                                        consumoInternet.porcentaje = (100 * bolsaPrincipalInternet.utilizado) / bolsaPrincipalInternet.total;
                                        consumoInternet.ilimitado = bolsaPrincipalInternet.flagIlimitado;
                                        consumoInternet.show = true;
                                        consumoObjetoList.push(consumoInternet);
                                    }
                                }

                            }
                        }

                    }


                    if (consumoObjetoList.length < 5) {

                        if (consumosMovilesResponse.llamadas != null && consumosMovilesResponse.llamadas != "") {

                            if (consumosMovilesResponse.llamadas.listaBolsaPrincipalLlamadas != null && consumosMovilesResponse.llamadas.listaBolsaPrincipalLlamadas != "") {

                                if (!Array.isArray(consumosMovilesResponse.llamadas.listaBolsaPrincipalLlamadas)) {
                                    var listaBolsaPrincipalLlamadas = [];
                                    listaBolsaPrincipalLlamadas.push(consumosMovilesResponse.llamadas.listaBolsaPrincipalLlamadas);
                                    consumosMovilesResponse.llamadas.listaBolsaPrincipalLlamadas = listaBolsaPrincipalLlamadas;
                                }

                                var tamBolsaPrincipalLlamadasList = consumosMovilesResponse.llamadas.listaBolsaPrincipalLlamadas.length;
                                for (i = 0; i < tamBolsaPrincipalLlamadasList; i++) {
                                    if (consumoObjetoList.length < 5) {
                                        var bolsaPrincipalLlamadas = consumosMovilesResponse.llamadas.listaBolsaPrincipalLlamadas[i];
                                        var consumoLlamadas = new Object();
                                        consumoLlamadas.imagen = "/wpstheme/miclaro/img/icon-min-celular.png";
                                        consumoLlamadas.tipoPaquete = bolsaPrincipalLlamadas.nombreBolsa;
                                        if (bolsaPrincipalLlamadas.bolsaTotal == bolsaPrincipalLlamadas.bolsaUtilizada) {
                                            consumoLlamadas.saldoRestante = "Agotado";
                                        } else {
                                            var saldoRestLLam = bolsaPrincipalLlamadas.bolsaTotal - bolsaPrincipalLlamadas.bolsaUtilizada;
                                            if (bolsaPrincipalLlamadas.unidadConsumo == "SOLES") {
                                                consumoLlamadas.saldoRestante = saldoRestLLam.toFixed(2);
                                            } else {
                                                consumoLlamadas.saldoRestante = saldoRestLLam.toFixed(0);
                                            }
                                        }

                                        if (bolsaPrincipalLlamadas.bolsaTotal == bolsaPrincipalLlamadas.bolsaUtilizada) {
                                            consumoLlamadas.color = "#E3C1BE";
                                        } else {
                                            consumoLlamadas.color = "#d52b1e";
                                        }
                                        consumoLlamadas.fechaVencimiento = bolsaPrincipalLlamadas.fechaVencimiento;
                                        if (bolsaPrincipalLlamadas.bolsaTotal == bolsaPrincipalLlamadas.bolsaUtilizada) {
                                            consumoLlamadas.unidad = "";
                                        } else {
                                            consumoLlamadas.unidad = bolsaPrincipalLlamadas.unidadConsumo + " restantes";
                                        }
                                        if (bolsaPrincipalLlamadas.bolsaUtilizada == 0) {
                                            consumoLlamadas.consumoCero = true;
                                        }
                                        consumoLlamadas.porcentaje = (100 * bolsaPrincipalLlamadas.bolsaUtilizada) / bolsaPrincipalLlamadas.bolsaTotal;
                                        consumoLlamadas.ilimitado = bolsaPrincipalLlamadas.flagIlimitado;
                                        consumoLlamadas.show = true;
                                        consumoObjetoList.push(consumoLlamadas);

                                    }
                                }
                            }

                            if (consumoObjetoList.length < 5) {
                                if (consumosMovilesResponse.llamadas.listaAdicionalesPlan != null && consumosMovilesResponse.llamadas.listaAdicionalesPlan != "") {

                                    if (!Array.isArray(consumosMovilesResponse.llamadas.listaAdicionalesPlan)) {
                                        var listaAdicionalesPlan = [];
                                        listaAdicionalesPlan.push(consumosMovilesResponse.llamadas.listaAdicionalesPlan);
                                        consumosMovilesResponse.llamadas.listaAdicionalesPlan = listaAdicionalesPlan;
                                    }

                                    var tamListaAdicionalesPlan = consumosMovilesResponse.llamadas.listaAdicionalesPlan.length;
                                    for (i = 0; i < tamListaAdicionalesPlan; i++) {
                                        if (consumoObjetoList.length < 5) {
                                            var bolsaPrincipalLlamadas = consumosMovilesResponse.llamadas.listaAdicionalesPlan[i];
                                            var consumoLlamadas = new Object();
                                            consumoLlamadas.imagen = "/wpstheme/miclaro/img/icon-min-celular.png";
                                            consumoLlamadas.tipoPaquete = bolsaPrincipalLlamadas.nombre;
                                            if (bolsaPrincipalLlamadas.total == bolsaPrincipalLlamadas.utilizado) {
                                                consumoLlamadas.saldoRestante = "Agotado";
                                            } else {
                                                var saldoRestLLam = bolsaPrincipalLlamadas.total - bolsaPrincipalLlamadas.utilizado;
                                                if (bolsaPrincipalLlamadas.unidadConsumo == "SOLES") {
                                                    consumoLlamadas.saldoRestante = saldoRestLLam.toFixed(2);
                                                } else {
                                                    consumoLlamadas.saldoRestante = saldoRestLLam.toFixed(0);
                                                }
                                            }

                                            if (bolsaPrincipalLlamadas.total == bolsaPrincipalLlamadas.utilizado) {
                                                consumoLlamadas.color = "#E3C1BE";
                                            } else {
                                                consumoLlamadas.color = "#d52b1e";
                                            }
                                            consumoLlamadas.fechaVencimiento = bolsaPrincipalLlamadas.fechaVencimiento;
                                            if (bolsaPrincipalLlamadas.total == bolsaPrincipalLlamadas.utilizado) {
                                                consumoLlamadas.unidad = "";
                                            } else {
                                                consumoLlamadas.unidad = bolsaPrincipalLlamadas.unidadConsumo + " restantes";
                                            }
                                            if (bolsaPrincipalLlamadas.utilizado == 0) {
                                                consumoLlamadas.consumoCero = true;
                                            }
                                            consumoLlamadas.porcentaje = (100 * bolsaPrincipalLlamadas.utilizado) / bolsaPrincipalLlamadas.total;
                                            consumoLlamadas.ilimitado = bolsaPrincipalLlamadas.flagIlimitado;
                                            consumoLlamadas.show = true;
                                            consumoObjetoList.push(consumoLlamadas);

                                        }
                                    }
                                }
                            }

                            if (consumoObjetoList.length < 5) {
                                if (consumosMovilesResponse.llamadas.listaBonosRegalados != null && consumosMovilesResponse.llamadas.listaBonosRegalados != "") {

                                    if (!Array.isArray(consumosMovilesResponse.llamadas.listaBonosRegalados)) {
                                        var listaBonosRegalados = [];
                                        listaBonosRegalados.push(consumosMovilesResponse.llamadas.listaBonosRegalados);
                                        consumosMovilesResponse.llamadas.listaBonosRegalados = listaBonosRegalados;
                                    }

                                    var tamListaBonosRegalados = consumosMovilesResponse.llamadas.listaBonosRegalados.length;
                                    for (i = 0; i < tamListaBonosRegalados; i++) {
                                        if (consumoObjetoList.length < 5) {
                                            var bolsaPrincipalLlamadas = consumosMovilesResponse.llamadas.listaBonosRegalados[i];
                                            var consumoLlamadas = new Object();
                                            consumoLlamadas.imagen = "/wpstheme/miclaro/img/icon-min-celular.png";
                                            consumoLlamadas.tipoPaquete = bolsaPrincipalLlamadas.nombre;
                                            if (bolsaPrincipalLlamadas.total == bolsaPrincipalLlamadas.utilizado) {
                                                consumoLlamadas.saldoRestante = "Agotado";
                                            } else {
                                                var saldoRestLLam = bolsaPrincipalLlamadas.total - bolsaPrincipalLlamadas.utilizado;
                                                if (bolsaPrincipalLlamadas.unidadConsumo == "SOLES") {
                                                    consumoLlamadas.saldoRestante = saldoRestLLam.toFixed(2);
                                                } else {
                                                    consumoLlamadas.saldoRestante = saldoRestLLam.toFixed(0);
                                                }

                                            }

                                            if (bolsaPrincipalLlamadas.total == bolsaPrincipalLlamadas.utilizado) {
                                                consumoLlamadas.color = "#E3C1BE";
                                            } else {
                                                consumoLlamadas.color = "#d52b1e";
                                            }
                                            consumoLlamadas.fechaVencimiento = bolsaPrincipalLlamadas.fechaVencimiento;
                                            if (bolsaPrincipalLlamadas.total == bolsaPrincipalLlamadas.utilizado) {
                                                consumoLlamadas.unidad = "";
                                            } else {
                                                consumoLlamadas.unidad = bolsaPrincipalLlamadas.unidadConsumo + " restantes";
                                            }
                                            if (bolsaPrincipalLlamadas.utilizado == 0) {
                                                consumoLlamadas.consumoCero = true;
                                            }
                                            consumoLlamadas.porcentaje = (100 * bolsaPrincipalLlamadas.utilizado) / bolsaPrincipalLlamadas.total;
                                            consumoLlamadas.ilimitado = bolsaPrincipalLlamadas.flagIlimitado;
                                            consumoLlamadas.show = true;
                                            consumoObjetoList.push(consumoLlamadas);

                                        }
                                    }
                                }
                            }

                            if (consumoObjetoList.length < 5) {
                                if (consumosMovilesResponse.llamadas.listaPaquetesPendientesLlamadas != null && consumosMovilesResponse.llamadas.listaPaquetesPendientesLlamadas != "") {

                                    if (!Array.isArray(consumosMovilesResponse.llamadas.listaPaquetesPendientesLlamadas)) {
                                        var listaPaquetesPendientesLlamadas = [];
                                        listaPaquetesPendientesLlamadas.push(consumosMovilesResponse.llamadas.listaPaquetesPendientesLlamadas);
                                        consumosMovilesResponse.llamadas.listaPaquetesPendientesLlamadas = listaPaquetesPendientesLlamadas;
                                    }

                                    var tamListaPaquetesPendientesLlamadas = consumosMovilesResponse.llamadas.listaPaquetesPendientesLlamadas.length;
                                    for (i = 0; i < tamListaPaquetesPendientesLlamadas; i++) {
                                        if (consumoObjetoList.length < 5) {
                                            var bolsaPrincipalLlamadas = consumosMovilesResponse.llamadas.listaPaquetesPendientesLlamadas[i];
                                            var consumoLlamadas = new Object();
                                            consumoLlamadas.imagen = "/wpstheme/miclaro/img/icon-min-celular.png";
                                            consumoLlamadas.tipoPaquete = bolsaPrincipalLlamadas.nombre;
                                            if (bolsaPrincipalLlamadas.total == bolsaPrincipalLlamadas.utilizado) {
                                                consumoLlamadas.saldoRestante = "Agotado";
                                            } else {
                                                var saldoRestLLam = bolsaPrincipalLlamadas.total - bolsaPrincipalLlamadas.utilizado;
                                                if (bolsaPrincipalLlamadas.unidadConsumo == "SOLES") {
                                                    consumoLlamadas.saldoRestante = saldoRestLLam.toFixed(2);
                                                } else {
                                                    consumoLlamadas.saldoRestante = saldoRestLLam.toFixed(0);
                                                }

                                            }

                                            if (bolsaPrincipalLlamadas.total == bolsaPrincipalLlamadas.utilizado) {
                                                consumoLlamadas.color = "#E3C1BE";
                                            } else {
                                                consumoLlamadas.color = "#d52b1e";
                                            }
                                            consumoLlamadas.fechaVencimiento = bolsaPrincipalLlamadas.fechaVencimiento;
                                            if (bolsaPrincipalLlamadas.total == bolsaPrincipalLlamadas.utilizado) {
                                                consumoLlamadas.unidad = "";
                                            } else {
                                                consumoLlamadas.unidad = bolsaPrincipalLlamadas.unidadConsumo + " restantes";
                                            }
                                            if (bolsaPrincipalLlamadas.utilizado == 0) {
                                                consumoLlamadas.consumoCero = true;
                                            }
                                            consumoLlamadas.porcentaje = (100 * bolsaPrincipalLlamadas.utilizado) / bolsaPrincipalLlamadas.total;
                                            consumoLlamadas.ilimitado = bolsaPrincipalLlamadas.flagIlimitado;
                                            consumoLlamadas.show = true;
                                            consumoObjetoList.push(consumoLlamadas);

                                        }
                                    }
                                }
                            }

                        }
                    }

                    if (consumoObjetoList.length < 5) {

                        if (consumosMovilesResponse.smsyMmms != null && consumosMovilesResponse.smsyMmms != "") {

                            if (consumosMovilesResponse.smsyMmms.listaBolsaPrincipalSms != null && consumosMovilesResponse.smsyMmms.listaBolsaPrincipalSms != "") {

                                if (!Array.isArray(consumosMovilesResponse.smsyMmms.listaBolsaPrincipalSms)) {
                                    var listaBolsaPrincipalSms = [];
                                    listaBolsaPrincipalSms.push(consumosMovilesResponse.smsyMmms.listaBolsaPrincipalSms);
                                    consumosMovilesResponse.smsyMmms.listaBolsaPrincipalSms = listaBolsaPrincipalSms;
                                }

                                var tamBolsaPrincipalSmsList = consumosMovilesResponse.smsyMmms.listaBolsaPrincipalSms.length;
                                for (i = 0; i < tamBolsaPrincipalSmsList; i++) {
                                    if (consumoObjetoList.length < 5) {
                                        var bolsaPrincipalSms = consumosMovilesResponse.smsyMmms.listaBolsaPrincipalSms[i];
                                        var consumoSms = new Object();
                                        consumoSms.imagen = "/wpstheme/miclaro/img/icon-min-mensajes.png";
                                        consumoSms.tipoPaquete = bolsaPrincipalSms.nombre;
                                        if (bolsaPrincipalSms.total == bolsaPrincipalSms.utilizado) {
                                            consumoSms.saldoRestante = "Agotado";
                                        } else {
                                            var saldoRestMen = bolsaPrincipalSms.total - bolsaPrincipalSms.utilizado;
                                            consumoSms.saldoRestante = saldoRestMen.toFixed(0);
                                        }
                                        if (bolsaPrincipalSms.total == bolsaPrincipalSms.utilizado) {
                                            consumoSms.color = "#2095a8";
                                        } else {
                                            consumoSms.color = "#2095a8";
                                        }
                                        consumoSms.fechaVencimiento = bolsaPrincipalSms.fechaVencimiento;
                                        if (bolsaPrincipalSms.total == bolsaPrincipalSms.utilizado) {
                                            consumoSms.unidad = "";
                                        } else {
                                            consumoSms.unidad = bolsaPrincipalSms.unidadConsumo + " restantes";
                                        }
                                        if (bolsaPrincipalSms.utilizado == 0) {
                                            consumoSms.consumoCero = true;
                                        }
                                        consumoSms.porcentaje = (100 * bolsaPrincipalSms.utilizado) / bolsaPrincipalSms.total;
                                        consumoSms.ilimitado = bolsaPrincipalSms.flagIlimitado;
                                        consumoSms.show = true;
                                        consumoObjetoList.push(consumoSms);
                                    }
                                }
                            }

                            if (consumoObjetoList.length < 5) {
                                if (consumosMovilesResponse.smsyMmms.listaAdicionalesPlan != null && consumosMovilesResponse.smsyMmms.listaAdicionalesPlan != "") {

                                    if (!Array.isArray(consumosMovilesResponse.smsyMmms.listaAdicionalesPlan)) {
                                        var listaAdicionalesPlan = [];
                                        listaAdicionalesPlan.push(consumosMovilesResponse.smsyMmms.listaAdicionalesPlan);
                                        consumosMovilesResponse.smsyMmms.listaAdicionalesPlan = listaAdicionalesPlan;
                                    }

                                    var tamListaAdicionalesPlan = consumosMovilesResponse.smsyMmms.listaAdicionalesPlan.length;
                                    for (i = 0; i < tamListaAdicionalesPlan; i++) {
                                        if (consumoObjetoList.length < 5) {
                                            var bolsaPrincipalSms = consumosMovilesResponse.smsyMmms.listaAdicionalesPlan[i];
                                            var consumoSms = new Object();
                                            consumoSms.imagen = "/wpstheme/miclaro/img/icon-min-mensajes.png";
                                            consumoSms.tipoPaquete = bolsaPrincipalSms.nombre;
                                            if (bolsaPrincipalSms.total == bolsaPrincipalSms.utilizado) {
                                                consumoSms.saldoRestante = "Agotado";
                                            } else {
                                                var saldoRestMen = bolsaPrincipalSms.total - bolsaPrincipalSms.utilizado;
                                                consumoSms.saldoRestante = saldoRestMen.toFixed(0);
                                            }
                                            if (bolsaPrincipalSms.total == bolsaPrincipalSms.utilizado) {
                                                consumoSms.color = "#2095a8";
                                            } else {
                                                consumoSms.color = "#2095a8";
                                            }
                                            consumoSms.fechaVencimiento = bolsaPrincipalSms.fechaVencimiento;
                                            if (bolsaPrincipalSms.total == bolsaPrincipalSms.utilizado) {
                                                consumoSms.unidad = "";
                                            } else {
                                                consumoSms.unidad = bolsaPrincipalSms.unidadConsumo + " restantes";
                                            }
                                            if (bolsaPrincipalSms.utilizado == 0) {
                                                consumoSms.consumoCero = true;
                                            }
                                            consumoSms.porcentaje = (100 * bolsaPrincipalSms.utilizado) / bolsaPrincipalSms.total;
                                            consumoSms.ilimitado = bolsaPrincipalSms.flagIlimitado;
                                            consumoSms.show = true;
                                            consumoObjetoList.push(consumoSms);
                                        }
                                    }
                                }
                            }

                            if (consumoObjetoList.length < 5) {
                                if (consumosMovilesResponse.smsyMmms.listaBonosRegalados != null && consumosMovilesResponse.smsyMmms.listaBonosRegalados != "") {

                                    if (!Array.isArray(consumosMovilesResponse.smsyMmms.listaBonosRegalados)) {
                                        var listaBonosRegalados = [];
                                        listaBonosRegalados.push(consumosMovilesResponse.smsyMmms.listaBonosRegalados);
                                        consumosMovilesResponse.smsyMmms.listaBonosRegalados = listaBonosRegalados;
                                    }

                                    var tamListaBonosRegalados = consumosMovilesResponse.smsyMmms.listaBonosRegalados.length;
                                    for (i = 0; i < tamListaBonosRegalados; i++) {
                                        if (consumoObjetoList.length < 5) {
                                            var bolsaPrincipalSms = consumosMovilesResponse.smsyMmms.listaBonosRegalados[i];
                                            var consumoSms = new Object();
                                            consumoSms.imagen = "/wpstheme/miclaro/img/icon-min-mensajes.png";
                                            consumoSms.tipoPaquete = bolsaPrincipalSms.nombre;
                                            if (bolsaPrincipalSms.total == bolsaPrincipalSms.utilizado) {
                                                consumoSms.saldoRestante = "Agotado";
                                            } else {
                                                var saldoRestMen = bolsaPrincipalSms.total - bolsaPrincipalSms.utilizado;
                                                consumoSms.saldoRestante = saldoRestMen.toFixed(0);
                                            }
                                            if (bolsaPrincipalSms.total == bolsaPrincipalSms.utilizado) {
                                                consumoSms.color = "#2095a8";
                                            } else {
                                                consumoSms.color = "#2095a8";
                                            }
                                            consumoSms.fechaVencimiento = bolsaPrincipalSms.fechaVencimiento;
                                            if (bolsaPrincipalSms.total == bolsaPrincipalSms.utilizado) {
                                                consumoSms.unidad = "";
                                            } else {
                                                consumoSms.unidad = bolsaPrincipalSms.unidadConsumo + " restantes";
                                            }
                                            if (bolsaPrincipalSms.utilizado == 0) {
                                                consumoSms.consumoCero = true;
                                            }
                                            consumoSms.porcentaje = (100 * bolsaPrincipalSms.utilizado) / bolsaPrincipalSms.total;
                                            consumoSms.ilimitado = bolsaPrincipalSms.flagIlimitado;
                                            consumoSms.show = true;
                                            consumoObjetoList.push(consumoSms);
                                        }
                                    }
                                }
                            }

                            if (consumoObjetoList.length < 5) {
                                if (consumosMovilesResponse.smsyMmms.listaPaquetesPendientesSMS != null && consumosMovilesResponse.smsyMmms.listaPaquetesPendientesSMS != "") {

                                    if (!Array.isArray(consumosMovilesResponse.smsyMmms.listaPaquetesPendientesSMS)) {
                                        var listaPaquetesPendientesSMS = [];
                                        listaPaquetesPendientesSMS.push(consumosMovilesResponse.smsyMmms.listaPaquetesPendientesSMS);
                                        consumosMovilesResponse.smsyMmms.listaPaquetesPendientesSMS = listaPaquetesPendientesSMS;
                                    }

                                    var tamListaPaquetesPendientesSMS = consumosMovilesResponse.smsyMmms.listaPaquetesPendientesSMS.length;
                                    for (i = 0; i < tamListaPaquetesPendientesSMS; i++) {
                                        if (consumoObjetoList.length < 5) {
                                            var bolsaPrincipalSms = consumosMovilesResponse.smsyMmms.listaPaquetesPendientesSMS[i];
                                            var consumoSms = new Object();
                                            consumoSms.imagen = "/wpstheme/miclaro/img/icon-min-mensajes.png";
                                            consumoSms.tipoPaquete = bolsaPrincipalSms.nombre;
                                            if (bolsaPrincipalSms.total == bolsaPrincipalSms.utilizado) {
                                                consumoSms.saldoRestante = "Agotado";
                                            } else {
                                                var saldoRestMen = bolsaPrincipalSms.total - bolsaPrincipalSms.utilizado;
                                                consumoSms.saldoRestante = saldoRestMen.toFixed(0);
                                            }
                                            if (bolsaPrincipalSms.total == bolsaPrincipalSms.utilizado) {
                                                consumoSms.color = "#2095a8";
                                            } else {
                                                consumoSms.color = "#2095a8";
                                            }
                                            consumoSms.fechaVencimiento = bolsaPrincipalSms.fechaVencimiento;
                                            if (bolsaPrincipalSms.total == bolsaPrincipalSms.utilizado) {
                                                consumoSms.unidad = "";
                                            } else {
                                                consumoSms.unidad = bolsaPrincipalSms.unidadConsumo + " restantes";
                                            }
                                            if (bolsaPrincipalSms.utilizado == 0) {
                                                consumoSms.consumoCero = true;
                                            }
                                            consumoSms.porcentaje = (100 * bolsaPrincipalSms.utilizado) / bolsaPrincipalSms.total;
                                            consumoSms.ilimitado = bolsaPrincipalSms.flagIlimitado;
                                            consumoSms.show = true;
                                            consumoObjetoList.push(consumoSms);
                                        }
                                    }
                                }
                            }



                        }
                    }

                    if (consumoObjetoList.length < 5) {

                        if (consumosMovilesResponse.smsyMmms != null && consumosMovilesResponse.smsyMmms != "") {

                            if (consumosMovilesResponse.smsyMmms.listaBolsaPrincipalMMS != null && consumosMovilesResponse.smsyMmms.listaBolsaPrincipalMMS != "") {

                                if (!Array.isArray(consumosMovilesResponse.smsyMmms.listaBolsaPrincipalMMS)) {
                                    var listaBolsaPrincipalMMS = [];
                                    listaBolsaPrincipalMMS.push(consumosMovilesResponse.smsyMmms.listaBolsaPrincipalMMS);
                                    consumosMovilesResponse.smsyMmms.listaBolsaPrincipalMMS = listaBolsaPrincipalMMS;
                                }

                                var tamBolsaPrincipalMmsList = consumosMovilesResponse.smsyMmms.listaBolsaPrincipalMMS.length;
                                for (i = 0; i < tamBolsaPrincipalMmsList; i++) {
                                    if (consumoObjetoList.length < 5) {
                                        var bolsaPrincipalMMS = consumosMovilesResponse.smsyMmms.listaBolsaPrincipalMMS[i];
                                        var consumoMMS = new Object();
                                        consumoMMS.imagen = "/wpstheme/miclaro/img/icon-min-mensajes.png";
                                        consumoMMS.tipoPaquete = bolsaPrincipalMMS.nombre;
                                        if (bolsaPrincipalMMS.total == bolsaPrincipalMMS.utilizado) {
                                            consumoMMS.saldoRestante = "Agotado";
                                        } else {
                                            var saldoRestMms = bolsaPrincipalMMS.total - bolsaPrincipalMMS.utilizado;
                                            consumoMMS.saldoRestante = saldoRestMms.toFixed(0);
                                        }

                                        if (bolsaPrincipalMMS.total == bolsaPrincipalMMS.utilizado) {
                                            consumoMMS.color = "#2095a8";
                                        } else {
                                            consumoMMS.color = "#2095a8";
                                        }
                                        consumoMMS.fechaVencimiento = bolsaPrincipalMMS.fechaVencimiento;
                                        if (bolsaPrincipalMMS.total == bolsaPrincipalMMS.utilizado) {
                                            consumoMMS.unidad = "";
                                        } else {
                                            consumoMMS.unidad = bolsaPrincipalMMS.unidadConsumo + " restantes";
                                        }
                                        if (bolsaPrincipalMMS.utilizado == 0) {
                                            consumoMMS.consumoCero = true;
                                        }
                                        consumoMMS.porcentaje = (100 * bolsaPrincipalMMS.utilizado) / bolsaPrincipalMMS.total;
                                        consumoMMS.ilimitado = bolsaPrincipalMMS.flagIlimitado;
                                        consumoMMS.show = true;
                                        consumoObjetoList.push(consumoMMS);


                                    }
                                }
                            }

                            if (consumoObjetoList.length < 5) {

                                if (consumosMovilesResponse.smsyMmms.listaPaquetesPendientesMMS != null && consumosMovilesResponse.smsyMmms.listaPaquetesPendientesMMS != "") {

                                    if (!Array.isArray(consumosMovilesResponse.smsyMmms.listaPaquetesPendientesMMS)) {
                                        var listaPaquetesPendientesMMS = [];
                                        listaPaquetesPendientesMMS.push(consumosMovilesResponse.smsyMmms.listaPaquetesPendientesMMS);
                                        consumosMovilesResponse.smsyMmms.listaPaquetesPendientesMMS = listaPaquetesPendientesMMS;
                                    }

                                    var tamListaPaquetesPendientesMMS = consumosMovilesResponse.smsyMmms.listaPaquetesPendientesMMS.length;
                                    for (i = 0; i < tamListaPaquetesPendientesMMS; i++) {
                                        if (consumoObjetoList.length < 5) {
                                            var bolsaPrincipalMMS = consumosMovilesResponse.smsyMmms.listaPaquetesPendientesMMS[i];
                                            var consumoMMS = new Object();
                                            consumoMMS.imagen = "/wpstheme/miclaro/img/icon-min-mensajes.png";
                                            consumoMMS.tipoPaquete = bolsaPrincipalMMS.nombre;
                                            if (bolsaPrincipalMMS.total == bolsaPrincipalMMS.utilizado) {
                                                consumoMMS.saldoRestante = "Agotado";
                                            } else {
                                                var saldoRestMms = bolsaPrincipalMMS.total - bolsaPrincipalMMS.utilizado;
                                                consumoMMS.saldoRestante = saldoRestMms.toFixed(0);
                                            }

                                            if (bolsaPrincipalMMS.total == bolsaPrincipalMMS.utilizado) {
                                                consumoMMS.color = "#2095a8";
                                            } else {
                                                consumoMMS.color = "#2095a8";
                                            }
                                            consumoMMS.fechaVencimiento = bolsaPrincipalMMS.fechaVencimiento;
                                            if (bolsaPrincipalMMS.total == bolsaPrincipalMMS.utilizado) {
                                                consumoMMS.unidad = "";
                                            } else {
                                                consumoMMS.unidad = bolsaPrincipalMMS.unidadConsumo + " restantes";
                                            }
                                            if (bolsaPrincipalMMS.utilizado == 0) {
                                                consumoMMS.consumoCero = true;
                                            }
                                            consumoMMS.porcentaje = (100 * bolsaPrincipalMMS.utilizado) / bolsaPrincipalMMS.total;
                                            consumoMMS.ilimitado = bolsaPrincipalMMS.flagIlimitado;
                                            consumoMMS.show = true;
                                            consumoObjetoList.push(consumoMMS);

                                        }
                                    }
                                }
                            }
                        }
                    }


                    $scope.consumosServicios = consumoObjetoList;

                    $('.percent').each(function(i, e) {

                        if (consumoObjetoList[i] != undefined) {
                            if (consumoObjetoList[i].ilimitado == "true") {
                                if (consumoObjetoList[i].consumoCero) {
                                    consumoObjetoList[i].porcentaje = 0;
                                } else {
                                    consumoObjetoList[i].porcentaje = 50;
                                }
                                consumoObjetoList[i].saldoRestante = "Ilimitado";
                                consumoObjetoList[i].unidad = "";
                            }

                            $(this).css({ 'background': consumoObjetoList[i].color });
                            $(this).animate({ width: 0 + '%' }, 0);

                            $(this).delay(600).css({ 'background': consumoObjetoList[i].color });
                            $(this).delay(600).animate({ width: consumoObjetoList[i].porcentaje + '%' }, 350);
                        }

                    });

                } else if ($scope.servicio.ProductoServicioResponse.tipoLinea == 1) {

                    var consumoObjetoPre = {
                        flagMostrar: null,
                        color: null,
                        saldoRestante: null,
                        fechaVencimiento: null,
                        tipoPaquete: null,
                        unidad: null,
                        porcentaje: null,
                        ilimitado: null,
                        consumoCero: null
                    };

                    var consumoObjetoListInternetPre = [];

                    $scope.tienePaqueteInternet = 0;

                    var consumosMovilesResponse = response.data.obtenerConsumoGeneralMovilResponse;

                    if (consumosMovilesResponse.internet != null && consumosMovilesResponse.internet != "") {

                        $scope.tienePaqueteInternet = 1;

                        if (consumosMovilesResponse.internet.listaBolsaPrincipalInternet != null && consumosMovilesResponse.internet.listaBolsaPrincipalInternet != "") {

                            if (!Array.isArray(consumosMovilesResponse.internet.listaBolsaPrincipalInternet)) {
                                var listaBolsaPrincipalInternet = [];
                                listaBolsaPrincipalInternet.push(consumosMovilesResponse.internet.listaBolsaPrincipalInternet);
                                consumosMovilesResponse.internet.listaBolsaPrincipalInternet = listaBolsaPrincipalInternet;
                            }

                            var tamBolsaPrincipalInternetList = consumosMovilesResponse.internet.listaBolsaPrincipalInternet.length > 3 ? 3 : consumosMovilesResponse.internet.listaBolsaPrincipalInternet.length;
                            for (i = 0; i < tamBolsaPrincipalInternetList; i++) {
                                var bolsaPrincipalInternet = consumosMovilesResponse.internet.listaBolsaPrincipalInternet[i];
                                var consumoInternetPrepago = new Object();
                                consumoInternetPrepago.flagMostrar = 1;
                                if (bolsaPrincipalInternet.bolsaTotal == bolsaPrincipalInternet.bolsaUtilizada) {
                                    consumoInternetPrepago.color = "#E3C1BE";
                                } else {
                                    consumoInternetPrepago.color = "#f6a244";
                                }
                                consumoInternetPrepago.tipoPaquete = bolsaPrincipalInternet.nombreBolsa;
                                if (bolsaPrincipalInternet.bolsaTotal == bolsaPrincipalInternet.bolsaUtilizada) {
                                    consumoInternetPrepago.saldoRestante = "Agotado";
                                } else {
                                    var saldoRestIntP = bolsaPrincipalInternet.bolsaTotal - bolsaPrincipalInternet.bolsaUtilizada;
                                    consumoInternetPrepago.saldoRestante = saldoRestIntP.toFixed(2);
                                }
                                consumoInternetPrepago.fechaVencimiento = bolsaPrincipalInternet.fechaVencimiento;
                                if (bolsaPrincipalInternet.bolsaTotal == bolsaPrincipalInternet.bolsaUtilizada) {
                                    consumoInternetPrepago.unidad = "";
                                } else {
                                    consumoInternetPrepago.unidad = bolsaPrincipalInternet.unidadConsumo + " restantes";
                                }
                                if (bolsaPrincipalInternet.bolsaUtilizada == 0) {
                                    consumoInternetPrepago.consumoCero = true;
                                }
                                consumoInternetPrepago.porcentaje = (100 * bolsaPrincipalInternet.bolsaUtilizada) / bolsaPrincipalInternet.bolsaTotal;
                                consumoInternetPrepago.ilimitado = bolsaPrincipalInternet.flagIlimitado;
                                consumoObjetoListInternetPre.push(consumoInternetPrepago);

                            }
                        }

                        if (consumoObjetoListInternetPre.length < 3) {
                            if (consumosMovilesResponse.internet.listaAdicionalesPlan != null && consumosMovilesResponse.internet.listaAdicionalesPlan != "") {

                                if (!Array.isArray(consumosMovilesResponse.internet.listaAdicionalesPlan)) {
                                    var listaAdicionalesPlan = [];
                                    listaAdicionalesPlan.push(consumosMovilesResponse.internet.listaAdicionalesPlan);
                                    consumosMovilesResponse.internet.listaAdicionalesPlan = listaAdicionalesPlan;
                                }

                                var tamListaAdicionalesPlan = consumosMovilesResponse.internet.listaAdicionalesPlan.length;
                                for (i = 0; i < tamListaAdicionalesPlan; i++) {
                                    if (consumoObjetoListInternetPre.length < 3) {
                                        var bolsaPrincipalInternet = consumosMovilesResponse.internet.listaAdicionalesPlan[i];
                                        var consumoInternetPrepago = new Object();
                                        consumoInternetPrepago.flagMostrar = 1;
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternetPrepago.color = "#E3C1BE";
                                        } else {
                                            consumoInternetPrepago.color = "#f6a244";
                                        }
                                        consumoInternetPrepago.tipoPaquete = bolsaPrincipalInternet.nombre;
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternetPrepago.saldoRestante = "Agotado";
                                        } else {
                                            var saldoRestIntA = bolsaPrincipalInternet.total - bolsaPrincipalInternet.bolsaUtilizada;
                                            consumoInternetPrepago.saldoRestante = saldoRestIntA.toFixed(2);
                                        }
                                        consumoInternetPrepago.fechaVencimiento = bolsaPrincipalInternet.fechaVencimiento;
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternetPrepago.unidad = "";
                                        } else {
                                            consumoInternetPrepago.unidad = bolsaPrincipalInternet.unidadConsumo + " restantes";
                                        }
                                        if (bolsaPrincipalInternet.utilizado == 0) {
                                            consumoInternetPrepago.consumoCero = true;
                                        }
                                        consumoInternetPrepago.porcentaje = (100 * bolsaPrincipalInternet.utilizado) / bolsaPrincipalInternet.bolsaTotal;
                                        consumoInternetPrepago.ilimitado = bolsaPrincipalInternet.flagIlimitado;
                                        consumoObjetoListInternetPre.push(consumoInternetPrepago);
                                    }
                                }

                            }

                        }

                        if (consumoObjetoListInternetPre.length < 3) {
                            if (consumosMovilesResponse.internet.listaPaquetesActivos != null && consumosMovilesResponse.internet.listaPaquetesActivos != "") {

                                if (!Array.isArray(consumosMovilesResponse.internet.listaPaquetesActivos)) {
                                    var listaPaquetesActivos = [];
                                    listaPaquetesActivos.push(consumosMovilesResponse.internet.listaPaquetesActivos);
                                    consumosMovilesResponse.internet.listaPaquetesActivos = listaPaquetesActivos;
                                }

                                var tamListaPaquetesActivos = consumosMovilesResponse.internet.listaPaquetesActivos.length;
                                for (i = 0; i < tamListaPaquetesActivos; i++) {
                                    if (consumoObjetoListInternetPre.length < 3) {
                                        var bolsaPrincipalInternet = consumosMovilesResponse.internet.listaPaquetesActivos[i];
                                        var consumoInternetPrepago = new Object();
                                        consumoInternetPrepago.flagMostrar = 1;
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternetPrepago.color = "#E3C1BE";
                                        } else {
                                            consumoInternetPrepago.color = "#f6a244";
                                        }
                                        consumoInternetPrepago.tipoPaquete = bolsaPrincipalInternet.nombre;
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternetPrepago.saldoRestante = "Agotado";
                                        } else {
                                            var saldoResIntPre = bolsaPrincipalInternet.total - bolsaPrincipalInternet.utilizado;
                                            consumoInternetPrepago.saldoRestante = saldoResIntPre.toFixed(2);

                                        }
                                        consumoInternetPrepago.fechaVencimiento = bolsaPrincipalInternet.fechaVencimiento;
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternetPrepago.unidad = "";
                                        } else {
                                            consumoInternetPrepago.unidad = bolsaPrincipalInternet.unidadConsumo + " restantes";
                                        }
                                        if (bolsaPrincipalInternet.utilizado == 0) {
                                            consumoInternetPrepago.consumoCero = true;
                                        }
                                        consumoInternetPrepago.porcentaje = (100 * bolsaPrincipalInternet.utilizado) / bolsaPrincipalInternet.total;
                                        consumoInternetPrepago.ilimitado = bolsaPrincipalInternet.flagIlimitado;
                                        consumoObjetoListInternetPre.push(consumoInternetPrepago);
                                    }
                                }

                            }
                        }

                        if (consumoObjetoListInternetPre.length < 3) {
                            if (consumosMovilesResponse.internet.listaPaquetesPendientesInternet != null && consumosMovilesResponse.internet.listaPaquetesPendientesInternet != "") {

                                if (!Array.isArray(consumosMovilesResponse.internet.listaPaquetesPendientesInternet)) {
                                    var listaPaquetesPendientesInternet = [];
                                    listaPaquetesPendientesInternet.push(consumosMovilesResponse.internet.listaPaquetesPendientesInternet);
                                    consumosMovilesResponse.internet.listaPaquetesPendientesInternet = listaPaquetesPendientesInternet;
                                }

                                var tamListaPaquetesPendientesInternet = consumosMovilesResponse.internet.listaPaquetesPendientesInternet.length;
                                for (i = 0; i < tamListaPaquetesPendientesInternet; i++) {
                                    if (consumoObjetoListInternetPre.length < 3) {
                                        var bolsaPrincipalInternet = consumosMovilesResponse.internet.listaPaquetesPendientesInternet[i];
                                        var consumoInternetPrepago = new Object();
                                        consumoInternetPrepago.flagMostrar = 1;
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternetPrepago.color = "#E3C1BE";
                                        } else {
                                            consumoInternetPrepago.color = "#f6a244";
                                        }
                                        consumoInternetPrepago.tipoPaquete = bolsaPrincipalInternet.nombre;
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternetPrepago.saldoRestante = "Agotado";
                                        } else {
                                            var saldoRestIntPn = bolsaPrincipalInternet.total - bolsaPrincipalInternet.bolsaUtilizada;
                                            consumoInternetPrepago.saldoRestante = saldoRestIntPn.toFixed(2);
                                        }
                                        consumoInternetPrepago.fechaVencimiento = bolsaPrincipalInternet.fechaVencimiento;
                                        if (bolsaPrincipalInternet.total == bolsaPrincipalInternet.utilizado) {
                                            consumoInternetPrepago.unidad = "";
                                        } else {
                                            consumoInternetPrepago.unidad = bolsaPrincipalInternet.unidadConsumo + " restantes";
                                        }
                                        if (bolsaPrincipalInternet.utilizado == 0) {
                                            consumoInternetPrepago.consumoCero = true;
                                        }
                                        consumoInternetPrepago.porcentaje = (100 * bolsaPrincipalInternet.utilizado) / bolsaPrincipalInternet.bolsaTotal;
                                        consumoInternetPrepago.ilimitado = bolsaPrincipalInternet.flagIlimitado;
                                        consumoObjetoListInternetPre.push(consumoInternetPrepago);
                                    }
                                }

                            }
                        }

                        $scope.consumosServiciosInternet = consumoObjetoListInternetPre;


                        $('.percentPre').each(function(i, e) {

                            if (i == consumoObjetoListInternetPre.length) {
                                return false;
                            } else {

                                if (consumoObjetoListInternetPre[i].ilimitado == "true") {
                                    if (consumoObjetoListInternetPre[i].consumoCero) {
                                        consumoObjetoListInternetPre[i].porcentaje = 0;
                                    } else {
                                        consumoObjetoListInternetPre[i].porcentaje = 50;
                                    }
                                    consumoObjetoListInternetPre[i].saldoRestante = "Ilimitado";
                                    consumoObjetoListInternetPre[i].unidad = "";
                                }

                                $(this).css({ 'background': consumoObjetoListInternetPre[i].color });
                                $(this).animate({ width: 0 }, 0);

                                $(this).delay(600).css({ 'background': consumoObjetoListInternetPre[i].color });
                                $(this).delay(600).animate({ width: consumoObjetoListInternetPre[i].porcentaje + '%' }, 350);

                            }

                        });
                    }



                    var consumoObjetoListLlamadasPre = [];

                    $scope.tienePaqueteLlamadas = 0;

                    if (consumosMovilesResponse.llamadas != null && consumosMovilesResponse.llamadas != "") {

                        $scope.tienePaqueteLlamadas = 1;

                        if (consumosMovilesResponse.llamadas.listaBolsaPrincipalLlamadas != null && consumosMovilesResponse.llamadas.listaBolsaPrincipalLlamadas != "") {

                            if (!Array.isArray(consumosMovilesResponse.llamadas.listaBolsaPrincipalLlamadas)) {
                                var listaBolsaPrincipalLlamadas = [];
                                listaBolsaPrincipalLlamadas.push(consumosMovilesResponse.llamadas.listaBolsaPrincipalLlamadas);
                                consumosMovilesResponse.llamadas.listaBolsaPrincipalLlamadas = listaBolsaPrincipalLlamadas;
                            }

                            var tamBolsaPrincipalLlamadasList = consumosMovilesResponse.llamadas.listaBolsaPrincipalLlamadas.length > 2 ? 2 : consumosMovilesResponse.llamadas.listaBolsaPrincipalLlamadas.length;
                            for (i = 0; i < tamBolsaPrincipalLlamadasList; i++) {
                                var bolsaPrincipalLlamadas = consumosMovilesResponse.llamadas.listaBolsaPrincipalLlamadas[i];
                                var consumoLlamadasPrepago = new Object();
                                consumoLlamadasPrepago.flagMostrar = 1;
                                consumoLlamadasPrepago.tipoPaquete = bolsaPrincipalLlamadas.nombreBolsa;
                                var saldoRest = bolsaPrincipalLlamadas.bolsaTotal - bolsaPrincipalLlamadas.bolsaUtilizada;
                                if (bolsaPrincipalLlamadas.unidadConsumo == "SOLES") {
                                    consumoLlamadasPrepago.saldoRestante = saldoRest.toFixed(2);
                                } else {
                                    consumoLlamadasPrepago.saldoRestante = saldoRest.toFixed(0);
                                }
                                consumoLlamadasPrepago.fechaVencimiento = bolsaPrincipalLlamadas.fechaVencimiento;
                                consumoLlamadasPrepago.unidad = bolsaPrincipalLlamadas.unidadConsumo + " restantes";
                                consumoLlamadasPrepago.ilimitado = bolsaPrincipalLlamadas.flagIlimitado;
                                consumoObjetoListLlamadasPre.push(consumoLlamadasPrepago);

                            }

                        }


                        if (consumoObjetoListLlamadasPre.length < 2) {
                            if (consumosMovilesResponse.llamadas.listaAdicionalesPlan != null && consumosMovilesResponse.llamadas.listaAdicionalesPlan != "") {

                                if (!Array.isArray(consumosMovilesResponse.llamadas.listaAdicionalesPlan)) {
                                    var listaAdicionalesPlan = [];
                                    listaAdicionalesPlan.push(consumosMovilesResponse.llamadas.listaAdicionalesPlan);
                                    consumosMovilesResponse.llamadas.listaAdicionalesPlan = listaAdicionalesPlan;
                                }

                                var tamListaAdicionalesPlan = consumosMovilesResponse.llamadas.listaAdicionalesPlan.length;
                                for (i = 0; i < tamListaAdicionalesPlan; i++) {
                                    if (consumoObjetoListLlamadasPre.length < 2) {
                                        var bolsaPrincipalLlamadas = consumosMovilesResponse.llamadas.listaAdicionalesPlan[i];
                                        var consumoLlamadasPrepago = new Object();
                                        consumoLlamadasPrepago.flagMostrar = 1;
                                        consumoLlamadasPrepago.tipoPaquete = bolsaPrincipalLlamadas.nombre;
                                        var saldoRest = bolsaPrincipalLlamadas.total - bolsaPrincipalLlamadas.utilizado;
                                        if (bolsaPrincipalLlamadas.unidadConsumo == "SOLES") {
                                            consumoLlamadasPrepago.saldoRestante = saldoRest.toFixed(2);
                                        } else {
                                            consumoLlamadasPrepago.saldoRestante = saldoRest.toFixed(0);
                                        }
                                        consumoLlamadasPrepago.fechaVencimiento = bolsaPrincipalLlamadas.fechaVencimiento;
                                        consumoLlamadasPrepago.unidad = bolsaPrincipalLlamadas.unidadConsumo + " restantes";
                                        consumoLlamadasPrepago.ilimitado = bolsaPrincipalLlamadas.flagIlimitado;
                                        consumoObjetoListLlamadasPre.push(consumoLlamadasPrepago);
                                    }
                                }
                            }
                        }

                        if (consumoObjetoListLlamadasPre.length < 2) {
                            if (consumosMovilesResponse.llamadas.listaBonosRegalados != null && consumosMovilesResponse.llamadas.listaBonosRegalados != "") {

                                if (!Array.isArray(consumosMovilesResponse.llamadas.listaBonosRegalados)) {
                                    var listaBonosRegalados = [];
                                    listaBonosRegalados.push(consumosMovilesResponse.llamadas.listaBonosRegalados);
                                    consumosMovilesResponse.llamadas.listaBonosRegalados = listaBonosRegalados;
                                }

                                var tamListaBonosRegalados = consumosMovilesResponse.llamadas.listaBonosRegalados.length;
                                for (i = 0; i < tamListaBonosRegalados; i++) {
                                    if (consumoObjetoListLlamadasPre.length < 2) {
                                        var bolsaPrincipalLlamadas = consumosMovilesResponse.llamadas.listaBonosRegalados[i];
                                        var consumoLlamadasPrepago = new Object();
                                        consumoLlamadasPrepago.flagMostrar = 1;
                                        consumoLlamadasPrepago.tipoPaquete = bolsaPrincipalLlamadas.nombre;
                                        var saldoRest = bolsaPrincipalLlamadas.total - bolsaPrincipalLlamadas.utilizado;
                                        if (bolsaPrincipalLlamadas.unidadConsumo == "SOLES") {
                                            consumoLlamadasPrepago.saldoRestante = saldoRest.toFixed(2);
                                        } else {
                                            consumoLlamadasPrepago.saldoRestante = saldoRest.toFixed(0);
                                        }
                                        consumoLlamadasPrepago.fechaVencimiento = bolsaPrincipalLlamadas.fechaVencimiento;
                                        consumoLlamadasPrepago.unidad = bolsaPrincipalLlamadas.unidadConsumo + " restantes";
                                        consumoLlamadasPrepago.ilimitado = bolsaPrincipalLlamadas.flagIlimitado;
                                        consumoObjetoListLlamadasPre.push(consumoLlamadasPrepago);
                                    }
                                }
                            }
                        }

                        if (consumoObjetoListLlamadasPre.length < 2) {
                            if (consumosMovilesResponse.llamadas.listaPaquetesPendientesLlamadas != null && consumosMovilesResponse.llamadas.listaPaquetesPendientesLlamadas != "") {

                                if (!Array.isArray(consumosMovilesResponse.llamadas.listaPaquetesPendientesLlamadas)) {
                                    var listaPaquetesPendientesLlamadas = [];
                                    listaPaquetesPendientesLlamadas.push(consumosMovilesResponse.llamadas.listaPaquetesPendientesLlamadas);
                                    consumosMovilesResponse.llamadas.listaPaquetesPendientesLlamadas = listaPaquetesPendientesLlamadas;
                                }

                                var tamListaPaquetesPendientesLlamadas = consumosMovilesResponse.llamadas.listaPaquetesPendientesLlamadas.length;
                                for (i = 0; i < tamListaPaquetesPendientesLlamadas; i++) {
                                    if (consumoObjetoListLlamadasPre.length < 2) {
                                        var bolsaPrincipalLlamadas = consumosMovilesResponse.llamadas.listaPaquetesPendientesLlamadas[i];
                                        var consumoLlamadasPrepago = new Object();
                                        consumoLlamadasPrepago.flagMostrar = 1;
                                        consumoLlamadasPrepago.tipoPaquete = bolsaPrincipalLlamadas.nombre;
                                        var saldoRest = bolsaPrincipalLlamadas.total - bolsaPrincipalLlamadas.utilizado;
                                        if (bolsaPrincipalLlamadas.unidadConsumo == "SOLES") {
                                            consumoLlamadasPrepago.saldoRestante = saldoRest.toFixed(2);
                                        } else {
                                            consumoLlamadasPrepago.saldoRestante = saldoRest.toFixed(0);
                                        }
                                        consumoLlamadasPrepago.fechaVencimiento = bolsaPrincipalLlamadas.fechaVencimiento;
                                        consumoLlamadasPrepago.unidad = bolsaPrincipalLlamadas.unidadConsumo + " restantes";
                                        consumoLlamadasPrepago.ilimitado = bolsaPrincipalLlamadas.flagIlimitado;
                                        consumoObjetoListLlamadasPre.push(consumoLlamadasPrepago);
                                    }
                                }
                            }
                        }

                        $scope.consumosServiciosLlamadas = consumoObjetoListLlamadasPre

                        $('.llamadasPre').each(function(i, ea) {

                            if (consumoObjetoListLlamadasPre[i] != undefined) {
                                if (consumoObjetoListLlamadasPre[i].ilimitado == 1) {
                                    consumoObjetoListLlamadasPre[i].saldoRestante = "Ilimitado";
                                    consumoObjetoListLlamadasPre[i].unidad = "";
                                }
                            }

                        });

                    }

                    var consumoObjetoListMensajesPre = [];

                    $scope.tienePaqueteMensajes = 0;

                    if (consumosMovilesResponse.smsyMmms != null && consumosMovilesResponse.smsyMmms != "") {

                        $scope.tienePaqueteMensajes = 1;

                        if (consumosMovilesResponse.smsyMmms.listaBolsaPrincipalSms != null && consumosMovilesResponse.smsyMmms.listaBolsaPrincipalSms != "") {

                            if (!Array.isArray(consumosMovilesResponse.smsyMmms.listaBolsaPrincipalSms)) {
                                var listaBolsaPrincipalSms = [];
                                listaBolsaPrincipalSms.push(consumosMovilesResponse.smsyMmms.listaBolsaPrincipalSms);
                                consumosMovilesResponse.smsyMmms.listaBolsaPrincipalSms = listaBolsaPrincipalSms;
                            }

                            var tamBolsaPrincipalSmsList = consumosMovilesResponse.smsyMmms.listaBolsaPrincipalSms.length > 2 ? 2 : consumosMovilesResponse.smsyMmms.listaBolsaPrincipalSms.length;
                            for (i = 0; i < tamBolsaPrincipalSmsList; i++) {
                                var bolsaPrincipalSms = consumosMovilesResponse.smsyMmms.listaBolsaPrincipalSms[i];
                                var consumoSmsPre = new Object();
                                consumoSmsPre.flagMostrar = 1;
                                consumoSmsPre.tipoPaquete = bolsaPrincipalSms.nombre;
                                consumoSmsPre.saldoRestante = bolsaPrincipalSms.total - bolsaPrincipalSms.utilizado;
                                consumoSmsPre.fechaVencimiento = bolsaPrincipalSms.fechaVencimiento;
                                consumoSmsPre.unidad = bolsaPrincipalSms.unidadConsumo + " restantes";
                                consumoSmsPre.ilimitado = bolsaPrincipalSms.flagIlimitado;
                                consumoObjetoListMensajesPre.push(consumoSmsPre);


                            }
                        }

                        if (consumoObjetoListMensajesPre.length < 2) {
                            if (consumosMovilesResponse.smsyMmms.listaAdicionalesPlan != null && consumosMovilesResponse.smsyMmms.listaAdicionalesPlan != "") {

                                if (!Array.isArray(consumosMovilesResponse.smsyMmms.listaAdicionalesPlan)) {
                                    var listaAdicionalesPlan = [];
                                    listaAdicionalesPlan.push(consumosMovilesResponse.smsyMmms.listaAdicionalesPlan);
                                    consumosMovilesResponse.smsyMmms.listaAdicionalesPlan = listaAdicionalesPlan;
                                }

                                var tamListaAdicionalesPlan = consumosMovilesResponse.smsyMmms.listaAdicionalesPlan.length;
                                for (i = 0; i < tamListaAdicionalesPlan; i++) {
                                    if (consumoObjetoListMensajesPre.length < 2) {
                                        var bolsaPrincipalSms = consumosMovilesResponse.smsyMmms.listaAdicionalesPlan[i];
                                        var consumoSmsPre = new Object();
                                        consumoSmsPre.flagMostrar = 1;
                                        consumoSmsPre.tipoPaquete = bolsaPrincipalSms.nombre;
                                        consumoSmsPre.saldoRestante = bolsaPrincipalSms.total - bolsaPrincipalSms.utilizado;
                                        consumoSmsPre.fechaVencimiento = bolsaPrincipalSms.fechaVencimiento;
                                        consumoSmsPre.unidad = bolsaPrincipalSms.unidadConsumo + " restantes";
                                        consumoSmsPre.ilimitado = bolsaPrincipalSms.flagIlimitado;
                                        consumoObjetoListMensajesPre.push(consumoSmsPre);
                                    }
                                }
                            }
                        }

                        if (consumoObjetoListMensajesPre.length < 2) {
                            if (consumosMovilesResponse.smsyMmms.listaBonosRegalados != null && consumosMovilesResponse.smsyMmms.listaBonosRegalados != "") {

                                if (!Array.isArray(consumosMovilesResponse.smsyMmms.listaBonosRegalados)) {
                                    var listaBonosRegalados = [];
                                    listaBonosRegalados.push(consumosMovilesResponse.smsyMmms.listaBonosRegalados);
                                    consumosMovilesResponse.smsyMmms.listaBonosRegalados = listaBonosRegalados;
                                }

                                var tamListaBonosRegalados = consumosMovilesResponse.smsyMmms.listaBonosRegalados.length;
                                for (i = 0; i < tamListaBonosRegalados; i++) {
                                    if (consumoObjetoListMensajesPre.length < 2) {
                                        var bolsaPrincipalSms = consumosMovilesResponse.smsyMmms.listaBonosRegalados[i];
                                        var consumoSmsPre = new Object();
                                        consumoSmsPre.flagMostrar = 1;
                                        consumoSmsPre.tipoPaquete = bolsaPrincipalSms.nombre;
                                        consumoSmsPre.saldoRestante = bolsaPrincipalSms.total - bolsaPrincipalSms.utilizado;
                                        consumoSmsPre.fechaVencimiento = bolsaPrincipalSms.fechaVencimiento;
                                        consumoSmsPre.unidad = bolsaPrincipalSms.unidadConsumo + " restantes";
                                        consumoSmsPre.ilimitado = bolsaPrincipalSms.flagIlimitado;
                                        consumoObjetoListMensajesPre.push(consumoSmsPre);
                                    }
                                }
                            }
                        }

                        if (consumoObjetoListMensajesPre.length < 2) {
                            if (consumosMovilesResponse.smsyMmms.listaPaquetesPendientesSMS != null && consumosMovilesResponse.smsyMmms.listaPaquetesPendientesSMS != "") {

                                if (!Array.isArray(consumosMovilesResponse.smsyMmms.listaPaquetesPendientesSMS)) {
                                    var listaPaquetesPendientesSMS = [];
                                    listaPaquetesPendientesSMS.push(consumosMovilesResponse.smsyMmms.listaPaquetesPendientesSMS);
                                    consumosMovilesResponse.smsyMmms.listaPaquetesPendientesSMS = listaPaquetesPendientesSMS;
                                }

                                var tamListaPaquetesPendientesSMS = consumosMovilesResponse.smsyMmms.listaPaquetesPendientesSMS.length;
                                for (i = 0; i < tamListaPaquetesPendientesSMS; i++) {
                                    if (consumoObjetoListMensajesPre.length < 2) {
                                        var bolsaPrincipalSms = consumosMovilesResponse.smsyMmms.listaPaquetesPendientesSMS[i];
                                        var consumoSmsPre = new Object();
                                        consumoSmsPre.flagMostrar = 1;
                                        consumoSmsPre.tipoPaquete = bolsaPrincipalSms.nombre;
                                        consumoSmsPre.saldoRestante = bolsaPrincipalSms.total - bolsaPrincipalSms.utilizado;
                                        consumoSmsPre.fechaVencimiento = bolsaPrincipalSms.fechaVencimiento;
                                        consumoSmsPre.unidad = bolsaPrincipalSms.unidadConsumo + " restantes";
                                        consumoSmsPre.ilimitado = bolsaPrincipalSms.flagIlimitado;
                                        consumoObjetoListMensajesPre.push(consumoSmsPre);
                                    }
                                }
                            }
                        }
                    }

                    if (consumoObjetoListMensajesPre.length < 2) {

                        if (consumosMovilesResponse.smsyMmms != null && consumosMovilesResponse.smsyMmms != "") {

                            $scope.tienePaqueteMensajes = 1;

                            if (consumosMovilesResponse.smsyMmms.listaBolsaPrincipalMMS != null && consumosMovilesResponse.smsyMmms.listaBolsaPrincipalMMS != "") {

                                if (!Array.isArray(consumosMovilesResponse.smsyMmms.listaBolsaPrincipalMMS)) {
                                    var listaBolsaPrincipalMMS = [];
                                    listaBolsaPrincipalMMS.push(consumosMovilesResponse.smsyMmms.listaBolsaPrincipalMMS);
                                    consumosMovilesResponse.smsyMmms.listaBolsaPrincipalMMS = listaBolsaPrincipalMMS;
                                }

                                var tamBolsaPrincipalMmsList = consumosMovilesResponse.smsyMmms.listaBolsaPrincipalMMS.length;
                                for (i = 0; i < tamBolsaPrincipalMmsList; i++) {
                                    if (consumoObjetoListMensajesPre.length < 2) {
                                        var bolsaPrincipalMMS = consumosMovilesResponse.smsyMmms.listaBolsaPrincipalMMS[i];
                                        var consumoMMSPre = new Object();
                                        consumoMMSPre.flagMostrar = 1;
                                        consumoMMSPre.tipoPaquete = bolsaPrincipalMMS.nombre;
                                        consumoMMSPre.saldoRestante = bolsaPrincipalMMS.total - bolsaPrincipalMMS.utilizado;
                                        consumoMMSPre.fechaVencimiento = bolsaPrincipalMMS.fechaVencimiento;
                                        consumoMMSPre.unidad = bolsaPrincipalMMS.unidadConsumo + " restantes";
                                        consumoMMSPre.ilimitado = bolsaPrincipalMMS.flagIlimitado;
                                        consumoObjetoListMensajesPre.push(consumoMMSPre);


                                    }
                                }
                            }

                            if (consumoObjetoListMensajesPre.length < 2) {

                                if (consumosMovilesResponse.smsyMmms.listaPaquetesPendientesMMS != null && consumosMovilesResponse.smsyMmms.listaPaquetesPendientesMMS != "") {

                                    if (!Array.isArray(consumosMovilesResponse.smsyMmms.listaPaquetesPendientesMMS)) {
                                        var listaPaquetesPendientesMMS = [];
                                        listaPaquetesPendientesMMS.push(consumosMovilesResponse.smsyMmms.listaPaquetesPendientesMMS);
                                        consumosMovilesResponse.smsyMmms.listaPaquetesPendientesMMS = listaPaquetesPendientesMMS;
                                    }

                                    var tamListaPaquetesPendientesMMS = consumosMovilesResponse.smsyMmms.listaPaquetesPendientesMMS.length;
                                    for (i = 0; i < tamListaPaquetesPendientesMMS; i++) {
                                        if (consumoObjetoListMensajesPre.length < 2) {
                                            var bolsaPrincipalMMS = consumosMovilesResponse.smsyMmms.listaPaquetesPendientesMMS[i];
                                            var consumoMMSPre = new Object();
                                            consumoMMSPre.flagMostrar = 1;
                                            consumoMMSPre.tipoPaquete = bolsaPrincipalMMS.nombre;
                                            consumoMMSPre.saldoRestante = bolsaPrincipalMMS.total - bolsaPrincipalMMS.utilizado;
                                            consumoMMSPre.fechaVencimiento = bolsaPrincipalMMS.fechaVencimiento;
                                            consumoMMSPre.unidad = bolsaPrincipalMMS.unidadConsumo + " restantes";
                                            consumoMMSPre.ilimitado = bolsaPrincipalMMS.flagIlimitado;
                                            consumoObjetoListMensajesPre.push(consumoMMSPre);

                                        }
                                    }
                                }
                            }
                        }
                    }

                    $scope.consumosServiciosMensajes = consumoObjetoListMensajesPre

                    $('.mensajesPre').each(function(i, ea) {

                        if (consumoObjetoListMensajesPre[i] != undefined) {
                            if (consumoObjetoListMensajesPre[i].ilimitado == 1) {
                                consumoObjetoListMensajesPre[i].saldoRestante = "Ilimitado";
                                consumoObjetoListMensajesPre[i].unidad = "";
                            }
                        }

                    });
                }


            } else {
                ResquestAuditoria.estado = "ERROR";
                ResquestAuditoria.descripcionoperacion = "obtenerConsumoGeneralMovil - " + mensaje;
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
            $("#movil").delay(400).show(0);
            setTimeout(function() { aniamteBox('.box'); }, 400);
            firstRender = false;
        }

    }

    this.cambioServicio = function() {

        $scope.estadoServicioFlag = null;
        $scope.consumosMovilFlag = null;
        ResquestAuditoria.servicio = $scope.servicio.ProductoServicioResponse.nombre;
        ResquestAuditoria.tipoLinea = $scope.servicio.ProductoServicioResponse.tipoLinea;
        ResquestAuditoria.perfil = $scope.servicio.ProductoServicioResponse.tipoPermiso;

        $("#textox").html($scope.servicio.ProductoServicioResponse.nombreAlias);

        if (typeof $scope.servicio.ProductoServicioResponse.tipoClienteLineaAfiliada === "undefined") {
            $scope.tipoClienteLineaAfiliadaFlag = 0;
        } else {
            $scope.tipoClienteLineaAfiliadaFlag = $scope.servicio.ProductoServicioResponse.tipoClienteLineaAfiliada;
        }


        getObtenerEstadoServicio($scope.servicio);
        getObtenerConsumoGeneralMovilWS($scope.servicio);
        actualizarProductoPrincipalSesion($scope.servicio);
        $("#movil").hide()
        $("#movil").delay(400).show(0);
        setTimeout(function() { aniamteBox('.box'); }, 400);

    };

    actualizarProductoPrincipalSesion = function(objServico) {

        var appProductoPrincipal = objServico.ProductoServicioResponse.idProductoServicio;
        var appNombreProductoPrincipal = objServico.ProductoServicioResponse.nombreAlias;
        var appIdCuenta = objServico.ProductoServicioResponse.idCuenta;
        var appIdRecibo = objServico.ProductoServicioResponse.idRecibo;
        var appIdDireccion = objServico.ProductoServicioResponse.idDireccion;
        var appTipoLinea = objServico.ProductoServicioResponse.tipoLinea;
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
        actualizarServicioSesion.idCuenta = appIdCuenta;
        actualizarServicioSesion.idRecibo = appIdRecibo;
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
            'action': 'Móvil',
            'label': 'Botón: Libro de reclamaciones'
        });
    }

    $scope.saldosConsumos = function(objServico) {

        window.location.replace("/wps/myportal/miclaro/consumer/consultas/saldosyconsumos/movil");

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Home Servicios',
            'action': 'Móvil',
            'label': 'Botón: Consumos generales'
        });
    }

    $scope.pagarRecibo = function(objServico) {

        window.location.replace("/wps/myportal/miclaro/consumer/recibos/movil");

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Home Servicios',
            'action': 'Móvil',
            'label': 'Botón: Pagar mi recibo'
        });
    }

    $scope.compraPaquetes = function(objServico) {

        window.location.replace("/wps/myportal/miclaro/consumer/comprasyrecargas");

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Servicios Home',
            'action': 'Móvil prepago',
            'label': 'Botón: Compra Paquetes'
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

        $(".boxConsumos").hide();
        getObtenerConsumoGeneralMovilWS($scope.servicio);

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

        window.location.replace("/wps/myportal/miclaro/corporativo/home/movil");

    }

});
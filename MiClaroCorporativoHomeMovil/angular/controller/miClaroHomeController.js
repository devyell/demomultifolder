miClaroApp.controller("MiClaroHomeMovilController", function($scope, $http, $httpParamSerializer, serviceHomeMoviles) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion03;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion03;
    var tipoconsultaBolsa = WPSTipoConsultaConsumoMovil.cuenta;

    $scope.nombreAliasaMostrar = '';
    var categoriaMovil = 1;
    var tipoLinea = 3;
    var tipoCliente = 2;
    var tipoPermiso = 5;
    var pagina = 0;
    var cantResultadosPagina = 0;
    var titularidadServicio = 7;
    var productoPrincipalXidRecibo = false;
    var allSuccess = true;
    var firstRender = true;
    $scope.estadoServicioFlag = null;
    $scope.consumosMovilFlag = null;
    $scope.errorFuncional = null;
    $scope.listaCuentasFlag = null;
    $scope.listaRecibosFlag = null;
    $scope.switchSelect = true;
    $scope.selectedIdRecibo = null;
    $scope.selectedIdCuenta = null;
	var ResquestAuditoria = {
					operationCode: 'T0001',
					pagina: 'P046',
					transactionId: '',
					estado: 'SUCCESS',
					servicio: '-',
					tipoProducto: 'MOVIL',
					tipoLinea: '5',
					tipoUsuario: '2',
					perfil: '-',
					monto: '',
					descripcionoperacion: '-',
					responseType: '/'
	};


    serviceHomeMoviles.getObtenerFlagProductoMovil().then(function(response) {

        $scope.flagServiciosMovil = response.data.comunResponseType.flagProductoMovilSesion;
        $scope.ErrorFlagMovil = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        $scope.FlagMovilIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
        $scope.tipoClienteUsuario = response.data.comunResponseType.tipoCliente;
        $scope.tipoLineaUsuario = response.data.comunResponseType.tipoLinea;

        if ($scope.tipoClienteUsuario == 4) {
            $scope.showSwitch = true;
        }

        if ($scope.ErrorFlagMovil == 0) {
            if ($scope.flagServiciosMovil != "-1") {
                if ($scope.flagServiciosMovil == 2 || $scope.flagServiciosMovil == 3) {
                    $scope.init();
                } else {
                    $("#movil").show();
                }
            } else {
                $("#movil").show();
              
                allSuccess = false;
            }
        } else {
            $("#movil").show();
            
            allSuccess = false;
        }

    });

    $scope.init = function() {
        serviceHomeMoviles.getObtenerServicioPrincipal().then(function(response) {


            $scope.idCuenta = response.data.comunResponseType.idCuenta;
            $scope.idRecibo = response.data.comunResponseType.idRecibo;
            $scope.nombreAliasaMostrar = response.data.comunResponseType.nombreProductoPrincipal;
            $scope.idServicio = response.data.comunResponseType.productoPrincipal;
            $scope.tipoCliente = response.data.comunResponseType.tipoClienteProductoPrincipal;
            $scope.categoria = response.data.comunResponseType.categoria;
            $scope.errorFuncional = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            $scope.servPrincipalIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            $scope.servPrincipalMensaje = response.data.comunResponseType.defaultServiceResponse.mensaje;
			ResquestAuditoria.servicio= $scope.idRecibo;
            if ($scope.errorFuncional == 0) {
                if ($scope.tipoCliente == 2) {
                    if ($scope.categoria == 1) {

                        obtenerServicioxReciboyCuenta($scope.idCuenta, $scope.idRecibo);
                        getObtenerConsumoGeneralMovilWS($scope.idServicio, $scope.idCuenta, $scope.idRecibo, $scope.tipoCliente);
                        obtenerEstadoServicio();
                        aniamteBox('.box');
                    } else {

                        obtenerServicioxReciboyCuentaDefault();
                        aniamteBox('.box');
                    }
                } else {

                    obtenerServicioxReciboyCuentaDefault();
                    aniamteBox('.box');
                }
            } else {
                $("#movil").show();
                
                allSuccess = false;
            }

        }, function(error) {

        });
    };

    function obtenerServicioxReciboyCuenta(idCuentaPrincipal, idReciboPrincipal) {

        var requestObtenerCuenta = {
            "idCuenta": null
        };

        requestObtenerCuenta.idCuenta = idCuentaPrincipal;

        dataCuenta = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerCuenta) });
        serviceHomeMoviles.getobtenerCorporativoRecibo(dataCuenta).then(function(response) {
            
            $scope.listRecibosCorporativos = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo;
            $scope.listaRecibosFlag = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idRespuesta;
			ResquestAuditoria.transactionId = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.mensaje;

            if ($scope.listaRecibosFlag == 0) {
                if (Array.isArray($scope.listRecibosCorporativos)) {
                    angular.forEach($scope.listRecibosCorporativos, function(val, key) {
                        if (val.idRecibo == idReciboPrincipal) {
                            $scope.selectedIdRecibo = $scope.listRecibosCorporativos[key];
                        }
                    });
                } else {
                    $scope.listRecibosCorporativos = [];
                    $scope.listRecibosCorporativos.push(response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo);
                    $scope.selectedIdRecibo = $scope.listRecibosCorporativos[0];
                }
            } else {
                $("#movil").show();
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerListadoMovilCorporativoRecibo - "+mensaje;
				auditoria();
                allSuccess = false;
            }

            serviceHomeMoviles.getobtenerCorporativoCuenta().then(function(response) {
                
                $scope.listcuentasCoorporativas = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta;
                $scope.listaCuentasFlag = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idRespuesta;
				ResquestAuditoria.transactionId = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idTransaccional;
                var mensaje = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.mensaje;

                if ($scope.listaCuentasFlag == 0) {
                    if (Array.isArray($scope.listcuentasCoorporativas)) {
                        angular.forEach($scope.listcuentasCoorporativas, function(val, key) {
                            if (val.idCuenta == idCuentaPrincipal) {
                                $scope.selectedIdCuenta = $scope.listcuentasCoorporativas[key];
                            }
                        });
                    } else {
                        $scope.listcuentasCoorporativas = [];
                        $scope.listcuentasCoorporativas.push(response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta);
                        $scope.selectedIdCuenta = $scope.listcuentasCoorporativas[0];
                    }
                } else {
                    $("#movil").show();
					ResquestAuditoria.estado = "ERROR";
					ResquestAuditoria.descripcionoperacion = "obtenerListadoMovilCorporativoCuenta - "+mensaje;
					auditoria();
                    allSuccess = false;
                }


            }, function(error) {

            });
        }, function(error) {

        });

    };

    function obtenerServicioxReciboyCuentaDefault() {
        serviceHomeMoviles.getobtenerCorporativoCuenta().then(function(response) {
            
            $scope.listcuentasCoorporativas = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta;
            $scope.listaCuentasFlag = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.mensaje;

            var idReciboMatch;
            var idCuentaMatch;

            if ($scope.listaCuentasFlag == 0) {
                if (Array.isArray($scope.listcuentasCoorporativas)) {
                    angular.forEach($scope.listcuentasCoorporativas, function(val, key) {
                        $scope.selectedIdCuenta = $scope.listcuentasCoorporativas[0];
                        idCuentaMatch = $scope.listcuentasCoorporativas[0].idCuenta;
                    });
                } else {
                    $scope.listcuentasCoorporativas = [];
                    $scope.listcuentasCoorporativas.push(response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta);
                    $scope.selectedIdCuenta = $scope.listcuentasCoorporativas[0];
                    idCuentaMatch = $scope.listcuentasCoorporativas[0].idCuenta;


                }
            } else {
                $("#movil").show();
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerListadoMovilCorporativoCuenta - "+mensaje;
				auditoria();
                allSuccess = false;
            }

            var requestobtenerReciboDefault = {
                "idCuenta": null
            };
            requestobtenerReciboDefault.idCuenta = idCuentaMatch;

            dataCuentaDefault = $httpParamSerializer({ requestJson: angular.toJson(requestobtenerReciboDefault) });
            serviceHomeMoviles.getobtenerCorporativoRecibo(dataCuentaDefault).then(function(response) {
                
                $scope.listRecibosCorporativos = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo;
                $scope.listaRecibosFlag = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idRespuesta;
                ResquestAuditoria.transactionId = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idTransaccional;
                var mensaje = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.mensaje;

                if ($scope.listaRecibosFlag == 0) {
                    if (Array.isArray($scope.listRecibosCorporativos)) {
                        angular.forEach($scope.listRecibosCorporativos, function(val, key) {
                            $scope.selectedIdRecibo = $scope.listRecibosCorporativos[0];
                            idReciboMatch = $scope.listRecibosCorporativos[0].idRecibo;
							ResquestAuditoria.servicio=$scope.selectedIdRecibo.nombreRecibo;
							ResquestAuditoria.tipoLinea='5';
							ResquestAuditoria.perfil='-';


                        });
                    } else {
                        $scope.listRecibosCorporativos = [];
                        $scope.listRecibosCorporativos.push(response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo);
                        $scope.selectedIdRecibo = $scope.listRecibosCorporativos[0];
                        idReciboMatch = $scope.listRecibosCorporativos[0].idRecibo;
						ResquestAuditoria.servicio=$scope.selectedIdRecibo.nombreRecibo;
						ResquestAuditoria.tipoLinea='5';
						ResquestAuditoria.perfil='-';


                    }
                } else {
                    $("#movil").show();
					ResquestAuditoria.estado = "ERROR";
					ResquestAuditoria.descripcionoperacion = "obtenerListadoMovilCorporativoRecibo - "+mensaje;
					auditoria();
                    allSuccess = false;
                }

                if ($scope.listaRecibosFlag == 0 && $scope.listaCuentasFlag == 0) {
                    obtenerServicosMovilesxReciboyCuenta(idReciboMatch, idCuentaMatch);
                }


            }, function(error) {

            });

        }, function(error) {

        });

    };

    $scope.traerRecibos = function() {

        aniamteBox('.box');

        var idCuentaRecibos = $scope.selectedIdCuenta.idCuenta;
        var idReciboDefault;


        var requestobtenerReciboDefault = {
            "idCuenta": null
        };
        requestobtenerReciboDefault.idCuenta = idCuentaRecibos;

        dataCuentaDefault = $httpParamSerializer({ requestJson: angular.toJson(requestobtenerReciboDefault) });
        serviceHomeMoviles.getobtenerCorporativoRecibo(dataCuentaDefault).then(function(response) {

            $scope.listRecibosCorporativos = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo;
            $scope.listaRecibosFlag = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId= response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.mensaje;

            if ($scope.listaRecibosFlag == 0) {
                if (Array.isArray($scope.listRecibosCorporativos)) {
                    angular.forEach($scope.listRecibosCorporativos, function(val, key) {
                        $scope.selectedIdRecibo = $scope.listRecibosCorporativos[0];
                        idReciboDefault = $scope.listRecibosCorporativos[0].idRecibo;
						ResquestAuditoria.servicio=$scope.selectedIdRecibo.nombreRecibo;
						ResquestAuditoria.tipoLinea='5';
						ResquestAuditoria.perfil='-';
                    });
                } else {
                    $scope.listRecibosCorporativos = [];
                    $scope.listRecibosCorporativos.push(response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo);
                    $scope.selectedIdRecibo = $scope.listRecibosCorporativos[0];
                    idReciboDefault = $scope.listRecibosCorporativos[0].idRecibo;
					ResquestAuditoria.servicio=$scope.selectedIdRecibo.nombreRecibo;
					ResquestAuditoria.tipoLinea='5';
					ResquestAuditoria.perfil='-';

                }
                obtenerServicosMovilesxReciboyCuenta(idReciboDefault, idCuentaRecibos);

            } else {
                $("#movil").show();
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerListadoMovilCorporativoRecibo - "+mensaje;
				auditoria();
                allSuccess = false;
            }

        }, function(error) {

        });
    }

    $scope.traerServicio = function() {


        aniamteBox('.box');
		ResquestAuditoria.servicio=$scope.selectedIdRecibo.nombreRecibo;
		ResquestAuditoria.tipoLinea='5';
		ResquestAuditoria.perfil='-';

		
        var idReciboTrearServicio;
        var idCuentaTrearServicio;

        $scope.idReciboPrincipal = $scope.selectedIdRecibo.idRecibo;
        $scope.idCuentaPrincipal = $scope.selectedIdCuenta.idCuenta;
        idReciboTrearServicio = $scope.idReciboPrincipal;
        idCuentaTrearServicio = $scope.idCuentaPrincipal;

        obtenerServicosMovilesxReciboyCuenta(idReciboTrearServicio, idCuentaTrearServicio);
    }


    function obtenerServicosMovilesxReciboyCuenta(idRecibo, idCuenta) {

        var requestDatosServiciosMoviles = {
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
        }
        requestDatosServiciosMoviles.categoria = categoriaMovil;
        requestDatosServiciosMoviles.tipoLinea = tipoLinea;
        requestDatosServiciosMoviles.tipoCliente = tipoCliente;
        requestDatosServiciosMoviles.tipoPermiso = tipoPermiso;
        requestDatosServiciosMoviles.idCuenta = idCuenta;
        requestDatosServiciosMoviles.idRecibo = idRecibo;
        requestDatosServiciosMoviles.pagina = pagina;
        requestDatosServiciosMoviles.cantResultadosPagina = cantResultadosPagina;
        requestDatosServiciosMoviles.productoPrincipalXidRecibo = productoPrincipalXidRecibo;
        requestDatosServiciosMoviles.titularidadServicio = titularidadServicio;

        dataMoviles = $httpParamSerializer({ requestJson: angular.toJson(requestDatosServiciosMoviles) });
        serviceHomeMoviles.getobtenerServiciosMoviles(dataMoviles).then(function(response) {

            $scope.listServiciosMoviles = response.data.obtenerServiciosResponse.listadoProductosServicios;
            $scope.errorFuncional = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;

            if ($scope.errorFuncional == 0) {
                if (Array.isArray($scope.listServiciosMoviles)) {
                    angular.forEach($scope.listServiciosMoviles, function(val, key) {
                        $scope.nombreAliasaMostrar = $scope.listServiciosMoviles[0].ProductoServicioResponse.nombreAlias;
                        $scope.servicio = $scope.listServiciosMoviles[0].ProductoServicioResponse;
                        $scope.idServicio = $scope.listServiciosMoviles[0].ProductoServicioResponse.idProductoServicio;
                        $scope.idCuenta = $scope.listServiciosMoviles[0].ProductoServicioResponse.idCuenta;
                        $scope.idRecibo = $scope.listServiciosMoviles[0].ProductoServicioResponse.idRecibo;
                        $scope.tipoCliente = $scope.listServiciosMoviles[0].ProductoServicioResponse.tipoCliente;
						ResquestAuditoria.servicio=$scope.listServiciosMoviles[0].ProductoServicioResponse.nombre;
						ResquestAuditoria.tipoLinea=$scope.listServiciosMoviles[0].ProductoServicioResponse.tipoLinea;
						ResquestAuditoria.perfil=$scope.listServiciosMoviles[0].ProductoServicioResponse.tipoPermiso;

                    });
                    getObtenerConsumoGeneralMovilWS($scope.idServicio, $scope.idCuenta, $scope.idRecibo, $scope.tipoCliente);
                    actualizarProductoPrincipalSesion($scope.listServiciosMoviles[0]);
                    obtenerEstadoServicio();
                } else {
                    $scope.listServiciosMoviles = [];
                    $scope.listServiciosMoviles.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                    $scope.nombreAliasaMostrar = $scope.listServiciosMoviles[0].ProductoServicioResponse.nombreAlias;
                    $scope.servicio = $scope.listServiciosMoviles[0].ProductoServicioResponse;
                    $scope.idServicio = $scope.listServiciosMoviles[0].ProductoServicioResponse.idProductoServicio;
                    $scope.idCuenta = $scope.listServiciosMoviles[0].ProductoServicioResponse.idCuenta;
                    $scope.idRecibo = $scope.listServiciosMoviles[0].ProductoServicioResponse.idRecibo;
                    $scope.tipoCliente = $scope.listServiciosMoviles[0].ProductoServicioResponse.tipoCliente;
					ResquestAuditoria.servicio=$scope.listServiciosMoviles[0].ProductoServicioResponse.nombre;
					ResquestAuditoria.tipoLinea=$scope.listServiciosMoviles[0].ProductoServicioResponse.tipoLinea;
					ResquestAuditoria.perfil=$scope.listServiciosMoviles[0].ProductoServicioResponse.tipoPermiso;
                    getObtenerConsumoGeneralMovilWS($scope.idServicio, $scope.idCuenta, $scope.idRecibo, $scope.tipoCliente);
                    actualizarProductoPrincipalSesion($scope.listServiciosMoviles[0]);
                    obtenerEstadoServicio();
                }
				
					ResquestAuditoria.estado = "SUCCESS";
					ResquestAuditoria.descripcionoperacion = "-";
					auditoria();
            } else {
                $("#movil").show();
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerServicios - "+mensaje;
				auditoria();
                allSuccess = false;
            }


        }, function(error) {

        });

    };

    function obtenerEstadoServicio() {

        var idProductoServicioCoor = $scope.idServicio;


        var requestEstadoServicio = {
            categoria: null,
            idProductoServicio: null,
            idDireccion: null,
            idCuenta: null,
            idRecibo: null,
            idLinea: null
        }
        requestEstadoServicio.categoria = categoriaMovil
        requestEstadoServicio.idProductoServicio = idProductoServicioCoor;

        dataEstado = $httpParamSerializer({ requestJson: angular.toJson(requestEstadoServicio) });
        serviceHomeMoviles.getobtenerEstadoServicio(dataEstado).then(function(response) {

            $scope.mostrar = response.data;
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

        }, function(error) {

        });
    }

    function getObtenerConsumoGeneralMovilWS(idServicio, idCuenta, idRecibo, tipoCliente) {

        var idProdServ = idServicio
        var idC = idCuenta
        var idR = idRecibo

        var obtenerConsumoGeneralMovilRequest = {
            idProductoServicio: null,
            idCuenta: null,
            idRecibo: null,
            tipoCliente: null,
            tipoBolsasConsulta: null
        }

        obtenerConsumoGeneralMovilRequest.idProductoServicio = idProdServ;
        obtenerConsumoGeneralMovilRequest.idCuenta = idC;
        obtenerConsumoGeneralMovilRequest.idRecibo = idR;
        obtenerConsumoGeneralMovilRequest.tipoCliente = tipoCliente;
        obtenerConsumoGeneralMovilRequest.tipoBolsasConsulta = tipoconsultaBolsa;

        data = $httpParamSerializer({ requestJson: angular.toJson(obtenerConsumoGeneralMovilRequest) });

        serviceHomeMoviles.getObtenerConsumoGeneralMovilWS(data).then(function(response) {
            
            $scope.consumosMovil = response.data.obtenerConsumoGeneralMovilResponse;
            $scope.consumosMovilFlag = $scope.consumosMovil.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId  = $scope.consumosMovil.defaultServiceResponse.idTransaccional;
            var mensaje = $scope.consumosMovil.defaultServiceResponse.mensaje;

            if ($scope.consumosMovilFlag == 0) {

                var consumoObjetoList = [];

                var consumosMovilesResponse = response.data.obtenerConsumoGeneralMovilResponse;

                if (consumosMovilesResponse.internet == "" && consumosMovilesResponse.llamadas == "" && consumosMovilesResponse.smsyMmms == "") {
                    $(".boxConsumos").hide();
                } else {
                    $(".boxConsumos").show();
                }

                var consumosContador = 0;

                var consumoObjeto = {
                    imagen: null,
                    color: null,
                    saldoRestante: null,
                    fechaVencimiento: null,
                    tipoPaquete: null,
                    unidad: null,
                    porcentaje: null,
                    show: null
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
                            consumoInternet.color = "#f6a244";
                            consumoInternet.tipoPaquete = bolsaPrincipalInternet.nombreBolsa;
                            consumoInternet.saldoRestante = (bolsaPrincipalInternet.bolsaTotal - bolsaPrincipalInternet.bolsaUtilizada).toFixed(0);;
                            consumoInternet.fechaVencimiento = bolsaPrincipalInternet.fechaVencimiento;
                            consumoInternet.unidad = bolsaPrincipalInternet.unidadConsumo;
                            consumoInternet.porcentaje = (100 * bolsaPrincipalInternet.bolsaUtilizada) / bolsaPrincipalInternet.bolsaTotal;
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
                                    consumoInternet.color = "#f6a244";
                                    consumoInternet.tipoPaquete = bolsaPrincipalInternet.nombre;
                                    consumoInternet.saldoRestante = (bolsaPrincipalInternet.total - bolsaPrincipalInternet.utilizado).toFixed(0);
                                    consumoInternet.fechaVencimiento = bolsaPrincipalInternet.fechaVencimiento;
                                    consumoInternet.unidad = bolsaPrincipalInternet.unidadConsumo;
                                    consumoInternet.porcentaje = (100 * bolsaPrincipalInternet.utilizado) / bolsaPrincipalInternet.total;
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
                                    consumoInternet.color = "#f6a244";
                                    consumoInternet.tipoPaquete = bolsaPrincipalInternet.nombre;
                                    consumoInternet.saldoRestante = (bolsaPrincipalInternet.total - bolsaPrincipalInternet.utilizado).toFixed(0);
                                    consumoInternet.fechaVencimiento = bolsaPrincipalInternet.fechaVencimiento;
                                    consumoInternet.unidad = bolsaPrincipalInternet.unidadConsumo;
                                    consumoInternet.porcentaje = (100 * bolsaPrincipalInternet.utilizado) / bolsaPrincipalInternet.total;
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
                                    consumoInternet.color = "#f6a244";
                                    consumoInternet.tipoPaquete = bolsaPrincipalInternet.nombre;
                                    consumoInternet.saldoRestante = (bolsaPrincipalInternet.total - bolsaPrincipalInternet.utilizado).toFixed(0);
                                    consumoInternet.fechaVencimiento = bolsaPrincipalInternet.fechaVencimiento;
                                    consumoInternet.unidad = bolsaPrincipalInternet.unidadConsumo;
                                    consumoInternet.porcentaje = (100 * bolsaPrincipalInternet.utilizado) / bolsaPrincipalInternet.total;
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
                                    consumoLlamadas.color = "#d52b1e";
                                    consumoLlamadas.tipoPaquete = bolsaPrincipalLlamadas.nombreBolsa;
                                    if (bolsaPrincipalLlamadas.unidadConsumo == "SOLES") {
                                        consumoLlamadas.saldoRestante = (bolsaPrincipalLlamadas.bolsaTotal - bolsaPrincipalLlamadas.bolsaUtilizada).toFixed(2);
                                    } else {
                                        consumoLlamadas.saldoRestante = (bolsaPrincipalLlamadas.bolsaTotal - bolsaPrincipalLlamadas.bolsaUtilizada).toFixed(0);
                                    }
                                    consumoLlamadas.fechaVencimiento = bolsaPrincipalLlamadas.fechaVencimiento;
                                    consumoLlamadas.unidad = bolsaPrincipalLlamadas.unidadConsumo;
                                    consumoLlamadas.porcentaje = (100 * bolsaPrincipalLlamadas.bolsaUtilizada) / bolsaPrincipalLlamadas.bolsaTotal;
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
                                        consumoLlamadas.color = "#d52b1e";
                                        consumoLlamadas.tipoPaquete = bolsaPrincipalLlamadas.nombre;
                                        if (bolsaPrincipalLlamadas.unidadConsumo == "SOLES") {
                                            consumoLlamadas.saldoRestante = (bolsaPrincipalLlamadas.total - bolsaPrincipalLlamadas.utilizado).toFixed(2);
                                        } else {
                                            consumoLlamadas.saldoRestante = (bolsaPrincipalLlamadas.total - bolsaPrincipalLlamadas.utilizado).toFixed(0);
                                        }
                                        consumoLlamadas.saldoRestante = bolsaPrincipalLlamadas.total - bolsaPrincipalLlamadas.utilizado;
                                        consumoLlamadas.fechaVencimiento = bolsaPrincipalLlamadas.fechaVencimiento;
                                        consumoLlamadas.unidad = bolsaPrincipalLlamadas.unidadConsumo;
                                        consumoLlamadas.porcentaje = (100 * bolsaPrincipalLlamadas.utilizado) / bolsaPrincipalLlamadas.total;
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
                                        consumoLlamadas.color = "#d52b1e";
                                        consumoLlamadas.tipoPaquete = bolsaPrincipalLlamadas.nombre;
                                        if (bolsaPrincipalLlamadas.unidadConsumo == "SOLES") {
                                            consumoLlamadas.saldoRestante = (bolsaPrincipalLlamadas.total - bolsaPrincipalLlamadas.utilizado).toFixed(2);
                                        } else {
                                            consumoLlamadas.saldoRestante = (bolsaPrincipalLlamadas.total - bolsaPrincipalLlamadas.utilizado).toFixed(0);
                                        }
                                        consumoLlamadas.fechaVencimiento = bolsaPrincipalLlamadas.fechaVencimiento;
                                        consumoLlamadas.unidad = bolsaPrincipalLlamadas.unidadConsumo;
                                        consumoLlamadas.porcentaje = (100 * bolsaPrincipalLlamadas.utilizado) / bolsaPrincipalLlamadas.total;
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
                                        consumoLlamadas.color = "#d52b1e";
                                        consumoLlamadas.tipoPaquete = bolsaPrincipalLlamadas.nombre;
                                        if (bolsaPrincipalLlamadas.unidadConsumo == "SOLES") {
                                            consumoLlamadas.saldoRestante = (bolsaPrincipalLlamadas.total - bolsaPrincipalLlamadas.utilizado).toFixed(2);
                                        } else {
                                            consumoLlamadas.saldoRestante = (bolsaPrincipalLlamadas.total - bolsaPrincipalLlamadas.utilizado).toFixed(0);
                                        }
                                        consumoLlamadas.fechaVencimiento = bolsaPrincipalLlamadas.fechaVencimiento;
                                        consumoLlamadas.unidad = bolsaPrincipalLlamadas.unidadConsumo;
                                        consumoLlamadas.porcentaje = (100 * bolsaPrincipalLlamadas.utilizado) / bolsaPrincipalLlamadas.total;
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
                                    consumoSms.color = "#2095A8";
                                    consumoSms.tipoPaquete = bolsaPrincipalSms.nombre;
                                    consumoSms.saldoRestante = bolsaPrincipalSms.total - bolsaPrincipalSms.utilizado;
                                    consumoSms.fechaVencimiento = bolsaPrincipalSms.fechaVencimiento;
                                    consumoSms.unidad = bolsaPrincipalSms.unidadConsumo;
                                    consumoSms.porcentaje = (100 * bolsaPrincipalSms.utilizado) / bolsaPrincipalSms.total;
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
                                        consumoSms.color = "#2095A8";
                                        consumoSms.tipoPaquete = bolsaPrincipalSms.nombre;
                                        consumoSms.saldoRestante = bolsaPrincipalSms.total - bolsaPrincipalSms.utilizado;
                                        consumoSms.fechaVencimiento = bolsaPrincipalSms.fechaVencimiento;
                                        consumoSms.unidad = bolsaPrincipalSms.unidadConsumo;
                                        consumoSms.porcentaje = (100 * bolsaPrincipalSms.utilizado) / bolsaPrincipalSms.total;
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
                                        consumoSms.color = "#2095A8";
                                        consumoSms.tipoPaquete = bolsaPrincipalSms.nombre;
                                        consumoSms.saldoRestante = bolsaPrincipalSms.total - bolsaPrincipalSms.utilizado;
                                        consumoSms.fechaVencimiento = bolsaPrincipalSms.fechaVencimiento;
                                        consumoSms.unidad = bolsaPrincipalSms.unidadConsumo;
                                        consumoSms.porcentaje = (100 * bolsaPrincipalSms.utilizado) / bolsaPrincipalSms.total;
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
                                        consumoSms.color = "#2095A8";
                                        consumoSms.tipoPaquete = bolsaPrincipalSms.nombre;
                                        consumoSms.saldoRestante = bolsaPrincipalSms.total - bolsaPrincipalSms.utilizado;
                                        consumoSms.fechaVencimiento = bolsaPrincipalSms.fechaVencimiento;
                                        consumoSms.unidad = bolsaPrincipalSms.unidadConsumo;
                                        consumoSms.porcentaje = (100 * bolsaPrincipalSms.utilizado) / bolsaPrincipalSms.total;
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
                                    consumoMMS.color = "#2095A8";
                                    consumoMMS.tipoPaquete = bolsaPrincipalMMS.nombre;
                                    consumoMMS.saldoRestante = bolsaPrincipalMMS.total - bolsaPrincipalMMS.utilizado;
                                    consumoMMS.fechaVencimiento = bolsaPrincipalMMS.fechaVencimiento;
                                    consumoMMS.unidad = bolsaPrincipalMMS.unidadConsumo;
                                    consumoMMS.porcentaje = (100 * bolsaPrincipalMMS.utilizado) / bolsaPrincipalMMS.total;
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
                                        consumoMMS.color = "#2095A8";
                                        consumoMMS.tipoPaquete = bolsaPrincipalMMS.nombre;
                                        consumoMMS.saldoRestante = bolsaPrincipalMMS.total - bolsaPrincipalMMS.utilizado;
                                        consumoMMS.fechaVencimiento = bolsaPrincipalMMS.fechaVencimiento;
                                        consumoMMS.unidad = bolsaPrincipalMMS.unidadConsumo;
                                        consumoMMS.porcentaje = (100 * bolsaPrincipalMMS.utilizado) / bolsaPrincipalMMS.total;
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

                    $(this).css({ 'background': consumoObjetoList[i].color });
                    $(this).animate({ width: consumoObjetoList[i].porcentaje + '%' }, 350);

                });

            } else {
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerConsumoGeneralMovil - "+mensaje;
				auditoria();

            }

            if (allSuccess == true) {
					ResquestAuditoria.estado = "SUCCESS";
					ResquestAuditoria.descripcionoperacion = "-";
					auditoria();
            }

            if (firstRender) {
                $("#movil").show();
                aniamteBox(".box");
                firstRender = false;
            }


        });
    };

    function actualizarProductoPrincipalSesion(objServico) {
        var appProductoPrincipal = objServico.ProductoServicioResponse.idProductoServicio;
        var appNombreProductoPrincipal = objServico.ProductoServicioResponse.nombreAlias;
        var appIdCuenta = objServico.ProductoServicioResponse.idCuenta;
        var appIdRecibo = objServico.ProductoServicioResponse.idRecibo;
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

        serviceHomeMoviles.actualizarProductoPrincipalSesion(data).then(function(response) {

        });


    };

    function auditoria() {

        var Resquest = $httpParamSerializer({ requestJson: angular.toJson(ResquestAuditoria) });
        serviceHomeMoviles.enviarAuditoria(Resquest).then(function(response) {

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
    };

    $scope.saldosConsumos = function(objServico) {

        window.location.replace("/wps/myportal/miclaro/corporativo/consultas/saldosyconsumos/movil");

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Home Servicios',
            'action': 'Móvil',
            'label': 'Botón: Consumos generales'
        });
    };

    $scope.pagarRecibo = function(objServico) {

        window.location.replace("/wps/myportal/miclaro/corporativo/recibos/movil");

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Home Servicios',
            'action': 'Móvil',
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

        getObtenerConsumoGeneralMovilWS($scope.idServicio, $scope.idCuenta, $scope.idRecibo, $scope.tipoCliente);


    };

    $scope.recargarEstadoServicio = function() {

        $('.serviciosBox').hide();
        $('.serviciosBox').fadeIn(1100);

        obtenerEstadoServicio();

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
            $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 200);
        });

    }

    $scope.switchChange = function() {



        window.location.replace("/wps/myportal/miclaro/consumer/home/movil");

    }

    $(".publicidad").load("/wps/wcm/myconnect/mi%20claro%20content%20library/mi%20claro/banners/home%20movil");

});

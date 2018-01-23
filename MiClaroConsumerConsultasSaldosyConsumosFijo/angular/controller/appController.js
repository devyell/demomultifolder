miClaroApp.controller("MiClaroHomeController", function($scope, $http, $httpParamSerializer, ServiciosFijaService) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    $scope.ay_caramba = WPSConsultarSaldosConsumosFijoConsumer.EXCEPCION5_1;
    $scope.sin_consumos = WPSConsultarSaldosConsumosFijoConsumer.EXCEPCION5_2;
	
    var valorFlagConfirmacion = null;
    var valorFlagConfirmacionMobile = null;
    var allSuccess = true;
    var categoriaFijo = 2;
    var tipoPermiso = 5;
    var titularidadServicio = 7;
    var pagina = 0;
    var cantResultadosPagina = 0;
    var productoPrincipalXidRecibo = false;
    var tipoLinea = 3;
    var tipoCliente = 1;
    var cantPeriodos = 3;
    var chartHorarioNoMobile = '';
    var chartHorarioMobile = '';
    var chartTipoNoMobile = '';
    var chartTipoMobile = '';
    var chartDestinoNoMobile = '';
    var chartDestinoMobile = '';
    $scope.mostrarConsumosFija = true;
    $scope.showUpps = false;
    $scope.periodoFlag = null;
    $scope.rptaExito = null;

		var ResquestAuditoria = {
				operationCode: 'T0005',
				pagina: 'P010',
				transactionId:'',
				estado: '-',
				servicio: '-',
				tipoProducto: 'TELEFONIA',
				tipoLinea: '',
				tipoUsuario: '1',
				perfil: '',
				monto: '',
				descripcionoperacion: '-',
				responseType: '/'
			};
					

    ServiciosFijaService.getObtenerFlagProductoFijo().then(function(response) {

        $scope.flagErrorProductosFijo = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        $scope.flagProductoFijoIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
        $scope.flagServiciosFijo = response.data.comunResponseType.flagProductoFijoSesion;
        $scope.tipoClienteUsuario = response.data.comunResponseType.tipoCliente;
        $scope.tipoLineaUsuario = response.data.comunResponseType.tipoLinea;

        if ($scope.tipoClienteUsuario == 4) {
            $scope.showSwitch = true;
        }

        if ($scope.flagErrorProductosFijo == 0) {
            if ($scope.flagServiciosFijo != "-1") {
                if ($scope.flagServiciosFijo == 1 || $scope.flagServiciosFijo == 3) {
                     angular.element(document).ready(function () {
					$scope.init();
					
                    initSlides();
					 });
                } else {
                    $("#fijo").show();
               
                    allSuccess = false;
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

    $scope.init = function(objServicio) {

        ServiciosFijaService.getObtenerDatosSesion().then(function(response) {

            $scope.datosSesionFlag = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            $scope.datosSesionIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            $scope.servPrincipalMensaje = response.data.comunResponseType.defaultServiceResponse.mensaje;

            if ($scope.datosSesionFlag == 0) {
                getObtenerServiciosFijaWS(response.data);
            } else {
                $scope.showUpps = true;
                $("#fijo").show();
               
                allSuccess = false;
            }

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

        });
    }

    getObtenerServiciosFijaWS = function(objServicio) {

        var osCategoria = objServicio.comunResponseType.categoria;
        var osTipoLinea = objServicio.comunResponseType.tipoLinea;
        var osTipoCliente = objServicio.comunResponseType.tipoClienteProductoPrincipal;
        var osIdProductoServicio = objServicio.comunResponseType.productoPrincipal;
        var osIdCuenta = objServicio.comunResponseType.idCuenta;
        var osIdRecibo = objServicio.comunResponseType.idRecibo;
        var osIdDireccion = objServicio.comunResponseType.idDireccion;

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

        obtenerServiciosRequest.categoria = categoriaFijo;
        obtenerServiciosRequest.tipoLinea = tipoLinea;
        obtenerServiciosRequest.tipoCliente = tipoCliente;
        obtenerServiciosRequest.tipoPermiso = tipoPermiso;
        obtenerServiciosRequest.pagina = pagina;
        obtenerServiciosRequest.cantResultadosPagina = cantResultadosPagina;
        obtenerServiciosRequest.productoPrincipalXidRecibo = productoPrincipalXidRecibo;
        obtenerServiciosRequest.titularidadServicio = titularidadServicio;

        serviciosRequest = $httpParamSerializer({ requestJson: angular.toJson(obtenerServiciosRequest), tipoConsulta: '' });

        ServiciosFijaService.getObtenerServiciosWS(serviciosRequest).then(function(response) {

            $scope.serviciosList = response.data.obtenerServiciosResponse.listadoProductosServicios;
            $scope.errorFuncional = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
			
            var breakEach = true;

            if ($scope.errorFuncional == 0) {
                if (Array.isArray($scope.serviciosList)) {
                    angular.forEach($scope.serviciosList, function(val, key) {
                        if (breakEach) {
                            if (val.ProductoServicioResponse.idProductoServicio == objServicio.comunResponseType.productoPrincipal) {
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
                    $('#selectServicio').css({ display: 'none' });
                    $('#textox').css({ background: 'none' });
                }

                getObtenerDatosAdicionalesFijoWS();
                $scope.getObtenerPeriodosFacturacionWS();
                actualizarProductoPrincipalSesion($scope.servicio);
                $("#textox").html($scope.servicio.ProductoServicioResponse.nombreAlias);

            } else {
                $scope.showUpps = true;
                $("#fijo").show();
           		
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerServicios - "+mensaje;
				auditoria();

                allSuccess = false;
            }
        });

    };

    getObtenerDatosAdicionalesFijoWS = function() {

        var objServicio = $scope.servicio;
        var idProdServ = objServicio.ProductoServicioResponse.idProductoServicio;
        var idCat = objServicio.ProductoServicioResponse.categoria;
        var idDir = objServicio.ProductoServicioResponse.idDireccion;
        var idLin = objServicio.ProductoServicioResponse.idLinea;

        var obtenerDatosAdicionalesFijoRequest = {
            "idProductoServicio": null,
            "categoria": null,
            "idDireccion": null,
            "idLinea": null

        }

        obtenerDatosAdicionalesFijoRequest.idProductoServicio = idProdServ;
        obtenerDatosAdicionalesFijoRequest.categoria = idCat;
        obtenerDatosAdicionalesFijoRequest.idDireccion = idDir;
        obtenerDatosAdicionalesFijoRequest.idLinea = idLin;

        serviciosRequest = $httpParamSerializer({ requestJson: angular.toJson(obtenerDatosAdicionalesFijoRequest) });
        ServiciosFijaService.getObtenerDatosAdicionalesFijoWS(serviciosRequest).then(function(response) {

            $scope.datosAdicionales = response.data.obtenerDatosAdicionalesServicioFijoResponse;
			ResquestAuditoria.transactionId = response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.idTransaccional; 
            var mensaje = $scope.datosAdicionales.defaultServiceResponse.mensaje;

            if ($scope.datosAdicionales.defaultServiceResponse.idRespuesta == 1) {
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerServicios - "+mensaje;
				auditoria();
                allSuccess = false;
            }
        });

    }

    $scope.getObtenerPeriodosFacturacionWS = function() {

        var objServicio = $scope.servicio;
        var idCat = objServicio.ProductoServicioResponse.categoria;
        var idProdServ = objServicio.ProductoServicioResponse.idProductoServicio;
        var idDir = objServicio.ProductoServicioResponse.idDireccion;
        var idLin = objServicio.ProductoServicioResponse.idLinea;
        var idCuen = objServicio.ProductoServicioResponse.idCuenta;
        var idRec = objServicio.ProductoServicioResponse.idRecibo;

        var obtenerPeriodosFacturacionRequest = {
            "categoria": null,
            "idProductoServicio": null,
            "idDireccion": null,
            "idLinea": null,
            "idCuenta": null,
            "idRecibo": null,
            "cantPeriodos": null,
        }
        obtenerPeriodosFacturacionRequest.categoria = idCat;
        obtenerPeriodosFacturacionRequest.idProductoServicio = idProdServ;
        obtenerPeriodosFacturacionRequest.idDireccion = idDir;
        obtenerPeriodosFacturacionRequest.idLinea = idLin;
        obtenerPeriodosFacturacionRequest.cantPeriodos = cantPeriodos;

        serviciosRequest = $httpParamSerializer({ requestJson: angular.toJson(obtenerPeriodosFacturacionRequest) });
        ServiciosFijaService.getObtenerPeriodosFacturacionWS(serviciosRequest).then(function(response) {

            var listaPeriodos = response.data.obtenerPeriodosFacturacionResponse.listado;
            $scope.periodoFlag = response.data.obtenerPeriodosFacturacionResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId  = response.data.obtenerPeriodosFacturacionResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerPeriodosFacturacionResponse.defaultServiceResponse.mensaje;

            if ($scope.periodoFlag == 0) {
                if (angular.isArray(listaPeriodos)) {
                    $scope.listaPeriodosFacturacion = listaPeriodos
                    $scope.selectedPeriodo = $scope.listaPeriodosFacturacion[0];
                } else {
                    $scope.listaPeriodosFacturacion = [];
                    $scope.listaPeriodosFacturacion.push(listaPeriodos);
                    $scope.selectedPeriodo = $scope.listaPeriodosFacturacion[0];
                }


                var wps_apple = false;
                var userAgent = navigator.userAgent || navigator.vendor || window.opera;

                if (/iPad|Mac|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                    wps_apple = true;
                }

                if (wps_apple) {
                    $scope.getObtenerConsumoGeneralFijaWS();
                    $scope.getObtenerConsumoGeneralFijaWS();
                    $scope.getObtenerConsumoGeneralFijaWS();
                } else {
                    $scope.getObtenerConsumoGeneralFijaWS();
                }

            } else {
                $("#fijo").show();
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerServicios - "+mensaje;
				auditoria();
                allSuccess = false;
            }
        });
    }

    var chartServiciosPH = null;
    var chartServiciosPT = null;
    var chartServiciosPD = null;

    var countError = 0;
    $scope.getObtenerConsumoGeneralFijaWS = function() {

        var objPeriodo = $scope.selectedPeriodo;
        var objServicio = $scope.servicio;
        var idPer = objPeriodo.idPeriodo;
        var idDir = objServicio.ProductoServicioResponse.idDireccion;
        var idLin = objServicio.ProductoServicioResponse.idLinea;
        var idProdServ = objServicio.ProductoServicioResponse.idProductoServicio;


        var obtenerConsumeGeneralFijaRequest = {
            "idPeriodo": null,
            "idDireccion": null,
            "idLinea": null,
            "idProductoServicio": null,
            "criterio": 0
        }

        obtenerConsumeGeneralFijaRequest.idPeriodo = idPer;
        obtenerConsumeGeneralFijaRequest.idDireccion = idDir;
        obtenerConsumeGeneralFijaRequest.idProductoServicio = idProdServ;
        obtenerConsumeGeneralFijaRequest.idLinea = idLin;

        data = $httpParamSerializer({ requestJson: angular.toJson(obtenerConsumeGeneralFijaRequest) });

        ServiciosFijaService.getObtenerConsumoGeneralFijaWS(data).then(function(response) {

            $scope.rptaExito = response.data.obtenerConsumoGeneralFijaResponse.defaultServiceResponse.idRespuesta;
            ResquestAuditoria.transactionId  = response.data.obtenerConsumoGeneralFijaResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerConsumoGeneralFijaResponse.defaultServiceResponse.mensaje;

            var consumosGen = response.data.obtenerConsumoGeneralFijaResponse;

            var arrayHorario = [];
            var arrayTipo = [];
            var arrayDestino = [];

            if ($scope.rptaExito == 0) {

                var totalConsumido = parseInt(response.data.obtenerConsumoGeneralFijaResponse.informacionComplementaria.totalMinutosConsumidos);
                    
                if (totalConsumido != 0) {
                    $scope.mostrarConsumosFija = true;
                    $scope.informacionComplementaria = response.data.obtenerConsumoGeneralFijaResponse.informacionComplementaria;
                    
                    var numerosRecurrentes = ($scope.informacionComplementaria.numerosRecurrentes).split(',');
                    $scope.numerRecurrente1 = numerosRecurrentes[0];
                    $scope.numerRecurrente2 = numerosRecurrentes[1];

                    $scope.llamadasDiurno = $scope.informacionComplementaria.cantLlamadasHorarioDiurno;
                    $scope.llamadasNocturno = $scope.informacionComplementaria.cantLlamadasHorarioNocturno;

                    ordenarImagenHorario($scope.llamadasDiurno, $scope.llamadasNocturno);

                    $scope.llamadasFijo = $scope.informacionComplementaria.cantLlamadasfijos;
                    $scope.llamadasMovil = $scope.informacionComplementaria.cantLlamadasMoviles;
                    ordernarImagenTipo($scope.llamadasFijo, $scope.llamadasMovil);

                    $scope.totalDias = Math.floor($scope.informacionComplementaria.totalMinutosConsumidos / 1440);
                    $scope.totalMinutos = $scope.informacionComplementaria.totalMinutosConsumidos % 1440;
                    $scope.porHorario = response.data.obtenerConsumoGeneralFijaResponse.porHorario;

                    if ($scope.porHorario != '' && $scope.porHorario != undefined) {

                        $scope.etiquetaNormal = $scope.porHorario.minutosHorarioNormal.etiqueta;
                        $scope.cantidadNormal = $scope.porHorario.minutosHorarioNormal.cantidadConsumida;
                        arrayHorario.push($scope.cantidadNormal);
                        $scope.etiquetaNocturno = $scope.porHorario.minutosHorarioNocturno.etiqueta;
                        $scope.cantidadNocturno = $scope.porHorario.minutosHorarioNocturno.cantidadConsumida;
                        arrayHorario.push($scope.cantidadNocturno);
                        $scope.totalConsumidosHorario = parseInt($scope.cantidadNocturno) + parseInt($scope.cantidadNormal);
                        if ($scope.totalConsumidosHorario == 0) {
                            arrayHorarioCero = [];
                            var dataCero = 1;
                            arrayHorarioCero.push(dataCero);
                            renderizar(arrayHorarioCero, "horarioNoMobile", 0);
                            renderizar(arrayHorarioCero, "horarioMobile", 0);
                        } else {
                            renderizar(arrayHorario, "horarioNoMobile", 1);
                            renderizar(arrayHorario, "horarioMobile", 1);
                        }
                    }

                    $scope.porTipo = response.data.obtenerConsumoGeneralFijaResponse.porTipo;
                    if ($scope.porTipo != '' && $scope.porTipo != undefined) {
                        $scope.etiquetaFijo = response.data.obtenerConsumoGeneralFijaResponse.porTipo.minutosFijo.etiqueta;
                        $scope.porTipoMinutosFijo = response.data.obtenerConsumoGeneralFijaResponse.porTipo.minutosFijo.cantidadConsumida;
                        arrayTipo.push($scope.porTipoMinutosFijo);
                        $scope.etiquetaCelular = response.data.obtenerConsumoGeneralFijaResponse.porTipo.minutosCelular.etiqueta;
                        $scope.porTipoMinutosCelular = response.data.obtenerConsumoGeneralFijaResponse.porTipo.minutosCelular.cantidadConsumida;
                        arrayTipo.push($scope.porTipoMinutosCelular);
                        $scope.etiquetaOtros = response.data.obtenerConsumoGeneralFijaResponse.porTipo.minutosOtros.etiqueta;
                        $scope.porTipoMinutosOtros = response.data.obtenerConsumoGeneralFijaResponse.porTipo.minutosOtros.cantidadConsumida;
                        arrayTipo.push($scope.porTipoMinutosOtros);
                        $scope.totalConsumoTipo = parseInt($scope.porTipoMinutosFijo) + parseInt($scope.porTipoMinutosCelular) + parseInt($scope.porTipoMinutosOtros);
                        if ($scope.totalConsumoTipo == 0) {
                            var arrayTipoCero = [];
                            var dataCeroTipo = 1;
                            arrayTipoCero.push(dataCeroTipo);
                            renderizar(arrayTipoCero, "tipoNoMobile", 0);
                            renderizar(arrayTipoCero, "tipoMobile", 0);
                        } else {
                            renderizar(arrayTipo, "tipoNoMobile", 1);
                            renderizar(arrayTipo, "tipoMobile", 1);
                        }
                    }

                    $scope.porDestino = response.data.obtenerConsumoGeneralFijaResponse.porDestino;
                    if ($scope.porDestino != '' && $scope.porDestino != undefined) {
                        $scope.etiquetaConsumoLocal = $scope.porDestino.consumoLocal.etiqueta;
                        $scope.cantidadConsumoLocal = $scope.porDestino.consumoLocal.cantidadConsumida;
                        arrayDestino.push($scope.cantidadConsumoLocal);
                        $scope.etiquetaConsumoNacional = $scope.porDestino.consumoNacional.etiqueta;
                        $scope.cantidadConsumoNacional = $scope.porDestino.consumoNacional.cantidadConsumida;
                        arrayDestino.push($scope.cantidadConsumoNacional);
                        $scope.etiquetaConsumoInternacional = $scope.porDestino.consumoInternacional.etiqueta;
                        $scope.cantidadConsumoInternacional = $scope.porDestino.consumoInternacional.cantidadConsumida;
                        arrayDestino.push($scope.cantidadConsumoInternacional);
                        $scope.totalCantidadDestino = parseInt($scope.cantidadConsumoLocal) + parseInt($scope.cantidadConsumoNacional) + parseInt($scope.cantidadConsumoInternacional);
                        if ($scope.totalCantidadDestino == 0) {
                            var arrayDestinoCero = [];
                            var dataCeroDestino = 1;
                            arrayDestinoCero.push(dataCeroDestino);
                            renderizar(arrayDestinoCero, "destinoNoMobile", 0);
                            renderizar(arrayDestinoCero, "destinoMobile", 0);
                        } else {
                            renderizar(arrayDestino, "destinoNoMobile", 1);
                            renderizar(arrayDestino, "destinoMobile", 1);

                        }
                    }
                } else {
                    $scope.sinConsumosFijos = true;
                    $scope.mostrarConsumosFija = false;
                }

            } else {
					ResquestAuditoria.estado = "ERROR";
					ResquestAuditoria.descripcionoperacion = "obtenerServicios - "+mensaje;
					auditoria();
					allSuccess = false;
            }

            if (allSuccess = true) {
					ResquestAuditoria.estado = "SUCCESS";
					ResquestAuditoria.descripcionoperacion = "-";
					auditoria();
            }

            $("#fijo").show();

        }, function(error) {

        });

    }

    function ordenarImagenHorario(diurno, nocturno) {

        var dia = parseInt(diurno);
        var noche = parseInt(nocturno);

        if (dia == 0 && noche == 0) {
            $scope.imagenMostrarH = "";
            $scope.msgH = "";
        } else if (dia >= noche) {
            $scope.imagenMostrarH = "/wpstheme/miclaro/img/icon-complemento-dia.png";
            $scope.msgH = "diurno";
        } else {
            $scope.imagenMostrarH = "/wpstheme/miclaro/img/icon-complemento-noche.png";
            $scope.msgH = "nocturno";
        }
    }

    function ordernarImagenTipo(fijo, movil, otros) {

        var miFijo = parseInt(fijo);
        var miMovil = parseInt(movil);

        if (miFijo == 0 && miMovil == 0) {
            $scope.imagenMostrarT = "";
            $scope.msgT = "";
        } else if (miFijo > miMovil) {
            $scope.imagenMostrarT = "/wpstheme/miclaro/img/icon-complemento-llamada.png";
            $scope.msgT = "fijos";
        } else if (miMovil >= miFijo) {
            $scope.imagenMostrarT = "/wpstheme/miclaro/img/icon-complemento-movil.png";
            $scope.msgT = "moviles";
        }
    }

    var count = 0;

    function renderizar(arrayRender, tipoDispositivo, indicador) {
		
        var $this = $('#' + tipoDispositivo);
        var $chart = $this.find(".canvas");
        var $opts = { responsive: true, title: { display: false }, legend: { display: false }, cutoutPercentage: 75};
		
        var $ttext = [];
        var $tdata = [];
        $tdata = arrayRender;
        var $tcolor = [];
        var $total = 0;
        $this.find("li").each(function($j, el) {
            var $item = $(this);
            $ttext.push($item.find("span").css({ color: $item.attr("data-color") }).text());
            $tcolor.push($item.attr("data-color"));
            $item.find("span.square").css({ background: $item.attr("data-color") });
            $total = $total + parseInt($item.attr("data-value"));
        });

        if (indicador == 0) {
            Chart.defaults.global.legend.display = false;
            Chart.defaults.global.tooltips.enabled = false;
            var $data = { labels: $ttext, datasets: [{ data: $tdata, backgroundColor: [" #cccccc"], hoverBorderColor: "transparent" }] };
        } else {
            Chart.defaults.global.legend.display = true;
            Chart.defaults.global.tooltips.enabled = true;
            var $data = { labels: $ttext, datasets: [{ data: $tdata, backgroundColor: $tcolor, hoverBorderColor: "transparent" }] };
        }

        if (chartHorarioNoMobile != '' && tipoDispositivo === "horarioNoMobile") {
            chartHorarioNoMobile.destroy();
        }
        if (chartTipoNoMobile != '' && tipoDispositivo === "tipoNoMobile") {
            chartTipoNoMobile.destroy();
        }
        if (chartDestinoNoMobile != '' && tipoDispositivo === "destinoNoMobile") {
            chartDestinoNoMobile.destroy();
        }
        if (chartHorarioMobile != '' && tipoDispositivo === "horarioMobile") {
            chartHorarioMobile.destroy();
        }
        if (chartTipoMobile != '' && tipoDispositivo === "tipoMobile") {
            chartTipoMobile.destroy();
        }
        if (chartDestinoMobile != '' && tipoDispositivo === "destinoMobile") {
            chartDestinoMobile.destroy();
        }

        if (tipoDispositivo === "horarioNoMobile") {

            chartHorarioNoMobile = new Chart($chart, { responsive: true, type: 'doughnut', data: $data, options: $opts });

        } else if (tipoDispositivo === "tipoNoMobile") {

            chartTipoNoMobile = new Chart($chart, { responsive: true, type: 'doughnut', data: $data, options: $opts });

        } else if (tipoDispositivo === "destinoNoMobile") {

            chartDestinoNoMobile = new Chart($chart, { responsive: true, type: 'doughnut', data: $data, options: $opts });

        } else if (tipoDispositivo === "horarioMobile") {
            chartHorarioMobile = new Chart($chart, { responsive: true, type: 'doughnut', data: $data, options: $opts });

        } else if (tipoDispositivo === "tipoMobile") {
            chartTipoMobile = new Chart($chart, { responsive: true, type: 'doughnut', data: $data, options: $opts });

        } else if (tipoDispositivo === "destinoMobile") {
            chartDestinoMobile = new Chart($chart, { responsive: true, type: 'doughnut', data: $data, options: $opts });

        }
    };

    $scope.refreshPeriodo = function() {

        $scope.getObtenerPeriodosFacturacionWS();

        var $time = 0;
        var $tpos = 0;
        $('.periodoBox').each(function(ix, el) {
            var $tmp = $(this);
            var $pos = $(this).offset().top;

            if ($tpos != $pos) {
                $tpos = $pos;
                $time = $time + 150;
            }
            $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 250);
        });
    }

    $scope.refreshConsumos = function() {

        $scope.sinConsumosFijos = false;
        $scope.rptaExito = null;
        $scope.getObtenerConsumoGeneralFijaWS();

        var $time = 0;
        var $tpos = 0;
        $('.consumosBox').each(function(ix, el) {
            var $tmp = $(this);
            var $pos = $(this).offset().top;

            if ($tpos != $pos) {
                $tpos = $pos;
                $time = $time + 150;
            }
            $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 250);
        });
    }

    $scope.cambioPeriodo = function() {

        $scope.sinConsumosFijos = false;
        $scope.rptaExito = null;
        if ($scope.periodoFlag == 0) {

            $scope.getObtenerConsumoGeneralFijaWS();
        }

        var $time = 0;
        var $tpos = 0;
        $('.consumosBox').each(function(ix, el) {
            var $tmp = $(this);
            var $pos = $(this).offset().top;

            if ($tpos != $pos) {
                $tpos = $pos;
                $time = $time + 150;
            }
            $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 250);
        });

    }


    this.cambioServicio = function() {

        $scope.periodoFlag = null;
        $scope.datosAdicionales = null;
        $scope.rptaExito = null;

        $("#textox").html($scope.servicio.ProductoServicioResponse.nombreAlias);


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

        getObtenerDatosAdicionalesFijoWS();
        $scope.getObtenerPeriodosFacturacionWS();
        actualizarProductoPrincipalSesion($scope.servicio);

    }

    function actualizarProductoPrincipalSesion(objServicio) {



        var appProductoPrincipal = objServicio.ProductoServicioResponse.idProductoServicio;
        var appNombreProductoPrincipal = objServicio.ProductoServicioResponse.nombre;
        var appIdCuenta = objServicio.ProductoServicioResponse.idCuenta;
        var appIdRecibo = objServicio.ProductoServicioResponse.idRecibo;
        var appIdDireccion = objServicio.ProductoServicioResponse.idDireccion;
        var appIdLinea = objServicio.ProductoServicioResponse.idLinea;
        var appTipoLinea = objServicio.ProductoServicioResponse.tipoLinea;
        var appNumeroTelFijo = objServicio.ProductoServicioResponse.numeroTelFijo;
        var appCategoria = objServicio.ProductoServicioResponse.categoria;
        var appTipoClientePrincipal = objServicio.ProductoServicioResponse.tipoCliente;

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

        ServiciosFijaService.actualizarProductoPrincipalSesion(data).then(function(response) {

        });


    };

    function initSlides() {

		 var $wslide = $(window).width()-20;
    var $slide = 1;
    var $timer = 0;
    var $maxslide = $('.slide-consumo .slide').length;
	
        $('.slide-consumo .slide').each(function(index, element) {
            var $dot = $("<div class=\"dot\">&nbsp;</div>").attr("data-pos", index);
            $('.dots').append($dot);
        });
        $('.dots .dot').click(function(e) {
            $pos = $(this).attr("data-pos");
            clearInterval($timer);
            $slide = parseInt($pos) + 1;
            gotoSlide();
        });
        $('.dots .dot:eq(0)').addClass("this");

        $('.bt.arrow-left').click(function() {
        clearInterval($timer);
        $slide--; if ($slide<1) { $slide = $maxslide; }
        gotoSlide();
		});
       
	   $('.bt.arrow-right').click(function() {
        clearInterval($timer);
        $slide++; if ($slide>$maxslide) { $slide = 1; }
        gotoSlide();
		});

        function gotoSlide() {
            $('.dots .dot').removeClass("this");
            $('.dots .dot:eq(' + ($slide - 1) + ')').addClass("this");
            $('.slide-consumo .slides').animate({ left: -($slide - 1) * $wslide }, 350);
        }

		
		 if ($maxslide > 1) {
        $timer = setInterval(function() {
            $slide++; if ($slide>$maxslide) { $slide = 1; }
            gotoSlide();
        }, 3000);
			}
	$(window).resize(onResizeScreen);
			
			
    function onResizeScreen() {
        $wslide = $(window).width() - 20;
        $('.slide-consumo .slide').width($wslide);
        $('.slide-consumo .slides').css({ left: -($slide - 1) * $wslide });
    }
    onResizeScreen();
    }

    


    function auditoria() {

        var Request = $httpParamSerializer({ requestJson: angular.toJson(ResquestAuditoria) });
        ServiciosFijaService.enviarAuditoria(Request).then(function(response) {


        }, function(error) {

        });

    }

    $scope.switchChange = function() {

        window.location.replace("/wps/myportal/miclaro/corporativo/consultas/saldosyconsumos/fijo");

    }

});

app.controller("ConsultasOrdenDeServicioTecnicoController", function($scope, $location, $httpParamSerializer, $sessionStorage, consultasOrdenDeServicioTecnicoService) {

    var cantidadResultadosServicioTecnico = 5;
    var aumentoResultados = 5;
    var paginaVar = 1;
    var contadorVerMas = 0;

    this.contBotonVerMas = true;
    this.flagErrorVerReporteDetalle = false;
    this.mostrarPaginaInicial = false;
    this.flagOrdenServicioTecnicoVacio = false;

    $scope.mostraListaReparacioTecnica = false;
    $scope.errorReparacionTecnicaMovile = false;
    $scope.errorReparacionTecnica = false;

    this.flagMostrarSwitch = false;

    $scope.switchChange = function() {
        switchChangeEvent();
    };

    function switchChangeEvent() {
        window.location.href = "/wps/myportal/miclaro/corporativo/consultas/ordendeserviciotecnico/";
    }

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    var estadosOrdenServicioTecnicoImg = {
        aprobadoReparacion: "icon-stat-reparacion.png",
        rechazado: "icon-stat-rechazado.png",
        esperando: "icon-stat-esperando.png",
        recoger: "icon-stat-recoger.png"
    };

    var estadoOrdenServicioTecnicoDescripcion = {
        aprobadoReparacion: "Aprobada",
        rechazado: "Rechazada",
        esperando: "En espera de aprobación",
        recoger: "Recoger Equipo"
    };
    var servicioParam = '';
    var tipoUsuarioAuditoria = '';
    var estadoExito = 'SUCCESS';
    var estadoError = 'ERROR';
    var tipoProductoMovil = 'MOVIL';
    var pagIdOrdenServicioTecnicoConsumer = WPSPageID.miclaro_consumer_consultas_ordenserviciotecnico;
    var codOperacionConsulta = WPSTablaOperaciones.consultaOrdenServicioTecnico;
    var codOperacionConsultaDetalle = WPSTablaOperaciones.consultaDetalleOrdenServicioTecnico;
    var operacionOrdenServicioTecnico = 'obtenerOrdenesServicioTecnico';
    var operacionDetalleServicioTecnico = 'obtenerDetalleOrdenServicioTecnico';
    var operacionObtenerServicio = 'obtenerServicios';


    this.inicializar = function() {
        this.obtenerDatosUsuarioSesion();
    };

    this.verMas = function() {
        paginaVar++;
        contadorVerMas++;
        if (contadorVerMas < 5) {
            $scope.consultasOrdenDeServicioTecnicoCtr.getOrdenesServicioTecnicoList();
        } else {
            this.contBotonVerMas = false;
        }
    };

    this.obtenerDatosUsuarioSesion = function() {
        consultasOrdenDeServicioTecnicoService.obtenerDatosUsuarioSesion().then(function(response) {
            var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            if (rpta == 0) {

                $scope.tipoClienteUsuario = response.data.comunResponseType.tipoCliente;

                if ($scope.tipoClienteUsuario == 4) {
                    $scope.showSwitch = true;
                }

                $scope.consultasOrdenDeServicioTecnicoCtr.statusResponseService = true;
                $scope.consultasOrdenDeServicioTecnicoCtr.tipoClienteSession = response.data.comunResponseType.tipoCliente;
                servicioParam = response.data.comunResponseType.telefono;
                $scope.consultasOrdenDeServicioTecnicoCtr.emailUsuarioEnProceso = response.data.comunResponseType.userId;
                tipoUsuarioAuditoria = response.data.comunResponseType.tipoCliente;
                $sessionStorage.usuarioAudi = response.data.comunResponseType.tipoCliente;
                $sessionStorage.razonSocialExcel = response.data.comunResponseType.razonSocial;
                var flagProductoMovilSesion = response.data.comunResponseType.flagProductoMovilSesion;

                if ($scope.consultasOrdenDeServicioTecnicoCtr.tipoClienteSession == WPSTipoCliente.mixto) {
                    $scope.consultasOrdenDeServicioTecnicoCtr.flagMostrarSwitch = true;
                }

                if (flagProductoMovilSesion == "1" || flagProductoMovilSesion == "3") {
                    $scope.consultasOrdenDeServicioTecnicoCtr.getOrdenesServicioTecnicoList();
                } else if (flagProductoMovilSesion == "0" || flagProductoMovilSesion == "2") {
                    registrarAuditoriaExito(rpta, idTransaccion, "FLAG");
                    $location.path("/nuevoServicioView");
                } else if (flagProductoMovilSesion == "-1") {
                    var mensajeAuditoria = operacionObtenerServicio + "- flagMovil";
                    registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, null);
                    $location.path("/errorGeneralWiew");
                }
            } else {
                $location.path("/errorWiew");
            }

        }, function(error) {});
    };

    this.estadoServicioTecnicoList = [];

    this.getOrdenesServicioTecnicoList = function() {
        $scope.errorReparacionTecnica = false;
        var requestOrdenesServicioTecnico = {
            idCuenta: null,
            idRecibo: null,
            idProductoServicio: null,
            pagina: paginaVar,
            cantResultadosPagina: cantidadResultadosServicioTecnico
        };
        dataOrdenesServicioTecnico = $httpParamSerializer({ requestJson: angular.toJson(requestOrdenesServicioTecnico) });
        consultasOrdenDeServicioTecnicoService.getOrdenesServicioTecnico(dataOrdenesServicioTecnico).then(function(response) {
            var rpta = parseInt(response.data.obtenerOrdenesServicioTecnicoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerOrdenesServicioTecnicoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerOrdenesServicioTecnicoResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                var dataEstadoServicioTecnicoList = response.data.obtenerOrdenesServicioTecnicoResponse.listaOrdenes;
                var dataEstadoServicioTecnicoListFinal = [];
                if (dataEstadoServicioTecnicoList != undefined && dataEstadoServicioTecnicoList != null && dataEstadoServicioTecnicoList != "") {
                    if (angular.isArray(dataEstadoServicioTecnicoList)) {
                        dataEstadoServicioTecnicoListFinal = dataEstadoServicioTecnicoList;
                    } else {
                        dataEstadoServicioTecnicoListFinal.push(dataEstadoServicioTecnicoList);
                    }

                    var dataEstadoServicioTecnico = null;
                    for (i = 0; i < dataEstadoServicioTecnicoListFinal.length; i++) {
                        dataEstadoServicioTecnico = dataEstadoServicioTecnicoListFinal[i];
                        servicioParam = dataEstadoServicioTecnicoListFinal[i].linea;

                        if (dataEstadoServicioTecnico.estadoReparacion == "1") {
                            dataEstadoServicioTecnico.estadoReparacionImg = estadosOrdenServicioTecnicoImg.aprobadoReparacion;
                            dataEstadoServicioTecnico.estadoReparacionDescripcion = estadoOrdenServicioTecnicoDescripcion.aprobadoReparacion;
                        }

                        if (dataEstadoServicioTecnico.estadoReparacion == "2") {
                            dataEstadoServicioTecnico.estadoReparacionImg = estadosOrdenServicioTecnicoImg.rechazado;
                            dataEstadoServicioTecnico.estadoReparacionDescripcion = estadoOrdenServicioTecnicoDescripcion.rechazado;
                        }

                        if (dataEstadoServicioTecnico.estadoReparacion == "3") {
                            dataEstadoServicioTecnico.estadoReparacionImg = estadosOrdenServicioTecnicoImg.esperando;
                            dataEstadoServicioTecnico.estadoReparacionDescripcion = estadoOrdenServicioTecnicoDescripcion.esperando;
                        }

                        if (dataEstadoServicioTecnico.estadoReparacion == "4") {
                            dataEstadoServicioTecnico.estadoReparacionImg = estadosOrdenServicioTecnicoImg.recoger;
                            dataEstadoServicioTecnico.estadoReparacionDescripcion = estadoOrdenServicioTecnicoDescripcion.recoger;
                        }

                    }

                    $scope.consultasOrdenDeServicioTecnicoCtr.estadoServicioTecnicoList = $scope.consultasOrdenDeServicioTecnicoCtr.estadoServicioTecnicoList.concat(dataEstadoServicioTecnicoListFinal);
                    $scope.consultasOrdenDeServicioTecnicoCtr.mostrarPaginaInicial = true;
                    $scope.consultasOrdenDeServicioTecnicoCtr.flagOrdenServicioTecnicoVacio = false;

                    if (response.data.obtenerOrdenesServicioTecnicoResponse.pagina == response.data.obtenerOrdenesServicioTecnicoResponse.totalPaginas) {
                        $scope.consultasOrdenDeServicioTecnicoCtr.contBotonVerMas = false;
                    } else {
                        $scope.consultasOrdenDeServicioTecnicoCtr.contBotonVerMas = true;
                    }

                } else {
                    $scope.consultasOrdenDeServicioTecnicoCtr.flagOrdenServicioTecnicoVacio = true;
                    $scope.consultasOrdenDeServicioTecnicoCtr.mostrarPaginaInicial = true;
                }
                $scope.mostraListaReparacioTecnica = true;
                registrarAuditoriaExito(rpta, idTransaccion, "ORDEN");
            } else {
                var mensajeAuditoria = operacionOrdenServicioTecnico + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "ORDEN");
                $scope.errorReparacionTecnica = true;
            }
        }, function(error) {

        });
    };

    this.verReporte = function(idOrdenParm, lineaMovil) {

        var requestDetalleOrdenesServicioTecnico = {
            idCuenta: null,
            idRecibo: null,
            idProductoServicio: null,
            idOrden: idOrdenParm
        };
        var dataDetalleOrdenesServicioTecnico = $httpParamSerializer({ requestJson: angular.toJson(requestDetalleOrdenesServicioTecnico) });

        consultasOrdenDeServicioTecnicoService.getDetalleOrdenServicioTecnico(dataDetalleOrdenesServicioTecnico).then(function(response) {
            var rpta = parseInt(response.data.obtenerDetalleOrdenServicioTecnicoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerDetalleOrdenServicioTecnicoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerDetalleOrdenServicioTecnicoResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                var detalleEstadoServicioTecnicoObj = response.data.obtenerDetalleOrdenServicioTecnicoResponse;
                detalleEstadoServicioTecnicoObj.idOrden = idOrdenParm;

                if (!Array.isArray(detalleEstadoServicioTecnicoObj.listadoProblemas)) {
                    var listadoProblemas = [];
                    listadoProblemas.push(detalleEstadoServicioTecnicoObj.listadoProblemas);
                    detalleEstadoServicioTecnicoObj.listadoProblemas = listadoProblemas;
                }

                if (!Array.isArray(detalleEstadoServicioTecnicoObj.listadoRepuestos)) {
                    var listadoRepuestos = [];
                    listadoRepuestos.push(detalleEstadoServicioTecnicoObj.listadoRepuestos);
                    detalleEstadoServicioTecnicoObj.listadoRepuestos = listadoRepuestos;
                }

                if (detalleEstadoServicioTecnicoObj.estadoReparacion == "1") {
                    detalleEstadoServicioTecnicoObj.estadoReparacionDescripcion = estadoOrdenServicioTecnicoDescripcion.aprobadoReparacion;
                    $scope.consultasOrdenDeServicioTecnicoCtr.flagErrorVerReporteDetalle = false;
                    $location.path("/orderServicioTecnicoAprobadoWiew");
                } else if (detalleEstadoServicioTecnicoObj.estadoReparacion == "2") {
                    detalleEstadoServicioTecnicoObj.estadoReparacionDescripcion = estadoOrdenServicioTecnicoDescripcion.rechazado;
                    $scope.consultasOrdenDeServicioTecnicoCtr.flagErrorVerReporteDetalle = false;
                    $location.path("/orderServicioTecnicoRechazadoWiew");
                } else if (detalleEstadoServicioTecnicoObj.estadoReparacion == "3") {
                    detalleEstadoServicioTecnicoObj.estadoReparacionDescripcion = estadoOrdenServicioTecnicoDescripcion.esperando;
                    $scope.consultasOrdenDeServicioTecnicoCtr.flagErrorVerReporteDetalle = false;
                    $location.path("/orderServicioTecnicoEsperandoWiew");
                } else if (detalleEstadoServicioTecnicoObj.estadoReparacion == "4") {
                    detalleEstadoServicioTecnicoObj.estadoReparacionDescripcion = estadoOrdenServicioTecnicoDescripcion.recoger;
                    $scope.consultasOrdenDeServicioTecnicoCtr.flagErrorVerReporteDetalle = false;
                    $location.path("/orderServicioTecnicoRecogerWiew");
                } else {
                    $scope.consultasOrdenDeServicioTecnicoCtr.flagErrorVerReporteDetalle = true;
                }

                detalleEstadoServicioTecnicoObj.idProductoServicio = "51" + lineaMovil;
                $sessionStorage.detalleEstadoServicioTecnicoSesion = detalleEstadoServicioTecnicoObj;
            } else {
                var mensajeAuditoria = operacionDetalleServicioTecnico + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "DETALLE");
                $scope.consultasOrdenDeServicioTecnicoCtr.flagErrorVerReporteDetalle = true;
            }
        }, function(error) {});
    };

    this.openPagina = function() {
        window.open(WPSPORTAL_UBICANOS_CLARO);
    };

    function registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, operacion) {
        if (operacion == null || operacion == 'ORDEN') {
            guardarAuditoria(idTransaccion, estadoError, codOperacionConsulta, mensajeAuditoria);
        } else {
            guardarAuditoria(idTransaccion, estadoError, codOperacionConsultaDetalle, mensajeAuditoria);
        }
    };

    function registrarAuditoriaExito(rpta, idTransaccion, operacion) {
        if (operacion == 'FLAG' || 'ORDEN') {
            guardarAuditoria(idTransaccion, estadoExito, codOperacionConsulta, "-");
        }

    };

    function guardarAuditoria(idTransaccion, estadoAuditoria, codOperacion, mensajeAuditoria) {
        var requestAuditoria = {
            operationCode: codOperacion,
            pagina: pagIdOrdenServicioTecnicoConsumer,
            transactionId: idTransaccion,
            estado: estadoAuditoria,
            servicio: servicioParam,
            tipoProducto: tipoProductoMovil,
            tipoLinea: "5",
            tipoUsuario: tipoUsuarioAuditoria,
            perfil: "-",
            monto: '',
            descripcionoperacion: mensajeAuditoria,
            responseType: "-"
        };

        var dataAuditoria = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });

        consultasOrdenDeServicioTecnicoService.enviarAuditoria(dataAuditoria).then(function(response) {}, function() {});
    };
});

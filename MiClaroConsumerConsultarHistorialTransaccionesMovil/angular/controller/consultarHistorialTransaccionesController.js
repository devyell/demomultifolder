app.controller("ConsultarHistorialTransaccionesController", function($scope, $timeout, $location, $httpParamSerializer, consultarHistorialTransaccionesService, FileSaver, Blob) {

    this.tab;
    var paginaVarComprasRecargas = 1;
    var paginaVarSolicitudes = 1;
    var paginaVarContratosServicios = 1;
    var contadorVerMasComprasRecargas = 1;
    $scope.contBotonVerMasComprasRecargas = true;
    $scope.contBotonVerMasComprasRecargasMsg = false;
    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    $scope.mensaje_upps_documento = WPSConsultarHistorialTransaccionesConsumerB2E.FLUJOALTERNO10_1;
    $scope.mensaje_upps_fecha = WPSConsultarHistorialTransaccionesConsumerB2E.FLUJOALTERNO10_2;

    $scope.mostrarCombos = false;
    $scope.mostrarContenidoLineas = false;
    $scope.errorComprasyRecargas = false;
    $scope.mostrarComprasyRecargas = false;
    $scope.errorSolicitudesPeriodo = false;
    $scope.mostrarSolicitudesPeriodo = false;
    $scope.errorContratosServiciosPeriodo = false;
    $scope.mostrarContratosServiciosPeriodo = false;
    $scope.mostrarMensajeSolicitud = false;
    $scope.mostrarMensajeCompras = false;
    $scope.mostrarMensajeContratos = false;

    var pagIdHistorialTransaccionesMovil = WPSPageID.miclaro_consumer_consultas_historialtransacciones_movil;
    var codComprasyRecargas = WPSTablaOperaciones.consultaHistorialTransaccionesComprasRecargas;
    var codConsultaSolicitud = WPSTablaOperaciones.consultaHistorialTransaccionesSolicitudes;
    var codDescargarSolicitud = WPSTablaOperaciones.descargaHistorialTransaccionesSolicitudes;
    var codConsultaContratos = WPSTablaOperaciones.consultaHistorialTransaccionesContratos;
    var codDescargarContrato = WPSTablaOperaciones.descargaHistorialTransaccionesContratos;

    var operacionObtenerServicio = 'getObtenerServicios';
    var operacionObtenerComprasRecargas = 'obtenerComprasRecargasPeriodo';
    var operacionArchivoSolicitudPeriodo = 'obtenerArchivoSolicitudPeriodo';
    var operacionContratosPeriodo = 'obtenerContratosServiciosPeriodo';
    var operacionArchivoServicioPeriodo = 'obtenerArchivoContratoServiciosPeriodo';
    var operacionObtenerSolicitudes = 'obtenerSolicitudesPeriodo';
    var tipoProductoAuditoria = 'MOVIL';
    var estadoExito = 'SUCCESS';
    var estadoError = 'ERROR';
    var servicioParam = '-';
    var tipoLineaAudi = '-';
    var tipoPermisoAudi = '-';
    $scope.tab;
    var indiLoad = 1;

    this.flagMostrarSwitch = false;

    $scope.switchChange = function() {
        switchChangeEvent();
    };

    function switchChangeEvent() {
        window.location.href = "/wps/myportal/miclaro/corporativo/consultas/historialtransacciones/movil";
    }

    this.obtenerDatosUsuarioSesion = function() {
        consultarHistorialTransaccionesService.obtenerDatosUsuarioSesion().then(function(response) {
            var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            if (rpta == 0) {
                $scope.consultarHistorialTransaccionesCtr.tipoClienteSession = response.data.comunResponseType.tipoCliente;
                var flagProductoMovilSesion = response.data.comunResponseType.flagProductoMovilSesion;

                if ($scope.consultarHistorialTransaccionesCtr.tipoClienteSession == WPSTipoCliente.mixto) {
                    $scope.consultarHistorialTransaccionesCtr.flagMostrarSwitch = true;
                }

                if (flagProductoMovilSesion == "1" || flagProductoMovilSesion == "3") {
                    $scope.consultarHistorialTransaccionesCtr.obtenerServicioPrincipal();
                } else if (flagProductoMovilSesion == "0" || flagProductoMovilSesion == "2") {
                    $location.path("/nuevoServicioView");
                    registrarAuditoriaExito(rpta, idTransaccion, "FLAG");
                } else if (flagProductoMovilSesion == "-1") {
                    $location.path("/errorGeneralWiew");
                    var mensajeAuditoria = operacionObtenerServicio + "- flagMovil";
                    registrarAuditoriaError(flagProductoMovilSesion, idTransaccion, mensajeAuditoria, null);
                }

            } else {
                $location.path("/errorWiew");
            }

        }, function(error) {

        });
    };

    this.obtenerServicioPrincipal = function() {
        consultarHistorialTransaccionesService.obtenerServicioPrincipal().then(function(response) {
            var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            if (rpta == 0) {
                var categoriaPrincipal = response.data.comunResponseType.categoria;
                var tipoClientePrincipal = response.data.comunResponseType.tipoClienteProductoPrincipal;
                if (categoriaPrincipal == "1" && tipoClientePrincipal == "1") {
                    $scope.lineaPrincipal = response.data.comunResponseType.nombreProductoPrincipal;
                    $scope.consultarHistorialTransaccionesCtr.idProductoPrincipal = response.data.comunResponseType.productoPrincipal;

                } else {
                    $scope.consultarHistorialTransaccionesCtr.idProductoPrincipal = null;
                }

                $scope.consultarHistorialTransaccionesCtr.obtenerLineas();

            } else {
                $location.path("/errorWiew");
            }
        }, function(error) {
            $location.path("/errorWiew");
        });
    };

    this.inicializar = function() {
        this.obtenerDatosUsuarioSesion();
    };


    this.obtenerLineas = function() {

        var requestObtenerServicios = {
            categoria: WPSCategoria.movil,
            tipoLinea: WPSTipoLinea.todos,
            tipoCliente: WPSTipoCliente.consumer,
            idProductoServicio: null,
            tipoPermiso: WPSTipoPermiso.administrador,
            idCuenta: null,
            idRecibo: null,
            idDireccion: null,
            nombreProducto: null,
            pagina: WPSpaginacion.pagina,
            cantResultadosPagina: WPSpaginacion.cantResultadosPagina,
            productoPrincipalXidRecibo: "false",
            titularidadServicio: WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado
        };

        var dataObtenerServicios = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerServicios) });

        consultarHistorialTransaccionesService.getObtenerServicios(dataObtenerServicios).then(function(response) {
            var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                var dataLineaList = response.data.obtenerServiciosResponse.listadoProductosServicios;
                $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList = [];
                if (angular.isArray(dataLineaList)) {
                    $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList = dataLineaList;
                } else {
                    $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList.push(dataLineaList);
                }

                $scope.consultarHistorialTransaccionesCtr.linea = $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList[0];

                if ($scope.consultarHistorialTransaccionesCtr.idProductoPrincipal != null) {
                    angular.forEach($scope.consultarHistorialTransaccionesCtr.lineasCorporativoList, function(val, key) {
                        if (val.ProductoServicioResponse.idProductoServicio === $scope.consultarHistorialTransaccionesCtr.idProductoPrincipal) {
                            $scope.consultarHistorialTransaccionesCtr.linea = $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList[key];
                        }
                    });
                }

                servicioParam = $scope.consultarHistorialTransaccionesCtr.linea.ProductoServicioResponse.nombre;
                tipoLineaAudi = $scope.consultarHistorialTransaccionesCtr.linea.ProductoServicioResponse.tipoLinea;
                tipoPermisoAudi = $scope.consultarHistorialTransaccionesCtr.linea.ProductoServicioResponse.tipoPermiso;

                $scope.consultarHistorialTransaccionesCtr.obtenerPeriodosFacturacion();
                actualizarProductoPrincipal($scope.consultarHistorialTransaccionesCtr.linea);
            } else {
                var mensajeAuditoria = operacionObtenerServicio + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'LINEA');
                $location.path("/errorWiew");
            }

        }, function(error) {});
    };


    this.obtenerPeriodosFacturacion = function() {

        var requestPeriodoFacturacion = {
            "cantMeses": "15",
            "mesMaximo": "0"
        };
        data = $httpParamSerializer({ requestJson: angular.toJson(requestPeriodoFacturacion) });

        consultarHistorialTransaccionesService.obtenerPeriodos(data).then(function(response) {
            $scope.mostrarCombos = true;
            var dataPeriodosList = response.data.comunResponseType.elemento;
            if (angular.isArray(dataPeriodosList)) {
                $scope.consultarHistorialTransaccionesCtr.periodosFacturacionList = dataPeriodosList;
            } else {
                $scope.consultarHistorialTransaccionesCtr.periodosFacturacionList.push(dataPeriodosList);
            }

            $scope.consultarHistorialTransaccionesCtr.periodoFacturacion = $scope.consultarHistorialTransaccionesCtr.periodosFacturacionList[0];
            if ($scope.consultarHistorialTransaccionesCtr.linea.ProductoServicioResponse.tipoLinea == WPSTipoLinea.prepago) {
                $scope.consultarHistorialTransaccionesCtr.obtenerComprasRecargasPeriodo(indiLoad);
            } else {
                $scope.consultarHistorialTransaccionesCtr.obtenerSolicitudes(indiLoad);
            }
        }, function(error) {
            $location.path("/errorWiew");
        });
    };


    this.buscarHistorial = function() {
        if ($scope.tab == '1') {
            $scope.consultarHistorialTransaccionesCtr.obtenerComprasRecargasPeriodo(indiLoad);
        } else if ($scope.tab == '2') {
            $scope.consultarHistorialTransaccionesCtr.obtenerSolicitudes(indiLoad);
        } else {
            $scope.consultarHistorialTransaccionesCtr.obtenerContratosServicios(indiLoad);
        }

    }
    this.obtenerComprasRecargasPeriodo = function(indicador) {
        if (indicador == 1) {
            $scope.consultarHistorialTransaccionesCtr.comprasRecargasList = [];
            paginaVarComprasRecargas = 1;
            $scope.mostrarComprasyRecargas = false;
            contadorVerMasComprasRecargas = 1;
        }

        var listaTemp = $scope.consultarHistorialTransaccionesCtr.comprasRecargasList;

        $scope.mostrarContenidoLineas = true;
        $scope.errorComprasyRecargas = false;
        $scope.mostrarMensajeCompras = false;
        $scope.contBotonVerMasComprasRecargasMsg = false;

        this.tab = 1;
        $scope.tab = 1;

        var requestObtenerComprasRecargasPeriodo = {
            idProductoServicio: this.linea.ProductoServicioResponse.idProductoServicio,
            idPeriodo: this.periodoFacturacion.codigo,
            idCuenta: null,
            idRecibo: null,
            idDireccion: null,
            pagina: paginaVarComprasRecargas,
            categoria: WPSCategoria.movil,
            cantResultadosPagina: WPSpaginacion.cantResultadosPagina
        };
        $('#compras-recargas-movil').fadeIn(350).siblings().hide();

        var data = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerComprasRecargasPeriodo) });

        consultarHistorialTransaccionesService.obtenerComprasRecargasPeriodo(data).then(function(response) {
            var rpta = parseInt(response.data.obtenerComprasRecargasPeriodoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerComprasRecargasPeriodoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerComprasRecargasPeriodoResponse.defaultServiceResponse.mensaje;

            if (rpta == 0) {
                $scope.totalPaginas= response.data.obtenerComprasRecargasPeriodoResponse.totalPaginas;
                var dataComprasRecargasList = response.data.obtenerComprasRecargasPeriodoResponse.listado;
                $scope.verTamanioRecargas = response.data.obtenerComprasRecargasPeriodoResponse.listado;

                if (dataComprasRecargasList != undefined && dataComprasRecargasList != '') {

                    if (angular.isArray(dataComprasRecargasList)) {

                        if (paginaVarComprasRecargas > 1 && paginaVarComprasRecargas < 4) {
                            $scope.consultarHistorialTransaccionesCtr.comprasRecargasList = concatenarLista(listaTemp, dataComprasRecargasList);
                        } else {

                            $scope.consultarHistorialTransaccionesCtr.comprasRecargasList = dataComprasRecargasList;
                        }

                    } else {
                        $scope.consultarHistorialTransaccionesCtr.comprasRecargasList.push(dataComprasRecargasList);

                    }

                    if ($scope.consultarHistorialTransaccionesCtr.comprasRecargasList.length < 1) {
                        $scope.mostrarMensajeCompras = true;
                    } else {
                        $scope.mostrarComprasyRecargas = true;
                    }
                    registrarAuditoriaExito(rpta, idTransaccion, 'COMPRAS');
                } else {
                    $scope.mostrarMensajeCompras = true;
                    registrarAuditoriaExito(rpta, idTransaccion, 'COMPRAS');
                }


            } else {
                $scope.errorComprasyRecargas = true;
                var mensajeAuditoria = operacionObtenerComprasRecargas + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'COMPRAS');
            }
        }, function(error) {});
    };

    this.obtenerSolicitudes = function(indicador) {

        this.tab = 2;
        $scope.tab = 2;

        if (indicador == 1) {
            $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList = [];
            $scope.mostrarSolicitudesPeriodo = false;
            paginaVarSolicitudes = 1;
        }
        var listaTemp = $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList;
        $scope.mostrarContenidoLineas = true;
        $scope.errorSolicitudesPeriodo = false;
        $scope.mostrarMensajeSolicitud = false;

        var requestObtenerSolicitudesPeriodo = {
            categoria: WPSCategoria.movil,
            idProductoServicio: this.linea.ProductoServicioResponse.idProductoServicio,
            idPeriodo: this.periodoFacturacion.codigo,
            idCuenta: this.linea.ProductoServicioResponse.idCuenta,
            idRecibo: this.linea.ProductoServicioResponse.idRecibo,
            idDireccion: null,
            idLinea: null,
            pagina: paginaVarSolicitudes,
            cantResultadosPagina: WPSpaginacion.cantResultadosPagina
        };

        $('#solicitudes-movil').fadeIn(350).siblings().hide();

        var data = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerSolicitudesPeriodo) });

        consultarHistorialTransaccionesService.obtenerSolicitudesPeriodo(data).then(function(response) {
            var rpta = parseInt(response.data.obtenerSolicitudesPeriodoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerSolicitudesPeriodoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerSolicitudesPeriodoResponse.defaultServiceResponse.mensaje;
            if (rpta == 0) {
                var dataSolicitudesPeriodoList = response.data.obtenerSolicitudesPeriodoResponse.listado;
                $scope.verTamanioSolicitudes = response.data.obtenerSolicitudesPeriodoResponse.listado;
                if (dataSolicitudesPeriodoList != undefined && dataSolicitudesPeriodoList != '') {
                    if (angular.isArray(dataSolicitudesPeriodoList)) {
                        if (indicador == 2) {
                            $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList = concatenarLista(listaTemp, dataSolicitudesPeriodoList);
                        } else {

                            $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList = dataSolicitudesPeriodoList;
                        }

                    } else {
                        $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList.push(dataSolicitudesPeriodoList);
                    }
                    if ($scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList.length < 1) {
                        $scope.mostrarMensajeSolicitud = true;
                    } else {
                        $scope.mostrarSolicitudesPeriodo = true;
                    }
                    registrarAuditoriaExito(rpta, idTransaccion, "SOLICITUD");
                } else {
                    $scope.mostrarMensajeSolicitud = true;
                    registrarAuditoriaExito(rpta, idTransaccion, "SOLICITUD");
                }
            } else {
                var mensajeAuditoria = operacionObtenerSolicitudes + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'SOLICITUD');
                $scope.errorSolicitudesPeriodo = true;
            }
        }, function(error) {});
    };

    this.obtenerContratosServicios = function(indicador) {

        if (indicador == 1) {
            $scope.consultarHistorialTransaccionesCtr.contratosServiciosList = [];
            $scope.mostrarContratosServiciosPeriodo = false;
            paginaVarContratosServicios = 1;

        }

        var listaTemp = $scope.consultarHistorialTransaccionesCtr.contratosServiciosList;

        this.tab = 3;
        $scope.tab = 3;
        $scope.errorContratosServiciosPeriodo = false;
        $scope.mostrarMensajeContratos = false;
        $scope.mostrarContenidoLineas = true;

        var requestObtenerContratosServicios = {
            idProductoServicio: this.linea.ProductoServicioResponse.idProductoServicio,
            idPeriodo: this.periodoFacturacion.codigo,
            idCuenta: this.linea.ProductoServicioResponse.idCuenta,
            idRecibo: this.linea.ProductoServicioResponse.idRecibo,
            idDireccion: null,
            idLinea: null,
            categoria: WPSCategoria.movil,
            pagina: paginaVarContratosServicios,
            cantResultadosPagina: WPSpaginacion.cantResultadosPagina
        };

        $('#contratos-servicios-movil').fadeIn(350).siblings().hide();

        var data = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerContratosServicios) });

        consultarHistorialTransaccionesService.obtenerContratosServiciosPeriodo(data).then(function(response) {
            var rpta = parseInt(response.data.obtenerContratosServiciosPeriodoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerContratosServiciosPeriodoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerContratosServiciosPeriodoResponse.defaultServiceResponse.mensaje;

            if (rpta == 0) {
                var dataContratosServicioList = response.data.obtenerContratosServiciosPeriodoResponse.listado;
                $scope.verTamanioContratos = response.data.obtenerContratosServiciosPeriodoResponse.listado;
                if (dataContratosServicioList != undefined && dataContratosServicioList != '') {
                    if (angular.isArray(dataContratosServicioList)) {
                        if (indicador == 2) {
                            $scope.consultarHistorialTransaccionesCtr.contratosServiciosList = concatenarLista(listaTemp, dataContratosServicioList);
                        } else {

                            $scope.consultarHistorialTransaccionesCtr.contratosServiciosList = dataSolicitudesPeriodoList;
                        }

                    } else {
                        $scope.consultarHistorialTransaccionesCtr.contratosServiciosList.push(dataContratosServicioList);
                    }

                    if ($scope.consultarHistorialTransaccionesCtr.contratosServiciosList.length < 1) {
                        $scope.mostrarMensajeContratos = true;
                    } else {
                        $scope.mostrarContratosServiciosPeriodo = true;
                    }
                    registrarAuditoriaExito(rpta, idTransaccion, "CONTRATOS");
                } else {
                    $scope.mostrarMensajeContratos = true;
                    registrarAuditoriaExito(rpta, idTransaccion, "CONTRATOS");
                }
            } else {
                $scope.errorContratosServiciosPeriodo = true;
                var mensajeAuditoria = operacionContratosPeriodo + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'CONTRATOS');
            }
        }, function(error) {

        });
    };

    this.descargarArchivoContratosServicios = function(idContratoArchivoDescarga) {
        var requestObtenerArchivoContratosServicios = {
            idProductoServicio: this.linea.ProductoServicioResponse.idProductoServicio,
            idPeriodo: this.periodoFacturacion.codigo,
            idCuenta: this.linea.ProductoServicioResponse.idCuenta,
            idRecibo: this.linea.ProductoServicioResponse.idRecibo,
            idDireccion: null,
            idLinea: null,
            categoria: WPSCategoria.movil,
            idContratoArchivoDescarga: idContratoArchivoDescarga
        };

        var data = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerArchivoContratosServicios) });

        consultarHistorialTransaccionesService.obtenerArchivoContratoServiciosPeriodo(data).then(function(response) {
            var rpta = parseInt(response.data.obtenerArchivoContratoServiciosPeriodoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerArchivoContratoServiciosPeriodoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerArchivoContratoServiciosPeriodoResponse.defaultServiceResponse.mensaje;
            var arregloSplit = [];
            if (rpta == 0) {
                var archivoBase64 = response.data.obtenerArchivoContratoServiciosPeriodoResponse.archivo;
                var nombreArchivoWS = response.data.obtenerArchivoContratoServiciosPeriodoResponse.nombreArchivo;
                var arregloSplit = [];
                arregloSplit = nombreArchivoWS.split(".");
                var extencionArchivo = '';
                extencionArchivo = arregloSplit[1];
                var reporteBlob = b64toBlob(archivoBase64, 'application/' + extencionArchivo);
                FileSaver.saveAs(reporteBlob, nombreArchivoWS);

                registrarAuditoriaExito(rpta, idTransaccion, "DESCARGARCON");
            } else {
                var mensajeAuditoria = operacionArchivoServicioPeriodo + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'DESCARGARCON');
            }
        }, function(error) {

        });
    };

    this.descargaArchivoSolicitudPeriodo = function(idSolicitudArchivoDescarga) {
        var requestObtenerArchivoSolicitudPeriodo = {
            idProductoServicio: this.linea.ProductoServicioResponse.idProductoServicio,
            idPeriodo: this.periodoFacturacion.codigo,
            idCuenta: this.linea.ProductoServicioResponse.idCuenta,
            idRecibo: this.linea.ProductoServicioResponse.idRecibo,
            idDireccion: null,
            categoria: WPSCategoria.movil,
            idSolicitudArchivoDescarga: idSolicitudArchivoDescarga
        };

        var data = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerArchivoSolicitudPeriodo) });

        consultarHistorialTransaccionesService.obtenerArchivoSolicitudPeriodo(data).then(function(response) {
            var rpta = parseInt(response.data.obtenerArchivoContratoServiciosPeriodoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerArchivoContratoServiciosPeriodoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerArchivoContratoServiciosPeriodoResponse.defaultServiceResponse.mensaje;

            if (rpta == 0) {
                var archivoBase64 = response.data.obtenerArchivoSolicitudPeriodoResponse.archivo;
                var nombreArchivoWS = response.data.obtenerArchivoContratoServiciosPeriodoResponse.nombreArchivo;

                var arregloSplit = [];
                arregloSplit = nombreArchivoWS.split(".");
                var extencionArchivo = '';
                extencionArchivo = arregloSplit[1];


                var reporteBlob = b64toBlob(archivoBase64, 'application/' + extencionArchivo);
                FileSaver.saveAs(reporteBlob, nombreArchivoWS);

                registrarAuditoriaExito(rpta, idTransaccion, "DESCARGARSOL");
            } else {
                var mensajeAuditoria = operacionArchivoSolicitudPeriodo + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'DESCARGARSOL');
            }
        }, function(error) {});
    };

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        var byteCharacters = atob(b64Data);
        var byteArrays = [];

        for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            var slice = byteCharacters.slice(offset, offset + sliceSize);

            var byteNumbers = new Array(slice.length);
            for (var i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            var byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        var blob = new Blob(byteArrays, { type: contentType });
        return blob;
    };

    $scope.buscarHistorialTransacciones = function(indicador) {
        if (indicador == 1) {
            $scope.mostrarContenidoLineas = false;
            $scope.consultarHistorialTransaccionesCtr.obtenerPeriodosFacturacion();
        } else {
            $scope.mostrarContenidoLineas = false;

            if ($scope.tab == '1') {
                paginaVarComprasRecargas = 1;

                $scope.consultarHistorialTransaccionesCtr.obtenerComprasRecargasPeriodo(indiLoad);
            } else if ($scope.tab == '2') {

                $scope.consultarHistorialTransaccionesCtr.obtenerSolicitudes(indiLoad);
            } else {

                $scope.consultarHistorialTransaccionesCtr.obtenerContratosServicios(indiLoad);
            }

        }

        actualizarProductoPrincipal($scope.consultarHistorialTransaccionesCtr.linea);
    };

    this.verMasComprasRecargas = function(indicador) {
        paginaVarComprasRecargas++;

        contadorVerMasComprasRecargas++;

        if (contadorVerMasComprasRecargas < 4) {
            this.obtenerComprasRecargasPeriodo(indicador);

        } else {
            $scope.contBotonVerMasComprasRecargas = false;
            $scope.contBotonVerMasComprasRecargasMsg = true;
        }
    };

    this.verMasSolicitudes = function(indicador) {
        paginaVarSolicitudes++;

        this.obtenerSolicitudes(indicador);

    };

    this.verMasContratos = function(indicador) {
        paginaVarContratosServicios++;

        this.obtenerContratosServicios(indicador);

    };


    function registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, operacion) {
        var codTipoOperacion = '';
        if (operacion == 'LINEA' || operacion == 'COMPRAS' || operacion == null) {
            codTipoOperacion = codComprasyRecargas;
        } else if (operacion == 'SOLICITUD') {
            codTipoOperacion = codConsultaSolicitud;
        } else if (operacion == 'CONTRATOS') {
            codTipoOperacion = codConsultaContratos;
        } else if (operacion == 'DESCARGARCON') {
            codTipoOperacion = codDescargarContrato;
        } else if (operacion == 'DESCARGARSOL') {
            codTipoOperacion = codDescargarSolicitud;
        }

        guardarAuditoria(idTransaccion, estadoError, codTipoOperacion, mensajeAuditoria);
    };

    function registrarAuditoriaExito(rpta, idTransaccion, operacion) {
        var codTipoOperacion = '';
        if (operacion == 'COMPRAS' || operacion == 'FLAG') {
            codTipoOperacion = codComprasyRecargas;
        } else if (operacion == 'SOLICITUD') {
            codTipoOperacion = codConsultaSolicitud;
        } else if (operacion == 'CONTRATOS') {
            codTipoOperacion = codConsultaContratos;
        } else if (operacion == 'DESCARGARCON') {
            codTipoOperacion = codDescargarContrato;
        } else if (operacion == 'DESCARGARSOL') {
            codTipoOperacion = codDescargarSolicitud;
        }
        guardarAuditoria(idTransaccion, estadoExito, codTipoOperacion, "-");
    };

    function guardarAuditoria(idTransaccion, estadoAuditoria, codOperacion, mensajeAuditoria) {

        var requestAuditoria = {
            operationCode: codOperacion,
            pagina: pagIdHistorialTransaccionesMovil,
            transactionId: idTransaccion,
            estado: estadoAuditoria,
            servicio: servicioParam,
            tipoProducto: tipoProductoAuditoria,
            tipoLinea: tipoLineaAudi,
            tipoUsuario: $scope.consultarHistorialTransaccionesCtr.tipoClienteSession,
            perfil: tipoPermisoAudi,
            monto: '',
            descripcionoperacion: mensajeAuditoria,
            responseType: '-'
        };

        var dataAuditoria = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });

        consultarHistorialTransaccionesService.enviarAuditoria(dataAuditoria).then(function(response) {}, function() {});
    };

    function actualizarProductoPrincipal(objetoActualizarFijo) {
        var actualizar = enviarDataActualizar(objetoActualizarFijo);
        consultarHistorialTransaccionesService.actualizarProductoPrincipal(actualizar).then(function(response) {}, function(error) {});
    };

    function enviarDataActualizar(objetoActualizarFijo) {
        var requestActualizar = {
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

        requestActualizar.productoPrincipal = objetoActualizarFijo.ProductoServicioResponse.idProductoServicio;
        requestActualizar.nombreProductoPrincipal = objetoActualizarFijo.ProductoServicioResponse.nombre;
        requestActualizar.idDireccion = objetoActualizarFijo.ProductoServicioResponse.idDireccion;
        requestActualizar.idLinea = objetoActualizarFijo.ProductoServicioResponse.idLinea;
        requestActualizar.tipoLinea = objetoActualizarFijo.ProductoServicioResponse.tipoLinea;
        requestActualizar.categoria = objetoActualizarFijo.ProductoServicioResponse.categoria;
        requestActualizar.tipoClienteProductoPrincipal = WPSTipoCliente.consumer;

        dataActualizar = $httpParamSerializer({ requestJson: angular.toJson(requestActualizar) });
        return dataActualizar;
    };

});
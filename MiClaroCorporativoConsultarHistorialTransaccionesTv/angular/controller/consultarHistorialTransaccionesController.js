app.controller("ConsultarHistorialTransaccionesController", function($scope, $timeout, $location, $httpParamSerializer, consultarHistorialTransaccionesService, FileSaver, Blob) {
    this.tab;

    var paginaVarComprasRecargas = 1;
    var paginaVarSolicitudes = 1;
    var paginaVarContratosServicios = 1;

    var contadorVerMasComprasRecargas = 0;
    var contadorVerMasSolicitudes = 0;
    var contadorVerMasContratosServicios = 0;

    this.contBotonVerMasComprasRecargas = true;
    this.contBotonVerMasSolicitudes = true;
    this.contBotonVerMasContratosServicios = true;

    this.barraCorporativo = false;

    this.idDireccionPrincipal = null;
    this.idProductoPrincial = null;

    $scope.mostrarCombos = false;
    $scope.mostrarContenidoLineas = false;
    $scope.mostrarComprasyRecargas = false;

    $scope.errorSolicitudesPeriodo = false;
    $scope.mostrarSolicitudesPeriodo = false;
    $scope.errorContratosServiciosPeriodo = false;
    $scope.mostrarContratosServiciosPeriodo = false;
    $scope.mostrarMensajeSolicitud = false;
    $scope.mostrarMensajeContratos = false;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    $scope.mensaje_upps_documento = WPSConsultarHistorialTransaccionesConsumerB2E.FLUJOALTERNO10_1;
    $scope.mensaje_upps_fecha = WPSConsultarHistorialTransaccionesConsumerB2E.FLUJOALTERNO10_2;

    var pagIdHistorialTransaccionesTv = WPSPageID.miclaro_corporativo_consultas_historialtransacciones_tv;
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
    var operacionObtenerDireccion = 'obtenerListadoFijoDireccion';
    var operacionObtenerLineaFija = 'obtenerLineasFijas';
    var tipoProductoAuditoria = 'CLAROTV';
    var estadoExito = 'SUCCESS';
    var estadoError = 'ERROR';
    var servicioParam = '-';
    var tipoLineaAudi = '-';
    var tipoPermisoAudi = '-';
    var indiLoad = 1;
    this.flagMostrarSwitch = false;



    this.getBarraCorporativo = function() {
        return this.barraCorporativo;
    };

    this.setBarraCorporativo = function() {
        this.barraCorporativo = !this.barraCorporativo;
    };

    $scope.switchChange = function() {
        switchChangeEvent();
    };

    function switchChangeEvent() {
        window.location.href = "/wps/myportal/miclaro/consumer/consultas/historialtransacciones/tv";
    };


    this.obtenerDatosUsuarioSesion = function() {
        consultarHistorialTransaccionesService.obtenerDatosUsuarioSesion().then(function(response) {
            var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;

            if (rpta == 0) {
                $scope.consultarHistorialTransaccionesCtr.tipoClienteSession = response.data.comunResponseType.tipoCliente;

                $scope.consultarHistorialTransaccionesCtr.obtenerServicioPrincipal();

                var flagProductoTvSesion = response.data.comunResponseType.flagProductoTVSesion;

                if ($scope.consultarHistorialTransaccionesCtr.tipoClienteSession == WPSTipoCliente.mixto) {
                    $scope.consultarHistorialTransaccionesCtr.flagMostrarSwitch = true;
                }

                if (flagProductoTvSesion == "2" || flagProductoTvSesion == "3") {
                    $scope.consultarHistorialTransaccionesCtr.obtenerServicioPrincipal();
                } else if (flagProductoTvSesion == "0" || flagProductoTvSesion == "1") {
                    registrarAuditoriaExito(rpta, idTransaccion, "FLAG");
                    $location.path("/nuevoServicioView");
                } else if (flagProductoTvSesion == "-1") {
                    var mensajeAuditoria = operacionObtenerServicio + "- flagTv";
                    registrarAuditoriaError(flagProductoFijoSesion, idTransaccion, mensajeAuditoria, null);
                    $location.path("/errorGeneralWiew");
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

                if (categoriaPrincipal == "4" && tipoClientePrincipal == "2") {
                    $scope.lineaPrincipal = response.data.comunResponseType.nombreProductoPrincipal;
                    $scope.consultarHistorialTransaccionesCtr.idDireccionPrincipal = response.data.comunResponseType.idDireccion;
                    $scope.consultarHistorialTransaccionesCtr.idProductoPrincial = response.data.comunResponseType.productoPrincipal;

                    $scope.consultarHistorialTransaccionesCtr.obtenerDireccionesFijos();
                } else {
                    $scope.consultarHistorialTransaccionesCtr.idDireccionPrincipal = null;
                    $scope.consultarHistorialTransaccionesCtr.idProductoPrincial = null;

                    $scope.consultarHistorialTransaccionesCtr.obtenerDireccionesFijos();
                }

            } else {

                $location.path("/errorWiew");
            }
        }, function(error) {

        });
    };

    this.inicializar = function() {
        this.obtenerDatosUsuarioSesion();
    };

    this.inicializar();



    this.verMasSolicitudes = function(indicador) {
        paginaVarSolicitudes++;

        this.obtenerSolicitudes(indicador);

    };

    this.verMasContratos = function(indicador) {
        paginaVarContratosServicios++;

        this.obtenerContratosServicios(indicador);

    };

    this.obtenerComprasRecargasPeriodo = function() {
        $scope.mostrarContenidoLineas = true;
        this.tab = 1;
        $scope.mostrarComprasyRecargas = true;
    };


    this.obtenerDireccionesFijos = function() {
        var requestDireccion = {
            "tipoCliente": null
        };

        requestDireccion.tipoCliente = WPSTipoClienteDir.corporativoTv;

        var dataDireccion = $httpParamSerializer({ requestJson: angular.toJson(requestDireccion) });

        consultarHistorialTransaccionesService.obtenerListadoFijoDireccion(dataDireccion).then(function(response) {
            var rpta = parseInt(response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.mensaje;

            if (rpta == 0) {
                var dataDireccionesList = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;
                $scope.consultarHistorialTransaccionesCtr.direccionesFijasList = [];

                if (angular.isArray(dataDireccionesList)) {
                    $scope.consultarHistorialTransaccionesCtr.direccionesFijasList = dataDireccionesList;
                } else {
                    $scope.consultarHistorialTransaccionesCtr.direccionesFijasList.push(dataDireccionesList);
                }

                $scope.consultarHistorialTransaccionesCtr.direccion = $scope.consultarHistorialTransaccionesCtr.direccionesFijasList[0];

                if ($scope.consultarHistorialTransaccionesCtr.idDireccionPrincipal != null) {
                    angular.forEach($scope.consultarHistorialTransaccionesCtr.direccionesFijasList, function(val, key) {
                        if (val.idDireccion === $scope.consultarHistorialTransaccionesCtr.idDireccionPrincipal) {
                            $scope.consultarHistorialTransaccionesCtr.direccion = $scope.consultarHistorialTransaccionesCtr.direccionesFijasList[key];
                        }
                    });
                }

                $scope.consultarHistorialTransaccionesCtr.obtenerLineas();

            } else {
                var mensajeAuditoria = operacionObtenerDireccion + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'DIRECCION');
                $location.path("/errorWiew");
            }
        }, function(error) {


            $location.path("/errorWiew");

        });
    };

    this.obtenerLineas = function() {
        var requestObtenerServicios = {
            categoria: WPSCategoria.tv,
            tipoLinea: WPSTipoLinea.todos,
            tipoCliente: WPSTipoCliente.corporativo,
            idProductoServicio: null,
            tipoPermiso: WPSTipoPermiso.administrador,
            idCuenta: null,
            idRecibo: null,
            idDireccion: $scope.consultarHistorialTransaccionesCtr.direccion.idDireccion,
            nombreProducto: null,
            pagina: 0,
            cantResultadosPagina: 0,
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
                if (dataLineaList != undefined && dataLineaList != '') {
                    if (angular.isArray(dataLineaList)) {
                        $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList = dataLineaList;
                    } else {
                        $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList.push(dataLineaList);
                    }

                    if ($scope.consultarHistorialTransaccionesCtr.idProductoPrincial != null) {
                        angular.forEach($scope.consultarHistorialTransaccionesCtr.lineasCorporativoList, function(val, key) {
                            if (val.ProductoServicioResponse.idProductoServicio === $scope.consultarHistorialTransaccionesCtr.idProductoPrincial) {
                                $scope.consultarHistorialTransaccionesCtr.linea = $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList[key];
                            }
                        });
                    } else {
                        $scope.consultarHistorialTransaccionesCtr.linea = $scope.consultarHistorialTransaccionesCtr.lineasCorporativoList[0];
                    }

                    servicioParam = $scope.consultarHistorialTransaccionesCtr.linea.ProductoServicioResponse.nombreAlias;
                    tipoLineaAudi = $scope.consultarHistorialTransaccionesCtr.linea.ProductoServicioResponse.tipoLinea;
                    tipoPermisoAudi = $scope.consultarHistorialTransaccionesCtr.linea.ProductoServicioResponse.tipoPermiso;

                    $scope.consultarHistorialTransaccionesCtr.obtenerPeriodosFacturacion();
                    actualizarProductoPrincipal($scope.consultarHistorialTransaccionesCtr.linea);
                }
            } else {
                var mensajeAuditoria = operacionObtenerServicio + "-" + mensajeServicio;
                registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, 'SERVICIO');
                $location.path("/errorWiew");
            }

        }, function(error) {

            $location.path("/errorWiew");

        });
    };

    this.obtenerPeriodosFacturacion = function() {
        var requestPeriodoFacturacion = {
            "cantMeses": "15",
            "mesMaximo": "0"
        };

        data = $httpParamSerializer({ requestJson: angular.toJson(requestPeriodoFacturacion) });

        consultarHistorialTransaccionesService.obtenerPeriodos(data).then(function(response) {
            var dataPeriodosList = response.data.comunResponseType.elemento;
            $scope.mostrarCombos = true;
            $scope.consultarHistorialTransaccionesCtr.periodosFacturacionList = [];

            if (angular.isArray(dataPeriodosList)) {
                $scope.consultarHistorialTransaccionesCtr.periodosFacturacionList = dataPeriodosList;
            } else {
                $scope.consultarHistorialTransaccionesCtr.periodosFacturacionList.push(dataPeriodosList);
            }

            $scope.consultarHistorialTransaccionesCtr.periodoFacturacion = dataPeriodosList[0];

            $scope.consultarHistorialTransaccionesCtr.obtenerSolicitudes(indiLoad);

        }, function(error) {

        });
    };


    this.obtenerSolicitudes = function(indicador) {
        this.tab = 2;

        if (indicador == 1) {
            $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList = [];
            $scope.mostrarSolicitudesPeriodo = false;
            paginaVarSolicitudes = 1;
        }
        var listaTemp = $scope.consultarHistorialTransaccionesCtr.solicitudesPeriodoList;

        $scope.mostrarContenidoLineas = true;
        $scope.errorSolicitudesPeriodo = false;
        $scope.mostrarMensajeSolicitud = false;
		$scope.mostrarSolicitudesPeriodo = false;
		
        var requestObtenerSolicitudesPeriodo = {
            categoria: WPSCategoria.tv,
            idProductoServicio: this.linea.ProductoServicioResponse.idProductoServicio,
            idPeriodo: this.periodoFacturacion.codigo,
            idCuenta: null,
            idRecibo: null,
            idDireccion: this.direccion.idDireccion,
            idLinea: this.linea.ProductoServicioResponse.idLinea,
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
        }, function(error) {

        });
    };

    this.obtenerContratosServicios = function(indicador) {

        if (indicador == 1) {
            $scope.consultarHistorialTransaccionesCtr.contratosServiciosList = [];
            $scope.mostrarContratosServiciosPeriodo = false;
            paginaVarContratosServicios = 1;

        }

        var listaTemp = $scope.consultarHistorialTransaccionesCtr.contratosServiciosList;

        this.tab = 3;
		$scope.mostrarContenidoLineas = true;
        $scope.errorContratosServiciosPeriodo = false;
        $scope.mostrarMensajeContratos = false;
		$scope.mostrarContratosServiciosPeriodo = false;
        var requestObtenerContratosServicios = {
            idProductoServicio: this.linea.ProductoServicioResponse.idProductoServicio,
            idPeriodo: this.periodoFacturacion.codigo,
            idCuenta: null,
            idRecibo: null,
            idDireccion: null,
            idLinea: this.linea.ProductoServicioResponse.idLinea,
            categoria: WPSCategoria.tv,
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
                            $scope.consultarHistorialTransaccionesCtr.contratosServiciosList = dataContratosServicioList;
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
            idCuenta: null,
            idRecibo: null,
            idDireccion: null,
            idLinea: this.linea.ProductoServicioResponse.idLinea,
            categoria: WPSCategoria.tv,
            idContratoArchivoDescarga: idContratoArchivoDescarga
        };

        var data = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerArchivoContratosServicios) });

        consultarHistorialTransaccionesService.obtenerArchivoContratoServiciosPeriodo(data).then(function(response) {
            var rpta = parseInt(response.data.obtenerArchivoContratoServiciosPeriodoResponse.defaultServiceResponse.idRespuesta);
            var idTransaccion = response.data.obtenerArchivoContratoServiciosPeriodoResponse.defaultServiceResponse.idTransaccional;
            var mensajeServicio = response.data.obtenerArchivoContratoServiciosPeriodoResponse.defaultServiceResponse.mensaje;

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
            idCuenta: null,
            idRecibo: null,
            idDireccion: null,
            categoria: WPSCategoria.tv,
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
        }, function(error) {

        });
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

    function registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, operacion) {
        var codTipoOperacion = '';
        if (operacion == 'SOLICITUD') {
            codTipoOperacion = codConsultaSolicitud;
        } else if (operacion == 'CONTRATOS') {
            codTipoOperacion = codConsultaContratos;
        } else if (operacion == 'DESCARGARCON') {
            codTipoOperacion = codDescargarContrato;
        } else if (operacion == 'DESCARGARSOL') {
            codTipoOperacion = codDescargarSolicitud;
        } else {
            codTipoOperacion = '-';
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
            pagina: pagIdHistorialTransaccionesTv,
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

    $scope.buscarHistorialTransacciones = function(indicador) {
        $scope.mostrarContenidoLineas = false;
        if (indicador == 1) {
            $scope.consultarHistorialTransaccionesCtr.obtenerLineas();
        } else if (indicador == 2) {
            $scope.consultarHistorialTransaccionesCtr.obtenerLinesFijas();
        } else {
            $scope.consultarHistorialTransaccionesCtr.obtenerSolicitudes(indiLoad);
        }
        actualizarProductoPrincipal($scope.consultarHistorialTransaccionesCtr.linea);
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
        requestActualizar.tipoClienteProductoPrincipal = WPSTipoCliente.corporativo;

        dataActualizar = $httpParamSerializer({ requestJson: angular.toJson(requestActualizar) });
        return dataActualizar;
    };

});

app.controller("DetalleConsultasOrdenDeServicioTecnicoController",
    function($scope, $location, $httpParamSerializer, $sessionStorage, consultasOrdenDeServicioTecnicoService, FileSaver, Blob) {


        this.detalleEstadoServicioTecnico = $sessionStorage.detalleEstadoServicioTecnicoSesion;
        var razonSocialExcel = $sessionStorage.razonSocialExcel;
        var clienteAuditoria = $sessionStorage.usuarioAudi;
        this.mostrarBotones = false;
        this.tipoPermisoAdministrador = 4;
        this.flagErrorCambiarEstado = false;

        $scope.mensaje_upps_titulo = WPSMensajeError.upps;
        $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
        $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

        var servicioParam = '';
        var estadoExito = 'SUCCESS';
        var estadoError = 'ERROR';
        var tipoProductoMovil = 'MOVIL';
        var pagIdOrdenServicioTecnicoConsumer = WPSPageID.miclaro_consumer_consultas_ordenserviciotecnico;
        var codOperacionAprobacion = WPSTablaOperaciones.aprobarOrdenServicioTecnico;
        var codOperacionRechazar = WPSTablaOperaciones.rechazarOredenServicioTecnico;
        var codOperacionExportarRepuestos = WPSTablaOperaciones.exportarReporteRepuestos;
        var codOperacionExportarAverias = WPSTablaOperaciones.exportarReporteAverias;
        var codOperacionConsulta = WPSTablaOperaciones.consultaOrdenServicioTecnico;
        var operacionCambiarEstado = 'cambiarEstadoOrdenServicioTecnico';
        var operacionExportarServicioTecnico = 'exportarReporteOrdenServicio';
        var operacionObtenerServicio = 'obtenerServicios';

        if (this.detalleEstadoServicioTecnico.estadoReparacion == "3") {
            var requestObtenerServicios = {
                categoria: WPSCategoria.movil,
                tipoLinea: WPSTipoLinea.todos,
                tipoCliente: WPSTipoCliente.consumer,
                idProductoServicio: this.detalleEstadoServicioTecnico.idProductoServicio,
                tipoPermiso: WPSTipoPermiso.administrador,
                idCuenta: null,
                idRecibo: null,
                idDireccion: "",
                nombreProducto: this.detalleEstadoServicioTecnico.linea,
                pagina: WPSpaginacion.pagina,
                cantResultadosPagina: WPSpaginacion.cantResultadosPagina,
                productoPrincipalXidRecibo: "false",
                titularidadServicio: 3

            };

            var dataObtenerServicios = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerServicios) });
            consultasOrdenDeServicioTecnicoService.getObtenerServicios(dataObtenerServicios).then(function(response) {

                var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {

                    
                    
                    var productosServiciosList = response.data.obtenerServiciosResponse.listadoProductosServicios;
                    var productoServicioListFinal = [];

                    if (angular.isArray(productosServiciosList)) {
                        productoServicioListFinal = productosServiciosList;
                    } else {
                        productoServicioListFinal.push(productosServiciosList);
                    }

                    var tipoPermiso = productoServicioListFinal[0].ProductoServicioResponse.tipoPermiso;


                    $scope.detalleConsultasOrdenDeServicioTecnicoCtr.tipoPermiso = tipoPermiso;
                    servicioParam = $scope.detalleConsultasOrdenDeServicioTecnicoCtr.detalleEstadoServicioTecnico.linea;
                } else {
                    var mensajeAuditoria = operacionObtenerServicio + "-" + mensajeServicio;
                    registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "LINEA");
                    $location.path("/errorWiew");
                }

            }, function(error) {});
        };

        this.cambiarEstadoReparacion = function(estadoParm) {
            var estadoNuevoParm;

            if (estadoParm == 0) {
                estadoNuevoParm = "2";
            } else if (estadoParm == 1) {
                estadoNuevoParm = "1";
            }

            var requestCambiarEstadoOrdenServicioTecnico = {
                idCuenta: null,
                idRecibo: null,
                idProductoServicio: null,
                idOrden: this.detalleEstadoServicioTecnico.idOrden,
                estadoNuevo: estadoNuevoParm
            };

            var dataCambiarEstadoOrdenServicioTecnico = $httpParamSerializer({ requestJson: angular.toJson(requestCambiarEstadoOrdenServicioTecnico) });

            consultasOrdenDeServicioTecnicoService.cambiarEstadoOrdenServicioTecnico(dataCambiarEstadoOrdenServicioTecnico).then(function(response) {

                var rpta = parseInt(response.data.cambiarEstadoOrdenServicioTecnicoResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.cambiarEstadoOrdenServicioTecnicoResponse.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.cambiarEstadoOrdenServicioTecnicoResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
                    var resultado = ("true" === response.data.cambiarEstadoOrdenServicioTecnicoResponse.resultado);
                    if (resultado) {
                        $scope.detalleConsultasOrdenDeServicioTecnicoCtr.flagErrorCambiarEstado = false;
                        $location.path("/");
                    }
                } else {
                    $scope.detalleConsultasOrdenDeServicioTecnicoCtr.flagErrorCambiarEstado = true;
                    var mensajeAuditoria = operacionCambiarEstado + "-" + mensajeServicio;
                    if (estadoNuevoParm == "1") {
                        registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "APROBAR");
                    } else if (estadoNuevoParm == "2") {
                        registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "RECHAZAR");
                    }
                    $location.path("/errorWiew");
                }
            }, function(error) {});
        };

        this.exportartReporteOrdenServicioTecnico = function(tipoReporteServicioTecnicoParam) {
            var montoTotal = 0;
            if (this.detalleEstadoServicioTecnico.listadoRepuestos != undefined && this.detalleEstadoServicioTecnico.listadoRepuestos != '') {
                for (i = 0; i < this.detalleEstadoServicioTecnico.listadoRepuestos.length; i++) {
                    var respuesto = this.detalleEstadoServicioTecnico.listadoRepuestos[i];
                    montoTotal = montoTotal + respuesto.costo;
                }
            }

            var requestExportarOrdenServicioTecnico = {
                tipoReporteServicioTecnico: tipoReporteServicioTecnicoParam,
                clienteRazonSocial: razonSocialExcel,
                cuenta: this.detalleEstadoServicioTecnico.cuentaNombreAlias,
                linea: this.detalleEstadoServicioTecnico.linea,
                numeroOrden: this.detalleEstadoServicioTecnico.numeroOrden,
                centroAtencion: this.detalleEstadoServicioTecnico.centroAtencion,
                marcaModelo: this.detalleEstadoServicioTecnico.marcaEquipo,
                garantia: this.detalleEstadoServicioTecnico.garantia,
                estado: this.detalleEstadoServicioTecnico.estadoReparacionDescripcion,
                monto: montoTotal
            };
            var dataExportarOrdenServicioTecnico = $httpParamSerializer({ requestJson: angular.toJson(requestExportarOrdenServicioTecnico) });

            consultasOrdenDeServicioTecnicoService.getExportarReporteOrdenServicio(dataExportarOrdenServicioTecnico).then(function(response) {
                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                var mensajeServicio = response.data.comunResponseType.defaultServiceResponse.mensaje;

                if (rpta == 0) {
                    var archivoBase64 = response.data.comunResponseType.archivo;
                    var wps_apple = false;
                    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

                    if (/iPad|Mac|iPhone|iPod/.test(userAgent) && !window.MSStream) {
                        wps_apple = true;
                    }

                    if (wps_apple) {
                        var urlbase64 = "data:application/CDFV2-encrypted;base64," + archivoBase64;
                        window.open(urlbase64, '_blank');
                    } else {
                        var reporteBlob = b64toBlob(archivoBase64, 'application/CDFV2-encrypted');
                        var nombreArchivo;

                        if (tipoReporteServicioTecnicoParam === 1) {
                            nombreArchivo = "reporteAverias.xls";
                        } else {
                            nombreArchivo = "reporteRepuestos.xls";
                        }

                        FileSaver.saveAs(reporteBlob, nombreArchivo);
                    }
                } else {
                    var mensajeAuditoria = operacionExportarServicioTecnico + "-" + mensajeServicio;
                    if (tipoReporteServicioTecnicoParam === 1) {
                        registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "AVERIA");
                    } else {
                        registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, "REPUESTO");
                    }
                    $location.path("/errorWiew");
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
        }

        function registrarAuditoriaError(rpta, idTransaccion, mensajeAuditoria, operacion) {
            var codOperacionAudi = '';
            if (operacion == 'LINEA') {
                codOperacionAudi = codOperacionConsulta;
            } else if ('APROBAR') {
                codOperacionAudi = codOperacionAprobacion;
            } else if ('RECHAZAR') {
                codOperacionAudi = codOperacionRechazar;
            } else if ('AVERIA') {
                codOperacionAudi = codOperacionExportarAverias;
            } else if ('REPUESTO') {
                codOperacionAudi = codOperacionExportarRepuestos;
            }
            guardarAuditoria(idTransaccion, estadoError, codOperacionAudi, mensajeAuditoria);
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
                tipoUsuario: clienteAuditoria,
                perfil: "-",
                monto: '',
                descripcionoperacion: mensajeAuditoria,
                responseType: "-"
            };

            var dataAuditoria = $httpParamSerializer({ requestJson: angular.toJson(requestAuditoria) });

            consultasOrdenDeServicioTecnicoService.enviarAuditoria(dataAuditoria).then(function(response) {}, function() {});
        };
    });

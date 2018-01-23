miClaroApp.controller("ControllerEnvioSMS",
    function($scope, $http, $timeout, $location, EnvioSMSService, ComunUsuarioSesionService) {

        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $scope.switchSelect = true;
        var AUDIT_EXITO = "SUCCESS";
        var AUDIT_ERROR = "ERROR";
        var urlInicio = WPSURLMiClaroRoot;
        var urlSwitch = "";
        $scope.usuarioSession = { tipoCliente: "", tipoClienteRequest: "", telefono: "", claroPuntos: 0, razonSocial: "" };

        _controllerEnvioSMS = this;
        $scope.SMSDiaResponse = { cantidadSMSxDia: 0, cantidadSMSEnviados: 0 };
        $scope.enviarSMSClaroResponse = { cantidadMensajesDisponibles: "" };
        $scope.showLabelSMSDia = true;
        $scope.listaMotivos = [];
        $scope.motivoSelecc;
        $scope.listaMensajes = [];
        $scope.mensajeSelecc;
        $scope.limiteMensajeOp = 30;
        $scope.numeroDestino = "";
        $scope.seudonimo = "";
        $scope.codigoCaptcha = "";
        $scope.showMensajeQuedan = false;
        $scope.showFormulario = false;
        $scope.showSinFormulario = false;
        $scope.showSelectorMixto = false;
        $scope.cantSMSEnviados = 0;
        $scope.showVistaHome = false;

        $scope.error_titulo = WPSMensajeError.error_titulo;
        $scope.error_descripcion01 = WPSMensajeError.error_descripcion01;
        $scope.error_descripcion02 = WPSMensajeError.error_descripcion02;
        $scope.ayCaramba = WPSMensajeError.exlamacion1;

        angular.element(document).ready(function() {
            asignarEventos();
            inicio();

        });

        $scope.switchChange = function() {
            window.location.replace(urlSwitch);
        };

        function inicio() {
            $scope.upps = WPSMensajeError.upps;
            $scope.mensaje1 = WPSMensajeError.mensaje1;
            $scope.mensaje2 = WPSMensajeError.mensaje2;
            $scope.mensaje5 = WPSMensajeError.mensaje5;
            cargarDatosUsuario().then(function() {
                cargarBanner();
                if (verificarUsuarioMixto()) {
                    seleccionarSwitch();
                }
            });
            cargarComboMotivos();
            cargarComboMensajes();
            cargarCaptcha();
            obtenerSMSDia().then(function() {

            });

        }

        function obtenerSMSDia() {
            return EnvioSMSService.obtenerCantidades().then(function(response) {
                var idRespuestaConsulta = response.data.obtenerCantidadesResponse.defaultServiceResponse.idRespuesta;


                if (idRespuestaConsulta == 0) {
                    $scope.SMSDiaResponse.cantidadSMSxDia = response.data.obtenerCantidadesResponse.cantidadMensajesMaximoDia
                    $scope.SMSDiaResponse.cantidadSMSEnviados = response.data.obtenerCantidadesResponse.cantidadMensajesEnviados;
                    $scope.cantSMSEnviados = response.data.obtenerCantidadesResponse.cantidadMensajesEnviados;
                    $scope.showLabelSMSDia = true;
                    if (parseInt($scope.SMSDiaResponse.cantidadSMSEnviados) == 0) {
                        $("#showMensajeQuedan").hide();
                    }
                    mostrarPantalla();
                } else if (idRespuestaConsulta == 4) {
                    $('#showSinFormulario').show();
                } else {
                    $scope.showLabelSMSDia = false;
                    $scope.showSinFormulario = true;
                    $('#showSinFormulario').hide();
                    $scope.flagServiciosFijo = -1;

                    manejarErrores(idRespuestaConsulta);
                }
            }, function(error) {


                $scope.showLabelSMSDia = false;
                $scope.errorTecnico = true;

            });
        }

        function mostrarPantalla() {
            if (parseInt($scope.SMSDiaResponse.cantidadSMSEnviados, 10) < parseInt($scope.SMSDiaResponse.cantidadSMSxDia, 10)) {
                $scope.showFormulario = true;
                $scope.showSinFormulario = false;
                $scope.disponible = parseInt($scope.SMSDiaResponse.cantidadSMSxDia - $scope.SMSDiaResponse.cantidadSMSEnviados);
                if ($scope.SMSDiaResponse.cantidadSMSEnviados > 0) {
                    $("#showMensajeQuedan").show();
                    $scope.SMSDiaResponse.cantidadSMSEnviados = true;
                }
            } else {
                $scope.showFormulario = false;
                $scope.showSinFormulario = true;
                $("#showMensajeQuedan").hide();
                $('#showSinFormulario').show();

            }
        }

        function cargarComboMotivos() {
            var motivo0 = { codigo: 0, descripcion: "Seleccionar", disabled: true };
            $scope.listaMotivos.push(motivo0);
            $scope.motivoSelecc = $scope.listaMotivos[0];
            for (var i = 0; i < motivosSMS.length; i++) {
                var motivo = {};
                motivo.codigo = i + 1;
                motivo.descripcion = motivosSMS[i];
                $scope.listaMotivos.push(motivo);
            };
        }

        function cargarCaptcha() {

            EnvioSMSService.obtenerCaptcha().then(function(response) {
                var captcha = response.data.comunResponseType.captcha;
                if (captcha != null) {
                    $("#captcha_image").attr('src', 'data:image/png;base64,' + captcha);
                }

            }, function(error) {

                $scope.errorTecnico = true;
                $scope.indCompraExito = false;


            });
        }

        this.recargarCaptcha = function() {
            cargarCaptcha();
        }
        this.seleccionarMotivo = function() {
            cargarComboMensajes();
        }
        this.seleccionarMensaje = function() {

        }

        function cargarComboMensajes() {
            var id = $scope.motivoSelecc.codigo;
            var array = $arrSMS[id];

            var mensaje0 = { codigo: 0, descripcion: "Seleccionar", disabled: true };
            $scope.listaMensajes.push(mensaje0);
            $scope.mensajeSelecc = $scope.listaMensajes[0];

            if (array != null && array != undefined) {
                $scope.listaMensajes = [];
                for (var i = 0; i < array.length; i++) {
                    var mensaje = {};
                    mensaje.codigo = i + 1;
                    mensaje.descripcion = array[i];
                    $scope.listaMensajes.push(mensaje);
                }
            }
        }

        this.enviarMensaje = function() {
            if (validar()) {
                enviarMensaje();
            }
        }

        function enviarMensaje() {
            var request = crearRequestEnviarSMS();
            EnvioSMSService.enviarSMSClaro(request).then(function(response) {
                var idRespuestaConsulta = response.data.enviarSMSClaroResponse.defaultServiceResponse.idRespuesta;
                var idTransaccional = response.data.enviarSMSClaroResponse.defaultServiceResponse.idTransaccional;
                var mensaje = response.data.enviarSMSClaroResponse.defaultServiceResponse.mensaje;
                $scope.enviarSMSClaroResponse = response.data.enviarSMSClaroResponse;

                if (idRespuestaConsulta == 0) {
                    abrirPopupExito();
                    $scope.showMensajeQuedan = true;
                    if ($scope.enviarSMSClaroResponse.cantidadMensajesDisponibles == 0) {
                        $scope.SMSDiaResponse.cantidadSMSEnviados = $scope.SMSDiaResponse.cantidadSMSxDia;
                        mostrarPantalla();
                    } else {

                    }
                    enviarAuditoria(request, $scope.enviarSMSClaroResponse, AUDIT_EXITO, '-');
                } else if (idRespuestaConsulta == 2) {
                    abrirPopupNoClaro();
                    enviarAuditoria(request, $scope.enviarSMSClaroResponse, AUDIT_EXITO, '-');
                } else if (idRespuestaConsulta == -998) {

                    $scope.codigoCaptcha = "";
                    mostrarErrorCaptcha();
                    enviarAuditoria(request, $scope.enviarSMSClaroResponse, AUDIT_ERROR, 'enviarSMSClaro - ' + mensaje);
                } else {
                    abrirPopupError();
                    enviarAuditoria(request, $scope.enviarSMSClaroResponse, AUDIT_ERROR, 'enviarSMSClaro - ' + mensaje);
                }

            }, function(error) {

                $scope.errorTecnico = true;


            });
        }

        function crearRequestEnviarSMS() {
            return {
                numeroDestino: $scope.numeroDestino,
                nombre: $scope.seudonimo,
                mensaje: document.getElementById("imensaje").value,
                codigoCaptcha: $scope.codigoCaptcha
            };
        }

        function cargarDatosUsuario() {
            return ComunUsuarioSesionService.obtenerDatosUsuario().then(function(response) {
                var idRespuestaConsulta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
                if (idRespuestaConsulta == 0) {
                    $("#showVistaHome").show();
                    var codTipoCliente = response.data.comunResponseType.tipoCliente;

                    if (WPSTipoCliente.mixto == codTipoCliente) {
                        var path = document.location.href;
                        if (path.indexOf("/consumer/") != -1) {
                            $scope.usuarioSession.tipoClienteRequest = WPSTipoCliente.consumer;
                        } else {
                            $scope.usuarioSession.tipoClienteRequest = WPSTipoCliente.corporativo;
                        }
                    } else {
                        $scope.usuarioSession.tipoClienteRequest = codTipoCliente;
                    }

                    $scope.usuarioSession.razonSocial = response.data.comunResponseType.razonSocial;
                } else {

                    $scope.flagServiciosFijo = -1;
                    $("#showVistaHome").hide();
                    $scope.errorFuncional = true;
                }
            }, function(error) {


                $scope.errorTecnico = true;

            });
        }

        function enviarAuditoria(request, response, estadoAudit, descripcion) {
            resquestAuditoria = crearRequestAudit($scope.usuarioSession, request, response, estadoAudit, descripcion);
            ComunUsuarioSesionService.enviarAuditoria(resquestAuditoria).then(function(response) {

            }, function(error) {

            });
        }



        function cargarBanner() {
            if ($scope.usuarioSession.tipoClienteRequest === WPSTipoCliente.consumer) {
                $(".big-ad").load("/wps/wcm/myconnect/Mi%20Claro%20Content%20Library/Mi%20Claro/Banners/Envio%20SMS%20Consumer");
            } else {
                $(".big-ad").load("/wps/wcm/myconnect/Mi%20Claro%20Content%20Library/Mi%20Claro/Banners/Envio%20SMS%20Corporativo");
            }
        }

        function seleccionarSwitch() {
            if ($scope.usuarioSession.tipoClienteRequest == WPSTipoCliente.corporativo) {
                $("#lblConsumer").attr("for", "itype1");
                $("#lblCorporativo").removeAttr("for");
                $scope.switchSelect = true;
                $scope.mensaje3 = WPSMensajeError.mensaje4;
                urlSwitch = "/wps/myportal/miclaro/consumer/otros/enviosmsgratis/";
            } else if ($scope.usuarioSession.tipoClienteRequest == WPSTipoCliente.consumer) {
                $("#lblCorporativo").attr("for", "itype1");
                $("#lblConsumer").removeAttr("for");
                $scope.switchSelect = false;
                $scope.mensaje3 = WPSMensajeError.mensaje3;
                urlSwitch = "/wps/myportal/miclaro/corporativo/otros/enviosmsgratis/";
            }
        }

        function verificarUsuarioMixto() {
            if ($scope.usuarioSession.tipoCliente == WPSTipoCliente.mixto) {
                $scope.showSelectorMixto = true;
                return true;
            } else {
                return false;
            }
        }

        function manejarErrores(idRespuestaConsulta) {
            if (idRespuestaConsulta > 0) {
                $scope.errorTecnico = false;
            } else {
                $scope.errorTecnico = true;
            }
            if ($scope.usuarioSession.tipoClienteRequest == 1) {
                $scope.msgErrorConsumer = WPSMensajeError.mensaje3;
            } else {
                $scope.msgErrorConsumer = WPSMensajeError.mensaje4;
            }
        }

        $('#btsmsaceptar').click(function() {
            var href = '';
            if ($scope.usuarioSession.tipoClienteRequest == WPSTipoCliente.corporativo) {
                href = '/wps/myportal/miclaro/corporativo/otros/enviosmsgratis';
            } else {
                href = '/wps/myportal/miclaro/consumer/otros/enviosmsgratis';
            }
            $(location).attr('href', href);
            ocultarPopUp();

        });

        $('.btsmsaceptarError').click(function() {
            ocultarPopUp();
        });



    });

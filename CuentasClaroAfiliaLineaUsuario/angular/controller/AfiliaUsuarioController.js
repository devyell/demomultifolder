var miClaroControllerV1 = angular.module('miClaroControllerV1', []);


miClaroControllerV1.controller('AfiliaUsuarioController', ['$scope', '$route', '$http', '$location', '$httpParamSerializer', 'AfiliaUsuarioService', function($scope, $route, $http, $location, $httpParamSerializer, AfiliaUsuarioService) {

    angular.element(document).ready(function() {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';


        var mensajeErrorConsumer = WPSMensajeError.upps + WPSMensajeError.mensaje1 + WPSMensajeError.mensaje2 + WPSMensajeError.mensaje3 + WPSMensajeError.mensaje5;
        var mensajeErrorCorporativo = WPSMensajeError.upps + WPSMensajeError.mensaje1 + WPSMensajeError.mensaje2 + WPSMensajeError.mensaje4 + WPSMensajeError.mensaje5;

        var formRec = $('#formAllLinkUser');
        var formRecSubmit = formRec.find('.btn-submit');
        var formRecError = formRec.find(".statusError");
        var phoneObj = formRec.find('.field-phone input');
        $scope.celular;
        $scope.sms;
        $scope.afiliaUsuario = [];
        $scope.tipoDocumento = '';
        $scope.numeroDocumento = '';
        $scope.estadoCelular = false;
        $scope.tipoLinea = '';
        $scope.mensajeError = '';
        $scope.tipoConsulta = '';
        var cantMaxCuentasAAfiliar = 0;

        inicio()

        function inicio() {
            if ($.cookie("CuentasClaroWPSRetornar")) {
                var wps_cookie = $.cookie('CuentasClaroWPSRetornar');
                AfiliaUsuarioService.urlsRetorno().then(function(response) {
                    var urlRetorno = response.data;
                    if (Array.isArray(urlRetorno)) {
                        $scope.urlRetorno = urlRetorno;
                    } else {
                        $scope.urlRetorno.push(urlRetorno);
                    }
                    var id = parseInt(obtenerIdUrl($scope.urlRetorno, wps_cookie));
                    $("#regresaClaro .icon-sh").addClass('icon-sh icon-sh_backArrow');
                    $("#regresaClaro").attr('href', $scope.urlRetorno[id].url);
                    $("#regresaClaro").html("<span class='icon-sh icon-sh_backArrow'></span>" + $scope.urlRetorno[id].textoInicialLink + " <strong>" + $scope.urlRetorno[id].nombreAplicacion + "</strong>");
                }, function(error) {

                });

            } else {
                $("#retornarClaro").css("height", "10px");
                $("#regresaClaro .icon-sh").removeClass('icon-sh icon-sh_backArrow');
                $("#regresaClaro").html("");
            }

            AfiliaUsuarioService.obtenerDatosUsuario().then(function(response) {
                response.data = response.data;
                $scope.tipoDocumento = response.data.comunResponseType.tipoDocumento;
                $scope.numeroDocumento = response.data.comunResponseType.numeroDocumento;
                $scope.tipoLinea = response.data.comunResponseType.tipoCliente;

                if ($scope.tipoLinea == WPSTipoCliente.consumer) {
                    $scope.mensajeError = mensajeErrorConsumer;
                    $scope.tipoLinea = WPSTipoCliente.consumer;
                } else if ($scope.tipoLinea == WPSTipoCliente.nocliente) {
                    $scope.mensajeError = mensajeErrorConsumer;
                    $scope.tipoLinea = WPSTipoCliente.consumer;
                } else if ($scope.tipoLinea == WPSTipoCliente.mixto) {
                    $scope.mensajeError = mensajeErrorCorporativo;
                    $scope.tipoLinea = WPSTipoCliente.mixto;
                    $scope.tipoConsulta = '1';
                } else {
                    $scope.mensajeError = mensajeErrorCorporativo;
                    $scope.tipoLinea = WPSTipoCliente.corporativo;

                }


            }, function(response) {
                $(".statusErrorInicio").append(mensajeError);
                $("#formAllLinkUser").hide();


            });

        }


        formRec.find(".type-number").keyup(function() {
            var valueField = $(this).val();

            this.value = this.value.replace(/[^0-9]/, '');

            if (valueField.length == 9) {
                formRecSubmit.removeAttr("disabled");
            } else {
                formRecSubmit.attr("disabled", "disabled");
            }
        });


        formRec.find('.field-sms input').keyup(function() {

            var valueField = $scope.sms;

            if (valueField.length == 6) {
                formRecSubmit.removeAttr("disabled");
            } else {
                formRecSubmit.attr("disabled", "disabled");
            }
        });



        var estado = 0;
        $scope.continuar = function() {

            var phoneVal = $scope.celular;
            var errorTot = 0;
            if (estado == 0) {
                var requestCantMax = {
                    tipoOperacion: '1'
                }
                requestCantMax = $httpParamSerializer({ requestJson: angular.toJson(requestCantMax) });
                AfiliaUsuarioService.administrarCantMaxCuentasAAfiliar(requestCantMax).then(function(response) {
                    var errorFuncional = response.data.administrarCantMaxCuentasAAfiliarResponse.defaultServiceResponse.idRespuesta;
                    var idTransaccionalerrorFuncional = response.data.administrarCantMaxCuentasAAfiliarResponse.defaultServiceResponse.idTransaccional;
                    if (errorFuncional == 0) {
                        cantMaxCuentasAAfiliar = response.data.administrarCantMaxCuentasAAfiliarResponse.cantMaxCuentas;
                        var obtenerServiciosRequest = {
                            categoria: WPSCategoria.movil,
                            tipoLinea: WPSTipoLinea.todos,
                            tipoCliente: $scope.tipoLinea,
                            idProductoServicio: null,
                            tipoPermiso: WPSTipoPermiso.todos,
                            idCuenta: null,
                            idRecibo: null,
                            idDireccion: null,
                            direccionCompleta: null,
                            pagina: '0',
                            cantResultadosPagina: '0',
                            productoPrincipalXidRecibo: 'false',
                            titularidadServicio: WPSTitularidadServicio.soloServicioUsuarioAfiliado
                        }
                        serviciosRequest = $httpParamSerializer({ requestJson: angular.toJson(obtenerServiciosRequest), tipoConsulta: $scope.tipoConsulta });
                        AfiliaUsuarioService.obtenerServicios(serviciosRequest).then(function(response) {
                            var serviciosList = response.data.obtenerServiciosResponse.listadoProductosServicios;
                            var errorFuncional = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
                            var idTransaccionalerrorFuncional = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
                            var cantidad = 0;
                            if (serviciosList != null || typeof serviciosList != 'undefined') {
                                if (!Array.isArray(serviciosList)) {
                                    serviciosList = [];
                                    serviciosList.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                                }
                                cantidad = serviciosList.length;
                            }
                            if (errorFuncional == 0 || errorFuncional == 3) {
                                if (cantidad < cantMaxCuentasAAfiliar) {
                                    var datos = { numeroCelular: $scope.celular };
                                    $("#loader").show();
                                    requestObtenerRecibo = $httpParamSerializer({ requestJson: angular.toJson(datos) });
                                    AfiliaUsuarioService.validarAfiliacion(requestObtenerRecibo).then(function(response) {
                                        $scope.afiliaUsuario = response.data;
                                        formRec.find('.error-field').removeClass('error-field');
                                        formRecError.hide();
                                        var idRespuesta = response.data.validarAfiliacionResponse.defaultServiceResponse.idRespuesta;

                                        if (response.data.validarAfiliacionResponse.defaultServiceResponse.idRespuesta == '0') {
                                            var smsBlock = formRec.find('.smsBlock');
                                            $scope.estadoCelular = true;
                                            smsBlock.removeClass('hidden');
                                            if (smsBlock.hasClass('hidden')) {
                                                phoneObj.attr('disabled', 'disabled');
                                                formRec.attr('disabled', 'disabled');
                                                smsBlock.removeClass('hidden');
                                            }
                                            estado = 1;
                                            var ResquestAuditoria = {
                                                operationCode: WPSTablaOperaciones.afiliarCelular,
                                                pagina: WPSPageID.cuentasclaro_afilialineausuaria,
                                                transactionId: response.data.validarAfiliacionResponse.defaultServiceResponse.idTransaccional,
                                                estado: 'SUCCESS',
                                                servicio: $scope.celular,
                                                tipoProducto: 'MOVIL',
                                                tipoLinea: '5',
                                                tipoUsuario: $scope.tipoLinea,
                                                perfil: '-',
                                                monto: '',
                                                descripcionoperacion: '-',
                                                responseType: '/'
                                            };
                                            auditoria(ResquestAuditoria);
                                        } else if (parseInt(idRespuesta) < 0) {
                                            
                                            phoneObj.addClass('error-field');
                                            formRecError.html('<span class="icon-sh"></span>' + $scope.mensajeError);
                                            formRecError.show();
                                            var ResquestAuditoria = {
                                                operationCode: WPSTablaOperaciones.afiliarCelular,
                                                pagina: WPSPageID.cuentasclaro_afilialineausuaria,
                                                transactionId: response.data.validarAfiliacionResponse.defaultServiceResponse.idTransaccional,
                                                estado: 'ERROR',
                                                servicio: $scope.celular,
                                                tipoProducto: 'MOVIL',
                                                tipoLinea: '5',
                                                tipoUsuario: $scope.tipoLinea,
                                                perfil: '-',
                                                monto: '',
                                                descripcionoperacion: 'validarAfiliacion -' + response.data.validarAfiliacionResponse.defaultServiceResponse.mensaje,
                                                responseType: ''
                                            };
                                            auditoria(ResquestAuditoria);
                                        } else if (idRespuesta == 1) {
                                            
                                            errorTot++
                                            phoneObj.addClass('error-field');
                                            formRecError.html('<span class="icon-sh"></span>' + WPSValidarAfiliacion.MENSAJEIDF01);
                                        } else if (idRespuesta == 3) {
                                            errorTot++
                                            phoneObj.addClass('error-field');
                                            formRecError.html('<span class="icon-sh"></span>' + WPSValidarAfiliacion.MENSAJEIDF03);
                                        } else if (idRespuesta == 6) {
                                            errorTot++
                                            phoneObj.addClass('error-field');
                                            formRecError.html('<span class="icon-sh"></span>' + WPSValidarAfiliacion.MENSAJEIDF06);
                                        }

                                        if ($scope.tipoLinea == WPSTipoCliente.consumer) {
                                            if (idRespuesta == 4) {
                                                errorTot++
                                                phoneObj.addClass('error-field');
                                                formRecError.html('<span class="icon-sh"></span>' + WPSValidarAfiliacion.MENSAJEIDF04CONSUMER);
                                            }
                                        } else {
                                            if (idRespuesta == 4) {
                                                errorTot++
                                                phoneObj.addClass('error-field');
                                                formRecError.html('<span class="icon-sh"></span>' + WPSValidarAfiliacion.MENSAJEIDF04CORPORATIVO);
                                            }
                                        }
                                        if (errorTot > 0) {
                                            formRecError.show();
                                            var ResquestAuditoria = {
                                                operationCode: WPSTablaOperaciones.afiliarCelular,
                                                pagina: WPSPageID.cuentasclaro_afilialineausuaria,
                                                transactionId: response.data.validarAfiliacionResponse.defaultServiceResponse.idTransaccional,
                                                estado: 'ERROR',
                                                servicio: $scope.celular,
                                                tipoProducto: 'MOVIL',
                                                tipoLinea: '5',
                                                tipoUsuario: $scope.tipoLinea,
                                                perfil: '-',
                                                monto: '',
                                                descripcionoperacion: 'validarAfiliacion - ' + response.data.validarAfiliacionResponse.defaultServiceResponse.mensaje,
                                                responseType: ''
                                            };
                                            auditoria(ResquestAuditoria);
                                        }
                                        $("#loader").hide();
                                    }, function(response) {
                                        phoneObj.addClass('error-field');
                                        formRecError.html('<span class="icon-sh"></span>' + $scope.mensajeError);
                                        formRecError.show();
                                        $("#loader").hide();

                                    });
                                } else {
                                    phoneObj.addClass('error-field');
                                    formRecError.html('<span class="icon-sh"></span>' + WPSValidarAfiliacion.MENSAJEMAXIMO);
                                    formRecError.show();
                                }
                            } else {
                                phoneObj.addClass('error-field');
                                formRecError.html('<span class="icon-sh"></span>' + $scope.mensajeError);
                                formRecError.show();
                                $("#loader").hide();
                            }
                        }, function(response) {

                        });
                    } else {
                        phoneObj.addClass('error-field');
                        formRecError.html('<span class="icon-sh"></span>' + $scope.mensajeError);
                        formRecError.show();
                        $("#loader").hide();
                    }
                }, function(response) {

                });
            }


            if (estado == 1) {
                formRec.find('.error-field').removeClass('error-field');
                formRecError.hide();
                var smsBlock = formRec.find('.smsBlock');
                if (smsBlock.hasClass('hidden')) {
                    phoneObj.attr('disabled', 'disabled');
                    formRec.attr('disabled', 'disabled');
                    smsBlock.removeClass('hidden');
                } else {
                    var smsObj = formRec.find('.field-sms input');
                    var smsVal = $scope.sms;
                    var datos = {
                        numeroCelular: $scope.celular,
                        tipoCliente: $scope.tipoLinea,
                        codigoSecreto: $scope.sms
                    };
                    requestAfiliarCelular = $httpParamSerializer({ requestJson: angular.toJson(datos) });
                    AfiliaUsuarioService.afiliarCelular(requestAfiliarCelular).then(function(response) {
                        if (parseInt(response.data.afiliarCelularResponse.defaultServiceResponse.idRespuesta) < 0) {
                            errorTot++
                            smsObj.addClass('error-field');
                            formRecError.html('<span class="icon-sh"></span>' + $scope.mensajeError);
                            var ResquestAuditoria = {
                                operationCode: WPSTablaOperaciones.afiliarCelular,
                                pagina: WPSPageID.cuentasclaro_afilialineausuaria,
                                transactionId: response.data.validarAfiliacionResponse.defaultServiceResponse.idTransaccional,
                                estado: 'ERROR',
                                servicio: $scope.celular,
                                tipoProducto: 'MOVIL',
                                tipoLinea: '5',
                                tipoUsuario: $scope.tipoLinea,
                                perfil: '-',
                                monto: '',
                                descripcionoperacion: 'validarAfiliacion - ' + response.data.validarAfiliacionResponse.defaultServiceResponse.mensaje,
                                responseType: ''
                            };
                            auditoria(ResquestAuditoria);
                        } else if (parseInt(response.data.afiliarCelularResponse.defaultServiceResponse.idRespuesta) == 2) {
                            errorTot++
                            smsObj.addClass('error-field');
                            formRecError.html('<span class="icon-sh"></span>' + WPSAfiliacionCelular.MENSAJEIDF02);
                        } else if (parseInt(response.data.afiliarCelularResponse.defaultServiceResponse.idRespuesta) == 3) {
                            errorTot++
                            smsObj.addClass('error-field');
                            formRecError.html('<span class="icon-sh"></span>' + WPSAfiliacionCelular.MENSAJEIDF03);
                        } else {
                            $location.path('/AfiliaUsuarioOk');
                            var ResquestAuditoria = {
                                operationCode: WPSTablaOperaciones.afiliarCelular,
                                pagina: WPSPageID.cuentasclaro_afilialineausuaria,
                                transactionId: response.data.validarAfiliacionResponse.defaultServiceResponse.idTransaccional,
                                estado: 'SUCCESS',
                                servicio: $scope.celular,
                                tipoProducto: 'MOVIL',
                                tipoLinea: '5',
                                tipoUsuario: $scope.tipoLinea,
                                perfil: '-',
                                monto: '',
                                descripcionoperacion: '-',
                                responseType: ''
                            };
                            auditoria(ResquestAuditoria);
                        }
                        if (errorTot > 0) {
                            formRecError.show();
                            if (errorTot > 1) {
                                formRecError.html('<span class="icon-sh"></span>' + WPSAfiliacionCelular.MENSAJEERROR);
                                var ResquestAuditoria = {
                                    operationCode: WPSTablaOperaciones.afiliarCelular,
                                    pagina: WPSPageID.cuentasclaro_afilialineausuaria,
                                    transactionId: response.data.validarAfiliacionResponse.defaultServiceResponse.idTransaccional,
                                    estado: 'ERROR',
                                    servicio: $scope.celular,
                                    tipoProducto: 'MOVIL',
                                    tipoLinea: '5',
                                    tipoUsuario: $scope.tipoLinea,
                                    perfil: '-',
                                    monto: '',
                                    descripcionoperacion: 'validarAfiliacion - ' + response.data.validarAfiliacionResponse.defaultServiceResponse.mensaje,
                                    responseType: ''
                                };
                                auditoria(ResquestAuditoria);
                            }
                        }
                    }, function(response) {
                        $(".statusErrorInicio").append($scope.mensajeError);
                        $("#formAllLinkUser").hide();


                    });
                }
            }
        };


        $('#idSms').keyup(function() {
            $("#idSms").removeClass("error-field");
        });

        function auditoria(ResquestAuditoria) {
            ResquestAuditoria = $httpParamSerializer({ requestJson: angular.toJson(ResquestAuditoria) });
            AfiliaUsuarioService.enviarAuditoria(ResquestAuditoria).then(function(response) {}, function(response) {


            });
        }

        $scope.enviarToken = function() {
            var datos = {
                tipo: '4',
                tipoEnvio: '2',
                tipoDocumento: $scope.tipoDocumento,
                numeroDocumento: $scope.numeroDocumento,
                mailCelEnvio: $scope.celular
            };
            $("#loader").show();
            $("#statusError").hide();
            requestObtenerRecibo = $httpParamSerializer({ requestJson: angular.toJson(datos) });
            AfiliaUsuarioService.enviarCodigoSecreto(requestObtenerRecibo).then(function(response) {
                var mensaje = response.data.enviarCodigoSecretolResponse.mensajeRespuesta;
                if (parseInt(response.data.enviarCodigoSecretolResponse.defaultServiceResponse.idRespuesta) == 0) {
                    $("#loader").hide();
                    $("#idSms").focus();

                } else {
                    var smsObj = formRec.find('.field-sms input');
                    smsObj.addClass('error-field');
                    formRecError.html('<span class="icon-sh"></span>' + $scope.mensajeError);
                    formRecError.show();
                    $("#loader").hide();
                }

            }, function(response) {

            });
        }

        function obtenerIdUrl(arr, obj) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].idLink == obj) {
                    return i;
                }
            }
        }

    })

}]);
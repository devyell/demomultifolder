app.controller("mycontroller", function ($scope, $http, $httpParamSerializer, CapaService) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    $scope.date = new Date();
    var anio = (new Date()).getFullYear();

    $scope.lsMovimiento = [];
    var tramaAuditoria = {
        operationCode: 'T0029',
        pagina: 'P017',
        transactionId: null,
        estado: '',
        servicio: '-',
        tipoProducto: '-',
        tipoLinea: '-',
        tipoUsuario: '-',
        perfil: '-',
        monto: '',
        descripcionoperacion: '-',
        responseType: '/'
    };

    CapaService.getObtenerDatosSesion().then(function (response) {
        tramaAuditoria.tipoUsuario = response.data.comunResponseType.tipoCliente;
        $scope.tipoClienteUsuario = response.data.comunResponseType.tipoCliente;

        $scope.emailCanje = response.data.comunResponseType.usuarioVinculado;
        $scope.telefono = response.data.comunResponseType.telefono;
        $scope.tipoDocumento = response.data.comunResponseType.tipoDocumento;
        $scope.tipoLineaReq = response.data.comunResponseType.tipoLinea;

        if ($scope.tipoClienteUsuario == 4) {
            $scope.showSwitch = true;
        }
        obtenerClaroPunto();
    });

    var estado = 0;

    function obtenerClaroPunto() {
        CapaService.obtenerClaroPuntosRS().then(function (response) {

            $("#show_error_mis_puntos_claro_club").hide();
            var id_respuesta2 = response.data.obtenerClaroPuntosResponse.defaultServiceResponse.idRespuesta;
            var idTransaccional = response.data.obtenerClaroPuntosResponse.defaultServiceResponse.idTransaccional;
            var mensaje = response.data.obtenerClaroPuntosResponse.defaultServiceResponse.mensaje;

            tramaAuditoria.transactionId = idTransaccional;

            if (id_respuesta2 == 0 || id_respuesta2 == 1) {

                estado = estado + 1;
                $scope.rs_claroPuntos = response.data.obtenerClaroPuntosResponse.claroPuntos;
                $scope.rs_claroPuntosPorVencer = response.data.obtenerClaroPuntosResponse.claroPuntosPorVencer;
                $scope.rs_claroPuntosFechaVencimiento = response.data.obtenerClaroPuntosResponse.claroPuntosFechaVencimiento.substr(0, 10);

                if ($scope.rs_claroPuntos == "") {
                    $scope.rs_claroPuntos = 0;
                }

                if ($scope.rs_claroPuntosPorVencer == "") {
                    $scope.rs_claroPuntosPorVencer = 0;
                }

                if ($scope.rs_claroPuntosFechaVencimiento == "") {
                    $scope.rs_claroPuntosFechaVencimiento = "";
                } else {
                    $("#rs_claroPuntosFechaVencimiento").show();
                }

                $scope.puntosCanjear = $scope.rs_claroPuntos;
                
                document.getElementById("validPuntos").value = $scope.puntosCanjear;

                if ($scope.rs_claroPuntos == 0) {
                    $('#puntos').attr('disabled', 'disabled');
                }

                var claropuntos = response.data.obtenerClaroPuntosResponse.claroPuntos;
                if (claropuntos != 0) {
                    $("#show_botoncanjear").show();
                }
                tramaAuditoria.estado = "SUCCESS";
                tramaAuditoria.descripcionoperacion = "-";
                $scope.pushAuditoria();

                $("#show_puntos").show();
                $("#divCanejClaroPuntosMillas").show();
                obtenerMovimientosClaroPuntos();

            } else {

                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "obtenerClaroPuntos - " + mensaje;
                $scope.pushAuditoria();
                $(".masdetalle20").hide();
                $(".masdetalle30").hide();

                $("#divCanejClaroPuntosMillas").hide();
                $("#ultimoMovimiento").hide();
                $("#movimientoPuntos").hide();
                $("#show_panel").show();

                $("#show_error_mis_puntos_claro_club").show();

            }
        });
    }

    function obtenerMovimientosClaroPuntos() {
        CapaService.obtenerMovimientosClaroPuntosRS().then(function (response) {

            var mensaje1 = response.data.obtenerMovimientosClaroPuntosResponse.defaultServiceResponse.mensaje;
            var id_respuesta = response.data.obtenerMovimientosClaroPuntosResponse.defaultServiceResponse.idRespuesta;
            var idTransaccional = response.data.obtenerMovimientosClaroPuntosResponse.defaultServiceResponse.idTransaccional;
            tramaAuditoria.transactionId = idTransaccional;

            if (id_respuesta == 0 || id_respuesta == 3) {
                estado = estado + 1;
                $scope.lsMovimiento = response.data.obtenerMovimientosClaroPuntosResponse.listadoMovimientos;
                if (!Array.isArray($scope.lsMovimiento)) {
                    $scope.lsMovimiento = [];
                    $scope.lsMovimiento.push(response.data.obtenerMovimientosClaroPuntosResponse.listadoMovimientos);
                } else {
                    if (($scope.lsMovimiento).length > 30) {
                        $(".masdetalle30").show();
                    }
                    if (($scope.lsMovimiento).length > 20) {
                        $(".masdetalle20").show();
                    }
                }  
                $("#show_panel").show();
                $("#ultimoMovimiento").show();

            } else {

                $("#show_panel").show();
                $("#show_error_mis_puntos_claro_club").show();

                if (estado == 0) {
                    $("#show_panel").hide();
                } else if (estado == 1) {
                    $("#show_panel").show();
                    $("#show_sin_movimientos").hide();
                    $("#ultimoMovimiento").hide();
                    $("#movimientoPuntos").hide();

                }
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "obtenerMovimientosClaroPuntos - " + mensaje1;
                $scope.pushAuditoria();
            }
        });

    }

    $scope.canjearPuntos = function () {

        var canjearPuntosRequest = {
            telefono: $scope.telefono,
            idSocio: $scope.idSocio,
            apeSocio: $scope.apeSocio,
            nomSocio: $scope.nomSocio,
            tipoDoc: $scope.tipoDocumento,
            tipoDocLatam: $scope.tipoDocConvenio,
            numDoc: $scope.numDoc,
            kmLatam: $scope.millasCanjear,
            anio: anio,
            tipoLinea: $scope.tipoLineaReq,
            codCliente: null,
            correo: $scope.emailCanje
        };

        let requestCanjearPuntos = $httpParamSerializer({ requestJson: angular.toJson(canjearPuntosRequest) });
        CapaService.canjearClaroPuntos(requestCanjearPuntos).then(function (response) {

            var idRespPuntos = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            var mensajeCanjePuntos = response.data.comunResponseType.defaultServiceResponse.mensaje;
            var idTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            tramaAuditoria.transactionId = idTransaccional;

            if (idRespPuntos == 0) {
                $("#show_panel").hide();
                $('.popConvertirMillas').hide();
                $(".confirmacionCanjeMillas").show();
            } if (idRespPuntos == 3) {
                $('.convertirMillas').hide();
                $(".insuficientesMillas").show();
            } else {
                $('.convertirMillas').hide();
                $(".errorCanjeMillas").show();

                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "canjearClaroPuntos - " + mensajeCanjePuntos;
                tramaAuditoria.operationCode = 'T0116';
                $scope.pushAuditoria();
            }

            if(idRespPuntos == 0 || idRespPuntos == 3){
                tramaAuditoria.estado = "SUCCESS";
                tramaAuditoria.descripcionoperacion = "-";
                tramaAuditoria.operationCode = 'T0116';
                $scope.pushAuditoria();
            }

        });

    }

    $scope.canjearMillasLatam = function () {

        var canjearMillasRequest = {
            telefono: $scope.telefono,
            idSocio: $scope.idSocio,
            apeSocio: $scope.apeSocio,
            nomSocio: $scope.nomSocio,
            tipoDoc: $scope.tipoDocumento,
            tipoDocLatam: $scope.tipoDocConvenio,
            numDoc: $scope.numDoc,
            claroPuntos: $scope.puntosCanjear,
            tipoLinea: $scope.tipoLineaReq,
            correo: $scope.emailCanje
        };

        let requestCanjearMillas = $httpParamSerializer({ requestJson: angular.toJson(canjearMillasRequest) });
        CapaService.canjearMillasLatam(requestCanjearMillas).then(function (response) {

            var idRespMillas = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            var mensajeCanjeMillas = response.data.comunResponseType.defaultServiceResponse.mensaje;
            var idTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            tramaAuditoria.transactionId = idTransaccional;

            if (idRespMillas == 0) {
                $("#show_panel").hide();
                $('.popConvertirPuntos').hide();
                $(".confirmacionCanjeClaroPuntos").show();
            } else if (idRespMillas == 2) {
                $('.convertirPuntos').hide();
                $(".insuficientesPuntos").show();
            } else if (idRespMillas == 3){
                $('.convertirPuntos').hide();
                $(".errorCanjeRepetido").show();
            } else {
                $('.convertirPuntos').hide();
                $(".errorCanjePuntos").show();

                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "canjearMillasLatam - " + mensajeCanjeMillas;
                tramaAuditoria.operationCode = 'T0115';
                $scope.pushAuditoria();
            }

            if(idRespMillas == 0 || idRespMillas == 2 || idRespMillas == 3){
                tramaAuditoria.estado = "SUCCESS";
                tramaAuditoria.descripcionoperacion = "-";
                tramaAuditoria.operationCode = 'T0115';
                $scope.pushAuditoria();
            }

        });
    }

    $scope.consultarMillas = function () {

        var canjearMillasRequest = {
            telefono: $scope.telefono,
            idSocio: $scope.idSocio,
            apeSocio: $scope.apeSocio,
            nomSocio: $scope.nomSocio,
            tipoDoc: $scope.tipoDocumento,
            tipoDocLatam: $scope.tipoDocConvenio,
            numDoc: $scope.numDoc,
            anio: anio,
            correo: $scope.emailCanje
        };

        let requestCanjearMillas = $httpParamSerializer({ requestJson: angular.toJson(canjearMillasRequest) });
        CapaService.consultarMillas(requestCanjearMillas).then(function (response) {

            var FlagConsutarMillas = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            var mensajeConsultaMillas = response.data.comunResponseType.defaultServiceResponse.mensaje;
            var idTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            tramaAuditoria.transactionId = idTransaccional;

            
            if (FlagConsutarMillas == 0){

                tramaAuditoria.estado = "SUCCESS";
                tramaAuditoria.descripcionoperacion = "-";
                tramaAuditoria.operationCode = 'T0114';
                $scope.pushAuditoria();

            } else {

                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "consultarMillas - " + mensajeConsultaMillas;
                tramaAuditoria.operationCode = 'T0114';
                $scope.pushAuditoria();
            }

        });
    }

    $scope.obtenerSocioConvenio = function (flag) {

        CapaService.getSocioConvenio().then(function (response) {

            var FlagSocioConvenio = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            var mensajeSocioConvenio = response.data.comunResponseType.defaultServiceResponse.mensaje;
            var idTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
            tramaAuditoria.transactionId = idTransaccional;

            if (FlagSocioConvenio == 0) {

                $scope.apeSocio = response.data.comunResponseType.datosSocio.apeSocio;
                $scope.nomSocio = response.data.comunResponseType.datosSocio.nomSocio;
                $scope.idSocio = response.data.comunResponseType.datosSocio.idSocio;
                $scope.numDoc = response.data.comunResponseType.datosSocio.numDoc;
                $scope.tipoDocConvenio = response.data.comunResponseType.datosSocio.tipoDocConvenio;

                if (flag == 1) {
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                    $('.popConvertirPuntos').fadeIn();
                } else if (flag == 2) {
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                    $('.popConvertirMillas').fadeIn();
                } else {
                    $("html, body").animate({ scrollTop: 0 }, "slow");
                    $('.consultaMillas').fadeIn();
                    $scope.consultarMillas();
                }
            } else if (FlagSocioConvenio == 1) {
                $("html, body").animate({ scrollTop: 0 }, "slow");
                $('.errorNoSocio').fadeIn();
            } else {
                $("html, body").animate({ scrollTop: 0 }, "slow");
                $('.popErrorSocio').fadeIn();

                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "getSocioConvenio - " + mensajeSocioConvenio;
                tramaAuditoria.operationCode = 'T0113';
                $scope.pushAuditoria();
            }
        });
    }

    $scope.resetPopPuntos = function () {
        $scope.closePop();
        $(".errorCanjePuntos").hide();
        $(".insuficientesPuntos").hide();
        $(".errorCanjeRepetido").hide();
        $('.convertirPuntos').fadeIn(500);
    }

    $scope.resetPopMillas = function () {
        $scope.closePop();
        $(".errorCanjeMillas").hide();
        $(".insuficientesMillas").hide();
        $('.convertirMillas').fadeIn(500);
    }

    $scope.reload = function () {
        window.location.replace("/wps/myportal/miclaro/consumer/consultas/puntosclaroclub/");
    }

    $scope.printDiv = function (divName) {
        window.print();
    }


    $scope.init_mis_puntos_claro = function () {
        obtenerClaroPunto();
    }

    $scope.pushAuditoria = function () {
        request = $httpParamSerializer({ requestJson: angular.toJson(tramaAuditoria) });
        CapaService.enviarAuditoria(request).then(function (response) {
        }, function (error) {
        });
    };

    $scope.switchChange = function () {
        window.location.replace("/wps/myportal/miclaro/corporativo/consultas/puntosclaroclub/");
    }


    $scope.showpopPuntos = function () {
        $(".popupPuntos").fadeIn();
        $("html, body").animate({ scrollTop: 0 }, "slow");

    }


    $scope.showpopMillas = function () {
        $(".showmillaspop").fadeIn();
        $("html, body").animate({ scrollTop: 0 }, "slow");

    }

    $scope.showmillaspop = function () {
        $(".pop-millas").fadeIn();
        $("html, body").animate({ scrollTop: 0 }, "slow");

    }

    $scope.closePop = function () {
        $('.popup').hide();
    }


    $scope.showUpss = function () {
        $(".upss").fadeIn();
        $("html, body").animate({ scrollTop: 0 }, "slow");
    }



    $('#validMillas').keyup(function () {

        var checkNum = parseInt($('#validMillas').val());



        if (checkNum === 0 || isNaN(checkNum)) {
            $('#millas').attr('disabled', 'disabled');
        } else {
            $('#millas').removeAttr('disabled');
        }

        $(this).val($(this).val().replace(/\D/g, ''));
    });

    $('#validPuntos').keyup(function () {

        var checkNum = parseInt($('#validPuntos').val());



        if (checkNum === 0 || isNaN(checkNum)) {
            $('#puntos').attr('disabled', 'disabled');
        } else {
            if(checkNum > $scope.rs_claroPuntos){
                $("#validPuntos").val('');
            } else {
                $('#puntos').removeAttr('disabled');
            }
            


        }

        $(this).val($(this).val().replace(/\D/g, ''));
    });

    $("#validPuntos").keyup(function (event) {

        if ($scope.rs_claroPuntos < $scope.puntosCanjear) {
            $(this).val($(this).val().replace(/[0-9]+/, ''));
            $('#puntos').attr('disabled', 'disabled');
        }
    })

    $('#validPuntos').on('input', function () {
        $(this).val($(this).val().replace(/\D/g, ''));
        $(this).val($(this).val().replace(/^0+/, ''));
    });

    $('#validMillas').on('input', function () {
        $(this).val($(this).val().replace(/\D/g, ''));
        $(this).val($(this).val().replace(/^0+/, ''));
    });

    $scope.pasteNumberPuntos = function (event) {

        var pastedData = event.originalEvent.clipboardData.getData('text/plain');

        var checkNum = parseInt(pastedData);

        if (checkNum === 0 || isNaN(checkNum)) {

            $('#puntos').attr('disabled', 'disabled');
        } else {
            if(checkNum > $scope.puntosCanjear){
                $('#validPuntos').val('');
            } else {
                $('#puntos').removeAttr('disabled');
            }
        }

        event.stopPropagation();
        event.preventDefault();

        $('#validPuntos').val('');
        $('#validPuntos').val(pastedData.replace(/\D/g, ''));
    }

    $scope.pasteNumberMillas = function (event) {
        var pastedData = event.originalEvent.clipboardData.getData('text/plain');

        var checkNum = parseInt(pastedData);

        if (checkNum === 0 || isNaN(checkNum)) {
            $('#millas').attr('disabled', 'disabled');
        } else {
            $('#millas').removeAttr('disabled');
        }

        event.stopPropagation();
        event.preventDefault();

        $('#validMillas').val('');
        $('#validMillas').val(pastedData.replace(/\D/g, ''));
    }

    $(document).ready(function () {
        if ($('.txtmonto6').length > 0) {
            $('.txtmonto6').attr('maxlength', '9');

        }
        if ($('.txtmonto6').length > 0) {
            document.oncontextmenu = function () { return false }
        }
        $(".txtmonto6").keyup(function (event) {

            if ($scope.rs_claroPuntos < $scope.puntosCanjear) {
                $(this).val($(this).val().replace(/[0-9]+/, ''));
            }

            if ($(this).val().length > 9) {
                $(this).val($(this).val().substring(0, $(this).val().length - 1));
            }
            var regex = new RegExp("[0-9]");
            if (!regex.test($(this).val().substr($(this).val().length - 1, 1))) {
                if ($(this).val().length > 0) {
                    $(this).val($(this).val().substring(0, $(this).val().length - 1));
                }
            }

        });

        if (navigator.userAgent.match(/(iPod|iPhone|iPad)/)) {
            $(".modal").css('position', 'relative');
        }

        $('.txtmonto6').change(function () {
            $('.txtmonto6').each(function (i, item) {
                $(item).val($(item).val().replace(/\D/g, ''));
                $(item).val($(item).val().substring(0, 6))
            });

            $('.txtmonto6').check();

        });
    });

});
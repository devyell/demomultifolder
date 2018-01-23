var appControllerMasivo = angular.module('miClaroControllerMasivo', []);

appControllerMasivo.controller("confirmarMasivo", function($scope, $http, $httpParamSerializer, $localStorage, $timeout, managerservice) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var $currTerminos = undefined;
    angular.element(document).ready(function() {


        $('#btcanceltope').click(function() {
            var href = '/wps/myportal/miclaro/corporativo/cambiartopeconsumo';
            $(location).attr('href', href);
        });


        $scope.enviarMensaje = function() {
            var resquestModificarTopeBolsaMinutos = {
                idBolsa: $localStorage.idBolsa,
                idCuenta: $localStorage.idCuentaM,
                idRecibo: $localStorage.idReciboM,
                idProductoServicio: '',
                saldoBolsa: $localStorage.saldoBolsa,
                numeroCelular: '',
                cantidad: '',
                tipoAjuste: $localStorage.tipoAjusto,
                archivo: $localStorage.file
            };
            resquestModificarTopeBolsaMinutos = $httpParamSerializer({ requestJson: angular.toJson(resquestModificarTopeBolsaMinutos), tipoCarga: 'M' });
            managerservice.modificarTopeBolsaMinutos(resquestModificarTopeBolsaMinutos).then(function(response) {
                var rptaExito = response.data.modificarTopeConsumoBolsaMinutosResponse.defaultServiceResponse.idRespuesta;
                var transactionId = response.data.modificarTopeConsumoBolsaMinutosResponse.defaultServiceResponse.idTransaccional;
                var mensaje = response.data.modificarTopeConsumoBolsaMinutosResponse.defaultServiceResponse.mensaje;

                if (parseInt(rptaExito) == 0) {
                    auditoria(WPSTablaOperaciones.cambioTopeMasivo, transactionId, 'SUCCESS', '-');
                    showPopUpFromFile("../view/popup/pop.cambiar-tope-confirmacion-masivo.html");
                } else if (parseInt(rptaExito) == 9) {
                    auditoria(WPSTablaOperaciones.cambioTopeMasivo, transactionId, 'ERROR', 'modificarTopeConsumoBolsaMinutos - ' + mensaje);
                    showPopUpFromFile("../view/popup/pop.cambiar-tope-errorLineas.html");
                } else {
                    auditoria(WPSTablaOperaciones.cambioTopeMasivo, transactionId, 'ERROR', 'modificarTopeConsumoBolsaMinutos - ' + mensaje);
                    showPopUpFromFile("../view/popup/pop.cambiar-tope-error.html");
                }
            }, function(error) {

            });
        };

        function auditoria(operationCode, transactionId, estado, descripcionoperacion) {
            var ResquestAuditoria = {
                operationCode: operationCode,
                pagina: WPSPageID.miclaro_corporativo_solicitudes_cambiotopeconsumo,
                transactionId: transactionId,
                estado: estado,
                servicio: $localStorage.idReciboM,
                tipoProducto: 'MOVIL',
                tipoLinea: '5',
                tipoUsuario: '2',
                perfil: '-',
                monto: '',
                descripcionoperacion: descripcionoperacion,
                responseType: '/'
            };
            ResquestAuditoria = $httpParamSerializer({ requestJson: angular.toJson(ResquestAuditoria) });
            managerservice.registrarAuditoria(ResquestAuditoria).then(function(response) {

            }, function(error) {

            });
        }


        $('.linkterminos').click(function(e) {

            $timeout(function() {
                $("#terminos").show();
            }, 200);
        });

        $('#bterminosaceptar').click(function(e) {
            e.preventDefault();
            if (typeof $currTerminos !== 'undefined') {
                $currTerminos.prop('checked', true);
                $currTerminos.parent().addClass("checked");
                $currTerminos.closest("form").find(".bt-pagar").removeClass("bt-disabled");
                $currTerminos.closest("form").find("#btcontratar").removeClass("bt-disabled");
                $currTerminos.closest("form").find("#btaceptartope").removeClass("bt-disabled");
            }
            hidePopUp();
        });
        $('#btterminoscancel').click(function(e) {
            e.preventDefault();
            hidePopUp();

        });

        var $popup = $('.popup');

        function showPopUpFromFile($file) {
            $h = $(window).height();
            var $pop = $(".popup .pop");
            var $cnt = $popup.find('.content');
            $cnt.html("").hide();
            $cnt.load($file, function() { $cnt.fadeIn(250);
                initFormFields(); });

            $pop.css({ 'margin-top': Math.round(($h - 300) / 2) });
            $popup.fadeIn(350);
        }

        $('.popup .btclose, .popup .bg').click(function() {
            hidePopUp();
        });


        function hidePopUp() {
            $popup.fadeOut(250);
        }


    });

});

var appControllerSimple = angular.module('miClaroControllerSimple', []);

appControllerSimple.controller("confirmarSimple", function($scope, $http, $httpParamSerializer, $location, $timeout, $localStorage, managerservice) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    var $currTerminos = undefined;
    angular.element(document).ready(function() {

        $scope.nuevoTopeConsumo = $localStorage.nuevoTopeConsumo;
        $scope.tipoAjustoDescr = $localStorage.tipoAjustoDescr;
        $scope.movil = $localStorage.movil;
        $("#terminos").hide();

        var str = $localStorage.saldoBolsa;
        var res = str.split(" ");
        if (res[0].length > 6) {
            var strSaldo = res[0];
            var resSaldo = strSaldo.split(",");
            var resultado = resSaldo[0] + resSaldo[1];
            $scope.saldoBolsa = parseInt(resultado);
        } else {
            $scope.saldoBolsa = parseInt(res[0]);
        }


        $('.linkterminos').click(function(e) {

            $timeout(function() {
                $("#terminos").show();
            }, 200);
        });


        $('#btcanceltope').click(function() {
            var href = '/wps/myportal/miclaro/corporativo/cambiartopeconsumo';
            $(location).attr('href', href);
        });

        $('#btaceptartope').click(function(e) {
            e.preventDefault();

            var resquestModificarTopeBolsaMinutos = {
                idBolsa: $localStorage.idBolsa,
                idCuenta: $localStorage.idCuenta,
                idRecibo: $localStorage.idRecibo,
                idProductoServicio: $localStorage.idProductoServicio,
                saldoBolsa: $scope.saldoBolsa,
                numeroCelular: $localStorage.movil,
                cantidad: $scope.nuevoTopeConsumo,
                tipoAjuste: $localStorage.tipoAjusto,
                archivo: ''
            };


            resquestModificarTopeBolsaMinutos = $httpParamSerializer({ requestJson: angular.toJson(resquestModificarTopeBolsaMinutos), tipoCarga: 'S' });
            managerservice.modificarTopeBolsaMinutos(resquestModificarTopeBolsaMinutos).then(function(response) {
                var rptaExito = response.data.modificarTopeConsumoBolsaMinutosResponse.defaultServiceResponse.idRespuesta;
                var transactionId = response.data.modificarTopeConsumoBolsaMinutosResponse.defaultServiceResponse.idTransaccional;
                var mensaje = response.data.modificarTopeConsumoBolsaMinutosResponse.defaultServiceResponse.mensaje;
                if (rptaExito == 0) {
                    auditoria(WPSTablaOperaciones.cambioTopeIndividual, transactionId, 'SUCCESS', '-');
                    showPopUpFromFile("../view/popup/pop.cambiar-tope-confirmacion-simple.html");
                } else if (parseInt(rptaExito) == 9) {
                    auditoria(WPSTablaOperaciones.cambioTopeIndividual, transactionId, 'ERROR', 'modificarTopeConsumoBolsaMinutos - ' + mensaje);
                    showPopUpFromFile("../view/popup/pop.cambiar-tope-errorLineas.html");
                } else {
                    auditoria(WPSTablaOperaciones.cambioTopeIndividual, transactionId, 'ERROR', 'modificarTopeConsumoBolsaMinutos - ' + mensaje);
                    showPopUpFromFile("../view/popup/pop.cambiar-tope-error.html");
                }
            }, function(error) {

            });



        });

        function auditoria(operationCode, transactionId, estado, descripcionoperacion) {
            var ResquestAuditoria = {
                operationCode: operationCode,
                pagina: WPSPageID.miclaro_corporativo_solicitudes_cambiotopeconsumo,
                transactionId: transactionId,
                estado: estado,
                servicio: $scope.movil,
                tipoProducto: 'MOVIL',
                tipoLinea: '2',
                tipoUsuario: '2',
                perfil: '4',
                monto: '',
                descripcionoperacion: descripcionoperacion,
                responseType: '/'
            };
            ResquestAuditoria = $httpParamSerializer({ requestJson: angular.toJson(ResquestAuditoria) });
            managerservice.registrarAuditoria(ResquestAuditoria).then(function(response) {

            }, function(error) {

            });
        }

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

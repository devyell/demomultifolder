miClaroApp.controller("appController", function ($scope, $http, $httpParamSerializer, serviceHomeMoviles) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    



    $scope.showPopup = function () {
        $(".pop-limite").fadeIn();
        $("html, body").animate({ scrollTop: 0 }, "slow");

    }

    $scope.hidePopup = function () {
        $(".pop-limite").fadeOut();
    }

    $scope.showConfirmacion = function(){
        $(".confirmacionLimite").show();
        $(".limiteConsumoPage").hide();
        $(".pop-limite").fadeOut();
    }

    $(".boxes-limites").click(function () {
        console.log("click en boton!");
        $('.boxes-limites.active').removeClass('active');
        $(this).addClass('active');
    });

    $scope.printDiv = function(){
        window.print();
    }

    $scope.finalizar = function(){
        window.location.replace("/wps/myportal/miclaro/consumer/solicitudes/limitedeconsumo/");
    }

});
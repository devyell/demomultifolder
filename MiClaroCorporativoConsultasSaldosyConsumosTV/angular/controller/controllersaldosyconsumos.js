 ctrlsaldosyconsumos = angular.module('controllerSaldosyConsumosTV', []);
 ctrlsaldosyconsumos.controller('ctrlSaldosyConsumosTV', ['$scope', '$window', '$http', 'servSaldosyConsumosTV', '$httpParamSerializer',
     function($scope, $window, $http, servSaldosyConsumosTV, $httpParamSerializer) {
         $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

         $scope.mostrarSwitch = false;
         $scope.switchSelect = true;
         var urlConsumer = '/wps/portal/miclaro/consumer/consultas/saldosyconsumos/tv';

         angular.element(document).ready(function() {
             init();
         });

         $scope.switchChange = function() {
             $window.location.href = urlConsumer;
         };

         function init() {
             servSaldosyConsumosTV.obtenerDatosUsuarioSesion().then(function(response) {
                 var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                 if (rpta == 0) {
                     var tipoClienteSession = response.data.comunResponseType.tipoCliente;
                     if (tipoClienteSession == 4) {
                         $scope.mostrarSwitch = true;
                     }
                 }
             }, function(error) {
                 
             });
         };

     }
 ]);

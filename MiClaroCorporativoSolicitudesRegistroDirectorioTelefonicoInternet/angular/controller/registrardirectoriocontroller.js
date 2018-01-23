 ctrlDirectorioTelefonico = angular.module('ctrlDirectorioTelefonicoCorpoInternet', []);
 ctrlDirectorioTelefonico.controller('ctrlDirectorioTelfInternet', ['$scope', '$http', 'servDirectorioTelfInternet', '$httpParamSerializer',
     function($scope, $http, servDirectorioTelfInternet, $httpParamSerializer) {
         $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

     }
 ]);

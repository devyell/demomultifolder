 ctrlDirectorioTelefonico = angular.module('ctrlDirectorioTelefonicoConsumerTv', []);
 ctrlDirectorioTelefonico.controller('ctrlDirectorioTelfTv', ['$scope', '$http', 'servDirectorioTelfTv', '$httpParamSerializer',
     function($scope, $http, servDirectorioTelfTv, $httpParamSerializer) {
         $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
     }
 ]);

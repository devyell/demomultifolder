var serviceDirectorioTelefonico = angular.module('servicesDirectorioTelefonicoCorpoTv', []);
serviceDirectorioTelefonico.service('servDirectorioTelfTv', ['$http', function($http) {
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    $http.defaults.headers.post = { 'Access-Control-Allow-Origin': undefined };


   
    
}]);

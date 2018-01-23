var appController = angular.module('miClaroController', []);

appController.controller("mycontroller", function($scope, $http, $httpParamSerializer,$timeout, $localStorage,$location, managerservice) {
$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
angular.element(document).ready(function () {
			$("#switch_web").remove();
    });

});

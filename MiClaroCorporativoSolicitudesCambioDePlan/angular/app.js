var miClaroApp = angular.module('miClaroCorporativoCambioPlan',['ngRoute','ctrlHomeCambioPlan' ,'serviceHomeCambioPlan']);


miClaroApp.config(['$routeProvider', function($routeProvider){
		
        $routeProvider.when('/', {templateUrl: 'angular/view/miclaroConsumerHome.html', controller: 'ctrlCambioPlanHome'});		
        
  }]);

angular.element(document).ready(function() {

    angular.bootstrap(document.getElementById("MiClaroConsumerHome"),['miClaroCorporativoCambioPlan']);
}); 
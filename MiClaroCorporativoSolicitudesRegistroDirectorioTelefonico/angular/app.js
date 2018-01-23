var miClaroApp = angular.module('miClaroCorporativoDirectorio',['ngRoute','ctrlHomeDirectorio' ,'serviceHomeDirectorio']);


miClaroApp.config(['$routeProvider', function($routeProvider){
		
        $routeProvider.when('/', {templateUrl: 'angular/view/miclaroConsumerHome.html', controller: 'ctrlDirectorioHome'});		
        
  }]);

angular.element(document).ready(function() {

    angular.bootstrap(document.getElementById("idMiClaroCorporativoDirectorio"),['miClaroCorporativoDirectorio']);
}); 
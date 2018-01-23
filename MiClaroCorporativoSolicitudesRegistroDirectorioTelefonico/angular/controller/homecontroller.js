var appController = angular.module('ctrlHomeDirectorio', []);
appController.controller("ctrlDirectorioHome", function($scope, $http, $httpParamSerializer, srvDirectorioHome) {


    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';


    var tipoCliente = "";
    var categoriaPrincipal = "";

    srvDirectorioHome.getObtenerDatosSesion().then(function(response) {
    	categoriaPrincipal = response.data.comunResponseType.categoria;
    	tipoCliente = response.data.comunResponseType.tipoClienteProductoPrincipal; 	


		    if (categoriaPrincipal == 1){
		    	window.location.replace("/wps/myportal/miclaro/corporativo/solicitudes/registrodirectoriotelefonico/movil");
		    } else if (categoriaPrincipal == 2){
		    	window.location.replace("/wps/myportal/miclaro/corporativo/solicitudes/registrodirectoriotelefonico/fijo");
		    } else if (categoriaPrincipal == 3){
		    	window.location.replace("/wps/myportal/miclaro/corporativo/solicitudes/registrodirectoriotelefonico/internet");
		    } else if (categoriaPrincipal == 4){
		    	window.location.replace("/wps/myportal/miclaro/corporativo/solicitudes/registrodirectoriotelefonico/tv");
		    }

    }, function(error) {

    });



    
	    
});

var appController = angular.module('ctrlHomeCambioPlan', []);
appController.controller("ctrlCambioPlanHome", function($scope, $http, $httpParamSerializer, srvCambioPlanHome) {


    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';


    var tipoCliente = "";
    var categoriaPrincipal = "";

    srvCambioPlanHome.getObtenerDatosSesion().then(function(response) {
    	categoriaPrincipal = response.data.comunResponseType.categoria;
    	tipoCliente = response.data.comunResponseType.tipoClienteProductoPrincipal; 	


		    if (categoriaPrincipal == 1){
		    	window.location.replace("/wps/myportal/miclaro/corporativo/solicitudes/cambiodeplan/movil");
		    } else if (categoriaPrincipal == 2){
		    	window.location.replace("/wps/myportal/miclaro/corporativo/solicitudes/cambiodeplan/fijo");
		    } else if (categoriaPrincipal == 3){
		    	window.location.replace("/wps/myportal/miclaro/corporativo/solicitudes/cambiodeplan/internet");
		    } else if (categoriaPrincipal == 4){
		    	window.location.replace("/wps/myportal/miclaro/corporativo/solicitudes/cambiodeplan/tv");
		    }

    }, function(error) {

    });



    
	    
});

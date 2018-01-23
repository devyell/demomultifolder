var appController = angular.module('ctrlNuevoServicioCorporativoHome', []);
appController.controller("ctrlNuevoServicioHome", function($scope, $http, $httpParamSerializer, srvNuevoServicioHome) {


    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var tipoCliente = "";
    var categoriaPrincipal = "";

    srvNuevoServicioHome.getObtenerDatosSesion().then(function(response) {
    	categoriaPrincipal = response.data.comunResponseType.categoria;
    	tipoCliente = response.data.comunResponseType.tipoClienteProductoPrincipal;

		    if (categoriaPrincipal == 1){
		    	window.location.replace("/wps/myportal/miclaro/corporativo/solicitudes/nuevoservicio/movil");
		    } else if (categoriaPrincipal == 2){
		    	window.location.replace("/wps/myportal/miclaro/corporativo/solicitudes/nuevoservicio/fijo");
		    } else if (categoriaPrincipal == 3){
		    	window.location.replace("/wps/myportal/miclaro/corporativo/solicitudes/nuevoservicio/internet");
		    } else if (categoriaPrincipal == 4){
		    	window.location.replace("/wps/myportal/miclaro/corporativo/solicitudes/nuevoservicio/tv");
		    }

    }, function(error) {

    });	    
});

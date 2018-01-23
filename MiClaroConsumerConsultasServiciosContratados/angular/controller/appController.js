app.controller("mycontroller", function($scope, $http, $httpParamSerializer, modService) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
                    
    var tipoCliente = "";
    var categoriaPrincipal = "";

    modService.getObtenerDatosSesion().then(function(response) {

    	categoriaPrincipal = response.data.comunResponseType.categoria;    	
    	tipoCliente = response.data.comunResponseType.tipoClienteProductoPrincipal;

		    if (categoriaPrincipal == 1){
		    	window.location.replace("/wps/myportal/miclaro/consumer/consultas/servicioscontratados/movil/");
		    } else if (categoriaPrincipal == 2){
		    	window.location.replace("/wps/myportal/miclaro/consumer/consultas/servicioscontratados/fijo/");
		    } else if (categoriaPrincipal == 3){
		    	window.location.replace("/wps/myportal/miclaro/consumer/consultas/servicioscontratados/internet/");
		    } else if (categoriaPrincipal == 4){
		    	window.location.replace("/wps/myportal/miclaro/consumer/consultas/servicioscontratados/tv/");
		    }

    }, function(error) {

    });

});

var appController = angular.module('MiClaroController', []);
appController.controller("MiClaroHomeController", function($scope, $http, $httpParamSerializer, serviceHome) {


    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    var tipoCliente = "";
    var categoriaPrincipal = "";

    serviceHome.getObtenerDatosSesion().then(function(response) {

    	categoriaPrincipal = response.data.comunResponseType.categoria;
    	tipoCliente = response.data.comunResponseType.tipoClienteProductoPrincipal; 	
		    if (categoriaPrincipal == 1){
		    	
		    	window.location.replace("/wps/myportal/miclaro/corporativo/consultas/detalleconsumos/movil");
		    } else if (categoriaPrincipal == 2){
		    	
		    	window.location.replace("/wps/myportal/miclaro/corporativo/consultas/detalleconsumos/fijo");
		    } else if (categoriaPrincipal == 3){
		    	
		    	window.location.replace("/wps/myportal/miclaro/corporativo/consultas/detalleconsumos/internet");
		    } else if (categoriaPrincipal == 4){
		    	
		    	window.location.replace("/wps/myportal/miclaro/corporativo/consultas/detalleconsumos/tv");
		    }else {
			
			window.location.replace("/wps/myportal/miclaro/corporativo/consultas/detalleconsumos/movil");
			}

    }, function(error) {

    });



    
	    
});

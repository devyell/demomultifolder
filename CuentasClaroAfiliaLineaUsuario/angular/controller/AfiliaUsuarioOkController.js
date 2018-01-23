
var appController2 = angular.module('miClaroController2', []);
appController2.controller('AfiliaUsuarioOkController', ['$scope','AfiliaUsuarioService',function($scope,AfiliaUsuarioService) {

				
				 
$scope.afiliar=function () {
				
   if($.cookie("CuentasClaroWPSRetornar")){
		var wps_cookie = $.cookie('CuentasClaroWPSRetornar');
		AfiliaUsuarioService.urlsRetorno().then(function (response) {
		var  urlRetorno  = response.data;
		if (Array.isArray(urlRetorno)) {
		$scope.urlRetorno=urlRetorno;
		}else {
		$scope.urlRetorno.push(urlRetorno);
		}
		var id= parseInt(obtenerIdUrl($scope.urlRetorno,wps_cookie));
		$("#regresaClaro .icon-sh").addClass('icon-sh icon-sh_backArrow');
		$("#regresaClaro").attr('href',$scope.urlRetorno[id].url);
		$("#regresaClaro").html("<span class='icon-sh icon-sh_backArrow'></span>"+$scope.urlRetorno[id].textoInicialLink +" <strong>"+$scope.urlRetorno[id].nombreAplicacion+"</strong>");
	}, function (error) {
	
	});

	}else{
	$("#retornarClaro").css("height", "10px");
	$("#regresaClaro .icon-sh").removeClass('icon-sh icon-sh_backArrow');
	$("#regresaClaro").html("");
	}

			   var href2='/wps/portal/cuentasclaro/tucuenta';
                
			 $(location).attr('href', href2);
				 
	 };
	
function obtenerIdUrl(arr,obj) {
for (var i = 0; i < arr.length; i++) {
 if (arr[i].idLink == obj) {
	return i;
	}
	}
}	
        
}]);

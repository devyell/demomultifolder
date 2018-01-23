var appController = angular.module('miClaroControllerExito', []);

appController.controller("ControllerComprasyRecargasExito",
        function($scope,$http,$httpParamSerializer,servicioCompartido){

$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8'; 

$scope.servicioCompartido = servicioCompartido;
$scope.pagarCompraResponse;
$scope.showFecha=true;
$scope.showfechaVigencia=true;

	inicioExito();

	function inicioExito() {
		
		$scope.pagarCompraResponse = $scope.servicioCompartido;
        scrollToTop();
        if($scope.pagarCompraResponse.fechaCompra == null 
        	|| $scope.pagarCompraResponse.fechaCompra == ""
        	|| $scope.pagarCompraResponse.fechaCompra == undefined){
        	$scope.showFecha=false;
        }
		
		  if($scope.pagarCompraResponse.fecVigProd == null 
        	|| $scope.pagarCompraResponse.fecVigProd == ""
        	|| $scope.pagarCompraResponse.fecVigProd == undefined){
        	$scope.showfechaVigencia=false;
        }
	}
	
});


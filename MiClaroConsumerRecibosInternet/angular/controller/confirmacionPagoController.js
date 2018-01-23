app.controller("ConfirmacionPagoController",function($scope,$sessionStorage){

	$scope.upps_ocurrio_error = WPSVisualizaryPagarRecibos.EXCEPCION16_1;
    $scope.transaccion_error = WPSVisualizaryPagarRecibos.EXCEPCION16_2;
    
    $scope.upps_error = WPSVisualizaryPagarRecibos.EXCEPCION17_1;
    $scope.vuelve_a_intentar = WPSVisualizaryPagarRecibos.EXCEPCION17_2;

    $scope.upps_sin_recibos = WPSVisualizaryPagarRecibos.EXCEPCION18_1;
    $scope.no_titular = WPSVisualizaryPagarRecibos.EXCEPCION18_2;

	this.confirmacionPagoObject = [];
    var dataRecibos = $sessionStorage.dataTransaccionExitosa.listaRecibos;
    
    if (angular.isArray(dataRecibos)) {
        this.confirmacionPagoObject = dataRecibos;
    } else {
        this.confirmacionPagoObject.push(dataRecibos);
    }
	
	this.listaRecibosPagarSession = $sessionStorage.listaRecibosPagar;
	this.objetoSinListaRecibo = $sessionStorage.dataTransaccionExitosa;
	
	$scope.fechaActual = new Date();
	
	this.imprimir = function(){
		var divImpresion = document.getElementById("imprimirConfirmacion");
		
		var ventanaImpresion = window.open('','popImpresion');
		
		ventanaImpresion.document.write(divImpresion.innerHTML);
		
		ventanaImpresion.document.close();
		
		ventanaImpresion.print();
		
		ventanaImpresion.close();
	};
});
var miClaroApp = angular.module('miClaroApp',['ngRoute','miClaroController','miClaroControllerExito','miClaroServices','miClaroServicesSesion']);

miClaroApp.config(['$routeProvider', function($routeProvider,$location){
		
        $routeProvider.when('/', {templateUrl: 'angular/view/corporativo-corporativo-compras-recargas.html', controller: 'ControllerComprasyRecargas', controllerAs:'miClaroComprasyRecargasCtr'});
        $routeProvider.when('/confirmacionCompra', {templateUrl: 'angular/view/corporativo-corporativo-compras-recargas-confirmacion.html', controller: 'ControllerComprasyRecargasExito', controllerAs:'miClaroComprasyRecargasExitoCtr'});	
        
  }]);

miClaroApp.factory('servicioCompartido', function(){

	var servCompartido = {metodoPago:"",fechaCompra:"",tiempoActualizacion:"",esExito:false,nombreProd:""};
	servCompartido.actualizarDatos = function name(compraResponse, prodSelecc, catSelecc, medioSelecc, esExito){
		if(compraResponse != null){
			this.fechaCompra = compraResponse.fechaCompra;
			this.descripcion=compraResponse.descripcion!=null?compraResponse.descripcion:compraResponse.descripcionResultadoOperacion;
			this.tiempoActualizacion=compraResponse.tiempoActualizacion;
		}
		
		this.esExito = esExito;
		this.nombreProd=prodSelecc.lblNombre;
		this.fecVigProd=prodSelecc.fechaVigencia;
		this.costo=prodSelecc.lblCosto;
		this.lblCosto=prodSelecc.lblCosto;
		this.codigo=prodSelecc.codigo;
		this.simboloMoneda=prodSelecc.simboloMoneda;
		this.precioMoneda=prodSelecc.precioMoneda;
		this.nombreCat=catSelecc.nombre;
		this.metodoPago = medioSelecc.descripcion;
	};

	return servCompartido;
});


angular.element(document).ready(function() {
   
  angular.bootstrap(document.getElementById("idMiClaroApp"),['miClaroApp']);
});

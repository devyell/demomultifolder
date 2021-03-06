﻿var appController = angular.module('miClaroController', []);

appController.controller("mycontroller", function($scope, $http, $httpParamSerializer,$timeout, $localStorage,$location, managerservice) {
$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';



angular.element(document).ready(function () {

	 $("#editarNumero").hide();
	 $scope.servicio=[];
	 $scope.listarGrupo1=[];
	 $scope.listarGrupo2=[];
	 $scope.listarGrupo3=[];
	 $scope.listarGrupoCopiar1=[];
	 $scope.listarGrupoCopiar2=[];
	 $scope.listarGrupoCopiar3=[];
	 $scope.indexGrupo1;
	 $scope.numeroGrupo1;
	 $scope.indexGrupo2;
	 $scope.numeroGrupo2;
	 $scope.indexGrupo3;
	 $scope.numeroGrupo3;
	 $scope.opcionSelecionado;
	 $scope.NumerosFrecuentesGrupo1;
	 $scope.NumerosFrecuentesGrupo2;
	 $scope.NumerosFrecuentesGrupo3;
	 $scope.objServico;
	 $scope.planActual;
	 $scope.opcionActual;
	 $scope.opcionActualShow = false;
	 $scope.idopcionActual;
	 $("#popup").hide();
	 var productoPrincipalXidRecibo = false;
	 var titularidadServicio = WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado;
	 $scope.upps=WPSMensajeError.upps;
	 $scope.upps_descripcion01=WPSMensajeError.upps_descripcion01;
	 $scope.upps_descripcion02=WPSMensajeError.upps_descripcion02;
	 $scope.mensaje1 = WPSMensajeError.mensaje2;
	 $scope.mensaje3 = WPSMensajeError.mensaje3;
	 $scope.mensaje5 = WPSMensajeError.mensaje5;
	 $scope.estado;
	 $scope.maxGrupo1=9;
	 $scope.maxGrupo2=9;
	 $scope.maxGrupo3=9;
	 $("#switch_web").remove();
	 
	 var ResquestAuditoria = {
                    operationCode: WPSTablaOperaciones.registrarNumeroFrecuente,
                    pagina: WPSPageID.miclaro_consumer_otros_registranumerosfrecuentes_movil,
                    transactionId: '',
                    estado: '',
                    servicio: '-',
                    tipoProducto: 'MOVIL',
                    tipoLinea: '-',
                    tipoUsuario: '1',
                    perfil: '-',
                    monto: '',
                    descripcionoperacion: '-',
                    responseType: '/'
                };
	 
	 managerservice.getObtenerFlagProductoMovil().then(function(response) {
		
		$scope.flagServiciosMovilTemp = response.data.comunResponseType.flagProductoMovilSesion;
        $scope.ErrorFlagMovilTemp = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        $scope.FlagFijoIdTransaccional = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
		
		 if($scope.flagServiciosMovilTemp == "" ){
            $scope.flagServiciosMovil = 0;
        } else if($scope.flagServiciosMovilTemp == "-1"){
            $scope.flagServiciosMovil = Math.sign(-1);
        } else {
            $scope.flagServiciosMovil = parseInt($scope.flagServiciosMovilTemp);
        }

        if($scope.ErrorFlagMovilTemp == ""){
            $scope.ErrorFlagMovil= 1;
        } else {
            $scope.ErrorFlagMovil = parseInt($scope.ErrorFlagMovilTemp);
        }
		
		
	  if ($scope.ErrorFlagMovil == 0) {
			if ($scope.flagServiciosMovil == 1 || $scope.flagServiciosMovil == 3) {
				$("#movil").show();
				$scope.init();
			} else {
			$scope.flagServiciosMovil=2;

			}
        } else {
			$scope.flagServiciosMovil=-1;
        }
		
	});
	
	$scope.init = function(){  
		managerservice.getObtenerDatosSesion().then(function(response) { 
			var rpta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
			var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;				 
                 if (rpta == 0) {
					var categoriaPrincipal = parseInt(response.data.comunResponseType.categoria);
					var tipoClientePrincipal = response.data.comunResponseType.tipoClienteProductoPrincipal;
					$scope.tipoClienteSession = response.data.comunResponseType.tipoCliente;
					$scope.categoria=response.data.comunResponseType.categoria;					
                     if (categoriaPrincipal == 1 && tipoClientePrincipal == "1") {
						var data =	{
						"tipoClienteProductoPrincipal":response.data.comunResponseType.nombreProductoPrincipal,
						"productoPrincipal": response.data.comunResponseType.productoPrincipal,
						"idCuenta": response.data.comunResponseType.idCuenta,
						"idRecibo": response.data.comunResponseType.idRecibo,
						"idDireccion": response.data.comunResponseType.idRecibo,
						"listaNumeros": null	
						}
						 $scope.getObtenerServiciosMovilWS(data);				
                     } else { 
					  
						 var data =	{
						"tipoClienteProductoPrincipal":null,
						"productoPrincipal": null,
						"idCuenta": null,
						"idRecibo": null,
						"idDireccion": null,
						"listaNumeros": null	
						}
			
						 $scope.getObtenerServiciosMovilWS(data);
                     }
                     
                 }
		
	});
	}; 
	
	
	
	$scope.resfrezcar=function() {

			if($scope.estado=='2' ) {
			$scope.obtenerOpcionesNumerosFrecuentes($scope.servicio.ProductoServicioResponse);  
			}else if($scope.estado=='3' ) {
			$scope.obtenerNumerosFrecuentes($scope.opcionSelecionado,$scope.servicio.ProductoServicioResponse);  
			}else  {
			$scope.init();
			}
	
	}


$scope.getObtenerServiciosMovilWS = function(objServico){

		var osCategoria = WPSCategoria.movil;
	    var osTipoLinea = WPSTipoLinea.todos;
	    var osTipoCliente = WPSTipoCliente.consumer;
	    var osIdCuenta = objServico.idCuenta;
	    var osIdRecibo = objServico.idRecibo;
	    var osIdDireccion = objServico.idDireccion;
	    var obtenerServiciosRequest = {categoria: null,
                                   tipoLinea: null,
                                   tipoCliente: null,
                                   idProductoServicio: null,
                                   tipoPermiso: '5',
                                   idCuenta: null,
                                   idRecibo: null,
                                   idDireccion: null,
                                   nombreProducto: null,
                                   pagina: '0',
                                   cantResultadosPagina: '0',
                                   productoPrincipalXidRecibo: productoPrincipalXidRecibo,
                                   titularidadServicio: titularidadServicio 
                                  }
		obtenerServiciosRequest.categoria = osCategoria;
	    obtenerServiciosRequest.tipoLinea = osTipoLinea;
	    obtenerServiciosRequest.tipoCliente = osTipoCliente;
	   
	    serviciosRequest = $httpParamSerializer({requestJson:angular.toJson(obtenerServiciosRequest)});
	    managerservice.getObtenerServicios(serviciosRequest).then(function(response) {			        
	        $scope.errorFuncionalServicios = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
			var mensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
			ResquestAuditoria.transactionId = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional; 
			var estadoPrincipal=true;
	        if($scope.errorFuncionalServicios == 0){
				$scope.serviciosList = response.data.obtenerServiciosResponse.listadoProductosServicios;
	        	if (!Array.isArray($scope.serviciosList)) {
					$scope.serviciosList = [];
					$scope.serviciosList.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
					$('select').css({ display: 'none'});
					$('#txtMobile').css({ background: 'none'});
					
		        }
				angular.forEach($scope.serviciosList,function(val,key){
					
					if (val.ProductoServicioResponse.idProductoServicio === objServico.productoPrincipal) {	
						$scope.servicio = $scope.serviciosList[key];
						ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
						ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
						ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;
						estadoPrincipal=false;
					} 
				});
								 
				if(estadoPrincipal){
					$scope.servicio = $scope.serviciosList[0];
					ResquestAuditoria.servicio=$scope.servicio.ProductoServicioResponse.nombre;
					ResquestAuditoria.tipoLinea=$scope.servicio.ProductoServicioResponse.tipoLinea;
					ResquestAuditoria.perfil=$scope.servicio.ProductoServicioResponse.tipoPermiso;
				}
				
				$scope.obtenerDatosAdicionalesServicioMovil($scope.servicio.ProductoServicioResponse); 
		        $scope.obtenerOpcionesNumerosFrecuentes($scope.servicio.ProductoServicioResponse);        
	        	$("#txtMobile").html($scope.servicio.ProductoServicioResponse.nombreAlias);

	        }else{
				ResquestAuditoria.estado = "ERROR";
				ResquestAuditoria.descripcionoperacion = "obtenerServicios - "+mensaje;
				auditoria();	
				$("#movil").hide();
				$scope.error_titulo=WPSMensajeError.error_titulo;
				$scope.error_descripcion01=WPSMensajeError.error_descripcion01;
				$scope.error_descripcion02=WPSMensajeError.error_descripcion02;
				$scope.flagServiciosMovil=-1;
	        }

	    });

	   this.cambioServicio = function(){
	   		$("input[type='text']").val("");
			$("#txtMobile").html($scope.servicio.ProductoServicioResponse.nombreAlias);
			$scope.planActual = "";
			$scope.opcionActualShow = false;
			$("#editarNumero").hide();
			$("#contmovilplan").hide();
			$("#errorOpcionesNumerosFrecuentes").hide();

			$scope.obtenerDatosAdicionalesServicioMovil($scope.servicio.ProductoServicioResponse); 
			$scope.obtenerOpcionesNumerosFrecuentes($scope.servicio.ProductoServicioResponse);    
			
			actualizarProductoPrincipalSesion($scope.servicio.ProductoServicioResponse.idProductoServicio,$scope.servicio.ProductoServicioResponse.nombre,$scope.servicio.ProductoServicioResponse.idCuenta,$scope.servicio.ProductoServicioResponse.idRecibo);
			
	    };
		
		
		this.obtenerOpcionesNumerosFrecuentes = function(objServico){	
	    	var jsonRequest =	{
	    		"categoria": '1',
				"idProductoServicio": null,
				"idCuenta": null,
				"idRecibo": null,
				"idDireccion": null
			}
			
			jsonRequest.idCuenta = objServico.idCuenta;
			jsonRequest.idRecibo = objServico.idRecibo;
			jsonRequest.idDireccion = objServico.idDireccion;
			jsonRequest.idProductoServicio = objServico.idProductoServicio;
			dataRequest = $httpParamSerializer({requestJson:angular.toJson(jsonRequest)});
	    	managerservice.obtenerOpcionesNumerosFrecuentes(dataRequest).then(function(response) {
            $scope.errorFuncionalOpcionesNumeros = response.data.obtenerOpcionesNumerosFrecuentesResponse.defaultServiceResponse.idRespuesta;            	
			 var mensaje = response.data.obtenerOpcionesNumerosFrecuentesResponse.defaultServiceResponse.mensaje;
			 ResquestAuditoria.transactionId = response.data.obtenerOpcionesNumerosFrecuentesResponse.defaultServiceResponse.idTransaccional; 
            	if($scope.errorFuncionalOpcionesNumeros == 0){   
					$("#contmovilplan").show();
					$("#errorTotal").hide();
					$("#errorOpcionesNumerosFrecuentes").hide();
					$scope.OpcionesNumerosFrecuentes = response.data.obtenerOpcionesNumerosFrecuentesResponse.listaOpciones;
					if (!Array.isArray($scope.OpcionesNumerosFrecuentes)) {
						$scope.OpcionesNumerosFrecuentes = [];
						$scope.OpcionesNumerosFrecuentes.push(response.data.obtenerOpcionesNumerosFrecuentesResponse.listaOpciones);
					}

					for(var cnt=0; cnt<$scope.OpcionesNumerosFrecuentes.length; cnt++){
						if($scope.OpcionesNumerosFrecuentes[cnt].seleccionado == true){
							$scope.opcionActual = $scope.OpcionesNumerosFrecuentes[i].seleccionado;
						}
					}
					$scope.opcionActualShow = true;
					
					$scope.verSeleccionarNumerosFrecuentes($scope.OpcionesNumerosFrecuentes,objServico);  
					scrollTo($('#idNumerosFrecuente').parent().parent());	
				}else if($scope.errorFuncionalOpcionesNumeros == 2){ 
						$scope.estado='2';
						$scope.opcionActual='Ninguno';
						$scope.opcionActualShow = true;
						$("#contmovilplan").hide();
						$("#errorTotal").hide();
						$("#errorOpcionesNumerosFrecuentes").show();
						ResquestAuditoria.estado = "ERROR";
						ResquestAuditoria.descripcionoperacion = "OpcionesNumerosFrecuentes - "+mensaje;
						auditoria();	
				  
            	}else {

					ResquestAuditoria.estado = "ERROR";
					ResquestAuditoria.descripcionoperacion = "OpcionesNumerosFrecuentes - "+mensaje;
					auditoria();	
					$scope.opcionActual='';
					$scope.estado='2';
					$("#contmovilplan").hide();
					$("#errorTotal").show();
					$("#errorOpcionesNumerosFrecuentes").hide();
					
				}
	        },function (response) {
			
			});
		};
		
		this.obtenerDatosAdicionalesServicioMovil = function(objServico){	
	    	var jsonRequest =	{
	    		"idProductoServicio": null,
				"idCuenta": null,
				"idRecibo": null,
				"tipoCliente": null
			}
			jsonRequest.idProductoServicio = objServico.idProductoServicio;
			jsonRequest.idCuenta = objServico.idCuenta;
			jsonRequest.idRecibo = objServico.idRecibo;
			jsonRequest.tipoCliente = WPSTipoCliente.consumer;
			
			dataRequest = $httpParamSerializer({requestJson:angular.toJson(jsonRequest)});
	    	managerservice.obtenerDatosAdicionalesServicioMovil(dataRequest).then(function(response) {
            $scope.errorFuncionalOpcionesNumeros = response.data.obtenerDatosAdicionalesServicioMovilResponse.defaultServiceResponse.idRespuesta;            	
			var mensaje = response.data.obtenerDatosAdicionalesServicioMovilResponse.defaultServiceResponse.mensaje; 
			ResquestAuditoria.transactionId = response.data.obtenerDatosAdicionalesServicioMovilResponse.defaultServiceResponse.idTransaccional; 
            	if($scope.errorFuncionalOpcionesNumeros == 0){            		
            		$scope.planActual = response.data.obtenerDatosAdicionalesServicioMovilResponse.planActual;
					
            	}else {
					ResquestAuditoria.estado = "ERROR";
					ResquestAuditoria.descripcionoperacion = "obtenerDatosAdicionalesServicioMovil - "+mensaje;
					auditoria();
				}

	        },function (response) {
			
			});
		};
		
		this.verSeleccionarNumerosFrecuentes = function(OpcionesNumerosFrecuentes,objServico){
		var estado =false
		angular.forEach(OpcionesNumerosFrecuentes,function(val,key){
	                    if (val.seleccionado == 'true') {
							$("#editarNumero").show();
							estado=true;
							$scope.opcionSelecionado = $scope.OpcionesNumerosFrecuentes[key];
							$scope.idopcionActual=$scope.opcionSelecionado.idOpcion;
							$scope.opcionActual=$scope.opcionSelecionado.nombre;
							$scope.obtenerNumerosFrecuentes($scope.opcionSelecionado,objServico);  
							
	                    }
						
						
						
	                });
					
					if(!estado){
					$scope.opcionActual='Ninguna';
					
					}
				
		};
		
		
		
		this.selecionarOpcion = function(index){
	        var idOpcion="opcion"+index;
			$(".selecionar").removeClass("checked");
			$("#"+idOpcion).addClass("radio checked");
			$scope.opcionSelecionado = $scope.OpcionesNumerosFrecuentes[index];
			$scope.obtenerNumerosFrecuentes($scope.opcionSelecionado,$scope.servicio.ProductoServicioResponse);  
			scrollTo($('#idNumerosFrecuente').parent().parent());

	    };
		
		this.focusNumeroGrupo1= function(index){
		
		if(index!=$scope.indexGrupo1) {
		$scope.reestablecerNumeroGrupo1($scope.indexGrupo1);
		}
		
		 $scope.numeroGrupo1=$scope.listarGrupo1[parseInt(index)].numero;
			$scope.indexGrupo1=index;
			var idOpcion="idGrupo1"+index;
			var textEditar="editarGrupo1"+index;
			$("#"+idOpcion).addClass("focus");
			$("#"+textEditar).text("cancelar").addClass("red");
		};
		
		this.editarNumeroGrupo1= function(index){
			if(index!=$scope.indexGrupo1) {
			$scope.reestablecerNumeroGrupo1($scope.indexGrupo1);
			}		
			$scope.indexGrupo1=index;
			var id="editarGrupo1"+index;
			var idOpcion="idGrupo1"+index;
			if($.trim($("#"+id).text())=='editar') {
				$scope.numeroGrupo1=$scope.listarGrupo1[parseInt(index)].numero;
				$("#"+id).text("cancelar").addClass("red");
				$("#"+idOpcion).addClass("focus");  
				$("#"+idOpcion+' input').focus();
			}else {	
				$("#"+idOpcion).removeClass("focus");
				$scope.listarGrupo1[parseInt(index)].numero=$scope.listarGrupo1[parseInt(index)].estado;
				$("#"+id).text("editar").addClass("red");
				
			}
		};
		
		this.reestablecerNumeroGrupo1= function(index){
		 if(parseInt($scope.indexGrupo1)>=0) {
			var idGrupo1="idGrupo1"+$scope.indexGrupo1;
			var textEditar="editarGrupo1"+$scope.indexGrupo1;
			$("#"+idGrupo1).removeClass("focus");
			$("#"+textEditar).text("editar").addClass("red");
		  }
		};
	
		this.focusNumeroGrupo2= function(index){
			if(index!=$scope.indexGrupo2) {
				$scope.reestablecerNumeroGrupo2($scope.indexGrupo2);
			}
			$scope.numeroGrupo2=$scope.listarGrupo2[parseInt(index)].numero;
			$scope.indexGrupo2=index;
			var idOpcion="idGrupo2"+index;
			var textEditar="editarGrupo2"+index;
			$("#"+idOpcion).addClass("focus");
			$("#"+textEditar).text("cancelar").addClass("red");
		};
		
		this.editarNumeroGrupo2= function(index){
			if(index!=$scope.indexGrupo2) {
			$scope.reestablecerNumeroGrupo2($scope.indexGrupo2);
			}		
			$scope.indexGrupo2=index;
			var id="editarGrupo2"+index;
			var idOpcion="idGrupo2"+index;
			if($.trim($("#"+id).text())=='editar') {
			$scope.numeroGrupo2=$scope.listarGrupo2[parseInt(index)].numero;
			$("#"+id).text("cancelar").addClass("red");
			$("#"+idOpcion).addClass("focus"); 
			$("#"+idOpcion+' input').focus();
			}else {	
				$("#"+idOpcion).removeClass("focus");
				$scope.listarGrupo2[parseInt(index)].numero=$scope.listarGrupo2[parseInt(index)].estado;
				$("#"+id).text("editar").addClass("red");
			}
		};
		
		this.reestablecerNumeroGrupo2= function(index){
		 if(parseInt($scope.indexGrupo2)>=0) {
			var idGrupo2="idGrupo2"+$scope.indexGrupo2;
			var textEditar="editarGrupo2"+$scope.indexGrupo2;
			$("#"+idGrupo2).removeClass("focus");
			$("#"+textEditar).text("editar").addClass("red");
		  }
		};
	
		this.focusNumeroGrupo3= function(index){
		
		if(index!=$scope.indexGrupo3) {
		$scope.reestablecerNumeroGrupo3($scope.indexGrupo3);
		}
		
		 $scope.numeroGrupo3=$scope.listarGrupo3[parseInt(index)].numero;
			$scope.indexGrupo3=index;
			var idOpcion="idGrupo3"+index;
			var textEditar="editarGrupo3"+index;
			$("#"+idOpcion).addClass("focus");
			$("#"+textEditar).text("cancelar").addClass("red");
		};
		
		this.editarNumeroGrupo3= function(index){
			if(index!=$scope.indexGrupo3) {
			$scope.reestablecerNumeroGrupo3($scope.indexGrupo3);
			}		
			$scope.indexGrupo3=index;
			var id="editarGrupo3"+index;
			var idOpcion="idGrupo3"+index;
			if($.trim($("#"+id).text())=='editar') {
			$scope.numeroGrupo3=$scope.listarGrupo3[parseInt(index)].numero;
			$("#"+id).text("cancelar").addClass("red");
			$("#"+idOpcion).addClass("focus");
			$("#"+idOpcion+' input').focus();
			}else {	
				$("#"+idOpcion).removeClass("focus");
				$scope.listarGrupo3[parseInt(index)].numero=$scope.listarGrupo3[parseInt(index)].estado;
				$("#"+id).text("editar").addClass("red");
			}
		};
		
		this.reestablecerNumeroGrupo3= function(index){
		 if(parseInt($scope.indexGrupo3)>=0) {
			var idGrupo3="idGrupo3"+$scope.indexGrupo3;
			var textEditar="editarGrupo3"+$scope.indexGrupo3;
			$("#"+idGrupo3).removeClass("focus");
			$("#"+textEditar).text("editar").addClass("red");
		  }
		};
			
		this.obtenerNumerosFrecuentes = function(opcion,objServico){		
	    	var jsonRequest =	{
	    		"categoria": '1',
				"idCuenta": null,
				"idRecibo": null,
				"idDireccion": null,
				"idProductoServicio": null,
				"idOpcion": null,
				"idOpcionActual": null
			}
			$scope.objServico=objServico;
			jsonRequest.idCuenta = objServico.idCuenta;
			jsonRequest.idRecibo = objServico.idRecibo;
			jsonRequest.idProductoServicio = objServico.idProductoServicio;
			jsonRequest.idOpcion = opcion.idOpcion;
			jsonRequest.idOpcionActual = $scope.idopcionActual;
			dataRequest = $httpParamSerializer({requestJson:angular.toJson(jsonRequest)});
	    	managerservice.obtenerNumerosFrecuentes(dataRequest).then(function(response) {
				$scope.errorFuncionalOpcionesNumeros = response.data.obtenerNumerosFrecuentesResponse.defaultServiceResponse.idRespuesta;
				ResquestAuditoria.transactionId = response.data.obtenerNumerosFrecuentesResponse.defaultServiceResponse.idTransaccional; 
				var mensaje = response.data.obtenerNumerosFrecuentesResponse.defaultServiceResponse.mensaje;
            	if($scope.errorFuncionalOpcionesNumeros == 0){
					$("#contmovilplan").show();
					$("#editarNumero").show();
					$("#errorTotal").hide();
					$scope.comentario=response.data.obtenerNumerosFrecuentesResponse.comentario;
            		$scope.NumerosFrecuentesGrupo1 = response.data.obtenerNumerosFrecuentesResponse.grupo1;
					$scope.NumerosFrecuentesListaGrupo1 = response.data.obtenerNumerosFrecuentesResponse.grupo1.listaNumeros;
					
					if(typeof $scope.NumerosFrecuentesListaGrupo1  === 'undefined'){
						$("#grupo1").hide();
					} else {
					if (!Array.isArray($scope.NumerosFrecuentesListaGrupo1)) {
						$scope.NumerosFrecuentesListaGrupo1 = [];
						$scope.NumerosFrecuentesListaGrupo1.push(response.data.obtenerNumerosFrecuentesResponse.grupo1.listaNumeros);
						}	
					$("#grupo1").show();
					var cantidad= $scope.NumerosFrecuentesListaGrupo1.length;
					if($scope.listarGrupo1.length>0) {
					$scope.listarGrupo1=[];
					}
					for (var i = 0; i <cantidad; i++) {
									var roleList = 
										{
										"numero":$scope.NumerosFrecuentesListaGrupo1[parseInt(i)].numero,
										"estado":$scope.NumerosFrecuentesListaGrupo1[parseInt(i)].numero,
										"flagNuevo":'true'									
										 } ;
								$scope.listarGrupo1.push(roleList); 	
								$scope.listarGrupoCopiar1.push(roleList);
								if($scope.NumerosFrecuentesGrupo1.idGrupo=='3_VC'){
									$scope.maxGrupo1=13;
								 }
					}
					}
					$scope.NumerosFrecuentesGrupo2 = response.data.obtenerNumerosFrecuentesResponse.grupo2;
					$scope.NumerosFrecuentesListaGrupo2 = response.data.obtenerNumerosFrecuentesResponse.grupo2.listaNumeros;
					if(typeof $scope.NumerosFrecuentesListaGrupo2  === 'undefined'){
						$("#grupo2").hide();
					} else {
					$("#grupo2").show();
					if (!Array.isArray($scope.NumerosFrecuentesListaGrupo2)) {
						$scope.NumerosFrecuentesListaGrupo2 = [];
						$scope.NumerosFrecuentesListaGrupo2.push(response.data.obtenerNumerosFrecuentesResponse.grupo2.listaNumeros);
						}	
					
					if($scope.listarGrupo2.length>0) {
					$scope.listarGrupo2=[];
					}
					for (var j = 0; j <$scope.NumerosFrecuentesListaGrupo2.length; j++) {
									var roleList = 
										{
										"numero":$scope.NumerosFrecuentesListaGrupo2[parseInt(j)].numero,
										"estado":$scope.NumerosFrecuentesListaGrupo2[parseInt(j)].numero,
										"flagNuevo":'true'
										 } ;
								$scope.listarGrupo2.push(roleList); 
								$scope.listarGrupoCopiar2.push(roleList); 
								if($scope.NumerosFrecuentesGrupo2.idGrupo=='3_VC'){
									$scope.maxGrupo2=13;
								 }
					}
					}
					$scope.NumerosFrecuentesGrupo3 = response.data.obtenerNumerosFrecuentesResponse.grupo3;
					$scope.NumerosFrecuentesListaGrupo3 = response.data.obtenerNumerosFrecuentesResponse.grupo3.listaNumeros;
					
					if(typeof $scope.NumerosFrecuentesListaGrupo3  === 'undefined'){
						$("#grupo3").hide();
					} else {
					$("#grupo3").show();
					if (!Array.isArray($scope.NumerosFrecuentesListaGrupo3)) {
						$scope.NumerosFrecuentesListaGrupo3 = [];
						$scope.NumerosFrecuentesListaGrupo3.push(response.data.obtenerNumerosFrecuentesResponse.grupo3.listaNumeros);
						}	
					
					if($scope.listarGrupo3.length>0) {
						$scope.listarGrupo3=[];
					}
					for (var k = 0; k <$scope.NumerosFrecuentesListaGrupo3.length; k++) {
									var roleList = 
										{
										"numero":$scope.NumerosFrecuentesListaGrupo3[parseInt(k)].numero,
										"estado":$scope.NumerosFrecuentesListaGrupo3[parseInt(k)].numero,
										"flagNuevo":'true'										
										 } ;
								$scope.listarGrupo3.push(roleList); 
								$scope.listarGrupoCopiar3.push(roleList); 
								
								if($scope.NumerosFrecuentesGrupo3.idGrupo=='3_VC'){
									$scope.maxGrupo3=13;
								 
								 }
					}
					}
					
					ResquestAuditoria.estado = "SUCCESS";
					ResquestAuditoria.descripcionoperacion = "-";
					auditoria();	
            	}else {
					ResquestAuditoria.estado = "ERROR";
					ResquestAuditoria.descripcionoperacion = "obtenerNumerosFrecuentes - "+mensaje;
					auditoria();	
					$scope.estado='3';
					$("#contmovilplan").show();
					$("#editarNumero").hide();
					$("#errorTotal").show();
					$scope.errorFuncional=-1;
								
				}

	        },function(){});

		};
		
		this.guardarNumeroFrecuente= function(){
		var $this = $(this);
		retornarnumeroFrecuente();
		
		if(validarNumeroFrecuente()){
			$scope.listaNumeros=[];
			for (var k = 0; k <$scope.listarGrupo1.length; k++) {
					if($scope.NumerosFrecuentesGrupo1.idGrupo!=''){
						var flagNuevo=true;
						if($scope.listarGrupo1[parseInt(k)].estado==''){
							flagNuevo=true;
						}else {
								flagNuevo=false;
						}
							var roleListGrupo1 = 
							{
							"idOpcion":$scope.opcionSelecionado.idOpcion,
							"idGrupo":$scope.NumerosFrecuentesGrupo1.idGrupo,
							"numero":$scope.listarGrupo1[parseInt(k)].numero,
							"flagNuevo":flagNuevo								
							 } ;
							 $scope.listaNumeros.push(roleListGrupo1);
							 
							}
					
			}
			
			
			for (var i = 0; i <$scope.listarGrupo2.length; i++) {
					if($scope.NumerosFrecuentesGrupo2.idGrupo!=''){
						var flagNuevo2=true;
						if($scope.listarGrupo2[parseInt(i)].estado==''){
							flagNuevo2=true;
						}else {
								flagNuevo2=false;
						}
							var roleListGrupo2 = 
							{
							"idOpcion":$scope.opcionSelecionado.idOpcion,
							"idGrupo":$scope.NumerosFrecuentesGrupo2.idGrupo,
							"numero":$scope.listarGrupo2[parseInt(i)].numero,
							"flagNuevo":flagNuevo2
							 } ;
							 $scope.listaNumeros.push(roleListGrupo2);
					}
			}
			
			
			for (var j = 0; j <$scope.listarGrupo3.length; j++) {
					 if($scope.NumerosFrecuentesGrupo3.idGrupo!=''){
						var flagNuevo3=true;
						if($scope.listarGrupo3[parseInt(j)].estado==''){
							flagNuevo3=true;
						}else {
								flagNuevo3=false;					
							}
							var roleListGrupo3 = 
							{
							"idOpcion":$scope.opcionSelecionado.idOpcion,
							"idGrupo":$scope.NumerosFrecuentesGrupo3.idGrupo,
							"numero":$scope.listarGrupo3[parseInt(j)].numero,
							"flagNuevo":flagNuevo3
							 } ;
							 $scope.listaNumeros.push(roleListGrupo3);
						}
					
			}
			
			
			var jsonRequest =	{
	    		"categoria": '1',
				"idCuenta": null,
				"idRecibo": null,
				"idDireccion": null,
				"idProductoServicio": null,
				"listaNumeros": null	
			}
			
			
			jsonRequest.idCuenta =  $scope.objServico.idCuenta;
			jsonRequest.idRecibo =  $scope.objServico.idRecibo;
			jsonRequest.idDireccion =  $scope.objServico.idDireccion;
			jsonRequest.idProductoServicio =  $scope.objServico.idProductoServicio;
			jsonRequest.listaNumeros = $scope.listaNumeros
			dataRequest = $httpParamSerializer({requestJson:angular.toJson(jsonRequest)});
			managerservice.grabarNumerosFrecuentes(dataRequest).then(function(response) {				
				 var rpta = parseInt(response.data.grabarNumerosFrecuentesResponse.defaultServiceResponse.idRespuesta);
				 ResquestAuditoria.transactionId = response.data.grabarNumerosFrecuentesResponse.defaultServiceResponse.idTransaccional;
				 var mensaje = response.data.grabarNumerosFrecuentesResponse.defaultServiceResponse.mensaje;
				if( rpta==0) {
				ResquestAuditoria.estado = "SUCCESS";
				ResquestAuditoria.descripcionoperacion = "- ";
				auditoria();
				var $form = $this.closest("form");
				var $valid = $form.validate();
				if ($valid) {
					showPopUpFromFile("../view/popup/pop.numero_Frecuente.html");
				}
				}else {
					ResquestAuditoria.estado = "ERROR";
					ResquestAuditoria.descripcionoperacion = "grabarNumerosFrecuentes - "+mensaje;
					auditoria();

				showPopUpFromFile("../view/popup/pop.numero_Frecuente_error.html");
				
				}
				
	        }, function (response) {	
				
				});
			
			}
			
		 
		};
			
		$('#btfrecuentesaceptar').click(function(e){
			e.preventDefault();
			hidePopUp();
		});
		
		this.validarNumero=function(e) {
		if(e.keyCode==0){
			if (e.which==39 || e.which == 97 || e.which == 98 || e.which == 110 || e.which == 99 || e.which == 46) {
			e.preventDefault();
			}
			if ($.inArray(e.which, [46, 8, 9, 27, 13, 190]) !== -1 ||
			(e.which == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
			(e.which >= 35 && e.which <= 40)) {
			 return;
			}
			if ((e.shiftKey || (e.which < 48 || e.which > 57)) && (e.which < 96 || e.which >= 100)) {
			e.preventDefault();
			}
		
		}else {
		if (e.which==110 || e.which==105 || e.which==104 || e.which==103 || e.which==102 || e.which==101 || e.which==100 || e.which==99 || e.which==98 || e.which==97 || e.which==39 || e.which==46  ) {
		e.preventDefault();
		}
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
		(e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
		(e.keyCode >= 35 && e.keyCode <= 40)) {
		 return;
		}
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
		e.preventDefault();
		}
		}
	
		}
	
	  $(window).click(function(e) {
		retornarnumeroFrecuente();
	   
	  });
	  
	  function validar() {
	  
		var cantidadGrupo1=0;
		  for (var i = 0; i <$scope.listarGrupo1.length; i++) {
			var idText="inumero1"+i;
			var idClassGrupo1="idGrupo1"+i;
			if($scope.listarGrupo1[parseInt(i)].estado!=''){
				if($("#"+idText).val()===''){
					$("#"+idClassGrupo1).addClass("error");
					cantidadGrupo1=cantidadGrupo1+1;
				}
			}
			
		}
		
		var cantidadGrupo2=0;
		  for (var j = 0; j <$scope.listarGrupo2.length; j++) {
			var idText2="inumero2"+j;
			var idClassGrupo2="idGrupo2"+j;
			if($scope.listarGrupo2[parseInt(j)].estado!=''){
				if($("#"+idText2).val()===''){
					$("#"+idClassGrupo2).addClass("error");
					cantidadGrupo2=cantidadGrupo2+1;
				}
			}
			
		}
		
		var cantidadGrupo3=0;
		  for (var k = 0; k <$scope.listarGrupo3.length; k++) {
			var idText3="inumero3"+k;
			var idClassGrupo3="idGrupo3"+k;
			if($scope.listarGrupo3[parseInt(k)].estado!=''){
				if($("#"+idText3).val()===''){
					$("#"+idClassGrupo3).addClass("error");
					cantidadGrupo3=cantidadGrupo3+1;
				}
			}
			
		}

	 var cantidad=cantidadGrupo1+cantidadGrupo2+cantidadGrupo3;
	 
	  if(cantidad>0 ) {
		return false;
	  }else {
	  
	  return true;
	  }
	  
	  }
		  
	function actualizarProductoPrincipalSesion(idProductoServicio,nombreProducto,idCuenta,idRecibo) {
		var actualizarServicioSesion = {
			productoPrincipal: idProductoServicio,
			nombreProductoPrincipal: nombreProducto,
			idCuenta:idCuenta,
			idRecibo: idRecibo,
			idDireccion: null,
			idLinea: null,
			tipoLinea: '2',
			numeroTelFijo: '',
			categoria: $scope.categoria,
			tipoClienteProductoPrincipal:'1'
		}
		data = $httpParamSerializer({ requestJson: angular.toJson(actualizarServicioSesion) });
		managerservice.actualizarProductoPrincipalSesion(data).then(function(response) {
			
			
		});

	};
	
	function retornarnumeroFrecuente(){
		if(parseInt($scope.indexGrupo1)>=0) {
			var idGrupo1="idGrupo1"+$scope.indexGrupo1;
			var textEditar="editarGrupo1"+$scope.indexGrupo1;
			$("#"+idGrupo1).removeClass("focus");
			$("#"+textEditar).text("editar").addClass("red");
		  }
		  if(parseInt($scope.indexGrupo2)>=0) {
			var idGrupo2="idGrupo2"+$scope.indexGrupo2;
			var textEditar2="editarGrupo2"+$scope.indexGrupo2;
			$("#"+idGrupo2).removeClass("focus");
			$("#"+textEditar2).text("editar").addClass("red");
		  }
		  if(parseInt($scope.indexGrupo3)>=0) {
			var idGrupo3="idGrupo3"+$scope.indexGrupo3;
			var textEditar3="editarGrupo3"+$scope.indexGrupo3;
			$("#"+idGrupo3).removeClass("focus");
			$("#"+textEditar3).text("editar").addClass("red");
		  }
	}
	
	function auditoria() {
	
      var  Resquest = $httpParamSerializer({ requestJson: angular.toJson(ResquestAuditoria) });
        managerservice.enviarAuditoria(Resquest).then(function(response) {
		
        }, function(error) {
            
        });
    }
		  
	var $popup = $('.popup');
	function showPopUpFromFile($file) {
	   $h = $(window).height();
		var $pop = $(".popup .pop");
		var $cnt = $popup.find('.content');
		$cnt.html("").hide();
		$cnt.load($file, function() { $cnt.fadeIn(250); initFormFields(); });

		$pop.css({'margin-top': Math.round( ($h-300)/2) });
		$popup.fadeIn(350);
	}

	$('.popup .btclose, .popup .bg').click(function(){
        hidePopUp();
    });

	
	function hidePopUp() {
		$popup.fadeOut(250); 
	}
	
	

    };
	

    });

});

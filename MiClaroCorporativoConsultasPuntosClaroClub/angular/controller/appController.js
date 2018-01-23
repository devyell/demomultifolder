app.controller("mycontroller", function($scope, $http, $httpParamSerializer, CapaService) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    $scope.switchSelect = true;
    
    $scope.lsMovimiento = [];
	
	 var tramaAuditoria = {
        operationCode: 'T0029',
        pagina: 'P065',
        transactionId: null,
        estado: '',
        servicio: '-',
        tipoProducto: '-',
        tipoLinea: '-',
        tipoUsuario: '-',
        perfil: '-',
        monto: '',
        descripcionoperacion: '-',
        responseType: '/'
    };
	
	CapaService.getObtenerDatosSesion().then(function(response) {
			tramaAuditoria.tipoUsuario = response.data.comunResponseType.tipoCliente;
            $scope.tipoClienteUsuario = response.data.comunResponseType.tipoCliente;

        if ($scope.tipoClienteUsuario == 4) {
            $scope.showSwitch = true;
        }
			
			obtenerClaroPuntos() ;
			
        });
	var estado=0;

	function obtenerClaroPuntos() {
		$("#show_error_mis_puntos_claro_club").hide(); 
		CapaService.obtenerClaroPuntosRS().then(function(response) {    
				var id_respuesta2 = response.data.obtenerClaroPuntosResponse.defaultServiceResponse.idRespuesta;
				var idTransaccional = response.data.obtenerClaroPuntosResponse.defaultServiceResponse.idTransaccional;
				var mensaje = response.data.obtenerClaroPuntosResponse.defaultServiceResponse.mensaje;
				tramaAuditoria.transactionId=idTransaccional;
                if(id_respuesta2 == 0 || id_respuesta2 == 1){
                    estado=estado+1;
                    $scope.rs_claroPuntos = response.data.obtenerClaroPuntosResponse.claroPuntos;
                    $scope.rs_claroPuntosPorVencer = response.data.obtenerClaroPuntosResponse.claroPuntosPorVencer;
                    $scope.rs_claroPuntosFechaVencimiento = response.data.obtenerClaroPuntosResponse.claroPuntosFechaVencimiento.substr(0, 10);

                    if($scope.rs_claroPuntos == ""){
                        $scope.rs_claroPuntos = 0;
                    }

                    if($scope.rs_claroPuntosPorVencer == ""){
                        $scope.rs_claroPuntosPorVencer = 0;
                    }

                    if($scope.rs_claroPuntosFechaVencimiento == ""){
                        $scope.rs_claroPuntosFechaVencimiento = "";
                    }else{
                        $("#rs_claroPuntosFechaVencimiento").show();
                    }

                    var claropuntos = response.data.obtenerClaroPuntosResponse.claroPuntos;
                    if(claropuntos != 0){
                        $("#show_botoncanjear").show();                      
                    }
					tramaAuditoria.estado = "SUCCESS";
					tramaAuditoria.descripcionoperacion = "-";
					$scope.pushAuditoria();
                    $("#show_puntos").show();
					obtenerMovimientosClaroPuntos();
					
                }else{
                	tramaAuditoria.estado = "ERROR";
					tramaAuditoria.descripcionoperacion = "obtenerClaroPuntos - "+mensaje;
					$scope.pushAuditoria();
                	
                		$(".masdetalle20").hide();
                    	$(".masdetalle30").hide();
                    	$("#show_error_mis_puntos_claro_club").show(); 
                	
                	
                }

            });
		
	}
	
	function obtenerMovimientosClaroPuntos() {
    CapaService.obtenerMovimientosClaroPuntosRS().then(function(response) {   
    	
    	var id_respuesta = response.data.obtenerMovimientosClaroPuntosResponse.defaultServiceResponse.idRespuesta;
		var mensaje1 = response.data.obtenerMovimientosClaroPuntosResponse.defaultServiceResponse.mensaje;     
		var idTransaccional = response.data.obtenerMovimientosClaroPuntosResponse.defaultServiceResponse.idTransaccional; 
		tramaAuditoria.transactionId=idTransaccional;
        if(id_respuesta == 0 || id_respuesta == 3){
            estado=estado+1;
            $scope.lsMovimiento = response.data.obtenerMovimientosClaroPuntosResponse.listadoMovimientos;
            if (!Array.isArray($scope.lsMovimiento)) {                
                $scope.lsMovimiento = [];
                $scope.lsMovimiento.push(response.data.obtenerMovimientosClaroPuntosResponse.listadoMovimientos);                
            }else{
                if(($scope.lsMovimiento).length > 30){
                    $(".masdetalle30").show();
                }
                if(($scope.lsMovimiento).length > 20){
                    $(".masdetalle20").show();
                }
            }            
			obtenerClaroPuntos();
            $("#show_panel").show();
            
        }else{
			
			if(estado==0){
				$("#show_panel").hide();
			}else  if(estado==1) {
				$("#show_panel").show();
				$("#show_sin_movimientos").hide();
				
				$("#ultimoMovimiento").hide();
				$("#movimientoPuntos").hide();

			}
        	tramaAuditoria.estado = "ERROR";
			tramaAuditoria.descripcionoperacion = "obtenerMovimientosClaroPuntos - "+mensaje1;
			$scope.pushAuditoria();

        	
        }

    });
	
	}
	
	$scope.init_mis_puntos_claro= function() {
			obtenerClaroPuntos();
	
	}
	  $scope.pushAuditoria = function(){

        request = $httpParamSerializer({ requestJson: angular.toJson(tramaAuditoria)});
        CapaService.enviarAuditoria(request).then(function(response) {            
        }, function(error) {            
        });
    };

    $scope.switchChange = function() {

        window.location.replace("/wps/myportal/miclaro/consumer/consultas/puntosclaroclub/");

    }
	

});
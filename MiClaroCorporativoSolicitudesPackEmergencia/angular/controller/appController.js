app.controller("mycontroller", function($scope, $http, CapaService) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    $scope.show_step1 = true;
	$scope.show_step2 = false;

    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion03;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion03;

    var tramaAuditoria = {
        operationCode: 'T0064',
        pagina: 'P029',
        transactionId: null,
        estado: '',
        servicio: '',
        tipoProducto: 'CLAROTV',
        tipoLinea: '5',
        tipoUsuario: '2',
        perfil: '-',
        monto: '',
        descripcionoperacion: '',
        responseType: '/'
    };

    CapaService.getObtenerFlagProductoMovil().then(function(response) {
        
        tramaAuditoria.transactionId = response.data.comunResponseType.defaultServiceResponse.idTransaccional;

        var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        if(id_respuesta == "0"){

            var flag = response.data.comunResponseType.flagProductoMovilSesion;
			
            if(flag != "-1"){
                if(flag == "0" || flag == "1"){
                    $("#show_notiene").show(); 
                                   
                }else{
                    if(flag == "2" || flag == "3"){
                        $scope.init();
                    }else{
                        if(flag == ""){
                            $("#show_error_root").show();
                           
                        }
                    }                
                }
            }else{
                $("#show_error_root").show();
               
            }
        }else{
            $("#show_error_root").show();
            
        }
    });


    $scope.init = function(){

        CapaService.ServiceObtenerDatosUsuario().then(function(response) {
        
            var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            if(id_respuesta == 0){
				tramaAuditoria.servicio=response.data.comunResponseType.idRecibo;
				 
                $scope.data = response.data.comunResponseType;    
                $scope.loadObtenerDireccionesDespacho();
                $scope.loadObtenerTipoPackEmergencia();
                $scope.loadCantidadChip();
            }else{            
                $("#show_error_root").show();           
            }
            
           
        });

    };
 
    $scope.loadObtenerDireccionesDespacho = function(){
    	
    	var trama = {
    		tipoCliente: WPSTipoCliente.corporativo
    	};
    	
    	
        CapaService.ServiceObtenerDireccionesDespacho(trama).then(function(response) {
        
        	
            var id_respuesta = response.data.obtenerDireccionesDespachoResponse.defaultServiceResponse.idRespuesta;
            if(id_respuesta == 0){

                $scope.lsDireccion = response.data.obtenerDireccionesDespachoResponse.listaDirecciones; 
                if (Array.isArray($scope.lsDireccion)) { 
                    var flag_next = true;
                    angular.forEach($scope.lsDireccion,function(val,key){
                        if(flag_next){
                           if (val.idDireccion == $scope.wps_idDireccion) {
                                $scope.direccionSelect = $scope.lsDireccion[key];
                                flag_next = false;
                            } else {
                                $scope.direccionSelect = $scope.lsDireccion[0];
                            } 
                        }                        
                    });
                }else{
                    $scope.lsDireccion = [];
                    $scope.lsDireccion.push(response.data.obtenerDireccionesDespachoResponse.listaDirecciones);
                    $scope.direccionSelected = $scope.lsDireccion[0];
                    $(".pulldate").addClass("disabled");
                }

                $scope.direccionSelect = $scope.lsDireccion[0];
                $("#show_panel").show();
            }else{
                $("#show_error").show();
            }    		

        });

    };

    $scope.loadObtenerTipoPackEmergencia = function(){

        CapaService.ServiceObtenerTipoPackEmergencia().then(function(response) {
        
            var id_respuesta = response.data.obtenerTipoPackEmergenciaResponse.defaultServiceResponse.idRespuesta;
			 var mensaje = response.data.obtenerTipoPackEmergenciaResponse.defaultServiceResponse.mensaje;
			 tramaAuditoria.transactionId = response.data.obtenerTipoPackEmergenciaResponse.defaultServiceResponse.idTransaccional; 
            if(id_respuesta == 0){
                
            	$scope.lsTipoPack = response.data.obtenerTipoPackEmergenciaResponse.listaTipoPacks;
                $scope.tipoPackSelect = $scope.lsTipoPack[0];
                
                $scope.lsCantidadPack = [];
                $scope.sumaPack = 0;
                for (var i=1; i <= $scope.tipoPackSelect.cantidadPackDisponible; i++) {
                	$scope.sumaPack = $scope.sumaPack + $scope.tipoPackSelect.cantidadPackDisponible;
                    $scope.lsCantidadPack.push({ id:i, cantidad: i} );                    
                }
                $scope.cantidadPackSelect = $scope.lsCantidadPack[0];
                
                if($scope.sumaPack == 0){
                	$scope.show_nopack = true;
                }else{
                	$scope.show_sipack = true;
                }                
            }else{
				tramaAuditoria.estado = "ERROR";
				tramaAuditoria.descripcionoperacion = "obtenerTipoPackEmergencia - "+mensaje;
				$scope.pushAuditoria();
            	if(id_respuesta == 9){
            		$scope.show_nopack = true;	
            	}else{
            		  $("#show_error").show();
            	}
            	
            }

        });

    };
    
    $scope.loadCantidadChip = function(){

        $scope.lsCantidadChip = [];
        for (var i=1; i <=5; i++) {
            $scope.lsCantidadChip.push({ id:i, cantidad: i} );                    
        }
        $scope.cantidadChipSelect = $scope.lsCantidadChip[0];

    };

    $scope.changeTipoPack = function(){

        $scope.lsCantidadPack = [];
        for (var i=1; i <= $scope.tipoPackSelect.cantidadPackDisponible; i++) {
            $scope.lsCantidadPack.push({ id:i, cantidad: i});
        }

        $scope.cantidadPackSelect = $scope.lsCantidadPack[0]; 

    };

    $scope.sendSolicitarChipPackEmergencia = function(){
    	
    	var trama = {
    		idDireccion:  $scope.direccionSelect.detalleDireccion,
    		idTipoPack: $scope.tipoPackSelect.idTipoPack,
    		cantidadPacks: $scope.cantidadPackSelect.cantidad
    	};
        
    
    	
    	CapaService.ServiceSolicitarChipPackEmergencia(trama).then(function(response) {
            
        	
    		var id_respuesta = response.data.solicitarChipPackEmergenciaResponse.defaultServiceResponse.idRespuesta;
			var mensaje = response.data.solicitarChipPackEmergenciaResponse.defaultServiceResponse.mensaje;
    		if(id_respuesta == 0){
				tramaAuditoria.estado = "SUCCESS";
				tramaAuditoria.descripcionoperacion = "-";

            	var respuesta = response.data.solicitarChipPackEmergenciaResponse.resultado;
            	if(respuesta == "true"){
                    $("#view_listo").show();
            	}else{
            		$("#view_error").show();
            	}   
				$scope.pushAuditoria();
            }else{
				tramaAuditoria.estado = "ERROR";
				tramaAuditoria.descripcionoperacion = "solicitarChipPackEmergencia - "+mensaje;
				$scope.pushAuditoria();
            	if(id_respuesta == 1){
            		$("#view_error").show();
            	}
            }

        });        

    };

    $scope.action_continue = function(){    	
    	$scope.show_step1 = false;
		$scope.show_step2 = true;
    };

    $scope.action_cancel = function(){    	
    	$scope.show_step1 = true;
		$scope.show_step2 = false;
    };

    $scope.close_popup = function(){
    	cerrarPopUp();
    };

    $scope.cerrarListo = function(){
        $("#view_listo").hide();    
    };

    $scope.cerrarError = function(){
        $("#view_error").hide();    
    };
    
    $scope.cerrarLimite = function(){
        $("#view_limite").hide();    
    };

    $scope.pushAuditoria = function(){
    	
        CapaService.enviarAuditoria(tramaAuditoria).then(function(response) {            
        }, function(error) {            
        });
        
    };

});

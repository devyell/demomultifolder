app.controller("mycontroller", function($scope, $http, $httpParamSerializer, CapaServicio) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    
    $(document).ready(function() {
        $("#imgPublicidad").load("/wps/wcm/myconnect/mi%20claro%20content%20library/mi%20claro/banners/Servicios%20Contratados%20Fijo%20Consumer");
        $('.help').tooltip({placement: "top"});
    });   

    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02; 

    var fixed_categoria = WPSCategoria.fijo;
    var fixed_tipoPermiso = WPSTipoPermiso.todos;
    var fixed_titularidadServicio = 7;
    var fixed_pagina = 0;
    var fixed_cantResultadosPagina = 0;
    var fixed_productoPrincipalXidRecibo = false;
    var fixed_tipoLinea = 3;
    var fixed_tipoCliente = 1;
    
    var tramaAuditoria = {
        operationCode: 'T0002',
        pagina: 'P006',
        transactionId: null,
        estado: '',
        servicio: '-',
        tipoProducto: 'TELEFONIA',
        tipoLinea: '-',
        tipoUsuario: '1',
        perfil: '-',
        monto: '',
        descripcionoperacion: '-',
        responseType: '/'
    };

    CapaServicio.getObtenerFlagProductoFijoSesion().then(function(response) {
    	    	
				
    	tramaAuditoria.transactionId = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
    	
        var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta; 
        if(id_respuesta == 0){

            var flag = response.data.comunResponseType.flagProductoFijoSesion;
            if(flag != "-1"){
                if(flag == "0" || flag == "2"){
                    $("#show_notiene").show();
                                 
                }else{
                    if(flag == "1" || flag == "3"){
                        $scope.init();
                    }else{
                        if(flag == ""){
                            $("#show_error_roor").show();
                            
                        }
                    }
                }
            }else{
                $("#show_error_roor").show();                               
                
            }
        }else{
            $("#show_error_roor").show();
           
        }

    });

    $scope.init = function(){  

        $("#show_panel").hide();
        $("#show_error").hide();

        CapaServicio.getObtenerServicioPrincipal().then(function(response) {
        	
        	var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            if(id_respuesta == 0){
                $scope.productoPrincipal = response.data.comunResponseType.productoPrincipal;
                $scope.idDireccion = response.data.comunResponseType.idDireccion;
                $("#show_panel").show();	            
				$scope.getObtenerServicios();
        	}else{
                $("#show_error").show();
        	}

          
            
        }, function(error){});

    };

    $scope.getObtenerServicios = function(){

        $("#show_servicios").hide();
        $("#show_servicios_error").hide();

        var trama = {
            categoria: fixed_categoria,
            tipoLinea: fixed_tipoLinea,
            tipoCliente: fixed_tipoCliente,             
            idProductoServicio: null,
            tipoPermiso: fixed_tipoPermiso,
            idCuenta: null,
            idRecibo: null,
            idDireccion: null,
            nombreProducto: null,
            pagina: fixed_pagina,
            cantResultadosPagina: fixed_cantResultadosPagina,
            productoPrincipalXidRecibo: fixed_productoPrincipalXidRecibo,
            titularidadServicio: fixed_titularidadServicio
        };

	    request = $httpParamSerializer({requestJson:angular.toJson(trama)});
	    CapaServicio.getObtenerServicios(request).then(function(response) {
			
            var id_respuesta = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
			var mensaje = response.data.obtenerServiciosResponse.defaultServiceResponse.mensaje;
			tramaAuditoria.transactionId = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional; 
	    	if(id_respuesta == 0){

                $scope.lsServicio = response.data.obtenerServiciosResponse.listadoProductosServicios;
                if (Array.isArray($scope.lsServicio)) {  
                
                    var flag_next = true;
                    angular.forEach($scope.lsServicio,function(val,key){
                        if(flag_next){
                           if (val.ProductoServicioResponse.idProductoServicio == $scope.productoPrincipal) {
                                $scope.servicioSelect = $scope.lsServicio[key];
								tramaAuditoria.servicio=$scope.servicioSelect.ProductoServicioResponse.nombre;
								tramaAuditoria.tipoLinea=$scope.servicioSelect.ProductoServicioResponse.tipoLinea;
								tramaAuditoria.perfil=$scope.servicioSelect.ProductoServicioResponse.tipoPermiso;
								
                                flag_next = false;
                            } else {
                                $scope.servicioSelect = $scope.lsServicio[0];   
								tramaAuditoria.servicio=$scope.servicioSelect.ProductoServicioResponse.nombre;
								tramaAuditoria.tipoLinea=$scope.servicioSelect.ProductoServicioResponse.tipoLinea;
								tramaAuditoria.perfil=$scope.servicioSelect.ProductoServicioResponse.tipoPermiso;
                            } 
                        }                        
                    });
                
                }else{
                    $scope.lsServicio = [];
                    $scope.lsServicio.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                    $scope.servicioSelect = $scope.lsServicio[0];
					tramaAuditoria.servicio=$scope.servicioSelect.ProductoServicioResponse.nombre;
					tramaAuditoria.tipoLinea=$scope.servicioSelect.ProductoServicioResponse.tipoLinea;
					tramaAuditoria.perfil=$scope.servicioSelect.ProductoServicioResponse.tipoPermiso;
                    $(".pullservicio").addClass("disabled");
                }	  

                $scope.getObtenerDatosAdicionalesServicioFijoWS();
                $scope.getObtenerDetallePlanFijaWS();
                $scope.getObtenerServiciosAdicionalesWS(); 
                $scope.actualizarProductoPrincipalSesion();    
					

                $("#show_servicios").show();

	    	}else{
				tramaAuditoria.estado = "ERROR";
				tramaAuditoria.descripcionoperacion = "obtenerServicios - "+mensaje;
				$scope.pushAuditoria();
                $("#show_servicios_error").show();
            }

	    });
	    
	    $("#fijo").delay(400).show(0);
	    setTimeout(function() { animateBOX('.box'); }, 400);
	    
    };

    $scope.getObtenerDatosAdicionalesServicioFijoWS = function() {

        $("#show_datosadicionales").hide();
        $("#show_datosadicionales_error").hide();

        var trama = {
            "idProductoServicio": $scope.servicioSelect.ProductoServicioResponse.idProductoServicio,
            "categoria": fixed_categoria,
            "idDireccion": $scope.servicioSelect.ProductoServicioResponse.idDireccion,
            "idLinea": null
        };

        $scope.wps_fechaActivacion      = "";
        $scope.wps_estado               = "";
        $scope.wps_direccionCompleta    = "";
        $scope.wps_planActual           = "";
        $scope.wps_simboloMoneda        = "";
        $scope.wps_cargoFijo            = "";
        
        request = $httpParamSerializer({requestJson:angular.toJson(trama)});
        CapaServicio.getObtenerDatosAdicionalesServicioFijo(request).then(function(response) {

        	var id_respuesta = response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.idRespuesta;
			var mensaje = response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.mensaje;
			tramaAuditoria.transactionId = response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.idTransaccional; 
            if(id_respuesta == 0 || id_respuesta == 4){

            	var fecha = response.data.obtenerDatosAdicionalesServicioFijoResponse.fechaActivacion;
            							  
                if(fecha != ""){
                    $scope.wps_fechaActivacion = response.data.obtenerDatosAdicionalesServicioFijoResponse.fechaActivacion;
                    $scope.wps_show_fecha_activacion = true;
                }else{
                    $scope.wps_fechaActivacion = "";
                    $scope.wps_show_fecha_activacion = false;
                }
                
    			$scope.wps_estado = response.data.obtenerDatosAdicionalesServicioFijoResponse.estado;
    			if($scope.wps_estado != ""){
    				$scope.wps_show_estado = true;
    			}else{
    				$scope.wps_show_estado = false;
    			}
            	
                $scope.wps_direccionCompleta    = response.data.obtenerDatosAdicionalesServicioFijoResponse.direccionCompleta;
                $scope.wps_planActual           = response.data.obtenerDatosAdicionalesServicioFijoResponse.planActual;
                $scope.wps_simboloMoneda        = response.data.obtenerDatosAdicionalesServicioFijoResponse.simboloMoneda;
                $scope.wps_cargoFijo            = response.data.obtenerDatosAdicionalesServicioFijoResponse.cargoFijo;

                $("#show_datosadicionales").show();

            }else{    
				tramaAuditoria.estado = "ERROR";
				tramaAuditoria.descripcionoperacion = "obtenerDatosAdicionalesServicioFijo  - "+mensaje;
				$scope.pushAuditoria();
                $("#show_datosadicionales_error").show();
            }           

        },function(){});

    };

    $scope.getObtenerDetallePlanFijaWS = function(){

        $("#show_detalleplan").hide();
        $("#show_detalleplan_error").hide();

        var trama =   {
            "idProductoServicio": $scope.servicioSelect.ProductoServicioResponse.idProductoServicio,
            "idDireccion": $scope.servicioSelect.ProductoServicioResponse.idDireccion,
            "idLinea": null
        };
        
        $scope.wps_lsListadoDetalle = [];        
        request = $httpParamSerializer({requestJson:angular.toJson(trama)});
        CapaServicio.getObtenerDetallePlanFija(request).then(function(response) {
        	
        	var id_respuesta = response.data.obtenerDetallePlanFijaResponse.defaultServiceResponse.idRespuesta;
			var mensaje = response.data.obtenerDetallePlanFijaResponse.defaultServiceResponse.mensaje;
			tramaAuditoria.transactionId = response.data.obtenerDetallePlanFijaResponse.defaultServiceResponse.idTransaccional; 
            if(id_respuesta == 0){
            	if(response.data.obtenerDetallePlanFijaResponse.listadoDetalle){
            		$scope.wps_lsListadoDetalle = response.data.obtenerDetallePlanFijaResponse.listadoDetalle;                
                    if (!angular.isArray($scope.wps_lsListadoDetalle)) {                 
                        $scope.wps_lsListadoDetalle = [];
                        $scope.wps_lsListadoDetalle.push(response.data.obtenerDetallePlanFijaResponse.listadoDetalle);
                    }
            	}else{
            		$scope.wps_lsListadoDetalle = [];
            	}
				tramaAuditoria.estado = "SUCCESS";
				tramaAuditoria.descripcionoperacion = "-";
				$scope.pushAuditoria();
                                
                $("#show_detalleplan").show();
            }else{ 
            	
            	if(id_respuesta == 4){
            	
            	}else{
            		$("#show_detalleplan_error").show();
            	}
				tramaAuditoria.estado = "ERROR";
				tramaAuditoria.descripcionoperacion = "obtenerDetallePlanFija  - "+mensaje;
				$scope.pushAuditoria();
            	
            }            

        },function(){});
        
    };

    $scope.getObtenerServiciosAdicionalesWS = function() {

        $("#show_serviciosadicionales").hide();
        $("#show_serviciosadicionales_error").hide();    

        var trama = {
            "categoria": fixed_categoria,
            "idProductoServicio": $scope.servicioSelect.ProductoServicioResponse.idProductoServicio,
            "idCuenta": null,
            "idRecibo": null,
            "idDireccion": $scope.idDireccion,            
            "idLinea": null
        };

        $scope.wps_lsServicioAdicional = [];
        
		request = $httpParamSerializer({requestJson:angular.toJson(trama)});
    	CapaServicio.getObtenerServiciosAdicionales(request).then(function(response) {	

    		var id_respuesta = response.data.obtenerServiciosAdicionalesResponse.defaultServiceResponse.idRespuesta;                		
			var mensaje = response.data.obtenerServiciosAdicionalesResponse.defaultServiceResponse.mensaje;
			tramaAuditoria.transactionId = response.data.obtenerServiciosAdicionalesResponse.defaultServiceResponse.idTransaccional; 
    		if(id_respuesta == 0){

    			$scope.wps_lsServicioAdicional = response.data.obtenerServiciosAdicionalesResponse.listado;                
                
                if (!angular.isArray($scope.wps_lsServicioAdicional)) {                 
                    $scope.wps_lsServicioAdicional = [];
                    $scope.wps_lsServicioAdicional.push(response.data.obtenerServiciosAdicionalesResponse.listado);
                }

                if( ($scope.wps_lsServicioAdicional).length>0 ){
                    $("#show_serviciosadicionales").show();
                }                

    		}else{

                if(id_respuesta == 4){
                    
                }else{
                    $("#show_serviciosadicionales_error").show();    
                }
				tramaAuditoria.estado = "ERROR";
				tramaAuditoria.descripcionoperacion = "obtenerServiciosAdicionales  - "+mensaje;
				$scope.pushAuditoria();
                
            }
    		
        },function(){});
	
    };

    $scope.getSolicitarServicioAdicional = function(model) {

        var trama =   {
            "categoria": fixed_categoria,
            "idProductoServicio": $scope.servicioSelect.ProductoServicioResponse.idProductoServicio,
            "codServicioAdicional": model.codServicioAdicional,
            "codTipoServicioAdicional": model.codTipoServicioAdicional,
            "idCuenta": null,
            "idRecibo": null,
            "idDireccion": null,            
            "idLinea": null            
        };

        request = $httpParamSerializer({requestJson:angular.toJson(trama)});
        CapaServicio.getSolicitarServicioAdicional(request).then(function(response) {

            var id_respuesta = response.data.solicitarServicioAdicionalResponse.defaultServiceResponse.idRespuesta;
			 var mensaje = response.data.solicitarServicioAdicionalResponse.defaultServiceResponse.mensaje;
			 tramaAuditoria.transactionId = response.data.solicitarServicioAdicionalResponse.defaultServiceResponse.idTransaccional; 
            if(id_respuesta == 0){
                var resultado = response.data.solicitarServicioAdicionalResponse.resultado;
                if(resultado == 'true'){
                    window.location.replace("/wps/myportal/miclaro/consumer/solicitudes/paquetestvadicionales");                     
                }
            }else {
				tramaAuditoria.estado = "ERROR";
				tramaAuditoria.descripcionoperacion = "solicitarServicioAdicional  - "+mensaje;
				$scope.pushAuditoria();
			}
            
        },function(){});

        tramaAuditoria.transactionId = response.data.solicitarServicioAdicionalResponse.defaultServiceResponse.idRespuesta;
        var wpsclaro_mensaje = response.data.comunResponseType.defaultServiceResponse.mensaje;
        
        if(id_respuesta == 0){
            var rs = response.data.solicitarServicioAdicionalResponse.resultado;
            if(rs == 'true'){
                tramaAuditoria.estado = "SUCCESS"; 
                tramaAuditoria.descripcionoperacion = "-";
            }else{
                tramaAuditoria.estado = "ERROR";
                tramaAuditoria.descripcionoperacion = "solicitarServicioAdicional - " + wpsclaro_mensaje;
            }
        }else{
            tramaAuditoria.estado = "ERROR";
            tramaAuditoria.descripcionoperacion = "solicitarServicioAdicional - " + wpsclaro_mensaje;
        }
        $scope.pushAuditoria();
        
    };

    $scope.changeServicio = function(){
			
		animacionBox();
		tramaAuditoria.servicio=$scope.servicioSelect.ProductoServicioResponse.nombre;
		tramaAuditoria.tipoLinea=$scope.servicioSelect.ProductoServicioResponse.tipoLinea;
		tramaAuditoria.perfil=$scope.servicioSelect.ProductoServicioResponse.tipoPermiso;
        
        $scope.getObtenerDatosAdicionalesServicioFijoWS();
    	$scope.getObtenerDetallePlanFijaWS();
    	$scope.getObtenerServiciosAdicionalesWS();	
        $scope.actualizarProductoPrincipalSesion();		
		$scope.pushAuditoria();

    };

    $scope.actualizarProductoPrincipalSesion = function() {

        var trama = {
            productoPrincipal: $scope.servicioSelect.ProductoServicioResponse.idProductoServicio,
            nombreProductoPrincipal: $scope.servicioSelect.ProductoServicioResponse.nombre,
            idDireccion: $scope.servicioSelect.ProductoServicioResponse.idDireccion,
            tipoLinea: $scope.servicioSelect.ProductoServicioResponse.tipoLinea,
            categoria: fixed_categoria,
            tipoClienteProductoPrincipal: $scope.servicioSelect.ProductoServicioResponse.tipoCliente,
            idCuenta: null,
            idRecibo: null,            
            idLinea: null,            
            numeroTelFijo: null
        };

        request = $httpParamSerializer({requestJson:angular.toJson(trama)});
        CapaServicio.actualizarProductoPrincipalSesion(request).then(function(response) {
        	
        });

    };

    $scope.pushAuditoria = function(){
    	
        request = $httpParamSerializer({ requestJson: angular.toJson(tramaAuditoria)});
        CapaServicio.enviarAuditoria(request).then(function(response) {  
        }, function(error) {            
        });

    }

    $scope.dataLayerVerSaldosConsumos = function(){

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Consultas',
            'action': 'Botón: Fijo',
            'label': 'Ver saldos y consumos'
        });

        window.location.replace("/wps/myportal/miclaro/consumer/consultas/saldosyconsumos/fijo");        

    };

    $scope.dataLayerVerDetalleConsumo = function(){

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Consultas',
            'action': 'Botón: Fijo',
            'label': 'Ver detalle de consumo'
        });

        window.location.replace("/wps/myportal/miclaro/consumer/consultas/detalleconsumos/fijo");       

    };

    $scope.dataLayerCambiarPlan = function(){

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Consultas',
            'action': 'Botón: Fijo',
            'label': 'Cambiar de plan'
        });

        window.location.replace("/wps/myportal/miclaro/consumer/solicitudes/cambiodeplan/fijo");                

    };
    
    $scope.switchChange = function(){
        window.location.replace("/wps/myportal/miclaro/corporativo/consultas/servicioscontratados/fijo");
    };
    
    animateBOX = function(boxClass) {

        var $time = 0;
        var $tpos = 0;
        $(boxClass).each(function(ix, el) {
            var $tmp = $(this);
            var $pos = $(this).offset().top;

            if ($tpos != $pos) {
                $tpos = $pos;
                $time = $time + 150;
            }
            $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 400);
        });

    };

});

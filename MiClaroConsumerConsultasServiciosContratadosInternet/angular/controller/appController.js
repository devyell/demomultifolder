app.controller("mycontroller", function($scope, $http, $httpParamSerializer, CapaServicio) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    
    $(document).ready(function() {
        $("#imgPublicidad").load("/wps/wcm/myconnect/mi%20claro%20content%20library/mi%20claro/banners/Servicios%20Contratados%20Internet%20Consumer");
    });

    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion02;

    var fixed_categoria = WPSCategoria.internet;
    var fixed_tipoPermiso = WPSTipoPermiso.todos;
    var fixed_titularidadServicio = 7;
    var fixed_pagina = 0;
    var fixed_cantResultadosPagina = 0;
    var fixed_productoPrincipalXidRecibo = false;
    var fixed_tipoLinea = 3;
    var fixed_tipoCliente = 1;
    var fixed_pagina = 0;
    var fixed_cantResultadosPagina = 0;
    
    var tramaAuditoria = {
        operationCode: 'T0002',
        pagina: 'P007',
        transactionId: null,
        estado: '',
        servicio: '-',
        tipoProducto: 'INTERNET',
        tipoLinea: '5',
        tipoUsuario: '1',
        perfil: '-',
        monto: '',
        descripcionoperacion: '-',
        responseType: '/'
    };

    CapaServicio.getObtenerFlagProductoInternetSesion().then(function(response) {
        
        tramaAuditoria.transactionId = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
        
        var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;      
        if(id_respuesta == 0){

            var flag = response.data.comunResponseType.flagProductoInternetSesion;
            if(flag != "-1"){
                if(flag == "0" || flag == "2"){
                    $("#show_notiene").show();
                                
                }else{
                    if(flag == "1" || flag == "3"){
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

        $("#show_panel").hide();
        $("#show_error").hide();

        CapaServicio.getObtenerServicioPrincipal().then(function(response) {
        	
            var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            if(id_respuesta == 0){
	        	$scope.productoPrincipal = response.data.comunResponseType.productoPrincipal;	            
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
                $scope.getObtenerDetallePlanInternetWS();       
                $scope.actualizarProductoPrincipalSesion();         
				
                $("#show_servicios").show();

	    	}else{
				tramaAuditoria.estado = "ERROR";
				tramaAuditoria.descripcionoperacion = "obtenerServicios - "+mensaje;
				$scope.pushAuditoria();
                $("#show_servicios_error").show();
	    	}

	    });
	    
	    $("#internet").delay(400).show(0);
	    setTimeout(function() { animateBOX('.box'); }, 400);
	    
    };

    $scope.getObtenerDetallePlanInternetWS = function(){

        $("#show_detalleplan").hide();
        $("#show_detalleplan_error").hide();

        var trama =   {
            "idDireccion": $scope.servicioSelect.ProductoServicioResponse.idDireccion,
            "idProductoServicio": $scope.servicioSelect.ProductoServicioResponse.idProductoServicio
        };

        $scope.wps_porcentajeVelocidadMinima = "";
        $scope.wps_porcentajeVelocidadMaxima = "";
        $scope.wps_velocidadMinima = "";
        $scope.wps_velocidadMaxima = "";
        $scope.wps_megasPlan = "";
        $scope.wps_nombrePlan = "";
        
        request = $httpParamSerializer({requestJson:angular.toJson(trama)});
        CapaServicio.getObtenerDetallePlanInternet(request).then(function(response) {
        	
        	
            var id_respuesta = response.data.obtenerDetallePlanInternetResponse.defaultServiceResponse.idRespuesta;
			var mensaje = response.data.obtenerDetallePlanInternetResponse.defaultServiceResponse.mensaje;
			tramaAuditoria.transactionId = response.data.obtenerDetallePlanInternetResponse.defaultServiceResponse.idTransaccional; 
            if(id_respuesta == 0){
                
                $scope.wps_porcentajeVelocidadMinima    = response.data.obtenerDetallePlanInternetResponse.porcentajeVelocidadMinima;
                $scope.wps_porcentajeVelocidadMaxima    = response.data.obtenerDetallePlanInternetResponse.porcentajeVelocidadMaxima;
                
                $scope.wps_velocidadMinima = response.data.obtenerDetallePlanInternetResponse.velocidadMinima;
                $scope.wps_velocidadMaxima = response.data.obtenerDetallePlanInternetResponse.velocidadMaxima;
                
                if ($scope.wps_velocidadMinima == "0" || $scope.wps_velocidadMinima == "") {
                    $scope.wps_velocidadMinima = $scope.wps_porcentajeVelocidadMinima + "% de la velocidad contratada";
                }

                if ($scope.wps_velocidadMaxima == "0" || $scope.wps_velocidadMaxima == "") {
                    $scope.wps_velocidadMaxima = $scope.wps_porcentajeVelocidadMaxima + "% de la velocidad contratada";
                }
                
                $scope.wps_megasPlan                    = response.data.obtenerDetallePlanInternetResponse.megasPlan;
                $scope.wps_nombrePlan                   = response.data.obtenerDetallePlanInternetResponse.nombrePlan;

                $("#show_detalleplan").show();   

				tramaAuditoria.estado = "SUCCESS";
				tramaAuditoria.descripcionoperacion = "-";
				$scope.pushAuditoria();			

            }else{
                if(id_respuesta == 4){
                
                }else{
                    $("#show_detalleplan_error").show();    
                }
				tramaAuditoria.estado = "ERROR";
				tramaAuditoria.descripcionoperacion = "obtenerDetallePlanInternet - "+mensaje;
				$scope.pushAuditoria();
                
            }

        },function(){});
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

        $scope.wps_fechaActivacion 		= "";
		$scope.wps_estado 				= "";
		$scope.wps_direccionCompleta 	= "";
		$scope.wps_planActual 			= "";
		$scope.wps_simboloMoneda 		= "";
		$scope.wps_cargoFijo 			= "";
		
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
    			
    			$scope.wps_direccionCompleta 	= response.data.obtenerDatosAdicionalesServicioFijoResponse.direccionCompleta;
    			$scope.wps_planActual 			= response.data.obtenerDatosAdicionalesServicioFijoResponse.planActual;
    			$scope.wps_simboloMoneda 		= response.data.obtenerDatosAdicionalesServicioFijoResponse.simboloMoneda;
    			$scope.wps_cargoFijo 			= response.data.obtenerDatosAdicionalesServicioFijoResponse.cargoFijo;

                $("#show_datosadicionales").show();                

    		}else{ 
				tramaAuditoria.estado = "ERROR";
				tramaAuditoria.descripcionoperacion = "obtenerDatosAdicionalesServicioFijo - "+mensaje;
				$scope.pushAuditoria();
                $("#show_datosadicionales_error").show();                
            }    		

        },function(){});

	};

    $scope.changeServicio = function(){		
        
        animacionBox();
		tramaAuditoria.servicio=$scope.servicioSelect.ProductoServicioResponse.nombre;
		tramaAuditoria.tipoLinea=$scope.servicioSelect.ProductoServicioResponse.tipoLinea;
		tramaAuditoria.perfil=$scope.servicioSelect.ProductoServicioResponse.tipoPermiso;
		
        
        $scope.getObtenerDatosAdicionalesServicioFijoWS();
    	$scope.getObtenerDetallePlanInternetWS();	
        $scope.actualizarProductoPrincipalSesion();		

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

        request = $httpParamSerializer({requestJson: angular.toJson(trama)});
        CapaServicio.actualizarProductoPrincipalSesion(request).then(function(response) {
            
        });

    };

    $scope.pushAuditoria = function(){

        request = $httpParamSerializer({ requestJson: angular.toJson(tramaAuditoria)});
        CapaServicio.enviarAuditoria(request).then(function(response) { 
            
        }, function(error) {            
        });

    }

    $scope.dataLayerMedirVelocidad = function(){

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Consultas',
            'action': 'Botón: Internet',
            'label': 'Medir Velocidad'
        });

        window.open("https://midetuvelocidad.claro.com.pe/?");

    };

    $scope.dataLayerCambiarPlan = function(){

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Consultas',
            'action': 'Botón: Internet',
            'label': 'Cambiar de plan'
        });

        window.location.replace("/wps/myportal/miclaro/consumer/solicitudes/cambiodeplan/internet");

    };
    
    $scope.switchChange = function(){
        window.location.replace("/wps/myportal/miclaro/corporativo/consultas/servicioscontratados/internet");
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

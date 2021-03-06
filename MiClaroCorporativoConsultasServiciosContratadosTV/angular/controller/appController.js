app.controller("mycontroller", function($scope, $http, $httpParamSerializer, CapaServicio) {

    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';        

    $(document).ready(function() {
		$("#imgPublicidad").load("/wps/wcm/myconnect/mi%20claro%20content%20library/mi%20claro/banners/Servicios%20Contratados%20TV%20Corporativo");
	});

    $scope.switchSelect = true;
    
    $scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
    $scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
    $scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;

    $scope.mensaje_upps_titulo = WPSMensajeError.upps;
    $scope.mensaje_upps_descripcion01 = WPSMensajeError.upps_descripcion01;
    $scope.mensaje_upps_descripcion02 = WPSMensajeError.upps_descripcion03;

    var fixed_categoria = WPSCategoria.tv;
    var fixed_tipoPermiso = WPSTipoPermiso.todos;
    var fixed_titularidadServicio = 7;
    var fixed_productoPrincipalXidRecibo = false;
    var fixed_tipoLinea = 3;
    var fixed_tipoCliente = 2;
    var fixed_pagina = 0;
    var fixed_cantResultadosPagina = 0;
    
    var tramaAuditoria = {
        operationCode: 'T0002',
        pagina: 'P054',
        transactionId: null,
        estado: '',
        servicio: '-',
        tipoProducto: 'CLAROTV',
        tipoLinea: '5',
        tipoUsuario: '2',
        perfil: '1',
        monto: '',
        descripcionoperacion: 'consultaServiciosContratados',
        responseType: '/'
    };

    CapaServicio.getObtenerFlagProductoTV().then(function(response) {
        
        tramaAuditoria.transactionId = response.data.comunResponseType.defaultServiceResponse.idTransaccional;

        var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
        if(id_respuesta == 0){

            var flag = response.data.comunResponseType.flagProductoTVSesion;

            if(flag != "-1"){
                if(flag == "0" || flag=="1"){
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

        $("#show_panel").hide();
        $("#show_error").hide();

    	CapaServicio.getObtenerServicioPrincipal().then(function(response) {

            var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
            if(id_respuesta == 0){

                $scope.idCuentaPrincipal    = response.data.comunResponseType.idCuenta;
                $scope.idDireccion          = response.data.comunResponseType.idDireccion;
                $scope.idLinea              = response.data.comunResponseType.idLinea;
                $scope.idReciboPrincipal    = response.data.comunResponseType.idRecibo;
                $scope.nombreAliasaMostrar  = response.data.comunResponseType.nombreProductoPrincipal;
                $scope.idServicio           = response.data.comunResponseType.productoPrincipal;
                $scope.tipoCliente          = response.data.comunResponseType.tipoClienteProductoPrincipal;
                $scope.categoria            = response.data.comunResponseType.categoria;
                $scope.tipoLinea            = response.data.comunResponseType.tipoLinea;
                
                $("#show_panel").show();
                $scope.obtenerListaDireccion();

            }else{  
                $("#show_error").show();
            }

           
            
        }, function(error){});

    };

	$scope.obtenerListaDireccion = function(){

        $("#show_direcciones").hide();
        $("#show_direcciones_error").hide();

        var trama = {
            "tipoCliente": 8
        };

        request = $httpParamSerializer({requestJson:angular.toJson(trama)});
        CapaServicio.obtenerListadoDireccion(request).then(function(response) {

            var id_respuesta = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idRespuesta;  
            if(id_respuesta == 0){ 
                

                $scope.lsDireccion = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;
                if (Array.isArray($scope.lsDireccion)) { 
                    
                    var flag_next = true;
                    angular.forEach($scope.lsDireccion,function(val,key){
                        if(flag_next){
                           if (val.idDireccion == $scope.idDireccion) {
                                $scope.direccionSelected = $scope.lsDireccion[key];
                                flag_next = false;
                            } else {
                                $scope.direccionSelected = $scope.lsDireccion[0];
                            } 
                        }                        
                    });

                }else{                                           
                    $scope.lsDireccion = [];
                    $scope.lsDireccion.push(response.data.obtenerListadoFijoDireccionResponse.listadoDireccion);
                    $scope.direccionSelected = $scope.lsDireccion[0];
                    $(".pulldate").addClass("disabled");
                }

                $("#show_direcciones").show();
                $scope.obtenerListaServicio();

            }else{
                $("#show_direcciones_error").show();                 
            }

        }, function(error){});

    };

    $scope.obtenerListaServicio = function(){

        $("#show_servicios").hide();
        $("#show_servicios_error").hide();
        $("#show_servicios_name_error").hide();

        var trama = {
            categoria: fixed_categoria,
            tipoLinea: fixed_tipoLinea,
            tipoCliente: fixed_tipoCliente,             
            idProductoServicio: null,
            tipoPermiso: fixed_tipoPermiso,
            idCuenta: null,
            idRecibo: null,
            idDireccion: $scope.direccionSelected.idDireccion,
            nombreProducto: null,
            pagina: fixed_pagina,
            cantResultadosPagina: fixed_cantResultadosPagina,
            productoPrincipalXidRecibo: fixed_productoPrincipalXidRecibo,
            titularidadServicio: fixed_titularidadServicio
        };

        request = $httpParamSerializer({requestJson: angular.toJson(trama)});
        CapaServicio.obtenerListadoServicio(request).then(function(response) {                                     

            var id_respuesta = response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta;
            if(id_respuesta == 0){

                $scope.lsServicio = response.data.obtenerServiciosResponse.listadoProductosServicios;
                
                if (Array.isArray($scope.lsServicio)) { 
                    var flag_next = true;
                    angular.forEach($scope.lsServicio,function(val,key){
                        if(flag_next){
                           if (val.ProductoServicioResponse.idProductoServicio == $scope.idServicio) {
                                $scope.servicioSelected = $scope.lsServicio[key];
								tramaAuditoria.servicio=$scope.servicioSelected.ProductoServicioResponse.nombre;
								tramaAuditoria.tipoLinea=$scope.servicioSelected.ProductoServicioResponse.tipoLinea;
								tramaAuditoria.perfil=$scope.servicioSelected.ProductoServicioResponse.tipoPermiso;
                                flag_next = false;
                            } else {
                                $scope.servicioSelected = $scope.lsServicio[0]; 
								tramaAuditoria.servicio=$scope.servicioSelected.ProductoServicioResponse.nombre;
								tramaAuditoria.tipoLinea=$scope.servicioSelected.ProductoServicioResponse.tipoLinea;
								tramaAuditoria.perfil=$scope.servicioSelected.ProductoServicioResponse.tipoPermiso;
                            } 
                        }                        
                    });
                }else{
                    $scope.lsServicio = [];
                    $scope.lsServicio.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                    $scope.servicioSelected = $scope.lsServicio[0];
					tramaAuditoria.servicio=$scope.servicioSelected.ProductoServicioResponse.nombre;
					tramaAuditoria.tipoLinea=$scope.servicioSelected.ProductoServicioResponse.tipoLinea;
					tramaAuditoria.perfil=$scope.servicioSelected.ProductoServicioResponse.tipoPermiso;
                    $(".pulldate").addClass("disabled");
                }

                $scope.getObtenerDatosAdicionalesServicioFijoWS();
                $scope.getObtenerDetallePlanTVWS();
                $scope.getObtenerServiciosAdicionalesWS();
                $scope.actualizarProductoPrincipalSesion();

                $("#show_servicios").show();     
                $("#show_servicios_name").show();

            }else{
                $("#show_servicios_error").show();
                $("#show_servicios_name_error").show();
            }

        }, function(error){});

    };

    $scope.abrirModal = function(model){

        var flagBreak = true;
        $.each(WCMPaquetesTV, function( key, value ) {
            if(flagBreak){
                if(value.id == model.codServicioAdicional){
                    $("#modal_titulo").html(value.titulo);
                    $("#modal_descripcion").html(value.descripcion);
                    $("#modal_logo").attr("src", value.logoPaquete);
                    flagBreak = false;
                }else{                    
                    $("#modal_titulo").html("Canales Premium");
                    $("#modal_descripcion").html("Lista de Canales que incluye el paquete Premium");
                    $("#modal_logo").attr("src", "");
                }
            }            
        });

        abrirPopUp();

    };

    $scope.cerrarModal = function(){
        cerrarPopUp();
    };

    $scope.getObtenerDetallePlanTVWS = function() {

        $("#show_detalleplan").hide();
        $("#show_detalleplan_error").hide();
        $(".show_detalleplan_tr").hide();
        
        var trama = {
            "idProductoServicio": $scope.servicioSelected.ProductoServicioResponse.idProductoServicio,
            "idDireccion": $scope.direccionSelected.idDireccion
        };
		
		request = $httpParamSerializer({requestJson:angular.toJson(trama)});
    	CapaServicio.getObtenerDetallePlanTV(request).then(function(response) {
            
    		var id_respuesta = response.data.obtenerDetallePlanTVResponse.defaultServiceResponse.idRespuesta;
			var mensaje = response.data.obtenerDetallePlanTVResponse.defaultServiceResponse.mensaje;
			tramaAuditoria.transactionId = response.data.obtenerDetallePlanTVResponse.defaultServiceResponse.idTransaccional; 
            if(id_respuesta == 0){

                $scope.wps_numeroCanalesSD      = response.data.obtenerDetallePlanTVResponse.numeroCanalesSD;
                $scope.wps_numeroCanalesHD      = response.data.obtenerDetallePlanTVResponse.numeroCanalesHD;
                $scope.wps_numeroCanalesAudio   = response.data.obtenerDetallePlanTVResponse.numeroCanalesAudio;
                
                $scope.wps_listadoDetalle = response.data.obtenerDetallePlanTVResponse.listadoDetalle;
                if (!Array.isArray($scope.wps_listadoDetalle)) { 
                    $scope.wps_listadoDetalle = [];
                    $scope.wps_listadoDetalle.push(response.data.obtenerDetallePlanTVResponse.listadoDetalle);
                }
				tramaAuditoria.estado = "SUCCESS";
				tramaAuditoria.descripcionoperacion = "-";
				$scope.pushAuditoria();
                $("#show_detalleplan").show();
                $(".show_detalleplan_tr").show();

            }else{
				tramaAuditoria.estado = "ERROR";
				tramaAuditoria.descripcionoperacion = "obtenerDetallePlanTVResponse - "+mensaje;
				$scope.pushAuditoria();

                if(id_respuesta == 4){
                
                }else{
                    $("#show_detalleplan_error").show();    
                }
                
            }

        },function(){});

	};

	$scope.getObtenerDatosAdicionalesServicioFijoWS = function() {
	 
        $("#show_datosadicionales").hide();
        $("#show_datosadicionales_error").hide();

        var trama =   {
            "idProductoServicio": $scope.servicioSelected.ProductoServicioResponse.idProductoServicio,
            "categoria": fixed_categoria,
            "idDireccion": $scope.direccionSelected.idDireccion,
            "idLinea": null
        };

		request = $httpParamSerializer({requestJson:angular.toJson(trama)});
    	CapaServicio.getObtenerDatosAdicionalesServicioFijo(request).then(function(response) {

			var id_respuesta = response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.idRespuesta;
			var mensaje = response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.mensaje;
			tramaAuditoria.transactionId = response.data.obtenerDatosAdicionalesServicioFijoResponse.defaultServiceResponse.idTransaccional; 
    		if(id_respuesta == 0){

    			$scope.wps_fechaActivacion  = response.data.obtenerDatosAdicionalesServicioFijoResponse.fechaActivacion;            
                if($scope.wps_fechaActivacion != ""){                    
                    $scope.wps_show_fecha_activacion = true;
                }else{
                    $scope.wps_fechaActivacion  = "";
                    $scope.wps_show_fecha_activacion = false;
                }
                
    			$scope.wps_estado = response.data.obtenerDatosAdicionalesServicioFijoResponse.estado;
    			if($scope.wps_estado != ""){
    				$scope.wps_show_estado = true;
    			}else{
    				$scope.wps_show_estado = false;
    			}
    		
    			
    			$scope.wps_direccionCompleta 	= response.data.obtenerDatosAdicionalesServicioFijoResponse.direccionCompleta;
    			$scope.wps_planActual 				= response.data.obtenerDatosAdicionalesServicioFijoResponse.planActual;
    			$scope.wps_simboloMoneda 			= response.data.obtenerDatosAdicionalesServicioFijoResponse.simboloMoneda;
    			$scope.wps_cargoFijo 				= response.data.obtenerDatosAdicionalesServicioFijoResponse.cargoFijo;

                $("#show_datosadicionales").show();
                $("#wps_loader").remove();

    		}else{
				tramaAuditoria.estado = "ERROR";
				tramaAuditoria.descripcionoperacion = "obtenerDatosAdicionalesServicioFijo - "+mensaje;
				$scope.pushAuditoria();
                $("#show_datosadicionales_error").show();
            }    		

        },function(){});

	};

    $scope.getObtenerServiciosAdicionalesWS = function() {

        $("#show_serviciosadicionales").hide();
        $("#show_serviciosadicionales_error").hide();

        var trama = {
            "categoria": fixed_categoria,
            "idProductoServicio": $scope.servicioSelected.ProductoServicioResponse.idProductoServicio,
            "idCuenta": null,
            "idRecibo": null,
            "idDireccion": $scope.direccionSelected.idDireccion,            
            "idLinea": null
        };
        
		request = $httpParamSerializer({requestJson:angular.toJson(trama)});
    	CapaServicio.getObtenerServiciosAdicionales(request).then(function(response) {	


            var id_respuesta = response.data.obtenerServiciosAdicionalesResponse.defaultServiceResponse.idRespuesta;
			var mensaje = response.data.obtenerServiciosAdicionalesResponse.defaultServiceResponse.mensaje;
            if(id_respuesta == 0){
    			
            	$scope.wps_adicionales = response.data.obtenerServiciosAdicionalesResponse.listado;
            	if (!Array.isArray($scope.wps_adicionales)) { 
            	    $scope.wps_adicionales = [];
            	    $scope.wps_adicionales.push(response.data.obtenerServiciosAdicionalesResponse.listado);
            	}
    			
				tramaAuditoria.estado='SUCCESS';
				tramaAuditoria.descripcionoperacion='-';
				$scope.pushAuditoria();
                $("#show_serviciosadicionales").show();
                
    		}else{
    			
                if(id_respuesta == 4){
                }else{
                    $("#show_serviciosadicionales_error").show();    
                }
				tramaAuditoria.estado='ERROR';
				tramaAuditoria.descripcionoperacion=' obtenerServiciosAdicionales - '+mensaje;
				$scope.pushAuditoria();

    		}

        },function(){});
	
    };

    $scope.getSolicitarServicioAdicional = function(model) {

        var trama =   {
            "categoria": $scope.categoria,
            "idProductoServicio": $scope.idServicio,
            "idCuenta": null,
            "idRecibo": null,
            "idDireccion": null,            
            "idLinea": null,
            "codServicioAdicional": model.codServicioAdicional,
            "codTipoServicioAdicional": model.codTipoServicioAdicional
        };

        request = $httpParamSerializer({requestJson:angular.toJson(trama)});
        CapaServicio.getSolicitarServicioAdicional(request).then(function(response) {           

            var id_respuesta = response.data.solicitarServicioAdicionalResponse.defaultServiceResponse.idRespuesta;
            if(id_respuesta == 0){
                var resultado = response.data.solicitarServicioAdicionalResponse.resultado;
                if(resultado == 'true'){
                    window.location.replace("/wps/myportal/miclaro/corporativo/solicitudes/paquetespremiun");
                }else{
                    
                }
            }else{
                
            }

            
        },function(){});

    };

    $scope.cambioDireccion = function() {

    	animacionBox();
        $scope.obtenerListaServicio();
    
    };

    $scope.cambioServicio = function() {

        animacionBox();
		tramaAuditoria.servicio=$scope.servicioSelected.ProductoServicioResponse.nombre;
		tramaAuditoria.tipoLinea=$scope.servicioSelected.ProductoServicioResponse.tipoLinea;
		tramaAuditoria.perfil=$scope.servicioSelected.ProductoServicioResponse.tipoPermiso;								
        $scope.getObtenerDatosAdicionalesServicioFijoWS();
        $scope.getObtenerDetallePlanFijaWS();
        $scope.getObtenerServiciosAdicionalesWS();
        $scope.actualizarProductoPrincipalSesion();

    };

    $scope.actualizarProductoPrincipalSesion = function() {

        var trama = {
            productoPrincipal: $scope.servicioSelected.ProductoServicioResponse.idProductoServicio,
            nombreProductoPrincipal: $scope.servicioSelected.ProductoServicioResponse.nombre,
            idDireccion: $scope.servicioSelected.ProductoServicioResponse.idDireccion,
            tipoLinea: $scope.servicioSelected.ProductoServicioResponse.tipoLinea,
            categoria: fixed_categoria,
            tipoClienteProductoPrincipal: $scope.servicioSelected.ProductoServicioResponse.tipoCliente,
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

    $scope.dataLayerVerGuiaCanales = function(){

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Consultas',
            'action': 'Botón: TV',
            'label': 'Ver guía de canales'
        });

        window.open("http://catalogo.claro.com.pe/guia-canales/", '_blank');
    
    }

    $scope.dataLayerCambiarPlan = function(){

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Consultas',
            'action': 'Botón: TV',
            'label': 'Cambiar de plan'
        });

        window.location.replace("/wps/myportal/miclaro/corporativo/solicitudes/cambiodeplan/tv");

    }

    $scope.dataLayerIrClaroPlay = function(){

        dataLayer.push({
            'event': 'virtualEvent',
            'category': 'Consultas',
            'action': 'Botón: TV',
            'label': 'Ir a Claro Play'
        });

        window.open("http://www.claroplay.com/pe/", '_blank');
    
    }


    $scope.switchChange = function(){
        window.location.replace("/wps/myportal/miclaro/consumer/consultas/servicioscontratados/tv");
    };
    
});

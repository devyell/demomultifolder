var appController = angular.module('miClaroController', []);

appController.controller("mycontroller", function($scope, $http, $httpParamSerializer,$timeout, $localStorage,$location, managerservice) {
$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
angular.element(document).ready(function () {

$scope.usuarioSession={tipoCliente:"",tipoClienteRequest:"",telefono:"",claroPuntos:0,razonSocial:""};

	$scope.fileNombre='';
	inicio();
	$scope.tipoCliente='';
	$scope.tipoLinea;
	
	$scope.archivo_ups = WPSSolicitudesLinea.upps_formato;
	$scope.captcha_error = WPSSolicitudesLinea.ERROR_CAPTCHA;
	$scope.archivo_error = WPSSolicitudesLinea.archivo_error;
	
	 function inicio(){
	 $scope.upps=WPSMensajeError.upps;
	 $scope.mensaje1=WPSMensajeError.mensaje1;
	 $scope.mensaje2=WPSMensajeError.mensaje2;
	 $scope.servicioAuditoria;
	 $scope.mensaje5=WPSMensajeError.mensaje5;




			cargarDatosUsuario();
    }

	function cargarDatosUsuario(){
         managerservice.obtenerDatosUsuario().then(function (response) {
		
            var idRespuestaConsulta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
			
            if (idRespuestaConsulta == 0) {
                 $scope.tipoCliente=response.data.comunResponseType.tipoCliente;	
				 $scope.servicioAuditoria=response.data.comunResponseType.telefono;	
				 
				if($scope.tipoCliente==WPSTipoCliente.mixto){
					var path = document.location.href;
					if(path.indexOf("/consumer/") != -1){
					$scope.usuarioSession.tipoClienteRequest=WPSTipoCliente.consumer;
					} else {
					$scope.usuarioSession.tipoClienteRequest=WPSTipoCliente.corporativo;
					}
				} else {
					$scope.usuarioSession.tipoClienteRequest=$scope.tipoCliente;
				}
		
				if(verificarUsuarioMixto()){
					seleccionarSwitch();
				}
				if($scope.tipoCliente==WPSTipoCliente.corporativo){  
				 $scope.mensaje3=WPSMensajeError.mensaje4;
				 $scope.tipoLinea='2';
				}else {
				 $scope.mensaje3=WPSMensajeError.mensaje3;
				 $scope.tipoLinea='1';
				}
					cargarCaptcha();
				
            } else {
				$("#solicitud").hide();
				$scope.error_titulo=WPSMensajeError.error_titulo;
				$scope.error_descripcion01=WPSMensajeError.error_descripcion01;
				$scope.error_descripcion02=WPSMensajeError.error_descripcion02;
                $scope.errorServicios = -1;
            }
        }, function (response) {
            
           
                $scope.errorTecnico=true;
          
        });
    }


 $scope.recargarCaptcha = function(){
        cargarCaptcha();
    }
	
	var $popup = $('.popup');
	 var $form; 
    

$('#btsendsolicitud').click(function(e){
		
		$("#correcto").hide();
		$("#error").hide();
		var $this = $(this);
		$form = $this.closest('form');;
		var valid = $form.validate();
		var valid2 =validarCcaptcha();
	
		 if (valid && valid2 ) {
			var datosEnviar = {
				solicitud: $scope.motivo,
				archivoAdjunto: $scope.file,
				nombreDelAdjunto:$scope.fileNombre,
				codigoCaptcha: $scope.captcha
			}
			datosEnviar = $httpParamSerializer({ requestJson: angular.toJson(datosEnviar) });
			managerservice.enviarSolicitud(datosEnviar).then(function(response) {
			
			var idRespuesta ;
			var transactionId;
			var mensaje ;
			if( response.data.comunResponseType!=undefined) {
			 idRespuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
			 transactionId = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
			 mensaje = response.data.comunResponseType.defaultServiceResponse.mensaje;
	
			}else  {
			 idRespuesta = response.data.enviarSolicitudResponse.defaultServiceResponse.idRespuesta;
			 transactionId = response.data.enviarSolicitudResponse.defaultServiceResponse.idTransaccional;
			 mensaje = response.data.enviarSolicitudResponse.defaultServiceResponse.mensaje;
			
			}
			
			
			$("#idCaptcha").removeClass('error'); 
			$('.msg-error').hide();
			$("#msgErrorCaptcha").hide();
			if(idRespuesta==0){
				var $pop = $(".popup .pop");
				var $cnt = $popup.find('.content');
				$pop.css({'margin-top': Math.round( ($h-300)/2) });
				$popup.fadeIn(350);
				$("#correcto").show();
				$form.find("input[type=text], input[type=file], textarea").val("");
				$form.find(".file .txt").text("");
				$form.find(".file label").text("Adjuntar Archivo");
				$('#IdPopup').show();
				$('.msg-error').hide();
				auditoria('T0070',transactionId,'SUCCESS','-') ;
			}else if(idRespuesta==-998){
				$("#msgErrorCaptcha").show();
				
				$("#idCaptcha").addClass('error');
				auditoria('T0070',transactionId,'ERROR','enviarSolicitud -'+mensaje) ;
			}else {
			
			var $pop = $(".popup .pop");
			var $cnt = $popup.find('.content');
			$pop.css({'margin-top': Math.round( ($h-300)/2) });
			$popup.fadeIn(350);
			$("#correcto").hide();
			$("#error").show();
			$('#IdPopup').show();
			$('.msg-error').hide();
			auditoria('T0070',transactionId,'ERROR','enviarSolicitud - '+mensaje) ;
			}
			
		
		}, function(response) {
				
		});
	}else {
	   $('.msg-error').fadeIn(250);
	}		
   });
	

	$('.popup .btclose, .popup .bg').click(function(){
		hidePopUp();
	});
	
	$('#btsolicitudaceptar').click(function(){
		 var href='';
		 
		if($scope.usuarioSession.tipoClienteRequest==WPSTipoCliente.corporativo) {
		
		  href='/wps/myportal/miclaro/corporativo/solicitudes/solicitudesenlinea'; 
		}else {
			 href='/wps/myportal/miclaro/consumer/solicitudes/solicitudesenlinea'; 
		}            
			 $(location).attr('href', href);	 
			hidePopUp();
	
		
	});

	
	
	$('#btsolicitudaceptarError').click(function(){	 
			
			hidePopUp();
	
	
	});
	
	function hidePopUp() {
		$popup.fadeOut(250); 
	}

	function cargarCaptcha(){
		managerservice.obtenerCaptchaSolicitud().then(function (response){
			
			
			try {
				var captcha = response.data.comunResponseType.captcha;
				if (captcha != null) {
					$("#captcha_image").attr('src','data:image/png;base64,'+captcha);
				}
			}
			catch(err) {
				$("#solicitud").hide();
				$scope.error_titulo=WPSMensajeError.error_titulo;
				$scope.error_descripcion01=WPSMensajeError.error_descripcion01;
				$scope.error_descripcion02=WPSMensajeError.error_descripcion02;
				$scope.errorServicios = -1;
			} 

		}, function (error) {
				
		});
	}

	
	
    


    $('.file input').each( function(){
		var $input	 = $(this);
        var $text = $input.parent().find('.txt');
        var $label	 = $input.parent().find('label');
		var labelVal = $label.html();

		$input.on('change', function(e) {
			var fileName = '';
			
			if(ValidateFileUpload() ){
			
			if (this.files && this.files.length > 1) {
				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
            } else if(e.target.value) {
				fileName = e.target.value.split( '\\' ).pop();
            }
			if (fileName) {
				$text.html(fileName + " <a href='#' class='btborrar'>borrar</a>");
                $label.text("Adjuntar otro Archivo");
            }
			var selectedFile = this.files[0];
			$scope.fileNombre = this.files[0].name;
			
			
			selectedFile.convertToBase64(function(base64){
				var arr = base64.split(',');
				$scope.file=arr[1];
			});
              }   
            $('.btborrar').click(function(e){
                e.preventDefault();
                $label.text("Adjuntar Archivo");
                $text.html("");
                $input.val("");
				$scope.fileNombre='';
				$scope.file='';
				
            });
		});
		$input
		.on('focus', function(){ $input.addClass('has-focus'); })
		.on('blur', function(){ $input.removeClass('has-focus'); });
	});
	
	File.prototype.convertToBase64 = function(callback){
            var FR= new FileReader();
            FR.onload = function(e) {
                 callback(e.target.result)
            };       
            FR.readAsDataURL(this);
	};
	
	function auditoria(operationCode,transactionId,estado,descripcionoperacion) {
				var ResquestAuditoria = {
                    operationCode: operationCode,
                    pagina: WPSPageID.miclaro_corporativo_solicitudes_solicitudeslinea,
                    transactionId: transactionId,
                    estado: estado,
                    servicio: $scope.servicioAuditoria,
                    tipoProducto: 'MOVIL',
                    tipoLinea: $scope.tipoLinea,
                    tipoUsuario: $scope.tipoCliente,
                    perfil: '-',
                    monto: '',
                    descripcionoperacion: descripcionoperacion,
                    responseType: '/'
                };
        ResquestAuditoria = $httpParamSerializer({ requestJson: angular.toJson(ResquestAuditoria) });
        managerservice.registrarAuditoria(ResquestAuditoria).then(function(response) {	
        }, function(error) {
        });
    }
	
	 function verificarUsuarioMixto(){
        if($scope.tipoCliente==WPSTipoCliente.mixto){
            $scope.showSelectorMixto=true;
            return true;
        } else {
            return false;
        }
    }
	
	function seleccionarSwitch(){
        if($scope.tipoCliente==WPSTipoCliente.corporativo){
            $("#lblConsumer").attr("for","itype1");
            $("#lblCorporativo").removeAttr("for");
            $scope.switchSelect = true;
           
        } else if($scope.tipoCliente==WPSTipoCliente.consumer){
            $("#lblCorporativo").attr("for","itype1");
            $("#lblConsumer").removeAttr("for");
            $scope.switchSelect = false;
           
        }
		
    }
	
	function ValidateFileUpload() {
		$("#msgErrorFile").hide();  
		$("#msgErrorFileSize").hide();  
		var fuData = document.getElementById('ifile');
		var FileUploadPath = fuData.value;
		var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
		if (Extension == "pdf" ||  Extension == "jpg" ||  Extension == "png" ||  Extension == "gif" ||  Extension == "tif" ||  Extension == "txt" ||  Extension == "xls" || Extension == "xlsx" || Extension == "doc" || Extension == "docx" ) {
			$("#msgErrorFile").hide();  
			var size = fuData.files[0].size;
			
			if(size <= 5249285){ 
				$("#msgErrorFileSize").hide();
				return true;
			}else {
				$("#msgErrorFileSize").show();
				return false;
			}
					
		} else {
		$("#msgErrorFile").show();
			return false;
		}
		
	};
	
	function validarCcaptcha() {
	var captcha = document.getElementById('icaptcha').value;
	
	 if(captcha==''){
		$("#idCaptcha").addClass('error');
		return false;	
		}else {
		
		return true;	
		}
	}
	

    });

	
});

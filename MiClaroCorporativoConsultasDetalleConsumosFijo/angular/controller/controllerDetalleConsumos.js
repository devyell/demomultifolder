var ctrlsaldosyconsumos = angular.module('controllerDetalleConsumosFijo', []);
ctrlsaldosyconsumos.controller('ctrlSaldosyConsumosFijo', ['$scope', '$http', '$filter', 'servSaldosyConsumosFijo', '$httpParamSerializer','FileSaver','Blob',
    function($scope, $http, $filter, servSaldosyConsumosFijo, $httpParamSerializer,FileSaver,Blob) {
        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        $scope.mostrarInfoFijo = true; 
        $scope.mostrarDataServFija = true;
        $scope.mostrarConsumosFija = true;
        $scope.errorDetalleConsumo = false;
        var tipoClienteCorporativo = WPSTipoCliente.corporativo;
        var titularidadServicioThree = WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado;
        var tipoPermisoAll = WPSTipoPermiso.todos;
        var pagina = WPSpaginacion.pagina;
        var cantResultadosPagina = WPSpaginacion.cantResultadosPagina;
        var tipoClienteFiltros = WPSTipoClienteDir.corporativoFijo;
        var categoriaFijo = WPSCategoria.fijo;
        var tipoLineaTodos = WPSTipoLinea.todos;
        var valorFlagConfirmacion = null;
        var $wslide = $(window).width() - 20;
        var $slide = 1;
        var $timer = 0;
        var objExito = {};
        var pageIdMiclaroCorporativoSaldosyconsumosFijo = WPSPageID.miclaro_corporativo_consultas_saldosyconsumos_fijo;
        var operationCodeCorporativoSaldosyConsumosFijo = WPSTablaOperaciones.consultaSaldosConsumos;
        var estadoExito = 'SUCCESS';
        var estadoError = 'ERROR';
        var tipoProductoFijo = 'FIJO';
        var tipoConsultaDescripcion = 'consultaSaldosConsumos';
		$scope.mostrarConsumosFijaSaliente=false;
		$scope.listaAutocomplete=[];
		$scope.tipoLlamadas='1';
		$scope.hidePagina=false;
		$scope.hideCorreo=false;
		$scope.totalPagina=0;
		$scope.errorTotal = false;
		$scope.mensaje_error_titulo = WPSMensajeError.error_titulo;
		$scope.mensaje_error_descripcion01 = WPSMensajeError.error_descripcion01;
		$scope.mensaje_error_descripcion02 = WPSMensajeError.error_descripcion02;
		$scope.servicioAuditoria;
		$scope.tipoLineaAuditoria;
		$scope.perfilAuditoria;
		$scope.productoPrincipal;
		$scope.hideCorreoLimite=false;
		var paginaS=1;
		 
        angular.element(document).ready(function() {
			asignarEventoRadios();
            init();
            iniciarAutocomplete();
        });

        function init() {
            servSaldosyConsumosFijo.obtenerFlagProductoFijoSesion().then(function(response) {
                var rpta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
                if (rpta == 0) {
                    var flagFijo = response.data.comunResponseType.flagProductoFijoSesion;
                    if (flagFijo != 0) {
                        main();
                    } else {
                        $scope.mostrarInfoFijo = false;
                    }
                } else {
					$scope.errorTotal = true;
                }

            }, function(error) {

            });

        };

        function main() {
            obtenerServicioPrincipal();
            obtenerDatosUsuarioSession();
				$("#fijo").show();
        };

        function obtenerDatosUsuarioSession() {
            
            servSaldosyConsumosFijo.obtenerDatosUsuarioSesion().then(function(response) {
                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                if (rpta == 0) {
                    $scope.tipoClienteSession = response.data.comunResponseType.tipoCliente;
                    $scope.tipoLineaSession = response.data.comunResponseType.tipoLinea;
					$scope.numeroTelFijo = response.data.comunResponseType.telefono;
					$scope.emailUsuario=response.data.comunResponseType.usuarioVinculado;
					$scope.categoria=response.data.comunResponseType.categoria;
					$scope.productoPrincipal=response.data.comunResponseType.idLinea;
                } else {
                    $scope.mostrarDataServFija = false;
                    $scope.mostrarConsumosFija = false;
                }
            }, function(error) {

            });
        };

        function obtenerServicioPrincipal() {
            servSaldosyConsumosFijo.obtenerServicioPrincipal().then(function(response) {
                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                if (rpta == 0) {
                    var categoriaPrincipal = response.data.comunResponseType.categoria;
                    var tipoClientePrincipal = response.data.comunResponseType.tipoClienteProductoPrincipal;
                    if (categoriaPrincipal == "2" && tipoClientePrincipal == "2") {
                        var idDireccionPrincipal = response.data.comunResponseType.idDireccion;
                        var idServicioPrincipal = response.data.comunResponseType.productoPrincipal;
                        obtenerListadoFijoDireccion(idDireccionPrincipal, idServicioPrincipal, "1")
                    } else {
                        obtenerListadoFijoDireccion(null, null, "2")
                    }
                    
                } else {
                    $scope.mostrarDataServFija = true; 
                    $scope.mostrarConsumosFija = false;
                    
                }
            }, function(error) {

            });
        };

        function obtenerListadoFijoDireccion(idDireccionPrincipal, idServicioPrincipal, indicador) { 
            var id_direccion = '';
            var datarDirecciones = dataDireccionEnviar();
            servSaldosyConsumosFijo.obtenerListadoFijoDireccion(datarDirecciones).then(function(response) {
                var rpta = parseInt(response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerListadoFijoDireccionResponse.defaultServiceResponse.idTransaccional;
                if (rpta == 0) {
                    $scope.listadoDirecciones = response.data.obtenerListadoFijoDireccionResponse.listadoDireccion;
					$scope.classBuscar = '';
					$scope.desabledCombos = '';
					
                    if (Array.isArray($scope.listadoDirecciones)) {
                        if (indicador == "1") {
                            angular.forEach($scope.listadoDirecciones, function(val, key) {
                                if (val.idDireccion == idDireccionPrincipal) {
                                    $scope.selectIdDireccion = $scope.listadoDirecciones[key];
                                }
                            });
                        } else {
                                $scope.selectIdDireccion = $scope.listadoDirecciones[0];
                                id_direccion = $scope.listadoDirecciones[0].idDireccion;
                          
                        }
                    } else {
                        $scope.listadoDirecciones = [];
                        $scope.listadoDirecciones.push(response.data.obtenerListadoFijoDireccionResponse.listadoDireccion);
                        if (indicador == "1") {
                            angular.forEach($scope.listadoDirecciones, function(val, key) {
                                if (val.idDireccion == idDireccionPrincipal) {
                                    $scope.selectIdDireccion = $scope.listadoDirecciones[key];
                                }
                            });
                        } else {
                                $scope.selectIdDireccion = $scope.listadoDirecciones[0];
                                id_direccion = $scope.listadoDirecciones[0].idDireccion;
                        }
                    }
                    if (indicador == "1") {
                        obtenerServiciosFijos(idDireccionPrincipal, idServicioPrincipal, indicador); 
        
                    } else {
                        obtenerServiciosFijos(id_direccion, null, indicador);
        
                    }
                } else {
					$("#mostrarConsumosFija2").hide();
                    $scope.mostrarDataServFija = false;
                    $scope.mostrarConsumosFija = false;
                    
                }
            }, function(error) {

            });
        };

        function obtenerServiciosFijos(idDireccionFija, idServicioPrincipal, indicador) {
            var idProducto_Principal = '';
            var dataServiciosFijo = dataParaEnviar(idDireccionFija, null);
            servSaldosyConsumosFijo.obtenerServiciosFijos(dataServiciosFijo).then(function(response) {
                var rpta = parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerServiciosResponse.defaultServiceResponse.idTransaccional;
				 var listadoLineasPostpago = '';
                if (rpta == 0) {
					listadoLineasPostpago = response.data.obtenerServiciosResponse.listadoProductosServicios;
                    if (angular.isArray(listadoLineasPostpago)) {
						$scope.listadoServicios = response.data.obtenerServiciosResponse.listadoProductosServicios;
                        if (indicador == "1") {
							var estado =false;
                            angular.forEach($scope.listadoServicios, function(val, key) {
                                if (val.ProductoServicioResponse.idProductoServicio === idServicioPrincipal) {
                                    $scope.selectLinea = $scope.listadoServicios[key];
                                    idProducto_Principal = $scope.listadoServicios[key].ProductoServicioResponse.idProductoServicio;
									
									$scope.tipoLineaAuditoria=$scope.selectLinea.ProductoServicioResponse.tipoLinea;
									$scope.perfilAuditoria=$scope.selectLinea.ProductoServicioResponse.tipoPermiso;
									 estado =true;
                                }
                            });
                        } else {
							$scope.selectLinea = $scope.listadoServicios[0];
							idProducto_Principal = $scope.selectLinea.ProductoServicioResponse.idProductoServicio;
						
							$scope.tipoLineaAuditoria=$scope.selectLinea.ProductoServicioResponse.tipoLinea;
							$scope.perfilAuditoria=$scope.selectLinea.ProductoServicioResponse.tipoPermiso;
							
						}
                    } else {
					    $scope.listadoServicios = [];
                        $scope.listadoServicios.push(listadoLineasPostpago);
                        if (indicador == "1") {
                            angular.forEach($scope.listadoServicios, function(val, key) {
                                if (val.ProductoServicioResponse.idProductoServicio == idServicioPrincipal) {
                                    $scope.selectLinea = $scope.listadoServicios[key];
                                    idProducto_Principal = $scope.listadoServicios[key].ProductoServicioResponse.idProductoServicio;
									
									$scope.tipoLineaAuditoria=$scope.selectLinea.ProductoServicioResponse.tipoLinea;
									$scope.perfilAuditoria=$scope.selectLinea.ProductoServicioResponse.tipoPermiso;
                                }
                            });
                        } else {
                                $scope.selectLinea = $scope.listadoServicios[0];
                                idProducto_Principal = $scope.listadoServicios[0].ProductoServicioResponse.idProductoServicio;
								
								$scope.tipoLineaAuditoria=$scope.selectLinea.ProductoServicioResponse.tipoLinea;
								$scope.perfilAuditoria=$scope.selectLinea.ProductoServicioResponse.tipoPermiso;
                        }
                    }
                    obtenerLinesFijas(idDireccionFija, idProducto_Principal); 
                } else {
					$("#mostrarConsumosFija2").hide();
                    $scope.mostrarDataServFija = false;
                    $scope.mostrarConsumosFija = false;
					
                    
                }
            }, function(error) {

            });
        };

        function obtenerLinesFijas(idDireccionFija, idProducto_Principal) {
            var dataLineasFijas = enviarDataLineasFijas(idDireccionFija, idProducto_Principal);
            servSaldosyConsumosFijo.obtenerLinesFijas(dataLineasFijas).then(function(response) {
                var rpta = parseInt(response.data.obtenerLineasFijasResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerLineasFijasResponse.defaultServiceResponse.idTransaccional;
				var breakEach = true;
                if (rpta == 0) {
                    $scope.listadoLineasFijas = response.data.obtenerLineasFijasResponse.listadoProductosServicios;
                    if (angular.isArray($scope.listadoLineasFijas)) {
                        angular.forEach($scope.listadoLineasFijas, function(val, key) {
							if (breakEach) {
								if (val.idLinea == $scope.productoPrincipal) {
									$scope.lineaFijaSelect = $scope.listadoLineasFijas[key];
									breakEach = false;
									$scope.servicioAuditoria=$scope.lineaFijaSelect.nombreProducto;
								}
							}	
                        });
						
						if(breakEach){
							$scope.lineaFijaSelect = $scope.listadoLineasFijas[0];
							$scope.servicioAuditoria= $scope.lineaFijaSelect.nombreProducto;
						}
                    } else {
                        $scope.listadoLineasFijas = [];
                        $scope.listadoLineasFijas.push(response.data.obtenerLineasFijasResponse.listadoProductosServicios);
						$scope.lineaFijaSelect = $scope.listadoLineasFijas[0]; 
						$scope.servicioAuditoria= $scope.lineaFijaSelect.nombreProducto;						
                    }
					var flag =$scope.lineaFijaSelect.flagPlataforma;
					if(flag=='true') {
						$scope.flagPlataforma=0;
					}else {
						$scope.flagPlataforma=1;
						$('#idLlamadaE').removeClass('checked');
						$('#idLlamadaS').addClass('checked');
						$scope.tipoLlamadas='2';
					}
                    obtenerPeriodosFacturacion(idDireccionFija, idProducto_Principal, $scope.lineaFijaSelect.idLinea);
                } else {
                    $scope.mostrarDataServFija = true;
                    $scope.mostrarConsumosFija = false;
                    
                }
            }, function(error) {

            });
        };

        function obtenerPeriodosFacturacion(idDireccionFija, idProducto_Principal, idLinea) { 
            var idPeriodoFijo = '';
            var dataPeriodo = dataPeriodoEnviar(idDireccionFija, idProducto_Principal, idLinea);
            servSaldosyConsumosFijo.obtenerPeriodosFacturacion(dataPeriodo).then(function(response) {
                var rpta = parseInt(response.data.obtenerPeriodosFacturacionResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerPeriodosFacturacionResponse.defaultServiceResponse.idTransaccional;
                if (rpta == 0) {
                    $scope.listadoPeriodos = response.data.obtenerPeriodosFacturacionResponse.listado;
                    if (Array.isArray($scope.listadoPeriodos)) {
                        angular.forEach($scope.listadoPeriodos, function(val, key) {
                            $scope.selectPeriodo = $scope.listadoPeriodos[0];
                            idPeriodoFijo = $scope.listadoPeriodos[0].idPeriodo;
                        });
                    } else {
                        $scope.listadoPeriodos = [];
                        $scope.listadoPeriodos.push($scope.listadoPeriodos);
                            $scope.selectPeriodo = $scope.listadoPeriodos[0];
                            idPeriodoFijo = $scope.listadoPeriodos[0].idPeriodo;
                    }
					 obtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea,idPeriodoFijo,$scope.tipoLlamadas,'false','',1,10);
                    
                } else {
                    $scope.mostrarDataServFija = false;
                    $scope.mostrarConsumosFija = false;
                    
                }
            }, function(error) {

            });
        };

		 function obtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea,idPeriodoFijo,tipoLlamadas,flag,email,pagina,can) { 
		 actualizarProductoPrincipalSesion(idProducto_Principal,idDireccionFija,idLinea,$scope.lineaFijaSelect.nombreProducto);
            var dataLlamadasFijo = dataObtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea,idPeriodoFijo,tipoLlamadas,flag,email,pagina,can);
            servSaldosyConsumosFijo.obtenerLlamadasFijo(dataLlamadasFijo).then(function(response) {
                var rpta = parseInt(response.data.obtenerLlamadasFijoResponse.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.obtenerLlamadasFijoResponse.defaultServiceResponse.idTransaccional;
				var mensaje = response.data.obtenerLlamadasFijoResponse.defaultServiceResponse.mensaje;
                if (rpta == 0) {
				 $("#mostrarConsumosFija2").hide();
				 
				 $scope.mostrarConsumosFijaData=true;
					if(tipoLlamadas==1) {
							$scope.mostrarConsumosFija = true;
							$scope.mostrarConsumosFijaSaliente=false;
							$("#mostrarConsumosFija").show();
							auditoria(WPSTablaOperaciones.consultaDetalleConsumosLlamadasEntrante,idTransaccion,'SUCCESS','-');
						}else {
							$scope.mostrarConsumosFija = false;
							$scope.mostrarConsumosFijaSaliente=true;
							$('#mostrarConsumosFijaSaliente').show();
							auditoria(WPSTablaOperaciones.consultaDetalleConsumosLlamadasSaliente,idTransaccion,'SUCCESS','-');	
					}
					if(pagina=='1'){
						$scope.listarLlamadasFijo = response.data.obtenerLlamadasFijoResponse.listaLlamadas;
						$scope.totalPagina= response.data.obtenerLlamadasFijoResponse.totalPaginas;
						paginaS=1;
						$scope.hideCorreoLimite=false;
							if (!Array.isArray(response.data.obtenerLlamadasFijoResponse.listaLlamadas)) {
								$scope.listarLlamadasFijo=[];
								$scope.listarLlamadasFijo.push(response.data.obtenerLlamadasFijoResponse.listaLlamadas);
							}
							if($scope.totalPagina==1){
								$scope.hidePagina=false;
								$scope.hideCorreo=false;
							}else {
								$scope.hidePagina=true;
								$scope.hideCorreo=false;
							}
					}else {
							var  roleList = response.data.obtenerLlamadasFijoResponse.listaLlamadas;
							if (!Array.isArray(roleList)) {
							  roleList=[];
							  roleList.push(response.data.obtenerLlamadasFijoResponse.listaLlamadas);
							} 
							listarLlamadasFijaAll(roleList);	
					}
					
					
                } else if (rpta == 8) {
					$("#mostrarConsumosFija2").hide()
					$scope.mostrarConsumosFijaData=false;
					$scope.mensajeConsumoFijo=WPSConsultarDetalleConsumosFijoCorporativo.EXCEPCION3;
					$scope.mostrarDataServFija = true; 
                    $scope.mostrarConsumosFija = false; 
					$scope.mostrarConsumosFijaSaliente=false;
					$('#mostrarConsumosFija').hide();
					if(tipoLlamadas==1) {							
						auditoria(WPSTablaOperaciones.consultaDetalleConsumosLlamadasEntrante,idTransaccion,'ERROR','obtenerLlamadasFijo -'+mensaje);
					}else {	
						auditoria(WPSTablaOperaciones.consultaDetalleConsumosLlamadasSaliente,idTransaccion,'ERROR','obtenerLlamadasFijo -'+mensaje);
					}
				}else {
					
					$("#mostrarConsumosFija2").show();
                    $scope.mostrarDataServFija = true;
                    $('#mostrarConsumosFija').hide();
					$scope.mostrarConsumosFija = false;
					$scope.mostrarConsumosFijaSaliente=false;
					if(tipoLlamadas==1) {							
						auditoria(WPSTablaOperaciones.consultaDetalleConsumosLlamadasEntrante,idTransaccion,'ERROR','obtenerLlamadasFijo - '+mensaje);
					}else {	
						auditoria(WPSTablaOperaciones.consultaDetalleConsumosLlamadasSaliente,idTransaccion,'ERROR','obtenerLlamadasFijo -'+mensaje);
					}
                }
            }, function(error) {

            });
        };
		
	function EnviarCorreoObtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea,idPeriodoFijo,tipoLlamadas,flag,email,pagina,can) { 
		var dataLlamadasFijo = dataObtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea,idPeriodoFijo,tipoLlamadas,flag,email,pagina,can);
		servSaldosyConsumosFijo.obtenerLlamadasFijo(dataLlamadasFijo).then(function(response) {
			var rpta = parseInt(response.data.obtenerLlamadasFijoResponse.defaultServiceResponse.idRespuesta);
			var idTransaccion = response.data.obtenerLlamadasFijoResponse.defaultServiceResponse.idTransaccional;
			var mensaje = response.data.obtenerLlamadasFijoResponse.defaultServiceResponse.mensaje;
			if (rpta == 0) {
				if(tipoLlamadas==1){
				auditoria(WPSTablaOperaciones.envioCorreoDetalleConsumosLlamadasEntrante,idTransaccion,'SUCCESS','-');
				}else {
				auditoria(WPSTablaOperaciones.envioCorreoDetalleConsumosLlamadasSaliente,idTransaccion,'SUCCESS','-');
				}
			}else {
				if(tipoLlamadas==1){
				auditoria(WPSTablaOperaciones.envioCorreoDetalleConsumosLlamadasEntrante,idTransaccion,'ERROR','obtenerLlamadasFijo -'+mensaje);
				}else {
				auditoria(WPSTablaOperaciones.envioCorreoDetalleConsumosLlamadasSaliente,idTransaccion,'ERROR','obtenerLlamadasFijo - '+mensaje);
				}
			}
		}, function(error) {

		});
	};
	
		
	
	$scope.paginacion=function() {
		paginaS = paginaS+1;
		if(paginaS<=3){
				if(paginaS==3) {

					$scope.hideCorreo=true;
					$scope.hidePagina=false;
				}
				var idDireccionFija=$scope.selectIdDireccion.idDireccion;
				var idProducto_Principal=$scope.selectLinea.ProductoServicioResponse.idProductoServicio;
				var idLinea=$scope.selectLinea.ProductoServicioResponse.idLinea;
				var idPeriodoFijo=$scope.selectPeriodo.idPeriodo;
				obtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea,idPeriodoFijo,$scope.tipoLlamadas,'false','',paginaS,10) ;
			}else {

				$scope.hidePagina=false;
		}	
	}
		
	function listarLlamadasFijaAll(listaDetalle){
		for (var i = 0; i <listaDetalle.length; i++) {
			$scope.listarLlamadasFijo.push(listaDetalle[i]);
		}
		if(paginaS==3) {
			$scope.hideCorreoLimite=true;
			$scope.hidePagina=false;	
		}
		
	}
		
	function actualizarProductoPrincipalSesion(idProductoServicio,idDireccion,idLinea,numeroTelFijo) {
		var actualizarServicioSesion = {
			productoPrincipal: idProductoServicio,
			nombreProductoPrincipal: null,
			idCuenta: null,
			idRecibo: null,
			idDireccion: idDireccion,
			idLinea: idLinea,
			tipoLinea: $scope.tipoLineaSession,
			numeroTelFijo: numeroTelFijo,
			categoria: $scope.categoria,
			tipoClienteProductoPrincipal: $scope.tipoClienteSession
		}
		data = $httpParamSerializer({ requestJson: angular.toJson(actualizarServicioSesion) });
		servSaldosyConsumosFijo.actualizarProductoPrincipalSesion(data).then(function(response) {
			
		});

	};

	$scope.cambiarClassForm = function() { 
		
		if ($scope.classBuscar == 'search-column') {
			$scope.classBuscar = '';
			$scope.desabledCombos = '';
			$('#autocomplete-filtro-fijo').val('');
			setTimeout(function () { $('#autocomplete-filtro-fijo').focus();}, 0);
			$('#autocomplete-filtro-fijo').select();
			setTimeout(function () { $('#autocomplete-filtro-fijo').select(); }, 0);
			$('.input search').focus();
			$scope.searchText='';
		} else {
			$scope.classBuscar = 'search-column';
			$scope.desabledCombos = 'disabled';
		}
	};

	function dataDireccionEnviar() {
		var requestDireccion = {
			"tipoCliente": null
		};
		requestDireccion.tipoCliente = tipoClienteFiltros;
		dataDireccion = $httpParamSerializer({ requestJson: angular.toJson(requestDireccion) });
		return dataDireccion;
	};

	function dataParaEnviar(id_direccionRequest, idServicioPrincipal) {
		var requestServiciosFijo = {
			"categoria": null,
			"tipoLinea": null,
			"tipoCliente": null,
			"idProductoServicio": null,
			"tipoPermiso": null,
			"idCuenta": null,
			"idRecibo": null,
			"idDireccion": null,
			"nombreProducto": null,
			"pagina": '0',
			"cantResultadosPagina": '0',
			"productoPrincipalXidRecibo": null,
			"titularidadServicio": null
		}
		requestServiciosFijo.idProductoServicio = idServicioPrincipal;
		requestServiciosFijo.categoria = categoriaFijo;
		requestServiciosFijo.tipoLinea = tipoLineaTodos;
		requestServiciosFijo.tipoCliente = tipoClienteCorporativo;
		requestServiciosFijo.tipoPermiso = tipoPermisoAll;
		requestServiciosFijo.idDireccion = id_direccionRequest;
		requestServiciosFijo.titularidadServicio = titularidadServicioThree;
		dataServiciosFijo = $httpParamSerializer({ requestJson: angular.toJson(requestServiciosFijo) });
		return dataServiciosFijo;
	};

        
	function enviarDataLineasFijas(idDireccionFija, idProducto_Principal) {
		var requestLineasFijas = {
			"tipoCliente": null,
			"idDireccion": null,
			"idProductoServicio": null,
			"nombreProducto": null,
			"pagina": '0',
			"cantResultadosPagina": '0'
		}
		requestLineasFijas.tipoCliente = tipoClienteCorporativo;
		requestLineasFijas.idProductoServicio = idProducto_Principal;
		requestLineasFijas.idDireccion = idDireccionFija;
		responseLineasFijas = $httpParamSerializer({ requestJson: angular.toJson(requestLineasFijas) });
		return responseLineasFijas;
	};
	
	$scope.buscarLineaFija=function() {
		var valorinput=$('#autocomplete-filtro-fijo').val();
		if(valorinput.length>0){
				$("#autocomplete-filtro-fijo .search").removeClass("error");
				var dataLlamadasFijo = dataAutocompleteBuscar(valorinput);
				servSaldosyConsumosFijo.obtenerListadoLineasFijas(dataLlamadasFijo).then(function(response) {
				var rptaExito = response.data.obtenerListadoLineasFijasResponse.defaultServiceResponse.idRespuesta;
					if (rptaExito == 0) {
						$scope.listaAutocomplete = response.data.obtenerListadoLineasFijasResponse.listadoProductosServicios;
						var idDirecion=$scope.listaAutocomplete.idDireccion;
						var idProducto=$scope.listaAutocomplete.idProductoServicio;
						var idLinea=$scope.listaAutocomplete.idLinea;
						obtenerListadoFijoDireccion(idDirecion, idProducto, '1') ; 
						obtenerPeriodosFacturacion(idDirecion, idProducto, idLinea);
					}
			}, function(error) {

			});
		}else {
			$("#autocomplete-filtro-fijo").addClass("error");
		}
	};


	function dataPeriodoEnviar(idDireccionFija, idProducto_Principal, idLinea) {
		var requestPeriodoFact = {
			"categoria": null,
			"idProductoServicio": null,
			"idCuenta": null,
			"idRecibo": null,
			"idDireccion": null,
			"idLinea": null,
			"cantPeriodos": null
		}
		requestPeriodoFact.categoria = categoriaFijo;
		requestPeriodoFact.idDireccion = idDireccionFija;
		requestPeriodoFact.idProductoServicio = idProducto_Principal;
		requestPeriodoFact.cantPeriodos = 3;
		requestPeriodoFact.idLinea = idLinea;
		dataPeridoFact = $httpParamSerializer({ requestJson: angular.toJson(requestPeriodoFact) });
		return dataPeridoFact;
	};
		
	function dataObtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea,idPeriodo,tipoLlamadas,flag,mail,pagina,can) {
		var requestObtenerLlamadasFijo = {
			"idProductoServicio": null,
			"idDireccion": null,
			"idLinea": null,
			"idPeriodo":null,
			"tipoLlamadas":null,
			"flagCorreo":null,
			"mail": null, 
			"pagina": null,
			"cantResultadosPagina": null,
	  
		}
		requestObtenerLlamadasFijo.idProductoServicio = idProducto_Principal;
		requestObtenerLlamadasFijo.idDireccion = idDireccionFija;
		requestObtenerLlamadasFijo.idLinea = idLinea;
		requestObtenerLlamadasFijo.idPeriodo = idPeriodo; 
		requestObtenerLlamadasFijo.tipoLlamadas = tipoLlamadas; 
		requestObtenerLlamadasFijo.flagCorreo = flag;
		requestObtenerLlamadasFijo.mail = mail; 			
		requestObtenerLlamadasFijo.pagina = pagina;
		requestObtenerLlamadasFijo.cantResultadosPagina = can;
		requestObtenerLlamadasFijo = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerLlamadasFijo) });
		return requestObtenerLlamadasFijo;
	};

	function dataConsumoFijaEnviar(id_direccion, idProducto_Principal, idPeriodoFijo, idLineaSelect) {
		var requestConsumoFijo = {
			"idPeriodo": null,
			"idProductoServicio": null,
			"idDireccion": null,
			"idLinea": null,
			"criterio": null
		}
		requestConsumoFijo.criterio = 0;
		requestConsumoFijo.idProductoServicio = idProducto_Principal;
		requestConsumoFijo.idDireccion = id_direccion;
		requestConsumoFijo.idPeriodo = idPeriodoFijo;
		requestConsumoFijo.idLinea = idLineaSelect;
		dataConsumoFijo = $httpParamSerializer({ requestJson: angular.toJson(requestConsumoFijo) });
		return dataConsumoFijo;
	};

	function dataAutocomplete(valorinput) {
		var requestAutocompleteFijo = {
			"tipoCliente": null,
			"idDireccion": null,
			"idProductoServicio": null,
			"criterioBusqueda": null,
			"pagina": null,
			"cantResultadosPagina": null
		}
		requestAutocompleteFijo.tipoCliente = tipoClienteCorporativo;
		requestAutocompleteFijo.criterioBusqueda = valorinput;
		requestAutocompleteFijo.pagina = pagina;
		requestAutocompleteFijo.cantResultadosPagina = cantResultadosPagina;
		dataAutocompleteFijo = $httpParamSerializer({ requestJson: angular.toJson(requestAutocompleteFijo) });
		return dataAutocompleteFijo;
	};
		
	 function dataAutocompleteBuscar(valorinput) {
		var requestAutocompleteFijo = {
			"tipoCliente": null,
			"idDireccion": null,
			"idProductoServicio": null,
			"criterioBusqueda": null,
			"pagina": '1',
			"cantResultadosPagina": '1'
		}
		requestAutocompleteFijo.tipoCliente = tipoClienteCorporativo;
		requestAutocompleteFijo.criterioBusqueda = valorinput;
		dataAutocompleteFijo = $httpParamSerializer({ requestJson: angular.toJson(requestAutocompleteFijo) });
		return dataAutocompleteFijo;
	};

	this.obtenerConsumosFijosxDireccion = function() {
		objExito.flagDireccion = null;
		objExito.flagServiciosFijo = null;
		objExito.flagLineaFija = null;
		objExito.flagPeriodo = null;
		objExito.flagConsumos = null;
		obtenerConsumosFijosxDireccion();
	};

	function obtenerConsumosFijosxDireccion() {
		obtenerServiciosFijos($scope.selectIdDireccion.idDireccion,'', "3");
	};

	this.obtenerConsumosFijosxServicio = function() {
		objExito.flagLineaFija = null;
		objExito.flagPeriodo = null;
		objExito.flagConsumos = null;
		obtenerConsumosFijosxServicio();
	};
		
		var $popup = $('.popup');
		this.Correo=function () {
		var $pop = $(".popup .pop");
		var $cnt = $popup.find('.content');
		$pop.css({'margin-top': Math.round( ($h-300)/2) });
		$popup.fadeIn(350);
		$('#IdPopup').show();
		
		};
		
		this.Reporte=function() { 
		
		var requestObtenerLlamadasFijo = {
				"idProductoServicio": $scope.selectLinea.ProductoServicioResponse.idProductoServicio,
				"idDireccion": $scope.selectIdDireccion.idDireccion,
				"idLinea": $scope.selectLinea.ProductoServicioResponse.idLinea,
				"idPeriodo":$scope.selectPeriodo.idPeriodo,
				"tipoLlamadas":$scope.tipoLlamadas,
				"flagCorreo":'false',
                "mail": null, 
                "pagina": '0',
                "cantResultadosPagina": '0',
				"numeroReporte":$scope.lineaFijaSelect.nombreProducto
          
            }
		
            requestObtenerLlamadasFijo = $httpParamSerializer({ requestJson: angular.toJson(requestObtenerLlamadasFijo),tipoReporte:$scope.tipoLlamadas});	
			servSaldosyConsumosFijo.obtenerReporteLlamadas(requestObtenerLlamadasFijo).then(function(response) {
                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
				var mensaje = response.data.comunResponseType.defaultServiceResponse.mensaje;
                if (rpta == 0) {
					if($scope.tipoLlamadas==1){
						auditoria(WPSTablaOperaciones.descargaArchivoDetalleConsumosLlamadasEntrante,idTransaccion,'SUCCESS','-');
					}else {
						auditoria(WPSTablaOperaciones.descargaArchivoDetalleConsumosLlamadasSaliente,idTransaccion,'SUCCESS','-');
					}
					var archivoBase64 = response.data.comunResponseType.archivo;
					var wps_apple = false;
					var userAgent = navigator.userAgent || navigator.vendor || window.opera;
					if (/iPad|Mac|iPhone|iPod/.test(userAgent) && !window.MSStream) {
						wps_apple = true;
					}else{
						wps_apple = false;
					}
					if(wps_apple){
						var urlbase64 = "data:application/vnd.ms-excel;base64,"+archivoBase64;
						window.open(urlbase64, '_blank');                    
					}else{    
						var reciboBlob = b64toBlob(archivoBase64,'application/excel');
						FileSaver.saveAs(reciboBlob, 'DetalleConsumo.xls');
					}
                }else {
					if($scope.tipoLlamadas==1){
						auditoria(WPSTablaOperaciones.descargaArchivoDetalleConsumosLlamadasEntrante,idTransaccion,'ERROR','obtenerReporteLlamadas -'+mensaje);
					}else {
						auditoria(WPSTablaOperaciones.descargaArchivoDetalleConsumosLlamadasSaliente,idTransaccion,'ERROR','obtenerReporteLlamadas -'+mensaje);
					}
				} 
            }, function(error) {

            });
				
		};
		
		function b64toBlob(b64Data, contentType, sliceSize) {
		  contentType = contentType || '';
		  sliceSize = sliceSize || 512;
		  var byteCharacters = atob(b64Data);
		  var byteArrays = [];
		  for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
			var slice = byteCharacters.slice(offset, offset + sliceSize);
			var byteNumbers = new Array(slice.length);
			for (var i = 0; i < slice.length; i++) {
			  byteNumbers[i] = slice.charCodeAt(i);
			}
			var byteArray = new Uint8Array(byteNumbers);
			byteArrays.push(byteArray);
		  }
		  var blob = new Blob(byteArrays, {type: contentType});
		  return blob;
		}
		
		this.OtroCorreo=function() {
			$('#idEmail').focus();
			$('#idCorreo').hide();
			$('#idCorreo2').show();
		};
		
		this.Enviar=function(tipo) {
		
			var idDireccionFija=$scope.selectIdDireccion.idDireccion;
			var idProducto_Principal=$scope.selectLinea.ProductoServicioResponse.idProductoServicio;
			var idLinea=$scope.selectLinea.ProductoServicioResponse.idLinea;
			var idPeriodoFijo=$scope.selectPeriodo.idPeriodo;
			if(tipo=='E') {
				EnviarCorreoObtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea,idPeriodoFijo,$scope.tipoLlamadas,'true',$scope.emailUsuario,0,0) ;
				$('#IdPopup').hide();
			}else {
				$form = $('#idformpop');
				var valid = $form.validate();
				if (valid) {
					$form.find('.msg-error').hide();
					setTimeout(function() { hidePopUp(); }, 1500);
					$('#IdPopup').hide();
					EnviarCorreoObtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea,idPeriodoFijo,$scope.tipoLlamadas,'true',$scope.email,0,0) ;
				} else {
					$form.find('.msg-error').html("Por favor, ingresa un correo electrónico válido.").show();
					$('#IdPopup').show();
				}
			}
			
		};
		
		this.Cancelar=function() {
		$('#idCorreo2').hide();
		$('#idCorreo').show();		
		};
		
		
		$('.popup .btclose, .popup .bg').click(function(){
			hidePopUp();
		});


		function hidePopUp() {
			$popup.fadeOut(250); 
		}

        function obtenerConsumosFijosxServicio() {
            var id_DireccionSeleccionada = $scope.selectIdDireccion.idDireccion;
            var id_ServicioSeleccionado = $scope.selectLinea.ProductoServicioResponse.idProductoServicio;
			$scope.tipoLineaAuditoria=$scope.selectLinea.ProductoServicioResponse.tipoLinea;
			$scope.perfilAuditoria=$scope.selectLinea.ProductoServicioResponse.tipoPermiso;
            obtenerLinesFijas(id_DireccionSeleccionada, id_ServicioSeleccionado);
        };

        this.obtenerConsumosxLineaFija = function() {
            objExito.flagPeriodo = null;
            objExito.flagConsumos = null;
            obtenerConsumosxLineaFija();
        };

        function obtenerConsumosxLineaFija() {
            var id_lineaSeleccionada = $scope.lineaFijaSelect.idLinea;
            var id_DireccionSeleccionada = $scope.selectIdDireccion.idDireccion;
            var id_ServicioSeleccionado = $scope.selectLinea.ProductoServicioResponse.idProductoServicio;
            
            obtenerPeriodosFacturacion(id_DireccionSeleccionada, id_ServicioSeleccionado, id_lineaSeleccionada);
        };

        this.obtenerConsumosFijosxPeriodo = function() {
            objExito.flagConsumos = null;
            obtenerConsumosFijosxPeriodo();
        };

		this.llamada = function(tipo) {
		   var idDireccionFija=$scope.selectIdDireccion.idDireccion;
		   var idProducto_Principal=$scope.selectLinea.ProductoServicioResponse.idProductoServicio;
		   var idLinea=$scope.selectLinea.ProductoServicioResponse.idLinea;
		   var idPeriodoFijo=$scope.selectPeriodo.idPeriodo;
		   $scope.hideCorreo=false;
		   $scope.mostrarConsumosFijaData=true;
		   $scope.hideCorreoLimite=false;
		   $scope.hidePagina=false;
		   if(tipo=='E') {
				$scope.mostrarConsumosFija = true;
				$scope.mostrarConsumosFijaSaliente=false;
				$scope.tipoLlamadas='1';
				$('#idLlamadaS').removeClass('checked');
				$('#idLlamadaE').addClass('checked');
				$("#radio_1").prop("checked", true);
				$("#radio_2").prop("checked", false);
				obtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea,idPeriodoFijo,$scope.tipoLlamadas,'false','',1,10) ;
		   }else {
				$scope.mostrarConsumosFija = false;
				$scope.mostrarConsumosFijaSaliente=true;
				$scope.tipoLlamadas='2';
				$('#idLlamadaE').removeClass('checked');
				$('#idLlamadaS').addClass('checked');
				$("#radio_1").prop("checked", false);
				$("#radio_2").prop("checked", true);
				obtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea,idPeriodoFijo,$scope.tipoLlamadas,'false','',1,10) ;
		   }
		   
			
			
		   
        };

        function obtenerConsumosFijosxPeriodo() {
			$scope.mostrarConsumosFijaData=true;
			var idDireccionFija=$scope.selectIdDireccion.idDireccion;
			var idProducto_Principal=$scope.selectLinea.ProductoServicioResponse.idProductoServicio;
			var idLinea=$scope.selectLinea.ProductoServicioResponse.idLinea;
			var idPeriodoFijo=$scope.selectPeriodo.idPeriodo;
			obtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea,idPeriodoFijo,$scope.tipoLlamadas,'false','',1,10) ;
            
        };

        $scope.refreshPortlet = function(indicadorError) {
            if (indicadorError == '1') {
                main();
            } else if (indicadorError == '2') {
				var idDireccionFija=$scope.selectIdDireccion.idDireccion;
				var idProducto_Principal=$scope.selectLinea.ProductoServicioResponse.idProductoServicio;
				var idLinea=$scope.selectLinea.ProductoServicioResponse.idLinea;
				var idPeriodoFijo=$scope.selectPeriodo.idPeriodo;
				obtenerLlamadasFijo(idDireccionFija, idProducto_Principal, idLinea,idPeriodoFijo,$scope.tipoLlamadas,'false','',1,10) ;
            }
        };

        function obtenerServiciosAutocomplete(input_idServicios) {
            obtenerServiciosFijos(null, input_idServicios, "4");
        };

        function iniciarAutocomplete() {
            
            $('#autocomplete-filtro-fijo').autocomplete({
                lookup: function(query, done) {
                    obtenerListadoLineasFijas(done);
                },
                minChars: 4,
                onSelect: function(suggestion) {
					$scope.hidePagina=false;
					var input_idServicios = suggestion.data;
					var id= parseInt( arrayObjectIndexOfId($scope.listaAutocomplete,input_idServicios));	
					var idDirecion=$scope.listaAutocomplete[id].idDireccion;
					var idProducto=$scope.listaAutocomplete[id].idProductoServicio;
					var idLinea=$scope.listaAutocomplete[id].idLinea;
				   obtenerListadoFijoDireccion(idDirecion, idProducto, '1') ; 
				   obtenerPeriodosFacturacion(idDirecion, idProducto, idLinea);
				   
                }
            });
        };

        function obtenerListadoLineasFijas(done) {
            var valorinput = $('#autocomplete-filtro-fijo').val();
            var dataServAutocomplete = dataAutocomplete(valorinput);
            var arrayAutocomplete = [];
            servSaldosyConsumosFijo.obtenerListadoLineasFijas(dataServAutocomplete).then(function(response) {
                var rptaExito = response.data.obtenerListadoLineasFijasResponse.defaultServiceResponse.idRespuesta;
            
                if (rptaExito == 0) {
                    $scope.listaAutocomplete = response.data.obtenerListadoLineasFijasResponse.listadoProductosServicios;
					
					if (!Array.isArray($scope.listaAutocomplete)) {
						 $scope.listaAutocomplete = [];
						$scope.listaAutocomplete.push(response.data.obtenerListadoLineasFijasResponse.listadoProductosServicios);
						}
                    angular.forEach($scope.listaAutocomplete, function(val, key) {
                        arrayAutocomplete.push({
                            value: val.nombreAlias,
                            data: val.idProductoServicio
                        });
                    });
                    
                    var result = {
                        suggestions: arrayAutocomplete
                    };
                    done(result);
                } else   {
						arrayAutocomplete = [];
						$('.autocomplete-suggestion').remove();
						$('.autocomplete-suggestion').empty();
                } 
            }, function(error) {

            });
        };

      
    function auditoria(operationCode,transactionId,estado,descripcionoperacion) {
				var ResquestAuditoria = {
                    operationCode: operationCode,
                    pagina: WPSPageID.miclaro_consumer_consultas_saldosyconsumos_fijo,
                    transactionId: transactionId,
                    estado: estado,
                    servicio: $scope.servicioAuditoria,
                    tipoProducto: 'TELEFONIA',
                    tipoLinea: $scope.tipoLineaAuditoria,
                    tipoUsuario: tipoClienteCorporativo,
                    perfil: $scope.perfilAuditoria,
                    monto: '',
                    descripcionoperacion: descripcionoperacion,
                    responseType: ''
                };
        ResquestAuditoria = $httpParamSerializer({ requestJson: angular.toJson(ResquestAuditoria) });
        servSaldosyConsumosFijo.registrarAuditoria(ResquestAuditoria).then(function(response) {
		
        }, function(error) {
            
        });
    }

       
       
		
		function arrayObjectIndexOfId(arr, obj) {
				for ( var i = 0, k = arr.length; i < k; i++ ){
					if (arr[i].idProductoServicio == obj) {
						return i;
					}
				};
				return -1;
			};


    }
]);

ctrlsaldosyconsumos.directive('erCustomerror', function() {
    return {
        restrict: 'E',
        scope: {
            clickOn: '&onRefresh'
        },
        template: '<p class="error-server"><strong>' +
            WPSMensajeError.upps +
            '</strong><br>' +
            WPSMensajeError.mensaje1 + '<br>' + WPSMensajeError.mensaje2 + WPSMensajeError.mensaje4 + WPSMensajeError.mensaje5 +
            '<a href="" ><img src="/wpstheme/cuentasclaro/img/icon-actualizar.png" width="24" ng-click="clickOn()"></a>' +
            '</p>'
    }
})

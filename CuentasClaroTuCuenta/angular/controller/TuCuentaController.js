var appController = angular.module('miClaroController', []);

appController.directive('erCustomerrortotal', function() {
    return {
        restrict: 'E',
        template: '<div class="contenido-claro container-md ph-0 text-center absolute-center centerError">' +
            '<span class="icon-sh icon-sh_logoClaro"></span><div class="mensaje-error pv-42-mt-7 text-success">' +
            '<h1 class="fz-26 dinMed">' + WPSMensajeErrorTotal.upps + '</h1><p style="text-align:center;" class="container-xs fz-14 pt-14">' +
            WPSMensajeErrorTotal.mensaje + '<br>' +
            WPSMensajeErrorTotal.mensaje2 + '</p><br/>' +
            '<a href="/wps/myportal/cuentasclaro/tucuenta" ><img src="/wpstheme/miclaro/img/icon-actualizar.png" width=""></a></div></div>'
    }
});
appController.directive('loading', function() {
    return {
        restrict: 'E',
        replace: true,
        template: '<div class="loading"><img src="/wpstheme/miclaro/img/loader.gif" width="20" height="20" /></div>',
        link: function(scope, element, attr) {
            scope.$watch('loading', function(val) {
                if (val)
                    $(element).show();
                else
                    $(element).hide();
            });
        }
    }
});
appController.directive('erCustomerror', function() {
    return {
        restrict: 'E',
        scope: {
            textoVariable: '=texto',
            clickOn: '&onRefresh'
        },
        template: '<p class="error-server" style="text-align:center;"><strong>' +
            WPSMensajeError.upps +
            '</strong><br>' +
            WPSMensajeError.mensaje1 + '<br>' + WPSMensajeError.mensaje2 + '{{textoVariable}}' + WPSMensajeError.mensaje5 +
            '<a href="" ><img src="/wpstheme/miclaro/img/icon-actualizar.png" width="24" ng-click="clickOn()"></a>' +
            '</p>'
    }
});

appController.directive('erCustomerrornodata', function() {
    return {
        restrict: 'E',
        scope: {
            textoVariable: '=texto',
            clickOn: '&onRefresh'
        },
        template: '<p class="error-server" style="text-align:center;">' +
            '{{textoVariable}}' +
            '<a href="" ><img src="/wpstheme/miclaro/img/icon-actualizar.png" width="24" ng-click="clickOn()"></a>' +
            '</p>'
    }
});

appController.controller("ControllerTuCuenta", ['$scope', '$http', '$httpParamSerializer', '$timeout', 'TuCuentaService', function($scope, $http, $httpParamSerializer, $timeout, TuCuentaService) {
    angular.element(document).ready(function() {

        $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        var mensajeErrorConsumer = " <p ><div style='float: left' class='error-server'><strong>" + WPSMensajeError.upps + "</strong> " + WPSMensajeError.mensaje1 + " " + WPSMensajeError.mensaje2 + WPSMensajeError.mensaje3 + WPSMensajeError.mensaje5 + " </div> <a href='/wps/portal/cuentasclaro/tucuenta' class='loadingwps'>##</a></p>";
        var mensajeErrorCorporativo = " <p ><div style='float: left' class='error-server'><strong>" + WPSMensajeError.upps + "</strong> " + WPSMensajeError.mensaje1 + " " + WPSMensajeError.mensaje2 + WPSMensajeError.mensaje4 + WPSMensajeError.mensaje5 + " </div> <a href='/wps/portal/cuentasclaro/tucuenta' class='loadingwps'>##</a></p>";

        $('link[rel=stylesheet][href~="/wpstheme/cuentasclaro/css/ebm.css"]').prop('disabled', true);
        $('link[rel=stylesheet][href~="/wpstheme/cuentasclaro/css/ebm.css"]').remove();

        $scope.listadoProductoServicios = [];
        $scope.datos = [];
        $scope.allProductoServicios = [];
        $scope.phone = '';
        $scope.reestablecer = '';
        $scope.electronica = [];
        $scope.nombreDireccion = [];
        $scope.tipoVia = [];
        $scope.numero = [];
        $scope.manzana = [];
        $scope.lote = [];
        $scope.tipoVivienda = [];
        $scope.numeroDepartamento = [];
        $scope.tipoUrbanizacion = [];
        $scope.nombreUrbanizacion = [];
        $scope.zona = [];
        $scope.nombreZona = [];
        $scope.departamento = [];
        $scope.provincia = [];
        $scope.distrito = [];
        $scope.referencia = [];
        $scope.estilos = [];
        $scope.estadorowd = [];
        $scope.estiloafiliado = [];
        $scope.correo = [];
        $scope.direccion = [];
        $scope.classCorreo = [];
        $scope.classtipoVia = [];
        $scope.classTipoUrbanizacion = [];
        $scope.classTipoVivienda = [];
        $scope.classDepartamento = [];
        $scope.classProvincia = [];
        $scope.classDistrito = [];
        $scope.classnombreDireccion = [];
        $scope.classnumero = {};
        $scope.msgError = {};
        $scope.classMsgError = {};
        $scope.checkTermino = {};
        $scope.checkClassTermino = {};
        $scope.tecnico = true;
        $scope.tecnicoDescripcion = 'URL no Encontrado ';
        $scope.funcional = true;
        $scope.funcionalDescripcion = 'Error Funcional';
        $scope.estiloidataphone = 'input text';
        $scope.loading = true;
        $scope.image = '';
        $scope.foto = 'assets/img/img-nocliente.png';
        $scope.estadoImagen = true;
        $scope.estadoPopup = true;
        $scope.status = '';
        $scope.hideEmpleado = false;
        $scope.hideCliente = false;
        $scope.cuenta;
        $scope.hidePuntos = true;
        $scope.pagina;
        $scope.totalPagina;
        $scope.hidePagina = true;
        $scope.claroClub = [];
        $scope.txtServicioPrincipal;
        $scope.nombreApellido = '';
        $scope.hideVerMas = true;
        $scope.countries = [];
        $scope.tipoConsulta = -1;
        $scope.searchText = '';
        $scope.obtenerListadoDireccion = [];
        $scope.estadophone = -1;
        $scope.listaDepartamento = [];
        $scope.allDistristo = [];
        $scope.allprovincias = [];
        $scope.listarTipoVia = [];
        $scope.listarTipoUrbanizacion = [];
        $scope.listarTipoVivienda = [];
        $scope.classManzana = [];
        $scope.classLote = [];
        $scope.classNDepartamento = [];
        $scope.classNUrbanizacion = [];
        $scope.classZona = [];
        $scope.classNombreZona = [];
        $scope.classReferencia = [];
        $scope.SeleccionarVia = 'Seleccionar';
        $scope.SeleccionarTipo = 'Seleccionar';
        $scope.SeleccionarTipoUrbanizacion = 'Seleccionar';
        $scope.SeleccionarDepartamento = 'Seleccionar';
        $scope.SeleccionarProvincia = 'Seleccionar';
        $scope.SeleccionarDistrito = 'Seleccionar';
        $scope.estadoFoto = -1;
        $scope.estadoBusqueda = -1;
        $scope.mensajeError = '';
        $scope.errorTotal = false;
        $scope.textGeneral = '';
        $scope.imgREST = '';
        $scope.nombreDocumento;
        $("#perfilFormulario").hide();
        $("#eliminarCuenta").hide();
        $scope.listaAutoComplete = []
        $scope.tipoCliente;
        $scope.nomyapeTer;
        $scope.numdocTer;
        $scope.codclienteTer;
        $scope.correoTer;
        $scope.servicioTer;
        $scope.modalidad;
        var tipoMovil;

        var formRec = $('#frPhoneContact');
        formRec.find("#idataphone").keyup(function() {
            this.value = this.value.replace(/[^0-9]/, '');
        });

        $('.nombreDireccion').keyup(function() {
            $(this).val().replace(/[^0-9]/, '');
        });

        if (typeof urlsComunTuCuenta != 'undefined') {
            init();
        } else {
            $("#errorTuCuenta").show();
            $scope.errorTotal = true;
            $("#ClaroMusica").hide();
            $(".hideErrortuCuenta").hide();
        }

        function init() {
            if ($.cookie("CuentasClaroWPSRetornar")) {
                var wps_cookie = $.cookie('CuentasClaroWPSRetornar');
                TuCuentaService.urlsRetorno().then(function(response) {
                    var urlRetorno = response.data;
                    if (Array.isArray(urlRetorno)) {
                        $scope.urlRetorno = urlRetorno;
                    } else {
                        $scope.urlRetorno.push(urlRetorno);
                    }
                    var id = parseInt(obtenerIdUrl($scope.urlRetorno, wps_cookie));
                    $("#regresaClaro .icon-sh").addClass('icon-sh icon-sh_backArrow');
                    $("#regresaClaro").attr('href', $scope.urlRetorno[id].url);
                    $("#regresaClaro").html("<span class='icon-sh icon-sh_backArrow'></span>" + $scope.urlRetorno[id].textoInicialLink + " <strong>" + $scope.urlRetorno[id].nombreAplicacion + "</strong>");
                }, function(error) {

                });

            } else {
                $("#retornarClaro").css("height", "10px");
                $("#regresaClaro .icon-sh").removeClass('icon-sh icon-sh_backArrow');
                $("#regresaClaro").html("");
            }

            TuCuentaService.tipoUrbanizacion().then(function(response) {
                $scope.listarTipoUrbanizacion = response.data;

            }, function(error) {

            });

            TuCuentaService.tipoVia().then(function(response) {
                $scope.listarTipoVia = response.data;


            }, function(error) {

            });

            TuCuentaService.tipoVivienda().then(function(response) {
                $scope.listarTipoVivienda = response.data;

            }, function(error) {

            });



            TuCuentaService.departamento().then(function(response) {
                $scope.listaDepartamento = response.data;
            }, function(error) {

            });

            TuCuentaService.provincias().then(function(response) {
                $scope.allprovincias = response.data;
            }, function(error) {

            });

            TuCuentaService.distritos().then(function(response) {
                $scope.allDistristo = response.data;
            }, function(error) {

            });
            $scope.numeroDocumento;


            /**/

            TuCuentaService.obtenerServicioPrincipal().then(function(response) {
                $scope.wpsTextoProductoPrincipal = response.data.comunResponseType.nombreProductoPrincipal;
            });
            /**/

            $scope.loading = true;
            TuCuentaService.obtenerDatosUsuario().then(function(response) {
                $scope.datos = response.data;
                var estadoDatos = true;
                if (parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta) == 0) {
                    estadoDatos = true;
                    $('#eliminarCuenta').show();
                } else {
                    estadoDatos = false;
                    $("#errorTuCuenta").show();
                    $scope.errorTotal = true;
                    $("#ClaroMusica").hide();
                    $scope.loading = false;
                    var ResquestAuditoria = {
                        operationCode: WPSTablaOperaciones.consultarTucuenta,
                        pagina: WPSPageID.cuentasclaro_tucuenta,
                        transactionId: $scope.datos.comunResponseType.defaultServiceResponse.idTransaccional,
                        estado: 'ERROR',
                        servicio: '-',
                        tipoProducto: '-',
                        tipoLinea: '-',
                        tipoUsuario: '-',
                        perfil: '-',
                        monto: '',
                        descripcionoperacion: 'obtenerDatosUsuario - ' + $scope.datos.comunResponseType.defaultServiceResponse.mensaje,
                        responseType: '/'
                    };
                    auditoria(ResquestAuditoria);
                }

                var tipoClienteClaro = true;
                if (estadoDatos) {
                   $scope.phone = $scope.datos.comunResponseType.telefono;
                    $scope.reestablecer = $scope.phone;
                    $scope.nombreApellido = $scope.datos.comunResponseType.nombres;
                    $scope.txtServicioPrincipal = $scope.wpsTextoProductoPrincipal;
                    var tipoCliente = $scope.datos.comunResponseType.tipoCliente;
                    $scope.tipoCliente = tipoCliente;
                    $scope.claroClub = $scope.datos.comunResponseType.claroPuntos;
                    $scope.usuarioVinculado = $scope.datos.comunResponseType.usuarioVinculado;
                    $scope.numeroDocumento = $scope.datos.comunResponseType.numeroDocumento
                    var valor = $scope.datos.comunResponseType.primeraVez;

                    if (valor === 'true') {
                        $scope.estadoPopup = false;
                        modificaTelefono($scope.phone, false);
                    } else {
                        $scope.estadoPopup = true;
                    }

                    if ($scope.datos.comunResponseType.tipoDocumento == '001') {
                        $scope.nombreDocumento = 'RUC';
                    } else if ($scope.datos.comunResponseType.tipoDocumento == '002') {
                        $scope.nombreDocumento = 'DNI';
                    } else if ($scope.datos.comunResponseType.tipoDocumento == '004') {
                        $scope.nombreDocumento = 'Carnet Extranjería';
                    } else if ($scope.datos.comunResponseType.tipoDocumento == '006') {
                        $scope.nombreDocumento = 'Pasaporte';
                    } else {
                        $scope.nombreDocumento = 'OTROS';
                    }
                    if (tipoCliente == WPSTipoCliente.nocliente) {
                        $scope.textGeneral = WPSMensajeError.mensaje3;
                        $scope.hideEmpleado = true;
                        tipoClienteClaro = false;
                        $scope.cuenta = 'Tu Cuenta';
                        var name18 = $scope.datos.comunResponseType.nombreUsuario;
                        $scope.nombreApellido = name18.substring(0, 18);
                        $scope.hidePuntos = true;
                        $("#urlClaroPunto").hide();
                        if ($.trim($scope.txtServicioPrincipal) === '') {
                            $("#hidePrincipal").hide();
                        } else {
                            $("#hidePrincipal").show();
                        }
                        $scope.funcionalDescripcion = WPSMensajeError.upps + " " + WPSMensajeError.upps_descripcion01 + " " + WPSMensajeError.upps_descripcion03;
                    } else if (tipoCliente == WPSTipoCliente.consumer) {
                        $scope.textGeneral = WPSMensajeError.mensaje3;
                        $scope.cuenta = 'Tu Cuenta';
                        $scope.modalidad = "Residencial";
                        var name18 = $scope.datos.comunResponseType.nombreUsuario;
                        $scope.nomyapeTer = $scope.datos.comunResponseType.nombreUsuario + " " + $scope.datos.comunResponseType.apellidos;
                        $scope.nombreApellido = name18.substring(0, 18);
                        $("#urlClaroPunto").attr("href", "/wps/myportal/miclaro/root?flagClaroPuntos=true");
                        $scope.hidePuntos = true;
                        $scope.funcionalDescripcion = WPSMensajeError.upps + " " + WPSMensajeError.upps_descripcion01 + " " + WPSMensajeError.upps_descripcion03;
                        $scope.mensajeError = mensajeErrorConsumer;
                        direccion();
                    } else {
                        $scope.textGeneral = WPSMensajeError.mensaje4;
                        var name18 = $scope.datos.comunResponseType.razonSocial;
                        $scope.nomyapeTer = $scope.datos.comunResponseType.razonSocial;
                        $scope.nombreApellido = name18.substring(0, 18);
                        $scope.cuenta = 'Su Cuenta';
                        $scope.modalidad = "Corporativo";
                        $("#urlClaroPunto").attr("href", "/wps/myportal/miclaro/root?flagClaroPuntos=true");
                        $scope.hidePuntos = true;
                        $scope.mensajeError = mensajeErrorCorporativo;
                        $scope.funcionalDescripcion = WPSMensajeError.upps + " " + WPSMensajeError.upps_descripcion01 + " " + WPSMensajeError.upps_descripcion02;
                        direccion();

                    }
                    $scope.numdocTer = $scope.datos.comunResponseType.numeroDocumento;
                    $scope.codclienteTer = $scope.datos.comunResponseType.idCuenta;
                    $scope.correoTer = $scope.datos.comunResponseType.usuarioVinculado;
                    $scope.servicioTer = $scope.datos.comunResponseType.productoPrincipalOriginal;
                    TuCuentaService.obtenerFoto().then(function(response) {
                        var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
                        if (id_respuesta == 0) {
                            if (response.data.comunResponseType.foto != "") {
                                $scope.mgREST = response.data.comunResponseType.foto;

                                $("#imgPhoto").attr("src", $scope.mgREST.replace("\/", "/"));

                            } else {
                                $("#imgPhoto").attr("src", "/wpstheme/miclaro/img/photo-nocliente.png");
                            }
                        } else {
                            $("#imgPhoto").attr("src", "/wpstheme/miclaro/img/photo-nocliente.png");
                        }
                        $scope.loading = false;

                    }, function(error) {
                        $scope.loading = false;
                    });

                    $("#showCambiarClave").hide();
                    TuCuentaService.obtenerUsuarioVinculado().then(function(response) {
                        var id_respuesta = response.data.comunResponseType.defaultServiceResponse.idRespuesta;
                        if (id_respuesta == 0) {
                            var userDueno = response.data.comunResponseType.usuarioDueno;
                            var userVinc = response.data.comunResponseType.usuarioVinculado;
                            $("#urlCambiarClave").attr("href", "/wps/myportal/cuentasclaro/cambiaclave/?&userVinc=" + userVinc + "&userDueno=" + userDueno);
                            $("#showCambiarClave").show();
                        } else {
                            $("#showCambiarClave").hide();

                        }

                    }, function(error) {
                        $("#showCambiarClave").hide();
                    });
                    var ResquestAuditoria = {
                        operationCode: WPSTablaOperaciones.consultarTucuenta,
                        pagina: WPSPageID.cuentasclaro_tucuenta,
                        transactionId: $scope.datos.comunResponseType.defaultServiceResponse.idTransaccional,
                        estado: 'SUCCESS',
                        servicio: '-',
                        tipoProducto: '-',
                        tipoLinea: '-',
                        tipoUsuario: $scope.tipoCliente,
                        perfil: '-',
                        monto: '',
                        descripcionoperacion: '-',
                        responseType: '/'
                    };

                    auditoria(ResquestAuditoria);
                    $("#perfilFormulario").show();
                }
            }, function(response) {
                $scope.loading = false;


            });
        }

        function auditoria(ResquestAuditoria) {
            ResquestAuditoria = $httpParamSerializer({ requestJson: angular.toJson(ResquestAuditoria) });
            TuCuentaService.enviarAuditoria(ResquestAuditoria).then(function(response) {}, function(response) {

            });

        }

        function direccion() {
            var ResquestObtenerDirecciones = {
                direccionCompleta: '',
                idDireccion: '',
                pagina: '1',
                cantResultadosPagina: '10'
            };
            obtenerDireccion(ResquestObtenerDirecciones);
        }

        function obtenerDireccion(ResquestObtenerDirecciones) {
            ResquestObtenerDirecciones = $httpParamSerializer({ requestJson: angular.toJson(ResquestObtenerDirecciones) });
            $("#loaderAllProductoServicios").show();
            TuCuentaService.obtenerDirecciones(ResquestObtenerDirecciones).then(function(response) {
                $scope.listadoProductoServicios = response.data;
                var estado = true;
                if (parseInt(response.data.obtenerDireccionesResponse.defaultServiceResponse.idRespuesta) == 0) {
                    $("#loaderAllProductoServicios").hide();
                    $("#errorAllProductoServiciosNoData").hide();
                    $("#errorAllProductoServiciosNoDataMo").hide();
                    $scope.hideCliente = true;
                    $("#eliminarCuenta").show();
                    if (response.data.obtenerDireccionesResponse.listadoProductosServicios == undefined) {
                        estado = false;
                        $("#loaderAllProductoServicios").hide();
                        $(".allProductoServicios").hide();
                        $scope.hidePagina = false;
                    } else {
                        estado = true;
                        $("#errorAllProductoServicios").hide();
                    }
                } else if (parseInt(response.data.obtenerDireccionesResponse.defaultServiceResponse.idRespuesta) == 5) {
                    $scope.hideCliente = true;
                    $scope.textGeneral = 'No hay resultados. Vuelve a intentalo o actualiza para ver tus direcciones';
                    estado = false;
                    $("#loaderAllProductoServicios").hide();
                    $("#errorAllProductoServiciosNoData").show();
                    $("#errorAllProductoServiciosNoDataMo").show();
                    $(".allProductoServicios").hide();
                    $scope.hidePagina = false;
                } else {
                    $scope.hideCliente = true;
                    estado = false;
                    $("#loaderAllProductoServicios").hide();
                    $("#errorAllProductoServicios").show();
                    $("#errorAllProductoServiciosNoData").hide();
                    $("#errorAllProductoServiciosNoDataMo").hide();
                    $(".allProductoServicios").hide();
                    $scope.hidePagina = false;

                    var ResquestAuditoria = {
                        operationCode: WPSTablaOperaciones.consultarTucuenta,
                        pagina: WPSPageID.cuentasclaro_tucuenta,
                        transactionId: response.data.obtenerDireccionesResponse.defaultServiceResponse.idTransaccional,
                        estado: 'ERROR',
                        servicio: '-',
                        tipoProducto: '-',
                        tipoLinea: '-',
                        tipoUsuario: $scope.tipoCliente,
                        perfil: '-',
                        monto: '',
                        descripcionoperacion: '-',
                        responseType: '/'
                    };
                    auditoria(ResquestAuditoria);


                }
                if (estado) {
                    if (!Array.isArray($scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios)) {
                        var listadoTemple = [];
                        listadoTemple.push(response.data.obtenerDireccionesResponse.listadoProductosServicios);
                        $scope.listadoProductoServicios.obtenerDireccionesResponse = response.data.obtenerDireccionesResponse;
                        $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios = listadoTemple;
                    }
                    limpiar();
                    arregloListar(0);
                    ListaProducto(0);
                    $scope.pagina = $scope.listadoProductoServicios.obtenerDireccionesResponse.pagina;
                    $scope.totalPagina = $scope.listadoProductoServicios.obtenerDireccionesResponse.totalPaginas;
                    $scope.hidePagina = true;
                    if ($scope.totalPagina == 1) {
                        $scope.hidePagina = false;
                    }
                }

            }, function(response) {
                $("loaderAllProductoServicios").hide();
                $scope.tecnico = false;
                $scope.hidePagina = false;

            });

        }

        $scope.refreshPortlet = function(indicadorError) {
            if (indicadorError == '1') {
                direccion();
            } else if (indicadorError == '2') {
                $scope.paginacion();
            }
        }


        function arregloListar(inicio) {
            var cantidad = ($scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios).length;
            id = inicio - 1;
            for (var i = 0; i < cantidad; i++) {
                id = id + 1
                $scope.electronica[parseInt(id)] = '';
                $scope.tipoVia[parseInt(id)] = '';
                $scope.nombreDireccion[parseInt(id)] = '';
                $scope.numero[parseInt(id)] = '';
                $scope.manzana[parseInt(id)] = '';
                $scope.lote[parseInt(id)] = '';
                $scope.tipoVivienda[parseInt(id)] = '';
                $scope.numeroDepartamento[parseInt(id)] = '';
                $scope.tipoUrbanizacion[parseInt(id)] = '';
                $scope.nombreUrbanizacion[parseInt(id)] = '';
                $scope.zona[parseInt(id)] = '';
                $scope.nombreZona[parseInt(id)] = '';
                $scope.departamento[parseInt(id)] = '';
                $scope.provincia[parseInt(id)] = '';
                $scope.distrito[parseInt(id)] = '';
                $scope.referencia[parseInt(id)] = '';
                $scope.estilos[parseInt(id)] = 'row';
                $scope.estadorowd[id] = false;
                $scope.classCorreo[parseInt(id)] = '';
                $scope.correo[parseInt(id)] = true;
                $scope.direccion[parseInt(id)] = true;
                $scope.msgError[parseInt(id)] = '';
                $scope.classMsgError[parseInt(id)] = '';
                $scope.checkTermino[parseInt(id)] = false;
                $scope.checkClassTermino[parseInt(id)] = 'check';
                $scope.classtipoVia[parseInt(id)] = '';
                $scope.classDepartamento[parseInt(id)] = '';
                $scope.classProvincia[parseInt(id)] = '';
                $scope.classTipoUrbanizacion[parseInt(id)] = '';
                $scope.classTipoVivienda[parseInt(id)] = '';
                $scope.classDistrito[parseInt(id)] = '';
                $scope.classnombreDireccion[parseInt(id)] = '';
                $scope.classnumero[parseInt(id)] = '';
                $scope.classManzana[parseInt(id)] = '';
                $scope.classLote[parseInt(id)] = '';
                $scope.classNDepartamento[parseInt(id)] = '';
                $scope.classNUrbanizacion[parseInt(id)] = '';
                $scope.classZona[parseInt(id)] = '';
                $scope.classNombreZona[parseInt(id)] = '';
                $scope.classReferencia[parseInt(id)] = '';
                if ($scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[i].tipoDireccion == '3') {
                    $scope.estiloafiliado[parseInt(id)] = 'check checked';
                } else {
                    $scope.estiloafiliado[parseInt(id)] = 'check';
                }
            }
        }

        $scope.addPhone = function() {
            var estado = document.getElementById('idPhone').text;
            if (estado == 'editar') {
                document.getElementById('idPhone').innerHTML = 'guardar';
                document.getElementById("idataphone").focus();
                $scope.phone = '';
                $("#estiloidataphone").addClass("input text focus");
                $("#idPhone").addClass("editfield onlyedit red");
                $scope.estadophone = 1;
            } else {
                if ($scope.phone != '' && estado === 'guardar') {
                    $('#idPhone').addClass('disabled');
                    document.getElementById('idPhone').innerHTML = "editar";
                    $("#estiloidataphone").addClass("input text").removeClass("focus").removeClass("error");
                    $("#idPhone").addClass("editfield onlyedit").removeClass("red");
                    if (validPhone($scope.phone)) {
                        modificaTelefono($scope.phone, '');
                    } else {
                        document.getElementById('idPhone').innerHTML = "guardar";
                        document.getElementById("idataphone").focus();
                        $("#estiloidataphone").addClass("input text error").focus();
                    }
                    $scope.estadophone = -1
                } else {
                    document.getElementById("idataphone").focus();
                    $("#estiloidataphone").addClass("input text error").focus();
                    $scope.estadophone = 1;
                }
            }
        }

        $scope.changeTipoVia = function(id) {
            if ($scope.tipoVia[id] == null) {
                $scope.SeleccionarVia = 'Seleccionar';
                $scope.tipoVia[id] = '';
            } else {
                $scope.SeleccionarVia = '';
            }
        }

        $scope.changeTipo = function(id) {
            if ($scope.tipoVivienda[id] == null) {
                $scope.SeleccionarTipo = 'Seleccionar';
                $scope.tipoVivienda[id] = '';
            } else {
                $scope.SeleccionarTipo = '';
            }

        }

        $scope.changeTipoUrbanizacion = function(id) {
            if ($scope.tipoUrbanizacion[id] == null) {
                $scope.SeleccionarTipoUrbanizacion = 'Seleccionar';
                $scope.tipoUrbanizacion[id] = '';
            } else {
                $scope.SeleccionarTipoUrbanizacion = '';
            }

        }

        $scope.changeDistrito = function(id) {
            if ($scope.distrito[id] == null) {
                $scope.SeleccionarDistrito = 'Seleccionar';
                $scope.distrito[id] = '';
            } else {
                $scope.SeleccionarDistrito = '';
            }
        }

        var datosActual = '';

        $('#Autocomplete').autocomplete({
            lookup: function(query, done) {
                buscarDirecion(done);
            },
            minChars: 4,
            onSelect: function(suggestion) {
                var idDireccionBusqueda = suggestion.data;
                $timeout(function() {
                    $scope.hidePagina = false;
                    $("#frBuscar .search").removeClass("error");
                    limpiar();
                    var ResquestObtenerDireccionesAll = {
                        direccionCompleta: null,
                        idDireccion: idDireccionBusqueda,
                        pagina: '1',
                        cantResultadosPagina: '10'
                    };
                    obtenerDireccionAll(ResquestObtenerDireccionesAll);
                }, 600);

            }
        });


        function buscarDirecion(done) {
            var valorinput = $('#Autocomplete').val();
            var arrayAutocomplete = [];
            var requestBusqueda = {
                criterioBusqueda: valorinput,
                pagina: '1',
                cantResultadosPagina: '10'
            };
            requestBusqueda = $httpParamSerializer({ requestJson: angular.toJson(requestBusqueda) });
            TuCuentaService.obtenerListadoDirecciones(requestBusqueda).then(function(response) {
                var rptaExito = response.data.obtenerListadoDireccionesResponse.defaultServiceResponse.idRespuesta;
                if (rptaExito == 0) {
                    if (response.data.obtenerListadoDireccionesResponse.listadoProductosServicios == undefined) {
                        arrayAutocomplete = [];
                        $('.autocomplete-suggestion').remove();
                        $('.autocomplete-suggestion').empty();
                    } else {
                        $scope.listaAutocomplete = response.data.obtenerListadoDireccionesResponse.listadoProductosServicios;
                        if (!Array.isArray($scope.listaAutocomplete)) {
                            $scope.listaAutocomplete = [];
                            $scope.listaAutocomplete.push(response.data.obtenerListadoDireccionesResponse.listadoProductosServicios);
                        }
                        angular.forEach($scope.listaAutocomplete, function(val, key) {
                            arrayAutocomplete.push({
                                value: val.direccionCompleta,
                                data: val.idDireccion
                            });
                        });

                        var result = {
                            suggestions: arrayAutocomplete
                        };
                        done(result);
                    }
                } else {
                    $scope.listaAutocomplete = [];
                }
            }, function(response) {


            });

        };

        function obtenerDireccionAll(ResquestObtenerDirecciones) {
            ResquestObtenerDirecciones = $httpParamSerializer({ requestJson: angular.toJson(ResquestObtenerDirecciones) });
            TuCuentaService.obtenerDirecciones(ResquestObtenerDirecciones).then(function(response) {
                if (parseInt(response.data.obtenerDireccionesResponse.defaultServiceResponse.idRespuesta) == 0) {
                    $("#errorAllProductoServicios").hide();
                    $scope.listaAutoComplete = response.data.obtenerDireccionesResponse.listadoProductosServicios;
                    if (!Array.isArray(response.data.obtenerDireccionesResponse.listadoProductosServicios)) {
                        $scope.listaAutoComplete = [];
                        $scope.listaAutoComplete.push(response.data.obtenerDireccionesResponse.listadoProductosServicios);
                    }
                    $("#errorAllProductoServiciosNoData").hide();
                    $("#errorAllProductoServiciosNoDataMo").hide();
                    arregloListarBusqueda(0);
                    ListaProductoBusqueda(0);
                    $scope.estadoBusqueda = 1;
                } else {
                    $("#errorAllProductoServicios").show();
                }
            }, function(response) {

            });

        }

        function limpiar() {
            if ($scope.allProductoServicios.length > 0) {
                $scope.allProductoServicios = [];
            }
        }

        function arrayObjectIndexOf(arr, obj) {
            for (var i = 0, k = arr.length; i < k; i++) {
                if (arr[i].direccionCompleta == obj) {
                    return i;
                }
            };
            return -1;
        }

        $scope.addPhoneFocus = function() {
            $timeout(function() {
                $scope.estadophone = 1;
                document.getElementById('idPhone').innerHTML = 'guardar';
                document.getElementById("idataphone").focus();
                $scope.phone = '';
                $("#estiloidataphone").addClass("input text focus");
                $("#idPhone").addClass("editfield onlyedit red");

            });
        }

        $(window).click(function(e) {
            if (parseInt($scope.estadophone) >= 0) {
                $timeout(function() {
                    $scope.phone = $scope.reestablecer;
                    $scope.phone = $scope.reestablecer;
                    document.getElementById('idPhone').innerHTML = "editar";
                    $("#estiloidataphone").addClass("input text").removeClass("focus").removeClass("error");
                    $("#idPhone").addClass("editfield onlyedit").removeClass("red");
                }, 200);
            }
            if (parseInt($scope.estadoFoto) >= 0) {
                $("#imgPhoto").attr("src", $(".wpsimage").attr("src"));
                $("#btnChangeSave").html("Cambia tu foto");
            }
            if (parseInt($scope.estadoBusqueda) >= 0) {
                $timeout(function() {
                    $scope.estadoBusqueda = -1;

                }, 200);
            }
        });


        var ocultarRowd = '';
        var ocultarEstado = false;
        $scope.addFormulario = function(id) {
            $scope.SeleccionarDepartamento = 'Seleccionar';
            $scope.SeleccionarProvincia = 'Seleccionar';
            $scope.SeleccionarDistrito = 'Seleccionar';
            if ($scope.allProductoServicios[id].tipo == '2') {
                $scope.estadorowd[id] = false;
            } else {
                if ($scope.tipoConsulta == 1) {
                    id = 0;
                }
                if (ocultarEstado) {
                    $scope.estadorowd[ocultarRowd] = false;
                    $scope.estilos[ocultarRowd] = 'row';
                }
                $scope.estilos[id] = '';
                $scope.estadorowd[id] = true;
                if ($scope.allProductoServicios[parseInt(id)].afiliado) {
                    $scope.correo[id] = false;
                    $scope.direccion[id] = true;
                } else {
                    $scope.correo[id] = true;
                    $scope.direccion[id] = false;
                }
                $scope.estilos[id] = 'row edit';
                ocultarRowd = id;
                ocultarEstado = true;
            }
        }

        $scope.cancelar = function(id) {
            if ($scope.tipoConsulta == 1) {
                id = 0;
            }
            $scope.estadorowd[id] = false;
            $scope.estilos[ocultarRowd] = 'row';
            limpiarfomulario(id);
        }

        $scope.requiereCheck = function(id) {
            if ($scope.tipoConsulta == 1) {
                id = 0;
            }
            if ($scope.checkTermino[id]) {
                $scope.checkClassTermino[id] = 'check checked';
                $scope.checkTermino[id] = true;
            } else {
                $scope.checkClassTermino[id] = 'check';
                $scope.checkTermino[id] = false;
            }
        }

        function ListaProducto(inicio) {

            var cantidad = Object.keys($scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios).length;
            id = inicio - 1;
            for (var i = 0; i < cantidad; i++) {
                id = id + 1;
                var tipo = $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[i].tipoDireccion;
                var direccion = '';
                var direccionAnteriorDirecion = '';
                var direccionAnteriorCorreo = '';
                var afiliado = true;
                var ocultarDireccion = true
                if (tipo == '2') {
                    ocultarDireccion = false;
                    afiliado = false;
                    direccion = $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].direccionElectronica;
                    direccionAnteriorDirecion = $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].direccionCompleta;
                    direccionAnteriorCorreo = '';
                } else if (tipo == '3') {
                    direccion = $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].direccionElectronica;
                    direccionAnteriorDirecion = $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].direccionCompleta;
                    direccionAnteriorCorreo = '';
                    afiliado = true;
                    ocultarDireccion = true
                } else {
                    direccion = $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].direccionCompleta;
                    direccionAnteriorCorreo = $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].direccionElectronica;
                    direccionAnteriorDirecion = '';
                    afiliado = false;
                    ocultarDireccion = true;
                }


                if ($scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].alias != '') {
                    direccion = $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].alias;
                }

                if (/^\d+$/.test($scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].nombre)) {
                    tipoMovil = true;
                } else {
                    tipoMovil = false;
                }

                var roleList = {
                    "id": id,
                    "idDireccion": $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].idDireccion,
                    "nombre": $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].nombre,
                    "alias": $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].alias,
                    "tipoDireccion": $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].descDireccion,
                    "tipo": $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].tipoDireccion,
                    'direccion': direccion,
                    'direccionAnteriorDirecion': direccionAnteriorDirecion,
                    'direccionAnteriorCorreo': direccionAnteriorCorreo,
                    "direccionCompleta": $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].direccionCompleta,
                    "direccionElectronica": $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].direccionElectronica,
                    "plataforma": $scope.listadoProductoServicios.obtenerDireccionesResponse.listadoProductosServicios[parseInt(i)].plataforma,
                    "afiliado": afiliado,
                    "ocultarDireccion": ocultarDireccion,
                    "tipoMovil": tipoMovil
                }
                $scope.allProductoServicios.push(roleList);
            }



        }

        function ListaProductoBusqueda(id) {
            var tipo = $scope.listaAutoComplete[id].tipoDireccion;
            var direccion = '';
            var direccionAnteriorDirecion = '';
            var direccionAnteriorCorreo = '';
            var afiliado = true;
            var ocultarDireccion = true;
            if (tipo == '2') {
                ocultarDireccion = false;
                direccion = $scope.listaAutoComplete[parseInt(id)].direccionElectronica;
                direccionAnteriorDirecion = $scope.listaAutoComplete[parseInt(id)].direccionCompleta;
                direccionAnteriorCorreo = '';
                afiliado = false;
            } else if (tipo == '3') {
                ocultarDireccion = true;
                direccion = $scope.listaAutoComplete[parseInt(id)].direccionElectronica;
                direccionAnteriorDirecion = $scope.listaAutoComplete[parseInt(id)].direccionCompleta;
                direccionAnteriorCorreo = '';
                afiliado = true;
            } else {
                ocultarDireccion = true;
                direccion = $scope.listaAutoComplete[parseInt(id)].direccionCompleta;
                direccionAnteriorCorreo = $scope.listaAutoComplete[parseInt(id)].direccionElectronica;
                direccionAnteriorDirecion = '';
                afiliado = false;
            }
            var roleList = {
                "id": 0,
                "idDireccion": $scope.listaAutoComplete[parseInt(id)].idDireccion,
                "nombre": $scope.listaAutoComplete[parseInt(id)].nombre,
                "alias": $scope.listaAutoComplete[parseInt(id)].alias,
                "tipoDireccion": $scope.listaAutoComplete[parseInt(id)].descDireccion,
                "tipo": $scope.listaAutoComplete[parseInt(id)].tipoDireccion,
                "direccion": direccion,
                "direccionAnteriorDirecion": direccionAnteriorDirecion,
                "direccionAnteriorCorreo": direccionAnteriorCorreo,
                "direccionCompleta": $scope.listaAutoComplete[parseInt(id)].direccionCompleta,
                "direccionElectronica": $scope.listaAutoComplete[parseInt(id)].direccionElectronica,
                "plataforma": $scope.listaAutoComplete[parseInt(id)].plataforma,
                "afiliado": afiliado,
                "ocultarDireccion": ocultarDireccion
            }
            $scope.allProductoServicios.push(roleList);
        }


        function arregloListarBusqueda(idBusqueda) {
            var id = 0;
            $scope.electronica[parseInt(id)] = '';
            $scope.tipoVia[parseInt(id)] = '';
            $scope.nombreDireccion[parseInt(id)] = '';
            $scope.numero[parseInt(id)] = '';
            $scope.manzana[parseInt(id)] = '';
            $scope.lote[parseInt(id)] = '';
            $scope.tipoVivienda[parseInt(id)] = '';
            $scope.numeroDepartamento[parseInt(id)] = '';
            $scope.tipoUrbanizacion[parseInt(id)] = '';
            $scope.nombreUrbanizacion[parseInt(id)] = '';
            $scope.zona[parseInt(id)] = '';
            $scope.nombreZona[parseInt(id)] = '';
            $scope.departamento[parseInt(id)] = '';
            $scope.provincia[parseInt(id)] = '';
            $scope.distrito[parseInt(id)] = '';
            $scope.referencia[parseInt(id)] = '';
            $scope.estilos[parseInt(id)] = 'row';
            $scope.estadorowd[id] = false;
            $scope.classCorreo[parseInt(id)] = '';
            $scope.correo[parseInt(id)] = true;
            $scope.direccion[parseInt(id)] = true;
            $scope.msgError[parseInt(id)] = '';
            $scope.classMsgError[parseInt(id)] = '';
            $scope.checkTermino[parseInt(id)] = false;
            $scope.checkClassTermino[parseInt(id)] = 'check';
            $scope.classtipoVia[parseInt(id)] = 'pull';
            $scope.classDepartamento[parseInt(id)] = 'pull';
            $scope.classProvincia[parseInt(id)] = 'pull';
            $scope.classTipoUrbanizacion[parseInt(id)] = 'pull';
            $scope.classTipoVivienda[parseInt(id)] = 'pull';
            $scope.classDistrito[parseInt(id)] = 'pull';
            $scope.classnombreDireccion[parseInt(id)] = '';
            $scope.classnumero[parseInt(id)] = '';
            $scope.classManzana[parseInt(id)] = '';
            $scope.classLote[parseInt(id)] = '';
            $scope.classNDepartamento[parseInt(id)] = '';
            $scope.classNUrbanizacion[parseInt(id)] = '';
            $scope.classZona[parseInt(id)] = '';
            $scope.classNombreZona[parseInt(id)] = '';
            $scope.classReferencia[parseInt(id)] = '';
            if ($scope.listaAutoComplete[idBusqueda].tipoDireccion == '3') {
                $scope.estiloafiliado[parseInt(id)] = 'check checked';
            } else {
                $scope.estiloafiliado[parseInt(id)] = 'check';
            }
        }


        $scope.guardarCorreoElectronico = function(id) {
            var arrayValidacion = [];
            arrayValidacion[0] = 'email';
            arrayValidacion[1] = $scope.electronica[id];
            var arrayValidacionV1 = [];
            arrayValidacionV1[0] = 'required';
            arrayValidacionV1[1] = $scope.checkTermino[id];
            if (validacion(arrayValidacion, id)) {
                if (validacion(arrayValidacionV1, id)) {

                    if (!$scope.allProductoServicios[id].tipoMovil) {

                        if ($scope.allProductoServicios[id].plataforma == "1") {
                            var text = $scope.allProductoServicios[id].idDireccion;
                            var parts = text.split('-');
                            var loc = parts.pop();
                            var new_idDireccion = parts.join('-');
                        } else {
                            var new_idDireccion = $scope.allProductoServicios[id].idDireccion;
                        }

                        var requestGrabarDireccion = {
                            categoria: '',
                            idCuenta: '',
                            idRecibo: '',
                            idDireccion: new_idDireccion,
                            tipoAccion: '1',
                            email: $scope.electronica[id]
                        };
                        actualizarAfiliacionFacturacionElectronica(requestGrabarDireccion, id);

                    } else {

                        var datos = {
                            tipoLinea: WPSTipoLinea.todos,
                            tipoCliente: $scope.tipoCliente,
                            tipoPermiso: WPSTipoPermiso.todos,
                            idCuenta: '',
                            idRecibo: '',
                            criterioBusqueda: $scope.allProductoServicios[id].nombre,
                            pagina: WPSpaginacion.pagina,
                            cantResultadosPagina: '1',
                            titularidadServicio: WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado
                        };


                        requestObtenerServicios = $httpParamSerializer({ requestJson: angular.toJson(datos) });
                        TuCuentaService.obtenerListadoMoviles(requestObtenerServicios).then(function(response) {

                            var id_respuesta = response.data.obtenerListadoMovilesResponse.defaultServiceResponse.idRespuesta;
                            if (id_respuesta == 0) {
                                var requestGrabarDireccion = {
                                    categoria: '',
                                    idCuenta: response.data.obtenerListadoMovilesResponse.listadoProductosServicios.idCuenta,
                                    idRecibo: response.data.obtenerListadoMovilesResponse.listadoProductosServicios.idRecibo,
                                    idDireccion: '',
                                    tipoAccion: '1',
                                    email: $scope.electronica[id]
                                };
                                actualizarAfiliacionFacturacionElectronica(requestGrabarDireccion, id);
                            }

                        }, function() {

                        });
                    }
                } else {
                    $scope.classMsgError[id] = 'msgerror';
                    $scope.msgError[id] = 'Debes aceptar los términos y condiciones';
                }
            } else {
                $scope.classMsgError[id] = 'msgerror';
                $scope.msgError[id] = 'Debes ingresar una dirección de correo eletrónico válida';
            }
        }

        $scope.guardarDireccion = function(id) {

            var plataforma = $scope.allProductoServicios[id].plataforma;
            var arrayValidacion = [];
            var arrayValidacionV1 = [];
            if (plataforma == '1') {

                arrayValidacion[0] = 'tipoVia';
                arrayValidacion[1] = $scope.tipoVia[id];
                arrayValidacion[2] = 'nombreDireccion';
                arrayValidacion[3] = $scope.nombreDireccion[id];
                arrayValidacion[4] = 'tipoUrbanizacion';
                arrayValidacion[5] = $scope.tipoUrbanizacion[id];
                arrayValidacion[6] = 'nombreUrbanizacion';
                arrayValidacion[7] = $scope.nombreUrbanizacion[id];
                arrayValidacion[8] = 'departamento';
                arrayValidacion[9] = $scope.departamento[id];
                arrayValidacion[10] = 'provincia';
                arrayValidacion[11] = $scope.provincia[id];
                arrayValidacion[12] = 'distrito';
                arrayValidacion[13] = $scope.distrito[id];
                arrayValidacion[14] = 'referencia';
                arrayValidacion[15] = $scope.referencia[id];
                arrayValidacion[16] = 'numero';
                arrayValidacion[17] = $scope.numero[id];



            } else {

                arrayValidacion[0] = 'departamento';
                arrayValidacion[1] = $scope.departamento[id];
                arrayValidacion[2] = 'provincia';
                arrayValidacion[3] = $scope.provincia[id];
                arrayValidacion[4] = 'distrito';
                arrayValidacion[5] = $scope.distrito[id];
                arrayValidacion[6] = 'referencia';
                arrayValidacion[7] = $scope.referencia[id];
                arrayValidacionV1[0] = 'referencia';
                arrayValidacionV1[1] = $scope.referencia[id];


            }
            arrayValidacionV1[0] = 'nombreDireccion';
            arrayValidacionV1[1] = $scope.nombreDireccion[id];
            arrayValidacionV1[2] = 'numero';
            arrayValidacionV1[3] = $scope.numero[id];
            arrayValidacionV1[4] = 'manzana';
            arrayValidacionV1[5] = $scope.manzana[id];
            arrayValidacionV1[6] = 'lote';
            arrayValidacionV1[7] = $scope.lote[id];
            arrayValidacionV1[8] = 'numeroDepartamento';
            arrayValidacionV1[9] = $scope.numeroDepartamento[id];
            arrayValidacionV1[10] = 'nombreUrbanizacion';
            arrayValidacionV1[11] = $scope.nombreUrbanizacion[id];
            arrayValidacionV1[12] = 'zona';
            arrayValidacionV1[13] = $scope.zona[id];
            arrayValidacionV1[14] = 'nombreZona';
            arrayValidacionV1[15] = $scope.nombreZona[id];
            arrayValidacionV1[16] = 'referencia';
            arrayValidacionV1[17] = $scope.referencia[id];




            var requestGrabarDireccion = {
                idDireccion: $scope.allProductoServicios[id].idDireccion,
                tipoVia: $scope.tipoVia[id].id,
                nombreDireccion: $scope.nombreDireccion[id],
                numero: $scope.numero[id],
                manzana: $scope.manzana[id],
                lote: $scope.lote[id],
                tipoVivienda: $scope.tipoVivienda[id].id,
                numeroDepartamento: $scope.numeroDepartamento[id],
                tipoUrbanizacion: $scope.tipoUrbanizacion[id].id,
                nombreUrbanizacion: $scope.nombreUrbanizacion[id],
                zona: $scope.zona[id],
                nombreZona: $scope.nombreZona[id],
                departamento: $scope.departamento[id].codest,
                provincia: $scope.provincia[id].codpvc,
                distrito: $scope.distrito[id].coddst,
                referencia: $scope.referencia[id]
            };

            $timeout(function() {
                if (validacion(arrayValidacion, id)) {

                    if (validacionDireccion(arrayValidacionV1, id)) {

                        grabarDireccion(requestGrabarDireccion, id);
                    } else {
                        $scope.classMsgError[id] = 'msgerror';
                        $scope.msgError[id] = 'ingresa correctamente los campos señalados en rojo';
                    }
                } else {
                    $scope.classMsgError[id] = 'msgerror';
                    $scope.msgError[id] = 'Ingresa todos los campos obligatorios';
                }
            }, 200);
        }

        function grabarDireccion(direccionRequest, id) {

            direccionRequest = $httpParamSerializer({ requestJson: angular.toJson(direccionRequest) });
            TuCuentaService.grabarDireccion(direccionRequest).then(function(response) {
                if (parseInt(response.data.grabarDireccionResponse.defaultServiceResponse.idRespuesta) == 0) {
                    $scope.funcional = true;
                    var textDireccionUrbanizacion = $scope.tipoVia[id].etiqueta + " " + $scope.nombreDireccion[id] + " " + $scope.numero[id];
                    if ($scope.manzana[id] != '') {
                        textDireccionUrbanizacion = textDireccionUrbanizacion + " Mz " + $scope.manzana[id];
                    }
                    if ($scope.lote[id] != '') {
                        textDireccionUrbanizacion = textDireccionUrbanizacion + " Lt " + $scope.lote[id];
                    }
                    if ($scope.tipoVivienda[id].etiqueta != undefined) {
                        textDireccionUrbanizacion = textDireccionUrbanizacion + " " + $scope.tipoVivienda[id].etiqueta;
                    }
                    if ($scope.numeroDepartamento[id] != '') {
                        textDireccionUrbanizacion = textDireccionUrbanizacion + " " + $scope.numeroDepartamento[id];
                    }

                    var UrbanizaciónFacturacion = $scope.tipoUrbanizacion[id].etiqueta + " " + $scope.nombreUrbanizacion[id] + "" + $scope.zona[id] + $scope.nombreZona[id];
                    if ($scope.UrbanizaciónFacturacion != undefined) {
                        if ($.trim(UrbanizaciónFacturacion) != '') {
                            textDireccionUrbanizacion = textDireccionUrbanizacion + " " + UrbanizaciónFacturacion + ", " + $scope.referencia[id];
                        }
                    } else {
                        if ($scope.referencia[id] != '' && $scope.textDireccionUrbanizacion == undefined) {
                            textDireccionUrbanizacion = $scope.referencia[id];
                        } else if ($scope.referencia[id] != '' && $scope.textDireccionUrbanizacion != undefined) {
                            textDireccionUrbanizacion = textDireccionUrbanizacion + ", " + $scope.referencia[id];
                        }
                    }

                    var DireccionFinal = textDireccionUrbanizacion + " " + $scope.departamento[id].etiqueta + "/" + $scope.provincia[id].etiqueta + "/" + $scope.distrito[id].etiqueta;
                    $timeout(function() {
                        $scope.estadorowd[parseInt(id)] = false;
                        $scope.estilos[ocultarRowd] = 'row';
                        limpiarfomulario(id);
                        $scope.classMsgError[parseInt(id)] = '';
                        $scope.msgError[parseInt(id)] = '';
                        $scope.allProductoServicios[id].direccion = DireccionFinal;
                        $scope.allProductoServicios[parseInt(id)].tipoDireccion = 'Facturación';
                        var ResquestAuditoria = {
                            operationCode: WPSTablaOperaciones.editarDireccion,
                            pagina: WPSPageID.cuentasclaro_tucuenta,
                            transactionId: response.data.grabarDireccionResponse.defaultServiceResponse.idTransaccional,
                            estado: 'SUCCESS',
                            servicio: $scope.allProductoServicios[parseInt(id)].nombre,
                            tipoProducto: '-',
                            tipoLinea: '5',
                            tipoUsuario: $scope.tipoCliente,
                            perfil: '-',
                            monto: '',
                            descripcionoperacion: '-',
                            responseType: '/'
                        };

                        auditoria(ResquestAuditoria);
                        location.reload();
                    }, 200);
                } else {
                    $scope.funcional = false;
                    $scope.estadorowd[parseInt(id)] = false;
                    $scope.estilos[ocultarRowd] = 'row';
                    limpiarfomulario(id);
                    $scope.classMsgError[parseInt(id)] = '';
                    $scope.msgError[parseInt(id)] = '';
                    var ResquestAuditoria = {
                        operationCode: WPSTablaOperaciones.editarDireccion,
                        pagina: WPSPageID.cuentasclaro_tucuenta,
                        transactionId: response.data.grabarDireccionResponse.defaultServiceResponse.idTransaccional,
                        estado: 'ERROR',
                        servicio: $scope.allProductoServicios[parseInt(id)].nombre,
                        tipoProducto: '-',
                        tipoLinea: '5',
                        tipoUsuario: $scope.tipoCliente,
                        perfil: '-',
                        monto: '',
                        descripcionoperacion: "grabarDireccion - " + response.data.grabarDireccionResponse.defaultServiceResponse.mensaje,
                        responseType: '/'
                    };

                    auditoria(ResquestAuditoria);

                }

            }, function(response) {
                $scope.status = 'Unable to load customer data: ' + error.message;
            });

        }

        function actualizarAfiliacionFacturacionElectronica(direccion, id) {
            direccion = $httpParamSerializer({ requestJson: angular.toJson(direccion) });
            TuCuentaService.actualizarAfiliacionFacturacionElectronica(direccion).then(function(response) {
                if (parseInt(response.data.actualizarAfiliacionFacturacionElectronicaResponse.defaultServiceResponse.idRespuesta) == 0) {
                    $scope.funcional = true;
                    $scope.estadorowd[id] = false;
                    $scope.estilos[ocultarRowd] = 'row';
                    $scope.classMsgError[id] = '';
                    $scope.msgError[id] = '';
                    $scope.allProductoServicios[id].direccion = $scope.electronica[id];
                    $scope.allProductoServicios[id].tipoDireccion = 'Recibo por e-mail';
                    var ResquestAuditoria = {
                        operationCode: WPSTablaOperaciones.editarDireccion,
                        pagina: WPSPageID.cuentasclaro_tucuenta,
                        transactionId: response.data.actualizarAfiliacionFacturacionElectronicaResponse.defaultServiceResponse.idTransaccional,
                        estado: 'SUCCESS',
                        servicio: $scope.allProductoServicios[parseInt(id)].nombre,
                        tipoProducto: '-',
                        tipoLinea: '5',
                        tipoUsuario: $scope.tipoCliente,
                        perfil: '-',
                        monto: '',
                        descripcionoperacion: '-',
                        responseType: '/'
                    };

                    auditoria(ResquestAuditoria);
                    location.reload();

                } else {
                    $scope.funcional = false;
                    $scope.estadorowd[id] = false;
                    $scope.estilos[ocultarRowd] = 'row';
                    limpiarfomulario(id);
                    var ResquestAuditoria = {
                        operationCode: WPSTablaOperaciones.editarDireccion,
                        pagina: WPSPageID.cuentasclaro_tucuenta,
                        transactionId: response.data.actualizarAfiliacionFacturacionElectronicaResponse.defaultServiceResponse.idTransaccional,
                        estado: 'ERROR',
                        servicio: $scope.allProductoServicios[parseInt(id)].nombre,
                        tipoProducto: '-',
                        tipoLinea: '5',
                        tipoUsuario: $scope.tipoCliente,
                        perfil: '-',
                        monto: '',
                        descripcionoperacion: "actualizarAfiliacionFacturacionElectronica - " + response.data.actualizarAfiliacionFacturacionElectronicaResponse.defaultServiceResponse.mensaje,
                        responseType: '/'
                    };

                    auditoria(ResquestAuditoria);
                }
            }, function(response) {
                $scope.status = 'Unable to load customer data: ' + error.message;


            });

        }


        $scope.buscarDireccion = function() {
            var valorinput = $('#Autocomplete').val();
            if (valorinput.length > 0) {
                $("#frBuscar .search").removeClass("error");
                limpiar();
                $scope.estadoBusqueda = 1;
                var ResquestObtenerDirecciones = {
                    direccionCompleta: valorinput,
                    idDireccion: '',
                    pagina: '1',
                    cantResultadosPagina: '10'
                };
                obtenerDireccion(ResquestObtenerDirecciones);
                $scope.estadoBusqueda = 1;
            } else {
                $("#frBuscar .search").addClass("error");
            }
        }


        function modificaTelefono(telefono, primeravez) {
            var requestModificarDatosUsuario = {
                telefonoContacto: telefono,
                flagEntroPorPrimeraVez: primeravez

            };
            requestModificarDatosUsuario = $httpParamSerializer({ requestJson: angular.toJson(requestModificarDatosUsuario) });
            TuCuentaService.modificaDatosUsuarioTelefono(requestModificarDatosUsuario).then(function(response) {
                $scope.modificaDatosUsuario = response.data.modificarDatosUsuarioResponse;
                if (parseInt($scope.modificaDatosUsuario.defaultServiceResponse.idRespuesta) == 0) {
                    $scope.phone = telefono;
                    var ResquestAuditoria = {
                        operationCode: WPSTablaOperaciones.editarTelefonoContacto,
                        pagina: WPSPageID.cuentasclaro_tucuenta,
                        transactionId: response.data.modificarDatosUsuarioResponse.defaultServiceResponse.idTransaccional,
                        estado: 'SUCCESS',
                        servicio: '-',
                        tipoProducto: '-',
                        tipoLinea: '5',
                        tipoUsuario: $scope.tipoCliente,
                        perfil: '-',
                        monto: '',
                        descripcionoperacion: '-',
                        responseType: '/'
                    };
                    auditoria(ResquestAuditoria);
                } else {
                    $scope.phone = $scope.reestablecer;
                    var ResquestAuditoria = {
                        operationCode: WPSTablaOperaciones.editarTelefonoContacto,
                        pagina: WPSPageID.cuentasclaro_tucuenta,
                        transactionId: response.data.modificarDatosUsuarioResponse.defaultServiceResponse.idTransaccional,
                        estado: 'ERROR',
                        servicio: '-',
                        tipoProducto: '-',
                        tipoLinea: '5',
                        tipoUsuario: $scope.tipoCliente,
                        perfil: '-',
                        monto: '',
                        descripcionoperacion: "modificarDatosUsuario - " + response.data.modificarDatosUsuarioResponse.defaultServiceResponse.mensaje,
                        responseType: '/'
                    };
                    auditoria(ResquestAuditoria);
                }
                $('#idPhone').removeClass('disabled');
                console.log()
               
            }, function(response) {


            });
        }


        function validacion(arrayValidacion, id) {
            var bool = true;
            var email = true;
            var required = true;
            var tipoVia = true;
            var nombreDireccion = true;
            var numero = true;
            var departamento = true;
            var provincia = true;
            var distrito = true;
            var referencia = true;
            var tipoUrbanizacion = true;
            var nombreUrbanizacion = true;
            for (var i = 0; i < arrayValidacion.length; i++) {
                switch (arrayValidacion[i]) {
                    case 'email':
                        email = validEmail(arrayValidacion[i + 1]);
                        if (email) {
                            $scope.classCorreo[id] = 'input';
                        } else {
                            $scope.classCorreo[id] = 'input error';
                        }
                        break;
                    case 'required':

                        required = validRequired(arrayValidacion[i + 1]);
                        if (required) {
                            $scope.checkClassTermino[id] = 'check checked';
                        } else {
                            $scope.checkClassTermino[id] = 'check error';
                        }
                        break;

                    case 'tipoVia':
                        tipoVia = obligatorioSeleccionar(arrayValidacion[i + 1]);
                        if (tipoVia) {
                            $scope.classtipoVia[id] = 'pull';
                        } else {
                            $scope.classtipoVia[id] = 'pull disabled error';
                        }

                        break;

                    case 'departamento':
                        departamento = obligatorioSeleccionar(arrayValidacion[i + 1]);

                        if (departamento) {
                            $scope.classDepartamento[id] = 'pull';
                        } else {
                            $scope.classDepartamento[id] = 'pull disabled error';
                        }

                        break;

                    case 'provincia':
                        provincia = obligatorioSeleccionar(arrayValidacion[i + 1]);
                        if (provincia) {
                            $scope.classProvincia[id] = 'pull';
                        } else {
                            $scope.classProvincia[id] = 'pull disabled error';
                        }

                        break;

                    case 'distrito':
                        distrito = obligatorioSeleccionar(arrayValidacion[i + 1]);
                        if (distrito) {
                            $scope.classDistrito[id] = 'pull';
                        } else {
                            $scope.classDistrito[id] = 'pull disabled error';
                        }

                        break;

                    case 'nombreDireccion':
                        nombreDireccion = obligatorio(arrayValidacion[i + 1]);
                        if (nombreDireccion) {
                            $scope.classnombreDireccion[id] = 'input';
                        } else {

                            $scope.classnombreDireccion[id] = 'input error';
                        }
                        break;

                    case 'tipoUrbanizacion':
                        tipoUrbanizacion = obligatorioSeleccionar(arrayValidacion[i + 1]);
                        if (tipoUrbanizacion) {
                            $scope.classTipoUrbanizacion[id] = 'pull';
                        } else {

                            $scope.classTipoUrbanizacion[id] = 'pull disabled error';
                        }
                        break;

                    case 'nombreUrbanizacion':
                        nombreUrbanizacion = obligatorio(arrayValidacion[i + 1]);
                        if (nombreUrbanizacion) {
                            $scope.classNUrbanizacion[id] = 'input';
                        } else {
                            $scope.classNUrbanizacion[id] = 'input error';
                        }
                        break;

                    case 'numero':
                        numero = obligatorio(arrayValidacion[i + 1]);
                        if (numero) {
                            $scope.classnumero[id] = 'input';
                        } else {
                            $scope.classnumero[id] = 'input error';
                        }
                        break;

                    case 'referencia':
                        referencia = obligatorio(arrayValidacion[i + 1]);
                        if (referencia) {
                            $scope.classReferencia[id] = 'input';
                        } else {
                            $scope.classReferencia[id] = 'input error';
                        }
                        break;

                }
            }
            bool = (email && required && tipoVia && nombreDireccion && numero && departamento && provincia && distrito && referencia && tipoUrbanizacion && nombreUrbanizacion);
            return bool;
        }

        function validacionDireccion(arrayValidacion, id) {
            var bool = true;
            var nombreDireccion = true;
            var numero = true;
            var manzana = true;
            var lote = true;
            var numeroDepartamento = true;
            var nombreUrbanizacion = true;
            var zona = true;
            var nombreZona = true;
            var referencia = true;

            for (var i = 0; i < arrayValidacion.length; i++) {
                switch (arrayValidacion[i]) {
                    case 'nombreDireccion':
                        nombreDireccion = validarCampo(arrayValidacion[i + 1]);

                        if (nombreDireccion) {
                            $scope.classnombreDireccion[id] = 'input';
                        } else {
                            $scope.classnombreDireccion[id] = 'input error';
                        }
                        break;
                    case 'numero':
                        numero = validarCampo(arrayValidacion[i + 1]);
                        if (numero) {
                            $scope.classnumero[id] = 'input';
                        } else {
                            $scope.classnumero[id] = 'input error';
                        }
                        break;

                    case 'manzana':
                        manzana = validarCampo(arrayValidacion[i + 1]);
                        if (manzana) {
                            $scope.classManzana[id] = 'input';
                        } else {
                            $scope.classManzana[id] = 'input error';
                        }
                        break;

                    case 'lote':
                        lote = validarCampo(arrayValidacion[i + 1]);
                        if (lote) {
                            $scope.classLote[id] = 'input';
                        } else {
                            $scope.classLote[id] = 'input error';
                        }
                        break;
                    case 'numeroDepartamento':
                        numeroDepartamento = validarCampo(arrayValidacion[i + 1]);
                        if (numeroDepartamento) {
                            $scope.classNDepartamento[id] = 'input';
                        } else {
                            $scope.classNDepartamento[id] = 'input error';
                        }
                        break;

                    case 'nombreUrbanizacion':
                        nombreUrbanizacion = validarCampo(arrayValidacion[i + 1]);
                        if (nombreUrbanizacion) {
                            $scope.classNUrbanizacion[id] = 'input';
                        } else {
                            $scope.classNUrbanizacion[id] = 'input error';
                        }
                        break;

                    case 'zona':
                        zona = validIntCuenta(arrayValidacion[i + 1]);
                        if (zona) {
                            $scope.classZona[id] = 'input';
                        } else {
                            $scope.classZona[id] = 'input error';
                        }
                        break;

                    case 'nombreZona':
                        nombreZona = validarCampo(arrayValidacion[i + 1]);
                        if (nombreZona) {
                            $scope.classNombreZona[id] = 'input';
                        } else {
                            $scope.classNombreZona[id] = 'input error';
                        }
                        break;

                    case 'referencia':
                        referencia = validarCampo(arrayValidacion[i + 1]);
                        if (referencia) {
                            $scope.classReferencia[id] = 'input';
                        } else {
                            $scope.classReferencia[id] = 'input error';
                        }
                        break;

                }
            }
            bool = (nombreDireccion && numero && manzana && lote && numeroDepartamento && nombreUrbanizacion && zona && nombreZona && referencia);
            return bool;
        }

        var paginaS = 1;
        $scope.paginacion = function() {
            paginaS = paginaS + 1;
            if (paginaS <= $scope.totalPagina) {
                var inicio = $scope.allProductoServicios.length;
                $("#loaderAllProductoServicios").show();
                var ResquestObtenerDirecciones = {
                    direccionCompleta: '',
                    idDireccion: '',
                    pagina: paginaS,
                    cantResultadosPagina: '10'

                };
                $scope.listadoProductoServicios = null;
                resquestObtenerDirecciones = $.param({ requestJson: angular.toJson(ResquestObtenerDirecciones) });
                TuCuentaService.obtenerDirecciones(resquestObtenerDirecciones).then(function(response) {
                    if (parseInt(response.data.obtenerDireccionesResponse.defaultServiceResponse.idRespuesta) == 0) {
                        if (response.data.obtenerDireccionesResponse.listadoProductosServicios == undefined) {
                            $("#loaderAllProductoServicios").hide();
                        } else {
                            $(".errorAllProductoServiciosMas").hide();
                            $scope.listadoProductoServicios = response.data;
                            arregloListar(inicio);
                            ListaProducto(inicio);
                            if (paginaS == $scope.totalPagina) {
                                $scope.hidePagina = false;
                            }
                        }
                    } else {
                        $(".errorAllProductoServiciosMas").show();
                        paginaS = paginaS - 1;
                    }

                    $("#loaderAllProductoServicios").hide();
                }, function(response) {
                    $(".errorAllProductoServiciosMas").show();
                    $("#loaderAllProductoServicios").hide();
                });
            } else {
                $scope.hidePagina = false;
                $("#loaderAllProductoServicios").hide();
            }
        }

        $scope.checkAfiliado = function(id) {
            $scope.estiloafiliado[id] = '';
            if ($scope.allProductoServicios[parseInt(id)].afiliado) {
                $scope.correo[id] = false;
                $scope.direccion[id] = true;
                $scope.allProductoServicios[parseInt(id)].afiliado = true;
                $scope.estiloafiliado[id] = 'check checked';
            } else {
                $scope.correo[id] = true;
                $scope.direccion[id] = false;
                $scope.allProductoServicios[parseInt(id)].afiliado = false;
                $scope.estiloafiliado[id] = 'check';
            }
        }

        $scope.cerrarPopup = function() {
            $scope.estadoPopup = true;
        }

        $scope.cambiaFoto = function(image) {
            var estado = document.getElementById('btnChangeSave').text;
            if (estado == 'Guardar') {
                if (ValidateFileUpload()) {
                    $("#loaderFoto").show();
                    var imagen = image.dataURL;
                    var request = $httpParamSerializer({ imgBase64: imagen });
                    TuCuentaService.modificaDatosUsuarioFoto(request).then(function(response) {
                        if (response.data.comunResponseType.respuesta == 'true') {
                            $('.perfil-foto').attr("src", image.dataURL);
                            $("#btnChangeSave").html("Cambia tu foto");
                            $scope.estadoFoto = -1;
                            $("#loaderFoto").hide();
                            var ResquestAuditoria = {
                                operationCode: WPSTablaOperaciones.editarFoto,
                                pagina: WPSPageID.cuentasclaro_tucuenta,
                                transactionId: response.data.comunResponseType.defaultServiceResponse.idTransaccional,
                                estado: 'SUCCESS',
                                servicio: '-',
                                tipoProducto: '-',
                                tipoLinea: '5',
                                tipoUsuario: $scope.tipoCliente,
                                perfil: '-',
                                monto: '',
                                descripcionoperacion: '-',
                                responseType: '/'
                            };
                            auditoria(ResquestAuditoria);
                        } else {
                            $("#imgPhoto").attr("src", $scope.mgREST.replace("\/", "/"));
                            var ResquestAuditoria = {
                                operationCode: WPSTablaOperaciones.editarFoto,
                                pagina: WPSPageID.cuentasclaro_tucuenta,
                                transactionId: response.data.comunResponseType.defaultServiceResponse.idTransaccional,
                                estado: 'ERROR',
                                servicio: '-',
                                tipoProducto: '-',
                                tipoLinea: '5',
                                tipoUsuario: $scope.tipoCliente,
                                perfil: '-',
                                monto: '',
                                descripcionoperacion: 'Editar Foto -' + response.data.comunResponseType.defaultServiceResponse.mensaje,
                                responseType: '/'
                            };
                            auditoria(ResquestAuditoria);
                            $("#loaderFoto").hide();
                        }

                    }, function(error) {
                        $("#loaderFoto").hide();
                    });

                }
            } else {
                $("#btnUpload").click();
            }
        }

        $('#btnUpload').bind("change", function() {
            var file = this.files[0];
            if (file) {
                $("#btnChangeSave").removeClass('TuCuentafoto');
                $("#btnChangeSave").addClass('TuCuentafoto1');
                $("#btnChangeSave").html("Guardar");
                $scope.estadoFoto = 1;
            } else {
                $("#btnChangeSave").addClass('TuCuentafoto');
                $("#btnChangeSave").removeClass('TuCuentafoto1');
                $("#btnChangeSave").html("Cambia tu foto");
            }
        });

        function ValidateFileUpload() {
            var fuData = document.getElementById('btnUpload');
            var FileUploadPath = fuData.value;
            var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
            if (Extension == "png" || Extension == "bmp" || Extension == "jpeg" || Extension == "jpg") {
                if (fuData.files && fuData.files[0]) {
                    var size = fuData.files[0].size;
                    if (size <= 1000000) {
                        return true;
                    } else {
                        alert("El tamaño del archivo no es válido, el tamaño permitido es (hasta 1 MB).");
                    }
                }
            } else {
                alert("El formato del archivo no es válido, solo son válidos los archivos con extensión: jpg,png,bmp.");
            }
            fuData.value = "";
            return false;
        };

        $scope.idTermino = -1;
        $scope.popterminos = function(id) {
            $scope.idTermino = id;
            $scope.servicioTer = $scope.allProductoServicios[parseInt(id)].nombre;
            var datos = {
                tipoLinea: WPSTipoLinea.todos,
                tipoCliente: $scope.tipoCliente,
                tipoPermiso: WPSTipoPermiso.todos,
                idCuenta: '',
                idRecibo: '',
                criterioBusqueda: $scope.allProductoServicios[parseInt(id)].nombre,
                pagina: WPSpaginacion.pagina,
                cantResultadosPagina: '1',
                titularidadServicio: WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado
            };
            requestObtenerServicios = $httpParamSerializer({ requestJson: angular.toJson(datos) });
            TuCuentaService.obtenerListadoMoviles(requestObtenerServicios).then(function(response) {
                var id_respuesta = response.data.obtenerListadoMovilesResponse.defaultServiceResponse.idRespuesta;
                if (id_respuesta == 0) {
                    $scope.codclienteTer = response.data.obtenerListadoMovilesResponse.listadoProductosServicios.idCuenta;
                } else {
                    $scope.codclienteTer = $scope.allProductoServicios[parseInt(id)].idDireccion;
                }
                TuCuentaService.terminoCondiciones($scope.nomyapeTer, $scope.nombreDocumento, $scope.numdocTer, $scope.codclienteTer, $scope.servicioTer, $scope.correoTer, $scope.modalidad).then(function(response) {
                    $timeout(function() {
                        $('#terminosCondiciones').html("");
                        $("#terminosCondiciones").append(response.data);
                    }, 200);
                }, function(error) {

                });

            }, function() {

            });
            $timeout(function() {
                showPopUpFromFile("../view/pop.terminos-condiciones.html");
            }, 200);

        };



        $scope.listarProvincia = [];
        $scope.changeDepartamento = function(id) {

            if ($scope.departamento[id] == null) {
                $scope.SeleccionarDepartamento = 'Seleccionar';
                $scope.departamento[id] = '';
            } else {
                $scope.SeleccionarDepartamento = '';
                $scope.SeleccionarProvincia = 'Seleccionar';
                $scope.SeleccionarDistrito = 'Seleccionar';
                if ($scope.provincia.length > 0) {
                    $scope.provincia = [];
                    $scope.distrito = [];
                }

                var codest = $scope.departamento[parseInt(id)].codest;
                var cantidad = $scope.allprovincias.length;
                if ($scope.listarProvincia.length > 0) {
                    $scope.listarProvincia = [];
                }
                for (var i = 0; i < cantidad; i++) {
                    if ($scope.allprovincias[parseInt(i)].codest == codest) {
                        var roleList = {
                            "codest": $scope.allprovincias[parseInt(i)].codest,
                            "etiqueta": $scope.allprovincias[parseInt(i)].etiqueta,
                            "codpvc": $scope.allprovincias[parseInt(i)].codpvc

                        };
                        $scope.listarProvincia.push(roleList);
                    }
                }
            }
        };


        $scope.listarDistrito = [];
        $scope.changeProvincia = function(id) {

            if ($scope.provincia[id] == null) {
                $scope.SeleccionarProvincia = 'Seleccionar';
                $scope.provincia[id] = '';
            } else {
                var codest = $scope.provincia[parseInt(id)].codest;
                var codpvc = $scope.provincia[parseInt(id)].codpvc;
                var cantidad = $scope.allDistristo.length;
                $scope.SeleccionarProvincia = '';
                $scope.SeleccionarDistrito = 'Seleccionar';
                if ($scope.listarDistrito.length > 0) {
                    $scope.listarDistrito = [];
                    $scope.distrito = [];
                }

                for (var i = 0; i < cantidad; i++) {
                    if ($scope.allDistristo[parseInt(i)].codest == codest && $scope.allDistristo[parseInt(i)].codpvc == codpvc) {
                        var roleList = {
                            "codest": $scope.allDistristo[parseInt(i)].codest,
                            "etiqueta": $scope.allDistristo[parseInt(i)].etiqueta,
                            "codpvc": $scope.allDistristo[parseInt(i)].codpvc,
                            "coddst": $scope.allDistristo[parseInt(i)].coddst
                        };
                        $scope.listarDistrito.push(roleList);
                    }
                }
            }
        };

        $scope.validarNumero = function(e) {
            if (e.keyCode == 0) {
                if (e.which == 39 || e.which == 97 || e.which == 98 || e.which == 110 || e.which == 99 || e.which == 46) {
                    e.preventDefault();
                }
                if ($.inArray(e.which, [46, 8, 9, 27, 13, 190]) !== -1 ||
                    (e.which == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                    (e.which >= 35 && e.which <= 40)) {
                    return;
                }
                if ((e.shiftKey || (e.which < 48 || e.which > 57)) && (e.which < 96 || e.which >= 100)) {
                    e.preventDefault();
                }

            } else {
                if (e.which == 110 || e.which == 105 || e.which == 104 || e.which == 103 || e.which == 102 || e.which == 101 || e.which == 100 || e.which == 99 || e.which == 98 || e.which == 97 || e.which == 39 || e.which == 46) {
                    e.preventDefault();
                }
                if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                    (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
                    (e.keyCode >= 35 && e.keyCode <= 40)) {
                    return;
                }
                if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                    e.preventDefault();
                }
            }

        }

        function limpiarfomulario(id) {
            $scope.electronica[parseInt(id)] = '';
            $scope.classCorreo[parseInt(id)] = 'input';
            $scope.checkClassTermino[parseInt(id)] = 'check';
            $scope.msgError[parseInt(id)] = '';
            $scope.classMsgError[parseInt(id)] = '';
            $scope.tipoVia[parseInt(id)] = '';
            $scope.nombreDireccion[parseInt(id)] = '';
            $scope.numero[parseInt(id)] = '';
            $scope.manzana[parseInt(id)] = '';
            $scope.lote[parseInt(id)] = '';
            $scope.tipoVivienda[parseInt(id)] = '';
            $scope.numeroDepartamento[parseInt(id)] = '';
            $scope.tipoUrbanizacion[parseInt(id)] = '';
            $scope.nombreUrbanizacion[parseInt(id)] = '';
            $scope.zona[parseInt(id)] = '';
            $scope.nombreZona[parseInt(id)] = '';
            $scope.departamento[parseInt(id)] = '';
            $scope.provincia[parseInt(id)] = '';
            $scope.distrito[parseInt(id)] = '';
            $scope.referencia[parseInt(id)] = '';
            $scope.classtipoVia[parseInt(id)] = 'pull';
            $scope.classDepartamento[parseInt(id)] = 'pull';
            $scope.classTipoUrbanizacion[parseInt(id)] = 'pull';
            $scope.classTipoVivienda[parseInt(id)] = 'pull';
            $scope.classProvincia[parseInt(id)] = 'pull';
            $scope.classDistrito[parseInt(id)] = 'pull';
            $scope.classnombreDireccion[parseInt(id)] = 'input';
            $scope.classnumero[parseInt(id)] = 'input';
            $scope.SeleccionarVia = "Seleccionar";

        }

        $("#regresaClaro").click(function() {

            $.removeCookie('CuentasClaroWPSRetornar', { path: '/' });
            var href = '/wps/myportal/cuentasclaro/root/consumer';
            $(location).attr('href', href);

        });

        function obtenerIdUrl(arr, obj) {
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].idLink == obj) {
                    return i;
                }
            }
        }

        var $popup = $('.popup');

        function showPopUpFromFile($file) {
            $h = $(window).height();
            var $pop = $(".popup .pop");
            var $cnt = $popup.find('.content');
            $pop.css({ 'margin-top': Math.round(($h - 300) / 2) });
            $popup.fadeIn(350);
        }

        $('.popup .btclose, .popup .bg').click(function() {
            $scope.idTermino = -1;
            hidePopUp();
        });

        $('#bterminosaceptar').click(function(e) {

            $timeout(function() {
                $scope.checkClassTermino[parseInt($scope.idTermino)] = 'check checked';
                $scope.checkTermino[parseInt($scope.idTermino)] = true;
            }, 200);
            e.preventDefault();
            hidePopUp();
        });

        function hidePopUp() {
            $popup.fadeOut(250);
        }



    })

}]);
var appController = angular.module('miClaroController', []);

appController.controller("mycontroller", function($scope, $http, $httpParamSerializer, $timeout, $localStorage, $location, managerservice) {
    $http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
    angular.element(document).ready(function() {

        $("#resultCambiarTopeSimple").show();
        $("#resultCambiarTopeMasivo").hide();
        $("#msgErroSimple").hide();
        $("#sinTopeConsumo").hide();
        $scope.listaAutocomplete = [];
        $scope.listaObtenerBolsasMinutos = [];
        $scope.selectBolsa = '';
        $scope.detalleConsumoBolsaMinutos = '';
        $scope.id;
        $scope.nuevoTopeConsumo = '';
        $scope.movil = '';
        $scope.listaCuenta = [];
        $scope.listaRecibo = [];
        $scope.file;
        $localStorage.file = '';
        $localStorage.nuevoTopeConsumo = '';
        var titularidadServicio = 7;
        var tipoClienteCorporativo = WPSTipoCliente.corporativo;
        var tipoPermisoAll = WPSTipoPermiso.todos;
        $localStorage.tipoAjusto = '1';
        $localStorage.tipoAjustoDescr = 'Permanente';
        $("#switch_web").remove();
        $scope.upps = WPSMensajeError.upps;
        $scope.mensaje1 = WPSMensajeError.mensaje1;
        $scope.mensaje3 = WPSMensajeError.mensaje3;
        $scope.mensaje5 = WPSMensajeError.mensaje5;
        $scope.flagSinConsumos = false;
        $scope.flagSinConsumosMasivo = false;
        $scope.topeConsumo_error = WPSTCambiarTopeConsumo.EXCEPCION3;

        angular.element(document).ready(function() {

            var formRec = $('#frCambiarTopeMasivo');
            formRec.find("#inuevotope").keyup(function() {
                this.value = this.value.replace(/[^0-9]/, '');
            });

            $scope.tipoLinea == WPSTipoLinea.todos
            $scope.init();

        });

        $scope.init = function() {
            $("#msgErroSimple").hide();
            $localStorage.nuevoTopeConsumo = '';
            $scope.nuevoTopeConsumo = '';

            managerservice.getObtenerDatosSesion().then(function(response) {

                $scope.datosSesionFlag = response.data.comunResponseType.defaultServiceResponse;
                if ($scope.datosSesionFlag.idRespuesta == 0) {
                    $scope.tipoClienteSession = response.data.comunResponseType.tipoCliente;
                    $scope.tipoLineaSession = response.data.comunResponseType.tipoLinea;
                    $scope.numeroTelFijo = response.data.comunResponseType.telefono;
                    $scope.emailUsuario = response.data.comunResponseType.usuarioVinculado;
                    $scope.categoria = response.data.comunResponseType.categoria;
                    $scope.productoPrincipal = response.data.comunResponseType.productoPrincipal;
                    if ($scope.tipoClienteSession == WPSTipoCliente.corporativo) {
                        $scope.mensaje3 = WPSMensajeError.mensaje4;
                        tipoLinea = '2';
                    } else {
                        $scope.mensaje3 = WPSMensajeError.mensaje3;
                        tipoLinea = '1';
                    }
                    obtenerServicioPrincipal();
                } else {
                    allSuccess = false;
                }
            });
        }

        function obtenerServicioPrincipal() {
            managerservice.obtenerServicioPrincipal().then(function(response) {
                var rpta = parseInt(response.data.comunResponseType.defaultServiceResponse.idRespuesta);
                var idTransaccion = response.data.comunResponseType.defaultServiceResponse.idTransaccional;
                if (rpta == 0) {
                    $scope.idCuentaPrincipal = response.data.comunResponseType.idCuenta;
                    $scope.idReciboPrincipal = response.data.comunResponseType.idRecibo;
                    $scope.idProductoPrincipal = response.data.comunResponseType.productoPrincipal;
                }
            }, function(response) {

            });
        };

        $scope.buscarAutoComplete = function() {
            var valorinput = $('#Autocomplete').val();
            $scope.flagServiciosMovil = 0;
            $scope.nuevoTopeConsumo = '';
            $("#msgErroSimple").hide();
            $("#sinTopeConsumo").hide();
            $scope.inuevotope;
            if (valorinput.length < 0) {
                $("#Autocomplete .search").removeClass("error");
            } else {
                var datos = {
                    categoria: WPSCategoria.movil,
                    tipoLinea: WPSTipoLinea.todos,
                    tipoCliente: WPSTipoCliente.corporativo,
                    idProductoServicio: '',
                    tipoPermiso: "5",
                    idCuenta: '',
                    idRecibo: '',
                    idDireccion: "",
                    nombreProducto: valorinput,
                    pagina: "1",
                    cantResultadosPagina: "1",
                    productoPrincipalXidRecibo: "false",
                    titularidadServicio: WPSTitularidadServicio.serviciosTitularesAfiliadosEmpleado
                };
                requestObtenerServicios = $httpParamSerializer({ requestJson: angular.toJson(datos), tipoConsulta: '' });
                managerservice.obtenerServicios(requestObtenerServicios).then(function(response) {

                    if (parseInt(response.data.obtenerServiciosResponse.defaultServiceResponse.idRespuesta) == 0) {
                        if (response.data.obtenerServiciosResponse.listadoProductosServicios == undefined || response.data.obtenerServiciosResponse.listadoProductosServicios == '') {

                        } else {
                            $scope.listadoProductosServicios = response.data.obtenerServiciosResponse.listadoProductosServicios;
                            if (!Array.isArray($scope.listadoProductosServicios)) {
                                $scope.listadoProductosServicios = [];
                                $scope.listadoProductosServicios.push(response.data.obtenerServiciosResponse.listadoProductosServicios);
                            }
                            var roleList = {
                                "nombre": $scope.listadoProductosServicios[0].ProductoServicioResponse.nombre,
                                "idCuenta": $scope.listadoProductosServicios[0].ProductoServicioResponse.idCuenta,
                                "idRecibo": $scope.listadoProductosServicios[0].ProductoServicioResponse.idRecibo,
                                "idProductoServicio": $scope.listadoProductosServicios[0].ProductoServicioResponse.idProductoServicio
                            }
                            $scope.listaAutocomplete.push(roleList);
                            cambioTopeConsumeLinea(0);
                        }
                    }
                }, function(response) {

                });
            }
        }


        $('#Autocomplete').autocomplete({
            lookup: function(query, done) {
                obtenerListadoMoviles(done);
            },
            minChars: 4,
            onSelect: function(suggestion) {
                var texto = suggestion.data;
                $timeout(function() {
                    $scope.id = arrayObjectIndexOfId($scope.listaAutocomplete, texto);
                    $scope.cambioTopeConsume('S');
                    $('.step-change-bolsa').show();
                    cambioTopeConsumeLinea($scope.id);
                }, 200);
            }
        });



        function obtenerListadoMoviles(done) {
            var valorinput = $('#Autocomplete').val();
            var arrayAutocomplete = [];
            var tipoLinea = WPSTipoLinea.todos
            var requestBusqueda = {
                tipoLinea: tipoLinea,
                tipoCliente: tipoClienteCorporativo,
                tipoPermiso: tipoPermisoAll,
                idCuenta: '',
                idRecibo: "",
                criterioBusqueda: valorinput,
                pagina: "1",
                cantResultadosPagina: "10",
                titularidadServicio: titularidadServicio
            };
            requestBusqueda = $httpParamSerializer({ requestJson: angular.toJson(requestBusqueda) });
            var arrayAutocomplete = [];
            managerservice.obtenerListadoMoviles(requestBusqueda).then(function(response) {

                var rptaExito = response.data.obtenerListadoMovilesResponse.defaultServiceResponse.idRespuesta;
                if (rptaExito == 0) {
                    if (response.data.obtenerListadoMovilesResponse.listadoProductosServicios == undefined || response.data.obtenerListadoMovilesResponse.listadoProductosServicios == '') {
                        arrayAutocomplete = [];
                        $('.autocomplete-suggestion').remove();
                        $('.autocomplete-suggestion').empty();
                    } else {
                        $scope.listaAutocomplete = response.data.obtenerListadoMovilesResponse.listadoProductosServicios;
                        if (!Array.isArray($scope.listaAutocomplete)) {
                            $scope.listaAutocomplete = [];
                            $scope.listaAutocomplete.push(response.data.obtenerListadoMovilesResponse.listadoProductosServicios);
                        }

                        angular.forEach($scope.listaAutocomplete, function(val, key) {
                            arrayAutocomplete.push({
                                value: val.nombreAlias,
                                data: val.nombreAlias
                            });
                        });
                        var result = {
                            suggestions: arrayAutocomplete
                        };
                        done(result);
                    }
                }
            }, function(response) {

            });
        };

        function cambioTopeConsumeLinea(id) {
            $("#loaderBolsa").show();
            $scope.movil = $scope.listaAutocomplete[id].nombre;
            $localStorage.idCuenta = $scope.listaAutocomplete[id].idCuenta;
            $localStorage.idRecibo = $scope.listaAutocomplete[id].idRecibo;
            $localStorage.idProductoServicio = $scope.listaAutocomplete[id].idProductoServicio;
            $localStorage.movil = $scope.movil;
            var resquestObtenerBolsasMinutos = {
                idCuenta: $scope.listaAutocomplete[id].idCuenta,
                idRecibo: $scope.listaAutocomplete[id].idRecibo,
                idProductoServicio: $scope.listaAutocomplete[id].idProductoServicio
            };
            $("#idBolsaMinutos").hide();

            bolsa(resquestObtenerBolsasMinutos, 'S');
        }

        function bolsa(resquestObtenerBolsasMinutos, tipo) {
            $("#idBolsaMasivo").hide();
            $("#idBolsaMinutos").hide();
            $("#msgErroSimple").hide();
            $scope.nuevoTopeConsumo = "";
            $("#loaderBolsaMasivo").show();
            resquestObtenerBolsasMinutos = $httpParamSerializer({ requestJson: angular.toJson(resquestObtenerBolsasMinutos) });
            managerservice.obtenerBolsasMinutos(resquestObtenerBolsasMinutos).then(function(response) {
                var rptaExito = response.data.obtenerBolsasMinutosContratadasResponse.defaultServiceResponse.idRespuesta;
                var dataResponse = response.data.obtenerBolsasMinutosContratadasResponse;
                limpiarBolsa();
                if (rptaExito == 0 && dataResponse.listaBolsasMinutos != undefined) {
                    $scope.listaObtenerBolsasMinutos = response.data.obtenerBolsasMinutosContratadasResponse.listaBolsasMinutos;
                    if (!Array.isArray($scope.listaObtenerBolsasMinutos)) {
                        $scope.listaObtenerBolsasMinutos = [];
                        $scope.listaObtenerBolsasMinutos.push(response.data.obtenerBolsasMinutosContratadasResponse.listaBolsasMinutos);
                    }
                    estado = true;
                    angular.forEach($scope.listaObtenerBolsasMinutos, function(val, key) {
                        if (val.nombreBolsa == 'true') {
                            $scope.SeleccionarBolsa = '';
                            $scope.selectBolsa = $scope.listaObtenerBolsasMinutos[key];
                            estado = false;
                        }
                    });
                    if (estado) {
                        $scope.selectBolsa = $scope.listaObtenerBolsasMinutos[0];
                    }
                    if (tipo == 'S') {
                        obtenerDetalleConsumoBolsaMinutos($scope.id, $scope.selectBolsa.idBolsa);

                        $scope.flagServiciosMovil = 0;
                    } else {
                        var str = $scope.selectBolsa.saldoBolsa;
                        var res = str.split(" ");
                        if (res[0].length > 6) {
                            var strSaldo = res[0];
                            var resSaldo = strSaldo.split(",");
                            var resultado = resSaldo[0] + resSaldo[1];
                            $localStorage.saldoBolsa = parseInt(resultado);
                        } else {
                            $localStorage.saldoBolsa = parseInt(res[0]);
                        }
                        $localStorage.idBolsa = $scope.selectBolsa.idBolsa;
                        $scope.flagServiciosMovilMasivo = 0;
                        $("#idBolsaMasivo").show();
                    }
                    $("#loaderBolsa").hide();
                    $("#loaderBolsaMasivo").hide();
                } else {
                    if (tipo == 'S') {
                        $("#idBolsaMinutos").hide();
                        $("#flagSinConsumos").show();
                        $scope.flagSinConsumos = true;

                    } else {
                        $('#idBolsa').hide();
                        $scope.flagSinConsumosMasivo = true;
                        $("#idBolsaMasivo").hide();
                    }
                    $("#loaderBolsa").hide();
                    $("#loaderBolsaMasivo").hide();
                }
            }, function(response) {
                $("#idBolsaMinutos").hide();
                $("#loaderBolsa").hide();
                $("#idBolsaMasivo").hide();
                $("#loaderBolsaMasivo").hide();
                $("#errorListarDireccion").show();
                $("#loaderImagenServicioDirecccion").hide();

            });
        }

        $scope.changeBolsa = function() {
            obtenerDetalleConsumoBolsaMinutos($scope.id, $scope.selectBolsa.idBolsa);

        }

        $scope.changeBolsaM = function() {
            var str = $scope.selectBolsa.saldoBolsa;
            var res = str.split(" ");
            if (res[0].length > 6) {
                var strSaldo = res[0];
                var resSaldo = strSaldo.split(",");
                var resultado = resSaldo[0] + resSaldo[1];
                $localStorage.saldoBolsa = parseInt(resultado);
            } else {
                $localStorage.saldoBolsa = parseInt(res[0]);
            }
            $localStorage.idBolsa = $scope.selectBolsa.idBolsa;
        }

        $scope.resfrezcarSimple = function() {
            $scope.flagServiciosMovil = 0;
            cambioTopeConsumeLinea($scope.id);
        }

        function obtenerDetalleConsumoBolsaMinutos(id, idBolsa) {
            $localStorage.idBolsa = idBolsa;
            $localStorage.saldoBolsa = $scope.selectBolsa.saldoBolsa;

            var resquestObtenerDetalleConsumoBolsaMinutos = {
                idCuenta: $scope.listaAutocomplete[id].idCuenta,
                idRecibo: $scope.listaAutocomplete[id].idRecibo,
                idProductoServicio: $scope.listaAutocomplete[id].idProductoServicio,
                idBolsa: idBolsa
            };
            resquestObtenerDetalleConsumoBolsaMinutos = $httpParamSerializer({ requestJson: angular.toJson(resquestObtenerDetalleConsumoBolsaMinutos) });
            managerservice.obtenerDetalleConsumoBolsaMinutos(resquestObtenerDetalleConsumoBolsaMinutos).then(function(response) {
                var rptaExito = response.data.obtenerDetalleConsumoBolsaContratadaResponse.defaultServiceResponse.idRespuesta;
                if (rptaExito == 0) {

                    if (response.data.obtenerDetalleConsumoBolsaContratadaResponse.defaultServiceResponse.categoria == 3) {
                        $("#idBolsaMinutos").show();
                        $("#detalleConsumoSimple").hide();
                        $("#sinTopeConsumo").show();
                        $scope.detalleConsumoBolsaMinutos = response.data.obtenerDetalleConsumoBolsaContratadaResponse;
                    } else {
                        $("#idBolsaMinutos").show();
                        $("#detalleConsumoSimple").show();
                        $("#sinTopeConsumo").hide();
                        $scope.detalleConsumoBolsaMinutos = response.data.obtenerDetalleConsumoBolsaContratadaResponse;
                    }

                } else {
                    $("#flagServiciosMovil").show();
                    $("#detalleConsumoSimple").hide();
                    $("#sinTopeConsumo").hide();
                    $scope.upps = WPSMensajeError.upps;
                    $scope.mensaje1 = WPSMensajeError.mensaje1;
                    $scope.mensaje2 = WPSMensajeError.mensaje2;

                    $scope.flagServiciosMovil = -1;
                }
            }, function(response) {

            });
        }

        $scope.cambioTopeConsume = function(estado) {
            $scope.flagSinConsumos = false;
            $scope.flagSinConsumosMasivo = false;
            $("#msgErrorformato").hide();
            $("#idBolsaMinutos").hide();
            $("#flagSinConsumos").hide();
            $("#msgErrorFile").hide();
            if (estado == 'S') {
                $("#cambiarTpoMasivo").hide();
                $("#idCambiarTopeSimple").addClass("checked");
                $("#idCambiarTopeMasivo").removeClass("checked");
                $("#resultCambiarTopeMasivo").slideDown(350);
                $("#resultCambiarTopeMasivo").hide();
                $("#resultCambiarTopeSimple").show();
                $("#loaderTopeMasivo").hide();
                $("#idBolsaMinutos").hide();
                $scope.flagServiciosMovil = 0;
                $('#flagServiciosMovil').hide();
                $("#cuentaRecibo").hide();
                $("#loaderBolsaMasivo").hide();
            } else {
                $("#cambiarTpoMasivo").show();
                $("#loaderBolsa").hide();
                $("#loaderTopeMasivo").show();
                $("#loaderBolsaMasivo").hide();
                $("#cuentaRecibo").hide();
                $("#idCambiarTopeSimple").removeClass("checked");
                $("#idCambiarTopeMasivo").addClass("checked");
                $("#resultCambiarTopeSimple").slideDown(350);
                $("#resultCambiarTopeSimple").hide();
                $("#resultCambiarTopeMasivo").show();
                $('#Autocomplete').val('');
                $scope.flagServiciosMovilMasivo = 0;
                limpiarCuenta();
                limpiarRecibo();
                $timeout(function() {
                    cuenta();
                }, 200);
            }
        }

        function cuenta() {
            managerservice.obtenerListadoMovilCorporativoCuenta().then(function(response) {
                var rptaExito = response.data.obtenerListadoMovilCorporativoCuentaResponse.defaultServiceResponse.idRespuesta;
                if (rptaExito == 0) {
                    $scope.errorServiciosMovil = rptaExito;
                    $scope.listaCuenta = response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta;
                    if (!Array.isArray($scope.listaCuenta)) {
                        $scope.listaCuenta = [];
                        $scope.listaCuenta.push(response.data.obtenerListadoMovilCorporativoCuentaResponse.listadoCuenta);
                    }
                    var estado = true;
                    angular.forEach($scope.listaCuenta, function(val, key) {
                        if (val.idCuenta === $scope.idCuentaPrincipal) {
                            $scope.selectCuenta = $scope.listaCuenta[key];
                            estado = false
                        }
                    });
                    if (estado) {
                        $scope.selectCuenta = $scope.listaCuenta[0];
                    }
                    recibo();
                } else {
                    $scope.errorServiciosMovil = -1;
                    $scope.error_titulo = WPSMensajeError.error_titulo;
                    $scope.error_descripcion01 = WPSMensajeError.error_descripcion01;
                    $scope.error_descripcion02 = WPSMensajeError.error_descripcion02;
                    $('#resultCambiarTopeMasivo').hide();
                }
            }, function(response) {

            });
        }

        function validaFile() {
            var estado = true;
            if ($localStorage.file == '') {
                $("#idFile").addClass('error');
                $("#msgErrorFile").show();
                estado = false;
            }
            return estado;
        }

        function validarCampo() {
            var estado = true;
            if ($scope.nuevoTopeConsumo == '') {
                $("#idnuevotope").addClass('error');
                estado = false;
            } else {
                if ($scope.nuevoTopeConsumo % 1 == 0) {
                    estado = true;
                } else {
                    $("#idnuevotope").addClass('error');
                    $("#msgErroSimpleEntero").show();
                    estado = false;
                }
            }
            return estado;
        }

        $scope.changeCuenta = function() {
            if ($scope.selectCuenta != null) {
                recibo();
            } else {
                limpiarRecibo();
            }
        }

        function recibo() {
            var resquestRecibo = {
                idCuenta: $scope.selectCuenta.idCuenta
            };
            resquestRecibo = $httpParamSerializer({ requestJson: angular.toJson(resquestRecibo) });
            managerservice.obtenerListadoMovilCorporativoRecibo(resquestRecibo).then(function(response) {
                var rptaExito = response.data.obtenerListadoMovilCorporativoReciboResponse.defaultServiceResponse.idRespuesta;
                if (rptaExito == 0) {
                    $scope.listaRecibo = response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo;
                    if (!Array.isArray($scope.listaRecibo)) {
                        $scope.listaRecibo = [];
                        $scope.listaRecibo.push(response.data.obtenerListadoMovilCorporativoReciboResponse.listadoRecibo);
                    }
                    var estado = true
                    angular.forEach($scope.listaRecibo, function(val, key) {
                        if (val.idRecibo === $scope.idReciboPrincipal) {
                            $scope.selectRecibo = $scope.listaRecibo[key];
                            estado = false;
                        }
                    });
                    if (estado) {
                        $scope.selectRecibo = $scope.listaRecibo[0];
                    }
                    $scope.changeRecibo();
                    $("#loaderTopeMasivo").hide();
                    $("#cuentaRecibo").show();
                } else {
                    $("#loaderTopeMasivo").hide();
                    $("#cuentaRecibo").hide();
                }
            }, function(response) {

            });
        }

        $scope.changeRecibo = function() {

            $scope.flagSinConsumosMasivo = false;

            if ($scope.selectRecibo != null) {
                var resquestObtenerBolsasMinutos = {
                    idCuenta: $scope.selectCuenta.idCuenta,
                    idRecibo: $scope.selectRecibo.idRecibo,
                    idProductoServicio: ''
                };
                $localStorage.recibo = $scope.selectRecibo.nombreAlias;
                $localStorage.idCuentaM = $scope.selectCuenta.idCuenta;
                $localStorage.idReciboM = $scope.selectRecibo.idRecibo;
                $("#idBolsaMasivo").hide();
                bolsa(resquestObtenerBolsasMinutos, 'M');
                $('.step-change-bolsa').show();
            } else {
                $('.step-change-bolsa').hide();
            }
        }

        $scope.tipoAjuste = function(estado) {
            if (estado == 'P') {
                $("#TopeSimpleAjuste").addClass("checked");
                $("#TopeMasivoAjuste").removeClass("checked");
                $localStorage.tipoAjustoDescr = 'Permanente';
                $localStorage.tipoAjusto = '1';
            } else {
                $("#TopeSimpleAjuste").removeClass("checked");
                $("#TopeMasivoAjuste").addClass("checked");
                $localStorage.tipoAjustoDescr = 'Temporal';
                $localStorage.tipoAjusto = '2';
            }
        }

        $scope.continuarSimple = function() {
            if (validarCampo()) {
                if (validarConsumo()) {
                    $location.path('/viewConfirmarSimple');
                    scrollTo($('#myid').parent().parent());
                }
            }
        }

        function validarConsumo() {
            
            console.log("nuevoTopeConsumo :" + $scope.nuevoTopeConsumo);
            $("#msgErroSimple").hide();
            $localStorage.nuevoTopeConsumo = "";    
            var strSaldo = $scope.selectBolsa.saldoBolsa;
            var strTopeConsumo = $scope.detalleConsumoBolsaMinutos.consumoActual;
            
            var strSaldoBolsa = strSaldo.split(",");
            var strConsumoBolsa = strTopeConsumo.split(".");

            var saldoEntero = parseInt(strSaldoBolsa[0]+strSaldoBolsa[1]);
            var topeConsumoEntero = parseInt(strConsumoBolsa[0]);

            var nuevoTopeConsumo = parseInt($scope.nuevoTopeConsumo);

            if (nuevoTopeConsumo <= saldoEntero && nuevoTopeConsumo > topeConsumoEntero) {
                $localStorage.nuevoTopeConsumo = nuevoTopeConsumo;
                return true;
            } else {
                $("#msgErroSimple").show();
                return false;
            }
        }

        $scope.continuarMasivo = function() {
            if (validaFile()) {
                $("#msgErrorFile").hide();
                $("#msgErrorformato").hide();
                var resquestModificarTopeBolsaMinutos = {
                    idBolsa: $localStorage.idBolsa,
                    idCuenta: $localStorage.idCuentaM,
                    idRecibo: $localStorage.idReciboM,
                    idProductoServicio: '',
                    saldoBolsa: $localStorage.saldoBolsa,
                    numeroCelular: '',
                    cantidad: '',
                    tipoAjuste: $localStorage.tipoAjusto,
                    archivo: $localStorage.file
                };
                resquestModificarTopeBolsaMinutos = $httpParamSerializer({ requestJson: angular.toJson(resquestModificarTopeBolsaMinutos), tipoCarga: 'V' });
                managerservice.modificarTopeBolsaMinutos(resquestModificarTopeBolsaMinutos).then(function(response) {
                    var rptaExito = response.data.modificarTopeConsumoBolsaMinutosResponse.defaultServiceResponse.idRespuesta;
                    if (rptaExito == 0) {
                        $location.path('/viewConfirmarMasivo');
                        scrollTo($('#myid').parent().parent());
                    } else {
                        $("#msgErrorformato").show();
                        fuData = document.getElementById('ifileexcel').value = "";
                    }
                }, function(error) {

                });
            }
        }

        function actualizarProductoPrincipalSesion(idProductoServicio, nombreProducto, idCuenta, idRecibo) {
            var actualizarServicioSesion = {
                productoPrincipal: idProductoServicio,
                nombreProductoPrincipal: nombreProducto,
                idCuenta: idCuenta,
                idRecibo: idRecibo,
                idDireccion: null,
                idLinea: null,
                tipoLinea: '2',
                numeroTelFijo: '',
                categoria: $scope.categoria,
                tipoClienteProductoPrincipal: $scope.tipoClienteSession
            }
            data = $httpParamSerializer({ requestJson: angular.toJson(actualizarServicioSesion) });
            managerservice.actualizarProductoPrincipalSesion(data).then(function(response) {

            });

        };

        File.prototype.convertToBase64 = function(callback) {
            var FR = new FileReader();
            FR.onload = function(e) {
                callback(e.target.result)
            };
            FR.readAsDataURL(this);
        };

        $('#ifileexcel').bind("change", function() {
            var selectedFile = this.files[0];
            if (ValidateFileUpload) {
                selectedFile.convertToBase64(function(base64) {
                    var arr = base64.split(',');
                    $localStorage.file = arr[1];
                });
            }

        });

        $('.linkred').tooltip({ placement: "right", html: true });
        $('.pullfiltro select').change(function(e) {
            var $this = $(this);
            if ($this.val() != "") {
                $('.step-change-bolsa').slideDown(450);
            }
        });

        function ValidateFileUpload() {
            var fuData = document.getElementById('ifileexcel');
            var FileUploadPath = fuData.value;
            var Extension = FileUploadPath.substring(FileUploadPath.lastIndexOf('.') + 1).toLowerCase();
            if (Extension == "xls" || Extension == "xlsx") {

            } else {
                alert("Está intentando subir un archivo no valido. El archivo debe ser en formato Excel.");
            }
            return false;
        };


        $('.fileinput input').each(function() {
            var $input = $(this),
                $label = $input.parent().find('label'),
                labelVal = $label.html();
            $input.on('change', function(e) {
                var fileName = '';
                if (this.files && this.files.length > 1)
                    fileName = (this.getAttribute('data-multiple-caption') || '').replace('{count}', this.files.length);
                else if (e.target.value)
                    fileName = e.target.value.split('\\').pop();
                if (fileName)
                    $label.html(fileName);
                else
                    $label.html(labelVal);
            });

            $scope.file = $.base64('encode', this.files);
            $input
                .on('focus', function() { $input.addClass('has-focus'); })
                .on('blur', function() { $input.removeClass('has-focus'); });
        });

        function arrayObjectIndexOfId(arr, obj) {
            for (var i = 0, k = arr.length; i < k; i++) {
                if (arr[i].nombreAlias == obj) {
                    return i;
                }
            };
            return -1;
        };

        function limpiarCuenta() {
            if ($scope.listaCuenta.length > 0) {
                $scope.listaCuenta = [];
            }
        }

        function limpiarRecibo() {
            if ($scope.listaRecibo.length > 0) {
                $scope.listaRecibo = [];
            }
        }

        function limpiarBolsa() {
            if ($scope.listaObtenerBolsasMinutos.length > 0) {
                $scope.listaObtenerBolsasMinutos = [];
            }
        }

    });


});
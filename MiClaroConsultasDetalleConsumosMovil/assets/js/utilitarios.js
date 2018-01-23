function asignarEventos() {

    $('#btothermail').click(function() {
        $('.step1').fadeOut(150);
        setTimeout(function() { $('.step2').fadeIn(250); }, 350);
    });
    $('#btothercancel').click(function() {
        $('.step2').fadeOut(150);
        setTimeout(function() { $('.step1').fadeIn(250); }, 350);
    })
    $('#btsendmail').click(function() {

        setTimeout(function() { ocultarPopUp(); }, 1300);
    });

    $('.popup .btclose, .popup .bg').click(function() {
        ocultarPopUp();
    });

}

function asignarEventoRadios() {
    $('.filter-lista').each(function(i, e) {
        var $filter = $(this);
        var $target = $($filter.attr("data-target"));
        $filter.find('.radio input').change(function() {
            var $href = $(this).val();
            $target.slideUp(350);
            setTimeout(function() {
                $target.find(".data").hide();
                $target.find(".data" + $href).show();
                $target.slideDown(350);

            }, 550);

        });
    });
}

function validarEnvioMail() {

    $form = $('#idformpop');
    var valid = $form.validate();
    if (valid) {
        $form.find('.msg-error').hide();
        setTimeout(function() { ocultarPopUp(); }, 1300);
        return true;
    } else {
        $form.find('.msg-error').html("Por favor, ingresa un correo electrónico válido.").show();
        return false;
    }
}

function abrirPopUp(abrirPop) {
    var $popup = $('.popup');
    var $pop = $(".popup .pop");
    var $cnt = $popup.find('.content');
    $cnt.hide();
    var $conf = $popup.find('.confirm');
    $conf.hide();
    $popup.show();
    $cnt.fadeIn(250);

    $pop.css({ 'margin-top': Math.round(($h - 300) / 2) });
    $popup.fadeIn(350);
}

function abrirPopup() {
    var $popup = $('.popup');
    $popup.show();
}

function ocultarPopUp() {
    var $popup = $('.popup');
    $popup.fadeOut(250);
}

function scrollToTop() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
}


function obtenerArrayAutoComplete(lista) {
    var arrayAutocomplete = [];
    for (var i = 0; i < lista.length; i++) {
        arrayAutocomplete.push({
            value: lista[i].nombreAlias,
            data: lista[i].nombreAlias
        });
    }

    var result = {
        suggestions: arrayAutocomplete
    };

    return result;
}

function agregarEventoBuscarLinea() {
    $('.colsearch .action').click(function(e) {
        e.preventDefault();
        var $this = $(this);
        var $form = $this.closest("form");

        $form.toggleClass("search-column");
        if ($form.hasClass("search-column")) {
            $form.find(".input, .pull").addClass("disabled");
        }
    });
}

function buscarEnListaAuto(arr, obj) {
    if (Array.isArray(arr)) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].nombreAlias == obj) {
                return arr[i];
            }
        };
    } else if (arr.nombreAlias == obj) {
        return arr;
    }
    return null;
};

function buscarEnListaCuentas(listadoCuenta, idCuenta) {
    if (Array.isArray(listadoCuenta)) {
        for (var i = 0; i < listadoCuenta.length; i++) {
            if (listadoCuenta[i].idCuenta == idCuenta) {
                return listadoCuenta[i];
            }
        };
    } else if (listadoCuenta.idCuenta == idCuenta) {
        return listadoCuenta;
    }
    return null;
};

function buscarEnListaRecibos(listadoRecibo, idRecibo) {
    if (Array.isArray(listadoRecibo)) {
        for (var i = 0; i < listadoRecibo.length; i++) {
            if (listadoRecibo[i].idRecibo == idRecibo) {
                return listadoRecibo[i];
            }
        };
    } else if (listadoRecibo.idRecibo == idRecibo) {
        return listadoRecibo;
    }
    return null;
};

function getBool(val) {
    var num = +val;
    return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0, '');
}


function crearRequestAudit(usuarioSesion, request, responseTrans, comboLinea,
    tipoDetalle, tipoLlamada, tipoMensaje, isCorporativo, isEnvioCorreo, isObtenerReporte, estadoAudit, descripcion) 
{
    var pageID = "";
    var trCode = "";


    if (isCorporativo) {
        pageID = WPSPageID.miclaro_corporativo_consultas_detalleconsumos_movil;
    } else {
        pageID = WPSPageID.miclaro_consumer_consultas_detalleconsumos_movil;
    }
    if (tipoDetalle == "L") {
        if (isEnvioCorreo) {
            if (tipoLlamada == WPSTipoLlamadas.salientes) {
                trCode = WPSTablaOperaciones.envioCorreoDetalleConsumosLlamadasSaliente;

            } else if (tipoLlamada == WPSTipoLlamadas.entrantes) {
                trCode = WPSTablaOperaciones.envioCorreoDetalleConsumosLlamadasEntrante;

            } else if (tipoLlamada == WPSTipoLlamadas.porcobrar) {
                trCode = WPSTablaOperaciones.envioCorreoDetalleConsumosLlamadasPorCobrar;

            }
        } else if (isObtenerReporte) {
            if (tipoLlamada == WPSTipoLlamadas.salientes) {

                trCode = WPSTablaOperaciones.descargaArchivoDetalleConsumosLlamadasSaliente;

                console.log(transacId);
            } else if (tipoLlamada == WPSTipoLlamadas.entrantes) {
     
                trCode = WPSTablaOperaciones.descargaArchivoDetalleConsumosLlamadasEntrante;


            } else if (tipoLlamada == WPSTipoLlamadas.porcobrar) {
     
                trCode = WPSTablaOperaciones.descargaArchivoDetalleConsumosLlamadasPorCobrar;

            }
        } else {
            if (tipoLlamada == WPSTipoLlamadas.salientes) {
                trCode = WPSTablaOperaciones.consultaDetalleConsumosLlamadasSaliente;

            } else if (tipoLlamada == WPSTipoLlamadas.entrantes) {
                trCode = WPSTablaOperaciones.consultaDetalleConsumosLlamadasEntrante;

            } else if (tipoLlamada == WPSTipoLlamadas.porcobrar) {
                trCode = WPSTablaOperaciones.consultaDetalleConsumosLlamadasPorCobrar;

            }
        }

    } else if (tipoDetalle == "M") {
        if (isEnvioCorreo) {
            if (tipoMensaje == WPSTipoMensajes.sms) {
                trCode = WPSTablaOperaciones.envioCorreoDetalleConsumosSMS;

            } else if (tipoMensaje == WPSTipoMensajes.mms) {
                trCode = WPSTablaOperaciones.envioCorreoDetalleConsumosMMS;

            }
        } else if (isObtenerReporte) {
            if (tipoMensaje == WPSTipoMensajes.sms) {
                trCode = WPSTablaOperaciones.descargaArchivoDetalleConsumosSMS;

            } else if (tipoMensaje == WPSTipoMensajes.mms) {
                trCode = WPSTablaOperaciones.descargaArchivoDetalleConsumosMMS;


            }
        } else {
            if (tipoMensaje == WPSTipoMensajes.sms) {
                trCode = WPSTablaOperaciones.consultaDetalleConsumosSMS;

            } else if (tipoMensaje == WPSTipoMensajes.mms) {
                trCode = WPSTablaOperaciones.consultaDetalleConsumosMMS;

            }
        }
    } else {

        if (isEnvioCorreo) {
            trCode = WPSTablaOperaciones.envioCorreoDetalleConsumosInternet;

        } else if (isObtenerReporte) {
            trCode = WPSTablaOperaciones.descargaArchivoDetalleConsumosInternet;


        } else {
            trCode = WPSTablaOperaciones.consultaDetalleConsumosInternet;

        }

    }
    var transacId = "";
    if (responseTrans != null) {

        if(responseTrans.defaultServiceResponse.idTransaccional != undefined){
            transacId = responseTrans.defaultServiceResponse.idTransaccional;
        }
        else {
            transacId = "-";
        }
       
    }

    var resquestAuditoria = {
        operationCode: trCode,
        pagina: pageID,
        transactionId: transacId,
        estado: estadoAudit,
        servicio: comboLinea.ProductoServicioResponse.nombre,
        tipoProducto: 'MOVIL',
        tipoLinea: comboLinea.ProductoServicioResponse.tipoLinea,
        tipoUsuario: usuarioSesion.tipoCliente,
        perfil: comboLinea.ProductoServicioResponse.tipoPermiso,
        monto: request.importePago,
        descripcionoperacion: descripcion,
        responseType: '/'
    };

    return resquestAuditoria;
}


function initTabs() {
    $('.tabs').each(function(i, e) {
        var $tabs = $(this);
        $tabs.find('.tab-links a').on('click', function(e) {
            var $this = $(this);
            if (!$this.parent().hasClass("disabled")) {

                var $thistab = $tabs.find($this.attr('href'));
                $this.parent('li').addClass('active').siblings().removeClass('active');
                $thistab.fadeIn(350).siblings().hide();


                $thistab.find('.counter').counterUp();

                var $time = 0;
                var $tpos = 0;
                $thistab.find('.box').each(function(ix, el) {
                    var $tmp = $(this);
                    var $pos = $(this).offset().top;

                    if ($tpos != $pos) {
                        $tpos = $pos;
                        $time = $time + 150;
                    }
                    $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 250);
                });
            }
            e.preventDefault();
        });
    });
}

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

    var blob = new Blob(byteArrays, { type: contentType });
    return blob;
}

function concatenarLista(listaBase, listaAgregar) {
    if (Array.isArray(listaAgregar)) {
        for (var i = 0; i < listaAgregar.length; i++) {
            listaBase.push(listaAgregar[i]);
        };
    } else {
        listaBase.push(listaAgregar);
    }

    return listaBase;
}

function habilitarCombo(lista, classCombo) {
    if (lista.length > 1)
        $("." + classCombo).removeClass("disabled");
}
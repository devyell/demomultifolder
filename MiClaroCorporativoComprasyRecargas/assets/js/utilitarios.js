var enablePagarBtn;

function enablePagar(recibe) {
    enablePagarBtn = recibe;
}

function asignarEventoChecks() {
    $('.check input').change(function(e) {
        var $this = $(this);
        if ($this.is(":checked")) {
            $this.parent().addClass("checked");
        } else {
            $this.parent().removeClass("checked");
        }
    }).each(function(i, e) {
        var $this = $(this);
        if ($this.is(":checked")) {
            $this.parent().addClass("checked");
        } else {
            $this.parent().removeClass("checked");
        }
    });

    $(".check input[name='iterminos']").change(function() {
        var $this = $(this);
        var $btpagar = $this.closest("form").find(".bt-pagar");
        if ($this.is(":checked")) {
            $btpagar.removeClass("bt-disabled");
            if (enablePagarBtn) {
                $btpagar.removeClass("bt-disabled");
                $btpagar.removeClass("bt-gris");
            } else {
                $btpagar.addClass("bt-disabled");
            }
        } else {
            $btpagar.addClass("bt-disabled");
        }
    });
}

function marcarCheckTerminos(checked) {
    var $this = $("#iterminos");
    var $btpagar = $this.closest("form").find(".bt-pagar");
    if (checked == true) {
        $this.parent().addClass("checked");
        $this.prop("checked", true);
        $btpagar.removeClass("bt-disabled");
    } else {
        $this.prop("checked", false);
        $this.parent().removeClass("checked");
        $btpagar.addClass("bt-disabled");
    }
}

function asignarEventoTerminos() {
    $('.linkterminos').click(function(e) {
        e.preventDefault();
        abrirTerminos();
    });
}

function cargarTextoTerminos() {
    $("#divTermsCondiciones").load("/wps/wcm/myconnect/mi%20claro%20content%20library/mi%20claro/terminos%20y%20condiciones/compras%20facturadas");
}

function slideDownMedio(myControl) {

    var control = $('#' + myControl);
    if (control.hasClass("open")) {
        control.removeClass("open");
        control.find(".data").slideUp(350);
    } else {
        control.addClass("open");
        control.siblings().find(".data").slideUp(350);
        control.siblings().find(".box-select").removeClass("open");
        control.find(".data").slideDown(350);
    }
}

function renderItemsLoaded() {
    $('.box-select .data').hide();
    $('.step-payment').hide();
    $('.box-select .data').hide();
}

function abrirConfirmacion(boton) {
    var btn = $('#' + boton);
    if (!btn.hasClass("bt-disabled")) {
        var $form = btn.closest("form");
        var $valid = $form.validate();

        if ($valid) {

            abrirPopUp("2");
        }
    }
}

function abrirEnProceso() {
    abrirPopUp("1");
}

function abrirTerminos() {
    abrirPopUp("3");
}

function abrirPopUp(abrirPop) {
    var $popup = $('.popup');
    var $pop = $(".popup .pop");
    var $cnt = $popup.find('.content');
    $cnt.hide();
    $popup.show();
    if (abrirPop == "1") {
        $cnt = $popup.find('.compra-confirm-popup-progress');
    } else if (abrirPop == "2") {
        $cnt = $popup.find('.compra-confirm-popup');
    } else if (abrirPop == "3") {
        $cnt = $popup.find('.compra-confirm-popup-condiciones');
    }
    $cnt.fadeIn(250);

    $pop.css({ 'margin-top': Math.round(($h - 300) / 2) });
    $popup.fadeIn(350);
}

function ocultarPopUp() {
    var $popup = $('.popup');
    $popup.fadeOut(250);
}

function asignarClassCategoriaCompra() {
    $(".icon-compra").addClass("compra-internet");
}

function scrollToTop() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
}

function imprimirPagina() {
    window.print();
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
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].nombreAlias == obj) {
            return arr[i];
        }
    };
    return null;
};

function buscarEnListaCuentas(listadoCuenta, idCuenta) {
    for (var i = 0; i < listadoCuenta.length; i++) {
        if (listadoCuenta[i].idCuenta == idCuenta) {
            return listadoCuenta[i];
        }
    };
    return null;
};

function buscarEnListaMetodos(listadoMetodos, idMetodo) {
    for (var i = 0; i < listadoMetodos.length; i++) {
        if (listadoMetodos[i].tipoMetodoPago == idMetodo ||
            listadoMetodos[i].tipoMetodoPago === idMetodo) {
            return listadoMetodos[i];
        }
    };
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

function culqi() {

    _controllerCompras.cerrarCulqi();
};


function crearRequestAudit(usuarioSesion, catComp, idMetodoPago, request, responseTrans, comboLinea, estadoAudit, descripcion) {
    var trCode = "";


    if (catComp.idCategoriaDeCompra === WPSCategoriasDeCompra.internet) {
        if (idMetodoPago === WPSMediosDePago.puntosClaro.codigo) {
            trCode = WPSTablaOperaciones.compraRecargaPaqueteInternetPuntosClaro;
            
        } else
        if (idMetodoPago === WPSMediosDePago.cargarEnRecibo.codigo) {
            trCode = WPSTablaOperaciones.compraRecargaPaqueteInternetCargoRecibo;
            
        } else
        if (idMetodoPago === WPSMediosDePago.tarjetaCredito.codigo) {
            trCode = WPSTablaOperaciones.compraRecargaPaqueteInternetTarjetaCredito;
            
        } else
        if (idMetodoPago === WPSMediosDePago.saldoPrepago.codigo) {
            trCode = WPSTablaOperaciones.compraRecargaPaqueteInternetSaldoPrepagado;
            
        }
    } else if (catComp.idCategoriaDeCompra === WPSCategoriasDeCompra.voz) {
        if (idMetodoPago === WPSMediosDePago.puntosClaro.codigo) {
            trCode = WPSTablaOperaciones.compraRecargaPaqueteVozPuntosClaro;
            
        } else
        if (idMetodoPago === WPSMediosDePago.cargarEnRecibo.codigo) {
            trCode = WPSTablaOperaciones.compraRecargaPaqueteVozCargoRecibo;
            
        } else
        if (idMetodoPago === WPSMediosDePago.tarjetaCredito.codigo) {
            trCode = WPSTablaOperaciones.compraRecargaPaqueteVozTarjetaCredito;
            
        } else
        if (idMetodoPago === WPSMediosDePago.saldoPrepago.codigo) {
            trCode = WPSTablaOperaciones.compraRecargaPaqueteVozSaldoPrepagado;
            
        }
    } else if (catComp.idCategoriaDeCompra === WPSCategoriasDeCompra.smsmms) {
        if (idMetodoPago === WPSMediosDePago.puntosClaro.codigo) {
            trCode = WPSTablaOperaciones.compraRecargaPaqueteSMSPuntosClaro;
            
        } else
        if (idMetodoPago === WPSMediosDePago.cargarEnRecibo.codigo) {
            trCode = WPSTablaOperaciones.compraRecargaPaqueteSMSCargoRecibo;
            
        } else
        if (idMetodoPago === WPSMediosDePago.tarjetaCredito.codigo) {
            trCode = WPSTablaOperaciones.compraRecargaPaqueteSMSTarjetaCredito;
            
        } else
        if (idMetodoPago === WPSMediosDePago.saldoPrepago.codigo) {
            trCode = WPSTablaOperaciones.compraRecargaPaqueteSMSSaldoPrepagado;
            
        }
    } else if (catComp.idCategoriaDeCompra === WPSCategoriasDeCompra.soles) {
        if (idMetodoPago === WPSMediosDePago.puntosClaro.codigo) {
            trCode = WPSTablaOperaciones.compraRecargaPaqueteMMSPuntosClaro;
            
        } else
        if (idMetodoPago === WPSMediosDePago.cargarEnRecibo.codigo) {
            trCode = WPSTablaOperaciones.compraRecargaPaqueteMMSCargoRecibo;
            
        } else
        if (idMetodoPago === WPSMediosDePago.tarjetaCredito.codigo) {
            trCode = WPSTablaOperaciones.compraRecargaPaqueteMMSTarjetaCredito;
            
        } else
        if (idMetodoPago === WPSMediosDePago.saldoPrepago.codigo) {
            trCode = WPSTablaOperaciones.compraRecargaPaqueteMMSSaldoPrepagado;
            
        }
    }
    var transacId = "";
    if (responseTrans != null) {
        transacId = responseTrans.defaultServiceResponse.idTransaccional;
    }
    var resquestAuditoria = {
        operationCode: trCode,
        pagina: WPSPageID.miclaro_corporativo_comprasyrecargas,
        transactionId: transacId,
        estado: estadoAudit,
        servicio: comboLinea.ProductoServicioResponse.nombre,
        tipoProducto: 'MOVIL',
        tipoLinea: comboLinea.ProductoServicioResponse.tipoLinea,
        tipoUsuario: usuarioSesion.tipoClienteRequest,
        perfil: comboLinea.ProductoServicioResponse.tipoPermiso,
        monto: request.importePago,
        descripcionoperacion: descripcion,
        responseType: '/'
    };

    return resquestAuditoria;
}
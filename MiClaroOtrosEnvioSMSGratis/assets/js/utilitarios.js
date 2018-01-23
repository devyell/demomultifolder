
    function validar(){
        var $this = $('#btsendsms');
        
        $form = $this.closest('form');
        var valid = $form.validate();
        if (valid) {
            $('.msg-error').hide();
            
            return true;
        } else {
            $('.msg-error').fadeIn(250);
            return false;
        }
    }
    function mostrarErrorCaptcha(){
        var icaptcha = $('#icaptcha');
        $('.msg-error').fadeIn(250);
        var parent = icaptcha.parent();
        parent.addClass("error");
    }
    function asignarEventos(){
        
        $('#imotivo').change(function(){
            var $this = $(this);
            if ($this.val() != "") {
                $('#ipredeterminado').attr("disabled", false);
            } else {
                $('#ipredeterminado').attr("disabled", true);
            }
        });
        $('#ipredeterminado').change(function(e){
            e.preventDefault();
            var $this = $(this);
            var $pull = $this.parent();
            if ($this.val() == "") {
                $('#imensaje').val("");
            } else {
                
                
                var combo = document.getElementById("ipredeterminado");
                $('#imensaje').val(combo.options[combo.selectedIndex].text);
            }
            $('#imensaje').focus();
        });

        
        $("#inumero").keydown(function (e) {
            if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
                (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
                (e.keyCode >= 35 && e.keyCode <= 40)) {
                     return;
            }
            if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                e.preventDefault();
            }
        });
        
        $('#imensaje').on("keyup focus", function () {
            var $this = $(this);

            var max = 140;
            var len = $this.val().length;
            if (len >= max) {
                $this.val($this.val().substring(0, len-1));
                $('#imaximo').val(max);
            } else {
                $('#imaximo').val(len);
            }
        });
        $('#imensaje').focus(function() {
            var $this = $(this);
            $this.parent().addClass("focus"); 
            if ($this.val() == $this.attr("data-holder")) {
                $this.val("");
            }
        });
        $('#imensaje').blur(function() {
            var $input = $(this);
            $input.parent().removeClass("focus");
            if ($input.val() == "") {
                $input.val($input.attr("data-holder"));
            }
        });
        $('.popup .btclose, .popup .bg').click(function(){
            ocultarPopUp();
        });
       
    }

    function abrirPopupExito (){
        abrirPopUp("1");
    }
    function abrirPopupError (){
        abrirPopUp("2");
    }
    function abrirPopupNoClaro (){
        abrirPopUp("3");
    }
    function abrirPopUp (abrirPop) {
        var $popup = $('.popup');
        var $pop = $(".popup .pop");
        var $cnt = $popup.find('.content');
        $cnt.hide();
        var $conf = $popup.find('.confirm');
        $conf.hide();
        $popup.show();
        if(abrirPop == "1"){
            divMensaje = $popup.find('.mensaje-exito');
        } else if (abrirPop == "2"){
            divMensaje = $popup.find('.mensaje-error');
        } else if (abrirPop == "3"){
            divMensaje = $popup.find('.mensaje-noclaro');
        }
        divMensaje.show();
        $cnt.fadeIn(250);

        $pop.css({'margin-top': Math.round( ($h-300)/2) });
        $popup.fadeIn(350);
    }
    function ocultarPopUp() {
        var $popup = $('.popup');
        $popup.fadeOut(250);
    }
    function scrollToTop(){
        $("html, body").animate({ scrollTop: 0 }, "slow");
    }

    function buscarEnListaCuentas(listadoCuenta, idCuenta) {
        for ( var i = 0; i < listadoCuenta.length; i++ ){
            if (listadoCuenta[i].idCuenta == idCuenta) {
                return listadoCuenta[i];
            }
        };
        return null;
    };
    function getBool(val){ 
        var num = +val;
        return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0,'');
    }


    function crearRequestAudit(usuarioSesion, request, responseTrans, estadoAudit,descripcion){
        var trCode = WPSTablaOperaciones.enviarSMS;
       
        var pageId = "";

        if(usuarioSesion.tipoClienteRequest === WPSTipoCliente.consumer){
            pageId = WPSPageID.miclaro_consumer_otros_enviosmsgratis;
        } else {
            pageId = WPSPageID.miclaro_corporativo_otros_enviosmsgratis;
        }
        var transacId = "";
        if(responseTrans != null){
            transacId = responseTrans.defaultServiceResponse.idTransaccional;
        }
        var resquestAuditoria = {
            operationCode: trCode,
            pagina: pageId,
            transactionId:transacId,
            estado: estadoAudit,
            servicio: '-',
            tipoProducto: 'MOVIL',
            tipoLinea: '2',
            tipoUsuario: usuarioSesion.tipoClienteRequest,
            perfil: '-',
            monto: 0,
            descripcionoperacion: descripcion,
            responseType: '/'
        };

        return resquestAuditoria;
    }
    
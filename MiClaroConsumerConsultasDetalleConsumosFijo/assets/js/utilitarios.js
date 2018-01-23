
var $popup = $('.popup');
	function showPopUpFromFile($file) {
	   $h = $(window).height();
		var $pop = $(".popup .pop");
		var $cnt = $popup.find('.content');
		$cnt.html("").hide();
		$cnt.load($file, function() { $cnt.fadeIn(250); initFormFields(); });

		$pop.css({'margin-top': Math.round( ($h-300)/2) });
		$popup.fadeIn(350);
	}

	$('.popup .btclose, .popup .bg').click(function(){
        hidePopUp();
    });

	
	function hidePopUp() {
		$popup.fadeOut(250); 
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
        $('#btsmsaceptar').click(function(){
            ocultarPopUp();
        });
    }

    function asignarEventoRadios(){
        $('.filter-lista').each(function(i,e){
            var $filter = $(this);
            var $target = $($filter.attr("data-target"));
            $filter.find('.radio input').change(function(){
                
                $target.slideUp(350);
                setTimeout(function(){
                    $(".result-lista").hide();
                   
                    $target.slideDown(350); 
					$(".result-lista").show();
                }, 550);

            });
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


    function obtenerArrayAutoComplete(lista){
        var arrayAutocomplete = [];
        for(var i = 0; i < lista.length; i++) {
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

    function agregarEventoBuscarLinea(){
        $('.colsearch .action').click(function(e){
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
        for ( var i = 0; i < arr.length; i++ ){
            if (arr[i].nombreAlias == obj) {
                return arr[i];
            }
        };
        return null;
    };
    function buscarEnListaCuentas(listadoCuenta, idCuenta) {
        for ( var i = 0; i < listadoCuenta.length; i++ ){
            if (listadoCuenta[i].idCuenta == idCuenta) {
                return listadoCuenta[i];
            }
        };
        return null;
    };
    function buscarEnListaRecibos(listadoRecibo, idRecibo) {
        for ( var i = 0; i < listadoRecibo.length; i++ ){
            if (listadoRecibo[i].idRecibo == idRecibo) {
                return listadoRecibo[i];
            }
        };
        return null;
    };
    function getBool(val){ 
        var num = +val;
        return !isNaN(num) ? !!num : !!String(val).toLowerCase().replace(!!0,'');
    }


    function crearRequestAudit(usuarioSesion, request, responseTrans, estadoAudit){
        var trCode = WPSTablaOperaciones.enviarSMS;
        var descripcion = "enviarSMS";
        var pageId = "";

        if(usuarioSesion.tipoClienteRequest === WPSTipoCliente.consumer){
            pageId = WPSPageID.miclaro_consumer_consultas_detalleconsumos_fijo;
        } else {
            pageId = WPSPageID.miclaro_corporativo_otros_enviosmsgratis;
        }
        var transacId = "";
        if(responseTrans != null){
            if(responseTrans.defaultServiceResponse.idTransaccional != undefined){
                
                transacId = responseTrans.defaultServiceResponse.idTransaccional;

            }else{

                transacId = "-";

            }
            

        }
        var resquestAuditoria = {
            operationCode: trCode,
            pagina: pageId,
            transactionId:transacId,
            estado: estadoAudit,
            servicio: usuarioSesion.numero,
            tipoProducto: 'MOVIL',
            tipoLinea: '',
            tipoUsuario: usuarioSesion.tipoClienteRequest,
            perfil: '',
            monto: 0,
            descripcionoperacion: descripcion,
            responseType: '/'
        };

        return resquestAuditoria;
    }



function initTabs() {
    $('.tabs').each(function(i,e){
        var $tabs = $(this);
        $tabs.find('.tab-links a').on('click', function(e) {
            var $this = $(this);
            if (!$this.parent().hasClass("disabled")) {
                
                var $thistab = $tabs.find($this.attr('href'));
                $this.parent('li').addClass('active').siblings().removeClass('active');
                $thistab.fadeIn(350).siblings().hide();

                
                $thistab.find('.counter').counterUp();
                
                var $time = 0; var $tpos = 0;
                $thistab.find('.box').each(function(ix,el){
                    var $tmp = $(this);
                    var $pos = $(this).offset().top;

                    if ($tpos != $pos) { $tpos = $pos; $time = $time + 150; }
                    $tmp.css({top: 20, opacity: 0}).stop().delay($time).animate({top: 0, opacity: 1}, 250);
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

    var blob = new Blob(byteArrays, {type: contentType});
    return blob;
}
    



function validarNumeroFrecuente() {

var defaults = { 'errorclass':'error' }
var opts = $.extend(defaults, 'form');
var bool = true, finish = true;
	
$.each($(".numerico"), function() {
	$(this).closest('td').find("input").each(function() {
         
		elem = $(this);
		parent = elem.parent();
        bool = validPhone(elem.val());
		
        label = $("label[for='"+elem.attr('id')+"']"); 
		
		
		if(!bool){
			parent.addClass(opts.errorclass);
            label.addClass("error");
			bool = true;
			finish = false;
		} else {
            parent.removeClass(opts.errorclass);
            label.removeClass("error");
		}		
			 
			
		});
	});
	
		return finish;
	}
	
	function validPhone(valor){ return (valor == "" || (/^\d+$/.test(valor) && (valor.length >= 5 && valor.length <= 13))) ? true : false; }
	

	function validarNum () {
	$(".table-frecuente .input input").keydown(function (e) {
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            (e.keyCode == 65 && ( e.ctrlKey === true || e.metaKey === true ) ) ||
            (e.keyCode >= 35 && e.keyCode <= 40)) {
			
                 return;
        }
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
           
			e.preventDefault();
        }
   });
	}
	

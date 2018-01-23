$(document).ready(function(e) {
$('input[type=text]').each(function(ix,ex){
        var $this = $(this); 
        if ($this.attr("data-type") == "number") {
            $this.keydown(function (e) {
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
    });
	
	
	});

function validEmail2(valor){ 
return (/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(valor)) ? true : false;

 }
 
 function validEmail(valor){ return (/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(valor)) ? true : false; }
 
 function validarCampo(valor){ 
	 if(valor==''){
		return true;
	 }else {
	 return (/^[a-zA-Z0-9\s.-]*$/.test(valor)) ? true : false; 
	 }
}
function validIntCuenta(valor){
		if(valor==''){
		return true;
		}else {

		return (/^\d+$/.test(valor)) ? true : false; 
		}
}
	function validDni(valor){ return (/^\d+$/.test(valor) && valor.length == 8) ? true : false; }
	function validRuc(valor){ return (/^\d+$/.test(valor) && valor.length == 11) ? true : false; }
    function validPhone(valor){ return (/^\d+$/.test(valor) && (valor.length >= 5 && valor.length <= 11)) ? true : false; }
	function validRequired(elem){
			 var bool = true;
            if (!elem) { 
                 bool = false;
            } 
			return bool ;
        }
	
function obligatorio(valor){ 
	
		var bool = false;
            if (valor!='') { 
                 bool = true;
            } 
			return bool;
	
	}
	
	function obligatorioSeleccionar(valor){ 

		var bool = false;
			
            if (valor!='') { 
                 bool = true;
            } 
			 if (valor=='Selecionar') { 
                 bool = false;
            } 
			if (valor=='undefined') { 
                 bool = false;
            } 
			
			return bool;
	
	}

		
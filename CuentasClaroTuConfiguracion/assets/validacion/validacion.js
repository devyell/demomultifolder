
function validEmail2(valor){ 
return (/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(valor)) ? true : false;

 }
 
 function validEmail(valor){ return (/^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/.test(valor)) ? true : false; }
	function validInt(valor){ return (/^\d+$/.test(valor)) ? true : false; }
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

		
function afiliarLinea() {
    abrirPopUp("1");
}

function desafiliarLinea() {
    abrirPopUp("2");
}


function abrirPopUp(abrirPop) {
    if (abrirPop == "1") {
        $popup = $('#afiliar');
    } else if (abrirPop == "2") {
        $popup = $('#desafiliar');
    }else if(abrirPop == "3"){
        $popup = $('#errorDirectorio');
    }
    var $pop = $(".popup .pop");
    var $cnt = $popup.find('.content');
    $cnt.fadeIn(350);
    $pop.css({ 'margin-top': Math.round(($h - 300) / 2) });
    $popup.fadeIn(350);
}

function esconderPopUp() {
    $popup.fadeOut(250);
}

var $popup;
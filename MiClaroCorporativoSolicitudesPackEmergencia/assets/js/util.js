var $popup;

function abrirPopUp() {    
    $popup = $("#wrapper_confirm");
    var $pop = $(".popup .pop");
    var $cnt = $popup.find('.content');
    $cnt.fadeIn(350);
    $pop.css({ 'margin-top': Math.round(($h - 300) / 2) });
    $popup.fadeIn(350);
}

function cerrarPopUp() {
    $popup = $("#wrapper_confirm");
    $popup.fadeOut(250);
}

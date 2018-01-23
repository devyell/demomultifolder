function abrirPopUp() {
    $('#idProcesando').show();
    $('#idConfirmacion').hide();
    $('#idConfirmacionError').hide();
    $popup = $('#idPopupNuevoServicio');
    var $pop = $(".popup .pop");
    var $cnt = $popup.find('.content');
    $cnt.fadeIn(350);
    $pop.css({ 'margin-top': Math.round(($h - 300) / 2) });
    $popup.fadeIn(350);
}

function mostrarConfirmacion() {
    $('#idProcesando').hide();
    $('#idConfirmacion').show();
}

function mostrarError(){
    $('#idProcesando').hide();
    $('#idConfirmacionError').show();
}

function esconderPopUp() {
    $popup.fadeOut(250);
}

var $popup;
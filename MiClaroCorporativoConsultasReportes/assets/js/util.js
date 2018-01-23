function abrirPopUp() {
    
    $popup = $('#idPopupNuevoServicio');
    $('#idProcesando').show();
    $('#idConfirmacion').hide();
    $('#popupMensaje3').hide();
    $('#popupMensaje4').hide();
    $('#idConfirmacionError').hide();
    var $pop = $(".popup .pop");
    var $cnt = $popup.find('.content');
    $cnt.fadeIn(350);
    $pop.css({ 'margin-top': Math.round(($h - 300) / 2) });
    $popup.fadeIn(350);
};

function mostrarConfirmacion() {

    $('#idProcesando').hide();
    $('#idConfirmacion').show();
};

function mostrarMensaje3() {

    $('#idProcesando').hide();
    $('#popupMensaje3').show();
};

function mostrarMensaje4() {

    $('#idProcesando').hide();
    $('#popupMensaje4').show();
};

function mostrarError() {

    $('#idProcesando').hide();
    $('#idConfirmacionError').show();
};

function esconderPopUp() {
    $popup.fadeOut(250);
};

var $popup;

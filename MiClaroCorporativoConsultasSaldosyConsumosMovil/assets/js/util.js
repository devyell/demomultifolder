function mostrarLineasInternet() {
    $("#idSlideBolsas").slideUp(350);
    setTimeout(function() {
        $("#idSlideLinea").slideDown(350);
    }, 550);
}

function mostrarBolsasInternet() {
    $("#idSlideLinea").slideUp(350);
    setTimeout(function() {
        $("#idSlideBolsas").slideDown(350);
    }, 550);
}

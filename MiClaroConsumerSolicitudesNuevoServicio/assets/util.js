var valMovil = '';
var valInternet = '';
var valTv = '';
var valFijo = '';

function slideMovil(movilMax, movilMin, valorTwoMovil, valorThreeMovil) {
    $("#slider-movil").mbSlider({
        formatValue: function(val) {
            return "Móvil";
        },
        onStop: function(o) {
            valMovil = $(o).mbgetVal();
        }
    });

    $("#slider-movil.mb_slider .mb_sliderFooter").append('<span class=\"f1\">' + movilMin + ' MB</span><span class=\"f2\">' + valorTwoMovil + ' MB</span><span class=\"f3\">' + valorThreeMovil + ' MB</span><span class=\"f4\">' + movilMax + ' MB</span>');
};

function slideInternet(internetMax, internetMin, valorTwoInternet, valorThreeInternet) {
    $("#slider-internet").mbSlider({
        formatValue: function(val) {
            return "Internet";
        },
        onStop: function(o) {
            valInternet = $(o).mbgetVal();
        }
    });

    $("#slider-internet.mb_slider .mb_sliderFooter").append('<span class=\"f1\">' + internetMin + ' MBPS</span><span class=\"f2\">' + valorTwoInternet + ' MBPS</span><span class=\"f3\">' + valorThreeInternet + ' MBPS</span><span class=\"f4\">' + internetMax + ' MBPS</span>');
};

function slideTv(tvMax, tvMin, valorTwoTv, valorThreeTv) {
    $("#slider-tv").mbSlider({
        formatValue: function(val) {
            return "TV";
        },
        onStop: function(o) {
            valTv = $(o).mbgetVal();
        }
    });

    $("#slider-tv.mb_slider .mb_sliderFooter").append('<span class=\"f1\">' + tvMin + ' Canales HD</span><span class=\"f2\">' + valorTwoTv + ' Canales HD</span><span class=\"f3\">' + valorThreeTv + ' Canales HD</span><span class=\"f4\">' + tvMax + ' Canales HD</span>');
};

function slideFijo(fijoMax, fijoMin, valorTwoFijo, valorThreeFijo) {
    $("#slider-telefonia").mbSlider({
        formatValue: function(val) {
            return "Fijo";
        },
        onStop: function(o) {
            valFijo = $(o).mbgetVal();
        }
    });

    $("#slider-telefonia.mb_slider .mb_sliderFooter").append('<span class=\"f1\">' + fijoMin + ' MIN</span><span class=\"f2\">' + valorTwoFijo + ' MIN</span><span class=\"f3\">' + valorThreeFijo + ' MIN</span><span class=\"f4\">' + fijoMax + ' MIN</span>');
};

function agregarclassThis(tipo) {
    if (tipo == "movil") {
        $('.options .movil').addClass("this");
    } else if (tipo == "fijo") {
        $('.options .telefonia').addClass("this");
    } else if (tipo == "internet") {
        $('.options .internet').addClass("this");
    } else if (tipo == "canalesTv") {
        $('.options .tv').addClass("this");
    }
};

function removerClassThis(tipo) {
    if (tipo == "movil") {
        $('.options .movil').removeClass("this");
    } else if (tipo == "fijo") {
        $('.options .telefonia').removeClass("this");
    } else if (tipo == "internet") {
        $('.options .internet').removeClass("this");
    } else if (tipo == "canalesTv") {
        $('.options .tv').removeClass("this");
    }
};

function agregarClassOtros() {
    $('.options .telefonia, .options .internet, .options .tv').addClass("disabled");
};

function removerClassOtros() {
    $('.options .telefonia, .options .internet, .options .tv').removeClass("disabled");
};

function agregarClassMovil() {
    $('.options .movil').addClass("disabled");
};

function removerClassMovil() {
    $('.options .movil').removeClass("disabled");
};

var $margin = '';

function renderSlidePlan(arrayPlanes) {
    $('#idPlanesTabs').attr("data-render", "0");
    $('#idPlanesTabs').find('.planes').animate({ "left": "0px" })

    var $this = $('#idPlanesTabs');

    var $wplan = $this.find(".canvas").actual('width');
    var $wstep = 300;

    if ($(window).width() <= 480) {
        $wstep = 240;
    }

    var $tplan = arrayPlanes; 


    var $nplan = Math.max(1, Math.floor($wplan / $wstep));
    var $cplan = 0;

    $margin = Math.floor(($wplan - $wstep * $nplan) / (2 * $nplan));

    if ($this.attr("data-render") != "1") {
        $this.attr("data-render", "1");
        if ($nplan < arrayPlanes) {
            $("#idbuttonprev").remove();
            $("#idbuttonnex").remove();
            $this.append("<button id=\"idbuttonprev\" type=\"button\" class=\"btprev\"></button><button id=\"idbuttonnex\" type=\"button\" class=\"btnext\"></button>");
        }
        $this.attr("data-margin", $margin);
        $this.attr("data-wplan", $wplan);
        $this.attr("data-tplan", $tplan);
        $this.attr("data-nplan", $nplan);
        $this.attr("data-cplan", $cplan);

        $this.find(".btprev").click(function() {
            var $temp = $(this).parent();
            if (parseInt($temp.attr("data-cplan")) == 0) return;
            $temp.attr("data-cplan", parseInt($temp.attr("data-cplan")) - 1);
            $temp.find(".planes").animate({ "left": -parseInt($temp.attr("data-cplan")) * ($wstep + 2 * parseInt($temp.attr("data-margin"))) }, 350);
        });

        $this.find(".btnext").click(function() {
            var $temp = $(this).parent();
            if (parseInt($temp.attr("data-cplan")) == (parseInt($temp.attr("data-tplan")) - parseInt($temp.attr("data-nplan")))) return;
            $temp.attr("data-cplan", parseInt($temp.attr("data-cplan")) + 1);
            $temp.find(".planes").animate({ "left": -parseInt($temp.attr("data-cplan")) * ($wstep + 2 * parseInt($temp.attr("data-margin"))) }, 350);
        });
    }


    function onResizeSlide() {
            var $this = $('#idPlanesTabs');
            var $wplan = $this.find(".canvas").width();


            var $wstep = 300;

            if ($(window).width() <= 480) { $wstep = 240; }

            var $nplan = Math.floor($wplan / $wstep);

            var $margin = Math.floor(($wplan - $wstep * $nplan) / (2 * $nplan));

            var $cplan = $this.attr("data-cplan");
            $this.attr("data-margin", $margin);
            $this.attr("data-wplan", $wplan);
            $this.attr("data-nplan", $nplan);
            $this.find(".plan").css({ "margin":  "0 " + ($margin + 10) + "px 20px" });
            $this.find(".planes").css({ "left": -$cplan * ($wstep + 2 * $margin) });
    }
    $(window).resize(onResizeSlide);
};

function clickxPlan(arrayPlanesSelect, idplan) {
    var $this = $('#idPlanesTabs');

    var $wplan = $this.find(".canvas").actual('width');
    var $wstep = 300;
    if ($(window).width() <= 480) {
        $wstep = 240;
    }
    var $nplan = Math.max(1, Math.floor($wplan / $wstep));

    var index = '';
    var sumarIndex = 0;
    var i = 0;
    var restaArray = 0;
    var j;
    for (j = 0; j < arrayPlanesSelect.length; j++) {
        if (arrayPlanesSelect[j].idPlan == idplan) {
            index = j;
            break;
        }
    }

    var sumarIndex = index + 1;

    if ($nplan < sumarIndex) {
        var restaArray = index - $nplan;

        for (i = 0; i <= restaArray; i++) {
            $(".btnext").click();
        }
    } else {
    }

};



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
};

function mostrarConfirmacion() {
    $('#idProcesando').hide();
    $('#idConfirmacion').show();
};

function mostrarError() {
    $('#idProcesando').hide();
    $('#idConfirmacionError').show();
};

function esconderPopUp() {
    $popup.fadeOut(250);
};

var $popup;

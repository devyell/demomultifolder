var $wslide = $(window).width() - 20;
var $slide = 1;
var $timer = 0;

function initSlides() {
    $('.slide-consumo .slide').each(function(index, element) {
        var $dot = $("<div class=\"dot\">&nbsp;</div>").attr("data-pos", index);
        $('.dots').append($dot);
    });
    $('.dots .dot').click(function(e) {
        $pos = $(this).attr("data-pos");
        clearInterval($timer);
        $slide = parseInt($pos) + 1;
        gotoSlide();
    });
    $('.dots .dot:eq(0)').addClass("this");

    $('.bt.arrow-left').click(function() {
        clearInterval($timer);
        $slide--;
        if ($slide < 1) { $slide = 3; }
        gotoSlide();
    });
    $('.bt.arrow-right').click(function() {
        clearInterval($timer);
        $slide++;
        if ($slide > 3) { $slide = 1; }
        gotoSlide();
    });

    function gotoSlide() {
        $('.dots .dot').removeClass("this");
        $('.dots .dot:eq(' + ($slide - 1) + ')').addClass("this");
        $('.slide-consumo .slides').animate({ left: -($slide - 1) * $wslide }, 350);
    }
    $timer = setInterval(function() {
        $slide++;
        if ($slide > 3) { $slide = 1; }
        gotoSlide();
    }, 3000);
}


$(window).resize(onResizeScreen);

function onResizeScreen() {
    $wslide = $(window).width() - 20;
    $('.slide-consumo .slide').width($wslide);
    $('.slide-consumo .slides').css({ left: -($slide - 1) * $wslide });
}
onResizeScreen();


var chartHorarioNoMobile = '';
var chartHorarioMobile = '';
var chartTipoNoMobile = '';
var chartTipoMobile = '';
var chartDestinoNoMobile = '';
var chartDestinoMobile = '';

function renderizar(arrayRender, tipoDispositivo, indicador) {
    var $this = $('#' + tipoDispositivo);
    var $chart = $this.find(".canvas");
    var $opts = { responsive: true, title: { display: false }, legend: { display: false }, cutoutPercentage: 75 };
    var $ttext = [];
    var $tdata = [];
    $tdata = arrayRender;
    var $tcolor = [];
    var $total = 0;
    $this.find("li").each(function($j, el) {
        var $item = $(this);
        $ttext.push($item.find("span").css({ color: $item.attr("data-color") }).text());
        $tcolor.push($item.attr("data-color"));
        $item.find("span.square").css({ background: $item.attr("data-color") });
        $total = $total + parseInt($item.attr("data-value"));
    });
    if (indicador == 0) {
        Chart.defaults.global.legend.display = false;
        Chart.defaults.global.tooltips.enabled = false;
        var $data = { labels: $ttext, datasets: [{ data: $tdata, backgroundColor: [" #cccccc"], hoverBorderColor: "transparent" }] };
    } else {
        Chart.defaults.global.legend.display = true;
        Chart.defaults.global.tooltips.enabled = true;
        var $data = { labels: $ttext, datasets: [{ data: $tdata, backgroundColor: $tcolor, hoverBorderColor: "transparent" }] };
    }

    if (chartHorarioNoMobile != '' && tipoDispositivo === "horarioNoMobile") {
        chartHorarioNoMobile.destroy();
    }
    if (chartTipoNoMobile != '' && tipoDispositivo === "tipoNoMobile") {
        chartTipoNoMobile.destroy();
    }
    if (chartDestinoNoMobile != '' && tipoDispositivo === "destinoNoMobile") {
        chartDestinoNoMobile.destroy();
    }
    if (chartHorarioMobile != '' && tipoDispositivo === "horarioMobile") {
        chartHorarioMobile.destroy();
    }
    if (chartTipoMobile != '' && tipoDispositivo === "tipoMobile") {
        chartTipoMobile.destroy();
    }
    if (chartDestinoMobile != '' && tipoDispositivo === "destinoMobile") {
        chartDestinoMobile.destroy();
    }

    if (tipoDispositivo === "horarioNoMobile") {

        chartHorarioNoMobile = new Chart($chart, { responsive: true, type: 'doughnut', data: $data, options: $opts });
    } else if (tipoDispositivo === "tipoNoMobile") {

        chartTipoNoMobile = new Chart($chart, { responsive: true, type: 'doughnut', data: $data, options: $opts });
    } else if (tipoDispositivo === "destinoNoMobile") {

        chartDestinoNoMobile = new Chart($chart, { responsive: true, type: 'doughnut', data: $data, options: $opts });
    } else if (tipoDispositivo === "horarioMobile") {
        chartHorarioMobile = new Chart($chart, { responsive: true, type: 'doughnut', data: $data, options: $opts });
    } else if (tipoDispositivo === "tipoMobile") {
        chartTipoMobile = new Chart($chart, { responsive: true, type: 'doughnut', data: $data, options: $opts });
    } else if (tipoDispositivo === "destinoMobile") {
        chartDestinoMobile = new Chart($chart, { responsive: true, type: 'doughnut', data: $data, options: $opts });
    }

};

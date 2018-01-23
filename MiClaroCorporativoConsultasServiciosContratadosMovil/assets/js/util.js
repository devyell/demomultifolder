
function activeVerBolsasContratadasUtil(){

    $("#lblradio2").removeClass("checked");
    $("#lblradio1").addClass("checked");
    
    efectoOpenDiv( $("#id_bolsas_contratadas") );

    $("#id_linea_especifica").slideUp();
    $("#id_bolsas_contratadas").slideDown("slow");

}

function activeVerLineaEspecificaUtil(){

    $("#lblradio1").removeClass("checked");
    $("#lblradio2").addClass("checked");
    
    efectoOpenDiv( $("#id_linea_especifica") );

    $("#id_bolsas_contratadas").slideUp("slow");
    $("#id_linea_especifica").slideDown();
    
}

function initTabs() {
    $('.tabs').each(function(i,e){   
        var $tabs = $(this);    
        $tabs.find('.tab-links a').on('click', function(e) {
            var $this = $(this);
            if (!$this.parent().hasClass("disabled")) {
                
                var $thistab = $tabs.find($this.attr('href'));
                $this.parent('li').addClass('active').siblings().removeClass('active');
                $thistab.fadeIn(350).siblings().hide();

                
                $thistab.find('.counter').counterUp();
                
                var $time = 0; var $tpos = 0;
                $thistab.find('.box').each(function(ix,el){
                    var $tmp = $(this);
                    var $pos = $(this).offset().top;

                    if ($tpos != $pos) { $tpos = $pos; $time = $time + 150; }
                    $tmp.css({top: 20, opacity: 0}).stop().delay($time).animate({top: 0, opacity: 1}, 250);
                });
            }
            e.preventDefault();
        });
    });
}

function efectoOpenDiv(thisDIV){
    
    var $time = 0;
    var $tpos = 0;
    $(thisDIV).each(function(ix, el) {
        var $tmp = $(this);
        var $pos = $(this).offset().top;
        if ($tpos != $pos) {
            $tpos = $pos;
            $time = $time + 150;
        }
        $tmp.css({ top: 20, opacity: 0 }).stop().delay($time).animate({ top: 0, opacity: 1 }, 250);
    });

}

function animacionBox(){
    var $time = 0; var $tpos = 0;
    $('.box').each(function(ix,el){
        var $tmp = $(this);
        var $pos = $(this).offset().top;

        if ($tpos != $pos) { $tpos = $pos; $time = $time + 150; }
        $tmp.css({top: 20, opacity: 0}).stop().delay($time).animate({top: 0, opacity: 1}, 250);
    }); 
}


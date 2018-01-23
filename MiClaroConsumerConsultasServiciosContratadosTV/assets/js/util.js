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

function animacionBox(){
	var $time = 0; var $tpos = 0;
    $('.box').each(function(ix,el){
        var $tmp = $(this);
        var $pos = $(this).offset().top;

        if ($tpos != $pos) { $tpos = $pos; $time = $time + 150; }
        $tmp.css({top: 20, opacity: 0}).stop().delay($time).animate({top: 0, opacity: 1}, 250);
    });	
}


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

function consola_web(data){
    $(".navside").html("<pre id='wrapper_debug' style='font-size: 10px;''></pre>");
    $("#wrapper_debug").css("color", "#FFF");
    $("#wrapper_debug").append(JSON.stringify(data, null, '\t'));
}
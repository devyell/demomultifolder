function animacionBox(){
    var $time = 0; var $tpos = 0;
    $('.step-chip-3').each(function(ix,el){
        var $tmp = $(this);
        var $pos = $(this).offset().top;

        if ($tpos != $pos) { $tpos = $pos; $time = $time + 150; }
        $tmp.css({top: 20, opacity: 0}).stop().delay($time).animate({top: 0, opacity: 1}, 250);
    }); 
}

function animacionBoxChips(){
    var $time = 0; var $tpos = 0;
    $('.table-plan').each(function(ix,el){
        var $tmp = $(this);
        var $pos = $(this).offset().top;

        if ($tpos != $pos) { $tpos = $pos; $time = $time + 150; }
        $tmp.css({top: 20, opacity: 0}).stop().delay($time).animate({top: 0, opacity: 1}, 250);
    }); 
}

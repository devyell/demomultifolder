function efectoCargandoListaPaquete(){
    var $time = 0; var $tpos = 0;
    $('.detail').each(function(ix,el){
        var $tmp = $(this);
        var $pos = $(this).offset().top;

        if ($tpos != $pos) { $tpos = $pos; $time = $time + 150; }
        $tmp.css({top: 20, opacity: 0}).stop().delay($time).animate({top: 0, opacity: 1}, 250);
    });
}

function efectoCargandoDireccion(){
    var $time = 0; var $tpos = 0;
    $('.wps_direccion_box').each(function(ix,el){
        var $tmp = $(this);
        var $pos = $(this).offset().top;

        if ($tpos != $pos) { $tpos = $pos; $time = $time + 150; }
        $tmp.css({top: 20, opacity: 0}).stop().delay($time).animate({top: 0, opacity: 1}, 250);
    }); 
}

$.urlParam = function(name){
    var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results==null){
       return null;
    }
    else{
       return results[1] || 0;
    }
}
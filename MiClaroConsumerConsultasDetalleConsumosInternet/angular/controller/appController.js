miClaroApp.controller("MiClaroHomeController", function ($scope, $http, $httpParamSerializer){

$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';

    
    $(document).ready(function(e) {

    	var $time = 0; var $tpos = 0;
        var $tmp = $('.avisoBox');
        var $pos = $('.avisoBox').offset().top;

        if ($tpos != $pos) { $tpos = $pos; $time = $time + 150; }
        $tmp.css({top: 20, opacity: 0}).stop().delay($time).animate({top: 0, opacity: 1}, 250);
        
    });    
           
});

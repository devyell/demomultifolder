
var $popup = $('.popup');
	function showPopUpFromFile($file) {
	   $h = $(window).height();
		var $pop = $(".popup .pop");
		var $cnt = $popup.find('.content');
		$cnt.html("").hide();
		$cnt.load($file, function() { $cnt.fadeIn(250); initFormFields(); });

		$pop.css({'margin-top': Math.round( ($h-300)/2) });
		$popup.fadeIn(350);
	}

	$('.popup .btclose, .popup .bg').click(function(){
        hidePopUp();
    });

	
	function hidePopUp() {
		$popup.fadeOut(250); 
	}
	
/*
* Author: Abhi Ghosh (abhighosh)
* Created: 5/11/2013
* Date: 5/11/2013
* Website: http://www.abhighosh.co.uk/stickymenu
* Description: Sticks elements smoothly to the top of a page, animating on touch devices as necessary
 */

;(function ( $, window, document, undefined ) {
    
    var pluginName = 'stickymenu',
        defaults = {
'offset': 0,
'neverAnimate': false,
'touchDisable': false
        };

    function stickymenu( element, options ) {
        this.element = element;
		
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
		
		var offsetFromTop = this.options.offset;
		var touchUI = false;
		
//If not IE6 or older browser and not touch device
if (((typeof document.body.style.maxHeight != "undefined") && !('ontouchstart' in document)) || (this.options.neverAnimate == true)) {
	//If IE7 or newer or other modern browser, position:fixed is supported so disable animations; menu will stick as required without this.
    var animationEnabled = false;
	var disable = false;
	//If IE6 or older with the user option never animate set to true disable the effect altogether
	if(typeof document.body.style.maxHeight == "undefined"){
	disable = true;
	}
    } else{
	//If IE6, enable animations as position: fixed is unsupported, and using absolute positioning alone leads to loss of smooth tracking of element. 
	//On touch devices, the scroll event is only triggered on finishing scroll, so enable animations by default.
    var animationEnabled = true;
	var disable = false;
}
	
	//If user has chosen to disable the effect altogether on touch
	if('ontouchstart' in document && this.options.touchDisable == true){
	if(this.options.touchDisable == true){
	disable = true;
	} 
	}else if('ontouchstart' in document){
		//Otherwise touchUI mode is enabled
		touchUI = true;
	}

//Ensure the sticky menu element defined exists in the document
  if (!!$(element).offset() && disable == false) {
	
	//Get the initial offset of the sticky element
    var stickyTop = $(element).offset().top;
	var stickyLeft = $(element).offset().left;
	
	//Get the height, width and float of the sticky element
	var stickyHeight = $(element).innerHeight();
	var stickyWidth = $(element).innerWidth();
	var stickyFloat = $(element).css('float');
	var currentTop = 0;
	var currentleft = 0;
	
	//Create a name for our replacement div
	var replacementDiv = "sticky-replacement-"+$(element).attr('id');
	
	//Insert replacement div before the element with correct replacement attributes.
	$(element).before("<div id='"+replacementDiv+"' style='display: block; margin: 0; padding: 0; height:"+stickyHeight+"px; width:"+stickyWidth+"px; float:"+stickyFloat+"'>&nbsp</div>");
	
	//If the top offset is more than 0
	if(stickyTop>0){
	
	//Set absolute positioning of sticky menu as per calculated values
	 $(element).css({ 'width': stickyWidth, position: 'absolute', top: stickyTop, left: stickyLeft});
	 
	//Function to be called on scrolling
    var moveElement = function () {
	
	//Returns the distance the user has scrolled top and left
      var windowTop = $(window).scrollTop();
	  var windowLeft = $(window).scrollLeft();
	  //Check if the user has scrolled past the sticky menu element threshold
      if (stickyTop < (windowTop+offsetFromTop)){
		 
		  //If animation is disabled
	  if(animationEnabled == false){
		  
		  //Set position to fixed. Set left value for horizontal scrolling support if required.
		  $(element).css({ position: 'fixed', top: offsetFromTop, left:  stickyLeft-windowLeft});
		  } else {
		  //If animations are enabled and touch UI is not enabled, animate from current position to distance user has scrolled
		  if (touchUI == false){
		  $(element).animate({top: windowTop+offsetFromTop}, 200);
		  } else if($(element).css('position') != 'fixed'){
			 //If touch UI is enabled, animate, but set position fixed afterwards (unless position already fixed) 
		  $(element).animate({top: windowTop+offsetFromTop, left: stickyLeft}, 200, function(){
				$(element).css({ position: 'fixed', top: offsetFromTop, left:  stickyLeft-windowLeft});
			   });
		  }
		  }
	}
	  
	  //If user has scrolled back up above the sticky menu element
      else {
		  
		  //If animation is disabled
		  if(animationEnabled == false){
			  
			  //Set position to absolute, setting left value for horizontal scrolling support if required.
		  $(element).css({ position: 'absolute', top: stickyTop, left:  stickyLeft});
		  } else {
	//If touchUI is disabled and animations are also enabled, animate from current position to distance user has scrolled
			   if (touchUI == false){
	$(element).animate({top: stickyTop}, 200);
	} else if($(element).css('position') != 'absolute'){
		//If touch UI is enabled, animate, setting position absolute initially to animate correctly
		
		//Find current position
		var currentTop = $(element).offset().top;
		var currentLeft = $(element).offset().left;
		//Set current position as absolute
		$(element).css({ position: 'absolute', top: currentTop, left: currentLeft});
		$(element).animate({top: stickyTop, left:stickyLeft}, 200, function(){
				$(element).css({ position: 'absolute', top: stickyTop, left:stickyLeft});
			   });
	}
		  }
      }
	  
	  //Touchdevices: Check user horizontal scroll, continue if 
	  if(touchUI == true && $(element).css('position') == 'fixed'){
		  
		  
		  $(element).animate({left: stickyLeft-windowLeft}, 200)
		  }
	  
    };
	
	//Define timer to delay animation
	var timer;
	
	//On window scroll
    $(window).bind('scroll',function () {
		
		//If animations are enabled, set the delay for calling our scroll function
		if(animationEnabled == true){
        clearTimeout(timer);
        timer = setTimeout( moveElement , 50 );
		} else {
		
		//If animations are disabled, call scroll function on each scroll event
			moveElement();
		}
    });
	
	//If window is resized, get the left offset of the replacement div to calculate the required left offset of the sticky element
	$(window).resize(function() {
		stickyLeft = $("#"+replacementDiv).offset().left;
		$(element).css({left:  stickyLeft});
  
});
 
//Load the move menu function on page load
if('ontouchstart' in document){
	$(window).scrollTop(0);
	} else {
		moveElement();
	}

} else {
	//If the top offset is 0, set the width and height of the element appropriately and set it to fixed
	var stickyHeightRaw = $(element).height();
	var stickyWidthRaw = $(element).width();
	$(element).css({position: 'fixed', top: 0, height: stickyHeightRaw, width: stickyWidthRaw});
}	
	}
        
        this.init();
    }

    stickymenu.prototype.init = function () {


    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, 
                new stickymenu( this, options ));
            }
        });
    }

})( jQuery, window, document );
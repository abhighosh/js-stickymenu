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
'minWidth': -1,
'duration': 350,
'neverAnimate': false,
'touchDisable': false
        };

    function stickymenu( element, options ) {
        this.element = element;
		
        this.options = $.extend( {}, defaults, options) ;
        
        this._defaults = defaults;
        this._name = pluginName;
		
		var offsetFromTop = this.options.offset;
		var minWidth = this.options.minWidth;
		var duration = this.options.duration;
		var touchUI = false;
		
//If not IE6 or older browser and not touch device
if (((typeof document.body.style.maxHeight != "undefined") && !('ontouchstart' in document)) || (this.options.neverAnimate == true)) {
	//If IE7 or newer or other modern browser, position:fixed is supported so disable animations; menu will stick as required without this.
    var animationEnabled = false;
	var disable = false;
	//If IE6 or older with the user option never animate set to true, disable the effect altogether
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
		//Otherwise on touch devices, touchUI mode is enabled
		touchUI = true;
	}

//Ensure the sticky menu element defined exists in the document
  if (!!$(element).offset() && disable == false) {
	
	  //Create a name for our wrapper
	 var wrapperDiv = "sticky-replacement-"+$(element).attr('id');
	 //Wrap our element in the wrapper
	 var wrapper = $(element).wrap('<div class="'+wrapperDiv+'" />');
	  
	//Get and store the initial offset and dimensions of the original element
	 $.data(wrapper, "stickyLocation", { stickyTop: wrapper.offset().top, stickyLeft: wrapper.offset().left, stickyWidth: wrapper.width(), stickyHeight: wrapper.height() });
	 
	  //Create clone of wrapper. We will be working with this clone instead of the original element
	  var wrapper_clone = wrapper.clone().insertBefore(wrapper);
	//Set original div visibility to hidden, and remove its id attribute to prevent conflict
	 wrapper.css({'visibility':'hidden'});
	 wrapper.removeAttr('id');
	
	//Set position of clone to absolute
	 wrapper_clone.css({position: 'absolute', width: $.data(wrapper, "stickyLocation").stickyWidth, height: $.data(wrapper, "stickyLocation").stickyHeight, top: $.data(wrapper, "stickyLocation").stickyTop, left: $.data(wrapper, "stickyLocation").stickyLeft});
	  
	
	 
	 if($.data(wrapper, "stickyLocation").stickyTop == 0){
		wrapper_clone.css({position: 'fixed', width: $.data(wrapper, "stickyLocation").stickyWidth, height: $.data(wrapper, "stickyLocation").stickyHeight, top: $.data(wrapper, "stickyLocation").stickyTop, left: $.data(wrapper, "stickyLocation").stickyLeft});
	}
	 
	//The function to call on scrolling
	var moveElement = function(){
		//If not under min width
	if(minWidth<0 || $(window).width()>minWidth){
		
	wrapper_clone.css({'z-index': '9999'});
		
		//If the offset is 0, keep the position fixed at all times. This avoids unnecessary calculation and is slightly less jerky in IE
		if($.data(wrapper, "stickyLocation").stickyTop == 0){
		wrapper_clone.css({position: 'fixed', width: $.data(wrapper, "stickyLocation").stickyWidth, height: $.data(wrapper, "stickyLocation").stickyHeight, top: $.data(wrapper, "stickyLocation").stickyTop, left: $.data(wrapper, "stickyLocation").stickyLeft});
		} else {
		
		//Returns the distance the user has scrolled top and left
      var windowTop = $(window).scrollTop();
	  var windowLeft = $(window).scrollLeft();
	  //Check if the user has scrolled past the sticky menu element threshold
      if ($.data(wrapper, "stickyLocation").stickyTop < (windowTop+offsetFromTop)){
		  //If animations disabled
		  if(animationEnabled == false){
			   wrapper_clone.css({ position: 'fixed', top: offsetFromTop, left:  $.data(wrapper, "stickyLocation").stickyLeft-windowLeft});
			   } 
		  //If animations enabled
		  else {
				 //If touch UI is enabled, animate using fixed positioning unless position is already fixed
				if (touchUI == true && wrapper_clone.css('position') != 'fixed'){
					
				//Stop any previous animation
				wrapper_clone.stop(true, false);
				//Calculate current offsets
				var currentTop = wrapper_clone.offset().top;
				var currentLeft = wrapper_clone.offset().left;
				
				//If user is over the element height below, animate from above the view
				if ((windowTop-currentTop) > wrapper_clone.outerHeight()){
					var offsetFrom = -wrapper_clone.outerHeight();
					} else {var offsetFrom = currentTop - windowTop;}
				//Animate from the calculated offset
				wrapper_clone.css({ position: 'fixed', top: offsetFrom, left:  currentLeft-windowLeft});
				wrapper_clone.animate({top: offsetFromTop, left: $.data(wrapper, "stickyLocation").stickyLeft-windowLeft}, duration);
				}
				//If touch UI is disabled, animate using absolute positioning and do not set fixed position afterwards
				if (touchUI == false){
				 wrapper_clone.animate({top: windowTop+offsetFromTop, left: $.data(wrapper, "stickyLocation").stickyLeft}, duration);  
			   }
			   
			   }
			   } 
	  //If user is back above the sticky menu threshold
	  else {
			//If animations are disabled
		  if(animationEnabled == false){
		//Set position to absolute as original
		  wrapper_clone.css({ position: 'absolute', top: $.data(wrapper, "stickyLocation").stickyTop, left:  $.data(wrapper, "stickyLocation").stickyLeft});
		  } 
		  else{
		  if (wrapper_clone.css('position') != 'absolute'){
			  //Stop any previous animation
				wrapper_clone.stop(true, false);
		//Find current distance of element from top
			var currentTop = wrapper_clone.offset().top;
			var currentLeft = wrapper_clone.offset().left;
			  
			//t
			
			wrapper_clone.animate({top: $.data(wrapper, "stickyLocation").stickyTop-windowTop, left:$.data(wrapper, "stickyLocation").stickyLeft-windowLeft}, duration,function(){
			wrapper_clone.css({ position: 'absolute', top: $.data(wrapper, "stickyLocation").stickyTop, left: $.data(wrapper, "stickyLocation").stickyLeft});
			});
			} else {
				//Replace current position as absolute
		wrapper_clone.css({ position: 'absolute', top: currentTop, left: currentLeft});
		//Animate to original position
		wrapper_clone.animate({top: $.data(wrapper, "stickyLocation").stickyTop, left:$.data(wrapper, "stickyLocation").stickyLeft}, duration);
			}
		  }
			   }
	  
		  }
		} else{
			wrapper_clone.css({'z-index': '1'});
		}
		  
		  
		  }
	
	var resizeWindow = function(){

					//Get and store the new offset and dimensions of the original element
	 $.data(wrapper, "stickyLocation", { stickyTop: wrapper.offset().top, stickyLeft: wrapper.offset().left, stickyWidth: wrapper.width(), stickyHeight: wrapper.height() });

	//If not under min width
		if(minWidth<0 || $(window).width()>minWidth){
			wrapper_clone.css({'z-index': '9999'});

	 
	 if(wrapper_clone.css('position') != 'fixed'){
	 wrapper_clone.css({position: 'absolute', width: $.data(wrapper, "stickyLocation").stickyWidth, height: $.data(wrapper, "stickyLocation").stickyHeight, top: $.data(wrapper, "stickyLocation").stickyTop, left: $.data(wrapper, "stickyLocation").stickyLeft});
	 } else{
	wrapper_clone.css({ position: 'fixed', width: $.data(wrapper, "stickyLocation").stickyWidth, height: $.data(wrapper, "stickyLocation").stickyHeight, top: offsetFromTop, left:  $.data(wrapper, "stickyLocation").stickyLeft});
	 }
	 } else {
		 wrapper_clone.css({'z-index': '1'});
		 wrapper_clone.css({position: 'absolute', width: $.data(wrapper, "stickyLocation").stickyWidth, height: $.data(wrapper, "stickyLocation").stickyHeight, top: $.data(wrapper, "stickyLocation").stickyTop, left: $.data(wrapper, "stickyLocation").stickyLeft});
	 }
	}
	  
	 
	
	//Define timer to delay animation
	var timer;
	
	//On window scroll
    $(window).bind('scroll',function () {
		
		//If animations are enabled, set the delay for calling our scroll function
		if(animationEnabled == true && touchUI == false){
        clearTimeout(timer);
        timer = setTimeout( moveElement , 50 );
		} else {
		
		//If animations are disabled, call scroll function on each scroll event
			moveElement();
		}
    });
 

//If window is resized
	$(window).resize(function() {
		resizeWindow();
});

//Load the move menu function on page load
if('ontouchstart' in document){
	$(window).scrollTop(0);
	} else {
		moveElement();
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
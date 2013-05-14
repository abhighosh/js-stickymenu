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
	
	 //Remove margins to ensure consistent cross browser behaviour
	 $(element).css({'margin' : 0});
	 
	 //Wrap our element in the element
	 var element = $(element);
	  
	//Get and store the initial offset and dimensions of the original element
	 $.data(element, "stickyLocation", { stickyTop: element.offset().top, stickyLeft: element.offset().left, stickyWidth: element.width(), stickyHeight: element.height() });
	 
	  //Create clone of element. We will be working with this clone instead of the original element
	  var element_clone = element.clone().insertBefore(element);
	//Set original div visibility to hidden, and remove its id attribute to prevent conflict
	 element.css({'visibility':'hidden'});
	 element.removeAttr('id');
	
	//If element offset from top is 0, set position to fixed and set dimensions appropriately
	 if($.data(element, "stickyLocation").stickyTop == 0){
		element_clone.css({position: 'fixed', width: $.data(element, "stickyLocation").stickyWidth, height: $.data(element, "stickyLocation").stickyHeight, top: $.data(element, "stickyLocation").stickyTop, left: $.data(element, "stickyLocation").stickyLeft});
		} else {
	//Otherwise set position of clone to absolute and set dimensions appropriately
	 element_clone.css({position: 'absolute', width: $.data(element, "stickyLocation").stickyWidth, height: $.data(element, "stickyLocation").stickyHeight, top: $.data(element, "stickyLocation").stickyTop, left: $.data(element, "stickyLocation").stickyLeft}); 
		}
	 
	//The function to call on scrolling
	var moveElement = function(){
	//If window width is not under min width, continue
	if(minWidth<0 || $(window).width()>minWidth){
	//Set z-index above other elements
	element_clone.css({'z-index': '9999'});
		
		//If the offset is 0, keep the position fixed at all times. This is less jerky in IE.
		if($.data(element, "stickyLocation").stickyTop == 0){
		element_clone.css({position: 'fixed', width: $.data(element, "stickyLocation").stickyWidth, height: $.data(element, "stickyLocation").stickyHeight, top: $.data(element, "stickyLocation").stickyTop, left: $.data(element, "stickyLocation").stickyLeft});
		} else {
		//Returns the distance the user has scrolled top and left
      var windowTop = $(window).scrollTop();
	  var windowLeft = $(window).scrollLeft();
	  //Check if the user has scrolled past the sticky menu element threshold
      if ($.data(element, "stickyLocation").stickyTop < (windowTop+offsetFromTop)){
		  //If animations disabled
		  if(animationEnabled == false){
			  //Set position to fixed
			   element_clone.css({ position: 'fixed', top: offsetFromTop, left:  $.data(element, "stickyLocation").stickyLeft-windowLeft});
			   } 
		  //If animations enabled
		  else {
				 //If touch UI is enabled, animate using fixed positioning unless position is already fixed
				if (touchUI == true){
					
				//Stop any previous animation
				element_clone.stop(true, false);
				
				//Calculate current offsets
				var currentTop = element_clone.offset().top;
				var currentLeft = element_clone.offset().left;
				
				//If user is over the element height below, animate from just above the view
				if ((windowTop-currentTop) > element_clone.outerHeight()+offsetFromTop){
					var offsetFrom = -element_clone.outerHeight();
					} else {var offsetFrom = currentTop - windowTop;}

				//Animate from the calculated offset
				element_clone.css({ position: 'fixed', top: offsetFrom, left:  currentLeft});
				element_clone.animate({top: offsetFromTop, left: $.data(element, "stickyLocation").stickyLeft-windowLeft}, duration);
				}
				
				//If touch UI is disabled, animate using absolute positioning
				if (touchUI == false){
				 element_clone.animate({top: windowTop+offsetFromTop, left: $.data(element, "stickyLocation").stickyLeft}, duration);  
			   }
			   
			   }
			   } 
	  //If user is back above the sticky menu threshold
	  else {
			//If animations are disabled
		  if(animationEnabled == false){
		//Set position to absolute with original position
		  element_clone.css({ position: 'absolute', top: $.data(element, "stickyLocation").stickyTop, left:  $.data(element, "stickyLocation").stickyLeft});
		  } 
		  else{
			  //If animations are enabled and position is not already absolute
		  if (element_clone.css('position') != 'absolute'){
			  //Stop any previous animation
				element_clone.stop(true, false);
		//Find current distance of element from top
			var currentTop = element_clone.offset().top;
			var currentLeft = element_clone.offset().left;
			  
			//Animate using fixed positioning and set position absolutely afterwards
			element_clone.animate({top: $.data(element, "stickyLocation").stickyTop-windowTop, left:$.data(element, "stickyLocation").stickyLeft-windowLeft}, duration,function(){
			element_clone.css({ position: 'absolute', top: $.data(element, "stickyLocation").stickyTop, left: $.data(element, "stickyLocation").stickyLeft});
			});
			}
		  //If animations are enabled and position is already absolute
		  else {
		//Replace current position with calculated absolute positions
		element_clone.css({ position: 'absolute', top: currentTop, left: currentLeft});
		//Animate to original position using absolute positioning
		element_clone.animate({top: $.data(element, "stickyLocation").stickyTop, left:$.data(element, "stickyLocation").stickyLeft}, duration);
			}
		  }
			   }
	  
		  }
		}
	//If width is below minimum width, set standard z-index
	else{
			element_clone.css({'z-index': '1'});
		}
		  }
	
	//Function to run on resizing window
	var resizeWindow = function(){
	//Get and store the new offset and dimensions of the original element element
	 $.data(element, "stickyLocation", { stickyTop: element.offset().top, stickyLeft: element.offset().left, stickyWidth: element.width(), stickyHeight: element.height() });

	//If min width not set or width is over minumum width
		if(minWidth<0 || $(window).width()>minWidth){
			//Set element z-index to above other elements
			element_clone.css({'z-index': '9999'});

	 //If position is absolute
	 if(element_clone.css('position') != 'fixed'){
		 //Set position and dimensions according to new offset and dimensions
	 element_clone.css({position: 'absolute', width: $.data(element, "stickyLocation").stickyWidth, height: $.data(element, "stickyLocation").stickyHeight, top: $.data(element, "stickyLocation").stickyTop, left: $.data(element, "stickyLocation").stickyLeft});
	 } 
	 //If position is fixed
	 else{
		 //Set position and dimensions according to new offset and dimensions if not animating already
		 if( !(element_clone.is(':animated'))) {
	element_clone.css({ position: 'fixed', width: $.data(element, "stickyLocation").stickyWidth, height: $.data(element, "stickyLocation").stickyHeight, top: offsetFromTop, left:  $.data(element, "stickyLocation").stickyLeft});
}	
		 }
	 } 
		//If width is under minimum width
		else {
		
		 //Set z-index back to standard
		 element_clone.css({'z-index': '1'});
		 
		 //Set position to absolute and positioning an dimensions to new offset and dimensions
		 element_clone.css({position: 'absolute', width: $.data(element, "stickyLocation").stickyWidth, height: $.data(element, "stickyLocation").stickyHeight, top: $.data(element, "stickyLocation").stickyTop, left: $.data(element, "stickyLocation").stickyLeft});
	 }
	}
	  
	 
	
	//Define timer to delay animation
	var timer;
	
	//On window scroll
    $(window).bind('scroll',function () {
		
		//If animations are enabled, set the delay for calling our scroll function. Delay is required to avoid repeated calls in IE6.
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

//If user is using a touch device
if('ontouchstart' in document){
	//Set location back to top on refresh
	$(window).scrollTop(0);
	} else {
		//if user is not using a touch event, call move element function
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
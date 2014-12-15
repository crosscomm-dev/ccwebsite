if($('html.ie8').length > 0) {
  
  ieSetup();
  
} else {
  
  (function ($) {

    // Setup variables
    window.$window = $(window);
    window.$body = $('body');
    window.$slide = $('.slide-wrap');
    window.$slideAuto = $('.slide-auto');
    window.$slideHalf = $('.slide-half');
    window.SKROLLR_O;
    window.SCROLLING_CLICKED = true;         
    window.SHERPA_CLICKED = false; 
    
    /**
     * Image Preloader   
     */    
    $body.imagesLoaded( function() {
      initSkroll();
      adjustWindow();                      
    });

    /**
     * Initialize skrollr plugin
     */
    function initSkroll() {
      // Init Skrollr
      SKROLLR_O = skrollr.init();
    }
    
    /**
     * Close mobile menu on click
     */
    $(document).on('click','.navbar-collapse.in',function(e) {
      if( $(e.target).is('a') && $(e.target).attr('class') != 'dropdown-toggle' ) {
          $(this).collapse('hide');
      }
    });


    /**
     * Set the window size based on class
     */
    function adjustWindow(){            
      // Get window size
      winH = $window.height();

      // Keep minimum height 550
      if(winH <= 500) {
        winH = 500;
      } 

      // Resize our slides
      $slide.height(winH);
      $slideAuto.height('auto');      
      $slideHalf.height(winH/2);

      // Refresh Skrollr after resizing our sections
      if(SKROLLR_O) {
        SKROLLR_O.refresh($slide); 
      }        
    }



  } )( jQuery );
  
}
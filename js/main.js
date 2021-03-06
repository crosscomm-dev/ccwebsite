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
      setUnderline();
      jumpToHash();
    });

    /**
     * Initialize skrollr plugin
     */
    function initSkroll() {
      // Init Skrollr
      SKROLLR_O = skrollr.init();

      // Initialize Skrollr menu
      skrollr.menu.init(SKROLLR_O, {
        easing: 'outCubic',
        animate: true,
        duration: 1500
      }); 
    }

    /**
     * Update hash and menu when scrolling   
     */
    $(window).scroll(function(e){    
      if(!SCROLLING_CLICKED) {
        _.throttle(updateHash(), 300);
      }
    })

    /**
     * Update hashtag and menu when sections are in view
     */
    function updateHash()
    {
      var minHeight = $(window).scrollTop()
      var maxHeight = $(window).height()
      var middleHeight = (maxHeight + minHeight) / 2;
      var visibleElements = $("section.slide-wrap").filter(":in-viewport")
      var $midElement;
      var distance = null;
      var currDistance = 0;
      visibleElements.each(function(index, element) {          
          currDistance = Math.abs(middleHeight - $(element).offset().top);
          if($(element).data('id') == 'home' || $(element).data('id') == 'connect') {
            currDistance = currDistance/2;
          }
          if ( distance == null || currDistance < distance ) {
              $midElement = $(element);
              distance = currDistance;
          }
      });

      if($midElement) {
        var newHash = '#'+$midElement.data('id');
        $('#top-menu ul li a').removeClass('selected');
        $('a[href='+newHash+']').addClass('selected');
        if(window.history.replaceState) {
          window.history.replaceState( null , null, newHash );
        } else {
          // Fallback
          window.location.hash = newHash;
        } 
      }
    }    

    /**
     * Jump to the hashed section
     */
    function jumpToHash()
    {    
      if(window.location.hash != '') {
        SCROLLING_CLICKED = true;
        $('a[href='+window.location.hash+']').addClass('selected');
        var $section = $(window.location.hash);      
        var menuOffset = $section.data('menu-offset');
        menuOffset = (menuOffset != undefined) ? menuOffset : 0;
        var scrollPoint = $section.offset().top;
        var scrollDuration = (scrollPoint < 3000) ? scrollPoint/2 : scrollPoint/3;
        $('body').animate({
            scrollTop: scrollPoint + menuOffset
        }, 1500, function(){
          SCROLLING_CLICKED = false;
        });
      } else {
        SCROLLING_CLICKED = false;
      }

    }    

    /**
     * Initialize slider
     */
    $('.carousel').carousel({
      interval: false
    })

    /**
     * Slider menu click action
     */
    $('#about_us_content .navigation ul li a').on('click', function(event) {
      event.preventDefault();
      $this = $(this);
      $('#about_us_content .navigation ul li a').removeClass('active');
      $this.addClass('active');
      setUnderline();
      setTimeout(function(){
        adjustWindow()
      }, 1200);
    });    

    /**
     * Slider menu underline
     */
    function setUnderline() {
      var $selectedLink = $('#about_us_content .navigation a.active');
      var $underline = $('#about_us_content .navigation .link-underline');
      var $firstLink = $('#about_us_content .navigation a:first-child');  
      $link = ($selectedLink.length == 0) ? $firstLink : $selectedLink;    
      var extraWidth = 10;
      var linkWidth = $link.width()+extraWidth;
      var parent = $('#about_us_content').offset();
      var posTop = $link.position().top + 25;
      var posLeft = $link.position().left - extraWidth/2;
      $style = ($selectedLink.length == 0) 
                ? {'top':posTop+'px', 'left': posLeft+'px', 'width': linkWidth+'px', 'opacity': 0}
                : {'top':posTop+'px', 'left': posLeft+'px', 'width': linkWidth+'px', 'opacity': 1};
      $underline.animate($style, 400, 'linear');        
    }

    /**
     * Top menu click action
     */
    $('#top-menu ul li a').on('click', function(event) { 
      SCROLLING_CLICKED = true;
      $('#top-menu ul li a').removeClass('selected');
      $(this).addClass('selected');    
      setTimeout(function(){
        SCROLLING_CLICKED = false; 
      }, 2000);
    }); 

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

    /**
     * Resize event action
     */
    $(window).resize(function(event) {    
      setUnderline();
      setTimeout(function(){
        adjustWindow()
      }, 800);
    });

    /**
     * Show service description when clicked on the green (mountain) buttons   
     */
    $('#sherpa a.green-circle').on('click', function(event) {    
      event.preventDefault();
      $this = $(this);

      if(SHERPA_CLICKED) {
        return;
      }

      SHERPA_CLICKED = true;   
      if($this.hasClass('selected')) {
        $this.removeClass('selected');
        var classStep = 'step-default';
      } else {
        $('#sherpa a.green-circle.selected').removeClass('selected');
        $this.addClass('selected');
        var classStep = 'step-' + $this.data("step");                        
      }    
      var $fadeOut = $('#sherpa .description > div[class*=showing]');    
      var $fadeIn = $('#sherpa .description > div[class*='+classStep+']');
      $fadeOut.animate({
        opacity: 0 },
        300, function() {        
        $fadeOut.css('display', 'none').removeClass('showing');
        $fadeIn.css('display', 'block').animate({        
          opacity: 1},
          300, function() {
          $fadeIn.addClass('showing');
          SHERPA_CLICKED = false;
        });  
      });
    }).dblclick(function(e){
      e.stopPropagation();
      e.preventDefault();
      return false;
    });

    /**
     * Initialize tooltipster plugin
     */
    $('.tooltip-1').tooltipster({
      position: 'bottom',    
      trigger: 'click',
      delay: '100',
      maxWidth: '250',
      offsetY: '20'    
    });

    $('.tooltip-2').tooltipster({
      position: 'bottom',    
      trigger: 'click',
      delay: '100',
      maxWidth: '250',
      offsetY: '40'
    });

	/**
     * Prevent default on tooltip link
     */

    $('.tooltip-1').on("click", function(e) {
         e.preventDefault();
    });

    $('.tooltip-2').on("click", function(e) {
         e.preventDefault();
    });

  } )( jQuery );
}
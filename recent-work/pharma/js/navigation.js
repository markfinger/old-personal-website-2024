(function($) {
  'use strict';

  var scrollOffset = 70;

  $(setupWaypoints);

  function setupWaypoints(){
    var $nav = $('.nav');
    var $activeSection;

    $nav.find('a').click(function(e){
      var href = $(this).attr('href');
      var scrollY = $(href).offset().top - scrollOffset;
      $.scrollTo({top: scrollY, left: 0}, {duration: 350, onAfter: function(){
        var id = href.slice(1);
        // XXX should we update the hash?
        // window.location.hash = href;
        makeActive(id);
      }});
      e.preventDefault();
    });

    $('#section-container section').waypoint({
      handler: function(){
        makeActive(this.id);
      }
    });

    function makeActive(id){
      if ($activeSection){
        $activeSection.removeClass('active');
      }
      $activeSection = $nav.find('li[data-link=' + id + ']');
      $activeSection.addClass('active');
    }
  }

}($));
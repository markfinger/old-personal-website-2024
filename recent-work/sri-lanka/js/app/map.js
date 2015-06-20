define([
  'jquery',
  'events',
  'scrollTo'
], function($, events) {

  var jaffnaMap;
  var navbar;
  var mapScrollToOffset = -15; // Bit of extra spacing

  var setBindings = function() {
    if (/jaffna-map/.test(location.hash)) {
      events.on('loading:complete', function() {
        var navbarHeight = navbar.outerHeight();
        var jaffnaMapHeight = jaffnaMap.outerHeight();
        var scrollToPosition = jaffnaMap.offset().top - navbarHeight;

        // If the window is tall enough, center the map in the screen
        var availableScreenHeight = window.innerHeight - navbarHeight;
        if ((jaffnaMapHeight + mapScrollToOffset) < availableScreenHeight) {
          scrollToPosition -= (availableScreenHeight - jaffnaMapHeight) / 2;
        // Else, offset the scrollTo position slightly
        } else {
          scrollToPosition += mapScrollToOffset;
        }

        $.scrollTo(scrollToPosition);
      });
    }
  };

  var init = function() {
    jaffnaMap = $('#jaffna-map-wrapper');
    navbar = $('.navbar');
    setBindings();
  };

  return {
    init: init
  };

});
(function($) {
  'use strict';

  var init = function() {
    if (
      window.localStorage &&
      localStorage.getItem &&
      !localStorage.getItem('serco-story-popup')
    ) {
      $('#about').modal();
      localStorage.setItem('serco-story-popup', true);
    }
  };

  $(init);

})(jQuery);
(function($) {
  'use strict';

  var LoadingOverlay = function(el) {
    _.bindAll(this);
    this.$el = el;
  };

  LoadingOverlay.prototype = {

    dismiss: function(delay) {
      var $el = this.$el;
      setTimeout(function() {
        $el.hide().remove();
      }, delay || 200);
    }

  };

  window.loadingOverlay = new LoadingOverlay($('.loading-overlay:first'));
}($));
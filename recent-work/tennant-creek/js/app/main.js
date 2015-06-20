define([
  'jquery',
  'lodash',
  'fc',
  'scroll',
  'viewport',
  './layout',
  './media',
  './analytics',
  './slides'
], function($, _, fc, scroll, viewport, layout, media, analytics, slides) {
  'use strict';

  var body;

  var loadingStateUntil = [
    'layout:ready',
    'header-image:ready',
    'media:ready',
    'main:ready'
  ];

  var loadingStageComplete = _.after(loadingStateUntil.length, function() {
    _.defer(scroll.init);
    body.removeClass('loading');
    fc.trigger('loading:complete');
  });

  var setBindings = function() {
    _.each(loadingStateUntil, function(eventName) {
      fc.after(eventName, loadingStageComplete);
    });
  };

  var init = function() {
    body = $('body');

    viewport.setViewport({
      topOffset: $('.navbar').outerHeight()
    });

    analytics.init();

    layout.init();
    media.init();
    slides.init();

    setBindings();

    fc.trigger('main:ready');
  };

  return {
    init: init
  };
});

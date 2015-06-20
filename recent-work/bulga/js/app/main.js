define([
  'jquery',
  'lodash',
  'events',
  './layout',
  './media',
  './visualisations',
  './scroll',
  './chapters'
], function($, _, events, layout, media, visualisations, scroll, chapters) {
  'use strict';

  var body;

  var setBindings = function() {
    events.on('scroll:end', function() {
      body.removeClass('loading');
    });
  };

  var init = function() {
    body = $('body');

    setBindings();

    // Initialise modules
    layout.init();
    media.init();
    visualisations.init();
    chapters.init();
    scroll.init();

    _.defer(function() {
      events.trigger('init:end');
    });
  };

  return {
    init: init
  };
});

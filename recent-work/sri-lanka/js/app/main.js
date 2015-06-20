define([
  'lodash',
  'events',
  './content',
  './layout',
  './timeline',
  './headerNav',
  './map',
  './media',
  './analytics',
  'scroll'
], function(_, events, content, layout, timeline, headerNav, map, media, analytics, scroll) {
  'use strict';

  var body;
  var tgm = window.tgm || {};

  var removeLoadingState = function() {
    body.removeClass('loading');
    events.trigger('loading:complete');
  };

  var setBindings = function() {
    var loadingStateUntil = [
      'layout:complete',
      'media:loaded'
    ];

    // If we need to fetch content, delay until it has been inserted
    if (tgm.articleSource) {
      loadingStateUntil.push('content:complete');
    }

    var loadingStageComplete = _.after(loadingStateUntil.length, removeLoadingState);
    _.each(loadingStateUntil, function(eventName) {
      events.once(eventName, loadingStageComplete);
    })
  };

  var init = function() {
    body = $('body');

    setBindings();

    content.init();
    layout.init();
    timeline.init();
    media.init();
    headerNav.init();
    map.init();
    scroll.init();
    analytics.init();
  };

  return {
    init: init
  };
});

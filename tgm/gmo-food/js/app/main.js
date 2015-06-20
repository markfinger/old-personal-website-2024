define([
  'jquery',
  'lodash',
  'd3',
  'events',
  './layout',
  './media',
  './cropViz',
  './analytics',
  './headerNav'
], function($, _, d3, events, layout, media, cropViz, analytics, headerNav) {
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

    layout.init();
    media.init();
    cropViz.init();
    analytics.init();
    headerNav.init();
  };

  return {
    init: init
  };
});

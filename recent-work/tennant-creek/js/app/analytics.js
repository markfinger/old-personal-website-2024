define([
  'jquery',
  'lodash',
  'fc',
  'viewport',
  'settings'
],function($, _, fc, viewport, settings) {

  var pointsToTrack = {};
  _.each(_.range(10, 101, 10), function(percentage) {
    pointsToTrack['Read to ' + percentage + '%'] = percentage;
  });

  var category = 'Progress tracking';
  var gaCommand = '_trackEvent';

  var logScrollTracking = function() {
    var scrollPercentage = ((viewport.getScrollY() + window.innerHeight) / $(document).height()) * 100;
    _.each(pointsToTrack, function(percentage) {
      if (scrollPercentage >= percentage) {
        var eventName = 'Read to ' + percentage + '%';
        if (settings.debugAnalytics) {
          console.log([gaCommand, category, eventName]);
        }
        window._gaq && _gaq.push([gaCommand, category, eventName]);
        delete pointsToTrack[eventName];
      }
    });
  };

  var setBindings = function() {
    fc.once('loading:complete', function() {
      if (settings.debugAnalytics) {
        console.log('Now tracking for analytics')
      }
      $(window).on('scroll', _.throttle(logScrollTracking, 75));
    });
  };

  var init = function() {
    // Log the page load
    window._gaq && _gaq.push([gaCommand, category, 'Page load']);
    setBindings();
  };

  return {
    init: init
  };
});

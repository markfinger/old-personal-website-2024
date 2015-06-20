define([
  'jquery',
  'lodash',
  'events',
  'utils',
  'config'
],function($, _, events, utils, config) {

  var articleName = location.pathname.split('/')[1] || 'introduction';

  var pointsToTrack = {};
  _.each(_.range(10, 101, 10), function(percentage) {
    pointsToTrack['Read to ' + percentage + '%'] = percentage;
  });

  var logScrollTracking = function() {
    var scrollPercentage = ((utils.getScrollY() + window.innerHeight) / document.height) * 100;
    _.each(pointsToTrack, function(percentage) {
      if (scrollPercentage >= percentage) {
        var eventName = 'Read to ' + percentage + '%';
        if (config.debugAnalytics) {
          console.log('_trackEvent', 'Read to: ' + articleName, eventName);
        }
        window._gaq && _gaq.push(['_trackEvent', 'Read to: ' + articleName, eventName]);
        delete pointsToTrack[eventName];
      }
    });
  };

  var setBindings = function() {
    events.once('loading:complete', function() {
      $(window).on('scroll', _.throttle(logScrollTracking, 50));
    })
  };

  var init = function() {
    // Log the page load
    window._gaq && _gaq.push(['_trackEvent', 'Page load']);
    setBindings();
  };

  return {
    init: init
  };
});
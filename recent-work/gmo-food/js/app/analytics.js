define([
  'jquery',
  'lodash',
  'events',
  'utils',
  'config'
],function($, _, events, utils, config) {

  var articleName = location.pathname.split('/')[1] || '/';

  var pointsToTrack = {};
  _.each(_.range(10, 101, 10), function(percentage) {
    pointsToTrack['Read to ' + percentage + '%'] = percentage;
  });

  var logScrollTracking = function() {
    var scrollPercentage = ((utils.getScrollY() + window.innerHeight) / document.height) * 100;
    _.each(pointsToTrack, function(percentage) {
      if (scrollPercentage >= percentage) {
        var eventName = 'Read to ' + percentage + '%';
        var event = ['_trackEvent', 'Read to: ' + articleName, eventName];
        if (config.debugAnalytics) {
          console.log.apply(null, event);
        }
        window._gaq && _gaq.push('_trackEvent', 'Read to: ' + articleName, eventName);
        delete pointsToTrack[eventName];
      }
    });
  };

  var setBindings = function() {
    events.once('loading:complete', function() {
      if (config.debugAnalytics) {
        console.log('Tracking ')
      }
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
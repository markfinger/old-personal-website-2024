define(function() {

  // Defaults
  var settings = {
    // flags
    quiet: false,
    debug: false,
    debugEvents: false,
    debugAnalytics: false,
    lessThanEqualToIE9: (function(){ // Detects IE9 and lower
      var div = document.createElement('div');
      div.innerHTML = '<!--[if IE]><i></i><![endif]-->';
      return div.getElementsByTagName('i').length > 0;
    }()),
    // If JS can control the initial play of media elements. This is
    // likely to be `true` on desktop and `false` on mobile devices.
    canAutoplay: (function() {
      var video = document.createElement('video');
      video.play();
      return !video.paused;
    })()
  };

  if (settings.lessThanEqualToIE9) {
    settings.canAutoplay = false;
  }

  if (location.search.indexOf('quiet') != -1) {
    // Suppress sound playback
    settings.quiet = true;
  }

  if (location.search.indexOf('debug') != -1) {
    // Verbose logging
    settings.debug = true;
  }

  if (
    location.search.indexOf('events') != -1 ||
    settings.debug
  ) {
    // Log event bindings and triggers with stack traces
    settings.debugEvents = true;
  }

  if (
    location.search.indexOf('analytics') != -1 ||
    settings.debug
  ) {
    // Log events that we're tracking on Google Analytics
    settings.debugAnalytics = true;
  }

  if (location.search.indexOf('no-autoplay') != -1) {
    // Force autoplay off
    settings.canAutoplay = false;
  }

  return settings;

});

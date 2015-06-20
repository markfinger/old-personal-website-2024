define(function() {

  // Defaults
  var config = {
    // flags
    quiet: false,
    debug: false,
    debugEvents: false
  };

  var wideAndNotIE = window.innerWidth > 1024 &&
    document.documentElement.className.indexOf('ie8') == -1;

  if (wideAndNotIE && !window.location.href.match(/ambient=disable/i)){
    config.ambianceEnabled = true;
  }

  if (location.search.indexOf('quiet') != -1) {
    // Suppress sound playback
    config.quiet = true;
  }

  if (location.search.indexOf('debug') != -1) {
    // Verbose logging
    config.debug = true;
  }

  if (location.search.indexOf('events') != -1 || config.debug) {
    // Log event bindings and triggers with stack traces
    config.debugEvents = true;
  }

  return config;

});

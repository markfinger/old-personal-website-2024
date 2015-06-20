define([
  'lodash',
  'config'
], function(_, config) {

  var volumeMax = 1;
  var volumeMin = 0;

  var defaultFadeInOptions = {
    amount: 0.04, // step amount
    complete: null // callback
  };

  var defaultFadeOutOptions = {
    amount: 0.04, // step amount
    complete: null // callback
  };

  var fadeIn = function(video, options) {
    options = _.extend(defaultFadeInOptions, options);
    options.amount = Math.abs(options.amount);
    video.volume(0);
    video.play();

    if (config.quiet) {
      return;
    }

    // The step function
    var _fadeIn = function(video, options) {
      var vol = video.volume();
      if (vol >= volumeMax) {
        if (options.complete) {
          options.complete();
        }
        return;
      }
      video.volume(Math.min(volumeMax, vol + options.amount));
      setTimeout(function() {
        _fadeIn(video, options);
      }, 20);
    };
    
    _fadeIn(video, options);
  };

  var fadeOut = function(video, options) {
    options = _.extend(defaultFadeOutOptions, options);
    options.amount = Math.abs(options.amount);

    if (config.quiet) {
      video.pause();
      return;
    }

    // The step function
    var _fadeOut = function(video, options) {
      var vol = video.volume();
      if (vol <= volumeMin) {
        if (options.complete) {
          options.complete();
        }
        video.pause();
        return;
      }
      video.volume(Math.max(volumeMin, vol - options.amount));
      setTimeout(function() {
        _fadeOut(video, options);
      }, 20);
    };

    _fadeOut(video, options);
  };

  return {
    fadeIn: fadeIn,
    fadeOut: fadeOut
  };
});
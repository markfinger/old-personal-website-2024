// fatcontroller - simple pub sub, with pre/post bindings and debug tracing
// https://github.com/markfinger/fatcontroller

define(['lodash'], function(_) {

  var settings = {
    debug: false
  };

  // Registry of event bindings
  var registry = {
    // event: [
    //   {
    //     callback: <function>,
    //     once: <boolean>
    //   },
    //   ...
    // ],
    // ...
  };

  var triggeredEvents = {};

  var _logTrace = function _logTrace(action, identifier) {
    // Cross-browser stack tracing

    var extraArgs = Array.prototype.slice.call(arguments, 2);

    // Log a stack trace, grouping it if possible
    if (console.groupCollapsed && console.groupEnd && console.trace) {
      console.groupCollapsed(action + ': ' + identifier);
      if (extraArgs.length) {
        console.log('Extra arguments', extraArgs);
      }
      console.trace();
      console.groupEnd();
    } else {
      console.log(action, identifier, extraArgs, Error().stack);
    }
  };

  var on = function on(event, callback) {
    if (settings.debug) {
      _logTrace('Event bound', event, callback);
    }

    var binding = {
      callback: callback,
      once: false
    };

    if (registry[event] === undefined) {
      registry[event] = [];
    }

    registry[event].push(binding);

    return binding;
  };

  var once = function once(event, callback) {
    var binding = on(event, callback);
    binding.once = true;
    return binding;
  };

  var after = function after(event, callback) {
    var binding = on(event, callback);

    if (triggeredEvents.hasOwnProperty(event)) {
      callback();
    }

    return binding;
  };

  var off = function off(event, callback) {
    if (settings.debug) {
      _logTrace('Event unbound', event, callback);
    }

    if (registry[event]) {
      if (callback) {
        _.remove(registry[event], function(binding) {
          return binding.callback === callback;
        });
      } else {
        delete registry[event];
      }
    }
  };

  var trigger = function trigger(event) {
    if (settings.debug) {
      _logTrace('Event triggered', event);
    }

    _.invoke(registry[event], 'callback');
    _.remove(registry[event], 'once');

    if (!triggeredEvents.hasOwnProperty(event)) {
      triggeredEvents[event] = undefined;
    }
  };

  return _.assign(settings, {
    on: on,
    once: once,
    after: after,
    off: off,
    trigger: trigger,
    registry: registry
  });

});
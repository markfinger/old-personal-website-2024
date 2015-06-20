define([
  'lodash',
  'fatcontroller',
  'config'
], function(_, fc, config) {
  "use strict";

  if (config.debugEvents) {
    // Wrap `on` and `trigger` in log calls

    var _trigger = fc.trigger;

    fc.trigger = function() {
      var args = Array.prototype.slice.apply(arguments);

      if (console.groupCollapsed && console.groupEnd && console.trace) {
        // Log a stack trace
        console.groupCollapsed('Event triggered: ' + args[0]);
        if (args.length > 1) {
          console.log(args);
        }
        console.trace();
        console.groupEnd();

        // TODO: move event log code into FC and log each subscriber as they're called
      } else {
        console.log('Event triggered', args, Error().stack);
      }

      return _trigger.apply(null, args);
    };

    var _on = fc.on;

    fc.on = function() {
      var args = Array.prototype.slice.apply(arguments);

      if (console.groupCollapsed && console.groupEnd && console.trace) {
        // Log a stack trace
        console.groupCollapsed('Event bound: ' + args[0]);
        console.trace();
        console.groupEnd();
      }

      return _on.apply(null, args);
    };

  }

  return fc;
});
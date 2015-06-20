// Fat Controller - simple pub-sub
// https://github.com/markfinger/fatcontroller

define(function fc() {

  // Registry of subscribers
  var registry = {
    // event: [
    //   {
    //     callback: ...,
    //     context: ...
    //   },
    //   ...
    // ],
  };

  var on = function on(event, callback, context) {
    var binding = {
      callback: callback,
      context: context
    };
    var subscribers = registry[event] = registry[event] || [];
    subscribers.push(binding);
    return binding;
  };

  var off = function off(event, callback, context) {
    if (event && !callback && !context) {
      delete registry[event];
    } else if (callback || context) {
      var subscribers;
      if (event) {
        subscribers = {};
        subscribers[event] = registry[event]
      } else {
        subscribers = registry;
      }
      for (var key in subscribers) {
        if (subscribers.hasOwnProperty(key)) {
          var bindings = subscribers[key];
          for (var i = 0; i < bindings.length; i++) {
            var binding = bindings[i];
            var matchingCallback = callback && binding.callback === callback;
            var matchingContext = context && binding.callback === callback;
            if (
              (matchingCallback && matchingContext) ||
              (!callback && matchingContext) ||
              (!context && matchingCallback)
            ) {
              bindings.splice(i, 1);
            }
          }
          if (binding.length === 0) {
            delete subscribers[key];
          }
        }
      }
    }
  };

  var trigger = function trigger(event) {

    var args = Array.prototype.slice.call(arguments, 1);

    var subscribers = registry[event];

    if (subscribers !== undefined) {
      for (var i = 0; i < subscribers.length; i++) {
        var binding = subscribers[i];
        if (binding.context !== undefined) {
          binding.callback.call(binding.context, args);
        } else {
          binding.callback(args);
        }
      }
    }

    return event;
  };

  return {
    on: on,
    off: off,
    trigger: trigger,
    registry: registry
  };
});
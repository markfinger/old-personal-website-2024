// fatcontroller - simple pub-sub
// https://github.com/markfinger/fatcontroller

(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(factory);
  } else {
    // Browser globals
    root.fc = factory();
  }

}(this, function() {

  // Registry of subscribers
  var registry = {
    // event: [
    //   {
    //     callback: ...,
    //     context: ...,
    //     once: ...
    //   },
    //   ...
    // ],
  };

  var on = function on(event, callback, context) {
    var binding = {
      callback: callback,
      context: context,
      once: false
    };
    if (registry[event] === undefined) {
      registry[event] = [];
    }
    registry[event].push(binding);
    return binding;
  };

  var once = function once() {
    var binding = on.apply(undefined, arguments);
    binding.once = true;
    return binding;
  };

  var off = function off(event) {
    var callback = undefined;
    var context = undefined;
    if (typeof event === 'object') {
      event = obj.event;
      callback = obj.callback;
      context = obj.context;
    }

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
        if (binding.once) {
          subscribers.splice(i, 1);
        }
        if (subscribers.length === 0) {
          delete registry[event];
        }
      }
    }
    return event;
  };

  return {
    on: on,
    once: once,
    off: off,
    trigger: trigger,
    registry: registry
  };

}));
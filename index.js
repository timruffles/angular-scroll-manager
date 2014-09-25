angular.module("scroll-manager", [])
  .provider("scrollManagerScrollTo", function() {

    var scroller = defaultScroller;

    this.$get = function() {
      return scroller;
    }

    this.setScroller = function(fn) {
      if(typeof fn != 'function') {
        throw new Error("scroller must be a function");
      }
      scroller = fn;
    }
    
    function defaultScroller(el) {
      el.scrollIntoView()
    }
  })
  .directive("scrollTriggers", function(scrollManagerScrollTo) {
    return {
      restrict: "A",
      link: function(scope, $el, attrs) {
        var currentTargets = {};
        var el = $el[0];

        attrs.$observe("scrollTriggers", function(newTriggersString, oldTriggers) {
          var newTriggers = scope.$eval(newTriggersString);
          
          if(typeof newTriggers != "object") {
            return;
          }

          var events = Object.keys(currentTargets).concat(Object.keys(newTriggers));

          events.forEach(function(event) {
            if(newTriggers[event]) {
              if(!(event in currentTargets) ) {
                scope.$on(event, handler);
              }
              currentTargets[event] = newTriggers[event];
            } else {
              scope.$off(event, handler);
              delete currentTargets[event];
            }
          });

        }, true);

        function handler(event) {
          scrollManagerScrollTo( el.querySelector(currentTargets[event.name]) );
        }

      },
    }

  });

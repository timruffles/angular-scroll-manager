angular.module("scroll-manager", [])
  .service("scrollManager", function() {

    this.scroll = function defaultScroller(el) {
      el.scrollIntoView()
    };
    
  })
  .directive("scrollTriggers", function(scrollManager) {
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
          scrollManager.scroll( el.querySelector(currentTargets[event.name]) );
        }

      },
    }

  });

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

        scope.$watch(attrs.scrollTriggers, triggerWatcher, true);

        function triggerWatcher(newTriggers) {
        
          if(!newTriggers || typeof newTriggers != "object") {
            return;
          }

          var events = Object.keys(currentTargets).concat(Object.keys(newTriggers));

          events.forEach(function(event) {
            if(newTriggers[event]) {
              if(!(event in currentTargets)) {
                currentTargets[event] = { deregister: scope.$on(event, handler) };
              }
              currentTargets[event].selector = newTriggers[event];
            } else if(currentTargets[event]) {
              currentTargets[event].deregister();
              delete currentTargets[event];
            }
          });

        }

        function handler(event) {
          var match = el.querySelector(currentTargets[event.name].selector);
          if(match) {
            scrollManager.scroll(match);
          }
        }

      },
    }

  });

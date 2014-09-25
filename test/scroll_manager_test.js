
describe("scroll-manager", function() {

  var scrollSpy;

  beforeEach(module("scroll-manager", function($provide, $controllerProvider) {

    $controllerProvider.register('emitter', function($scope, $rootScope) {

      $rootScope.fireComplete = function() {
        $scope.$emit("complete");
      }

    });

    scrollSpy = sinon.spy();
    $provide.value("scrollManager", { scroll: scrollSpy }); 
  }));

  describe("single event", function() {
    var el;
    var rootScope;

    beforeEach(inject(function($compile, $rootScope) {
      scope = $rootScope.$new();
      scope.selectedItem = { id: "a" };
      scope.enabled = true;

      el = $compile(heredoc(function() {/*
        <div scroll-triggers="{
            'complete': enabled ? '[data-scroll-id=' + selectedItem.id +']' : false 
          }">
          <div ng-controller='emitter'></div>
          <div data-scroll-id=a>Hello</div>
          <div data-scroll-id=b>Bye</div>
        </div>
      */}))(scope);

      scope.$apply();
    }));

    it("scrolls to element after matching event fires", function() {
      scope.fireComplete();
      var target = el[0].querySelector("[data-scroll-id=a]");
      chai.assert(target, "no target");

      sinon.assert.calledOnce(scrollSpy);
      sinon.assert.calledWith(scrollSpy, target);
    });

    it("keeps the selector up to date ", function() {
      scope.selectedItem.id = "b";
      scope.$apply();

      scope.fireComplete();

      var target = el[0].querySelector("[data-scroll-id=b]");
      chai.assert(target, "no target");

      sinon.assert.calledOnce(scrollSpy);
      sinon.assert.calledWith(scrollSpy, target);
    });

    it("falsey disables previous listeners", function() {
      scope.enabled = false;
      scope.$apply();

      scope.fireComplete();

      sinon.assert.notCalled(scrollSpy);
    });

  });

});

p = console.log.bind(console);


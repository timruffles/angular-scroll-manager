
describe("scroll-manager", function() {

  var scrollSpy = sinon.spy();

  beforeEach(module("scroll-manager", function($provide, $controllerProvider) {
    $controllerProvider.register('emitter', function($scope, $rootScope) {

      $rootScope.fireComplete = function() {
        $scope.$emit("complete");
      }

    });

    $provide.value("scrollManagerScrollTo", scrollSpy); 
  }));

  describe("simple case", function() {
    var el;
    var rootScope;

    beforeEach(inject(function($compile, $rootScope) {
      scope = $rootScope.$new();

      el = $compile(heredoc(function() {/*
        <div scroll-triggers="{
            'complete': '[data-scroll-id=a]' 
          }">
          <div ng-controller='emitter'></div>
          <div data-scroll-id=a>Hello</div>
        </div>
      */}))(scope);

      scope.$apply();
    }));

    it("scrolls to element after matching event fires", function() {
      scope.fireComplete();
      var target = el[0].querySelector("[data-scroll-id]");
      chai.assert(target, "no target");

      sinon.assert.calledOnce(scrollSpy);
      sinon.assert.calledWith(scrollSpy, target);
    });

  });

});

p = console.log.bind(console);


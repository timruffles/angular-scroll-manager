# Angular `scroll-manager`

![Build status](https://travis-ci.org/timruffles/angular-scroll-manager.svg)


`scroll-manager` keeps your scrolling logic where it belongs - in the view.

Emit semantic events from your business logic - like <code>termsAccepted</code> - and configure how the view will scroll in response. You can configure how the scrolling will actually occur - by default it's instant, but use whatever method you like to create a silky-smooth animation, or whatever you can think up!

[There's a demo!](https://timruffles.github.io/angular-scroll-manager/demo).

## Install

Grab the `index.js`, or install via npm and browserify.

```
npm install --save angular-scroll-manager
```

## Usage

To control scrolling in reaction to events for a group of elements add the `scroll-trigger` directive to a parent element. In this [demo](https://timruffles.github.io/angular-scroll-manager/demo) we're scrolling around the page to take the user through a flow.

```html
<div scroll-triggers="{
    'termsAccepted': '[data-scroll-id=checkout]',
    'termsRequired': '[data-scroll-id=terms]' 
  }" class="row" ng-controller=CheckoutCtrl>

  <div data-scroll-id=checkout  class=panel>
    <h3>Checkout</h3>
    <p>Before you checkout, you must read the terms.</p>

    <button ng-click=continue()>Read terms</button>
  </div>

  <div data-scroll-id=terms ng-controller=TermsCtrl class=panel>
    <h3>Terms</h3>
    <p>Really, really, really long terms.</p>

    <button ng-click=accept()>Accept terms</button>
  </div>

</div>
```

The controller code is simple and clean, not referencing the DOM, only emitting events with meaningful names:

```javascript
angular.module("demo", ["scroll-manager"])
  .controller("TermsCtrl", function($scope) {
      $scope.accept = function() {
        $scope.terms.accepted = true;
        $scope.$emit("termsAccepted");
      }
  })
  .controller("CheckoutCtrl", function($scope) {
      $scope.terms = {};

      $scope.continue = function() {
        $scope.$emit("termsRequired");
      };
  });
```


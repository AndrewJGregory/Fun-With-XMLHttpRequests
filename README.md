# Introduction

Scenario: A page is loading and you want a function to execute after all AJAX calls/`XMLHttpRequest`s are finished. Maybe these calls insert more data or `HTMLElements` onto the page, and you want your function to have access to whatever the AJAX calls influence. Simply listening for `DOMContentLoaded` on the document will not work because asynchronous requests are not a part of the DOM content. What to do?

## How to use

Include the following as the first script in the head of your HTML:

```
<script src="https://cdn.rawgit.com/AndrewJGregory/Fun-With-XMLHttpRequests/62e567ba/main.js" charset="utf-8"></script>
```

Then invoke `callWhenReadyToGo(yourFunction)`. `yourFunction` will be called when all AJAX calls/`XMLHttpRequest`s are finished.

## Features

- Can execute a callback after **all** AJAX requests are finished

## Explanation

Any AJAX call is a `XMLHttpRequest` at its core. `callWhenReadyToGo(callback)` hooks into the prototype `open` method of `XMLHttpRequest`. As all requests need to be opened in order to be sent, this is a convenient place to insert the logic to detect if requests are completed. The idea is to keep track of how many requests have been opened and how many requests have been completed. When the number of opened requests is equal to the number of completed requests, then all `XMLHttpRequest`s have been completed and the callback can be executed. Before the `open` method is modified, a reference needs to be kept to the original `open` so it can be executed after this additional logic. Below, the code:

```js
function callWhenReadyToGo(callback) {
  var open = XMLHttpRequest.prototype.open;
  var numOpenedRequests = 0;
  var numCompletedRequests = 0;
  XMLHttpRequest.prototype.open = function() {
    var that = this;
    numOpenedRequests++;
    that.addEventListener("loadend", function() {
      if (that.readyState === 4) {
        numCompletedRequests++;
        if (numOpenedRequests === numCompletedRequests) {
          callback();
        }
      }
    });
    return open.apply(that, arguments);
  };

  window.setTimeout(function() {
    if (numOpenedRequests === 0) {
      callback();
      XMLHttpRequest.prototype.open = open;
    }
  }, 0);
}
```

#### Finer Details

- `loadend` is used because jQuery overrides the `onreadystatechange` event listener. If `onreadystatechange` was used as the type of event listener, then any requests made by jQuery would not be acknowledged.

- What if no requests are made on the page? The callback should still be called. By setting a timeout, it will execute after any requests are made. If no requests have been made, then the callback is invoked and the original open method is restored on `XMLHttpRequest.prototype`.

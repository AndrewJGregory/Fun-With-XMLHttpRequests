# Features

  * Can execute a callback after **all** AJAX requests are finished

## Problem

Scenario: A page is loading and you want a function to execute after all AJAX calls are finished. Maybe these calls insert more data or `HTMLElements` onto the page, and you want your function to have access to whatever the AJAX calls influence. Simply listening for `DOMContentLoaded` on the document will not work because that is only the DOM content and not the asynchronous requests. What to do?

## Solution

Any AJAX call is a `XMLHttpRequest` at its core. `callWhenReadyToGo(callback)` hooks into the prototype `open` method of `XMLHttpRequest`. As all requests need to be opened in order to be sent, this is an easy place to insert the logic to detect if requests are completed. The idea is to keep track of how many requests have been opened and how many requests have been completed. When the number of opened requests is equal to the number of completed requests, then all `XMLHttpRequest`s have been completed and the callback can be executed. Before the `open` method is modified, a reference needs to be kept to the original `open` so it can be executed after this additional logic. Below, the code:

```
function callWhenReadyToGo(callback) {
  var open = XMLHttpRequest.prototype.open;
  var numOpenedRequests = 0;
  var numCompletedRequests = 0;
  XMLHttpRequest.prototype.open = function () {
    var that = this;
    numOpenedRequests++;
    that.addEventListener('loadend', function () {
      if (that.readyState === 4) {
        numCompletedRequests++;
        if (numOpenedRequests === numCompletedRequests) {
          callback();
        }
      }
    });
    return open.apply(that, arguments);
  };
  makeHttpRequest(defaults);
}
```

#### Finer Details
  * `loadend` is used because jQuery overrides the `onreadystatechange` event listener. If `onreadystatechange` was used as the type of event listener, then any requests made by jQuery would not be acknowledged.

  * What if no requests are made on the page? Due to hooking into the `open` method, a request would have to be made in order for the callback to execute. This is why the last line makes a simple request so the callback can execute if no other requests were made by the webpage itself.

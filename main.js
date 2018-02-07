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

  window.setTimeout(function () {
    if (numOpenedRequests === 0) {
      callback();
      XMLHttpRequest.prototype.open = open;
    }
  }, 0);
}

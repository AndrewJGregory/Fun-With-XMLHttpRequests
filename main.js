var defaults = {
  method: 'GET',
  url: "http://api.openweathermap.org/data/2.5/weather?q=London,uk&appid=bcb83c4b54aee8418983c2aff3073b3b",
  success: function success(data) {
    console.log(data);
  },
  error: function error() {
    console.error("Error");
  },
  data: {},
  contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
};

function makeHttpRequest(options) {
  var xhr = new XMLHttpRequest();
  xhr.open(options.method, options.url);
  xhr.onload = function() {
    if (xhr.status === 200) {
      return options.success(JSON.parse(xhr.response));
    } else {
      return options.error(JSON.parse(xhr.response));
    }
  };
  xhr.send();
}


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

var callback = function() {
  console.log("Hey there");
};

callWhenReadyToGo(callback);
makeHttpRequest(defaults);
makeHttpRequest(defaults);
makeHttpRequest(defaults);
makeHttpRequest(defaults);

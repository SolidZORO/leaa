export const htmlScript = `
  (function() {
    function wrap(fn) {
      return function wrapper() {
        var res = fn.apply(this, arguments);
        window.ReactNativeWebView.postMessage('navigationStateChange');
        return res;
      };
    }
  
    history.pushState = wrap(history.pushState);
    history.replaceState = wrap(history.replaceState);
  
    window.addEventListener('popstate', function() {
      window.ReactNativeWebView.postMessage('navigationStateChange');
    });
  })();


  (function() {
    var objs = document.getElementsByTagName('img');
    var images = new Array();
  
    for (var i = 0; i < objs.length; i++) {
      images[i] = objs[i].src;
    }
  
    for (var i = 0; i < objs.length; i++) {
      objs[i].onclick = function() {
        if (window.ReactNativeWebView.postMessage) {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({
              type: 'images',
              url: this.src,
              images: images,
            }),
          );
        }
      };
    }
  })();

  true;
`;

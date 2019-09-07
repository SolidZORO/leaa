export const htmlScript = `
  function waitForBridge() {
    if (!window.ReactNativeWebView.postMessage) {
      setTimeout(waitForBridge, 200);
    } else {
      window.ReactNativeWebView.postMessage(
        Math.max(
          document.documentElement.clientHeight,
          document.documentElement.scrollHeight,
          document.body.clientHeight,
          document.body.scrollHeight
        )
      );
    }
  }
  
  waitForBridge();
  
  true;
 `;

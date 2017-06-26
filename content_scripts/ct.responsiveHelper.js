(function() {
  var $ = window.wrappedJSObject.$;

  function isBootstrapActive() {
    return (typeof $ !== 'undefined') && (typeof $().modal === 'function');
  }

  function getViewportWidth() {
    return Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
  }

  function sendMessage() {
    browser.runtime.sendMessage({
      bootstrapActive: isBootstrapActive(),
      viewportWidth: getViewportWidth(),
    });
  }

  window.addEventListener("resize", resizeThrottler, false);

  // Inspired by: https://developer.mozilla.org/en-US/docs/Web/Events/resize
  var resizeTimeout;
  function resizeThrottler() {
    // ignore resize events as long as an actualResizeHandler execution is in the queue
    if ( !resizeTimeout ) {
      resizeTimeout = setTimeout(function() {
        resizeTimeout = null;
        sendMessage();
       // Will execute at a rate of 15fps
       }, 66);
    }
  }

  sendMessage();
}());

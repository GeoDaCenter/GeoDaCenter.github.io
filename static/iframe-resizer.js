// iframe-resizer.js
// Utility script to help iframes communicate their height to parent windows

(function() {
  'use strict';

  // Function to send height to parent
  function sendHeight() {
    const height = Math.max(
      document.documentElement.scrollHeight,
      document.documentElement.offsetHeight,
      document.body.scrollHeight,
      document.body.offsetHeight
    );

    // Send message to parent window
    if (window.parent && window.parent !== window) {
      window.parent.postMessage({
        type: 'resize',
        height: height
      }, '*');
    }
  }

  // Send height on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', sendHeight);
  } else {
    sendHeight();
  }

  // Send height on window resize
  window.addEventListener('resize', sendHeight);

  // Send height when content changes (MutationObserver)
  if (window.MutationObserver) {
    const observer = new MutationObserver(function(mutations) {
      // Debounce the height calculation
      clearTimeout(window.heightTimeout);
      window.heightTimeout = setTimeout(sendHeight, 100);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class']
    });
  }

  // Send height periodically as fallback
  setInterval(sendHeight, 2000);

  // Expose function globally for manual calls
  window.sendIframeHeight = sendHeight;
})(); 
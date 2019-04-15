window.splashScreen = (function (window, $) {
  'use strict';

  var splashScreen = document.querySelector('.splash-screen');

  if (!splashScreen) {
    return;
  }

  var isLoaded = false;

  document.body.style.overflowY = 'hidden';
  document.body.style.paddingRight = window.util.getScrollbarWidth() + 'px';

  window.addEventListener('load', function () {
    hideSplashScreen();
  });

  setTimeout(() => {
    hideSplashScreen()
  }, 1000 * 8);

  function hideSplashScreen() {
    if (isLoaded) {
      return;
    }

    splashScreen.classList.add('splash-screen--hidden');
    document.body.style.overflowY = '';
    document.body.style.paddingRight = '';

    isLoaded = true;
  }
})(window, jQuery);

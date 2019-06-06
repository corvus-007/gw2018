window.notification = (function (window, $) {
  'use strict';

  const DELAY_BEFORE_SHOW = 6000;
  const notification = document.querySelector('[data-notification]');

  if (!notification) {
    return;
  }

  let wasWatched = sessionStorage.getItem('is_notification_watched') || false;
  const notificationClose = notification.querySelector('[data-notification-close]');

  function init() {
    if (!wasWatched) {
      setTimeout(() => {
        open();
      }, DELAY_BEFORE_SHOW);
    } else {
      close();
    }

    notificationClose.addEventListener('click', onNotificationCloseClickHandler);
  }

  function onNotificationCloseClickHandler(evt) {
    evt.preventDefault();

    close();
  }

  function open() {
    notification.classList.remove('notification--closed');
    notification.classList.add('notification--open');

    setTimeout(addAnimationClass, 1000);
  }

  function close() {
    notification.classList.remove('notification--open');
    notification.classList.add('notification--closed');

    writeToSessionStorage('is_notification_watched', true);
  }

  function addAnimationClass() {
    notification.classList.add('notification--start-animation');
  }

  function removeFromSessionStorage(key) {
    sessionStorage.removeItem(key);
  }

  function writeToSessionStorage(key, value) {
    sessionStorage.setItem(key, value);
  }

  return {
    init,
    open,
    close
  }
})(window, jQuery);

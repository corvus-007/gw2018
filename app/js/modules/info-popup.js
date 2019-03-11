window.infoPopup = (function (window, $) {
  'use strict';

  var infoPopup = document.querySelector('#info-popup');

  if (!infoPopup) {
    return;
  }

  // var isShowedInfoPopup = Cookies.get('infoPopup');
  var isShowedInfoPopup = 0;
  var info_POPUP_OFFSET_TIME = 1000;
  var phoneInfoPopupTimeout = setTimeout(function () {
    $.fancybox.open({
      src: '#info-popup',
      type: 'inline',
      opts: {
        afterClose: function () {
          Cookies.set('infoPopup', 1);
        }
      }
    });
  }, info_POPUP_OFFSET_TIME);

  if (isShowedInfoPopup) {
    clearTimeout(phoneInfoPopupTimeout);
  }
})(window, jQuery);

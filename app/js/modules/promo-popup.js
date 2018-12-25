window.promoPopup = (function (window, $) {
  'use strict';

  var isShowedPromoPopup = Cookies.get('promoPopup');
  var PROMO_POPUP_OFFSET_TIME = 1000;
  var phonePromoPopupTimeout = setTimeout(function () {
    $.fancybox.open({
      src: '#promo-popup',
      type: 'inline',
      opts: {
        afterClose: function () {
          Cookies.set('promoPopup', 1, {
            expires: 7
          });
        }
      }
    });
  }, PROMO_POPUP_OFFSET_TIME);

  if (isShowedPromoPopup) {
    clearTimeout(phonePromoPopupTimeout);
  }
})(window, jQuery);

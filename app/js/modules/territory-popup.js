window.territoryPopup = (function (window, $) {
  'use strict';

  $('[data-fancybox="territory-parking"]').fancybox();

  $('[data-territory-popup-slider]').flickity({
    pageDots: false,
    percentPosition: false
  });

  $('[data-territory-fancybox]').fancybox({
    afterShow() {
      $('[data-territory-popup-slider]').flickity('resize');
    }
  });

  function init() {

  }

  return {

  };

})(window, jQuery);

window.flatsCards = (function () {
  'use strict';

  var FlatView = {
    'card': 'flats-cards--display-card',
    'list': 'flats-cards--display-list'
  };

  var flatsCards = document.querySelector('.flats-cards');

  $('[name="view"]').on('change', function (evt) {
    flatsCards.classList.toggle(FlatView.card);
    flatsCards.classList.toggle(FlatView.list);
  });

  function setDisplayList() {

  }

  function setDisplayCard() {

  }
})(window, jQuery);

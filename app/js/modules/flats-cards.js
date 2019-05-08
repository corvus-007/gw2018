window.flatsCards = (function () {
  'use strict';

  var flatsCards = document.querySelector('.flats-cards');

  if (!flatsCards) {
    return;
  }

  var FlatView = {
    'card': 'flats-cards--display-card',
    'list': 'flats-cards--display-list'
  };

  var currentFlatView = localStorage.getItem('currentFlatView');
  var viewModeForm = document.querySelector('.view-mode-form');

  if (!currentFlatView || currentFlatView === 'list') {
    setDisplayList();
    viewModeForm.elements.view.value = 'list';
  } else {
    setDisplayCard();
    viewModeForm.elements.view.value = 'card';
  }

  flatsCards.classList.add(currentFlatView);
  viewModeForm.addEventListener('change', function (evt) {
    if (localStorage.getItem('currentFlatView') === 'card') {
      setDisplayList();
    } else {
      setDisplayCard();
    }
  });

  flatsCards.addEventListener('click', function (evt) {
    var target = evt.target;
    var floorToLookButton = target.closest('.flat-card__floor-to-look');

    if (!floorToLookButton) {
      return;
    }

    evt.preventDefault();

    var imageSrc = floorToLookButton.dataset.src;

    $.fancybox.open({
      src: imageSrc,
      type: 'image',
      opts: {
        slideClass: 'slide-image-custom',
      }
    });
  });

  flatsCards.addEventListener('click', function (evt) {
    var target = evt.target;
    var favoriteButton = target.closest('.flat-card__add-to-favorite');

    if (!favoriteButton) {
      return;
    }

    var flatCard = favoriteButton.closest('.flat-card');
    var flatId = flatCard.dataset.flatId;

    window.favoritesCards.updateFavorites(flatId);
    updateCardState(flatCard);

    window.favoritesCards.createLinkToFavoritesPages();
  });

  function updateCardState(flatCard) {
    if (!flatCard.classList.contains('flat-card--is-favorite')) {
      flatCard.classList.add('flat-card--is-favorite');
    } else {
      flatCard.classList.remove('flat-card--is-favorite');
    }
  }

  function setDisplayList() {
    localStorage.setItem('currentFlatView', 'list');
    flatsCards.classList.remove(FlatView.card);
    flatsCards.classList.add(FlatView.list);
  }

  function setDisplayCard() {
    localStorage.setItem('currentFlatView', 'card');
    flatsCards.classList.remove(FlatView.list);
    flatsCards.classList.add(FlatView.card);
  }
})(window, jQuery);

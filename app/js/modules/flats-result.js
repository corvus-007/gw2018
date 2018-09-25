window.flatsResult = (function (window, $) {
  'use srict';

  var flatsResult = document.querySelector('.flats-result');

  if (!flatsResult) {
    return;
  }

  var cardsList = flatsResult.querySelector('.flats-cards');
  var templateCard = document.querySelector('#flats-result-card-template').content.querySelector('.flat-card');
  var favoritesCards = window.favoritesCards.getFavoritesFlatsAsArr();

  function displayResult(params) {
    var filtersData = params.data || '';
    var response = sendRequest(filtersData, onSuccess);

    favoritesCards = window.favoritesCards.getFavoritesFlatsAsArr();

    response.done(onSuccess);
  }

  function onSuccess(data) {
    var fragment = document.createDocumentFragment();
    clearCardsList();

    data.forEach(function (attrs, index) {
      fragment.appendChild(renderCard(attrs, index));
    });

    cardsList.appendChild(fragment);

    if (window.matchMedia('(min-width: 1024px)').matches) {
      $('[data-sticky-target]').stick_in_parent({
        offset_top: 110
      });
    }

    setTimeout(function () {
      endLoading();
    }, 800);
  }

  function renderCard(attrs, index) {
    var card = templateCard.cloneNode(true);
    var reserveElem = card.querySelector('.flat-card__reserved');
    var image = card.querySelector('.flat-card__picture img');

    var id = index + '';
    card.dataset.flatId = id;

    if (favoritesCards.includes(id)) {
      card.classList.add('flat-card--is-favorite');
    }

    if (!attrs.reserve) {
      reserveElem.remove();
    }

    image.src = 'images/plans/plan-2.svg';

    card.querySelector('[data-flat="room"]').textContent = attrs.room;
    card.querySelector('[data-flat="area"]').textContent = attrs.area;

    return card;
  }

  function sendRequest(data, onSuccess, onError) {
    data = data || '';

    startLoading();

    return $.ajax({
      type: "GET",
      url: window.util.URL_FILTER_HANDLER,
      data: data,
      dataType: "JSON"
    });
  }

  function clearCardsList() {
    cardsList.innerHTML = '';
  }

  function startLoading() {
    flatsResult.classList.add('flats-result--loading');
  }

  function endLoading() {
    flatsResult.classList.remove('flats-result--loading');
  }

  return {
    displayResult: displayResult,
    templateCard: templateCard,
    cardsList: cardsList,
    sendRequest: sendRequest,
    renderCard: renderCard,
    clearCardsList: clearCardsList
  };
})(window, jQuery);

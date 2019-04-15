window.flatsResult = (function (window, $) {
  'use srict';

  var flatsResult = document.querySelector('.flats-result');

  if (!flatsResult) {
    return;
  }

  var cardsList = flatsResult.querySelector('.flats-cards');
  var templateCard = document.querySelector('#flats-result-card-template').content.querySelector('.flat-card');
  var favoritesCards = window.favoritesCards.getFavoritesFlatsAsArr();

  var selectSortElem = document.querySelector('[name="sort-by"]');

  var textRooms = {
    '1': 'Однокомнатная',
    '2': 'Двухкомнатная',
    '3': 'Трехкомнатная',
    '4': 'Четырехкомнатная'
  };

  function displayResult(params) {
    var filtersData = params.data || '';
    var response = sendRequest(filtersData);

    favoritesCards = window.favoritesCards.getFavoritesFlatsAsArr();

    response.done(onSuccess);
  }

  function onSuccess(data) {
    var fragment = document.createDocumentFragment();
    clearCardsList();

    var sortedData = window.flatsSort.sortFlats(data, window.flatsSort.getSortByVal(selectSortElem));

    sortedData.forEach(function (attrs, index) {
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
    }, 300);
  }

  function renderCard(attrs, index) {
    var card = templateCard.cloneNode(true);
    var reserveElem = card.querySelector('.flat-card__reserved');
    var wrapLinkElem = card.querySelector('.flat-card__wraplink');
    var image = card.querySelector('.flat-card__picture img');

    var id = attrs.id;
    var linkToFlat = attrs.link;
    var imgSrc = attrs.img;
    var room = attrs.room;
    var isReserve = attrs.reserve;
    var type = attrs.type;
    var floor = attrs.floor;
    var area = parseFloat(attrs.area, 10);
    var price = parseFloat(attrs.price, 10);

    card.dataset.flatId = id;

    if (favoritesCards.includes(id)) {
      card.classList.add('flat-card--is-favorite');
    }

    if (!isReserve) {
      reserveElem.remove();
    }

    wrapLinkElem.href = linkToFlat || 'flat-plan-page.html';
    image.src = imgSrc || 'images/plans/plan-2.svg';

    card.querySelector('[data-flat-type-value]').textContent = type;
    card.querySelector('[data-flat-room-value]').textContent = textRooms[room];
    card.querySelector('[data-flat-area-value]').textContent = area;
    card.querySelector('[data-flat-floor-value]').textContent = floor;
    card.querySelector('[data-flat-price-value]').textContent = window.util.formatNumber(price);
    card.querySelector('[data-flat-price-for-square-meter-value]').textContent = window.util.formatNumber(price / area);

    return card;
  }

  function sendRequest(data) {
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
    startLoading: startLoading,
    endLoading: endLoading,
    clearCardsList: clearCardsList
  };
})(window, jQuery);

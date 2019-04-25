window.flatsResult = (function (window, $) {
  'use srict';

  var flatsResult = document.querySelector('.flats-result');

  if (!flatsResult) {
    return;
  }

  var cardsList = flatsResult.querySelector('.flats-cards');
  var favoritesCards = window.favoritesCards.getFavoritesFlatsAsArr();
  var selectSortElem = document.querySelector('[name="sort-by"]');
  var source = document.querySelector('#flatsResultCardTemplate').innerHTML;
  var template = Handlebars.compile(source);
  var textRooms = {
    '1': 'Однокомнатная',
    '2': 'Двухкомнатная',
    '3': 'Трехкомнатная',
    '4': 'Четырехкомнатная'
  };

  function displayResult(params) {
    startLoading();

    var data = params.data || '';
    var response = window.util.sendRequest(data, window.util.URL_FILTER_HANDLER);

    favoritesCards = window.favoritesCards.getFavoritesFlatsAsArr();

    response.done(renderFilteredFlats);
  }

  function renderFilteredFlats(data) {
    clearCardsList();

    window.util.filteredFlats = data;

    var sortedData = window.flatsSort.sortFlats(window.util.filteredFlats, window.flatsSort.getSortByVal(selectSortElem));

    cardsList.innerHTML = template(sortedData);

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
    image.src = imgSrc || 'images/plans/1-1.png';

    card.querySelector('[data-flat-type-value]').textContent = type;
    card.querySelector('[data-flat-room-value]').textContent = textRooms[room];
    card.querySelector('[data-flat-area-value]').textContent = area;
    card.querySelector('[data-flat-floor-value]').textContent = floor;
    card.querySelector('[data-flat-price-value]').textContent = window.util.formatNumber(price);
    card.querySelector('[data-flat-price-for-square-meter-value]').textContent = window.util.formatNumber(price / area);

    return card;
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
    cardsList: cardsList,
    // renderCard: renderCard,
    startLoading: startLoading,
    endLoading: endLoading,
    clearCardsList: clearCardsList,
    renderFilteredFlats: renderFilteredFlats
  };
})(window, jQuery);

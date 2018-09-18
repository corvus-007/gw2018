window.flatsResult = (function () {
  'use srict';

  var $ = window.jQuery;
  var flatsResult = document.querySelector('.flats-result');

  if (!flatsResult) {
    return;
  }

  var table = flatsResult.querySelector('.flats-result__table');
  var cardsList = flatsResult.querySelector('.flats-cards');
  var templateCard = document.querySelector('#flats-result-card-template').content.querySelector('.flat-card');

  function displayResult(params) {
    var filtersData = params.data || '';
    var response = sendRequest(filtersData, onSuccess);

    response.done(onSuccess);
  }

  function onSuccess(data) {
    var fragment = document.createDocumentFragment();
    clearCardsList();

    data.forEach(function (attrs) {
      fragment.appendChild(renderCard(attrs));
    });

    cardsList.appendChild(fragment);

    if (window.matchMedia('(min-width: 1024px)').matches) {
      $('[data-sticky-target]').stick_in_parent({
        offset_top: 110
      });
    }

    setTimeout(function () {
      endLoading();
    }, 350);
  }

  function renderCard(attrs) {
    var card = templateCard.cloneNode(true);
    var reserveElem = card.querySelector('.flat-card__reserved');
    var image = card.querySelector('.flat-card__picture img');

    if (!attrs.reserve) {
      reserveElem.remove();
    }

    image.src = 'images/plans/plan-2.svg';

    // Проверка, добавлена-ли квартира в избранное

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
    table: table,
    tbody: cardsList,
    sendRequest: sendRequest,
    renderCard: renderCard,
    clearCardsList: clearCardsList
  };
})();

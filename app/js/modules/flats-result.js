window.flatsResult = (function (window, $) {
  'use srict';

  var flatsResult = document.querySelector('.flats-result');

  if (!flatsResult) {
    return;
  }

  var cardsList = flatsResult.querySelector('.flats-cards');
  // var favoritesCards = window.favoritesCards.getFavoritesFlatsAsArr();
  var selectSortElem = document.querySelector('[name="sort-by"]');

  var source = `
    {{#each this}}
    <li class="flats-result__item flats-cards__item flat-card" data-dlat-id="{{id}}">
      <a class="flat-card__wraplink" href="/apartment/{{id}}/">
        <div class="flat-card__picture-holder">
          <div class="flat-card__picture">
            <img src="{{main_layout}}" alt="">
          </div>
        </div>
        <div class="flat-card__content">
          <div class="flat-card__info-block">
            <span class="flat-card__type-of-building">
              Тип дома
              <span class="flat-card__type-of-building-value" data-flat-type-value>{{houseType}}</span>
            </span>
            <div class="flat-card__title">
              <span class="flat-card__rooms" data-flat-room-value>{{rooms}}</span>
              <span class="flat-card__area"><span class="flat-card__area-value" data-flat-area-value>{{area}}</span> м²</span>
            </div>
            <div class="flat-card__floor">
              <span class="flat-card__floor-value" data-flat-floor-value>{{floor}}</span> этаж
              <button class="flat-card__floor-to-look button" type="button" data-src="{{placingApartmentOnFloorPlanFile}}" data-fancybox>Смотреть на плане</button>
            </div>
          </div>
          <div class="flat-card__price-block" style="display: none !important;">
            <b class="flat-card__price-for-flat"><span class="flat-card__price-for-flat-value" data-flat-price-value>{{totalCost}}</span> руб.</b>
            <span class="flat-card__price-for-square-meter">или <span class="flat-card__price-for-square-meter-value" data-flat-price-for-square-meter-value>{{costMeter}}</span> за м²</span>
          </div>
        </div>
      </a>
      <div class="flat-card__stick" style="display: none !important;">
        <span class="flat-card__reserved" aria-label="Квартира забронирована" title="Квартира забронирована">
          <svg class="flat-card__reserved-icon flat-card__icon" width="16" height="16" viewBox="0 0 402 402">
            <path d="M357.4 190.7c-5.3-5.3-11.7-8-19.4-8h-9V128c0-35-12.6-65-37.7-90.2A123 123 0 0 0 201 0a123 123 0 0 0-90.2 37.7A123 123 0 0 0 73 127.9v54.8h-9c-7.7 0-14.1 2.7-19.5 8-5.3 5.3-8 11.8-8 19.4v164.5c0 7.6 2.7 14 8 19.4 5.4 5.3 11.8 8 19.5 8h274c7.7 0 14.1-2.7 19.5-8 5.3-5.3 8-11.8 8-19.4V210c0-7.6-2.7-14-8-19.4zm-83.3-8H127.9V128c0-20.2 7.1-37.4 21.4-51.7A70.4 70.4 0 0 1 201 54.8c20.2 0 37.4 7.2 51.7 21.4A70.4 70.4 0 0 1 274 128v54.8z" /></svg>
        </span>
      </div>
    </li>
    {{/each}}
  `;
  var template = Handlebars.compile(source);

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
    console.log(data);
    var sortedData = window.flatsSort.sortFlats(data, window.flatsSort.getSortByVal(selectSortElem));
    cardsList.innerHTML = template(sortedData);

    setTimeout(function () {
      endLoading();
    }, 300);
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

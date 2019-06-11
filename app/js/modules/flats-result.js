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
      <div class="flat-card__stick">
        <span class="flat-card__reserved" data-status-flat="{{status}}" aria-label="Квартира забронирована" title="Квартира забронирована">
          <svg class="flat-card__reserved-icon flat-card__icon" width="16" height="16" viewBox="0 0 402 402">
            <use xlink:href="public/build/images/symbols.svg#padlock"></use>
          </svg>
            Квартира забронирована
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

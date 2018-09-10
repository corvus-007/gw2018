window.flatsResult = (function () {
  'use srict';

  var flatsResult = document.querySelector('.flats-result');

  if (!flatsResult) {
    return;
  }

  var table = flatsResult.querySelector('.flats-result__table');
  var tbody = flatsResult.querySelector('.flats-result__tbody');
  var templateRow = document.querySelector('#flats-result-row-template').content.querySelector('.flats-result__row');

  function displayResult(params) {
    var filtersData = params.data || '';
    var response = sendRequest(filtersData, onSuccess);

    response.done(onSuccess);

    tbody.addEventListener('click', tableClickHandler);
  }

  function onSuccess(data) {
    var fragment = document.createDocumentFragment();
    clearBody();

    data.forEach(function (attrs) {
      fragment.appendChild(renderRow(attrs));
    });

    tbody.appendChild(fragment);

    $(table).tablesorter();

    if (window.matchMedia('(min-width: 1024px)').matches) {
      $('[data-sticky-target]').stick_in_parent({
        offset_top: 110
      });
    }

    setTimeout(function () {
      endLoading();
    }, 350);
  }

  function renderRow(attrs) {
    var row = templateRow.cloneNode(true);

    row.setAttribute('data-id', Math.random().toFixed(7).slice(2));
    row.setAttribute('data-room', Math.random().toFixed(7).slice(2));

    if (attrs.reserve) {
      row.classList.add('flats-result__row--reserve');
    }

    row.querySelector('.flats-result__cell--room span').textContent = attrs.room;
    row.querySelector('.flats-result__cell--type span').textContent = attrs.type;
    row.querySelector('.flats-result__cell--floor span').textContent = attrs.floor;
    row.querySelector('.flats-result__cell--area span').textContent = attrs.area;
    // row.querySelector('.flats-result__cell--price').textContent = attrs.price;

    return row;
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

  function tableClickHandler(evt) {
    var target = evt.target;
    var row = target.closest('.flats-result__row');
    var button = target.closest('.flats-result__to-request-flat');

    if (!row || button) {
      return;
    }

    var id = row.dataset.id;
    // window.open(location.origin + location.pathname + '/' + id);
    window.open(location.origin + '/flat-plan-page.html');
  }

  function clearBody() {
    tbody.innerHTML = '';
  }

  function startLoading() {
    flatsResult.classList.add('flats-result--loading');
  }

  function endLoading() {
    flatsResult.classList.remove('flats-result--loading');
  }

  return {
    displayResult: displayResult,
    templateRow: templateRow,
    table: table,
    tbody: tbody,
    sendRequest: sendRequest,
    renderRow: renderRow,
    tableClickHandler: tableClickHandler,
    clearBody: clearBody
  };
})();

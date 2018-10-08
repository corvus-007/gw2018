window.flatFilters = (function () {
  'use strict';

  var $ = window.jQuery;
  var flatFiltersElem = document.querySelector('.flat-filters');

  if (!flatFiltersElem) {
    return;
  }

  var flatFiltersForm = flatFiltersElem.querySelector('.flat-filters__form');
  var lastTimeout = null;

  var areaSliderRange = flatFiltersForm.querySelector('[data-type-slider="area"]');
  var range = JSON.parse(areaSliderRange.dataset.range);

  function setValues(values) {
    var valueFrom = parseInt(values[0]);
    var valueTo = parseInt(values[1]);

    var valueAreaFromEl = flatFiltersForm.querySelector('[data-range-from]');
    var valueAreaToEl = flatFiltersForm.querySelector('[data-range-to]');

    flatFiltersForm.elements.area_from.value = valueFrom;
    flatFiltersForm.elements.area_to.value = valueTo;

    valueAreaFromEl.textContent = valueFrom;
    valueAreaToEl.textContent = valueTo;
  }

  function handleInputFiltersForm() {
    var formData = $(flatFiltersForm).serialize();

    if (lastTimeout) {
      clearInterval(lastTimeout);
    }

    history.replaceState({}, '', '?' + formData);

    lastTimeout = window.setTimeout(function () {
      window.flatsResult.displayResult({
        data: formData
      });
    }, 200);
  }

  function init() {
    var params = new URLSearchParams(location.search);
    var paramType = params.get('type');
    var paramAmountList = params.getAll('amount[]');
    var paramAreaFrom = params.get('area_from');
    var paramAreaTo = params.get('area_to');

    noUiSlider.create(areaSliderRange, {
      start: range,
      connect: true,
      step: 1,
      range: {
        'min': range[0],
        'max': range[1]
      }
    });

    areaSliderRange.noUiSlider.set([paramAreaFrom, paramAreaTo]);
    flatFiltersForm.elements.type.value = paramType;

    for (var checkboxItem of flatFiltersForm.elements['amount[]']) {
      var val = checkboxItem.value;

      if (!paramAmountList.includes(val)) {
        continue;
      }
      checkboxItem.checked = true;
    }

    areaSliderRange.noUiSlider.on('update', setValues);
    areaSliderRange.noUiSlider.on('change', handleInputFiltersForm);
    flatFiltersForm.addEventListener('change', handleInputFiltersForm);
  }

  return {
    init: init
  };
})();

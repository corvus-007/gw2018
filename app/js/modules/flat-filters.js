window.flatFilters = (function () {
  'use strict';

  var $ = window.jQuery;
  var flatFiltersElem = document.querySelector('.flat-filters');

  if (!flatFiltersElem) {
    return;
  }

  var flatFiltersForm = flatFiltersElem.querySelector('.flat-filters__form');
  var sliderRangeItems = flatFiltersForm.querySelectorAll('[data-type-slider]');
  var lastTimeout = null;

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
    // var paramType = params.get('type') || 'all';
    // var paramFloor = params.get('floor') || 'all';
    var paramTypesList = params.getAll('house_type_id[]');
    var paramFloorsList = params.getAll('floors[]');
    var paramRoomsList = params.getAll('rooms[]');

    sliderRangeItems.forEach(prepareSliderRange);

    function prepareSliderRange(sliderRange) {
      var nameOfRange = sliderRange.dataset.typeSlider;
      var flatFilterEl = sliderRange.closest('.flat-filter');
      var filterInputFrom = flatFilterEl.querySelector('[name="' + nameOfRange + '_from"]');
      var filterInputTo = flatFilterEl.querySelector('[name="' + nameOfRange + '_to"]');
      var valueAreaFromEl = flatFilterEl.querySelector('[data-range-from]');
      var valueAreaToEl = flatFilterEl.querySelector('[data-range-to]');
      var params = new URLSearchParams(location.search);
      var paramFrom = params.get(nameOfRange + '_from');
      var paramTo = params.get(nameOfRange + '_to');
      var range = JSON.parse(sliderRange.dataset.range);
      var step = JSON.parse(sliderRange.dataset.step)

      noUiSlider.create(sliderRange, {
        start: range,
        connect: true,
        step: step,
        range: {
          'min': range[0],
          'max': range[1]
        }
      });

      sliderRange.noUiSlider.set([paramFrom, paramTo]);

      sliderRange.noUiSlider.on('update', setValues);
      sliderRange.noUiSlider.on('change', handleInputFiltersForm);
      flatFiltersForm.addEventListener('change', handleInputFiltersForm);

      function setValues(values) {
        var valueFrom = parseInt(values[0]);
        var valueTo = parseInt(values[1]);

        filterInputFrom.value = valueFrom;
        filterInputTo.value = valueTo;

        valueAreaFromEl.textContent = window.util.formatNumber(valueFrom);
        valueAreaToEl.textContent = window.util.formatNumber(valueTo);
      }
    }

    // flatFiltersForm.elements.type.value = paramType;
    // flatFiltersForm.elements.floor.value = paramFloor;

    for (var checkboxItem of flatFiltersForm.elements['house_type_id[]']) {
      var val = checkboxItem.value;

      if (!paramTypesList.includes(val)) {
        continue;
      }
      checkboxItem.checked = true;
    }

    for (var checkboxItem of flatFiltersForm.elements['floors[]']) {
      var val = checkboxItem.value;

      if (!paramFloorsList.includes(val)) {
        continue;
      }
      checkboxItem.checked = true;
    }

    for (var checkboxItem of flatFiltersForm.elements['rooms[]']) {
      var val = checkboxItem.value;

      if (!paramRoomsList.includes(val)) {
        continue;
      }
      checkboxItem.checked = true;
    }
  }

  return {
    init: init
  };
})();

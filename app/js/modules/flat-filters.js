window.flatFilters = (function () {
  'use strict';

  var $ = window.jQuery;
  var flatFiltersElem = document.querySelector('.flat-filters');

  if (!flatFiltersElem) {
    return;
  }

  var flatFiltersForm = flatFiltersElem.querySelector('.flat-filters__form');
  var lastTimeout = null;

  function handleInputFiltersForm(evt) {
    var formData = $(this).serialize();

    if (lastTimeout) {
      clearInterval(lastTimeout);
    }

    lastTimeout = window.setTimeout(function () {
      window.flatsResult.displayResult({
        filtersData: formData
      });
    }, 200);
  }

  function init() {
    flatFiltersForm.addEventListener('input', handleInputFiltersForm);
  }

  return {
    init: init
  };
})();

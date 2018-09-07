window.flatFilters = (function () {
  'use strict';

  var $ = window.jQuery;
  var flatFilters = document.querySelector('.flat-filters');

  if (!flatFilters) {
    return;
  }

  var flatsResult = window.flatsResult;

  function init() {
    console.log('flatFilters');

    var flatFiltersForm = flatFilters.querySelector('.flat-filters__form');

    flatFiltersForm.addEventListener('input', function (evt) {
      console.log(evt);

    });

    function handleInputFiltersForm(evt) {
      var formData = $(this).serialize();

      window.flatsResult.displayResult({
        filtersData: formData
      });
    }

    flatFiltersForm.addEventListener('input', handleInputFiltersForm);
  }

  return {
    init: init
  };
})();

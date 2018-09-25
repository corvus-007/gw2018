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

    history.replaceState({}, '', '?'+formData);

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

    flatFiltersForm.elements.type.value = paramType;

    for (var checkboxItem of flatFiltersForm.elements['amount[]']) {
      var val = checkboxItem.value;

      if (!paramAmountList.includes(val)) {
        continue;
      }
      checkboxItem.checked = true;
    }

    flatFiltersForm.addEventListener('change', handleInputFiltersForm);
  }

  return {
    init: init
  };
})();

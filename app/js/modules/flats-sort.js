window.flatsSort = (function (window, $) {
  'use strict';

  function getSortByVal(selectControlNode) {
    return selectControlNode.value;
  }

  function sortFlats(data, sortByVal) {
    if (sortByVal === 'default' || !sortByVal) {
      return data;
    }

    var copyData = data.slice();

    return copyData.sort(window.util.compareTypes[sortByVal]);
  }

  return {
    getSortByVal: getSortByVal,
    sortFlats: sortFlats
  }

})(window, jQuery);

window.util = (function () {
  'use strict';

  return {
    KEYCODE_ESC: 27,
    URL_TOOLTIP_HOUSE_HANDLER: 'js/tooltip-house-mock.json',
    URL_FILTER_HANDLER: 'js/flats-mock.json',
    compareTypes: {
      rooms: function (a, b) {
        var roomsA = parseInt(a.room, 10);
        var roomsB = parseInt(b.room, 10);

        return (roomsA - roomsB);
      },
      floor: function (a, b) {
        var floorA = parseInt(a.floor, 10);
        var floorB = parseInt(b.floor, 10);

        return (floorA - floorB);
      },
      area: function (a, b) {
        var areaA = parseFloat(a.area);
        var areaB = parseFloat(b.area);

        return (areaA - areaB);
      },
      price: function (a, b) {
        var priceA = parseFloat(a.price);
        var priceB = parseFloat(b.price);

        return priceA - priceB;
      }
    },
    filteredFlats: null,
    isDevMode: function () {
      return location.hostname === 'localhost';
    },
    setMaxHeight: function (selector) {
      var maxHeight;
      var elements = document.querySelectorAll(selector);

      if (!elements.length) {
        return;
      }

      maxHeight = Array.from(elements).reduce(function findMaxHeight(prevValue, element) {
        var currentValue = element.offsetHeight;
        return (prevValue > currentValue) ? prevValue : currentValue;
      }, 0);

      Array.from(elements).forEach(function specifyMaxHeight(it) {
        it.style.height = maxHeight + 'px';
      });
    },
    getScrollbarWidth: function () {
      var div = document.createElement('div');

      div.style.overflowY = 'scroll';
      div.style.width = '50px';
      div.style.height = '50px';
      div.style.visibility = 'hidden';

      document.body.appendChild(div);
      var scrollWidth = div.offsetWidth - div.clientWidth;
      document.body.removeChild(div);

      return scrollWidth;
    },
    formatNumber: function (num) {
      var formatter = new Intl.NumberFormat('ru', {
        minimumFractionDigits: 0
      });

      return formatter.format(num);
    },
    sendRequest: function (data, url) {
      data = data || '';

      return $.ajax({
        type: "GET",
        url: url,
        data: data,
        dataType: "JSON"
      });
    },
  };
})();

window.util = (function () {
  'use strict';

  return {
    KEYCODE_ESC: 27,
    URL_TOOLTIP_HOUSE_HANDLER: '//filter.greenwoodclub.ru/api/get_tooltip_house/',
    // URL_FILTER_HANDLER: '/api/getApartmentsByFilter',
    URL_FILTER_HANDLER: 'http://45.67.57.189/api/2/getApartmentsByFilter',
    compareTypes: {
      rooms: function (a, b) {
        var roomList = {
          'Однокомнатная': '1',
          'Двухкомнатная': '2',
          'Трехкомнатная': '3',
          'Четырёхкомнатная': '4',
          'Пентхаус': 'П'
        };

        var roomValueA = roomList[a.rooms] || '';
        var roomValueB = roomList[b.rooms] || '';
        var roomsA = roomValueA.toString();
        var roomsB = roomValueB.toString();

        return roomsA > roomsB ? 1 : -1;
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
        var totalCostA = a.totalCost.replace(/\D/g, '');
        var totalCostB = b.totalCost.replace(/\D/g, '');
        var priceA = parseFloat(totalCostA);
        var priceB = parseFloat(totalCostB);

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

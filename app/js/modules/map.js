window.map = (function (window, $) {
  'use strict';

  var mapElem = document.querySelector('#contacts-map');

  if (!mapElem) {
    return;
  }

  mapElem.classList.remove('.contacts__map--no-js');

  ymaps.ready(function () {
    var map = new ymaps.Map(mapElem, {
      center: [53.250706, 34.371277],
      zoom: 17,
      controls: []
    });

    map.behaviors.disable(['scrollZoom']);
    var myPlacemark = new ymaps.Placemark([53.250706, 34.371277], {
      hintContent: "г. Брянск, пр-кт Ленина, д. 67"
    }, {
      iconLayout: 'default#image',
      iconImageHref: 'images/icon-map-pin.svg',
      iconImageSize: [54, 54],
      iconImageOffset: [-25, -54]
    });

    map.geoObjects.add(myPlacemark);
  });
})(window, jQuery);

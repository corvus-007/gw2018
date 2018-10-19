window.map = (function (window, $) {
  'use strict';

  var dirname = window.util.isDevMode() ? '' : '/wp-content/themes/greenwood/';

  var mapElem = document.querySelector('#contacts-map');

  if (!mapElem) {
    return;
  }

  mapElem.classList.remove('.contacts__map--no-js');

  ymaps.ready(function () {
    var map = new ymaps.Map(mapElem, {
      center: [53.273316, 34.346687],
      zoom: 17,
      controls: []
    });

    map.behaviors.disable(['scrollZoom']);
    var myPlacemark = new ymaps.Placemark([53.273316, 34.346687], {
      hintContent: "г. Брянск, ул. Степная, д. 12"
    }, {
      iconLayout: 'default#image',
      iconImageHref: dirname + 'images/icon-map-pin.svg',
      iconImageSize: [54, 54],
      iconImageOffset: [-25, -54]
    });

    map.geoObjects.add(myPlacemark);
  });
})(window, jQuery);

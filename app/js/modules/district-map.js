window.districtMap = (function (window, $) {
  'use strict';

  // Группы объектов
  var groups = [{
    name: "Университет",
    style: "islands#redIcon",
    opt: {
      iconLayout: 'default#image',
      iconImageHref: 'images/district/district_university.svg',
      iconImageSize: [36, 45],
      iconImageOffset: [-18, -45]
    },
    items: [{
      center: [53.272321, 34.35246],
      name: "Монумент &quot;Родина-Мать&quot;"
    }, {
      center: [53.264855, 34.359433],
      name: "Памятник &quot;Богдану Хмельницкому&quot;"
    }, {
      center: [50.454433, 30.529874],
      name: "Арка Дружбы народов"
    }]
  }, {
    name: "Почта",
    style: "islands#redIcon",
    opt: {
      iconLayout: 'default#image',
      iconImageHref: 'images/district/district_post.svg',
      iconImageSize: [36, 45],
      iconImageOffset: [-18, -45]
    },
    items: [{
      center: [53.27429, 34.348416],
      // name: "Монумент &quot;Родина-Мать&quot;"
    }, {
      center: [53.271005, 34.353244],
      // name: "Памятник &quot;Богдану Хмельницкому&quot;"
    }]
  }, {
    name: "Мед. учреждение",
    style: "islands#redIcon",
    opt: {
      iconLayout: 'default#image',
      iconImageHref: 'images/district/district_health.svg',
      iconImageSize: [36, 45],
      iconImageOffset: [-18, -45]
    },
    items: [{
      center: [53.277151, 34.346785],
      // name: "Монумент &quot;Родина-Мать&quot;"
    }]
  }, {
    name: "Питание",
    style: "islands#redIcon",
    opt: {
      iconLayout: 'default#image',
      iconImageHref: 'images/district/district_food.svg',
      iconImageSize: [36, 45],
      iconImageOffset: [-18, -45]
    },
    items: [{
      center: [53.27216, 34.34966],
      // name: "Монумент &quot;Родина-Мать&quot;"
    }, {
      center: [53.271833, 34.344746]
    }]
  }];


  var mapElem = document.querySelector('#district-map');

  if (!mapElem) {
    return;
  }

  mapElem.classList.remove('.district__map--no-js');


  ymaps.ready(function () {
    var map = new ymaps.Map(mapElem, {
      center: [53.276576, 34.350161],
      zoom: 15,
      controls: []
    });

    for (var i = 0, l = groups.length; i < l; i++) {
      createMenuGroup(groups[i]);
    }

    map.behaviors.disable(['scrollZoom']);

    var myPlacemark = new ymaps.Placemark([53.276576, 34.350161], {
      hintContent: "г. Брянск, пр-кт Ленина, д. 67"
    }, {
      iconLayout: 'default#image',
      iconImageHref: 'images/icon-map-pin.svg',
      iconImageSize: [54, 54],
      iconImageOffset: [-25, -54]
    });

    function createMenuGroup(group) {
      // Коллекция для геообъектов группы.
      var collection = new ymaps.GeoObjectCollection(null, group.opt);
      // Контейнер для подменю.

      // Добавляем коллекцию на карту.
      map.geoObjects.add(collection);

      for (var j = 0, m = group.items.length; j < m; j++) {
        createSubMenu(group.items[j], collection);
      }
    }

    function createSubMenu(item, collection) {
      // Пункт подменю.
      // Создаем метку.
      var placemark = new ymaps.Placemark(item.center, {
        // hintContent: item.name
      });

      // Добавляем метку в коллекцию.
      collection.add(placemark);
      // Добавляем пункт в подменю.

    }

    map.geoObjects.add(myPlacemark);
  });
})(window, jQuery);

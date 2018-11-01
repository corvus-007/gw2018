window.util = (function () {
  'use strict';

  return {
    KEYCODE_ESC: 27,
    URL_FILTER_HANDLER: 'js/flats-mock.json',
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
  };
})();

window.splashScreen = (function (window, $) {
  'use strict';

  var splashScreen = document.querySelector('.splash-screen');

  if (!splashScreen) {
    return;
  }

  document.body.style.overflowY = 'hidden';
  document.body.style.paddingRight = window.util.getScrollbarWidth() + 'px';

  window.addEventListener('load', function () {
    splashScreen.classList.add('splash-screen--hidden');
    document.body.style.overflowY = '';
    document.body.style.paddingRight = '';
  });
})(window, jQuery);

window.outCover = (function() {
  'use strict';

  var $ = window.jQuery;
  var outCover = document.querySelector('.out-cover');
  var outCoverBody = outCover.querySelector('.out-cover__body');
  var outCoverMobileNavWrapper = outCover.querySelector(
    '.out-cover__mobile-nav-wrapper'
  );
  var outCoverFooter = outCover.querySelector('.out-cover__footer');
  var outCoverToggle = document.querySelector('.out-cover-toggle');
  var scrollWidth = window.util.getScrollbarWidth();
  var scrollPageValue = 0;

  var onOutCoverEscPress = function(event) {
    if (event.keyCode === window.util.KEYCODE_ESC) {
      hideOutCover();
    }
  };

  var showOutCover = function() {
    scrollPageValue = window.pageYOffset;
    document.body.classList.add('no-scroll', 'is-out-cover-opened');
    outCoverToggle.classList.add('out-cover-toggle--fired');
    outCover.classList.add('out-cover--opened');
    document.addEventListener('keydown', onOutCoverEscPress);
  };

  var hideOutCover = function() {
    outCover.classList.remove('out-cover--opened');
    document.body.classList.remove('no-scroll', 'is-out-cover-opened');
    outCoverToggle.classList.remove('out-cover-toggle--fired');
    window.scrollTo(0, scrollPageValue);
    document.removeEventListener('keydown', onOutCoverEscPress);
  };

  outCoverToggle.addEventListener('click', function(event) {
    event.preventDefault();

    if (!this.classList.contains('out-cover-toggle--fired')) {
      showOutCover();
    } else {
      hideOutCover();
    }

  });

  return {
    mainNavWrapper: outCoverMobileNavWrapper,
    show: showOutCover,
    hide: hideOutCover
  };
})();

window.animations = (function (window, $) {
  'use strict';

  var controller = new ScrollMagic.Controller();
  var isRunIntroTweens = localStorage.getItem('runTweens');

  window.addEventListener('load', function () {

    if (!isRunIntroTweens) {
      var tlIntro = new TimelineMax({
        onComplete: function () {
          localStorage.setItem('runTweens', true);
        }
      });

      tlIntro
        .from('.section-intro__picture', 1.2, {
          opacity: 0,
          marginLeft: -20,
        })
        .from('.section-intro__text-first-line', 0.4, {
          opacity: 0,
          y: -200,
        })
        .from('.section-intro__text-quantity', 0.4, {
          opacity: 0,
          x: -100,
        })
        .from('.section-intro__text-unit-holder', 0.4, {
          opacity: 0,
          y: 40,
        }, '-=0.1')
        .from('.section-intro__to-more', 0.8, {
          opacity: 0,
          y: 50,
          ease: Elastic.easeOut.config(1, 0.5)
        })
        .from('.intro-actions', 1, {
          opacity: 0,
          scale: 0.6,
          ease: Elastic.easeOut.config(1, 0.5)
        });
    }

  });

  var tl = new TimelineMax();
  tl.staggerFrom('.features__item', 0.8, {
    opacity: 0,
    scale: 0.5,
    ease: Back.easeInOut.config(1.7),
  }, 0.15);

  new ScrollMagic.Scene({
      triggerElement: '.features',
      triggerHook: 1,
      reverse: false
    })
    .setTween(tl)
    .addTo(controller);

})(window, jQuery);

window.genplan = (function () {
  'use strict';

  var genplan = document.querySelector('.genplan');

  if (!genplan) {
    return;
  }

  var genplanScroller = genplan.querySelector('.genplan__scroller');
  var genplanSVG = genplan.querySelector('.genplan__svg');
  var genplanTip = genplan.querySelector('.genplan__tip');

  function getViewPosition() {
    return (genplanScroller.scrollWidth - genplanScroller.clientWidth) / 2;
  }

  function showgGenplanTip() {
    genplanTip.classList.remove('genplan__tip--hidden');
  }

  function hideGenplanTip() {
    genplanTip.classList.add('genplan__tip--hidden');
  }

  showgGenplanTip();
  genplanTip.addEventListener('touchstart', function(event) {
    hideGenplanTip();
  });

  function init() {
    genplanScroller.scrollLeft = getViewPosition();
  }

  init();

  return {
    genplan: genplan,
    genplanScroller: genplanScroller,
    genplanSVG: genplanSVG
  };
})();

window.genplanTooltip = (function () {
  'use strict';

  if (!window.genplan) {
    return;
  }

  var genplan = window.genplan.genplan;
  var genplanScroller = window.genplan.genplanScroller;
  var genplanSVG = window.genplan.genplanSVG;
  var prevTooltip;
  var limitCoords = {};

  function getPinElem(pinId) {
    return genplanSVG.querySelector('#pin-' + pinId);
  }

  function getTooltipElem(pinId) {
    return genplan.querySelector('[data-id=pin-' + pinId + ']');
  }

  genplanSVG.addEventListener('mouseover', function (event) {
    var target = event.target;
    var house = target.closest('[id^="house-"]');
    var genplanSVGCoords = genplanSVG.getBoundingClientRect();

    if (!house) {
      return;
    }

    var searchPosition = house.id.indexOf('-') + 1;
    var pinId = house.id.slice(searchPosition);
    var pin = getPinElem(pinId);
    var pinCoords = pin.getBoundingClientRect();
    var pinHeight = pinCoords.bottom - pinCoords.top;
    var tooltip = getTooltipElem(pinId);

    if (!tooltip) {
      return;
    }

    var tooltipCorner = tooltip.querySelector('.genplan-tooltip__corner');

    if (!tooltipCorner) {
      tooltipCorner = document.createElement('span');
      tooltipCorner.classList.add('genplan-tooltip__corner');
      tooltip.appendChild(tooltipCorner);
    }

    var tooltipHeight = tooltip.offsetHeight;
    var tooltipLeft = genplanScroller.scrollLeft + pinCoords.right + 20;
    var tooltipTop = pinCoords.top + pinHeight / 2 - tooltipHeight / 2;
    var tooltipCoords = null;

    limitCoords.top = genplanSVGCoords.top + 20;

    limitCoords.bottom = genplanSVGCoords.bottom - tooltipHeight - 40;

    if (tooltipTop <= limitCoords.top) {
      tooltipTop = limitCoords.top;
    } else if (tooltipTop >= limitCoords.bottom) {
      tooltipTop = limitCoords.bottom;
    }

    if (window.matchMedia("(min-width: 768px)").matches) {
      tooltip.style.left = tooltipLeft + 'px';
      tooltip.style.top = tooltipTop + 'px';
    }

    tooltip.classList.add('genplan-tooltip--showed');

    tooltipCoords = tooltip.getBoundingClientRect();

    tooltipCorner.style.top = pinCoords.top + pinHeight / 2 - tooltipCoords.top + 'px';

    prevTooltip = tooltip;
  });

  genplanSVG.addEventListener('mouseout', function (event) {
    var target = event.target;
    var house = target.closest('[id^="house-"]');

    if (!house) {
      return;
    }

    if (!prevTooltip) {
      return;
    }

    prevTooltip.classList.remove('genplan-tooltip--showed');
  });
})();

window.favoritesCards = (function (window, $) {
  'use strict';

  var goToFavoritePageElem = document.querySelector('.go-to-favorite-page');

  if (!goToFavoritePageElem) {
    return;
  }

  function hasCards() {
    return getFavoritesFlatsAsArr().length ? true : false;
  }

  function getFavoritesFlatsAsArr() {
    var favoritesString = localStorage.getItem('favoritesFlatsIds');
    var favoritesArr = JSON.parse(favoritesString);

    return favoritesArr ? favoritesArr : [];
  }

  function updateFavorites(flatId) {
    var favoritesArr = getFavoritesFlatsAsArr();

    if (!favoritesArr.includes(flatId)) {
      addToFavorites(flatId, favoritesArr);
    } else {
      removeFromFavorites(flatId, favoritesArr);
    }
  }

  function addToFavorites(flatId, favoritesArr) {
    favoritesArr.push(flatId);
    var str = JSON.stringify(favoritesArr);
    localStorage.setItem('favoritesFlatsIds', str);
  }

  function removeFromFavorites(flatId, favoritesArr) {
    var searchIndex = favoritesArr.indexOf(flatId);
    favoritesArr.splice(searchIndex, 1);
    var str = JSON.stringify(favoritesArr);
    localStorage.setItem('favoritesFlatsIds', str);
  }

  function showFavoritesToggler() {
    goToFavoritePageElem.classList.add('go-to-favorite-page--visible');
  }

  function hideFavoritesToggler() {
    goToFavoritePageElem.classList.remove('go-to-favorite-page--visible');
  }

  function createLinkToFavoritesPages() {
    if (hasCards()) {
      showFavoritesToggler()
    } else {
      hideFavoritesToggler();
    }
  }

  createLinkToFavoritesPages();

  return {
    getFavoritesFlatsAsArr: getFavoritesFlatsAsArr,
    updateFavorites: updateFavorites,
    createLinkToFavoritesPages: createLinkToFavoritesPages
  };
})(window, jQuery);

window.flatsCards = (function () {
  'use strict';

  var flatsCards = document.querySelector('.flats-cards');

  if (!flatsCards) {
    return;
  }

  var FlatView = {
    'card': 'flats-cards--display-card',
    'list': 'flats-cards--display-list'
  };

  var currentFlatView = localStorage.getItem('currentFlatView');
  var viewModeForm = document.querySelector('.view-mode-form');

  if (!currentFlatView || currentFlatView === 'card') {
    setDisplayCard();
    viewModeForm.elements.view.value = 'card';
  } else {
    setDisplayList();
    viewModeForm.elements.view.value = 'list';
  }

  flatsCards.classList.add(currentFlatView);
  viewModeForm.addEventListener('change', function (evt) {
    if (localStorage.getItem('currentFlatView') === 'card') {
      setDisplayList();
    } else {
      setDisplayCard();
    }
  });

  flatsCards.addEventListener('click', function (evt) {
    var target = evt.target;
    var favoriteButton = target.closest('.flat-card__add-to-favorite');

    if (!favoriteButton) {
      return;
    }

    var flatCard = favoriteButton.closest('.flat-card');
    var flatId = flatCard.dataset.flatId;

    window.favoritesCards.updateFavorites(flatId);
    updateCardState(flatCard);

    window.favoritesCards.createLinkToFavoritesPages();
  });

  function updateCardState(flatCard) {
    if (!flatCard.classList.contains('flat-card--is-favorite')) {
      flatCard.classList.add('flat-card--is-favorite');
    } else {
      flatCard.classList.remove('flat-card--is-favorite');
    }
  }

  function setDisplayList() {
    localStorage.setItem('currentFlatView', 'list');
    flatsCards.classList.remove(FlatView.card);
    flatsCards.classList.add(FlatView.list);
  }

  function setDisplayCard() {
    localStorage.setItem('currentFlatView', 'card');
    flatsCards.classList.remove(FlatView.list);
    flatsCards.classList.add(FlatView.card);
  }
})(window, jQuery);

window.flatsResult = (function (window, $) {
  'use srict';

  var flatsResult = document.querySelector('.flats-result');

  if (!flatsResult) {
    return;
  }

  var cardsList = flatsResult.querySelector('.flats-cards');
  var templateCard = document.querySelector('#flats-result-card-template').content.querySelector('.flat-card');
  var favoritesCards = window.favoritesCards.getFavoritesFlatsAsArr();

  function displayResult(params) {
    var filtersData = params.data || '';
    var response = sendRequest(filtersData, onSuccess);

    favoritesCards = window.favoritesCards.getFavoritesFlatsAsArr();

    response.done(onSuccess);
  }

  function onSuccess(data) {
    var fragment = document.createDocumentFragment();
    clearCardsList();

    data.forEach(function (attrs, index) {
      fragment.appendChild(renderCard(attrs, index));
    });

    cardsList.appendChild(fragment);

    if (window.matchMedia('(min-width: 1024px)').matches) {
      $('[data-sticky-target]').stick_in_parent({
        offset_top: 110
      });
    }

    setTimeout(function () {
      endLoading();
    }, 800);
  }

  function renderCard(attrs, index) {
    var card = templateCard.cloneNode(true);
    var reserveElem = card.querySelector('.flat-card__reserved');
    var image = card.querySelector('.flat-card__picture img');

    var id = index + '';
    card.dataset.flatId = id;

    if (favoritesCards.includes(id)) {
      card.classList.add('flat-card--is-favorite');
    }

    if (!attrs.reserve) {
      reserveElem.remove();
    }

    image.src = 'images/plans/plan-2.svg';

    card.querySelector('[data-flat="room"]').textContent = attrs.room;
    card.querySelector('[data-flat="area"]').textContent = attrs.area;

    return card;
  }

  function sendRequest(data, onSuccess, onError) {
    data = data || '';

    startLoading();

    return $.ajax({
      type: "GET",
      url: window.util.URL_FILTER_HANDLER,
      data: data,
      dataType: "JSON"
    });
  }

  function clearCardsList() {
    cardsList.innerHTML = '';
  }

  function startLoading() {
    flatsResult.classList.add('flats-result--loading');
  }

  function endLoading() {
    flatsResult.classList.remove('flats-result--loading');
  }

  return {
    displayResult: displayResult,
    templateCard: templateCard,
    cardsList: cardsList,
    sendRequest: sendRequest,
    renderCard: renderCard,
    clearCardsList: clearCardsList
  };
})(window, jQuery);

window.flatFilters = (function () {
  'use strict';

  var $ = window.jQuery;
  var flatFiltersElem = document.querySelector('.flat-filters');

  if (!flatFiltersElem) {
    return;
  }

  var flatFiltersForm = flatFiltersElem.querySelector('.flat-filters__form');
  var lastTimeout = null;

  var areaSliderRange = flatFiltersForm.querySelector('[data-type-slider="area"]');
  var range = JSON.parse(areaSliderRange.dataset.range);

  function setValues(values) {
    var valueFrom = parseInt(values[0]);
    var valueTo = parseInt(values[1]);

    var valueAreaFromEl = flatFiltersForm.querySelector('[data-range-from]');
    var valueAreaToEl = flatFiltersForm.querySelector('[data-range-to]');

    flatFiltersForm.elements.area_from.value = valueFrom;
    flatFiltersForm.elements.area_to.value = valueTo;

    valueAreaFromEl.textContent = valueFrom;
    valueAreaToEl.textContent = valueTo;
  }

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
    var paramType = params.get('type');
    var paramAmountList = params.getAll('amount[]');
    var paramAreaFrom = params.get('area_from');
    var paramAreaTo = params.get('area_to');

    noUiSlider.create(areaSliderRange, {
      start: range,
      connect: true,
      step: 1,
      range: {
        'min': range[0],
        'max': range[1]
      }
    });

    areaSliderRange.noUiSlider.set([paramAreaFrom, paramAreaTo]);
    flatFiltersForm.elements.type.value = paramType;

    for (var checkboxItem of flatFiltersForm.elements['amount[]']) {
      var val = checkboxItem.value;

      if (!paramAmountList.includes(val)) {
        continue;
      }
      checkboxItem.checked = true;
    }

    areaSliderRange.noUiSlider.on('update', setValues);
    areaSliderRange.noUiSlider.on('change', handleInputFiltersForm);
    flatFiltersForm.addEventListener('change', handleInputFiltersForm);
  }

  return {
    init: init
  };
})();

window.flat = (function (window, $) {
  'use strict';

  var flat = document.querySelector('.flat');

  if (!flat) {
    return;
  }

  init();

  function init() {
    var flat = document.querySelector('.flat');
    // var flatPlans = flat.querySelectorAll('.flat__plan');
    var flatPlan = flat.querySelector('.flat-plan');
    var flatDetail = flat.querySelector('.flat-detail');
    var frame = flat.querySelector('.flat-plan__frame');
    var planZoomToImage = flatPlan.querySelector('.flat-plan__zoom-to-image');
    var planAdjuster = flatPlan.querySelector('.flat-plan__adjuster');
    var planImage = flatPlan.querySelector('.flat-plan__image');

    function processingPlan(plan) {
      planAdjuster = plan.querySelector('.flat-plan__adjuster');
      planImage = plan.querySelector('.flat-plan__image');

      function updatePlanAdjuster(ratio) {
        planAdjuster.style.paddingTop = ratio * 100 + '%';
      }

      updatePlanAdjuster(getImageRatio(planImage));

      planImage.addEventListener('load', function () {
        updatePlanAdjuster(getImageRatio(planImage));
      });

      planImage.addEventListener('click', function (event) {
        planImage.classList.toggle('flat-plan__image--scale');
      });
    }

    function getImageRatio(image) {
      return image.naturalHeight / image.naturalWidth;
    }

    function getDetailHeight() {
      return flatDetail.offsetHeight;
    }

    if (window.matchMedia("(pointer: coarse)").matches) {
      processingPlan(flatPlan);
      planZoomToImage.addEventListener('click', function(evt){
        evt.preventDefault();
      });
    } else {
      // $(frame).zoom();
      $(planZoomToImage).fancybox({
        slideClass: 'flat-plan-popup',
        animationEffect: 'zoom-in-out'
      });
    }

    if (window.matchMedia("(min-width: 768px)").matches) {
      flatPlan.style.height = getDetailHeight() + 'px';
    }

    // if (window.matchMedia("(min-width: 768px) and not (pointer: coarse)").matches) {
    // }
  }

  return {
    init: init
  };
})(window, jQuery);

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

window.presentationVideo = (function (window, $) {
  var presentationVideo = document.querySelector('.presentation-video');

  if (!presentationVideo) {
    return false;
  }

  var videoControls = presentationVideo.querySelector('.presentation-video__controls');
  var videoEl = presentationVideo.querySelector('video');

  if (window.matchMedia('(pointer: coarse)').matches) {
    videoEl.controls = true;
  }

  videoEl.addEventListener('play', onVideoPLay);
  videoEl.addEventListener('pause', onVideoPause);

  function onVideoPLay() {
    presentationVideo.classList.add('presentation-video--playing');
  }

  function onVideoPause() {
    presentationVideo.classList.remove('presentation-video--playing');
  }

  videoControls.addEventListener('click', function (evt) {
    console.log('click');

    var target = evt.target;
    var actionButton = target.closest('[data-video-action]')
    if (!actionButton) {
      return;
    }

    var action = actionButton.dataset.videoAction;

    switch (action) {
      case 'play':
        videoEl.play();
        break;
      case 'pause':
        videoEl.pause();
        break;
    }
  });
})(window, jQuery);

window.district = (function (window, $) {
  'use strict';

  var dirname = window.util.isDevMode() ? '' : '/wp-content/themes/greenwood/';

  // Группы объектов
  var groups = [{
    name: "Университет",
    style: "islands#redIcon",
    opt: {
      iconLayout: 'default#image',
      iconImageHref: dirname + 'images/district/district_university.svg',
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
      iconImageHref: dirname + 'images/district/district_post.svg',
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
      iconImageHref: dirname + 'images/district/district_health.svg',
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
      iconImageHref: dirname + 'images/district/district_food.svg',
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

  var district = document.querySelector('.district');

  if (!district) {
    return;
  }

  var districtMap = document.querySelector('#district-map');
  var districtLegend = district.querySelector('.district-legend');
  var districtLegendToggle = district.querySelector('.district-legend-toggle');
  var districtLegendClose = districtLegend.querySelector(
    '.district-legend__close'
  );

  function showLegend() {
    districtLegend.classList.remove('district-legend--hidden');
    districtLegendToggle.classList.add('district-legend-toggle--hidden');
  }

  function hideLegend() {
    districtLegend.classList.add('district-legend--hidden');
    districtLegendToggle.classList.remove('district-legend-toggle--hidden');
  }

  districtLegendToggle.addEventListener('click', function () {
    showLegend();
  });

  districtLegendClose.addEventListener('click', function () {
    hideLegend();
  });

  districtMap.classList.remove('.district__map--no-js');


  ymaps.ready(function () {
    var map = new ymaps.Map(districtMap, {
      center: [53.276576, 34.350161],
      zoom: 15,
      controls: []
    });

    for (var i = 0, l = groups.length; i < l; i++) {
      createMenuGroup(groups[i]);
    }

    map.behaviors.disable(['scrollZoom']);

    var myPlacemark = new ymaps.Placemark([53.276576, 34.350161], {
      hintContent: "ЖК «Гринвуд»"
    }, {
      iconLayout: 'default#image',
      iconImageHref: dirname + 'images/icon-map-pin.svg',
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


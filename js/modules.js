window.util = (function () {
  'use strict';

  return {
    KEYCODE_ESC: 27,
    URL_TOOLTIP_HOUSE_HANDLER: '/api/get_tooltip_house/',
    URL_FILTER_HANDLER: '/api/getApartmentsByFilter',
    URL_FILTER_HANDLER: '/js/flats-mock.json',
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

window.splashScreen = (function (window, $) {
  'use strict';

  var splashScreen = document.querySelector('.splash-screen');

  if (!splashScreen) {
    return;
  }

  var isLoaded = false;

  document.body.style.overflowY = 'hidden';
  document.body.style.paddingRight = window.util.getScrollbarWidth() + 'px';

  window.addEventListener('load', function () {
    hideSplashScreen();
  });

  setTimeout(() => {
    hideSplashScreen()
  }, 1000 * 8);

  function hideSplashScreen() {
    if (isLoaded) {
      return;
    }

    splashScreen.classList.add('splash-screen--hidden');
    document.body.style.overflowY = '';
    document.body.style.paddingRight = '';

    isLoaded = true;
  }
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
  var tooltip = genplan.querySelector('[data-target="genplan-tooltip"]');
  var limitCoords = {};

  Handlebars.registerHelper('replaceDotOnDash', function (type) {
    return type.replace(/\./g, '-');
  });
  Handlebars.registerHelper('simpleMinPrice', function (price) {
    return (parseInt(price, 10) / 1000000).toFixed(1);
  });
  // var source = document.querySelector('#tooltipHouseTemplate').innerHTML;

  var source = `
  <div class="genplan-tooltip__type">
    тип дома
    <span class="genplan-tooltip__type-value">{{type}}</span>
  </div>
  {{#if is_vacant}}
    <span class="genplan-tooltip__status">Квартиры в наличии</span>
  {{/if}}
  <ul class="genplan-tooltip__rooms-list">
    {{#each roomsList}}
    <li class="genplan-tooltip__room">
      <a href="flats-filter-page.html?type={{replaceDotOnDash ../type}}&rooms[]={{rooms}}" class="genplan-tooltip__room-wraplink">
        <b class="genplan-tooltip__room-label">{{caption}}</b>
        <span class="genplan-tooltip__room-value">от {{simpleMinPrice min_price}} млн.</span>
      </a>
    </li>
    {{/each}}
  </ul>
  <span class="genplan-tooltip__corner"></span>
  `;

  var template = Handlebars.compile(source);

  function getPinElem(pinId) {
    return genplanSVG.querySelector('#pin-' + pinId);
  }

  function sendRequestHouse(id, url) {
    return $.ajax({
      type: "GET",
      url: url + id,
      dataType: "JSON"
    });
  }

  function replaceDashOnDot(id) {
    return id.replace(/-/g, '.');
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

    if (!tooltip) {
      return;
    }

    var response = sendRequestHouse(replaceDashOnDot(pinId), window.util.URL_TOOLTIP_HOUSE_HANDLER);

    response.done(function (data) {
      tooltip.innerHTML = template(data);

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
    });
  });

  genplanSVG.addEventListener('mouseout', function (event) {
    var target = event.target;
    var house = target.closest('[id^="house-"]');

    if (!house) {
      return;
    }

    if (!tooltip) {
      return;
    }

    tooltip.classList.remove('genplan-tooltip--showed');
  });
})();

////=require modules/checkboxes-select.js
class checkboxesSelect {
  constructor(select) {
    this.select = select;
    this.toggle = select.querySelector('.checkboxes-select__toggle');
    this.checkboxesList = select.querySelectorAll('input[type="checkbox"]');
    this.valueNode = select.querySelector('.checkboxes-select__value');
    this.dropdown = select.querySelector('.checkboxes-select__dropdown');
    this.selectName = this.checkboxesList[0].name;
    this.placeholder = select.dataset.placeholder;
    this.select.dataset.name = this.selectName;

    this.displayCheckedValues();

    this.toggle.addEventListener('click', this.onclickToggleHandler.bind(this));
    this.dropdown.addEventListener('change', this.onchangeDropdownHandler.bind(this));
  }

  // Handlers

  onchangeDropdownHandler(evt) {
    var target = evt.target;
    var checkbox = target.closest('input[type="checkbox"]');

    if (!checkbox) {
      return;
    }

    var value = checkbox.value;
    var isChecked = checkbox.checked;

    if (value === 'all') {
      if (isChecked) {
        this.checkAll();
      } else {
        this.uncheckAll();
      }
    } else {
      if (this.isCheckAll()) {
        this.checkItemValueAll();
      } else {
        this.uncheckItemValueAll();
      }
    }

    this.displayCheckedValues();
  }

  onclickToggleHandler(evt) {
    evt.preventDefault();

    var isSelectOpen = this.select.classList.contains('checkboxes-select--open');

    if (!isSelectOpen) {
      this.openSelect();
    } else {
      this.closeSelect();
    }
  }

  onclickWindowHandler(evt) {
    var target = evt.target;
    var targetSelect = target.closest('.checkboxes-select');

    if (!targetSelect) {
      this.closeSelect();
    }
  }

  // Methods

  isCheckAll() {
    return [...this.checkboxesList].every((it, index) => {
      return index !== 0 ? it.checked : true;
    });
  }

  displayCheckedValues() {
    var values = this.getValuesString();
    this.valueNode.textContent = values ? values : this.placeholder;
  }

  checkAll() {
    [...this.checkboxesList].forEach((it) => {
      it.checked = true;
    });
  }

  uncheckAll() {
    [...this.checkboxesList].forEach((it) => {
      it.checked = false;
    });
  }

  checkItemValueAll() {
    this.checkboxesList[0].checked = true;
  }

  uncheckItemValueAll() {
    this.checkboxesList[0].checked = false;
  }

  getValuesList() {
    if (this.isCheckAll()) {
      var box = this.checkboxesList[0].parentElement;

      return [box.textContent.trim()];
    }

    return [...this.checkboxesList]
      .filter((it) => {
        return it.checked;
      })
      .map((it) => {
        var box = it.parentElement;
        return box.textContent.trim();
      });
  }

  getValuesString() {
    return this.getValuesList().join(', ');
  }

  openSelect() {
    this.select.classList.add('checkboxes-select--open');
    window.addEventListener('click', this.onclickWindowHandler.bind(this));
  }

  closeSelect() {
    this.select.classList.remove('checkboxes-select--open');
    window.removeEventListener('click', this.onclickWindowHandler.bind(this));
  }
}

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

  if (!currentFlatView || currentFlatView === 'list') {
    setDisplayList();
    viewModeForm.elements.view.value = 'list';
  } else {
    setDisplayCard();
    viewModeForm.elements.view.value = 'card';
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
    var floorToLookButton = target.closest('.flat-card__floor-to-look');

    if (!floorToLookButton) {
      return;
    }

    evt.preventDefault();

    var imageSrc = floorToLookButton.dataset.src;

    $.fancybox.open({
      src: imageSrc,
      type: 'image',
      opts: {
        slideClass: 'slide-image-custom',
      }
    });
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

window.flatsResult = (function (window, $) {
  'use srict';

  var flatsResult = document.querySelector('.flats-result');

  if (!flatsResult) {
    return;
  }

  var cardsList = flatsResult.querySelector('.flats-cards');
  var favoritesCards = window.favoritesCards.getFavoritesFlatsAsArr();
  var selectSortElem = document.querySelector('[name="sort-by"]');
  var source = document.querySelector('#flatsResultCardTemplate').innerHTML;
  var source__ = '' +
      '{{#each this}}' +
      '<li class="flats-result__item flats-cards__item flat-card" data-dlat-id="{{id}}">\n' +
      '            <a class="flat-card__wraplink" href="/apartment/{{id}}/">\n' +
      '                <div class="flat-card__picture-holder">\n' +
      '                    <div class="flat-card__picture">\n' +
      '                        <img src="{{main_layout}}" alt="">\n' +
      '                    </div>\n' +
      '                </div>\n' +
      '                <div class="flat-card__content">\n' +
      '                    <div class="flat-card__info-block">\n' +
      '              <span class="flat-card__type-of-building">\n' +
      '                Тип дома\n' +
      '              <span class="flat-card__type-of-building-value" data-flat-type-value>{{houseType}}</span>\n' +
      '              </span>\n' +
      '                        <div class="flat-card__title">\n' +
      '                            <span class="flat-card__rooms" data-flat-room-value>{{rooms}}</span>\n' +
      '                            <span class="flat-card__area"><span class="flat-card__area-value" data-flat-area-value>{{area}}</span> м²</span>\n' +
      '                        </div>\n' +
      '                        <div class="flat-card__floor">\n' +
      '                            <span class="flat-card__floor-value" data-flat-floor-value>{{floor}}</span> этаж\n' +
      '                            <button class="flat-card__floor-to-look button" type="button" data-src="{{placingApartmentOnFloorPlanFile}}" data-fancybox>Смотреть на плане</button>\n' +
      '                        </div>\n' +
      '                    </div>\n' +
      '                    <div class="flat-card__price-block">\n' +
      '                        <b class="flat-card__price-for-flat"><span class="flat-card__price-for-flat-value" data-flat-price-value>{{totalCost}}</span> руб.</b>\n' +
      '                        <span class="flat-card__price-for-square-meter">или <span class="flat-card__price-for-square-meter-value" data-flat-price-for-square-meter-value>{{costMeter}}</span> за м²</span>\n' +
      '                    </div>\n' +
      '                </div>\n' +
      '            </a>\n' +
      '            <div class="flat-card__stick">\n' +
      '          <span class="flat-card__reserved" aria-label="Квартира забронирована" title="Квартира забронирована">\n' +
      '            <svg class="flat-card__reserved-icon flat-card__icon" width="16" height="16" viewBox="0 0 402 402"><path d="M357.4 190.7c-5.3-5.3-11.7-8-19.4-8h-9V128c0-35-12.6-65-37.7-90.2A123 123 0 0 0 201 0a123 123 0 0 0-90.2 37.7A123 123 0 0 0 73 127.9v54.8h-9c-7.7 0-14.1 2.7-19.5 8-5.3 5.3-8 11.8-8 19.4v164.5c0 7.6 2.7 14 8 19.4 5.4 5.3 11.8 8 19.5 8h274c7.7 0 14.1-2.7 19.5-8 5.3-5.3 8-11.8 8-19.4V210c0-7.6-2.7-14-8-19.4zm-83.3-8H127.9V128c0-20.2 7.1-37.4 21.4-51.7A70.4 70.4 0 0 1 201 54.8c20.2 0 37.4 7.2 51.7 21.4A70.4 70.4 0 0 1 274 128v54.8z" /></svg>\n' +
      '          </span>\n' +
      '            </div>\n' +
      '        </li> ' +
      '{{/each}}';
  var template = Handlebars.compile(source);
  var textRooms = {
    '1': 'Однокомнатная',
    '2': 'Двухкомнатная',
    '3': 'Трехкомнатная',
    '4': 'Четырехкомнатная'
  };

  function displayResult(params) {
    startLoading();

    var data = params.data || '';
    var response = window.util.sendRequest(data, window.util.URL_FILTER_HANDLER);

    favoritesCards = window.favoritesCards.getFavoritesFlatsAsArr();
    response.done(renderFilteredFlats);
  }

  function renderFilteredFlats(data) {
    clearCardsList();

    window.util.filteredFlats = data;
    console.log(data);
    var sortedData = window.flatsSort.sortFlats(data, window.flatsSort.getSortByVal(selectSortElem));
    cardsList.innerHTML = template(sortedData);

    setTimeout(function () {
      endLoading();
    }, 300);
  }

  function renderCard(attrs, index) {
    var card = templateCard.cloneNode(true);
    var reserveElem = card.querySelector('.flat-card__reserved');
    var wrapLinkElem = card.querySelector('.flat-card__wraplink');
    var image = card.querySelector('.flat-card__picture img');

    var id = attrs.id;
    var linkToFlat = attrs.link;
    var imgSrc = attrs.img;
    var room = attrs.room;
    var isReserve = attrs.reserve;
    var type = attrs.type;
    var floor = attrs.floor;
    var area = parseFloat(attrs.area, 10);
    var price = parseFloat(attrs.price, 10);

    card.dataset.flatId = id;

    if (favoritesCards.includes(id)) {
      card.classList.add('flat-card--is-favorite');
    }

    if (!isReserve) {
      reserveElem.remove();
    }

    wrapLinkElem.href = linkToFlat || 'flat-plan-page.html';
    image.src = imgSrc || 'images/plans/1-1.png';

    card.querySelector('[data-flat-type-value]').textContent = type;
    card.querySelector('[data-flat-room-value]').textContent = textRooms[room];
    card.querySelector('[data-flat-area-value]').textContent = area;
    card.querySelector('[data-flat-floor-value]').textContent = floor;
    card.querySelector('[data-flat-price-value]').textContent = window.util.formatNumber(price);
    card.querySelector('[data-flat-price-for-square-meter-value]').textContent = window.util.formatNumber(price / area);

    return card;
  }

  function clearCardsList() {
    cardsList.innerHTML = '';
  }

  function startLoading() {
    //flatsResult.classList.add('flats-result--loading');
  }

  function endLoading() {
    //flatsResult.classList.remove('flats-result--loading');
  }

  return {
    displayResult: displayResult,
    cardsList: cardsList,
    // renderCard: renderCard,
    //startLoading: startLoading,
    //endLoading: endLoading,
    clearCardsList: clearCardsList,
    renderFilteredFlats: renderFilteredFlats
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
  var sliderRangeItems = flatFiltersForm.querySelectorAll('[data-type-slider]');
  var lastTimeout = null;

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
    // var paramType = params.get('type') || 'all';
    // var paramFloor = params.get('floor') || 'all';
    var paramTypesList = params.getAll('house_type_id[]');
    var paramFloorsList = params.getAll('floors[]');
    var paramRoomsList = params.getAll('rooms[]');

    sliderRangeItems.forEach(prepareSliderRange);

    function prepareSliderRange(sliderRange) {
      var nameOfRange = sliderRange.dataset.typeSlider;
      var flatFilterEl = sliderRange.closest('.flat-filter');
      var filterInputFrom = flatFilterEl.querySelector('[name="' + nameOfRange + '_from"]');
      var filterInputTo = flatFilterEl.querySelector('[name="' + nameOfRange + '_to"]');
      var valueAreaFromEl = flatFilterEl.querySelector('[data-range-from]');
      var valueAreaToEl = flatFilterEl.querySelector('[data-range-to]');
      var params = new URLSearchParams(location.search);
      var paramFrom = params.get(nameOfRange + '_from');
      var paramTo = params.get(nameOfRange + '_to');
      var range = JSON.parse(sliderRange.dataset.range);
      var step = JSON.parse(sliderRange.dataset.step)

      noUiSlider.create(sliderRange, {
        start: range,
        connect: true,
        step: step,
        range: {
          'min': range[0],
          'max': range[1]
        }
      });

      sliderRange.noUiSlider.set([paramFrom, paramTo]);

      sliderRange.noUiSlider.on('update', setValues);
      sliderRange.noUiSlider.on('change', handleInputFiltersForm);
      flatFiltersForm.addEventListener('change', handleInputFiltersForm);

      function setValues(values) {
        var valueFrom = parseInt(values[0]);
        var valueTo = parseInt(values[1]);

        filterInputFrom.value = valueFrom;
        filterInputTo.value = valueTo;

        valueAreaFromEl.textContent = window.util.formatNumber(valueFrom);
        valueAreaToEl.textContent = window.util.formatNumber(valueTo);
      }
    }

    // flatFiltersForm.elements.type.value = paramType;
    // flatFiltersForm.elements.floor.value = paramFloor;

    for (var checkboxItem of flatFiltersForm.elements['house_type_id[]']) {
      var val = checkboxItem.value;

      if (!paramTypesList.includes(val)) {
        continue;
      }
      checkboxItem.checked = true;
    }

    for (var checkboxItem of flatFiltersForm.elements['floors[]']) {
      var val = checkboxItem.value;

      if (!paramFloorsList.includes(val)) {
        continue;
      }
      checkboxItem.checked = true;
    }

    for (var checkboxItem of flatFiltersForm.elements['rooms[]']) {
      var val = checkboxItem.value;

      if (!paramRoomsList.includes(val)) {
        continue;
      }
      checkboxItem.checked = true;
    }
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
    var flatPlanSlider = document.querySelector('.js-flat-plans-slider');
    // var flatPlans = flat.querySelectorAll('.flat__plan');
    var flatPlan = flat.querySelector('.flat-plan');
    var flatDetail = flat.querySelector('.flat-detail');
    var frame = flat.querySelector('.flat-plan__frame');
    // var planZoomToImage = flatPlan.querySelector('.flat-plan__zoom-to-image');
    // var planAdjuster = flatPlan.querySelector('.flat-plan__adjuster');
    // var planImage = flatPlan.querySelector('.flat-plan__image');

    // var $(flatPlanSlider);
    // var flkty = $flatPlanSliderInstance.data('flickity');

    // console.log(flkty);


    $('#popup-request-form').validate({
      submitHandler: function (form, event) {
        event.preventDefault();

        var formData = new FormData(form);

        $.ajax({
          url: "handler.php",
          method: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          dataType: 'json'
        })
          .done(function (data) {
            if (data.status === 1) {
              form.reset();
              $.fancybox.close();
              alert('Спасибо, форма отправлена ;-)');
            } else {
              alert('Произошла ошибка! Попробуйте снова!');
            }
          })
          .fail(function () {
            alert('Произошла ошибка! Обновите страницу и попробуйте снова!');
          });
      },
      rules: {
        'request_cost_phone': {
          checkPhoneMask: true
        }
      }
    });


    $(flatPlanSlider).flickity({
      adaptiveHeight: true,
      imagesLoaded: true,
      pageDots: false
    });

    var flatPlanSliderData = $(flatPlanSlider).data('flickity');

    if (flatPlanSliderData.cells.length <= 1) {
      flatPlanSlider.classList.add('flat-plans-slider--one-slide')
    }

    if (window.matchMedia('(min-width: 768px)').matches) {
      $('[data-target="flat-plan-popup-link"]').fancybox({
        slideClass: 'slide-image-custom'
      });
    } else {
      $('[data-target="flat-plan-popup-link"]').attr('target', '_blank');
    }
  }

  return {
    init: init
  };
})(window, jQuery);

window.flatPageNav = (function (window, $) {
  'use strict';

  var flatPageNav = document.querySelector('[data-target="flat-page-navigation"]');

  if (!flatPageNav) {
    return;
  }

  var flatPageNavItemList = flatPageNav.querySelectorAll('[data-target="flat-page-nav-item"]');
  var flatPageNavContentList = document.querySelectorAll('[data-target="flat-page-nav-content"]');
  var currentItemIndex = 0;

  toggleActiveClassNavItem(flatPageNavItemList[currentItemIndex]);
  toggleActiveClassNavContent(flatPageNavContentList[currentItemIndex]);

  flatPageNav.addEventListener('click', handlerFlatPageNavClick);

  function toggleActiveClassNavItem(currentItem) {
    flatPageNavItemList.forEach(function (it) {
      it.classList.toggle('flat-page-navigation__item--active', currentItem === it);
    });
  }

  function toggleActiveClassNavContent(currentContent) {
    flatPageNavContentList.forEach(function (it) {
      it.classList.toggle('flat-page-nav-content--hidden', currentContent !== it);
    });
  }

  function handlerFlatPageNavClick(evt) {
    evt.preventDefault();

    var target = evt.target;
    var link = target.closest('[data-action="toggle-flat-page-content"]');

    if (!link) {
      return;
    }

    var item = link.parentElement;
    var targetId = link.hash;
    var target = document.querySelector(targetId);

    toggleActiveClassNavItem(item);
    toggleActiveClassNavContent(target);
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

window.promoPopup = (function (window, $) {
  'use strict';

  var promoPopup = document.querySelector('#promo-popup');

  if (!promoPopup) {
    return;
  }

  var isShowedPromoPopup = Cookies.get('promoPopup');
  var PROMO_POPUP_OFFSET_TIME = 1000;
  var phonePromoPopupTimeout = setTimeout(function () {
    $.fancybox.open({
      src: promoPopup,
      type: 'inline',
      opts: {
        afterClose: function () {
          Cookies.set('promoPopup', 1, {
            expires: 7
          });
        }
      }
    });
  }, PROMO_POPUP_OFFSET_TIME);

  if (isShowedPromoPopup) {
    clearTimeout(phonePromoPopupTimeout);
  }
})(window, jQuery);

window.infoPopup = (function (window, $) {
  'use strict';

  var infoPopup = document.querySelector('#info-popup');

  if (!infoPopup) {
    return;
  }

  // var isShowedInfoPopup = Cookies.get('infoPopup');
  var isShowedInfoPopup = 0;
  var info_POPUP_OFFSET_TIME = 1000;
  var phoneInfoPopupTimeout = setTimeout(function () {
    $.fancybox.open({
      src: '#info-popup',
      type: 'inline',
      opts: {
        afterClose: function () {
          Cookies.set('infoPopup', 1);
        }
      }
    });
  }, info_POPUP_OFFSET_TIME);

  if (isShowedInfoPopup) {
    clearTimeout(phoneInfoPopupTimeout);
  }
})(window, jQuery);


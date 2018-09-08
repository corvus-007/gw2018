window.util = (function () {
  'use strict';

  return {
    KEYCODE_ESC: 27,
    URL_FILTER_HANDLER: 'js/flats-mock.json',
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
  }
})();

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

window.genplan = (function () {
  'use strict';

  var genplan = document.querySelector('.genplan');

  if (!genplan) {
    return;
  }

  var genplanScroller = genplan.querySelector('.genplan__scroller');
  var genplanSVG = genplan.querySelector('.genplan__svg');

  function getViewPosition() {
    return (genplanScroller.scrollWidth - genplanScroller.clientWidth) / 2;
  }

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

  function unifiedId(pinId) {
    return pinId.replace(/\./g, '-');
  }

  function getPinElem(pinId) {
    return genplanSVG.querySelector('#pin-' + unifiedId(pinId));
  }

  function getTooltipElem(pinId) {
    return genplan.querySelector('[data-id=pin-' + unifiedId(pinId) + ']');
  }

  genplanSVG.addEventListener('mouseover', function (event) {
    var target = event.target;
    var house = target.closest("[data-houseid]");
    var genplanCoords = genplan.getBoundingClientRect();

    if (!house) {
      return;
    }

    var pinId = house.dataset.houseid;

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
    var tooltipTop = pinCoords.top + pinHeight / 2 - genplanCoords.top - tooltipHeight / 2;
    var tooltipCoords = null;

    if (tooltipTop <= 20) {
      tooltipTop = 20;
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
    var house = target.closest("[data-houseid]");

    if (!house) {
      return;
    }

    if (!prevTooltip) {
      return;
    }

    prevTooltip.classList.remove('genplan-tooltip--showed');
  });
})();

window.flatsResult = (function () {
  'use srict';

  var flatsResult = document.querySelector('.flats-result');

  if (!flatsResult) {
    return;
  }

  var table = flatsResult.querySelector('.flats-result__table');
  var tbody = flatsResult.querySelector('.flats-result__tbody');
  var templateRow = document.querySelector('#flats-result-row-template').content.querySelector('.flats-result__row');

  function displayResult(params) {
    var filtersData = params.data || '';
    var response = sendRequest(filtersData, onSuccess);

    response.done(onSuccess);

    tbody.addEventListener('click', tableClickHandler);
  }

  function onSuccess(data) {
    var fragment = document.createDocumentFragment();
    clearBody();

    data.forEach(function (attrs) {
      fragment.appendChild(renderRow(attrs));
    });

    tbody.appendChild(fragment);

    $(table).tablesorter();

    if (window.matchMedia('(min-width: 1024px)').matches) {
      $('[data-sticky-target]').stick_in_parent({
        offset_top: 110
      });
    }
  }

  function renderRow(attrs) {
    var row = templateRow.cloneNode(true);

    row.setAttribute('data-id', Math.random().toFixed(7).slice(2));
    row.setAttribute('data-room', Math.random().toFixed(7).slice(2));

    if (attrs.reserve) {
      row.classList.add('flats-result__row--reserve');
    }

    row.querySelector('.flats-result__cell--room span').textContent = attrs.room;
    row.querySelector('.flats-result__cell--type span').textContent = attrs.type;
    row.querySelector('.flats-result__cell--floor span').textContent = attrs.floor;
    row.querySelector('.flats-result__cell--area span').textContent = attrs.area;
    // row.querySelector('.flats-result__cell--price').textContent = attrs.price;

    return row;
  }

  function sendRequest(data, onSuccess, onError) {
    data = data || '';

    return $.ajax({
      type: "GET",
      url: window.util.URL_FILTER_HANDLER,
      data: data,
      dataType: "JSON"
    });
  }

  function tableClickHandler(evt) {
    var target = evt.target;
    var row = target.closest('.flats-result__row');
    var button = target.closest('.flats-result__to-request-flat');

    if (!row || button) {
      return;
    }

    var id = row.dataset.id;
    // window.open(location.origin + location.pathname + '/' + id);
    window.open(location.origin + '/flat-plan-page.html');
  }

  function clearBody() {
    tbody.innerHTML = '';
  }

  return {
    displayResult: displayResult,
    templateRow: templateRow,
    table: table,
    tbody: tbody,
    sendRequest: sendRequest,
    renderRow: renderRow,
    tableClickHandler: tableClickHandler,
    clearBody: clearBody
  };
})();

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


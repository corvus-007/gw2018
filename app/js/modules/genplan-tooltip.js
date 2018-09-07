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

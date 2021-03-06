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
      crossDomain: true,
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

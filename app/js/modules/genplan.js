window.genplan = (function () {
  'use strict';

  var genplan = document.querySelector('.genplan');

  if (!genplan) {
    return;
  }

  var genplanScroller = genplan.querySelector('.genplan__scroller');
  var genplanSVG = genplan.querySelector('.genplan__svg');
  var genplanTip = genplan.querySelector('.genplan__tip');

  const territoryPoints = genplan.querySelectorAll('#territory-points use');
  const genplanPopupPictures = genplan.querySelector('.genplan__popup-pictures');
  const genplanPopupPicturresItems = genplan.querySelectorAll('.genplan__popup-pictures-item');
  let currentPointID = '';

  genplanSVG.addEventListener('mouseover', function (evt) {
    const target = evt.target;
    const point = target.closest('#territory-points use');

    if (!point) {
      return;
    }

    genplanPopupPictures.classList.add('genplan__popup-pictures--active');

    currentPointID = point.id;

    [...genplanPopupPicturresItems].forEach((it, index) => {
      const isSameID = currentPointID === it.dataset.pointId;
      it.classList.toggle('genplan__popup-pictures-item--active', isSameID);
    });
  });

  genplanSVG.addEventListener('mouseout', function (evt) {
    const target = evt.target;
    const point = target.closest('#territory-points use');

    if (!point) {
      return;
    }

    genplanPopupPictures.classList.remove('genplan__popup-pictures--active');
    [...genplanPopupPicturresItems].forEach((it) => {
      it.classList.remove('genplan__popup-pictures-item--active');
    });

    currentPointID = '';
  });

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
  genplanTip.addEventListener('touchstart', function (event) {
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

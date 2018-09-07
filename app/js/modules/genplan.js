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

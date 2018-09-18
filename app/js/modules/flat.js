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
    var frame = flat.querySelector('.flat-plan__frame');
    var flatDetail = flat.querySelector('.flat-detail');

    function processingPlan(plan) {
      var planAdjuster = plan.querySelector('.flat-plan__adjuster');
      var planImage = plan.querySelector('.flat-plan__image');

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
    } else {
      $(frame).zoom();
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

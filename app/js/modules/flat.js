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
        var action = form.action;

        $.ajax({
          url: action,
          method: 'POST',
          data: formData,
          processData: false,
          contentType: false,
          dataType: 'json'
        })
          .done(function (data) {
            if (data.status === true) {
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

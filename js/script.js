document.addEventListener('DOMContentLoaded', function () {
  svg4everybody();

  $('input[type="tel"]').inputmask({
    "mask": "+7 (999) 999-99-99"
  });

  window.addEventListener('scroll', function () {
    var scrolled = window.pageYOffset || document.documentElement.scrollTop;
    if (scrolled > 0) {
      document.body.classList.add('is-main-header-sticky');
    } else {
      document.body.classList.remove('is-main-header-sticky');
    }
  });


  var constructionSlides = document.querySelector('.js-construction-slides');

  if (constructionSlides) {
    $(constructionSlides).flickity({
      draggable: true,
      cellAlign: 'left',
      imagesLoaded: true,
      prevNextButtons: false,
      pageDots: false,
      contain: true
    });
  }


  var commonPlansSlider = document.querySelector('.js-common-plans-slider');

  if (commonPlansSlider) {
    $(commonPlansSlider).flickity({
      adaptiveHeight: false,
      initialIndex: 1,
      wrapAround: true,
      imagesLoaded: true,
      prevNextButtons: false,
      contain: true,
      lazyLoad: 1
    });
  }


  var plansFlatSlider = document.querySelector('.js-plans-flat-slider');

  if (plansFlatSlider) {
    var $plansFlatSlider = $(plansFlatSlider).flickity({
      imagesLoaded: true,
      percentPosition: false,
      fullscreen: true,
      lazyLoad: true,
      prevNextButtons: false,
      pageDots: false
    });

    // Flickity instance
    var flkty = $plansFlatSlider.data('flickity');

    var flatSlidesCount = $(plansFlatSlider).find('.plans-flat-slider__item').length;
    var $planFlatsButtons = $('.plans-flat__nav-buttons');

    if (flatSlidesCount > 1) {
      for (var i = 0; i < flatSlidesCount; i++) {
        $('<button type="button">Планировка ' + (i + 1) + '</button>').appendTo($planFlatsButtons);
      }

      $planFlatsButtons.on('click', 'button', function (evt) {
        var index = $(this).index();
        $plansFlatSlider.flickity('select', index);
      });

      // update selected cellButtons
      $plansFlatSlider.on('select.flickity', function () {
        $planFlatsButtons.find('button').filter('.is-selected')
          .removeClass('is-selected');
        $planFlatsButtons.find('button').eq(flkty.selectedIndex)
          .addClass('is-selected');
      });
    }
  }


  if (document.querySelector('.flat-filters')) {
    var locationSearch = location.search;
    window.flatsResult.displayResult({
      filtersData: locationSearch
    });
    window.flatFilters.init();
  }
});

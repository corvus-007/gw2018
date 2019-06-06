document.addEventListener('DOMContentLoaded', function () {
  svg4everybody();

  $.fancybox.defaults.animationEffect = 'zoom-in-out';

  $('input[type="tel"]').inputmask({
    "mask": "+7 (999) 999-99-99"
  });

  jQuery.validator.addMethod('checkPhoneMask', function (value) {
    return /\+7\ \(\d{3}\)\ \d{3}\-\d{2}\-\d{2}/g.test(value);
  }, 'Заполните номер телефона');

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
      imagesLoaded: true,
      prevNextButtons: false,
      lazyLoad: 3
    });
  }

  // Promo slider
  var promoSlider = document.querySelector('[data-promo-slider]');

  if (promoSlider) {
    var countPromoSlides = $('.promo-slide__picture', promoSlider).length;
    var isHasPromoSliderControls = countPromoSlides > 1 ? true : false;

    $(promoSlider).flickity({
      setGallerySize: false,
      // adaptiveHeight: false,
      wrapAround: true,
      contain: true,
      // autoPlay: 3000,
      pauseAutoPlayOnHover: false,
      selectedAttraction: 0.018,
      prevNextButtons: isHasPromoSliderControls,
      pageDots: isHasPromoSliderControls,
      // lazyLoad: 1
    });
  }

  // Features2 slider
  // var features2Slider = document.querySelector('[data-features2-slider]');

  // if (features2Slider) {
  //   var $features2Slider = $(features2Slider).flickity({
  //     setGallerySize: false,
  //     prevNextButtons: false,
  //     pageDots: false,
  //     draggable: false,
  //     bgLazyLoad: 2
  //   });

  //   $('.features2-accordion').accordionjs({
  //     beforeOpenSection: function (item) {
  //       var index = item.index();
  //       $features2Slider.flickity('select', index, false, false);
  //     }
  //   });
  // }

  var menuItems = document.querySelectorAll('#menu-glavnoe-menyu .current-menu-item');

  if (menuItems) {
    menuItems.forEach(function (item) {
      var link = item.querySelector('a');
      var hrefAttr = link.getAttribute('href');
      if (/#/.test(hrefAttr)) {
        item.classList.remove('current-menu-item');
      }
    });
  }



  var flatFiltersElem = document.querySelector('.flat-filters');

  if (flatFiltersElem) {
    var locationSearch = location.search;

    window.flatsResult.displayResult({
      data: locationSearch
    });

    window.flatFilters.init();

    var selectSortElem = document.querySelector('[name="sort-by"]');

    selectSortElem.addEventListener('change', function (evt) {
      window.flatsResult.renderFilteredFlats(window.util.filteredFlats);
    });

    var selectTypeNodeList = document.querySelectorAll('[data-target="checkboxes-select"]');
    [...selectTypeNodeList].forEach((it) => {
      new checkboxesSelect(it);
    });
  }

  if (document.querySelector('.favorites-flats')) {
    window.flatsResult.displayResult({
      data: $.param({
        'favorites_cards[]': window.favoritesCards.getFavoritesFlatsAsArr()
      })
    });
  }

  $('.construction-cards__item').each(function (index, el) {
    var album = $(el).find('.construction-card__wraplink').data('fancybox-trigger');
    el.dataset.album = album;
  });

  $('.construction-filter-form').on('input', function (evt) {
    var target = evt.target;
    var selectElem = target.closest('[name="type"]');
    var selectType = selectElem.value;

    $('[data-house-id]').each(function (index, el) {
      var album = el.closest('[data-album]').dataset.album;

      var id = el.dataset.houseId;
      el.dataset.fancybox = album;

      if (id != selectType && selectType != 'all') {
        el.dataset.fancybox = '';
      }
    });

    $('.construction-cards__item').each(function (index, el) {
      if ($(el).find('[data-fancybox*="-"]').length) {
        $(el).show();
      } else {
        $(el).hide();
      }
    });
  });

  $('.common-tabs').tabslet({
    controls: {
      prev: '.to-prev-tab',
      next: '.to-next-tab'
    }
  });

  const notificationEl = document.querySelector('[data-notification]');

  if (notificationEl) {
    window.notification.init();
  }
});

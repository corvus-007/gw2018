document.addEventListener('DOMContentLoaded', function () {
  svg4everybody();

  $.fancybox.defaults.animationEffect = 'zoom-in-out';

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
  var features2Slider = document.querySelector('[data-features2-slider]');

  if (features2Slider) {
    var $features2Slider = $(features2Slider).flickity({
      setGallerySize: false,
      prevNextButtons: false,
      pageDots: false,
      draggable: false,
      bgLazyLoad: 2
    });

    $('.features2-accordion').accordionjs({
      beforeOpenSection: function (item) {
        var index = item.index();
        $features2Slider.flickity('select', index, false, false);
      }
    });
  }

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



  if (document.querySelector('.flat-filters')) {
    var locationSearch = location.search;
    window.flatsResult.displayResult({
      data: locationSearch
    });
    window.flatFilters.init();
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

  $('.common-tabs').tabslet();
});

document.addEventListener('DOMContentLoaded', function () {
  svg4everybody();

  var controller = new ScrollMagic.Controller();

  var tl = new TimelineMax();

  tl.staggerFrom('.features__item', 1.3, {
    opacity: 0,
    scale: 0.5,
    ease: Back.easeInOut.config(1.7),
  }, 0.15);

  new ScrollMagic.Scene({
      triggerElement: '.features',
      offset: 0,
      reverse: false
    })
    .setTween(tl)
    .addTo(controller);

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

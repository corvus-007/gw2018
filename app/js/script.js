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


  if (document.querySelector('.flat-filters')) {
    var locationSearch = location.search;
    window.flatsResult.displayResult({
      filtersData: locationSearch
    });
    window.flatFilters.init();
  }

  $('.common-tabs').tabslet();
});

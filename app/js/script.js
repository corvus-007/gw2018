document.addEventListener('DOMContentLoaded', function () {
  svg4everybody();

  var cleave = new Cleave('.closed-show-form input[type="tel"]', {
    phone: true,
    phoneRegionCode: 'RU'
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
      // freeScroll: true,
      imagesLoaded: true,
      prevNextButtons: false,
      pageDots: false,
      // lazyLoad: true,
      contain: true
    });
  }
});

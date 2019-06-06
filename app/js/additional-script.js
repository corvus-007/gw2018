$(function () {
  $('#menu-glavnoe-menyu-1 .menu-item').on('click', function () {
    $('.out-cover--opened').removeClass('out-cover--opened');
    $('body').removeClass('no-scroll');
    $('.main-header__toggle').removeClass('out-cover-toggle--fired');
    $('body').removeClass('is-out-cover-opened');
  });

  if ($().slick) {
    $('.slider__slides').slick({
      arrows: true,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      draggable: false,
      pauseOnHover: false,
      lazyLoad: 'ondemand',
      dots: false,
      speed: 150,
    });
  }

  $('.slider__button').click(function () {
    $('body').addClass('-popup');
    $('#getPricePopup').addClass('-visible');
  });

  $('.main-header__button').click(function () {
    $('body').addClass('-popup');
    $('#orderPopup').addClass('-visible');
  });

  $('.section-intro__to-more').click(function () {
    $('body').addClass('-popup');
    $('#aboutPopup').addClass('-visible');
  });

  $('.popupBlock__close').click(function () {
    $('body').removeClass('-popup');
    $('.popupBlock').removeClass('-visible');
  });

  $(document).keyup(function (e) {
    if (e.keyCode == 27) {
      $('body').removeClass('-popup');
      $('.popupBlock').removeClass('-visible');
    }
  });

  $('.popupBlock').on('click', function (e) {
    if (e.target == this) {
      $('body').removeClass('-popup');
      $('.popupBlock').removeClass('-visible');
    }
  });
});

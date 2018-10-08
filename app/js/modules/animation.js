window.animation = (function (window, $) {
  'use strict';

  var controller = new ScrollMagic.Controller();
  var isRunIntroTweens = localStorage.getItem('runTweens');

  window.addEventListener('load', function () {

    if (!isRunIntroTweens) {
      var tlIntro = new TimelineMax({
        onComplete: function () {
          localStorage.setItem('runTweens', true);
        }
      });

      tlIntro
        .from('.section-intro__picture', 1.2, {
          opacity: 0,
          marginLeft: -20,
        })
        .from('.section-intro__text-first-line', 0.4, {
          opacity: 0,
          y: -200,
        })
        .from('.section-intro__text-quantity', 0.4, {
          opacity: 0,
          x: -100,
        })
        .from('.section-intro__text-unit-holder', 0.4, {
          opacity: 0,
          y: 40,
        }, '-=0.1')
        .from('.section-intro__to-more', 0.8, {
          opacity: 0,
          y: 50,
          ease: Elastic.easeOut.config(1, 0.5)
        })
        .from('.intro-actions', 1, {
          opacity: 0,
          scale: 0.6,
          ease: Elastic.easeOut.config(1, 0.5)
        });
    }

  });

  var tl = new TimelineMax();
  tl.staggerFrom('.features__item', 0.8, {
    opacity: 0,
    scale: 0.5,
    ease: Back.easeInOut.config(1.7),
  }, 0.15);

  new ScrollMagic.Scene({
      triggerElement: '.features',
      offset: 80,
      reverse: false
    })
    .setTween(tl)
    .addTo(controller);

})(window, jQuery);

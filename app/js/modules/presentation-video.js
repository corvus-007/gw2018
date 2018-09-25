window.presentationVideo = (function (window, $) {
  var presentationVideo = document.querySelector('.presentation-video');

  if (!presentationVideo) {
    return false;
  }

  var videoControls = presentationVideo.querySelector('.presentation-video__controls');
  var videoEl = presentationVideo.querySelector('video');

  if (window.matchMedia('(pointer: coarse)').matches) {
    videoEl.controls = true;
  }

  videoEl.addEventListener('play', onVideoPLay);
  videoEl.addEventListener('pause', onVideoPause);

  function onVideoPLay() {
    presentationVideo.classList.add('presentation-video--playing');
  }

  function onVideoPause() {
    presentationVideo.classList.remove('presentation-video--playing');
  }

  videoControls.addEventListener('click', function (evt) {
    console.log('click');

    var target = evt.target;
    var actionButton = target.closest('[data-video-action]')
    if (!actionButton) {
      return;
    }

    var action = actionButton.dataset.videoAction;

    switch (action) {
      case 'play':
        videoEl.play();
        break;
      case 'pause':
        videoEl.pause();
        break;
    }
  });
})(window, jQuery);

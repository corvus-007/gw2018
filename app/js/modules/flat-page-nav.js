window.flatPageNav = (function (window, $) {
  'use strict';

  var flatPageNav = document.querySelector('[data-target="flat-page-navigation"]');

  if (!flatPageNav) {
    return;
  }

  var flatPageNavItemList = flatPageNav.querySelectorAll('[data-target="flat-page-nav-item"]');
  var flatPageNavContentList = document.querySelectorAll('[data-target="flat-page-nav-content"]');
  var currentItemIndex = 0;

  toggleActiveClassNavItem(flatPageNavItemList[currentItemIndex]);
  toggleActiveClassNavContent(flatPageNavContentList[currentItemIndex]);

  flatPageNav.addEventListener('click', handlerFlatPageNavClick);

  function toggleActiveClassNavItem(currentItem) {
    flatPageNavItemList.forEach(function (it) {
      it.classList.toggle('flat-page-navigation__item--active', currentItem === it);
    });
  }

  function toggleActiveClassNavContent(currentContent) {
    flatPageNavContentList.forEach(function (it) {
      it.classList.toggle('flat-page-nav-content--hidden', currentContent !== it);
    });
  }

  function handlerFlatPageNavClick(evt) {
    evt.preventDefault();

    var target = evt.target;
    var link = target.closest('[data-action="toggle-flat-page-content"]');

    if (!link) {
      return;
    }

    var item = link.parentElement;
    var targetId = link.hash;
    var target = document.querySelector(targetId);

    toggleActiveClassNavItem(item);
    toggleActiveClassNavContent(target);
  };
})(window, jQuery);

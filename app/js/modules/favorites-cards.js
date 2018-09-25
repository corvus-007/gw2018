window.favoritesCards = (function (window, $) {
  'use strict';

  var goToFavoritePageElem = document.querySelector('.go-to-favorite-page');

  function hasCards() {
    return getFavoritesFlatsAsArr().length ? true : false;
  }

  function getFavoritesFlatsAsArr() {
    var favoritesString = localStorage.getItem('favoritesFlatsIds');
    var favoritesArr = JSON.parse(favoritesString);

    return favoritesArr ? favoritesArr : [];
  }

  // function createLinkToFavoritesPage() {
  //   goToFavoritePageElem = document.createElement('div');
  //   goToFavoritePageElem.classList.add('go-to-favorite-page');
  //   goToFavoritePageElem.insertAdjacentHTML('afterbegin', `<a class="go-to-favorite-page__link" href="favorites-flats-page.html">
  //   <svg class="go-to-favorite-page__icon" width="16" height="16" viewBox="0 0 455 455">
  //     <path  d="M326.6 10.3c-38.7 0-75 17.6-99.1 47A128.4 128.4 0 0 0 0 138.7c0 55.4 33 119.5 98.2 190.6a946 946 0 0 0 120.3 108.6l9 6.8 9-6.8a946 946 0 0 0 120.3-108.6c65.1-71 98.2-135.2 98.2-190.6C455 68 397.4 10.3 326.6 10.3z"/>
  //   </svg>
  //   </a>`);

  //   return goToFavoritePageElem;
  // }

  function updateFavorites(flatId) {
    var favoritesArr = getFavoritesFlatsAsArr();

    if (!favoritesArr.includes(flatId)) {
      addToFavorites(flatId, favoritesArr);
    } else {
      removeFromFavorites(flatId, favoritesArr);
    }
  }

  function addToFavorites(flatId, favoritesArr) {
    favoritesArr.push(flatId);
    var str = JSON.stringify(favoritesArr);
    localStorage.setItem('favoritesFlatsIds', str);
  }

  function removeFromFavorites(flatId, favoritesArr) {
    var searchIndex = favoritesArr.indexOf(flatId);
    favoritesArr.splice(searchIndex, 1);
    var str = JSON.stringify(favoritesArr);
    localStorage.setItem('favoritesFlatsIds', str);
  }

  function showFavoritesToggler() {
    goToFavoritePageElem.classList.add('go-to-favorite-page--visible');
  }

  function hideFavoritesToggler() {
    goToFavoritePageElem.classList.remove('go-to-favorite-page--visible');
  }

  function createLinkToFavoritesPages() {
    if (hasCards()) {
      showFavoritesToggler()
    } else {
      hideFavoritesToggler();
    }
  }

  createLinkToFavoritesPages();

  return {
    getFavoritesFlatsAsArr: getFavoritesFlatsAsArr,
    updateFavorites: updateFavorites,
    createLinkToFavoritesPages: createLinkToFavoritesPages
  };
})(window, jQuery);

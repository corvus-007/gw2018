window.favoritesCards = (function (window, $) {
  'use strict';

  var goToFavoritePageElem = document.querySelector('.go-to-favorite-page');

  if (!goToFavoritePageElem) {
    return;
  }

  function hasCards() {
    return getFavoritesFlatsAsArr().length ? true : false;
  }

  function getFavoritesFlatsAsArr() {
    var favoritesString = localStorage.getItem('favoritesFlatsIds');
    var favoritesArr = JSON.parse(favoritesString);

    return favoritesArr ? favoritesArr : [];
  }

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

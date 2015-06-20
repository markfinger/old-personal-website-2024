define([
  'jquery',
  'events'
], function($, events) {

  var articleNav;
  var article;
  var headerImage

  var footerNav = function() {
    var footerNav = articleNav.clone();
    footerNav
      .removeClass('fixed')
      .addClass('footer');
    article.append(footerNav);
  };

  var scaleToViewport = function() {
    if (article.hasClass('introduction')) {
      $('.article-header').height(window.innerHeight * 0.7);
    } else {
      headerImage.height(window.innerHeight * 0.7);
    }
  };

  var init = function() {
    articleNav = $('.article-nav-container');

    article = $('.main-article');
    headerImage = article.find('.article-header .image');

    scaleToViewport();
    footerNav();

    events.trigger('layout:complete');
  };

  return {
    init: init
  };
});
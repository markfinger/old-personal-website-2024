define([
  'lodash',
  'events'
], function(_, events) {

  var articleNav;
  var article;
  var articleHeader;
  var headerImage;
  var navAbout;
  var navList;

  var footerNav = function() {
    var footerNav = articleNav.clone();
    footerNav
      .removeClass('fixed')
      .addClass('footer');
    article.append(footerNav);
  };

  var centerTheNav = function() {
    var marginLeft = (window.innerWidth - navAbout.outerWidth() - navList.outerWidth()) / 2;
    navAbout.css('margin-left', marginLeft);
  };

  var scaleToViewport = function() {
    var articleHeaderHeight = window.innerHeight * 0.8;
    if (articleHeaderHeight > articleHeader.height()) {
      if (window.innerHeight > 1000 && !article.hasClass('crop-visualisation') && !article.hasClass('ugandas-choice')) {
        articleHeader.height(articleHeaderHeight);
      }
    }
  };

//  var sizeUgandaPhoto = function() {
//    if (article.hasClass('ugandas-choice')) {
//      headerImage.height(headerImage.width() * 2/3)
//    }
//  };

  var init = function() {
    articleNav = $('.article-nav-container');
    navAbout = articleNav.find('.about-the-series');
    navList = articleNav.find('.nav');
    articleHeader = $('.article-header');

    article = $('.main-article');
    headerImage = articleHeader.find('.image');

//    sizeUgandaPhoto();
    centerTheNav();
    scaleToViewport();
    footerNav();

    // Take down the loading screen
    _.defer(function() {
      events.trigger('layout:complete');
    });
  };

  return {
    init: init
  };
});

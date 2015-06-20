define([
  'jquery',
  'scroll',
  'lodash'
], function($, scroll, _) {

  var navbar;
  var articleTitleContainer;
  var articleNav;
  var main;
  var header;

  var slideNavDown = function() {
    articleNav
      .addClass('visible')
      .css('top', navbar.outerHeight());
  };

  var slideNavUp = function() {
    var topOffset = -articleNav.outerHeight(true);
    articleNav
      .removeClass('visible')
      .css('top', topOffset);
  };

  var fadeInNavBarText = function() {
    articleTitleContainer
      .addClass('visible');
  };

  var setBindings = function() {
    articleTitleContainer.on('click', function() {
      if (articleNav.hasClass('visible')) {
        slideNavUp();
      } else {
        slideNavDown();
      }
      articleTitleContainer.toggleClass('child-nav-visible');
      main.one('click', function() {
        slideNavUp();
        articleTitleContainer.removeClass('child-nav-visible');
      });
    });

    scroll.observe(header, {
      exit: fadeInNavBarText,
      above: _.once(fadeInNavBarText)
    });

    $(window).on('resize', _.debounce(function() {
      if (!articleNav.hasClass('visible')) {
        slideNavUp();
      }
    }, 75));
  };

  var init = function() {
    navbar = $('.navbar');
    articleTitleContainer = $('.article-title-container');
    articleNav = $('.article-nav-container.fixed');
    main = $('#main');
    header = $('.header');
    setBindings();
    slideNavUp();
  };

  return {
    init: init
  };
});
define([
  'lodash',
  'jquery',
  'events',
  'config'
], function(_, $, events, config) {

  var navBar;
  var introContainer;
  var introImage;
  var introh1;
  var videoContainers;
  var chaptersContainer;
  var chapters;
  var chaptersButton;

  var scaleIntro = function() {
    // Window height minus the navbar
    var introHeight = window.innerHeight - navBar.outerHeight();

    introContainer.css({
      height: introHeight
    });

    var introh1Height = introh1.outerHeight();
    if (introh1Height < introHeight) {
      introh1.css({
        top: (introHeight - introh1.outerHeight()) / 3
      });
    }
  };

  var scaleVideoContainers = function() {
    videoContainers.each(function() {
      var element = $(this);
      var row = element.parent().find('.row');
      if (window.innerHeight <= row.outerHeight()) {
        row.addClass('no-border-radius');
      }
      element.css({
        height: Math.max(window.innerHeight, row.outerHeight()),
        width: window.innerWidth
      });
    });
  };

  var scaleChapterContainer = function() {
    // Expand the placeholder to prevent the pinning of the
    // chapters from changing the positioning of other elements
    chaptersContainer.css('height', chapters.outerHeight(true));
  };

  var positionChaptersInactive = function() {
    var chapterHeight = $('#chapter-navigation').find('li').height();
    chapters
      .css('top', -chapterHeight + 6);
  };

  var setChaptersInactive = function() {
    chapters
      .addClass('inactive')
      .removeClass('active');
    positionChaptersInactive();
  };

  var setChaptersActive = function() {
    chapters
      .removeClass('inactive')
      .addClass('active')
      .css('top', 0 + navBar.outerHeight());
  };

  var chapterButtonOnclick = function() {
    if (chapters.hasClass('fixed')) {
      if (chapters.hasClass('active')) {
        setChaptersInactive();
        window._gaq && _gaq.push(['_trackEvent', 'Click', 'Chapter Nav Toggle', 'Close']);
      } else {
        setChaptersActive();
        window._gaq && _gaq.push(['_trackEvent', 'Click', 'Chapter Nav Toggle', 'Open']);
      }
    }
  };

  var toggleChapterState = function() {
    chaptersContainer.toggleClass('pinned-child');
    var fixed = chaptersContainer.hasClass('pinned-child');
    if (fixed) {
      chapters.addClass('fixed');
      positionChaptersInactive();
    } else {
      chapters
        .removeClass('fixed active inactive');
    }
  };

  var scaleTimelapseContainer = function() {
    var largeTimelapse = $('.time-lapse-big');
    largeTimelapse.css('height', 'auto');
    _.defer(function() {
      var height = largeTimelapse.find('video').height();
      if (
        largeTimelapse.height() > height ||
        largeTimelapse.height() < height
      ) {
        largeTimelapse
          .css('height', height);
        // Cause all the layout stuff to rejig and recalculate
        events.trigger('layout:change');
      }
    });
  };

  var scaleDanielleInterview = function() {
    var element = $('#danielle-interview');
    var width = element.outerWidth();
    // Maintain the video's w/h ratio
    var height = width * (9/16);
    element.attr('height', height);
  };

  function scaleLayout() {
    scaleIntro();
    scaleVideoContainers();
    scaleChapterContainer();
    scaleTimelapseContainer();
    scaleDanielleInterview();
    if (chapters.hasClass('fixed')) {
      if (chapters.hasClass('active')) {
        setChaptersActive();
      } else {
        setChaptersInactive();
      }
    }
  }

  var setBindings = function() {
    // Set the size for objects
    events.on('init:end', function() {
      scaleLayout();
      events.trigger('layout:end');
    });

    $(window).on('resize', _.debounce(scaleLayout, 50));

    events.on('scroll:enter:chapters-container', function() {
      if (chapters.hasClass('fixed')) {
        toggleChapterState();
        chapters.css('top', 0);
      }
    });
    events.on('scroll:exit:chapters-container', toggleChapterState);

    events.on('scroll:exit:chapter2', _.once(scaleTimelapseContainer));

    chaptersButton.on('click', chapterButtonOnclick)
  };

  var init = function() {
    navBar = $('.navbar');
    introContainer = $('.article-header');
    introImage = introContainer.find('img');
    introh1 = introContainer.find('h1');
    videoContainers = $('.video-container');
    chaptersContainer = $('.chapters-container');
    chapters = chaptersContainer.find('.chapters');
    chaptersButton = chapters.find('.open');

    setBindings();
  };

  return {
    init: init
  };
});
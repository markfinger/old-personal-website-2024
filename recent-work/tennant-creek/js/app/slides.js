define([
  'jquery',
  'lodash',
  'settings',
  'scroll',
  'viewport',
  './media',
  'mediaUtils',
  'fc'
], function($, _, settings, scroll, viewport, media, mediaUtils, fc) {

  var slideContainers;
  var slides;
  var slidesText;
  var fixedHeaderHeight;
  var slideshowBackground;
  var scrollPrompt;

  var getSlideshowBackgroundColour = function(opacity) {
    return 'rgba(30, 30, 30, ' + opacity + ')';
  };

  var sizeSlideContainers = function() {
    var slideHeight = window.innerHeight - fixedHeaderHeight;
    slideContainers.each(function() {
      var container = $(this);
      var slides = container.find('.slide');
      var totalSlideHeight = 0;

      slides.each(function() {
        var slide = $(this);
        var height;
        var slideTextContainer = slide.find('.text-container');
        var slideText = slide.find('.text');
        var mediaContainer = slide.find('.media-container');
        var slideVideo = slide.find('video');
        var background = slide.find('.background');
        var backgroundHeight = slideHeight;

        if (!settings.canAutoplay && slideVideo.length) {
          slide.addClass('has-video');
          backgroundHeight = null;
          height = mediaContainer.outerHeight() + slideText.outerHeight();
          mediaContainer.after(slideTextContainer);
        } else if (settings.canAutoplay && slide.hasClass('opening-slide')) {
          // Buffer the first slide
          height = slideHeight * 1.5;
          slideText.css('top', slideHeight);
          scrollPrompt.css({
            'top': slideHeight - scrollPrompt.outerHeight()
          });
          // Need to bump the z-index due to the pause
          // before the text enters the viewport
          slide.find('.background').css('z-index', 1);
        } else {
          height = slideHeight;
          slide.find('.background').css('z-index', 0);
        }

        if (backgroundHeight) {
          background.height(backgroundHeight);
        }
        slide.height(height);
        totalSlideHeight += height + slide.css('margin-bottom');
      });

      container.height(totalSlideHeight);
    });
  };

  var addSlideBackgrounds = function() {
    // Add `.background` elements to slides without
    slides.not(':has(.background)').each(function() {
      $('<div class="background">')
        .appendTo(this);
    });
  };

  var bindSlideContainers = function() {
    slideContainers.each(function() {
      var slideContainer = $(this)
      var backgrounds = slideContainer.find('.background');
      var fixed = false;
      var backgroundTinted = false;
      var mediaAssets = slideContainer.find('video, audio');

      var fixBG = function() {
        fixed = true;
        backgrounds
          .addClass('fixed')
          .css('top', fixedHeaderHeight);
      };
      var unfixBG = function() {
        fixed = false;
        backgrounds
          .removeClass('fixed')
          .css('top', '');
      };

      scroll.on(this, {
        trackDelay: 10,
        enter: function() {
          _.each(mediaAssets, mediaUtils.load);
        },
        inside: function(obj) {
          var position = obj.position;
          var intersectsTopAndBottom = position.intersectsTop && position.intersectsBottom;

          if (intersectsTopAndBottom && !fixed) {
            fixBG();
          } else if (!intersectsTopAndBottom && position.viewportTop > 0 && fixed) {
            unfixBG();
          }

          // Enter slideshow transition
          if (position.intersectsMiddle) {
            backgroundTinted = true;
            // Enter transition complete
            if (intersectsTopAndBottom) {
              slideshowBackground.css({
                'background-color': getSlideshowBackgroundColour(1),
                'z-index': 1
              });
            // Enter transition in progress
            } else {
              var top = 0;
              var bottom;
              var elementPosition;
              var percentage;
              if (position.intersectsTop) {
                bottom = (position.viewportBottom - position.viewportMiddle) * 0.75;
                elementPosition = position.elementBottom - position.viewportMiddle;
              } else if (position.intersectsBottom) {
                bottom = (position.viewportMiddle - position.viewportTop) * 0.75;
                elementPosition = position.viewportMiddle - position.elementTop;
              }
              percentage = elementPosition / (bottom - top);
              slideshowBackground.css({
                'background-color': getSlideshowBackgroundColour(percentage),
                'z-index': 1
              });
            }
          // Exit slideshow transition
          } else {
            backgroundTinted = false;
            slideshowBackground.css({
              'background-color': getSlideshowBackgroundColour(0),
              'z-index': -1
            });
          }

        },
        outside: function() {
          if (fixed) {
            // unfix everything, just in case
            unfixBG();
          }
          if (backgroundTinted) {
            backgroundTinted = false;
            slideshowBackground.css({
              'background-color': getSlideshowBackgroundColour(0),
              'z-index': '-1'
            });
          }
        },
        exit: function() {
          mediaAssets.each(function() {
            this.pause()
          });
        }
      });
    });
  };

  var bindSlideText = function() {
    slidesText.each(function() {
      var slideText = $(this);
      var slide = slides.has(slideText);
      var nextSlide = slide.next();
      var slideContainer = slideContainers.has(slide);
      var background = slide.find('.background');
      var otherBackgrounds = slideContainer.find('.background').not(background);
      var nextBackground = nextSlide.find('.background');
      var video = background.find('video').get(0);
      var nextVideo = nextBackground.find('video').get(0);
      var hasPlayed = false;

      scroll.on(this, {
        intersectsTop: function(obj) {
          if (nextSlide.length) {
            var position = obj.position;
            var top = position.elementTop;
            var bottom = position.elementBottom;
            var viewportPosition = position.viewportTop - top;
            var percentage = viewportPosition / (bottom - top);
            background.css('opacity', 1 - percentage);
            nextBackground.css('opacity', percentage);
            if (percentage >= 0.8 && nextVideo && nextVideo.paused) {
              media.playMedia(nextVideo);
            }
          }
        },
        contained: function() {
          if (video && !hasPlayed) {
            var videoPosition = viewport.getPositionOf(video);
            if (videoPosition.intersectsMiddle) {
              media.playMedia(video);
              hasPlayed = true;
            }
          }
          background.css('opacity', 1);
          otherBackgrounds.each(function() {
            var otherBackground = $(this);
            otherBackground.css('opacity', 0);
            var otherVideo = otherBackground.find('video').get(0);
            if (otherVideo) {
              media.pauseMedia(otherVideo);
            }
          });
        },
        exit: function() {
          hasPlayed = false;
          if (video) {
            media.fadeOutMedia(video);
          }
        }
      });
    });
  };

  var signalLoadOfHeaderImage = function() {
    var bgImage = $('.background').first().css('background-image');
    var src = bgImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
    var image = $('<img src="' + src + '">');
    image.load(function() {
      fc.trigger('header-image:ready');
    });
  };

  var setBindings = function() {
    if (settings.canAutoplay) {
      bindSlideContainers();
      bindSlideText();
    }

    $(window).on('resize', _.debounce(sizeSlideContainers, 100));

    signalLoadOfHeaderImage();
  };

  var init = function() {
    slideContainers = $('.slide-container');
    slides = slideContainers.find('.slide');
    slidesText = slides.find('.text');
    slideshowBackground = $('.slideshow-background');
    scrollPrompt = $('.scroll-prompt');

    fixedHeaderHeight = $('.navbar').outerHeight();

    addSlideBackgrounds();
    sizeSlideContainers();
    setBindings();
  };

  return {
    init: init
  };
});
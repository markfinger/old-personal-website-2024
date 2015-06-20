define([
  'jquery',
  'lodash',
  'scroll',
  'fc',
  'viewport',
  'settings',
  'mediaUtils'
], function($, _, scroll, fc, viewport, settings, mediaUtils) {

  var mediaAssets;
  var autoplayMedia;
  var mediaContainers;
  var parallaxBackgrounds;

  var updateMediaSources = function() {
    // Rename `data-src` attributes to `src`.
    // `data-src` is used to prevent the browser from caching
    // excessive amounts of media assets
    $('source[data-src]').each(function() {
      var source = $(this);
      source
        .attr('src', source.data('src'))
        .removeAttr('data-src');
    });
  };

  var loadNextPrevMediaAssets = function(element) {
    if (element.jquery) {
      element = element.get(0);
    }

    var mediaAssetIndex;
    mediaAssets.each(function(index) {
      if (element === this) {
        mediaAssetIndex = index;
      }
    });

    if (mediaAssetIndex) {
      var nextMediaAsset = mediaAssets.get(mediaAssetIndex + 1);
      if (nextMediaAsset) {
        mediaUtils.load(nextMediaAsset);
      }
      var prevMediaAsset = mediaAssets.get(mediaAssetIndex - 1);
      if (prevMediaAsset) {
        mediaUtils.load(prevMediaAsset);
      }
    }
  };

  var playMedia = function(element) {

    // Pause any other playing media
    var media = $(element);
    if (media.is('audio')) {
      mediaAssets.filter('audio').each(function() {
        if (!this.paused) {
          this.pause();
        }
      });
    }

    mediaUtils.play(element, function(element) {
      if (viewport.getPositionOf(element).inside) {
        mediaUtils.play(element);
      }
    });

    loadNextPrevMediaAssets(element);

    var container = mediaContainers.has(element);
    if (element.paused !== true) {
      container.addClass('playing');
    }
    if (!container.hasClass('played')) {
      container.addClass('played');
    }
  };

  var pauseMedia = function(element) {
    element.pause();
    mediaContainers.has(element).removeClass('playing');
  };

  var fadeOutMedia = function(element, callback) {
    mediaUtils.fadeOut(element, {
      callback: callback
    });
    mediaContainers.has(element).removeClass('playing');
  };

  var initProgressBar = function(element, progressBar) {
    var durationData = $(element).data('duration');
    durationData = durationData.split(':');
    var minutes = parseInt(durationData[0]);
    var seconds = parseInt(durationData[1]);
    var duration = (minutes * 60) + seconds;
    var hasFinished = false;

    var progress = progressBar.find('.progress');

    var progressUpdater = function() {
      if (element.duration > duration) {
        duration = element.duration;
      }
      var percentage = (element.currentTime / duration) * 100;
      if (hasFinished || percentage > 100) {
        percentage = 100;
      }
      progress.css('width', percentage + '%');
      if (!element.paused) {
        setTimeout(progressUpdater, 50);
      }
    };

    progressUpdater();

    $(element).on('ended', function() {
      // Ensure that the progress bar hits 100% on completion of the media
      hasFinished = true;
    });
  };

  var bindMedia = function() {
    _.each(mediaContainers, function(element) {
      var container = $(element);
      var media = container.find('video, audio').get(0);
      var controls = container.find('.controls');
      var progressBar = container.find('.progress-bar');
      var hasPlayed = false;
      var isAutoplay = container.hasClass('autoplay-when-visible');

      if (isAutoplay && settings.canAutoplay) {
        scroll.on(container, {
          intersectsMiddle: function() {
            if (media.paused && !hasPlayed) {
              playMedia(media);
              hasPlayed = true;
            }
          },
          exit: function() {
            if (!media.paused && mediaUtils.isLoaded(media)) {
              // Reset the position to the start
              fadeOutMedia(media, function() {
                media.currentTime = 0;
              });
            }
            hasPlayed = false;
          }
        });
      }

      controls.on('click', function() {
        if (media.paused) {
          playMedia(media);
          hasPlayed = true;
        } else {
          pauseMedia(media);
        }
      });

      $(media).on('playing', function() {
        initProgressBar(media, progressBar);
      });

      $(media).on('ended', function() {
        container.removeClass('playing');
        var $media = $(this);
        if ($media.data('on-ended') === 'poster') {
          // Revert the media back to the poster once it has ended
          $media.height($media.outerHeight());
          requestAnimationFrame(function() {
            media.load();
          });
        }
      });
    });
  };

  var addMediaControls = function(containers) {
    _.each(containers, function(element) {
      var container = $(element);
      var playIcon = 'icon-play';
      if (container.find('audio').length) {
        playIcon = 'icon-volume-up';
      }
      $(
        '<div class="controls">' +
          '<i class="play icon ' + playIcon + '"></i>' +
          '<i class="stop icon icon-pause"></i>' +
        '</div>' +
        '<div class="progress-bar">' +
          '<div class="progress"></div>' +
        '</div>'
      ).appendTo(container);
    });
  };

  var delegateToNativeMediaControls = function() {
    mediaAssets
      .attr('controls', true);
  };

  var loadVideos = function() {
    mediaAssets.each(function() {
      this.load();
    });
  };

  var videoDimensionsFix = function() {
    var videoRatio = 410 / 960;
    mediaAssets.filter('video').each(function() {
      var video = $(this);
      video.css('min-height', viewport.getWidth() * videoRatio);
    });
  };

  var bindMediaLoadingComplete = function() {
    mediaAssets.each(function() {
      var media = $(this);
      media.on('canplaythrough', scroll.updateElements)
    });
  };

  var setBindings = function() {
    bindMedia();
  };

  var init = function() {
    mediaAssets = $('video, audio');
    autoplayMedia = $('.autoplay-when-visible');
    mediaContainers = $('.media-container').add(autoplayMedia);
    parallaxBackgrounds = $('.text-over-bg-image');

    bindMediaLoadingComplete();

    if (settings.lessThanEqualToIE9) {
      $('body').addClass('no-autoplay');
    } else {
      updateMediaSources();
      loadVideos();

      if (settings.canAutoplay) {
        addMediaControls(mediaContainers);
      }

      if (!settings.canAutoplay) {
        $('body').addClass('no-autoplay');
        delegateToNativeMediaControls();
        videoDimensionsFix();
      }
    }

    setBindings();

    fc.trigger('media:ready');
  };

  return {
    init: init,
    playMedia: playMedia,
    pauseMedia: pauseMedia,
    fadeOutMedia: fadeOutMedia
  };
});
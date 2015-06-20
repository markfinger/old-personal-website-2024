define([
  'jquery',
  'lodash',
  'config',
  'events',
  'easing',
  'scrollTo'
], function($, _, config, events) {

  var chapters;
  var chapterButtonText;
  var buttonText = 'Chapter {0} of 6';

  // Add click handler to chapter nav to scroll to chapter start
  var setClickHandlers = function() {
    chapters.find('a:not(.external-link)').on('click', function(e){
      e.preventDefault();
      var element = $(this);
      var options = {
        duration: 2000,
        easing: 'easeInOutCubic'
      };
      $.scrollTo(element.attr('href'), options);
      if (chapters.hasClass('fixed')) {
        chapters
          .addClass('inactive')
          .removeClass('active');
      }
      window._gaq && _gaq.push(['_trackEvent', 'Click', 'ID', element.attr('id')]);
    });
  };

  // Add scroll handlers to update the chapter numbers and active nav chapter
  var setScrollHandlers = function() {
    var currentChapter;
    var $chapters = {};

    function scrollEnter(chapter){
      return function(){
        if (currentChapter) currentChapter.removeClass('active');
        currentChapter = $chapters[chapter];
        currentChapter.addClass('active');
        chapterButtonText.text(buttonText.replace('{0}', chapter.replace(/chapter/, '')));
      };
    }

    _.each($('#chapter-navigation').find('li[data-link]'), function(nav){
      var chapter = $(nav).data('link');
      $chapters[chapter] = $(nav);
      events.on('scroll:enter:' + chapter, scrollEnter(chapter));
    });
  };

  var init = function() {
    chapters = $('.chapters');
    chapterButtonText = chapters.find('button .current-chapter');
    setClickHandlers();
    setScrollHandlers();
  };

  return {
    init: init
  };
});

define([
  'jquery',
  'events'
], function($, events) {

  var tgm = window.tgm || {};
  var JSONPadding = '?callback=define';

  var articleTitle;
  var header;
  var byline;
  var content;

  var injectJSONData = function(json) {
    // Populate the content
    articleTitle.html(json.heading);
    header.html(json.heading);
    byline.html(json.subheading);
    content.html(json.text);

    events.trigger('content:complete');
  };

  var init = function() {
    articleTitle = $('.article-title');
    header = $('.header');
    byline = $('.byline');
    content = $('.content');

    if (tgm.articleSource) {
      require([tgm.articleSource + JSONPadding], injectJSONData);
    }
  };

  return {
    init: init
  };
});
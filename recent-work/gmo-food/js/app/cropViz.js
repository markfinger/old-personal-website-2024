define([
  'd3',
  './cropData',
  'jquery',
  'lodash'
], function(d3, cropData, $, _) {

    var body;
    var article;
    var outerContainer;
    var innerContainer;
    var cropViz;
    var chartContainers;
    var nextButton;
    var prevButton;
    var key;

    var margin = {t: 40, r: 20, b: 65, l: 40},
        w = 300 - margin.l - margin.r,
        h = Math.max(520, Math.min(window.innerHeight, 1050) - 260),
        h2 = h / 4,
        stackHeight = h2 / 2 - margin.t,
        formatYear = d3.time.format('%Y').parse,
        formatPercent = d3.format('%'),
        stackColors = ["#848A5C", "#537D53", "#AD8E5F", "#AD9F7D", "#9C944C", "#8EA394", "#ADA6A6", "#ae626a", "#c3c3c2", "#c57640"],
        stackColorScale = d3.scale.ordinal().range(stackColors);

    // settings for all scales and axes
    var xAxis = d3.svg.axis().orient('bottom').ticks(6).tickSize(4, 0, 0),
        yAxis = d3.svg.axis().orient('left').ticks(6).tickSize(4, 0, 0),
        histX = d3.scale.ordinal().rangeRoundBands([0, w], 0.05),
        histY = d3.scale.linear().range([h2, 0]).domain([0, 100]),
        stackX = d3.scale.linear().rangeRound([0, w]).domain([0, 1]),
        lineX = d3.time.scale().rangeRound([0, w]),
        lineY = d3.scale.linear().range([h2, 0]).domain([0, 500]);

    var line = d3.svg.line()
      .interpolate('linear')
      .x(function (d) { return lineX(d.year); })
      .y(function (d) { return lineY(d.count); });

    // interactivity
    var barInteraction = {
      mouseOn: function (name) {

        var className = cleanClass(name),
            barGroup = d3.selectAll('g.' + className);

        barGroup.select('.histBar').classed('histBarHover', true);
        barGroup.select('.histBarLabel').classed('histBarLabelHover', true);
      },
      mouseOff: function () {
        d3.selectAll('.histBar').classed('histBarHover', false);
        d3.selectAll('.histBarLabel').classed('histBarLabelHover', false);
      }
    };

    var lineInteraction = {
      mouseOn: function (year) {
        var className = 'year' + year.getFullYear(),
            lineGroup = d3.selectAll('g.' + className);

        lineGroup.select('.linePoint').classed('linePointHover', true);
        lineGroup.select('.linePointLabel').classed('linePointLabelHover', true);
      },
      mouseOff: function () {
        d3.selectAll('.linePoint').classed('linePointHover', false);
        d3.selectAll('.linePointLabel').classed('linePointLabelHover', false);
      }
    };

    var stackBarInteraction = {
      mouseOn: function (name) {
        d3.selectAll('.stackBarHover').classed('stackBarHover', false);
        d3.selectAll('.stackBarLabelHover').classed('stackBarLabelHover', false);
        d3.selectAll('.stackBarLineHover').classed('stackBarLineHover', false);

        var className = cleanClass(name),
            stackBarGroup = d3.selectAll('g.' + className);

        stackBarGroup.select('.stackBar').classed('stackBarHover', true);
        stackBarGroup.select('.stackBarLabel').classed('stackBarLabelHover', true);
        stackBarGroup.select('.stackBarLine').classed('stackBarLineHover', true);
      }
    };

    // make consistent class names for interactivity
    function cleanClass(s) {
      return s.replace(/[\s\(\)\.\-\,]+/g, '').toLowerCase();
    }

    // func to create an instance of charts for given crop dataset
    function makeSmallMults(data) {

      var chartContainer = d3.select('#cropViz').append('div')
        .attr('class', 'chartContainer crop-' + cleanClass(data.commonName))
        .style('width', (w + margin.l + margin.r) + 'px')
        .html('<h4>' + data.commonName + '</h4>')

      chartContainer.append('p')
        .attr('class', 'crop-blurb')
        .html(data.blurb);

      var svg = chartContainer.append('svg')
        .attr('width', w + margin.l + margin.r)
        .attr('height', h - 50)
      .append('g')
        .attr('class', 'wrapperGroup')
        .attr('transform', 'translate('+ margin.l + ',10)');

      // add group/axes for each chart
      // country histogram
      var histGroup = svg.append('g').attr('class', 'histGroup'),
          histXsvg = histGroup.append('g').attr('class', 'hist x axis').attr('transform', 'translate(0,' + h2 + ')'),
          histYsvg = histGroup.append('g').attr('class', 'hist y axis');

      // developer proportional sideways thing
      var stackGroup = svg.append('g').attr('class', 'stackGroup').attr('transform', 'translate(0,' + (h2 + margin.b + stackHeight) + ')'),
          stackXsvg = stackGroup.append('g').attr('class', 'stack x axis');

      // cumulative approvals
      var lineGroup = svg.append('g').attr('class', 'lineGroup').attr('transform', 'translate(0,' + (h2 + margin.b + stackHeight*4) + ')'),
          lineXsvg = lineGroup.append('g').attr('class', 'line x axis').attr('transform', 'translate(0,' + h2 + ')'),
          lineYsvg = lineGroup.append('g').attr('class', 'line y axis');

      // country histogram
      xAxis.scale(histX); yAxis.scale(histY);

      var sortByCountry = data['countries'].sort(function (a, b ) { return a.count - b.count; }),
          histData = sortByCountry.slice(-15, sortByCountry.length);

      histX.domain(histData.map(function (d) { return d.name; }));

      histXsvg.call(xAxis).selectAll('text')
        .style('text-anchor', 'end')
        .attr('dx', '-.8em')
        .attr('dy', '.15em')
        .attr('transform', function (d) {
            return 'rotate(-60)'
        });

      histYsvg.call(yAxis);

      histGroup.select('.x.axis').selectAll('text')
        .attr('class', function (d) { return cleanClass(d); })
        .on('mouseover', function (d) { barInteraction.mouseOn(d); })
        .on('mouseout', function (d) { return barInteraction.mouseOff(); });

      var histBarGroup = histGroup.selectAll('.histBarGroup')
        .data(histData)
      .enter().append('g')
        .attr('class', function (d) { return 'histBarGroup ' + cleanClass(d.name); })
        .on('mouseover', function (d) { return barInteraction.mouseOn(d.name); })
        .on('mouseout', function (d) { return barInteraction.mouseOff(); })

      // actual bars
      histBarGroup.append('rect')
        .attr({
          class: 'histBar',
          x: function (d) { return histX(d.name); },
          y: function (d) { return histY(d.count); },
          width: histX.rangeBand(),
          height: function (d) { return h2 - histY(d.count); }
        })

      // invisible bars to expand mouseover hit area
      histBarGroup.append('rect')
        .attr({
          class: 'histBarInvis',
          x: function (d) { return histX(d.name); },
          y: h2 / 4 * 3,
          width: histX.rangeBand(),
          height: h2 / 4
        })

      histBarGroup.append('text')
        .attr({
          class: 'histBarLabel',
          x: function (d) { return histX(d.name) + histX.rangeBand() / 2; },
          y: function (d) { return histY(d.count); },
          dy: '-0.15em'
        })
        .text(function (d) { return d.count; });

      // developer proportions, sideways stack

      // restructure data as percentages
      var stackData = data['developers'].sort(function (a, b) { return b.count - a.count; });

      var x0 = 0;
      stackData.devProportion = stackData.map(function (d) { return {name: d.name, x0: x0, x1: x0 += d.count }; })
      stackData.devProportion.forEach(function (d) { d.x0 /= x0; d.x1 /= x0; });

      var stackBarGroup = stackGroup.selectAll('.stackBarGroup')
        .data(stackData.devProportion)
      .enter().append('g')
        .attr('class', function (d) { return 'stackBarGroup ' + cleanClass(d.name); });

      stackBarGroup.append('rect')
        .attr({
            class: 'stackBar',
            x: function (d) { return stackX(d.x0); },
            y: 1,
            width: function(d) { return stackX(d.x1) - stackX(d.x0); },
            height: stackHeight,
            fill: function (d) { return stackColorScale(d.name); }
          })
        .style('pointer-events', function (d) { return (d.x1 - d.x0 > 0.01) ? 'all' : 'none' ;})
        .style('display', function (d) { return (d.x1 - d.x0 > 0.01) ? 'inline' : 'none' ;})
        .on('mouseover', function (d) { return stackBarInteraction.mouseOn(d.name); });

      stackBarGroup.append('text')
        .attr({
          class: 'stackBarLabel',
          x: w / 2,
          y: stackHeight + 25
        })
        .text(function (d) { return d.name + ': ' + (d.x1 - d.x0 > 0.01 ? formatPercent(d.x1 - d.x0) : '< 1%'); })

      // add lines pointing labels to stacks; stairstep for long ones, straight lines for short
      stackBarGroup.each(function () {
        var g = d3.select(this),
            elData = g[0][0].__data__;

        var dist = Math.abs((stackX(elData.x0) + (stackX(elData.x1) - stackX(elData.x0)) / 2) - (w / 2));
        if (dist > 15) {
          g.append('path')
            .attr({
              class: 'stackBarLine',
              d: function (d) { return 'M ' + w/2 + ' ' + (stackHeight + 14) + 'V ' + (stackHeight + 8) + 'H ' + (stackX(d.x0) + (stackX(d.x1) - stackX(d.x0)) / 2) + 'V ' + stackHeight; }
            });
        } else {
          g.append('line')
            .attr({
              class: 'stackBarLine',
              x1: function (d) { return stackX(d.x0) + (stackX(d.x1) - stackX(d.x0)) / 2; },
              y1: stackHeight,
              x2: w / 2,
              y2: stackHeight + 14
            });
        };
      });

      // cumulative total approvals

      // add stuff up by year
      var count = 0;
      data.cumLine = data['year_total'].map(function (d) { return { year: d.name, count: count += d.count }; });
      data.cumLine.forEach(function (d) { d.year = formatYear(d.year); });

      lineX.domain(d3.extent(data.cumLine, function (d) { return d.year; }));
      xAxis.scale(lineX); yAxis.scale(lineY);
      lineXsvg.call(xAxis); lineYsvg.call(yAxis);

      var cumLine = lineGroup.append('g').attr('class', 'cumLine');

      cumLine.append('path').attr({
        class: 'linePath',
        d: line(data.cumLine)
      });

      linePointGroup = cumLine.selectAll('.linePointGroup')
        .data(data.cumLine)
      .enter().append('g')
        .attr('class', function (d) { return 'linePointGroup year' + d.year.getFullYear(); })

      // invisible rect for mouseovers
      linePointGroup.append('rect').attr({
          class: 'linePointInvis',
          x: function (d) { return lineX(d.year) - (w / 12 / 2); },
          y: 0,
          height: h2,
          width: w / 12
        })
        .on('mouseover', function (d) { return lineInteraction.mouseOn(d.year); })
        .on('mouseout', function (d) { return lineInteraction.mouseOff(); });

      linePointGroup.append('circle')
        .attr({
          class: 'linePoint',
          cx: function (d) { return lineX(d.year); },
          cy: function (d) { return lineY(d.count); },
          r: 5
        });

      linePointGroup.append('text')
        .attr({
          class: 'linePointLabel',
          x: function (d) { return lineX(d.year) - 10; },
          y: function (d) { return lineY(d.count) - 10; }
        })
        .text(function (d) { return d.count; });
    }

  var limitCropVizWidth = function() {
    var width = _.reduce(chartContainers, function(sum, element, index) {
      if (index === 1) {
        sum = $(sum).outerWidth(true);
      }
      return sum + $(element).outerWidth(true);
    });
    cropViz.css('width', width);
  };

  var sizeChartKeyElements = function() {
    var name = key.find('.crop-viz-key-name');
    var country = key.find('.country');
    var manufacturer = key.find('.manufacturer');
    var year = key.find('.year');
    var chart = chartContainers.first();

    var offsetFromTop = chart.offset().top;

    var cropNameHeight = chart.find('h4').outerHeight(true);
    name.css('margin-bottom', cropNameHeight - name.outerHeight());
    offsetFromTop += cropNameHeight;

    var hist = chart.find('.histGroup');
    var histHeight = hist[0].getBBox().height;
    var histOffset = hist.offset().top - offsetFromTop;
    country.css({
      height: histHeight,
      paddingTop: histOffset
    });
    offsetFromTop += histHeight + histOffset;

    var stack = chart.find('.stackGroup');
    var stackHeight = stack[0].getBBox().height;
    var stackOffset = stack.offset().top - offsetFromTop;
    manufacturer.css({
      height: stackHeight,
      paddingTop: stackOffset
    });
    offsetFromTop += stackHeight + stackOffset;

    var line = chart.find('.lineGroup');
    var lineHeight = line[0].getBBox().height;
    var lineOffset = line.offset().top - offsetFromTop;
    year.css({
      height: lineHeight,
      paddingTop: lineOffset
    });
  };

  var _getCropEdges = function() {
    return _.map(chartContainers, function(element) {
      element = $(element);
      var leftEdge = element.offset().left;
      return {
        leftEdge: leftEdge,
        rightEdge: leftEdge + element.outerWidth(),
        element: element
      };
    });
  };

  var partiallyVisibleCrop = function(offsetFromLeft) {
    offsetFromLeft = offsetFromLeft || 0;
    var cropEdges = _getCropEdges();
    var innerContainerEdge = innerContainer.offset().left + offsetFromLeft;
    var partiallyVisibleCrop = _.filter(cropEdges, function(edges) {
      return (
        edges.leftEdge < innerContainerEdge &&
        edges.rightEdge > innerContainerEdge
      );
    });
    if (partiallyVisibleCrop.length) { // Found a partially visible crop
      return partiallyVisibleCrop[0];
    } else { // Find the closest one
      if (offsetFromLeft) { // User hit the next button
        return _(cropEdges).filter(function(edges) {
          return edges.leftEdge < innerContainerEdge;
        }).last();
      } else { // User hit the prev button
        return _(cropEdges).filter(function(edges) {
          return edges.rightEdge > innerContainerEdge;
        }).first();
      }
    }
  };

  var innerContainerCanScrollLeft = function() {
    return innerContainer.scrollLeft() > 0;
  };

  var innerContainerCanScrollRight = function() {
    return innerContainer.scrollLeft() + innerContainer.width() < innerContainer[0].scrollWidth;
  };

  var innerContainerOnScroll = function() {
    if (innerContainerCanScrollLeft()) {
      outerContainer.addClass('can-scroll-left');
    } else {
      outerContainer.removeClass('can-scroll-left');
    }
    if (innerContainerCanScrollRight()) {
      outerContainer.addClass('can-scroll-right');
    } else {
      outerContainer.removeClass('can-scroll-right');
    }
  };

  var prevCrops = function() {
    innerContainerOnScroll();
    if (!innerContainerCanScrollLeft()) {
      return;
    }
    lastVisibleCrop = partiallyVisibleCrop();
    var scrollTo = (innerContainer.width() + innerContainer.offset().left) - (lastVisibleCrop.element.width() + lastVisibleCrop.element.offset().left);
    innerContainer.animate({
      scrollLeft: '-=' + scrollTo
    }, 500);
  };

  var nextCrops = function() {
    innerContainerOnScroll();
    if (!innerContainerCanScrollRight()) {
      return;
    }
    lastVisibleCrop = partiallyVisibleCrop(innerContainer.width());
    var scrollTo = lastVisibleCrop.element.offset().left - innerContainer.offset().left;
    innerContainer.animate({
      scrollLeft: '+=' + scrollTo
    }, 500);
  };

  var scaleBodyToFitVis = function() {
    // Ensure that the body is always sized to fit the first 2 crops completely
    var thirdCrop = $(chartContainers.get(2));
    body.css('min-width', thirdCrop.offset().left + (thirdCrop.width() * 0.25));
  };

  var initialStack = function () {
    var monsanto = d3.selectAll('.stackBarGroup.monsanto');
    monsanto.select('.stackBar').classed('stackBarHover', true);
    monsanto.select('.stackBarLabel').classed('stackBarLabelHover', true);
    monsanto.select('.stackBarLine').classed('stackBarLineHover', true);
  };

  var onResize = function() {
    sizeChartKeyElements();
  };

  var setBindings = function() {
    prevButton.on('click', prevCrops);
    nextButton.on('click', nextCrops);
    innerContainer.on('scroll', innerContainerOnScroll);
    $(window).on('resize', _.debounce(onResize, 75));
    $(document).keydown(function(e){
      if (e.keyCode === 37) {
        prevCrops();
      } else if (e.keyCode === 39) {
        nextCrops();
      }
    });
  };

  var init = function () {
    body = $('body');
    if (body.hasClass('crop-visualisation')) {
      article = $('.main-article.crop-visualisation');
      outerContainer = $('.crop-viz-outer-container');
      innerContainer = $('.crop-viz-inner-container');
      cropViz = $('#cropViz');
      nextButton = article.find('.next');
      prevButton = article.find('.prev');
      key = $('.crop-viz-key');

      // order by total approvals and draw charts for each crop
      cropData.sort(function (a, b) { return b.total - a.total; });

      for (var i = 0; i <= cropData.length - 1; i++) {
        makeSmallMults(cropData[i])
      }
      initialStack();

      chartContainers = cropViz.find('.chartContainer');

      cropViz.append('<div class="clear">');

      limitCropVizWidth();

      sizeChartKeyElements();

      setBindings();

      innerContainerOnScroll();

      scaleBodyToFitVis();
    }
  };

  return {
    init: init
  };
});
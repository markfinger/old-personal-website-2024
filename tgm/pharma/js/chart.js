(function($, d3) {
  'use strict';

  window.BarChart = function BarChart(options){

    var _this = this;

    this.data = options.data;
    this.id = options.id;
    this.label = options.label;
    this.metric = options.metric;
    this.keepScale = options.keepScale;
    this.buttonIndex = 0;

    var defaultOptions = {
      "yAxisLabel": null,
      "yAxisLabels": null,
      // Cause y axis scales to be contracted, eg: 1000 becomes 1k
      "contractYAxisScales": true,
      "barInfoBoxPadding": 10,
      "boxInnerWidth": 104,
      "prependToYAxisScales": null,
      "hideTitle": false
    };

    this.options = _.extend(defaultOptions, options);

    this.render = function(){
      var convertedData = this.convertedData = this.convertData();
      var $container = this.$container = $(this.id);
      var heightSetting = parseInt($container.css('min-height')) || 390;
      var margin = {top: 10, right: 20, bottom: 80, left: 65},
        width = $container.width() - margin.left - margin.right;
      var height = this.height = heightSetting - margin.top - margin.bottom;
      var x = d3.scale.ordinal()
        .rangeRoundBands([0, width], 0.4);
      var y = this.yScale = d3.scale.linear()
        .range([height, 0]);
      var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");
      var yAxis = this.yAxis = d3.svg.axis()
        .scale(y)
        .ticks(6)
        .orient("left");
      var svg = this.chart = d3.select(this.id).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      x.domain(_.map(convertedData, function(d) { return d.x; }));
      y.domain([0, d3.max(convertedData, function(d) { return d.y; })]);

      // Insert the X axis
      this.xAxisSvg = svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-5px")
        .attr("dy", "15px")
        .attr("transform", function(d) {
          return "rotate(-45)"
        });

      // Insert the Y axis
      this.yAxisSvg = svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

      this.contractYAxisScales();

      this.renderYAxisLabel();

      // Y axis lines
      svg.selectAll("line.y")
        .data(y.ticks(6))
        .enter().append("line")
        .attr("class", "y")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", y)
        .attr("y2", y)
        .style("stroke", "none");

      // Bars
      this.barContainer = svg.append("g")
        .classed("bar-container", true);

      this.barGroup = this.barContainer.selectAll(".bar")
        .data(convertedData)
        .enter().append("g")
        .classed("bar-group", true);

      this.barData = this.barGroup.append("rect")
        .classed("bar", true)
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand())
        .attr("y", function(d) { return y(d.y); })
        .attr("height", function(d) { return height - y(d.y); });

      // Bar hit areas
      this.barHitArea = this.barGroup
        .append("rect")
        .data(convertedData)
        .classed("bar-hit-area", true)
        .attr("x", function(d) { return x(d.x); })
        .attr("width", x.rangeBand())
        .attr("y", 0)
        .attr("height", function(d) { return height; })

      // Bar info boxes
      this.barInfo = this.barGroup
        .append("g")
        .classed("bar-info", true)
        .attr("transform", function(d) {
          // Position them with the related bar
          var xPos = x(d.x) - (x.rangeBand() / 2) - 6;
          var yPos = (height / 2) - 25;
          return "translate(" + xPos + "," + yPos + ")";
        });
      // Background
      this.barInfoBackground = this.barInfo.append("rect")
        .attr("x", 0)
        .attr("y", 0)
        .classed("background", true);
      // Title
      this.barInfoTitle = this.barInfo.append("text")
        .classed("title", true)
        .text(function(d) { return d3.format("0,000")(d.y); });
      if (this.options.hideTitle) {
        this.barInfo.classed("hide-title", true);
      }
      // Textual content
      this.barInfoText = this.barInfo.append("g")
        .classed("text", true);
      this.foreignObjects = this.barInfoText.append("foreignObject")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", 100)
        .attr("height", 100)
          .append("xhtml:body")
          .classed("svg-foreign-object bar-chart", true)
            .append("p")
            .text(function(d) { return d.x; });

      this.bindOnResize();

      if (this.foreignObjects.node().getBBox !== undefined) { // IE and friends (incomplete SVG spec implementations)
        // Suppress the bar info boxes
        $(this.barInfo[0]).hide();
      } else { // Normal browsers
        // Apply the finer positioning and sizing details to the bar info boxes
        this.updateBarInfoBox();
        // Activate bars on hover
        this.barGroup.on("mouseenter", this.activateBar)
        // Deactivate bars
        this.bindResetBarStates();
      }
    };

    this.convertData = function(){
      return _.map(this.data, function(datum){
        return {x: _.string.capitalize(datum[this.label]), y: datum[this.metric]};
      }, this);
    };

    this.updateMetric = function(metric, index){
      if (index !== undefined) {
        this.buttonIndex = index;
      }
      this.metric = metric;
      var height = this.height;
      var yScale = this.yScale;
      var convertedData = this.convertedData = this.convertData();
      if (!this.keepScale){
        yScale.domain([0, d3.max(convertedData, function(d) { return d.y; })]);
        this.yAxis.scale(yScale);
        this.chart.select(".y").transition().duration(10).call(this.yAxis);
        this.contractYAxisScales();
      }
      this.barData.data(convertedData)
        .transition().duration(500).delay(50)
        .attr("y", function(d) { return yScale(d.y); })
        .attr("height", function(d) { return height - yScale(d.y); });
      this.updateBarInfoBox();
    };

    this.bindOnResize = function() {
      // This is a hacky way of having the charts scale to window resizes.
      // We can re-render the chart, but this can sporadically cause race conditions
      // which will flood the console with plenty of DOM level errors (due to the deletion
      // of nodes while JS is still trying to operate on them). Despite the errors, the
      // resize functionality seems functional.
      var debouncer = _.debounce(function() {
        _this.render();
        var siblingBtnGroup = _this.$container.siblings('.btn-group');
        if (siblingBtnGroup.length) {
          if (siblingBtnGroup.find('.btn.active').index()) {
            siblingBtnGroup.find('.btn.active').click();
          }
        }
        // If multiple renders are run asynchronously, the container may be polluted
        // with extra svg elements. This removes all but the active one.
        _this.$container.find('svg:not(:last-child)').remove();
      }, 500);
      $(window).on('resize', debouncer);
    };

    this.resetYAxisFromZero = function() {
      this.updateMetric(this.metric);
    };

    this.setYAxisToZero = function() {
      var yScale = this.yScale;
      this.barData
        .transition().duration(500).delay(50)
        .attr("y", function(d) { return yScale(0); })
        .attr("height", function(d) { return 0; });
    };

    this.contractYAxisScales = function() {
      if (_this.options.contractYAxisScales) {
        _this.yAxisSvg.selectAll('.tick')
          .each(function(d, i) {
            d3.select(this).select('text').text(function() {
              var value = _this.contractScale(d);
              if (_this.options.prependToYAxisScales) {
                value = '' + _this.options.prependToYAxisScales + value;
              }
              return value;
            });
          });
      }
    };

    this.contractScale = function(scale) {
      var scaleTransforms = [
        {
          divisibleBy: 1000,
          append: "k"
        },
        {
          divisibleBy: 1000000,
          append: "m"
        },
        {
          divisibleBy: 1000000000,
          append: "b"
        }
      ];
      var transformedScale = null;
      _.each(scaleTransforms, function(obj) {
        var scaled = scale / obj.divisibleBy;
        if (Math.abs(scaled) > 1) {
          transformedScale = scaled + obj.append;
        }
      });
      return transformedScale || scale
    };

    this.renderYAxisLabel = function() {
      var labelText = this.getYAxisText();
      if (labelText) {
        // Add the label
        var label = this.yAxisSvg.append("text")
          .classed("y-axis-label", true)
          .attr("transform", "rotate(-90)")
          .style("text-anchor", "end")
          .text(labelText);
        this._positionTheYAxisLabel(label);
      }
    };

    this.updateYAxisLabel = function(yAxisLabelIndex) {
      var labelText = this.getYAxisText(yAxisLabelIndex);
      if (labelText) {
        var _this = this;
        // Hack: delaying to let d3 finish the rendering of the y-axis
        // scale text. TODO: have this fired by the y-axis generator
        setTimeout(function() {
          var label = _this.yAxisSvg.select(".y-axis-label")
            .text(labelText);
          _this._positionTheYAxisLabel(label);
        }, 50)
      }
    };

    this.getYAxisText = function(yAxisLabelIndex) {
      if (this.options.yAxisLabels) {
        return this.options.yAxisLabels[yAxisLabelIndex || 0];
      } else {
        return this.options.yAxisLabel;
      }
    };

    this._positionTheYAxisLabel = function(label) {
      var labelNode = label.node();
      var maxLeftOffset = _.max(
        _.map(
          $(this.yAxisSvg.selectAll('.tick text')[0]),
          function(el) {
            var bBox = el.getBBox();
            return Math.abs(bBox.y) + bBox.width;
          }
        )
      );
      var xPos = -((this.height - labelNode.getBBox().width) / 2);
      // Position the y axis label slightly offset from
      // the left-most tick value
      var yPos = -maxLeftOffset - labelNode.getBBox().height;
      label.attr({
        "x": xPos,
        "y": yPos
      });
    };

    this.activateBar = function() {
      var barGroup = this;
      // Denote the other bars as inactive
      _this.chart.selectAll(".bar-group")
        .classed("active", false)
        .classed("inactive", true);
      // Denote the current bar as active
      d3.select(barGroup)
        .classed("active", true)
        .classed("inactive", false);
      // Bring the active bar group to the front
      barGroup.parentNode.appendChild(barGroup);
    };

    this.resetBarStates = function(){
      _this.chart.selectAll(".bar-group")
        .classed("active", false)
        .classed("inactive", false);
    };

    this.bindResetBarStates = function() {
      this.barContainer.on("mouseleave", this.resetBarStates);
      // FF hacks
      this.$container.on("mouseleave", this.resetBarStates);
      this.xAxisSvg.on("mouseenter", this.resetBarStates);
      this.yAxisSvg.on("mouseenter", this.resetBarStates);
    };

    function scrollY() {
      // x-browser scrollY wrapper
      return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
    }

    this.findParentWithClass = function(element, className, maxDepth) {
      // Walk up the document looking for an element with the class matching `classname`.
      // `maxDepth` denotes the point at which the traversal will cut short, defaults to 150.
      var depthRemaining = maxDepth || 150;
      var elementName = element.nodeName.toLowerCase();
      while (elementName && elementName != 'html' && depthRemaining > 0) {
        if (element.classList.contains(className)) {
          return element;
        }
        element = element.parentElement;
        elementName = element.nodeName.toLowerCase();
        depthRemaining--;
      }
    };

    this._numberFormatter = d3.format("0,000");
    this.formatNumber = function(number) {
      return this._numberFormatter(number);
    };

    this.updateBarInfoBox = function() {
      // Updates the sizes, positions and text of each bar info box

      // Initially position and size the bar info box's elements
      this.barInfo.each(function() {
        var barInfo = d3.select(this);
        var background = barInfo.select('.background').node();
        var $background = $(background);
        var title = barInfo.select('.title').node();
        var $title = $(title);
        var text = barInfo.select('.text').node();
        var $text = $(text);
        var $foreignObject = $text.children('foreignObject');
        var padding = _this.options.barInfoBoxPadding;
        var foreignObjectHeight = $foreignObject.find('p').height();
        $title.attr("x", padding);
        $foreignObject.attr({
          // The height of the foreignObject's body element
          "height": foreignObjectHeight,
          // Left margin
          "x": padding,
          // Spacing between the title and the text
          "y": 2
        });

        var bgHeight = foreignObjectHeight + padding;
        var bgWidth = padding * 2;
        var bgY = padding - 2;
        if ($title.css('display') !== 'none' && title.getBBox().height) {
          bgHeight += $foreignObject.offset().top - $title.offset().top;
          bgWidth += title.getBBox().width;
          bgY = -title.getBBox().height + bgY;
        } else {
          bgY /= 20;
        }

        $background.attr({
          // Sum of the elements' height
          "height": bgHeight,
          // Widest element + padding
          "width": bgWidth,
          // Top margin
          "y": bgY
        });
      });

      // Update each title
      this.barInfo.each(function(d, i) {
        var value = Math.floor(_this.convertedData[i].y);
        var formattedValue = _this.formatNumber(value);
        var $title = $(d3.select(this).select('.title').node());
        if (_this.options.prependToYAxisScales) {
          formattedValue = '' + _this.options.prependToYAxisScales + value;
        }
        $title.text(formattedValue);
      });

      // Update each text
      this.barInfo.selectAll('.text p')
        .data(this.convertedData)
        .each(function(d, di, i) {
          d = _this.convertedData[i];
          var html = '';
          if (_this.options.barInfoText) {
            var template = _this.options.barInfoText[_this.buttonIndex];
            var xAxis = d.x;
            if (_.last(xAxis) === 's') {
              xAxis = xAxis.slice(0, xAxis.length-1);
            }
            var yAxis = _this.formatNumber(Math.floor(d.y));
            html = _.template(template, {xAxis: xAxis, yAxis: yAxis});
          } else {
            html = d.x;
          }
          $(this).html(html);
        });

      var chartNode = _this.chart.node();
      var chartRightOffset = $(chartNode).offset().left + chartNode.getBBox().width;

      // After the text has been updated, tweak the widths and heights
      this.barInfo.each(function(){
        var barInfoNode = this;
        // Delaying to ensure the bars have been positioned
        setTimeout(function() {
          // Reset the visibility state
          var barInfo = d3.select(barInfoNode);
          var $barInfo = $(barInfoNode);

          // If the info box was previously moved around, reset it's position
          if ($barInfo.attr('data-transform')) {
            $barInfo.attr('transform', $barInfo.attr('data-transform'));
          }

          var background = barInfo.select('.background');
          var title = barInfo.select('.title');
          // Left offset difference between the first two bars
          var boxInnerWidth = $(_this.barData[0][1]).offset().left - $(_this.barData[0][0]).offset().left + 9;
          if ($(title.node()).css('display') !== 'none') {
             boxInnerWidth = _.max([boxInnerWidth, title.node().getBBox().width]);
          }
          var text = barInfo.select('.text');
          var $foreignObject = $(text.node()).find('foreignObject');
          var foreignObject = $foreignObject.get(0);
          var oldHeight = foreignObject.getBBox().height;
          $foreignObject.attr("width", boxInnerWidth);
          var $foreignObjectPara = $foreignObject.find('p');
          var newHeight = $foreignObjectPara.height() + parseInt($foreignObjectPara.css('padding-top')) + 3;
          $foreignObject.attr("height", newHeight);
          var backgroundHeight = parseInt(background.attr('height'));
          var $foreignObjectParaWidth = $foreignObjectPara.width();
          if ($foreignObject.width() < $foreignObjectParaWidth) {
            $foreignObject.attr("width", $foreignObjectParaWidth);
          }
          // Hack for FF, some of the bar info boxes end up with cut-off text and
          // small backgrounds
          if (foreignObject.getBBox().height < $foreignObjectPara.height()) {
            $foreignObject.attr("height", $foreignObjectPara.height() + 30);
            newHeight += _this.options.barInfoBoxPadding;
          }
          // Resize the BG to accommodate the new text
          background.attr({
            "width": foreignObject.getBBox().width + (_this.options.barInfoBoxPadding * 2),
            "height": backgroundHeight + (newHeight - oldHeight)
          });
          // Shift the box to the left, if it is clipped by the right side of the chart
          var barInfoRightOffset = $barInfo.offset().left + barInfoNode.getBBox().width;
          if (barInfoRightOffset > chartRightOffset) {
            var difference = barInfoRightOffset - chartRightOffset;
            var transform = d3.transform($barInfo.attr('transform'));
            $barInfo.attr('data-transform', transform.toString());
            transform.translate[0] -= difference;
            $barInfo.attr('transform', transform.toString());
          }
        }, 200);
      })
    };
  };

}($, window.d3));
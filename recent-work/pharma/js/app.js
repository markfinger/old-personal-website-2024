tgm = window.tgm || {};
(function($, loadingOverlay, stats, toDollars, niceNumber, d3, BarChart) {
  'use strict';

  var ANIMATE = $('html').hasClass('no-touch');
  var perWeekEstimate = stats.summary.cost / (stats.summary.days / 365) / 52;

  tgm.charts = tgm.charts || {};

  // Load the stats when the page is ready
  $(populateStats);

  // Render the stats into the html and dismiss loading overlay when done
  function populateStats(){
    $('#total-cost').text(toDollars(stats.summary.cost));
    $('#per-year-estimate').text(toDollars(stats.summary.cost / (stats.summary.days / 365)));
    $('#per-week-estimate').text(toDollars(perWeekEstimate));
    $('#attendees-per-year').text(niceNumber(stats.summary.attendees / (stats.summary.days / 365)));
    $('#total-events').text(niceNumber(stats.summary.events));
    $('#total-attendees').text(niceNumber(stats.summary.attendees));

    populateCompanies();
    hashSeekCompaniesSection();
    $(window).on('hashchange', hashSeekCompaniesSection);

    populateConditions();

    var alcoholPercentage = Math.round((stats.summary.alcohol / stats.summary.events) * 100);
    $('#total-alcohol-percentage').text(alcoholPercentage);
    $('#perperson').text(toDollars(stats.summary.cost / stats.summary.attendees));
    $('#events-per-day').text(niceNumber(stats.summary.eventsPerDay));

    popPills();

    populateStatesMap();

    populateQuickPerPerson();

    if (d3) {
      populatePerPerson();
      populateProfessions();
      populateWorld();
    } else {
      disableD3Elements();
    }

    loadingOverlay.dismiss();

    if (window.location.hash) {
      loadCompany(window.location.hash.replace(/#*profile-/, ''));
    }

    if (ANIMATE) {
      // Check what sections are in the viewport, and set it to recheck
      // after scroll events
      var checkVisibility = checkVisibilityFactory();
      checkVisibility();
      $(document).scroll(checkVisibility);
    }

    bindBackToTop();

    bindScrollToIntro();

    bindStickyNavs();
  }

  function hashSeekCompaniesSection() {
    if (window.location.hash === '#companies') {
      $('#full-list').click();
      $.scrollTo($('#status'));
    }
  }

  // Render the companies table. Order it by total $
  function populateCompanies(){
    var companies = _.sortBy(stats.companies, 'cost').reverse();
    var companiesHtml = _.map(companies, function(company){
      // TODO: add incomplete and percentage classes
      var row = '<tr style="display:none">';
      row += '<td class="company">' + '<a data-company="' + company.company;
      row += '" href="/profiles/' + company.company + '">';
      row += (company.name || '!!MISSING!! ' + company.company).replace(/ (pty )*(ltd|limited)/i, '')  + '</a>' + '</td>';
      row += '  <td class="dollars">' + toDollars(company.cost) + '</td>';
      row += '  <td class="attendees">' + niceNumber(company.attendees) + '</td>';
      row += '  <td class="events">' + niceNumber(company.events) + '</td>';
      row += '  <td class="data">' + company.completed + '/' + (company.completed + (company.incomplete || 0)) + '</td>';
      row += '</tr>';
      return row;
    });
    $('#top5 tbody')
      .html(companiesHtml.join(''))
      .find('tbody tr:first').addClass('shadow');
    $('#top5 tbody')
      .find('tr:lt(5)').show();

    // Handle displaying of profile
    $('a[data-company]').click(function(e){
      e.preventDefault();
      var companyName = $(this).data('company');
      loadCompany(companyName);
    });

    // Handle displaying of profile
    $('#full-list').click(function(e){
      var altText = $(this).data('alt-text');
      e.preventDefault();
      if ($(this).data('full-list') === 'true') {
        $('#top5').find('tr:gt(5)').fadeOut();
        $(this).data('full-list', 'false');
        $.scrollTo('#status');
      } else {
        $('#top5').find('tr:gt(5)').fadeIn();
        $(this).data('full-list', 'true');
      }
      $(this).data('alt-text', $(this).text());
      $(this).text(altText);
    });
  }

  function loadCompany(companyName){
    var company = _.detect(stats.companies, function(c){ return c.company === companyName; });
    if (!company){
      return;
    }
    window.company = company;
    $('#company-name').text(company.name || company.company);
    $('#company-products').text(niceNumber(company.products));
    $('#company-products').attr('href', company.tgaLink);
    $('#company-total-cost').text(toDollars(company.cost));
    $('#company-pbs2012').text(company.pbs2012);
    _.each(['summary', 'blurb'], function(detail){
      var $detail = $('#company-' + detail);
      if (company[detail]){
        $detail.text(company[detail]).show();
      }else{
        $detail.text('').hide();
      }
    });
    $('#company-revenueAu').text(company.revenueAu || '');
    $('#company-revenueGlobal').text(company.revenueGlobal || '');

    $('#company-total-events').text(niceNumber(company.events));
    // pluralize the profession names names
    _.each(company.professions, function(profession){
      if (_.last(profession.profession) !== 's'){
        profession.profession += 's';
      } 

    });
    companyList('#company-top-professions', company.professions, 'profession');
    companyList('#company-top-conditions', company.conditions, 'condition');
    var bins = extractBins(company.perheadBins);
    $('#company-perperson strong[data-perperson=under-10-person]').text(bins[0]);
    $('#company-perperson strong[data-perperson=under-20-person]').text(bins[1]);
    $('#company-perperson strong[data-perperson=under-50-person]').text(bins[2]);
    $('#company-perperson strong[data-perperson=over-50-person]').text(bins[3]);
    _.each(['description', 'venue', 'hospitality', 'hospitalitycost', 'cost', 'attendees', 'period', 'hospitality_spendratio'], function(metric){
      var value = company.mostExpensive[metric];
      var text;
      if (metric.match(/cost|spend/)){
        text = toDollars(value);
      } else if (metric.match(/attendees/)) {
        text = niceNumber(value);
      } else {
        text = value && value.replace(/;/gm, ',');
      }
      $('#company-expensive-event-' + metric).text(text || '');
    });
    $('#profile').modal();
  }

  function companyList(id, list, name){
    var top3 = _.sortBy(list, 'events').reverse().slice(0, 3);
    $(id).html(_.map(top3, function(item){
      var itemName = item[name];
      if (itemName === 'gps'){
        itemName = 'General Practioners';
      }else if (itemName === 'hiv'){
        itemName = 'HIV';
      }else if (itemName === 'auto_immune_disorders'){
        itemName = 'Auto-immune Disorders';
      }else if (itemName === 'blood_specific_illness'){
        itemName = 'Blood-Specific Illness';
      }else if (itemName === 'gastro'){
        itemName = 'Gastroenterology';
      }else if (itemName === 'respiratory'){
        itemName = 'Respiratory/Asthma';
      }else if (itemName === 'parkinsons_disease'){
        itemName = 'Parkinson\'s Disease';
      }else{
        itemName = _.string.humanize(itemName);
      }
      return '<li>' + itemName + ' <span>' + niceNumber(item.events) + ' events</span></li>';
    }).join(''));
  }

  // Render the companies table. Order it by total $
  function populateConditions(){
    var conditions = _.sortBy(stats.conditions, 'cost').reverse().slice(0, 5);
    var $conditions = $('#conditions');
    var maxCost = conditions[0].cost;
    var html = _.map(conditions, function(condition){
      var id = condition.condition;
      var name = id.replace(/_/, ' ');
      var li = '<li id="condition-' + id + '"><strong>' + name + '</strong>';
      li += '<i class="background"></i>';
      li += '<span>' + toDollars(condition.cost) + '</span></li>';
      return li;
    }).join("\n");

    // Add the html
    $conditions.html(html);

    if (
      (ANIMATE && $('.subsection.disease').hasClass('is-visible')) ||
      !ANIMATE
    ) {
      // Calculate the offsets of the background that work like bar graphs
      var width = $conditions.find('li:first').outerWidth();
      // Apply the offsets
      _.each(conditions.slice(0), function(condition, i){
        var element = $conditions.find(
          '#condition-' + condition.condition + ' .background'
        );
        var widthToSet = (condition.cost / maxCost) * width;
        element.animate({"width": widthToSet + "px"}, 1000);
      });
    }
  }

  // Work out how many of those little pills need to be displayed
  function popPills(){
    $('#pills').html(
        _.map(_.range(stats.summary.eventsPerDay), function(){
          return '<li><div class="pill top"></div><div class="pill"></div></li>';
        }).join('\n')
    );
  }

  // Setup map of states
  function populateStatesMap(){
    // Match the order of the map
    var mapOrder = ['nt', 'qld', 'nsw', 'act', 'vic', 'tas', 'sa', 'wa'];
    var states = _.map(mapOrder, function(state){
      return _.detect(stats.states, function(stateData){
        return stateData.state === state;
      });
    });
    var $states = $('#states');
    var html = _.map(states, function(state){
      var li = '<li id="state-' + state.state + '">' + state.state.toUpperCase();
      li += '<span>' + niceNumber(state.events) + '</span></li>';
      return li;
    }).join("\n");

    // Add the html
    $states.html(html);
  }

  function populateQuickPerPerson(){
    var bins = extractBins(stats.perheadBins);
    $('#under-10-person').text(bins[0]);
    $('#under-20-person').text(bins[1]);
    $('#under-50-person').text(bins[2]);
    $('#over-50-person').text(bins[3]);
  }

  function extractBins(bins){
    var rest = _.inject(bins.slice(3), function(sum, datum){
      return sum + datum.hospitalitycount;
    }, 0);
    return [
      niceNumber(bins[0].hospitalitycount),
      niceNumber(bins[1].hospitalitycount),
      niceNumber(bins[2].hospitalitycount),
      niceNumber(rest)
    ];
  }

  function populatePerPerson(){
    var data = stats.perheadBins;

    _.each(data, function(datum){
      datum.bin = toDollars(datum.bin, "remove-cents");
    });

    _.each(data.slice(0, data.length - 1), function(datum, index){
      var previousBin = data[index - 1] ? data[index - 1].bin : 0;
      datum.binLabel = previousBin + '-' + datum.bin;
    });

    _.last(data).binLabel = 'Over ' + data[data.length - 2].bin;

    var chart = new BarChart({
      id: "#perperson-chart",
      data: stats.perheadBins,
      label: 'binLabel',
      metric: 'hospitalitycount',
      keepScale: !!'keepScale',
      yAxisLabel: 'Number of attendees',
      barInfoText: ['attendees received hospitality costing <%= xAxis %> pp']
    });

    chart.render();
    if (ANIMATE) {
      chart.setYAxisToZero();
    }

    bindButtons('#perperson-chart button', chart);

    tgm.charts['cost'] = chart;
  }

  function populateProfessions(){
    var topProfessions = _.sortBy(stats.professions, 'events').reverse().slice(0, 8);

    _.each(topProfessions, function(prof){
      if (prof.profession === 'gp') {
        prof.label = "GPs";
      } else {
        prof.label = prof.profession + 's';
      }
    });

    var prependToYAxisScales = ['$', '', '$'];

    var chart = new BarChart({
      id: '#professions',
      data: topProfessions,
      label: 'label',
      metric: 'perperson',
      keepScale: !'keepScale',
      yAxisLabels: ['Avg. spend per person', 'Number of events', 'Total spent'],
      barInfoText: [
        'An average of <br><strong>$<%= yAxis %></strong><br> was spent per <%= xAxis %>',
        '<%= xAxis %>s attended an average of <br><strong><%= yAxis %></strong><br> education events',
        'In total <br><strong>$<%= yAxis %></strong><br>was spent on <%= xAxis %>s'
      ],
      prependToYAxisScales: prependToYAxisScales[0],
      hideTitle: true
    });
    chart.render();
    if (ANIMATE) {
      chart.setYAxisToZero();
    }

    bindButtons('#attendees button', chart, prependToYAxisScales);

    tgm.charts['attendees'] = chart;
  }

  function populateWorld(){
    var maxCountries = 3;
    var columns = ['country', 'events', 'cost'];
    var countries = d3.select('#world #countries');
    countries.selectAll("li")
      .data(stats.countries.slice(0, maxCountries))
      .enter()
      .append("li")
      .attr('class', function(row){ return row.country.toLowerCase().replace(/ /g, '-'); })
      .append("dl")
      .html(function(row){
        return _.map(columns, function(column){
          var html = "<dt>" + column + "</dt>";
          var value = row[column];
          html += "<dd>" + (column === 'cost' ? toDollars(value) : value) + "</dd>";
          return html;
        }).join('');
      });
  }

  function disableD3Elements(){
    $('.datavis').addClass('no-ie');
  }

  function bindButtons(buttons, chart, prependToYAxisScales) {
    var $buttons = $(buttons);
    $buttons.click(function(){
      var $button = $(this);
      var index = $button.index();
      if (prependToYAxisScales) {
        chart.options.prependToYAxisScales = prependToYAxisScales[$button.index()];
      }
      chart.updateMetric($button.data('metric'), index);
      chart.updateYAxisLabel(index);
      $buttons.removeClass('active');
      $button.addClass('active');
    });
  }

  function scrollY() {
    // x-browser scrollY wrapper
    return (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
  }

  // functions to be called when a subsection with a matching class or id is visible
  var onVisibilityBindings = {
    'perperson-chart': function() {
      tgm.charts.cost.resetYAxisFromZero();
    },
    'attendees': function() {
      tgm.charts.attendees.resetYAxisFromZero();
    },
    'disease': populateConditions,
    // Counter animation
    'spending': function() {
      var parentElement = $(this).find('#per-week-estimate');
      var initialString = "$0,000,000";
      var initialHTML = _.map(initialString, function(value, i) {
        return '<i class="inactive">' + value + '</i>'
      }).join('');
      parentElement.html(initialHTML);
      var childElements = parentElement.children();
      var childElementIndex = childElements.length - 1;
      var currentElement = $(childElements.get(childElementIndex));

      var finalIntValue = Math.floor(perWeekEstimate);

      var fragments = _.map(
        _.collect(finalIntValue.toString()),
        // Wrapper around parseInt to prevent base/radix arg interference
        function(value) { return parseInt(value); }
      );

      var animationFunction = function() {
        var c = tgm.counter;
        if (c.currentElement.hasClass('inactive')) {
          c.currentElement.removeClass('inactive');
        }
        if (
          !isNaN(c.current) &&
          c.current <= 8 &&
          c.current !== c.fragments[c.fragmentIndex]
        ) {
          // Increment the char and update the DOM
          c.current++;
          // Replace the char in the string
          c.stringValue = c.stringValue.slice(0, c.stringIndex) + c.current + c.stringValue.slice(c.stringIndex + 1);
          c.currentElement.text(c.current);
        } else if (c.stringIndex == 0) {
          // Animation finished
          return;
        } else {
          // Move to the next char
          if (c.current === c.fragments[c.fragmentIndex]) {
            c.fragmentIndex--;
          }
          c.stringIndex--;
          c.childElementIndex--;
          c.currentElement = $(c.childElements.get(c.childElementIndex));
          c.current = parseInt(c.stringValue[c.stringIndex]);
        }
        setTimeout(c.animationFunction, 50);
      };

      tgm.counter = {
        parentElement: parentElement,
        childElements: childElements,
        childElementIndex: childElementIndex,
        currentElement: currentElement,
        value: 0,
        finalValue: finalIntValue,
        fragments: fragments,
        fragmentIndex: fragments.length - 1,
        stringValue: initialString,
        stringIndex: initialString.length - 1,
        current: 0,
        animationFunction: animationFunction
      };

      setTimeout(tgm.counter.animationFunction, 450);
    },
    // Hide the related stories panel
    'fade': function() {
      $('#related').fadeOut();
    }
  };

  // functions to be called when a subsection with a matching class or id is no longer visible
  var offVisibilityBindings = {
    'perperson-chart': function() {
      tgm.charts.cost.setYAxisToZero();
    },
    'attendees': function() {
      tgm.charts.attendees.setYAxisToZero();
    },
    'disease': function() {
      $('.subsection.disease')
        .find('li')
        .css('background-position-x', 'inherit');
    },
    'spending': function() {
      // Reset the element's text value
      var element = $(this).find('#per-week-estimate');
      var initalString = "$0,000,000";
      var initialHTML = _.map(initalString, function(value, i) {
        return '<i class="inactive">' + value + '</i>'
      }).join('');
      element.html(initialHTML);
    },
    // Show the related stories panel
    'fade': function() {
      $('#related').fadeIn();
    }
  };

  function checkVisibilityFactory() {
    // Add a `is-visible` class to each element once it has entered the viewport,
    // also triggers any JS animations.

    var elements = $(
      '.subsection, ' +
      '#perperson-chart'
    );

    return function() {
      var windowScrollY = scrollY();
      elements.each(function() {
        var element = $(this);
        // If the element has entered the viewport and needs to have it's animations trigger
        if (!element.hasClass('is-visible') && element.offset().top < (windowScrollY + window.innerHeight - 250)) {
          element.addClass('is-visible');
          // Execute JS animations
          _.each(onVisibilityBindings, function(callback, identifier) {
            if (element.hasClass(identifier) || element.attr('id') == identifier) {
              callback.apply(element);
            }
          });
        }
        // If the element is below the viewport and needs to be reset
        if (element.hasClass('is-visible') && element.offset().top > (windowScrollY + window.innerHeight)) {
          element.removeClass('is-visible');
          // Reset any JS animations
          _.each(offVisibilityBindings, function(callback, identifier) {
            if (element.hasClass(identifier) || element.attr('id') == identifier) {
              callback.apply(element);
            }
          });
        }
      })
    }
  }

  function bindBackToTop() {
    $('.top a').click(function(event) {
      event.preventDefault();
      $.scrollTo($('#main'), 500);
    });
  }

  function bindScrollToIntro() {
    $('#title a').click(function(event) {
      event.preventDefault();
      $.scrollTo($('#section-container'), 500);
    });
  }

  function bindStickyNavs() {
    var nav = $('.sticky-nav, #nav-mob');

    var bindStickyPosition = function(element) {
      // Bind the element's natural offset from the top in it's data
      var $element = $(element);
      var hasClass = $element.hasClass('sticky');
      if (hasClass) {
        $element.toggleClass('sticky');
      }
      $element.data({'stickyPosition': $element.offset().top});
      if (hasClass) {
        $element.toggleClass('sticky');
      }
    };

    var checkPositions = function() {
      _.each(nav, function(element) {
        var $element = $(element);
        if (scrollY() >= $element.data().stickyPosition) {
          $element.addClass('sticky');
        } else {
          $element.removeClass('sticky');
        }
      })
    };

    // Store the position
    _.each(nav, bindStickyPosition);

    // Restore the position on window.onresize
    $(window).on('resize', function() {
      _.each(nav, bindStickyPosition)
    });

    // Check if the element is either below or inline with it's `stickyPosition`
    $(window).on('resize', checkPositions);
    $(window).on('scroll', checkPositions);
  }

  $.fn.modal.defaults.modalOverflow = true;

}($, window.loadingOverlay, window.stats, window.toDollars, window.niceNumber, window.d3, window.BarChart));

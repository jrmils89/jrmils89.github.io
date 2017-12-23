if (typeof moment === "undefined" && typeof require === 'function') {
  var moment = require('moment');
}

(function (moment) {
  var STRINGS = {
    nodiff: '',
    year: 'year',
    years: 'years',
    month: 'month',
    months: 'months',
    day: 'day',
    days: 'days',
    hour: 'hour',
    hours: 'hours',
    minute: 'minute',
    minutes: 'minutes',
    second: 'second',
    seconds: 'seconds',
    delimiter: ' '
  };

  function pluralize(num, word) {
    return num + ' ' + STRINGS[word + (num === 1 ? '' : 's')];
  }

  function buildStringFromValues(yDiff, mDiff, dDiff, hourDiff, minDiff, secDiff) {
    var result = [];

    if (yDiff) {
      result.push(pluralize(yDiff, 'year'));
    }
    if (mDiff) {
      result.push(pluralize(mDiff, 'month'));
    }
    if (dDiff) {
      result.push(pluralize(dDiff, 'day'));
    }
    if (hourDiff) {
      result.push(pluralize(hourDiff, 'hour'));
    }
    if (minDiff) {
      result.push(pluralize(minDiff, 'minute'));
    }
    if (secDiff) {
      result.push(pluralize(secDiff, 'second'));
    }

    return result.join(STRINGS.delimiter);
  }

  function buildValueObject(yDiff, mDiff, dDiff, hourDiff, minDiff, secDiff, firstDateWasLater) {
    return {
      "years": yDiff,
      "months": mDiff,
      "days": dDiff,
      "hours": hourDiff,
      "minutes": minDiff,
      "seconds": secDiff,
      "firstDateWasLater": firstDateWasLater
    }
  }
  moment.fn.preciseDiff = function (d2, returnValueObject) {
    return moment.preciseDiff(this, d2, returnValueObject);
  };

  moment.preciseDiff = function (d1, d2, returnValueObject) {
    var m1 = moment(d1),
      m2 = moment(d2),
      firstDateWasLater;

    m1.add(m2.utcOffset() - m1.utcOffset(), 'minutes'); // shift timezone of m1 to m2

    if (m1.isSame(m2)) {
      if (returnValueObject) {
        return buildValueObject(0, 0, 0, 0, 0, 0, false);
      } else {
        return STRINGS.nodiff;
      }
    }
    if (m1.isAfter(m2)) {
      var tmp = m1;
      m1 = m2;
      m2 = tmp;
      firstDateWasLater = true;
    } else {
      firstDateWasLater = false;
    }

    var yDiff = m2.year() - m1.year();
    var mDiff = m2.month() - m1.month();
    var dDiff = m2.date() - m1.date();
    var hourDiff = m2.hour() - m1.hour();
    var minDiff = m2.minute() - m1.minute();
    var secDiff = m2.second() - m1.second();

    if (secDiff < 0) {
      secDiff = 60 + secDiff;
      minDiff--;
    }
    if (minDiff < 0) {
      minDiff = 60 + minDiff;
      hourDiff--;
    }
    if (hourDiff < 0) {
      hourDiff = 24 + hourDiff;
      dDiff--;
    }
    if (dDiff < 0) {
      var daysInLastFullMonth = moment(m2.year() + '-' + (m2.month() + 1), "YYYY-MM").subtract(1, 'M').daysInMonth();
      if (daysInLastFullMonth < m1.date()) { // 31/01 -> 2/03
        dDiff = daysInLastFullMonth + dDiff + (m1.date() - daysInLastFullMonth);
      } else {
        dDiff = daysInLastFullMonth + dDiff;
      }
      mDiff--;
    }
    if (mDiff < 0) {
      mDiff = 12 + mDiff;
      yDiff--;
    }

    if (returnValueObject) {
      return buildValueObject(yDiff, mDiff, dDiff, hourDiff, minDiff, secDiff, firstDateWasLater);
    } else {
      return buildStringFromValues(yDiff, mDiff, dDiff, hourDiff, minDiff, secDiff);
    }


  };
}(moment));




var myApp = angular.module('ResumeApp', []);


myApp.controller('ResumeController', function () {

  var self = this;

  self.timeWorked = function (startDate, endDate) {
    var startTime = moment(startDate);
    var endTime = endDate ? moment(endDate) : moment();

    var diff = moment.preciseDiff(startTime, endTime, true);
    
    var yearsWorked = "";
    var monthsWorked = "";
    var daysWorked = ""

    if (diff.years) {
      if (diff.years > 1) {
        yearsWorked = diff.years + " years"
      } else {
        yearsWorked = diff.years + " year";
      }
    }

    if (diff.days && diff.days >= 15 && !endDate) {
      diff.months += 1;
    }

    if (diff.months) {
      if (diff.months > 1) {
        monthsWorked = diff.months + " months"
      } else {
        monthsWorked = diff.months + " month";
      }
    }

    return yearsWorked + " " + monthsWorked;
  }

  self.dates = {
    hBloom: {
      startDateReadable: 'June 2016',
      endDateReadable: 'Present',
      timeWorked: self.timeWorked('2016-06-01', null)
    },
    gaTa: {
      startDateReadable: 'December 2016',
      endDateReadable: 'March 2017',
      timeWorked: self.timeWorked('2016-12-01', '2017-03-01')
    },
    bbgStats: {
      startDateReadable: 'March 2013',
      endDateReadable: 'October 2015',
      timeWorked: self.timeWorked('2013-03-01', '2015-10-31')
    },
    iyaBoard: {
      startDateReadable: 'September 2017',
      endDateReadable: 'Present',
      timeWorked: self.timeWorked('2017-09-01', null)
    }
  }

});

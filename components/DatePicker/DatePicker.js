/* eslint-disable*/

import React, {Component, PropTypes} from 'react';
import {isSameDay} from 'react-day-picker/lib/Utils';
import DayPicker from 'react-day-picker';
import {memoize} from 'lodash';
import moment from 'moment';

import s from './DatePicker.css';

const weekdaysShort = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const weekdaysLong = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];

const localeUtils = {
  formatMonthTitle: date => moment(date).format('MMMM YYYY'),
  formatWeekdayShort: dayIndex => weekdaysShort[dayIndex],
  formatWeekdayLong: dayIndex => weekdaysLong[dayIndex],
  getFirstDayOfWeek: () => 1
}

// TODO: move this logic elsewhere so it can be consumed by multiple parts of
// the app
function cantShip(day) {
  const now = moment();
  const then = moment(day);
  const lastShippable = moment(now).set({
    hour: 13,
    minute: 0,
    second: 0,
    millisecond: 0
  });

  const isBeforeToday = then.isBefore(now);
  const isWeekend = then.isoWeekday() === 6 || then.isoWeekday() === 7;
  const isToday = then.isSame(lastShippable, 'day');

  if (isToday) {
    return now.isAfter(lastShippable);
  } else {
    return isBeforeToday || isWeekend;
  }

  // Return true for the days we want to disable
  return isAfterLastShippable;
}

export default class DatePicker extends Component {
  constructor(props) {
    super(props);
    this.handleDayClick = this.handleDayClick.bind(this);
    this.renderDay = this.renderDay.bind(this);
  }
  renderDay(day) {
    return (
      <span>{day.getDate()}</span>
    );
  }
  render() {
    const selectedDay = new Date(this.props.value);
    const modifiers = {
      disabled: memoize(cantShip),
      selected: memoize(isSameDay.bind(this, selectedDay))
    };

    return (
      <div className={s.root}>
        <DayPicker locale="en-gb"
                   enableOutsideDays={true}
                   localeUtils={localeUtils}
                   modifiers={modifiers}
                   renderDay={this.renderDay}
                   onDayClick={this.handleDayClick}/>
      </div>
    );
  }

  handleDayClick(e, date) {
    if (!cantShip(date)) {
      this.props.onChange(date.getTime());
    }

  }
}

DatePicker.propTypes = {
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  onChange: PropTypes.func.isRequired
};
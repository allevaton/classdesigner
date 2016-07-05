import React, { Component, PropTypes } from 'react';

import moment from 'moment';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import BigCalendar from 'react-big-calendar';
BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment));

function removeTimeLabels() {
  let elements = document.querySelectorAll('div.rbc-event-label');
  // if (elements.length > 0)
  Array.prototype.forEach.call(elements, (e) => {
    e.parentNode.removeChild(e);
  });
  // for (let i = 0; i < elements.length; i++) {
  //   let e = elements[i];
  //   e.parentNode.removeChild(e);
  // }
}

function removeAllDayRow() {
  let cell = document.querySelector('div.rbc-allday-cell');
  let row = cell.parentNode;
  row.parentNode.removeChild(row);
}

export default class Calendar extends Component {
  static propTypes = {
    calendarEvents: PropTypes.array.isRequired,
    className: PropTypes.string,
    style: PropTypes.object
  };

  componentDidMount() {
    removeTimeLabels();
    removeAllDayRow();
  }

  componentDidUpdate() {
    removeTimeLabels();
  }

  render() {
    let {calendarEvents, className, style} = this.props;
    if (calendarEvents.length === 0)
      calendarEvents = [{start: new Date(2015, 3, 0), title: 'Default'}];

    return (
      <BigCalendar
        selectable={false}
        events={calendarEvents}
        defaultView='week'
        toolbar={false}
        formats={{
          dayFormat: 'ddd'
        }}
        defaultDate={new Date(2000, 4, 1)}
        min={new Date(2000, 4, 1, 7)}
        max={new Date(2000, 4, 1, 19)}
        eventPropGetter={event => ({
          style: {
            backgroundColor: event.backgroundColor,
            borderColor: event.backgroundColor
          }
        })}
        className={className}
        style={{
          ...style
        }}
      />
    )
  }
}

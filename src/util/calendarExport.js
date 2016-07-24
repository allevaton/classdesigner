import {VCALENDAR, VEVENT} from 'ics-js';
import timeStringToDate from './timeStringToDate';
import zpad from 'zpad';
import moment from 'moment';

function switchDays(day) {
  switch(day) {
    case 'M': return 'MO';
    case 'T': return 'TU';
    case 'W': return 'WE';
    case 'R': return 'TH';
    case 'F': return 'FR';
  }
}

function switchNumberedDays(day) {
  switch(day) {
    case 'M': return 1;
    case 'T': return 2;
    case 'W': return 3;
    case 'R': return 4;
    case 'F': return 5;
  }
}

/**
  @description Exports calendar events into an ICS blob
  @param {array} events Should be passed selected class data from the store.selectedClasses
  @returns Promise<Blob>
*/
export default function calendarExport(classes, semester) {
  return new Promise((resolve, reject) => {
    // check if there ARE selected classes
    if (!classes.some(c => c.length > 0)) {
      reject('You must select some classes before exporting')
    }

    let year = Number(semester.slice(0, 4))
    if (isNaN(year)) {
      reject('Must pass a valid semester string (should be obtained through the store)')
    }
    if (semester.slice(4, 6) === '10')
      year--;

    const cal = new VCALENDAR();
    cal.addProp('VERSION', 2)
    cal.addProp('PRODID', 'Wentworth Class Designer');

    classes.forEach(classSection => {
      classSection.forEach(c => {
        const event = new VEVENT();
        event.addProp('UID');

        // first get start and end dates
        let [startDate, endDate] = c.date.split('-').map(date => new Date(date));
        let [startTime, endTime] = c.time.split('-').map(timeStringToDate);

        startDate.setYear(year);
        startDate.setHours(startTime[0])
        startDate.setMinutes(startTime[1])

        let eventEndDate = new Date(startDate);
        eventEndDate.setHours(endTime[0])
        eventEndDate.setMinutes(endTime[1])
        eventEndDate.setYear(year);
        endDate.setYear(year);

        let splitDays = c.days.split('');

        let switchedDays = splitDays.map(switchDays).join(',');
        let recurEnd = `${endDate.getFullYear()}${zpad(endDate.getMonth() + 1)}${zpad(endDate.getDate() - 6)}T000000`;

        event.addProp('DTSTAMP', new Date(Date()), {VALUE: 'DATE-TIME'})
        event.addProp('DTEND', eventEndDate)
        event.addProp('SUMMARY', `${c.title}`)
        event.addProp('RRULE', `FREQ=WEEKLY;UNTIL=${recurEnd};WKST=SU;BYDAY=${switchedDays}`)
        event.addProp('LOCATION', c.location)
        event.addProp('DESCRIPTION', `Professor: ${c.instructor}`)
        
        // adjust the start date to when the course actually has its first date, according to recurrence rules
        let numberedDays = splitDays.map(switchNumberedDays);
        let nextRecurrence = numberedDays.find(x => x >= startDate.getDay()) || numberedDays[0];
        
        let searchDate = moment(startDate); //now or change to any date
        while (searchDate.weekday() !== nextRecurrence){ 
          searchDate.add(1, 'day'); 
        }
        event.addProp('DTSTART', searchDate.toDate())
        cal.addComponent(event)
      });
    });

    resolve(cal.toBlob());
  });
}

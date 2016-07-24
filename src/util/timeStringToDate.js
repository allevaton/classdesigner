export default function timeStringToDate(time) {
  return time.split(':').reduce((hour, minute) => {
    let intHour = Number.parseInt(hour);
    if (minute.search('p') !== -1 && intHour !== 12)
      intHour += 12;

    return [intHour, Number.parseInt(minute)]
  });
}

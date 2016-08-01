import {action, computed, observable} from 'mobx';
import {getColor} from '../constants/courseColors';
import fetch from 'isomorphic-fetch';
import timeStringToDate from '../util/timeStringToDate'

const last = array => array[array.length - 1];

const _searchRegex = /^\s*([A-z]+)\s*([0-9]+)/i;

const switchDays = (d) => {
  switch (d) {
    case 'M':
      return 1;
    case 'T':
      return 2;
    case 'W':
      return 3;
    case 'R':
      return 4;
    case 'F':
      return 5;
  }
};

const YEAR = 2000;
const MONTH = 4;

export default class Store {
  /**
   * @description An array to hold all course entries from the user (ex: COMP5510)
   * @type {Array}
   */
  @observable courses = ['', '', '', ''];

  /**
   * @description All class data the user has access to, taken from the server
   * @example {201310: [{subj: COMP, instructor: 'Donald Trump'}, ...]}
   * @type {{}}
   */
  @observable classData = {};

  /**
   * @description Handles your selected classes. Should be stored as a 2D array.
   * @example [[{class1}, {class2}], [{class3}, {class4}], ...]
   * @type {Array}
   */
  @observable selectedClasses = [[], [], [], []];

  /**
   * Currently selected semester abiding by Wentworth's semester naming scheme
   * @example 201610 - Fall semester of 2017
   * @type {string}
   */
  @observable selectedSemester = '';

  /**
   * @description Updates a specific course that the user is editing
   * @param index The course selection index that the user is typing into
   * @param courseName The text the user has entered
   */
  @action updateCourse(index, courseName) {
    this.courses[index] = courseName;
    this.selectedClasses[index] = [];

    // only update the size if you edit the last one
    if (this.courses.length > 4 && last(this.courses).length === 0)
      this.courses.pop();

    if (last(this.courses).length > 0)
      this.courses.push('');
  }

  /**
   * Clears out courses and selected classes
   */
  @action clear() {
    this.courses = ['', '', '', ''];
    this.selectedClasses = [[], [], [], []];
  }

  @action changeSemester(newSemester) {
    if (this.selectedSemester === newSemester)
      return;

    this.clear();
    this.selectedSemester = newSemester;
    this.fetchClassData(newSemester);

    this._classDataCache[newSemester] = {};
    this._autocompleteCache[newSemester] = {};
    this._searchCache[newSemester] = {};
  }

  @computed get semesterOptions() {
    return this.indexData.map(item => ({value: item.value, label: item.semester}));
  }

  /**
   * How many semesters are available
   * @type {Array}
   */
  @observable indexData = [];

  /**
   * The data for autocompletion
   * @type {Array}
   */
  @observable autocompleteData = {};

  /**
   * Set to true when loading the index file
   * @type {boolean}
   */
  @observable fetchingIndex = false;

  /** Set to true when loading class data
   * @type {boolean}
   */
  @observable fetchingClassData = false;

  @computed get isLoadingData() {
    return this.fetchingClassData || this.fetchingIndex;
  }

  /**
   * @description Fetches the data file to determine how many semesters we have data for
   * so we can populate the basic UI
   */
  @action fetchIndex() {
    this.fetchingIndex = true;
    fetch('../data/index.json')
      .then(data => data.json())
      .then(json => {
        this.indexData = json;
        this.fetchingIndex = false;
      });
  }

  /**
   * Loads class data from the server for the specified semester
   * @param semesterCode
   * @see selectedSemester
   */
  @action fetchClassData(semesterCode) {
    // if it hasn't been loaded yet, load it
    if (!this.classData[semesterCode]) {
      this.fetchingClassData = true;
      fetch(`../data/wit.${semesterCode}.json`)
        .then(data => data.json())
        .then(json => {
          this.classData[semesterCode] = json;
          this.updateAutoCompleteData(semesterCode);
          this.fetchingClassData = false;
        });
    }
  }

  /**
   * Updates the autocomplete data for text boxes
   * @param semesterCode
   * @see selectedSemester
   * TODO set this to autorun for when the class data or semester changes
   */
  @action updateAutoCompleteData(semesterCode) {
    this._searchCache[semesterCode] = {};
    this.autocompleteData[semesterCode] = this.classData[semesterCode]
      .reduce((prev, cur) => {
        let text = `${cur.subj}${cur.crse}`;
        if (!prev.some(e => e.text === text))
          return [
            ...prev,
            {
              value: `${text} - ${cur.title}`,
              text: `${text}`
            }
          ];
        else
          return prev;
      }, []);
  }

  _classDataCache = {};
  _autocompleteCache = {};
  _searchCache = {};

  /**
   * Searches classes based on the course text
   * @example COMP1994 -> [{subj: 'COMP', crse: '1994', time: '8:00am-12:00pm', ...}, ...]
   * @param courseText course subject and number
   * @returns {Array}
   */
  getClasses(courseText) {
    let cache = this._classDataCache[this.selectedSemester][courseText];
    if (cache)
      return cache;

    if (this.classData && this.classData[this.selectedSemester] && courseText) {
      // group 1 is subj, group 2 is crse
      let matches = _searchRegex.exec(courseText);
      if (matches) {
        let data = this.classData[this.selectedSemester]
          .filter((d) => d.subj === matches[1] && d.crse === matches[2]);

        this._classDataCache[this.selectedSemester][courseText] = data;
        return data;
      } else {
        this._classDataCache[this.selectedSemester][courseText] = [];
        return [];
      }
    }
    else {
      this._classDataCache[this.selectedSemester][courseText] = [];
      return [];
    }
  }

  @action selectClass(selected, index, classData) {
    if (selected)
      this.selectedClasses[index].push(classData);
    else
      this.selectedClasses[index].remove(classData);
  }

  @computed get crns() {
    return Array.from(new Set(this.selectedClasses.reduce((prev, next) => {
      return [
        ...prev,
        ...next.map(c => c.crn)
      ]
    }, [])));
  }

  @computed get crnsAndTitle() {
    return this.selectedClasses.reduce((prev, next) => {
      return [
        ...prev,
        ...next.reduce((p, n) => {
          if (!prev.find(c => c.crn == n.crn) && !p.find(c => c.crn == n.crn))
            return [
              ...p,
              {
                crn: n.crn,
                title: n.title
              }
            ];
          else
            return p;
        }, [])
      ]
    }, []);
  }

  @computed get calendarEvents() {
    let events = [];
    this.selectedClasses.forEach((course, courseId) => {
      course.forEach(c => {
        c.days.split('').forEach(day => {
          // get the times for each class
          let timeSplit = c.time.split('-');
          let startTime = timeStringToDate(timeSplit[0]);
          let endTime = timeStringToDate(timeSplit[1]);

          events.push({
            title: `${c.subj}${c.crse}`,
            start: new Date(YEAR, MONTH, switchDays(day), startTime[0], startTime[1]),
            end: new Date(YEAR, MONTH, switchDays(day), endTime[0], endTime[1]),
            backgroundColor: getColor(courseId)
          })
        });
      });
    });
    return events;
  }

  /**
   * Collection of dialog boxes
   * @example {semesterSelection: {open: false}, ...}
   * @type {{}}
   */
  @observable dialog = {
    semesterSelection: {open: false},
    crnDialog: {open: false},
    exportDialog: {open: false}
  };

  @action openDialog(dialog) {
    if (this.dialog[dialog])
      this.dialog[dialog].open = true;
  }

  @action closeDialog(dialog) {
    if (this.dialog[dialog])
      this.dialog[dialog].open = false;
  }

  @action toggleDialog(dialog) {
    if (this.dialog[dialog])
      this.dialog[dialog].open = !this.dialog[dialog].open;
  }
}

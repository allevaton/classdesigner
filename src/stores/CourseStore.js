import { computed, observable } from 'mobx';

export default class CourseStore {
  @observable courses = [];
}

import React, {PropTypes, Component} from 'react';
import {observer} from 'mobx-react';

import {getColor, getLineColor} from '../constants/courseColors';

import AutoCompleteField from '../components/AutoCompleteField';
import ClassList from '../containers/ClassList';
import CourseItem from '../components/CourseItem';

@observer
export default class CourseList extends Component {
  render() {
    let {store} = this.props;
    let autocompleteData = store.autocompleteData[store.selectedSemester] || [];

    return (
      <div>
        {store.courses.map((course, i) => {
          return (
            <CourseItem
              key={i}
              index={i}
              name={course}
              backgroundColor={getColor(i)}
              autocompleteData={autocompleteData}
              store={store}
              style={{
                minWidth: '420px'
              }}
              title={
                <AutoCompleteField 
                  autocompleteData={autocompleteData}
                  id={`courseEntry${i}`}
                  maxSearchResults={10}
                  menuCloseDelay={100}
                  onChange={(text) => store.updateCourse(i, text)}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  tabIndex={i + 1}
                  underlineFocusStyle={{
                    borderColor: getLineColor(i)
                  }}
                  placeholder="Enter or search for a course..."
                  value={name}
                  menuStyle={{
                    width: '512px'
                  }}
                  listStyle={{
                    width: '512px'
                  }}
                  inputStyle={{
                    fontWeight: 'normal',
                    color: 'white'
                  }}
                />
              }
            >
              <ClassList
                course={course}
                courseIndex={i}
                store={store}
                onCheckboxCheck={(selected, index, classData) => {
                  store.selectClass(selected, index, classData);
                }}
              />
            </CourseItem>
          )
        })}
      </div>
    )
  }
}

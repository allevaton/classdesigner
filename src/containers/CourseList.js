import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';

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
              tabIndex={i + 1}
              onChange={(text) => store.updateCourse(i, text)}
              autocompleteData={autocompleteData}
              store={store}
              style={{
                minWidth: '420px'
              }}
            />
          )
        })}
      </div>
    )
  }
}

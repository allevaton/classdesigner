import React, { PropTypes, Component } from 'react';
import { observer } from 'mobx-react';

import { TextField } from 'material-ui';

@observer
export default class Test extends Component {
  render() {
    let {store} = this.props;

    return (
      <div>
        {store.courses.map((course, i) => {
          return (
            <div>
              <TextField
                key={`course${i}`}
                value={course}
                onChange={(e) => store.updateCourse(i, course)}/>
            </div>
          )
        })}
      </div>
    );
  }
}

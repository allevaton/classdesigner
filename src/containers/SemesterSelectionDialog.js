import React, {Component, PropTypes} from "react";
import {observer} from 'mobx-react';

import Dialog from 'material-ui/Dialog';
import SemesterSelector from '../components/SemesterSelector';

@observer
export default class SemesterSelectionDialog extends Component {
  render() {
    let {store} = this.props;
    return (
      <Dialog
        title="Select a semester"
        open={store.dialog['semesterSelection'].open}
      >
        Select the semester you want to create a schedule for:<br/>
        <SemesterSelector
          options={store.semesterOptions}
          selected={store.selectedSemester || 'default'}
          onChange={(e, key, value) => {
            store.changeSemester(value);
            store.closeDialog('semesterSelection');
          }}
          dropDownProps={{
            autoWidth: false,
            labelStyle: {
              color: 'black'
            }
          }}
          style={{
            width: '95%'
          }}
          defaultText="Click here to select a semester"
        />
      </Dialog>
    )
  }
}

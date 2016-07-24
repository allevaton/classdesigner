import React, {Component, PropTypes} from "react";
import {observer} from 'mobx-react';

import Dialog from 'material-ui/Dialog';
import {saveAs} from 'file-saver';
import calendarExport from '../util/calendarExport'

@observer
export default class ExportDialog extends Component {
  render() {
    let {store} = this.props;

    return (
      <Dialog
        title="Export as..."
        open={store.dialog.exportDialog.open}
        modal={false}
        onRequestClose={() => store.closeDialog('exportDialog')}
      >
        <h2>Your Schedule is Being Downloaded</h2>
        <a
          href="#"
          onClick={() => {
            calendarExport(store.selectedClasses, store.selectedSemester)
              .then(blob => {
                saveAs(blob, "My Class Schedule.ics");
              });
          }}
        >
          Click here to save your class schedule
        </a>
      </Dialog>
    )
  }
}

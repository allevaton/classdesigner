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
        title="Export"
        open={store.dialog.exportDialog.open}
        modal={false}
        onRequestClose={() => store.closeDialog('exportDialog')}
        autoScrollBodyContent={true}
      >
        <h3>Your Schedule is Being Downloaded</h3>
        <h2>How to use with Google Calendar</h2>
        <p>Importing a calendar into a new calendar in Google Calendar may seem tricky
        at first, but with these simple images, you can probably figure it out.</p>
        <p>First, create a new calendar</p>
        <img src="../images/tutorial_create.png"/>
        <hr />
        <img src="../images/tutorial_create2.png"/>
        <p>Next, you'll want to import the calendar file you just downloaded. Google Calendar
        will allow you to import this file into the new calendar you just created. You can find the
        import option here.</p>
        <img src="../images/tutorial_import.png"/>
        <p>In this dialog, it will present you with a list of your available calendars. Be sure
        to select the correct calendar and upload the calendar file.</p>
        <img src="../images/tutorial_import2.png"/>
        <p>Your new calendar should be filled with your semester's class schedule. Good luck!</p>
      </Dialog>
    )
  }
}

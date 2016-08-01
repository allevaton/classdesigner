import React, {Component, PropTypes} from "react";
import {observer} from 'mobx-react';

import Dialog from 'material-ui/Dialog';

import {
  Table,
  TableBody,
  TableFooter,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

@observer
export default class CRNDialog extends Component {
  render() {
    let {store} = this.props;

    let crns = [];
    if (store.dialog.crnDialog.open)
      crns = store.crnsAndTitle;
    let crnTable;
    
    if (crns.length > 0)
      crnTable = crns.map(crn => {
        return <td style={{border: '1px solid lightgray', padding: '2px 4px 2px 4px'}} title={crn.title}>{crn.crn}</td>
      });
    else
      crnTable = <td><b>Please select classes to get CRNs!</b></td>

    return (
      <Dialog
        title="Here Are Your Course Registration Numbers"
        open={store.dialog.crnDialog.open}
        modal={false}
        onRequestClose={() => store.closeDialog('crnDialog')}
      >
        {crns.length > 0 && <p style={{marginTop: 0}}>
          You can hover over each CRN to find out which class it is.
          <br />
          Use these numbers to register for classes.
          <br />
          <br />
          Talk to your advisor about CRNs if you are confused.
          <br />
          <hr/>
          </p>
        }
        <table style={{borderCollapse: 'collapse'}}>
          <tbody>
          <tr>
            {crnTable}
          </tr>
          </tbody>
        </table>
      </Dialog>
    )
  }
}


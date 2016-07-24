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
    console.log(crns);

    return (
      <Dialog
        title="Here Are Your CRNs"
        open={store.dialog.crnDialog.open}
        modal={false}
        onRequestClose={() => store.closeDialog('crnDialog')}
      >
        <Table
          height={250}
        >
          <TableHeader
            displaySelectAll={false}
            adjustForCheckbox={false}
            style={{
              borderBottom: 'none'
            }}
          >
            <TableRow>
              {crns.map(crn => {
                return <TableHeaderColumn
                  tooltip={crn.title}
                  style={{
                    color: 'black'
                  }}
                >
                  {crn.crn}
                </TableHeaderColumn>
              })}
            </TableRow>
          </TableHeader>
        </Table>
      </Dialog>
    )
  }
}

